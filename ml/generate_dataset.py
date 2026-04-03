from __future__ import annotations

import argparse
import csv
import math
import random
from dataclasses import dataclass
from datetime import date, timedelta
from pathlib import Path


WEEKDAY_WEIGHTS = [1.0, 0.95, 0.98, 1.05, 1.12, 1.2, 1.08]
MONTH_WEIGHTS = {
    1: 0.94,
    2: 0.96,
    3: 1.0,
    4: 1.03,
    5: 1.08,
    6: 1.02,
    7: 1.05,
    8: 1.07,
    9: 1.0,
    10: 1.04,
    11: 1.1,
    12: 1.18,
}

HOLIDAYS = {(1, 1), (4, 14), (4, 15), (4, 16), (9, 24), (12, 24), (12, 25), (12, 31)}


@dataclass(frozen=True)
class DailyRecord:
    date: date
    weekday: int
    month: int
    is_weekend: int
    is_holiday: int
    weather_score: float
    promo_flag: int
    traffic_count: int
    avg_ticket: float
    total_sales: float
    total_expenses: float


def seeded_rng(seed: int) -> random.Random:
    rng = random.Random(seed)
    return rng


def build_record(current_date: date, rng: random.Random) -> DailyRecord:
    weekday = current_date.weekday()
    month = current_date.month
    is_weekend = 1 if weekday >= 5 else 0
    is_holiday = 1 if (month, current_date.day) in HOLIDAYS else 0

    seasonal_wave = 1.0 + 0.18 * math.sin((current_date.timetuple().tm_yday / 365.0) * 2 * math.pi)
    weekday_factor = WEEKDAY_WEIGHTS[weekday]
    month_factor = MONTH_WEIGHTS[month]
    holiday_factor = 1.25 if is_holiday else 1.0
    weekend_factor = 1.12 if is_weekend else 1.0

    weather_score = max(0.0, min(1.0, rng.gauss(0.68 if is_weekend else 0.62, 0.18)))
    promo_flag = 1 if rng.random() < (0.14 + (0.08 if is_weekend else 0.0)) else 0
    promo_factor = 1.18 if promo_flag else 1.0

    base_traffic = 92
    traffic_noise = rng.gauss(0, 8)
    weather_factor = 0.82 + weather_score * 0.32
    traffic_count = int(
        max(
            12,
            round(
                base_traffic
                * seasonal_wave
                * weekday_factor
                * month_factor
                * weekend_factor
                * holiday_factor
                * promo_factor
                * weather_factor
                + traffic_noise,
            ),
        )
    )

    avg_ticket = round(
        max(
            1.25,
            rng.gauss(
                4.2 + (0.9 if promo_flag else 0.0) + (0.5 if is_holiday else 0.0),
                0.6,
            ),
        ),
        2,
    )
    basket_effect = 1.0 + (traffic_count / 1000.0)
    total_sales = round(max(0.0, traffic_count * avg_ticket * basket_effect * rng.uniform(0.95, 1.08)), 2)

    expense_ratio = 0.34 + (0.04 if promo_flag else 0.0) + (0.02 if is_holiday else 0.0)
    total_expenses = round(max(0.0, total_sales * rng.uniform(expense_ratio - 0.05, expense_ratio + 0.06)), 2)

    return DailyRecord(
        date=current_date,
        weekday=weekday,
        month=month,
        is_weekend=is_weekend,
        is_holiday=is_holiday,
        weather_score=round(weather_score, 3),
        promo_flag=promo_flag,
        traffic_count=traffic_count,
        avg_ticket=avg_ticket,
        total_sales=total_sales,
        total_expenses=total_expenses,
    )


def generate_dataset(days: int, seed: int) -> list[DailyRecord]:
    rng = seeded_rng(seed)
    start_date = date.today() - timedelta(days=days)
    return [build_record(start_date + timedelta(days=index), rng) for index in range(days)]


def write_csv(records: list[DailyRecord], output_path: Path) -> None:
    output_path.parent.mkdir(parents=True, exist_ok=True)
    with output_path.open("w", newline="", encoding="utf-8") as handle:
        writer = csv.writer(handle)
        writer.writerow(
            [
                "date",
                "weekday",
                "month",
                "is_weekend",
                "is_holiday",
                "weather_score",
                "promo_flag",
                "traffic_count",
                "avg_ticket",
                "total_sales",
                "total_expenses",
            ]
        )
        for record in records:
            writer.writerow(
                [
                    record.date.isoformat(),
                    record.weekday,
                    record.month,
                    record.is_weekend,
                    record.is_holiday,
                    record.weather_score,
                    record.promo_flag,
                    record.traffic_count,
                    record.avg_ticket,
                    record.total_sales,
                    record.total_expenses,
                ]
            )


def parse_args() -> argparse.Namespace:
    parser = argparse.ArgumentParser(description="Generate PsarPulse synthetic vendor data.")
    parser.add_argument("--days", type=int, default=730, help="Number of days to generate.")
    parser.add_argument("--seed", type=int, default=42, help="Random seed for repeatable output.")
    parser.add_argument(
        "--output",
        type=Path,
        default=Path("ml/data/synthetic_vendor_data.csv"),
        help="Output CSV path.",
    )
    return parser.parse_args()


def main() -> None:
    args = parse_args()
    records = generate_dataset(args.days, args.seed)
    write_csv(records, args.output)
    print(f"Generated {len(records)} rows at {args.output}")


if __name__ == "__main__":
    main()