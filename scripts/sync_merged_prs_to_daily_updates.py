#!/usr/bin/env python3
from __future__ import annotations

import argparse
import datetime as dt
import json
import os
import re
import ssl
import sys
from pathlib import Path
from typing import Any
import urllib.parse
import urllib.request

try:
    import certifi  # type: ignore
except Exception:  # pragma: no cover
    certifi = None


GITHUB_API = "https://api.github.com"
OPENAI_DEFAULT_BASE_URL = "https://api.acedata.cloud"


def _normalize_base_url(value: str) -> str:
    value = value.strip().rstrip("/")
    if not value:
        return OPENAI_DEFAULT_BASE_URL
    if value.startswith("http://") or value.startswith("https://"):
        return value
    return f"https://{value}"


def _env_or_default(name: str, default: str) -> str:
    value = os.environ.get(name)
    if value is None:
        return default
    value = value.strip()
    return value if value else default


def _log(verbose: bool, message: str) -> None:
    if verbose:
        print(message, file=sys.stderr)


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

def _ssl_context() -> ssl.SSLContext:
    try:
        if certifi is not None:
            return ssl.create_default_context(cafile=certifi.where())
    except Exception:
        pass
    return ssl.create_default_context()


_URL_CONTEXT = _ssl_context()


def _github_get(
    url: str,
    token: str | None,
    *,
    accept: str = "application/vnd.github+json",
) -> tuple[dict, dict]:
    headers = {
        "Accept": accept,
        "User-Agent": "AceDataCloud-Roadmap-PR-Sync",
    }
    if token:
        headers["Authorization"] = f"Bearer {token}"

    req = urllib.request.Request(url, headers=headers, method="GET")
    try:
        with urllib.request.urlopen(req, timeout=30, context=_URL_CONTEXT) as resp:
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
        with urllib.request.urlopen(req, timeout=30, context=_URL_CONTEXT) as resp:
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


def _load_state(state_path: str, bootstrap_days: int) -> tuple[dt.datetime, dt.datetime]:
    """
    Returns (last_pr_sync, last_commit_sync).

    Backwards compatible with the old single cursor `last_sync`.
    """
    fallback = _utc_now() - dt.timedelta(days=bootstrap_days)
    if not os.path.exists(state_path):
        return fallback, fallback
    state = _read_json(state_path)
    last_sync_raw = state.get("last_sync")
    last_pr_raw = state.get("last_pr_sync") or last_sync_raw
    last_commit_raw = state.get("last_commit_sync") or last_sync_raw
    last_pr = _parse_iso_datetime(str(last_pr_raw)) if last_pr_raw else fallback
    last_commit = _parse_iso_datetime(str(last_commit_raw)) if last_commit_raw else fallback
    return last_pr, last_commit


def _save_state(
    state_path: str,
    *,
    last_pr_sync: dt.datetime,
    last_commit_sync: dt.datetime,
    last_run_at: dt.datetime,
    added_urls: list[str],
    openai_enabled: bool,
    openai_model: str | None,
    openai_base_url: str | None,
) -> None:
    last_sync = max(last_pr_sync, last_commit_sync)
    _write_json(
        state_path,
        {
            "last_sync": last_sync.astimezone(dt.timezone.utc).isoformat().replace("+00:00", "Z"),
            "last_pr_sync": last_pr_sync.astimezone(dt.timezone.utc).isoformat().replace("+00:00", "Z"),
            "last_commit_sync": last_commit_sync.astimezone(dt.timezone.utc).isoformat().replace("+00:00", "Z"),
            "last_run_at": last_run_at.astimezone(dt.timezone.utc).isoformat().replace("+00:00", "Z"),
            "last_added_urls": added_urls[:50],
            "openai": {
                "enabled": bool(openai_enabled),
                "model": openai_model,
                "base_url": openai_base_url,
            },
        },
    )


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


def _search_commits(
    *,
    org: str,
    since_date: str,
    token: str | None,
    max_items: int,
) -> list[dict]:
    items: list[dict] = []
    page = 1
    per_page = 100

    query = f"org:{org} committer-date:>={since_date}"
    while len(items) < max_items:
        params = {
            "q": query,
            "sort": "committer-date",
            "order": "desc",
            "per_page": str(per_page),
            "page": str(page),
        }
        url = f"{GITHUB_API}/search/commits?{urllib.parse.urlencode(params)}"
        payload, _headers = _github_get(url, token, accept="application/vnd.github.cloak-preview+json")
        page_items = payload.get("items") if isinstance(payload, dict) else None
        if not isinstance(page_items, list) or not page_items:
            break

        for it in page_items:
            if isinstance(it, dict):
                items.append(it)
        if len(page_items) < per_page:
            break
        page += 1

    return items[:max_items]


def _github_list(url: str, token: str | None, *, max_items: int = 5000) -> list[dict]:
    items: list[dict] = []
    page = 1
    per_page = 100

    while len(items) < max_items:
        sep = "&" if "?" in url else "?"
        page_url = f"{url}{sep}per_page={per_page}&page={page}"
        payload, _headers = _github_get(page_url, token)
        if not isinstance(payload, list) or not payload:
            break
        for it in payload:
            if isinstance(it, dict):
                items.append(it)
                if len(items) >= max_items:
                    break
        if len(payload) < per_page:
            break
        page += 1

    return items


def _github_get_allowed_logins(*, org: str, token: str | None, verbose: bool) -> set[str]:
    allowed: set[str] = set()

    try:
        members = _github_list(f"{GITHUB_API}/orgs/{org}/members", token)
        allowed |= {str(u.get("login") or "").strip().lower() for u in members if u.get("login")}
        _log(verbose, f"authors: org_members={len(allowed)}")
    except Exception as e:
        _log(verbose, f"authors: failed to list org members: {e}")

    try:
        outside = _github_list(f"{GITHUB_API}/orgs/{org}/outside_collaborators", token)
        outside_logins = {str(u.get("login") or "").strip().lower() for u in outside if u.get("login")}
        allowed |= outside_logins
        _log(verbose, f"authors: outside_collaborators={len(outside_logins)}")
    except Exception as e:
        _log(verbose, f"authors: outside_collaborators unavailable: {e}")

    allowed.discard("")
    return allowed


def _is_merge_commit(commit_item: dict) -> bool:
    parents = commit_item.get("parents")
    if isinstance(parents, list) and len(parents) > 1:
        return True
    commit = commit_item.get("commit")
    if isinstance(commit, dict):
        message = str(commit.get("message") or "")
        first = message.splitlines()[0].strip() if message else ""
        if first.startswith("Merge pull request #") or first.startswith("Merge branch"):
            return True
    return False

_DAY_RE = re.compile(r"^\d{4}-\d{2}-\d{2}$")


def _is_day(value: str) -> bool:
    return bool(_DAY_RE.match(value.strip()))


def _coerce_daily_updates_index(doc: dict) -> dict:
    if not isinstance(doc, dict):
        raise ValueError("daily-updates index must be a JSON object")

    title = doc.get("title")
    subtitle = doc.get("subtitle")
    days = doc.get("days")

    if not isinstance(title, str) or not title.strip():
        raise ValueError('daily-updates index must include a non-empty string field "title"')
    if not isinstance(subtitle, str):
        raise ValueError('daily-updates index must include a string field "subtitle"')
    if not isinstance(days, list):
        raise ValueError('daily-updates index must include an array field "days"')

    norm_days: list[str] = []
    seen: set[str] = set()
    for d in days:
        if not isinstance(d, str):
            continue
        d = d.strip()
        if not d or not _is_day(d):
            continue
        if d in seen:
            continue
        seen.add(d)
        norm_days.append(d)

    doc["days"] = sorted(norm_days, reverse=True)
    doc.setdefault("initial_open_days", 3)
    doc.setdefault("page_size_days", 20)
    doc.setdefault("$schema", "./index.schema.json")
    return doc


def _coerce_daily_day(doc: dict, *, day: str) -> list[dict]:
    if not isinstance(doc, dict):
        raise ValueError(f"{day}.json must be a JSON object")
    items = doc.get("items")
    if not isinstance(items, list):
        raise ValueError(f'{day}.json must include an array field "items"')
    out: list[dict] = []
    for it in items:
        if not isinstance(it, dict):
            continue
        url = str(it.get("url") or "").strip()
        title = str(it.get("title") or "").strip()
        if not url or not title:
            continue
        out.append(it)
    return out


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
        with urllib.request.urlopen(req, timeout=60, context=_URL_CONTEXT) as resp:
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
        description="Sync merged PRs + recent commits in an org into config/daily-updates/<YYYY-MM-DD>.json files",
    )
    parser.add_argument("--org", default="AceDataCloud")
    parser.add_argument("--daily-updates", default=str(repo_root / "config" / "daily-updates" / "index.json"))
    parser.add_argument("--state", default=str(repo_root / "config" / "pr-sync-state.json"))
    parser.add_argument("--token-env", default="REPO_PAT")
    parser.add_argument(
        "--exclude-repo",
        action="append",
        default=["Roadmap"],
        help="Exclude a repo (repeatable). Defaults to Roadmap to avoid self-referential commit loops.",
    )
    parser.add_argument("--bootstrap-days", type=int, default=14)
    parser.add_argument("--max-items", type=int, default=200)
    parser.add_argument("--max-new", type=int, default=30, help="Max new PR items to add per run")
    parser.add_argument("--max-new-commits", type=int, default=30, help="Max new commit items to add per run")
    parser.add_argument(
        "--author-filter",
        choices=["org", "none"],
        default="org",
        help='When "org", only include items authored by org members/outside collaborators',
    )
    parser.add_argument("--include-commits", action=argparse.BooleanOptionalAction, default=True)
    parser.add_argument("--dry-run", action="store_true")
    parser.add_argument("--verbose", action="store_true")
    parser.add_argument("--openai-api-key-env", default="ACEDATACLOUD_OPENAI_KEY")
    parser.add_argument("--openai-base-url", default=_env_or_default("OPENAI_BASE_URL", OPENAI_DEFAULT_BASE_URL))
    parser.add_argument("--openai-model", default=_env_or_default("OPENAI_MODEL", "gpt-4o-mini"))
    parser.add_argument("--openai-max-tokens", type=int, default=260)
    args = parser.parse_args(argv)

    token = os.environ.get(args.token_env) or os.environ.get("GITHUB_TOKEN") or os.environ.get("GH_TOKEN")
    openai_api_key = os.environ.get(args.openai_api_key_env)
    openai_base_url = _normalize_base_url(str(args.openai_base_url))
    openai_model = str(args.openai_model or "").strip() or "gpt-4o-mini"
    verbose = bool(args.verbose)
    run_at = _utc_now()
    excluded_repos = {str(r or "").strip().lower() for r in (args.exclude_repo or []) if str(r or "").strip()}

    _log(
        verbose,
        (
            "sync:"
            f" org={args.org}"
            f" max_items={args.max_items}"
            f" max_new_prs={args.max_new}"
            f" max_new_commits={args.max_new_commits}"
            f" include_commits={bool(args.include_commits)}"
            f" author_filter={args.author_filter}"
            f" dry_run={args.dry_run}"
        ),
    )
    _log(verbose, f"sync: state={args.state}")
    _log(verbose, f"sync: daily_updates={args.daily_updates}")
    _log(
        verbose,
        f"sync: openai_enabled={bool(openai_api_key)} model={openai_model} base_url={openai_base_url}",
    )

    allowed_logins: set[str] = set()
    if args.author_filter == "org":
        allowed_logins = _github_get_allowed_logins(org=args.org, token=token, verbose=verbose)
        _log(verbose, f"authors: allowed_total={len(allowed_logins)}")

    daily_index_path = Path(args.daily_updates)
    daily_dir = daily_index_path.parent
    daily_dir.mkdir(parents=True, exist_ok=True)

    daily_index: dict[str, Any]
    if daily_index_path.exists():
        daily_index = _read_json(str(daily_index_path))
    else:
        legacy = daily_dir.parent / "daily-updates.json"
        if legacy.exists():
            legacy_doc = _read_json(str(legacy))
            legacy_items = legacy_doc.get("items") if isinstance(legacy_doc, dict) else None
            if isinstance(legacy_items, list):
                by_day: dict[str, list[dict]] = {}
                for it in legacy_items:
                    if not isinstance(it, dict):
                        continue
                    day = str(it.get("date") or "").strip()
                    if not day or not _is_day(day):
                        continue
                    item = dict(it)
                    item.pop("date", None)
                    by_day.setdefault(day, []).append(item)

                for day, items in by_day.items():
                    if not args.dry_run:
                        _write_json(
                            str(daily_dir / f"{day}.json"),
                            {"$schema": "./day.schema.json", "date": day, "items": items},
                        )

                daily_index = {
                    "$schema": "./index.schema.json",
                    "title": str(legacy_doc.get("title") or "Daily Updates"),
                    "subtitle": str(legacy_doc.get("subtitle") or ""),
                    "initial_open_days": 3,
                    "page_size_days": 20,
                    "days": sorted(by_day.keys(), reverse=True),
                }
                if not args.dry_run:
                    try:
                        legacy.unlink()
                    except Exception as e:
                        _log(verbose, f"warn: failed to delete legacy {legacy}: {e}")
            else:
                daily_index = {
                    "$schema": "./index.schema.json",
                    "title": "Daily Updates",
                    "subtitle": "",
                    "initial_open_days": 3,
                    "page_size_days": 20,
                    "days": [],
                }
        else:
            daily_index = {
                "$schema": "./index.schema.json",
                "title": "Daily Updates",
                "subtitle": "",
                "initial_open_days": 3,
                "page_size_days": 20,
                "days": [],
            }

    daily_index = _coerce_daily_updates_index(daily_index)

    days: list[str] = list(daily_index.get("days") or [])
    daily_by_day: dict[str, list[dict]] = {}
    existing_urls: set[str] = set()

    # Discover day files even if index is missing entries.
    for p in daily_dir.glob("*.json"):
        day = p.stem
        if _is_day(day) and day not in days:
            days.append(day)

    days = sorted(set(days), reverse=True)
    daily_index["days"] = days

    for day in days:
        day_path = daily_dir / f"{day}.json"
        if not day_path.exists():
            daily_by_day[day] = []
            continue
        try:
            doc = _read_json(str(day_path))
            items = _coerce_daily_day(doc, day=day)
        except Exception as e:
            _log(verbose, f"warn: failed to load {day_path}: {e}")
            items = []
        daily_by_day[day] = items
        for it in items:
            url = str(it.get("url") or "").strip()
            if url:
                existing_urls.add(url)
    last_pr_sync, last_commit_sync = _load_state(args.state, args.bootstrap_days)

    # Search query only supports date granularity; subtract 1 day for safety.
    pr_since_date = (last_pr_sync - dt.timedelta(days=1)).date().isoformat()
    commit_since_date = (last_commit_sync - dt.timedelta(days=1)).date().isoformat()
    _log(
        verbose,
        (
            f"sync: last_pr_sync={last_pr_sync.isoformat()} pr_since_date={pr_since_date} "
            f"last_commit_sync={last_commit_sync.isoformat()} commit_since_date={commit_since_date} "
            f"existing_urls={len(existing_urls)}"
        ),
    )

    raw_prs = _search_merged_prs(org=args.org, since_date=pr_since_date, token=token, max_items=args.max_items)
    _log(verbose, f"sync: github_pr_search_results={len(raw_prs)}")

    raw_commits: list[dict] = []
    if args.include_commits:
        raw_commits = _search_commits(org=args.org, since_date=commit_since_date, token=token, max_items=args.max_items)
        _log(verbose, f"sync: github_commit_search_results={len(raw_commits)}")

    new_items: list[tuple[dt.datetime, str, dict]] = []
    max_seen_pr_sync = last_pr_sync
    max_seen_commit_sync = last_commit_sync
    new_prs_added = 0
    new_commits_added = 0

    for it in raw_prs:
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
        if repo.lower() in excluded_repos:
            _log(verbose, f"skip: pr {repo}#{number} reason=repo_excluded url={html_url}")
            continue

        if new_prs_added >= args.max_new:
            break

        pr = _github_get_pr(org=args.org, repo=repo, number=number, token=token)
        merged_at_raw = pr.get("merged_at")
        if not merged_at_raw:
            continue
        merged_at = _parse_iso_datetime(str(merged_at_raw))
        if merged_at <= last_pr_sync:
            continue

        author_login = None
        user = pr.get("user")
        if isinstance(user, dict):
            author_login = str(user.get("login") or "").strip()
        if args.author_filter == "org":
            if not author_login:
                _log(verbose, f"skip: pr {repo}#{number} reason=no_author_login url={html_url}")
                continue
            if author_login.lower() not in allowed_logins:
                _log(
                    verbose,
                    f"skip: pr {repo}#{number} reason=author_not_allowed author={author_login} url={html_url}",
                )
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
                _log(verbose, f"openai: summarizing {repo}#{number} files={digest.get('files_count')}")
                pretty_title, summary, extra_tags = _summarize_pr_with_openai(
                    api_key=openai_api_key,
                    base_url=openai_base_url,
                    model=openai_model,
                    org=args.org,
                    repo=repo,
                    number=number,
                    pr_title=title,
                    pr_body=body,
                    digest=digest,
                    max_tokens=int(args.openai_max_tokens),
                )
                if pretty_title or summary:
                    _log(
                        verbose,
                        f"openai: result {repo}#{number} title={repr(pretty_title)} summary_len={len(summary or '')}",
                    )
            except Exception as e:
                print(f"OpenAI summarization failed for {repo}#{number}: {e}", file=sys.stderr)

        day = merged_at.date().isoformat()
        item: dict[str, Any] = {
            "title": pretty_title or f"{repo}#{number}: {title}",
            "url": html_url,
            "tags": ["github", "pr", repo],
        }
        if summary:
            item["summary"] = summary
        if extra_tags:
            item["tags"] = list(dict.fromkeys([*item["tags"], *extra_tags]))

        new_items.append((merged_at, day, item))
        new_prs_added += 1
        if merged_at > max_seen_pr_sync:
            max_seen_pr_sync = merged_at
        _log(
            verbose,
            f"add: pr {repo}#{number} author={author_login or 'unknown'} merged_at={merged_at.isoformat()} url={html_url}",
        )

    for it in raw_commits:
        if not isinstance(it, dict):
            continue

        if new_commits_added >= int(args.max_new_commits):
            break

        html_url = str(it.get("html_url") or "").strip()
        if not html_url or html_url in existing_urls:
            continue

        repo_info = it.get("repository")
        if not isinstance(repo_info, dict):
            continue
        full_name = str(repo_info.get("full_name") or "").strip()
        if not full_name or "/" not in full_name:
            continue
        owner, repo = full_name.split("/", 1)
        if owner.lower() != args.org.lower():
            continue
        if repo.lower() in excluded_repos:
            _log(verbose, f"skip: commit {repo}@{str(it.get('sha') or '')[:7]} reason=repo_excluded url={html_url}")
            continue

        sha = str(it.get("sha") or "").strip()
        if not sha:
            continue

        commit = it.get("commit")
        if not isinstance(commit, dict):
            continue
        committer = commit.get("committer")
        if not isinstance(committer, dict):
            continue

        committed_at_raw = committer.get("date")
        if not committed_at_raw:
            continue
        committed_at = _parse_iso_datetime(str(committed_at_raw))
        if committed_at <= last_commit_sync:
            continue

        if _is_merge_commit(it):
            _log(verbose, f"skip: commit {repo}@{sha[:7]} reason=merge_commit url={html_url}")
            continue

        author_login = None
        author = it.get("author")
        if isinstance(author, dict):
            author_login = str(author.get("login") or "").strip()
        if not author_login:
            committer_user = it.get("committer")
            if isinstance(committer_user, dict):
                author_login = str(committer_user.get("login") or "").strip()

        if args.author_filter == "org":
            if not author_login:
                _log(verbose, f"skip: commit {repo}@{sha[:7]} reason=no_author_login url={html_url}")
                continue
            if author_login.lower() not in allowed_logins:
                _log(
                    verbose,
                    f"skip: commit {repo}@{sha[:7]} reason=author_not_allowed author={author_login} url={html_url}",
                )
                continue

        message = str(commit.get("message") or "").strip()
        subject = message.splitlines()[0].strip() if message else ""
        if not subject:
            continue

        day = committed_at.date().isoformat()
        item: dict[str, Any] = {
            "title": f"{repo}@{sha[:7]}: {subject}",
            "url": html_url,
            "tags": ["github", "commit", repo],
        }
        new_items.append((committed_at, day, item))
        new_commits_added += 1
        if committed_at > max_seen_commit_sync:
            max_seen_commit_sync = committed_at
        _log(
            verbose,
            (
                f"add: commit {repo}@{sha[:7]} author={author_login or 'unknown'} "
                f"committed_at={committed_at.isoformat()} url={html_url}"
            ),
        )

    def _index_doc(index: dict[str, Any], *, days: list[str]) -> dict[str, Any]:
        return {
            "$schema": str(index.get("$schema") or "./index.schema.json"),
            "title": str(index.get("title") or "Daily Updates"),
            "subtitle": str(index.get("subtitle") or ""),
            "initial_open_days": int(index.get("initial_open_days") or 3),
            "page_size_days": int(index.get("page_size_days") or 20),
            "days": days,
        }

    def _day_doc(day: str, items: list[dict[str, Any]]) -> dict[str, Any]:
        return {
            "$schema": "./day.schema.json",
            "date": day,
            "items": items,
        }

    touched_days: set[str] = set()
    added_urls: list[str] = []

    if new_items:
        new_items.sort(key=lambda x: x[0], reverse=True)

        new_by_day: dict[str, list[tuple[dt.datetime, dict[str, Any]]]] = {}
        for timestamp, day, item in new_items:
            new_by_day.setdefault(day, []).append((timestamp, item))

        for day, items_with_ts in new_by_day.items():
            items_with_ts.sort(key=lambda x: x[0], reverse=True)
            inserts: list[dict[str, Any]] = []
            for _ts, item in items_with_ts:
                url = str(item.get("url") or "").strip()
                if not url or url in existing_urls:
                    continue
                inserts.append(item)
                existing_urls.add(url)
                added_urls.append(url)

            if not inserts:
                continue

            existing = daily_by_day.get(day, [])
            inserted_urls = {str(it.get("url") or "").strip() for it in inserts}
            existing_filtered = [it for it in existing if str(it.get("url") or "").strip() not in inserted_urls]
            daily_by_day[day] = inserts + existing_filtered
            touched_days.add(day)

    # Ensure the index lists only day files that exist (plus any newly touched days).
    existing_day_files = {p.stem for p in daily_dir.glob("*.json") if _is_day(p.stem)}
    index_days = sorted(existing_day_files | touched_days, reverse=True)
    daily_index_out = _index_doc(daily_index, days=index_days)

    if args.dry_run:
        if new_items:
            print(
                "Would add"
                f" {len(added_urls)} items (prs={new_prs_added}, commits={new_commits_added})."
                f" last_pr_sync stays {last_pr_sync.isoformat()} last_commit_sync stays {last_commit_sync.isoformat()}"
            )
        else:
            print("No new items found (PRs/commits).")
        return 0

    # Persist day files first (so index always references existing files).
    for day in sorted(touched_days, reverse=True):
        items = daily_by_day.get(day, [])
        _write_json(str(daily_dir / f"{day}.json"), _day_doc(day, items))

    # Refresh day files after writes and persist the index.
    day_files_after = {p.stem for p in daily_dir.glob("*.json") if _is_day(p.stem)}
    _write_json(str(daily_index_path), _index_doc(daily_index, days=sorted(day_files_after, reverse=True)))

    # Persist sync state.
    if not new_items:
        _save_state(
            args.state,
            last_pr_sync=last_pr_sync,
            last_commit_sync=last_commit_sync,
            last_run_at=run_at,
            added_urls=[],
            openai_enabled=bool(openai_api_key),
            openai_model=openai_model if openai_api_key else None,
            openai_base_url=openai_base_url if openai_api_key else None,
        )
        print("No new items found (PRs/commits).")
        return 0

    _save_state(
        args.state,
        last_pr_sync=max_seen_pr_sync,
        last_commit_sync=max_seen_commit_sync,
        last_run_at=run_at,
        added_urls=added_urls,
        openai_enabled=bool(openai_api_key),
        openai_model=openai_model if openai_api_key else None,
        openai_base_url=openai_base_url if openai_api_key else None,
    )
    print(
        "Added"
        f" {len(added_urls)} items (prs={new_prs_added}, commits={new_commits_added})."
        f" Updated last_pr_sync={max_seen_pr_sync.isoformat()} last_commit_sync={max_seen_commit_sync.isoformat()}"
    )
    return 0


if __name__ == "__main__":
    raise SystemExit(main(sys.argv[1:]))
