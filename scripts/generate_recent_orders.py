#!/usr/bin/env python3
"""Generate a masked recent-orders snapshot for the Roadmap dashboard.

Usage:
    # With env vars from .env
    source .env
    python3 scripts/generate_recent_orders.py

    # With explicit flags
    python3 scripts/generate_recent_orders.py --pgsql-host 127.0.0.1 --limit 20
"""

import argparse
import json
import os
import sys
from pathlib import Path


def _default_output_path() -> Path:
    root = Path(__file__).resolve().parent.parent
    return root / "config" / "recent_orders.json"


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


def _mask_order_id(order_id: str) -> str:
    """Keep first 10 and last 10 characters, mask the middle with '****'."""
    s = str(order_id)
    if len(s) <= 20:
        return s
    return s[:10] + "****" + s[-10:]


def _django_query(
    *,
    limit: int,
    orders_table: str,
    pgsql_host: str,
    pgsql_port: int,
    pgsql_user: str,
    pgsql_password: str | None,
    pgsql_database: str,
) -> dict:
    """Query recent finished orders via Django ORM (standalone)."""
    import django
    from django.conf import settings

    if not settings.configured:
        settings.configure(
            SECRET_KEY="recent-orders-snapshot",
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

    from django.db import models
    from django.utils import timezone as dj_tz

    class Order(models.Model):
        id = models.UUIDField(primary_key=True)
        description = models.CharField(max_length=255, null=True)
        price = models.FloatField(null=True)
        state = models.CharField(max_length=20, null=True)
        pay_way = models.CharField(max_length=20, null=True)
        created_at = models.DateTimeField(null=True)

        class Meta:
            managed = False
            db_table = orders_table
            app_label = "recent_orders_snapshot"

    now = dj_tz.now()

    rows = (
        Order.objects.filter(state="Finished")
        .exclude(price__isnull=True)
        .exclude(price__lte=0)
        .order_by("-created_at")[:limit]
    )

    orders = []
    for row in rows:
        orders.append(
            {
                "id": _mask_order_id(str(row.id)),
                "created_at": row.created_at.isoformat() if row.created_at else None,
                "pay_way": row.pay_way or "Unknown",
                "price": round(row.price, 2) if row.price else 0,
                "description": row.description or "",
            }
        )

    return {
        "as_of": now.isoformat(),
        "total": len(orders),
        "orders": orders,
    }


def main() -> int:
    parser = argparse.ArgumentParser(
        description="Generate masked recent-orders snapshot JSON for the Roadmap."
    )
    parser.add_argument(
        "--output",
        type=Path,
        default=_default_output_path(),
        help="Output JSON path (default: Roadmap/config/recent_orders.json)",
    )
    parser.add_argument(
        "--limit",
        type=int,
        default=20,
        help="Number of recent orders to include (default: 20)",
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
        result = _django_query(
            limit=int(args.limit),
            orders_table=str(args.orders_table).strip() or "app_order",
            pgsql_host=str(args.pgsql_host),
            pgsql_port=int(args.pgsql_port),
            pgsql_user=str(args.pgsql_user),
            pgsql_password=args.pgsql_password,
            pgsql_database=str(args.pgsql_database),
        )
    except Exception as exc:
        print(
            "[recent_orders] Failed to query Postgres via Django ORM.\n"
            "  - Install deps: `pip install Django psycopg2-binary`\n"
            "  - Export PGSQL_HOST/PGSQL_PORT/PGSQL_USER/PGSQL_PASSWORD/PGSQL_DATABASE\n"
            f"  - Error: {exc}",
            file=sys.stderr,
        )
        return 2

    _atomic_write_json(Path(args.output), result)
    print(f"[recent_orders] Wrote {args.output} ({result['total']} orders)")
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
