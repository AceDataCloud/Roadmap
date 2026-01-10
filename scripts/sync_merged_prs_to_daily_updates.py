#!/usr/bin/env python3
from __future__ import annotations

import argparse
import datetime as dt
import json
import os
import re
import sys
from pathlib import Path
from typing import Any
import urllib.parse
import urllib.request


GITHUB_API = "https://api.github.com"
OPENAI_DEFAULT_BASE_URL = "https://api.acedata.cloud"


def _normalize_base_url(value: str) -> str:
    value = value.strip().rstrip("/")
    if not value:
        return OPENAI_DEFAULT_BASE_URL
    if value.startswith("http://") or value.startswith("https://"):
        return value
    return f"https://{value}"


def _parse_iso_datetime(value: str) -> dt.datetime:
    value = value.strip()
    if value.endswith("Z"):
        value = value[:-1] + "+00:00"
    parsed = dt.datetime.fromisoformat(value)
    if parsed.tzinfo is None:
        parsed = parsed.replace(tzinfo=dt.timezone.utc)
    return parsed.astimezone(dt.timezone.utc)


def _utc_now() -> dt.datetime:
    return dt.datetime.now(dt.timezone.utc)


def _read_json(path: str) -> dict:
    with open(path, "r", encoding="utf-8") as f:
        return json.load(f)


def _write_json(path: str, data: dict) -> None:
    with open(path, "w", encoding="utf-8") as f:
        json.dump(data, f, ensure_ascii=False, indent=2)
        f.write("\n")


def _github_get(url: str, token: str | None) -> tuple[dict, dict]:
    headers = {
        "Accept": "application/vnd.github+json",
        "User-Agent": "AceDataCloud-Roadmap-PR-Sync",
    }
    if token:
        headers["Authorization"] = f"Bearer {token}"

    req = urllib.request.Request(url, headers=headers, method="GET")
    try:
        with urllib.request.urlopen(req, timeout=30) as resp:
            body = resp.read().decode("utf-8")
            return json.loads(body), dict(resp.headers.items())
    except urllib.error.HTTPError as e:
        details = e.read().decode("utf-8", errors="replace") if hasattr(e, "read") else ""
        raise RuntimeError(f"GitHub API error {e.code} for {url}: {details}") from e


def _github_get_text(url: str, token: str | None, *, accept: str) -> tuple[str, dict]:
    headers = {
        "Accept": accept,
        "User-Agent": "AceDataCloud-Roadmap-PR-Sync",
    }
    if token:
        headers["Authorization"] = f"Bearer {token}"

    req = urllib.request.Request(url, headers=headers, method="GET")
    try:
        with urllib.request.urlopen(req, timeout=30) as resp:
            body = resp.read().decode("utf-8", errors="replace")
            return body, dict(resp.headers.items())
    except urllib.error.HTTPError as e:
        details = e.read().decode("utf-8", errors="replace") if hasattr(e, "read") else ""
        raise RuntimeError(f"GitHub API error {e.code} for {url}: {details}") from e


_PULL_URL_RE = re.compile(r"^https://github\.com/([^/]+)/([^/]+)/pull/(\d+)(?:/.*)?$")


def _parse_pull_url(html_url: str) -> tuple[str, str, int] | None:
    m = _PULL_URL_RE.match(html_url.strip())
    if not m:
        return None
    owner, repo, number = m.group(1), m.group(2), int(m.group(3))
    return owner, repo, number


def _load_last_sync(state_path: str, bootstrap_days: int) -> dt.datetime:
    if not os.path.exists(state_path):
        return _utc_now() - dt.timedelta(days=bootstrap_days)
    state = _read_json(state_path)
    last_sync = state.get("last_sync")
    if not last_sync:
        return _utc_now() - dt.timedelta(days=bootstrap_days)
    return _parse_iso_datetime(str(last_sync))


def _save_last_sync(state_path: str, last_sync: dt.datetime) -> None:
    _write_json(state_path, {"last_sync": last_sync.astimezone(dt.timezone.utc).isoformat().replace("+00:00", "Z")})


def _search_merged_prs(
    *,
    org: str,
    since_date: str,
    token: str | None,
    max_items: int,
) -> list[dict]:
    items: list[dict] = []
    page = 1
    per_page = 100

    query = f"org:{org} is:pr is:merged merged:>={since_date}"
    while len(items) < max_items:
        params = {
            "q": query,
            "sort": "updated",
            "order": "desc",
            "per_page": str(per_page),
            "page": str(page),
        }
        url = f"{GITHUB_API}/search/issues?{urllib.parse.urlencode(params)}"
        payload, _headers = _github_get(url, token)
        page_items = payload.get("items") or []
        if not page_items:
            break

        items.extend(page_items)
        if len(page_items) < per_page:
            break
        page += 1

    return items[:max_items]


def _coerce_daily_updates(doc: dict) -> list[dict]:
    if not isinstance(doc, dict):
        raise ValueError("daily-updates.json must be a JSON object")
    items = doc.get("items")
    if not isinstance(items, list):
        raise ValueError('daily-updates.json must include an array field "items"')
    return items


def _github_get_pr(
    *,
    org: str,
    repo: str,
    number: int,
    token: str | None,
) -> dict:
    url = f"{GITHUB_API}/repos/{org}/{repo}/pulls/{number}"
    pr, _headers = _github_get(url, token)
    if not isinstance(pr, dict):
        raise RuntimeError(f"Unexpected PR payload for {org}/{repo}#{number}")
    return pr


def _github_get_pr_files_digest(
    *,
    org: str,
    repo: str,
    number: int,
    token: str | None,
    max_files: int = 60,
    max_patch_chars: int = 12000,
) -> dict:
    page = 1
    per_page = 100
    files: list[dict[str, Any]] = []

    while len(files) < max_files:
        url = f"{GITHUB_API}/repos/{org}/{repo}/pulls/{number}/files?per_page={per_page}&page={page}"
        payload, _headers = _github_get(url, token)
        if not isinstance(payload, list) or not payload:
            break
        for f in payload:
            if isinstance(f, dict):
                files.append(f)
                if len(files) >= max_files:
                    break
        if len(payload) < per_page:
            break
        page += 1

    simplified: list[dict[str, Any]] = []
    patch_buf: list[str] = []
    for f in files:
        filename = str(f.get("filename") or "")
        status = str(f.get("status") or "")
        additions = int(f.get("additions") or 0)
        deletions = int(f.get("deletions") or 0)
        changes = int(f.get("changes") or 0)
        simplified.append(
            {
                "filename": filename,
                "status": status,
                "additions": additions,
                "deletions": deletions,
                "changes": changes,
            }
        )

        patch = f.get("patch")
        if isinstance(patch, str) and patch.strip():
            snippet = patch.strip()
            if len(snippet) > 900:
                snippet = snippet[:900] + "\n…(truncated)…"
            patch_buf.append(f"--- {filename} ({status}, +{additions}/-{deletions})\n{snippet}")

    patch_text = "\n\n".join(patch_buf)
    if len(patch_text) > max_patch_chars:
        patch_text = patch_text[:max_patch_chars] + "\n…(truncated)…"

    return {
        "files": simplified,
        "patch_excerpt": patch_text,
        "files_count": len(simplified),
    }


def _openai_chat_completions(
    *,
    api_key: str,
    base_url: str,
    model: str,
    messages: list[dict[str, str]],
    max_tokens: int,
) -> dict:
    url = f"{base_url.rstrip('/')}/v1/chat/completions"
    payload = {
        "model": model,
        "messages": messages,
        "temperature": 0.2,
        "max_tokens": max_tokens,
        "response_format": {"type": "json_object"},
    }
    data = json.dumps(payload).encode("utf-8")

    headers = {
        "Content-Type": "application/json",
        "Authorization": f"Bearer {api_key}",
        "User-Agent": "AceDataCloud-Roadmap-PR-Sync",
    }
    req = urllib.request.Request(url, data=data, headers=headers, method="POST")
    try:
        with urllib.request.urlopen(req, timeout=60) as resp:
            body = resp.read().decode("utf-8")
            parsed = json.loads(body)
            if not isinstance(parsed, dict):
                raise RuntimeError("OpenAI response is not an object")
            return parsed
    except urllib.error.HTTPError as e:
        details = e.read().decode("utf-8", errors="replace") if hasattr(e, "read") else ""
        raise RuntimeError(f"OpenAI API error {e.code}: {details}") from e


def _extract_openai_json(content: str) -> dict | None:
    content = content.strip()
    if not content:
        return None
    try:
        parsed = json.loads(content)
        return parsed if isinstance(parsed, dict) else None
    except Exception:
        pass
    m = re.search(r"\{.*\}", content, flags=re.DOTALL)
    if not m:
        return None
    try:
        parsed = json.loads(m.group(0))
        return parsed if isinstance(parsed, dict) else None
    except Exception:
        return None


def _summarize_pr_with_openai(
    *,
    api_key: str,
    base_url: str,
    model: str,
    org: str,
    repo: str,
    number: int,
    pr_title: str,
    pr_body: str,
    digest: dict,
    max_tokens: int,
) -> tuple[str | None, str | None, list[str]]:
    files = digest.get("files") or []
    patch_excerpt = str(digest.get("patch_excerpt") or "")

    user_payload = {
        "org": org,
        "repo": repo,
        "number": number,
        "title": pr_title,
        "body": pr_body,
        "files": files,
        "patch_excerpt": patch_excerpt,
    }

    messages = [
        {
            "role": "system",
            "content": (
                "You write formal, external-facing release notes for merged GitHub PRs.\n"
                "Return ONLY a JSON object with keys: title, summary, tags.\n"
                "- title: short, professional, <= 90 chars, no trailing period.\n"
                "- summary: 2-4 sentences, factual, avoid speculation; mention key changes and impact.\n"
                "- tags: 0-6 short lower-case tags; avoid duplicates.\n"
            ),
        },
        {
            "role": "user",
            "content": json.dumps(user_payload, ensure_ascii=False),
        },
    ]

    resp = _openai_chat_completions(
        api_key=api_key,
        base_url=base_url,
        model=model,
        messages=messages,
        max_tokens=max_tokens,
    )
    choices = resp.get("choices")
    if not isinstance(choices, list) or not choices:
        return None, None, []
    msg = choices[0].get("message") if isinstance(choices[0], dict) else None
    content = msg.get("content") if isinstance(msg, dict) else None
    if not isinstance(content, str):
        return None, None, []

    parsed = _extract_openai_json(content)
    if not parsed:
        return None, None, []

    out_title = parsed.get("title")
    out_summary = parsed.get("summary")
    out_tags = parsed.get("tags")

    title = str(out_title).strip() if isinstance(out_title, str) and out_title.strip() else None
    summary = str(out_summary).strip() if isinstance(out_summary, str) and out_summary.strip() else None
    tags: list[str] = []
    if isinstance(out_tags, list):
        for t in out_tags:
            if isinstance(t, str) and t.strip():
                tags.append(t.strip())
    tags = list(dict.fromkeys(tags))  # stable unique
    return title, summary, tags


def main(argv: list[str]) -> int:
    repo_root = Path(__file__).resolve().parents[1]
    parser = argparse.ArgumentParser(
        description="Sync merged PRs in an org into Roadmap/config/daily-updates.json",
    )
    parser.add_argument("--org", default="AceDataCloud")
    parser.add_argument("--daily-updates", default=str(repo_root / "config" / "daily-updates.json"))
    parser.add_argument("--state", default=str(repo_root / "config" / "pr-sync-state.json"))
    parser.add_argument("--token-env", default="REPO_PAT")
    parser.add_argument("--bootstrap-days", type=int, default=14)
    parser.add_argument("--max-items", type=int, default=200)
    parser.add_argument("--max-new", type=int, default=30, help="Max new PR items to add per run")
    parser.add_argument("--dry-run", action="store_true")
    parser.add_argument("--openai-api-key-env", default="ACEDATACLOUD_OPENAI_KEY")
    parser.add_argument("--openai-base-url", default=os.environ.get("OPENAI_BASE_URL", OPENAI_DEFAULT_BASE_URL))
    parser.add_argument("--openai-model", default=os.environ.get("OPENAI_MODEL", "gpt-4o-mini"))
    parser.add_argument("--openai-max-tokens", type=int, default=260)
    args = parser.parse_args(argv)

    token = os.environ.get(args.token_env) or os.environ.get("GITHUB_TOKEN") or os.environ.get("GH_TOKEN")
    openai_api_key = os.environ.get(args.openai_api_key_env)
    openai_base_url = _normalize_base_url(str(args.openai_base_url))

    daily = _read_json(args.daily_updates)
    daily_items = _coerce_daily_updates(daily)

    existing_urls = {str(it.get("url")).strip() for it in daily_items if isinstance(it, dict) and it.get("url")}
    last_sync = _load_last_sync(args.state, args.bootstrap_days)

    # Search query only supports date granularity; subtract 1 day for safety.
    since_date = (last_sync - dt.timedelta(days=1)).date().isoformat()

    raw = _search_merged_prs(org=args.org, since_date=since_date, token=token, max_items=args.max_items)

    new_items: list[tuple[dt.datetime, dict]] = []
    max_seen_sync = last_sync
    for it in raw:
        if not isinstance(it, dict):
            continue

        html_url = str(it.get("html_url") or "").strip()
        if not html_url or html_url in existing_urls:
            continue

        parsed = _parse_pull_url(html_url)
        if not parsed:
            continue
        owner, repo, number = parsed
        if owner.lower() != args.org.lower():
            continue

        if len(new_items) >= args.max_new:
            break

        pr = _github_get_pr(org=args.org, repo=repo, number=number, token=token)
        merged_at_raw = pr.get("merged_at")
        if not merged_at_raw:
            continue
        merged_at = _parse_iso_datetime(str(merged_at_raw))
        if merged_at <= last_sync:
            continue

        title = str(pr.get("title") or "").strip()
        if not title:
            continue

        body = str(pr.get("body") or "").strip()
        digest = _github_get_pr_files_digest(org=args.org, repo=repo, number=number, token=token)

        pretty_title: str | None = None
        summary: str | None = None
        extra_tags: list[str] = []
        if openai_api_key:
            try:
                pretty_title, summary, extra_tags = _summarize_pr_with_openai(
                    api_key=openai_api_key,
                    base_url=openai_base_url,
                    model=str(args.openai_model),
                    org=args.org,
                    repo=repo,
                    number=number,
                    pr_title=title,
                    pr_body=body,
                    digest=digest,
                    max_tokens=int(args.openai_max_tokens),
                )
            except Exception as e:
                print(f"OpenAI summarization failed for {repo}#{number}: {e}", file=sys.stderr)

        item: dict[str, Any] = {
            "date": merged_at.date().isoformat(),
            "title": pretty_title or f"{repo}#{number}: {title}",
            "url": html_url,
            "tags": ["github", "pr", repo],
        }
        if summary:
            item["summary"] = summary
        if extra_tags:
            item["tags"] = list(dict.fromkeys([*item["tags"], *extra_tags]))

        new_items.append((merged_at, item))
        if merged_at > max_seen_sync:
            max_seen_sync = merged_at

    if not new_items:
        print("No new merged PRs found.")
        if not args.dry_run:
            _save_last_sync(args.state, last_sync)
        return 0

    new_items.sort(key=lambda x: x[0], reverse=True)
    for _merged_at, item in new_items:
        daily_items.insert(0, item)
        existing_urls.add(item["url"])

    # Normalize ordering by date desc (stable inside same date).
    daily_items.sort(key=lambda it: (str(it.get("date") or ""), str(it.get("url") or "")), reverse=True)

    if args.dry_run:
        print(f"Would add {len(new_items)} items. last_sync stays {last_sync.isoformat()}")
        return 0

    _write_json(args.daily_updates, daily)
    _save_last_sync(args.state, max_seen_sync)
    print(f"Added {len(new_items)} items. Updated last_sync to {max_seen_sync.isoformat()}")
    return 0


if __name__ == "__main__":
    raise SystemExit(main(sys.argv[1:]))
