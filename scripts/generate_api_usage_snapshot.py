#!/usr/bin/env python3
"""
Generate API Usage Snapshot for Roadmap

Queries Tencent Cloud CLS api-usages topic to produce aggregated API call
statistics for the last 7 / 30 / 90 days.  Outputs a JSON file consumed
by the Roadmap static page.

Environment variables (or PlatformBackend/.env):
  TENCENT_CLOUD_SECRET_ID   — CLS access key
  TENCENT_CLOUD_SECRET_KEY  — CLS secret key

Usage:
  python3 scripts/generate_api_usage_snapshot.py [--output config/api_usage.json]
"""

import argparse
import json
import os
import sys
from datetime import datetime, timedelta, timezone
from pathlib import Path


# ── helpers ──────────────────────────────────────────────────────────────────

def _default_output_path() -> Path:
    root = Path(__file__).resolve().parent.parent
    return root / "config" / "api_usage.json"


def _atomic_write_json(path: Path, payload: dict) -> None:
    path.parent.mkdir(parents=True, exist_ok=True)
    tmp = path.with_suffix(path.suffix + ".tmp")
    tmp.write_text(
        json.dumps(payload, ensure_ascii=False, indent=2) + "\n", encoding="utf-8"
    )
    tmp.replace(path)


def _load_env(path: str) -> None:
    """Minimal .env loader — no external dependency."""
    if not os.path.isfile(path):
        return
    with open(path) as f:
        for line in f:
            line = line.strip()
            if not line or line.startswith("#") or "=" not in line:
                continue
            key, _, value = line.partition("=")
            key = key.strip()
            value = value.strip().strip("'\"")
            if key not in os.environ:
                os.environ[key] = value


# ── CLS query ───────────────────────────────────────────────────────────────

TOPIC_ID = "fbb6d4ce-4c55-418a-87e0-f6e15815b3a9"  # api-usages
CLS_REGION = "ap-hongkong"

# SQL for total call count
_SQL_TOTAL = "* | SELECT count(*) as total"

# SQL for unique user count
_SQL_USERS = "* | SELECT count(DISTINCT user_id) as users"

# SQL for distinct API count
_SQL_ACTIVE_APIS = "* | SELECT count(DISTINCT api_name) as active_apis"


def _cls_query(client, query: str, from_ms: int, to_ms: int) -> dict:
    """Run a CLS SearchLog request and return the parsed response."""
    from tencentcloud.cls.v20201016 import models

    req = models.SearchLogRequest()
    req.TopicId = TOPIC_ID
    req.From = from_ms
    req.To = to_ms
    req.Query = query
    req.SyntaxRule = 1
    req.Limit = 1000
    req.UseNewAnalysis = True

    resp = client.SearchLog(req)
    return json.loads(resp.to_json_string())


def _parse_analysis_records(result: dict) -> list[dict]:
    """Parse CLS AnalysisRecords into list of dicts."""
    records = []
    for raw in result.get("AnalysisRecords", []):
        row = json.loads(raw)
        records.append(row)
    return records


def _query_total(client, from_ms: int, to_ms: int) -> int:
    """Get total API call count for a time window."""
    result = _cls_query(client, _SQL_TOTAL, from_ms, to_ms)
    rows = _parse_analysis_records(result)
    if rows:
        return rows[0].get("total", 0)
    return 0


def _query_unique_users(client, from_ms: int, to_ms: int) -> int:
    """Get unique user count for a time window."""
    result = _cls_query(client, _SQL_USERS, from_ms, to_ms)
    rows = _parse_analysis_records(result)
    if rows:
        return rows[0].get("users", 0)
    return 0


def _query_active_apis(client, from_ms: int, to_ms: int) -> int:
    """Get distinct API count for a time window."""
    result = _cls_query(client, _SQL_ACTIVE_APIS, from_ms, to_ms)
    rows = _parse_analysis_records(result)
    if rows:
        return rows[0].get("active_apis", 0)
    return 0


# ── main ─────────────────────────────────────────────────────────────────────

def main() -> int:
    parser = argparse.ArgumentParser(
        description="Generate Roadmap API usage snapshot JSON from CLS logs."
    )
    parser.add_argument(
        "--output",
        type=Path,
        default=_default_output_path(),
        help="Output JSON path (default: Roadmap/config/api_usage.json)",
    )
    args = parser.parse_args()

    # Load env
    project_root = Path(__file__).resolve().parent.parent.parent
    _load_env(str(project_root / "PlatformBackend" / ".env"))

    secret_id = os.environ.get("TENCENT_CLOUD_SECRET_ID")
    secret_key = os.environ.get("TENCENT_CLOUD_SECRET_KEY")
    if not secret_id or not secret_key:
        print(
            "[api_usage_snapshot] ERROR: TENCENT_CLOUD_SECRET_ID and "
            "TENCENT_CLOUD_SECRET_KEY must be set.",
            file=sys.stderr,
        )
        return 2

    try:
        from tencentcloud.common import credential
        from tencentcloud.cls.v20201016 import cls_client
    except ImportError:
        print(
            "[api_usage_snapshot] ERROR: tencentcloud-sdk-python not installed.\n"
            "  Run: pip install tencentcloud-sdk-python",
            file=sys.stderr,
        )
        return 2

    cred = credential.Credential(secret_id, secret_key)
    client = cls_client.ClsClient(cred, CLS_REGION)

    now = datetime.now(timezone.utc)
    now_ms = int(now.timestamp() * 1000)

    windows = [
        ("last_7d", timedelta(days=7)),
        ("last_30d", timedelta(days=30)),
    ]

    payload: dict = {
        "as_of": now.isoformat(),
    }

    for window_name, delta in windows:
        start_ms = int((now - delta).timestamp() * 1000)
        print(f"[api_usage_snapshot] Querying {window_name} ...", file=sys.stderr)

        try:
            total = _query_total(client, start_ms, now_ms)
            users = _query_unique_users(client, start_ms, now_ms)
            active_apis = _query_active_apis(client, start_ms, now_ms)
        except Exception as exc:
            print(
                f"[api_usage_snapshot] ERROR querying CLS for {window_name}: {exc}",
                file=sys.stderr,
            )
            return 2

        payload[window_name] = {
            "total_calls": total,
            "unique_users": users,
            "active_apis": active_apis,
        }

    _atomic_write_json(Path(args.output), payload)
    print(f"[api_usage_snapshot] Wrote {args.output}", file=sys.stderr)

    # Print summary
    for wn, _ in windows:
        data = payload[wn]
        print(
            f"  {wn}: {data['total_calls']:,} calls, "
            f"{data['unique_users']:,} users, "
            f"{data['active_apis']} APIs",
            file=sys.stderr,
        )

    return 0


if __name__ == "__main__":
    raise SystemExit(main())
