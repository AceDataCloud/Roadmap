#!/usr/bin/env python3
"""
Fetch Creator Fees from pump.fun API and generate a snapshot JSON.

The API returns time-bucketed data with cumulative and per-bucket creator fees.
We calculate fees for last 1 day, 7 days, and 30 days by summing the creatorFeeSOL
values within those time ranges, then convert to USD using CoinGecko SOL price.

Supports multiple creator addresses (e.g. after wallet migration) and merges
their fee data together.

Usage:
    python scripts/generate_creator_fees_snapshot.py

Environment variables (optional):
    CREATOR_ADDRESSES - Comma-separated Solana wallet addresses
    CREATOR_ADDRESS   - Single address (legacy, used if CREATOR_ADDRESSES not set)
    OUTPUT_PATH       - Output JSON file path (default: config/creator_fees.json)
"""

from __future__ import annotations

import json
import os
import sys
from datetime import datetime, timedelta, timezone
from pathlib import Path
from typing import Optional, Dict, List, Any, Union
from urllib.request import urlopen, Request
from urllib.error import URLError, HTTPError
from loguru import logger


def _default_output_path() -> Path:
    root = Path(__file__).resolve().parent.parent
    return root / "config" / "creator_fees.json"


def _atomic_write_json(path: Path, payload: dict) -> None:
    path.parent.mkdir(parents=True, exist_ok=True)
    tmp = path.with_suffix(path.suffix + ".tmp")
    tmp.write_text(
        json.dumps(payload, ensure_ascii=False, indent=2) + "\n", encoding="utf-8"
    )
    tmp.replace(path)


def _env_str(key: str, default: Optional[str] = None) -> Optional[str]:
    val = os.environ.get(key)
    if val is None or not str(val).strip():
        return default
    return str(val).strip()


def fetch_json(url: str, timeout: int = 30) -> Union[Dict[str, Any], List[Any]]:
    """Fetch JSON from a URL."""
    req = Request(url, headers={"User-Agent": "Mozilla/5.0 Roadmap/1.0"})
    with urlopen(req, timeout=timeout) as resp:
        response_text = resp.read().decode("utf-8")
        logger.debug(f"Fetched data from {url}: {response_text}...")
        return json.loads(response_text)


def fetch_sol_price_usd() -> float:
    """Fetch current SOL price in USD from CoinGecko."""
    url = "https://api.coingecko.com/api/v3/simple/price?ids=solana&vs_currencies=usd"
    try:
        data = fetch_json(url)
        return float(data["solana"]["usd"])
    except Exception as e:
        logger.warning(
            f"Warning: Failed to fetch SOL price from CoinGecko: {e}", file=sys.stderr
        )
        # Fallback price if API fails
        return 200.0


def fetch_creator_fees(creator_address: str) -> List[Dict[str, Any]]:
    """
    Fetch creator fees from pump.fun API using 2h interval for precise 24h/7d data.

    Returns list of buckets with:
    - bucket: ISO timestamp
    - creatorFee: lamports for this bucket
    - creatorFeeSOL: SOL for this bucket
    - numTrades: number of trades
    - cumulativeCreatorFee: total lamports to date
    - cumulativeCreatorFeeSOL: total SOL to date
    """
    # Use 2h interval with 84 buckets = 7 days of data for accurate 24h and 7d calculation
    url = f"https://swap-api.pump.fun/v1/creators/{creator_address}/fees?interval=6h"
    return fetch_json(url)


def fetch_creator_fees_daily(creator_address: str) -> List[Dict[str, Any]]:
    """
    Fetch creator fees from pump.fun API using 24h interval for accurate 30d data.

    Returns list of buckets with daily granularity.
    """
    # Use 24h interval with 365 buckets = 1 year of data for accurate 30d calculation
    url = f"https://swap-api.pump.fun/v1/creators/{creator_address}/fees?interval=24h&limit=365"
    return fetch_json(url)


def calculate_fees_for_periods(
    hourly_buckets: List[Dict[str, Any]],
    daily_buckets: List[Dict[str, Any]],
) -> Dict[str, Any]:
    """
    Calculate total creator fees for last 24h, 7d, 30d periods.

    Uses two data sources for accuracy:
    - hourly_buckets (2h interval): for precise 24h and 7d calculations
    - daily_buckets (24h interval): for accurate 30d calculation

    Returns dict with SOL amounts for each period.
    """
    now = datetime.now(timezone.utc)

    def parse_buckets(buckets: List[Dict[str, Any]]) -> List[Dict[str, Any]]:
        """Parse bucket data into structured format."""
        parsed = []
        for bucket in buckets:
            bucket_time_str = bucket.get("bucket", "")
            if not bucket_time_str:
                continue
            try:
                bucket_time = datetime.fromisoformat(
                    bucket_time_str.replace("Z", "+00:00")
                )
            except ValueError:
                continue
            fee_sol = float(bucket.get("creatorFeeSOL", "0") or "0")
            cumulative_sol = float(bucket.get("cumulativeCreatorFeeSOL", "0") or "0")
            num_trades = int(bucket.get("numTrades", 0) or 0)
            parsed.append(
                {
                    "time": bucket_time,
                    "fee_sol": fee_sol,
                    "cumulative_sol": cumulative_sol,
                    "num_trades": num_trades,
                }
            )
        return sorted(parsed, key=lambda x: x["time"])

    def sum_fees_since(
        parsed: List[Dict[str, Any]], since: datetime
    ) -> tuple[float, int]:
        """Sum fees and trades since a given time."""
        total_fee = 0.0
        total_trades = 0
        for b in parsed:
            if b["time"] >= since:
                total_fee += b["fee_sol"]
                total_trades += b["num_trades"]
        return total_fee, total_trades

    # Parse both data sources
    hourly_parsed = parse_buckets(hourly_buckets)
    daily_parsed = parse_buckets(daily_buckets)

    # Get total from the most recent cumulative value
    total_sol = 0.0
    if hourly_parsed:
        total_sol = hourly_parsed[-1]["cumulative_sol"]
    elif daily_parsed:
        total_sol = daily_parsed[-1]["cumulative_sol"]

    # Calculate 24h and 7d from hourly data (more precise)
    hours_24_ago = now - timedelta(hours=24)
    hours_168_ago = now - timedelta(hours=24 * 7)
    fees_24h, trades_24h = sum_fees_since(hourly_parsed, hours_24_ago)
    fees_7d, trades_7d = sum_fees_since(hourly_parsed, hours_168_ago)

    # Calculate 30d from daily data (covers full 30 days)
    days_30_ago = now - timedelta(days=30)
    fees_30d, trades_30d = sum_fees_since(daily_parsed, days_30_ago)

    return {
        "last_1d_sol": round(max(0, fees_24h), 4),
        "last_7d_sol": round(max(0, fees_7d), 4),
        "last_30d_sol": round(max(0, fees_30d), 4),
        "total_sol": round(total_sol, 4),
        "trades_1d": trades_24h,
        "trades_7d": trades_7d,
        "trades_30d": trades_30d,
    }


def _get_creator_addresses() -> List[str]:
    """Get list of creator addresses from env or defaults."""
    multi = _env_str("CREATOR_ADDRESSES")
    if multi:
        return [a.strip() for a in multi.split(",") if a.strip()]
    single = _env_str("CREATOR_ADDRESS")
    if single:
        return [single]
    return [
        "6hVavSsYRaNk86UbNZa6V4JfSwqkRGk9HgYZqKNsdU1w",
        "CfP4JnzXicK9b8wcXHZyYKdgUpxRWRMc5bb93eh3PktG",
    ]


def _merge_fees(all_fees: List[Dict[str, Any]]) -> Dict[str, Any]:
    """Merge fee results from multiple addresses by summing all fields."""
    merged = {
        "last_1d_sol": 0.0,
        "last_7d_sol": 0.0,
        "last_30d_sol": 0.0,
        "total_sol": 0.0,
        "trades_1d": 0,
        "trades_7d": 0,
        "trades_30d": 0,
    }
    for fees in all_fees:
        for key in merged:
            merged[key] += fees[key]
    # Round SOL values
    for key in ("last_1d_sol", "last_7d_sol", "last_30d_sol", "total_sol"):
        merged[key] = round(merged[key], 4)
    return merged


def main() -> int:
    addresses = _get_creator_addresses()
    output_path = Path(_env_str("OUTPUT_PATH") or _default_output_path())

    print(f"Fetching creator fees for {len(addresses)} address(es)...")

    try:
        all_fees = []
        for addr in addresses:
            print(f"\n  [{addr[:8]}...{addr[-4:]}]")

            hourly_buckets = fetch_creator_fees(addr)
            print(f"    Retrieved {len(hourly_buckets)} hourly buckets")

            daily_buckets = fetch_creator_fees_daily(addr)
            print(f"    Retrieved {len(daily_buckets)} daily buckets")

            fees = calculate_fees_for_periods(hourly_buckets, daily_buckets)
            print(
                f"    1d: {fees['last_1d_sol']:.4f} SOL  7d: {fees['last_7d_sol']:.4f} SOL  30d: {fees['last_30d_sol']:.4f} SOL  total: {fees['total_sol']:.4f} SOL"
            )
            all_fees.append(fees)

        merged = _merge_fees(all_fees)
        print("\n  Merged totals:")
        print(
            f"    Last 24h: {merged['last_1d_sol']:.4f} SOL ({merged['trades_1d']} trades)"
        )
        print(
            f"    Last 7d: {merged['last_7d_sol']:.4f} SOL ({merged['trades_7d']} trades)"
        )
        print(
            f"    Last 30d: {merged['last_30d_sol']:.4f} SOL ({merged['trades_30d']} trades)"
        )
        print(f"    Total: {merged['total_sol']:.4f} SOL")

        # Fetch SOL price
        sol_price = fetch_sol_price_usd()
        print(f"  SOL price: ${sol_price:.2f}")

        # Build snapshot
        snapshot = {
            "as_of": datetime.now(timezone.utc).isoformat(),
            "creator_addresses": addresses,
            "sol_price_usd": round(sol_price, 2),
            "last_1d_sol": merged["last_1d_sol"],
            "last_7d_sol": merged["last_7d_sol"],
            "last_30d_sol": merged["last_30d_sol"],
            "total_sol": merged["total_sol"],
            "last_1d_usd": round(merged["last_1d_sol"] * sol_price, 2),
            "last_7d_usd": round(merged["last_7d_sol"] * sol_price, 2),
            "last_30d_usd": round(merged["last_30d_sol"] * sol_price, 2),
            "total_usd": round(merged["total_sol"] * sol_price, 2),
            "trades_1d": merged["trades_1d"],
            "trades_7d": merged["trades_7d"],
            "trades_30d": merged["trades_30d"],
        }

        # Write output
        _atomic_write_json(output_path, snapshot)
        print(f"Wrote snapshot to {output_path}")

        return 0

    except HTTPError as e:
        print(f"HTTP Error: {e.code} {e.reason}", file=sys.stderr)
        return 1
    except URLError as e:
        print(f"URL Error: {e.reason}", file=sys.stderr)
        return 1
    except Exception as e:
        print(f"Error: {e}", file=sys.stderr)
        return 1


if __name__ == "__main__":
    sys.exit(main())
