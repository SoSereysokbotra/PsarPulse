from __future__ import annotations

import argparse
import json
import pickle
from dataclasses import dataclass
from datetime import timedelta
from pathlib import Path

import numpy as np
import pandas as pd


@dataclass
class LoadedArtifacts:
    feature_columns: list[str]
    sales_model: object
    traffic_model: object
    sales_mae: float
    traffic_mae: float
    sales_rmse: float
    traffic_rmse: float


def load_artifacts(path: Path) -> LoadedArtifacts:
    with path.open("rb") as handle:
        raw = pickle.load(handle)
    return LoadedArtifacts(**raw)


def load_recent_data(path: Path) -> pd.DataFrame:
    frame = pd.read_csv(path, parse_dates=["date"])
    frame = frame.sort_values("date").reset_index(drop=True)
    return frame


def build_prediction_row(frame: pd.DataFrame, next_date) -> pd.DataFrame:
    last_sales = frame["total_sales"].tolist()
    last_traffic = frame["traffic_count"].tolist()

    day_of_year = next_date.timetuple().tm_yday
    weekday = next_date.weekday()
    month = next_date.month
    is_weekend = 1 if weekday >= 5 else 0
    is_holiday = 0
    weather_score = float(np.clip(frame["weather_score"].tail(7).mean(), 0.0, 1.0))
    promo_flag = int(frame["promo_flag"].tail(14).mean() >= 0.2)
    avg_ticket = float(frame["avg_ticket"].tail(7).mean())

    row = {
        "weekday": weekday,
        "month": month,
        "is_weekend": is_weekend,
        "is_holiday": is_holiday,
        "weather_score": round(weather_score, 3),
        "promo_flag": promo_flag,
        "avg_ticket": round(avg_ticket, 2),
        "day_of_year": day_of_year,
        "week_of_year": int(next_date.isocalendar().week),
        "day_index": int(len(frame)),
        "month_sin": float(np.sin(2 * np.pi * day_of_year / 365.0)),
        "month_cos": float(np.cos(2 * np.pi * day_of_year / 365.0)),
        "sales_lag_1": float(last_sales[-1]),
        "sales_lag_2": float(last_sales[-2]),
        "sales_lag_3": float(last_sales[-3]),
        "sales_lag_7": float(last_sales[-7]),
        "traffic_lag_1": float(last_traffic[-1]),
        "traffic_lag_2": float(last_traffic[-2]),
        "traffic_lag_3": float(last_traffic[-3]),
        "traffic_lag_7": float(last_traffic[-7]),
    }

    return pd.DataFrame([row])


def parse_args() -> argparse.Namespace:
    parser = argparse.ArgumentParser(description="Predict the next day for PsarPulse.")
    parser.add_argument(
        "--recent",
        type=Path,
        default=Path("ml/data/synthetic_vendor_data.csv"),
        help="CSV with the most recent history.",
    )
    parser.add_argument(
        "--model",
        type=Path,
        default=Path("ml/artifacts/forecast_model.pkl"),
        help="Trained model artifact path.",
    )
    parser.add_argument(
        "--output",
        type=Path,
        default=Path("ml/artifacts/next_day_prediction.json"),
        help="Where to save the prediction JSON.",
    )
    return parser.parse_args()


def main() -> None:
    args = parse_args()
    artifacts = load_artifacts(args.model)
    frame = load_recent_data(args.recent)

    if len(frame) < 8:
        raise ValueError("Need at least 8 rows of history to build lag features.")

    next_date = frame["date"].iloc[-1] + timedelta(days=1)
    features = build_prediction_row(frame, next_date)
    features = features[artifacts.feature_columns]

    sales_prediction = float(artifacts.sales_model.predict(features)[0])
    traffic_prediction = float(artifacts.traffic_model.predict(features)[0])

    result = {
        "date": next_date.date().isoformat(),
        "sales_prediction": round(sales_prediction, 2),
        "traffic_prediction": int(round(traffic_prediction)),
        "model_quality": {
            "sales_mae": round(artifacts.sales_mae, 2),
            "traffic_mae": round(artifacts.traffic_mae, 2),
            "sales_rmse": round(artifacts.sales_rmse, 2),
            "traffic_rmse": round(artifacts.traffic_rmse, 2),
        },
    }

    args.output.parent.mkdir(parents=True, exist_ok=True)
    with args.output.open("w", encoding="utf-8") as handle:
        json.dump(result, handle, indent=2)

    print(json.dumps(result, indent=2))


if __name__ == "__main__":
    main()