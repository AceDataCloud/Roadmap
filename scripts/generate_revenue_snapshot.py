#!/usr/bin/env python3
import argparse
import json
import os
import sys
from datetime import timedelta
from pathlib import Path


def _default_output_path() -> Path:
    # Roadmap layout: <root>/Roadmap/scripts/generate_revenue_snapshot.py -> <root>/Roadmap/config/revenue.json
    root = Path(__file__).resolve().parent.parent
    return root / "config" / "revenue.json"


def _atomic_write_json(path: Path, payload: dict) -> None:
    path.parent.mkdir(parents=True, exist_ok=True)
    tmp = path.with_suffix(path.suffix + ".tmp")
    tmp.write_text(json.dumps(payload, ensure_ascii=False, indent=2) + "\n", encoding="utf-8")
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


def _django_query(
    *,
    user_id: str | None,
    pay_ways: list[str],
    orders_table: str,
    pgsql_host: str,
    pgsql_port: int,
    pgsql_user: str,
    pgsql_password: str | None,
    pgsql_database: str,
) -> dict:
    """
    Minimal Django ORM query (standalone; Roadmap-only script).

    Dependencies:
      - Django
      - psycopg2-binary (or psycopg2)
    """
    import django  # type: ignore
    from django.conf import settings  # type: ignore

    if not settings.configured:
        settings.configure(
            SECRET_KEY="revenue-snapshot",
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
    from django.db.models import Sum  # type: ignore
    from django.utils import timezone as dj_tz  # type: ignore

    class OrderState:
        FINISHED = "Finished"

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
            app_label = "revenue_snapshot"

    now = dj_tz.now()
    start_today = now.replace(hour=0, minute=0, second=0, microsecond=0)
    start_7d = now - timedelta(days=7)
    start_30d = now - timedelta(days=30)
    start_90d = now - timedelta(days=90)

    qs = Order.objects.filter(state=OrderState.FINISHED)
    if user_id:
        qs = qs.filter(user_id=user_id)
    if pay_ways:
        qs = qs.filter(pay_way__in=pay_ways)

    def _sum_between(start_dt):
        return (
            qs.filter(created_at__gte=start_dt, created_at__lte=now).aggregate(total=Sum("price")).get("total")
            or 0
        )

    return {
        "as_of": now.isoformat(),
        "today": _sum_between(start_today),
        "last_7d": _sum_between(start_7d),
        "last_30d": _sum_between(start_30d),
        "last_90d": _sum_between(start_90d),
    }


def main() -> int:
    parser = argparse.ArgumentParser(
        description="Generate Roadmap revenue snapshot JSON from finished orders."
    )
    parser.add_argument(
        "--output",
        type=Path,
        default=_default_output_path(),
        help="Output JSON path (default: Roadmap/config/revenue.json)",
    )
    parser.add_argument("--currency", default="USD", help="Currency code for display (default: USD)")
    parser.add_argument("--user-id", dest="user_id", default=None, help="Optional filter: user_id")
    parser.add_argument(
        "--pay-way",
        dest="pay_ways",
        action="append",
        default=[],
        help="Optional filter: pay_way (repeatable), e.g. --pay-way Stripe",
    )
    parser.add_argument("--orders-table", default="app_order", help="Orders table name (default: app_order)")
    parser.add_argument("--pgsql-host", default=_env_str("PGSQL_HOST", "localhost"), help="Postgres host (default: $PGSQL_HOST or localhost)")
    parser.add_argument("--pgsql-port", type=int, default=_env_int("PGSQL_PORT", 5432), help="Postgres port (default: $PGSQL_PORT or 5432)")
    parser.add_argument("--pgsql-user", default=_env_str("PGSQL_USER", "postgres"), help="Postgres user (default: $PGSQL_USER or postgres)")
    parser.add_argument("--pgsql-password", default=_env_str("PGSQL_PASSWORD"), help="Postgres password (default: $PGSQL_PASSWORD)")
    parser.add_argument(
        "--pgsql-database",
        default=_env_str("PGSQL_DATABASE_PLATFORM", "acedatacloud_platform"),
        help="Postgres database (default: $PGSQL_DATABASE_PLATFORM or acedatacloud_platform)",
    )
    args = parser.parse_args()

    pay_ways = [str(p).strip() for p in (args.pay_ways or []) if str(p).strip()]
    try:
        orm = _django_query(
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
            "[revenue_snapshot] Failed to query Postgres via Django ORM.\n"
            "  - Install deps: `pip install Django psycopg2-binary`\n"
            "  - Export PGSQL_HOST/PGSQL_PORT/PGSQL_USER/PGSQL_PASSWORD/PGSQL_DATABASE_PLATFORM\n"
            f"  - Error: {exc}",
            file=sys.stderr,
        )
        return 2

    payload = {"as_of": orm["as_of"], "currency": str(args.currency), **{k: orm[k] for k in ("today", "last_7d", "last_30d", "last_90d")}}

    _atomic_write_json(Path(args.output), payload)
    print(f"[revenue_snapshot] Wrote {args.output}")
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
