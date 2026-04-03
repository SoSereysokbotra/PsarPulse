from __future__ import annotations

import argparse
import json
import pickle
from dataclasses import asdict, dataclass
from pathlib import Path

import numpy as np
import pandas as pd
from sklearn.ensemble import RandomForestRegressor
from sklearn.metrics import mean_absolute_error, mean_squared_error
from sklearn.model_selection import train_test_split


LAG_COLUMNS = ["sales_lag_1", "sales_lag_2", "sales_lag_3", "sales_lag_7", "traffic_lag_1", "traffic_lag_2", "traffic_lag_3", "traffic_lag_7"]


@dataclass
class ForecastArtifacts:
    feature_columns: list[str]
    sales_model: RandomForestRegressor
    traffic_model: RandomForestRegressor
    sales_mae: float
    traffic_mae: float
    sales_rmse: float
    traffic_rmse: float


def load_dataset(path: Path) -> pd.DataFrame:
    frame = pd.read_csv(path, parse_dates=["date"])
    frame = frame.sort_values("date").reset_index(drop=True)
    return frame


def add_features(frame: pd.DataFrame) -> pd.DataFrame:
    enriched = frame.copy()
    enriched["day_of_year"] = enriched["date"].dt.dayofyear
    enriched["week_of_year"] = enriched["date"].dt.isocalendar().week.astype(int)
    enriched["day_index"] = np.arange(len(enriched))
    enriched["month_sin"] = np.sin(2 * np.pi * enriched["day_of_year"] / 365.0)
    enriched["month_cos"] = np.cos(2 * np.pi * enriched["day_of_year"] / 365.0)

    for lag in (1, 2, 3, 7):
        enriched[f"sales_lag_{lag}"] = enriched["total_sales"].shift(lag)
        enriched[f"traffic_lag_{lag}"] = enriched["traffic_count"].shift(lag)

    enriched = enriched.dropna().reset_index(drop=True)
    return enriched


def select_features(frame: pd.DataFrame) -> list[str]:
    return [
        "weekday",
        "month",
        "is_weekend",
        "is_holiday",
        "weather_score",
        "promo_flag",
        "avg_ticket",
        "day_of_year",
        "week_of_year",
        "day_index",
        "month_sin",
        "month_cos",
        *LAG_COLUMNS,
    ]


def train_models(frame: pd.DataFrame) -> ForecastArtifacts:
    feature_columns = select_features(frame)
    x = frame[feature_columns]
    y_sales = frame["total_sales"]
    y_traffic = frame["traffic_count"]

    x_train, x_test, y_sales_train, y_sales_test = train_test_split(x, y_sales, test_size=0.2, random_state=42, shuffle=False)
    _, _, y_traffic_train, y_traffic_test = train_test_split(x, y_traffic, test_size=0.2, random_state=42, shuffle=False)

    sales_model = RandomForestRegressor(
        n_estimators=250,
        random_state=42,
        min_samples_leaf=2,
        n_jobs=-1,
    )
    traffic_model = RandomForestRegressor(
        n_estimators=250,
        random_state=42,
        min_samples_leaf=2,
        n_jobs=-1,
    )

    sales_model.fit(x_train, y_sales_train)
    traffic_model.fit(x_train, y_traffic_train)

    sales_pred = sales_model.predict(x_test)
    traffic_pred = traffic_model.predict(x_test)

    sales_mae = float(mean_absolute_error(y_sales_test, sales_pred))
    traffic_mae = float(mean_absolute_error(y_traffic_test, traffic_pred))
    sales_rmse = float(np.sqrt(mean_squared_error(y_sales_test, sales_pred)))
    traffic_rmse = float(np.sqrt(mean_squared_error(y_traffic_test, traffic_pred)))

    return ForecastArtifacts(
        feature_columns=feature_columns,
        sales_model=sales_model,
        traffic_model=traffic_model,
        sales_mae=sales_mae,
        traffic_mae=traffic_mae,
        sales_rmse=sales_rmse,
        traffic_rmse=traffic_rmse,
    )


def save_artifacts(artifacts: ForecastArtifacts, path: Path) -> None:
    path.parent.mkdir(parents=True, exist_ok=True)
    with path.open("wb") as handle:
        pickle.dump(asdict(artifacts), handle)


def parse_args() -> argparse.Namespace:
    parser = argparse.ArgumentParser(description="Train PsarPulse forecasting models.")
    parser.add_argument(
        "--input",
        type=Path,
        default=Path("ml/data/synthetic_vendor_data.csv"),
        help="Path to the synthetic or exported dataset.",
    )
    parser.add_argument(
        "--output",
        type=Path,
        default=Path("ml/artifacts/forecast_model.pkl"),
        help="Where to save the trained model artifacts.",
    )
    parser.add_argument(
        "--metrics",
        type=Path,
        default=Path("ml/artifacts/forecast_metrics.json"),
        help="Where to save evaluation metrics.",
    )
    return parser.parse_args()


def main() -> None:
    args = parse_args()
    frame = load_dataset(args.input)
    enriched = add_features(frame)
    artifacts = train_models(enriched)
    save_artifacts(artifacts, args.output)

    args.metrics.parent.mkdir(parents=True, exist_ok=True)
    with args.metrics.open("w", encoding="utf-8") as handle:
        json.dump(
            {
                "sales_mae": artifacts.sales_mae,
                "traffic_mae": artifacts.traffic_mae,
                "sales_rmse": artifacts.sales_rmse,
                "traffic_rmse": artifacts.traffic_rmse,
                "feature_columns": artifacts.feature_columns,
            },
            handle,
            indent=2,
        )

    print(f"Saved model to {args.output}")
    print(f"Saved metrics to {args.metrics}")
    print("Sales MAE: {:.2f} | Traffic MAE: {:.2f}".format(artifacts.sales_mae, artifacts.traffic_mae))


if __name__ == "__main__":
    main()