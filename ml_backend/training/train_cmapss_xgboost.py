from __future__ import annotations

import argparse
from pathlib import Path

import joblib
import numpy as np
import pandas as pd
from sklearn.metrics import mean_absolute_error, mean_squared_error, r2_score
from sklearn.model_selection import GroupShuffleSplit
from sklearn.pipeline import Pipeline
from sklearn.preprocessing import StandardScaler
from xgboost import XGBRegressor

FEATURE_NAMES = [
    "setting_1",
    "setting_2",
    "sensor_2",
    "sensor_3",
    "sensor_4",
    "sensor_6",
    "sensor_7",
    "sensor_8",
    "sensor_9",
    "sensor_11",
    "sensor_12",
    "sensor_13",
    "sensor_14",
    "sensor_15",
    "sensor_17",
    "sensor_20",
    "sensor_21",
]

COLUMN_NAMES = (
    ["unit_number", "time_cycles", "setting_1", "setting_2", "setting_3"]
    + [f"sensor_{idx}" for idx in range(1, 22)]
)


def load_cmapss_train(path: Path) -> pd.DataFrame:
    frame = pd.read_csv(path, sep=r"\s+", header=None, names=COLUMN_NAMES)
    max_cycle = frame.groupby("unit_number")["time_cycles"].transform("max")
    frame["rul"] = max_cycle - frame["time_cycles"]
    frame["dataset"] = path.stem.replace("train_", "")
    frame["group_id"] = frame["dataset"] + "_" + frame["unit_number"].astype(str)
    return frame


def load_training_data(train_file: Path | None, train_dir: Path | None) -> pd.DataFrame:
    if train_dir is not None:
        train_files = sorted(train_dir.glob("train_FD*.txt"))
        if not train_files:
            raise FileNotFoundError(f"No train_FD*.txt files found in {train_dir}")
        return pd.concat([load_cmapss_train(path) for path in train_files], ignore_index=True)

    if train_file is None:
        raise ValueError("Pass either --train-file or --train-dir.")
    return load_cmapss_train(train_file)


def training_stats(frame: pd.DataFrame) -> dict[str, dict[str, float]]:
    quantiles = frame[FEATURE_NAMES].quantile([0.01, 0.99])
    return {
        feature: {
            "p01": float(quantiles.loc[0.01, feature]),
            "p99": float(quantiles.loc[0.99, feature]),
            "mean": float(frame[feature].mean()),
            "std": float(frame[feature].std(ddof=0)),
        }
        for feature in FEATURE_NAMES
    }


def train(train_file: Path | None, train_dir: Path | None, artifact_path: Path, target_clip: int) -> None:
    frame = load_training_data(train_file, train_dir)
    frame["rul_clipped"] = frame["rul"].clip(upper=target_clip)

    splitter = GroupShuffleSplit(n_splits=1, test_size=0.2, random_state=42)
    train_idx, valid_idx = next(
        splitter.split(frame, groups=frame["group_id"])
    )

    x_train = frame.iloc[train_idx][FEATURE_NAMES].astype(np.float64)
    y_train = frame.iloc[train_idx]["rul_clipped"].astype(np.float64)
    x_valid = frame.iloc[valid_idx][FEATURE_NAMES].astype(np.float64)
    y_valid = frame.iloc[valid_idx]["rul_clipped"].astype(np.float64)

    pipeline = Pipeline(
        steps=[
            ("scaler", StandardScaler()),
            (
                "model",
                XGBRegressor(
                    objective="reg:squarederror",
                    n_estimators=700,
                    learning_rate=0.03,
                    max_depth=4,
                    subsample=0.85,
                    colsample_bytree=0.85,
                    reg_lambda=1.5,
                    random_state=42,
                    n_jobs=-1,
                ),
            ),
        ]
    )
    pipeline.fit(x_train, y_train)
    predictions = pipeline.predict(x_valid)

    mse = mean_squared_error(y_valid, predictions)
    metrics = {
        "mae": float(mean_absolute_error(y_valid, predictions)),
        "rmse": float(np.sqrt(mse)),
        "r2": float(r2_score(y_valid, predictions)),
    }

    artifact_path.parent.mkdir(parents=True, exist_ok=True)
    joblib.dump(
        {
            "pipeline": pipeline,
            "feature_names": FEATURE_NAMES,
            "training_stats": training_stats(frame),
            "target_clip": target_clip,
            "metrics": metrics,
            "datasets": sorted(frame["dataset"].unique().tolist()),
            "training_rows": int(len(frame)),
            "training_units": int(frame["group_id"].nunique()),
        },
        artifact_path,
    )
    print(f"Saved artifact: {artifact_path}")
    print(metrics)


def parse_args() -> argparse.Namespace:
    parser = argparse.ArgumentParser()
    source = parser.add_mutually_exclusive_group(required=True)
    source.add_argument("--train-file", type=Path)
    source.add_argument("--train-dir", type=Path)
    parser.add_argument("--artifact", required=True, type=Path)
    parser.add_argument("--target-clip", type=int, default=125)
    return parser.parse_args()


if __name__ == "__main__":
    args = parse_args()
    train(args.train_file, args.train_dir, args.artifact, args.target_clip)
