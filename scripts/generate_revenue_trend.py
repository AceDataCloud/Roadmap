#!/usr/bin/env python3
"""Generate a monthly revenue trend snapshot for the Roadmap dashboard.

Aggregates finished orders by calendar month (UTC) starting from
``--start-month`` (default ``2026-01``). The in-progress current month is
intentionally omitted so the chart only shows fully completed months.

Usage:
    # With env vars from .env
    source .env
    python3 scripts/generate_revenue_trend.py

    # Custom start month
    python3 scripts/generate_revenue_trend.py --start-month 2026-01
"""

import argparse
import json
import os
import sys
from datetime import datetime, timezone
from pathlib import Path


def _default_output_path() -> Path:
    root = Path(__file__).resolve().parent.parent
    return root / "config" / "revenue_trend.json"


def _atomic_write_json(path: Path, payload: dict) -> None:
    path.parent.mkdir(parents=True, exist_ok=True)
    tmp = path.with_suffix(path.suffix + ".tmp")
    tmp.write_text(
        json.dumps(payload, ensure_ascii=False, indent=2) + "\n", encoding="utf-8"
    )
    tmp.replace(path)


def _env_str(key: str, default: str | None = None) -> str | None:
    val = os.environ.get(key)
    if val is None or not str(val).strip():
        return default
    return str(val).strip()


def _env_int(key: str, default: int) -> int:
    val = _env_str(key)
    if val is None:
        return default
    try:
        return int(val)
    except ValueError:
        return default


def _parse_month(value: str) -> datetime:
    """Parse a ``YYYY-MM`` string into a UTC datetime at the 1st of that month."""
    parts = str(value).strip().split("-")
    if len(parts) != 2:
        raise ValueError(f"start-month must be YYYY-MM, got: {value!r}")
    year, month = int(parts[0]), int(parts[1])
    if not (1 <= month <= 12):
        raise ValueError(f"invalid month: {value!r}")
    return datetime(year, month, 1, tzinfo=timezone.utc)


def _next_month(dt: datetime) -> datetime:
    year = dt.year + (1 if dt.month == 12 else 0)
    month = 1 if dt.month == 12 else dt.month + 1
    return dt.replace(year=year, month=month, day=1, hour=0, minute=0, second=0, microsecond=0)


def _django_query(
    *,
    start_month: datetime,
    user_id: str | None,
    pay_ways: list[str],
    orders_table: str,
    pgsql_host: str,
    pgsql_port: int,
    pgsql_user: str,
    pgsql_password: str | None,
    pgsql_database: str,
) -> dict:
    """Aggregate finished orders by month via Django ORM (standalone)."""
    import django  # type: ignore
    from django.conf import settings  # type: ignore

    if not settings.configured:
        settings.configure(
            SECRET_KEY="revenue-trend-snapshot",
            INSTALLED_APPS=["django.contrib.contenttypes"],
            DATABASES={
                "default": {
                    "ENGINE": "django.db.backends.postgresql",
                    "NAME": pgsql_database,
                    "USER": pgsql_user,
                    "PASSWORD": pgsql_password or "",
                    "HOST": pgsql_host,
                    "PORT": pgsql_port,
                }
            },
            TIME_ZONE="UTC",
            USE_TZ=True,
            DEFAULT_AUTO_FIELD="django.db.models.AutoField",
        )

    django.setup()

    from django.db import models  # type: ignore
    from django.db.models import Sum, Count  # type: ignore
    from django.db.models.functions import TruncMonth  # type: ignore
    from django.utils import timezone as dj_tz  # type: ignore

    class Order(models.Model):
        id = models.UUIDField(primary_key=True)
        created_at = models.DateTimeField()
        price = models.FloatField(null=True)
        state = models.CharField(max_length=20, null=True)
        user_id = models.CharField(max_length=40, null=True)
        pay_way = models.CharField(max_length=20, null=True)

        class Meta:
            managed = False
            db_table = orders_table
            app_label = "revenue_trend_snapshot"

    now = dj_tz.now()

    qs = Order.objects.filter(state="Finished", created_at__gte=start_month)
    if user_id:
        qs = qs.filter(user_id=user_id)
    if pay_ways:
        qs = qs.filter(pay_way__in=pay_ways)

    rows = (
        qs.annotate(month=TruncMonth("created_at"))
        .values("month")
        .annotate(revenue=Sum("price"), orders=Count("id"))
        .order_by("month")
    )

    by_month: dict[str, dict] = {}
    for row in rows:
        m = row["month"]
        if m is None:
            continue
        key = f"{m.year:04d}-{m.month:02d}"
        by_month[key] = {
            "month": key,
            "revenue": float(row["revenue"] or 0),
            "orders": int(row["orders"] or 0),
        }

    # Stop strictly before the current calendar month so the chart only
    # contains fully completed months (a partial bar for the in-progress
    # month would look misleadingly small next to full months).
    months: list[dict] = []
    cursor = start_month
    end_marker = now.replace(day=1, hour=0, minute=0, second=0, microsecond=0)
    while cursor < end_marker:
        key = f"{cursor.year:04d}-{cursor.month:02d}"
        months.append(by_month.get(key, {"month": key, "revenue": 0.0, "orders": 0}))
        cursor = _next_month(cursor)

    return {"as_of": now.isoformat(), "months": months}


def main() -> int:
    parser = argparse.ArgumentParser(
        description="Generate Roadmap monthly revenue trend JSON from finished orders."
    )
    parser.add_argument(
        "--output",
        type=Path,
        default=_default_output_path(),
        help="Output JSON path (default: Roadmap/config/revenue_trend.json)",
    )
    parser.add_argument(
        "--currency", default="USD", help="Currency code for display (default: USD)"
    )
    parser.add_argument(
        "--start-month",
        dest="start_month",
        default=_env_str("REVENUE_TREND_START_MONTH", "2026-01"),
        help="Inclusive start month, YYYY-MM (default: 2026-01)",
    )
    parser.add_argument(
        "--user-id", dest="user_id", default=None, help="Optional filter: user_id"
    )
    parser.add_argument(
        "--pay-way",
        dest="pay_ways",
        action="append",
        default=[],
        help="Optional filter: pay_way (repeatable), e.g. --pay-way Stripe",
    )
    parser.add_argument(
        "--orders-table",
        default="app_order",
        help="Orders table name (default: app_order)",
    )
    parser.add_argument(
        "--pgsql-host",
        default=_env_str("PGSQL_HOST", "localhost"),
        help="Postgres host (default: $PGSQL_HOST or localhost)",
    )
    parser.add_argument(
        "--pgsql-port",
        type=int,
        default=_env_int("PGSQL_PORT", 5432),
        help="Postgres port (default: $PGSQL_PORT or 5432)",
    )
    parser.add_argument(
        "--pgsql-user",
        default=_env_str("PGSQL_USER", "postgres"),
        help="Postgres user (default: $PGSQL_USER or postgres)",
    )
    parser.add_argument(
        "--pgsql-password",
        default=_env_str("PGSQL_PASSWORD"),
        help="Postgres password (default: $PGSQL_PASSWORD)",
    )
    parser.add_argument(
        "--pgsql-database",
        default=_env_str("PGSQL_DATABASE", "acedatacloud_platform"),
        help="Postgres database (default: $PGSQL_DATABASE or acedatacloud_platform)",
    )
    args = parser.parse_args()

    try:
        start_month = _parse_month(args.start_month)
    except ValueError as exc:
        print(f"[revenue_trend] {exc}", file=sys.stderr)
        return 2

    pay_ways = [str(p).strip() for p in (args.pay_ways or []) if str(p).strip()]
    try:
        orm = _django_query(
            start_month=start_month,
            user_id=args.user_id,
            pay_ways=pay_ways,
            orders_table=str(args.orders_table).strip() or "app_order",
            pgsql_host=str(args.pgsql_host),
            pgsql_port=int(args.pgsql_port),
            pgsql_user=str(args.pgsql_user),
            pgsql_password=args.pgsql_password,
            pgsql_database=str(args.pgsql_database),
        )
    except Exception as exc:
        print(
            "[revenue_trend] Failed to query Postgres via Django ORM.\n"
            "  - Install deps: `pip install Django psycopg2-binary`\n"
            "  - Export PGSQL_HOST/PGSQL_PORT/PGSQL_USER/PGSQL_PASSWORD/PGSQL_DATABASE\n"
            f"  - Error: {exc}",
            file=sys.stderr,
        )
        return 2

    payload = {
        "as_of": orm["as_of"],
        "currency": str(args.currency),
        "start_month": f"{start_month.year:04d}-{start_month.month:02d}",
        "months": orm["months"],
    }

    _atomic_write_json(Path(args.output), payload)
    print(f"[revenue_trend] Wrote {args.output} ({len(orm['months'])} months)")
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
