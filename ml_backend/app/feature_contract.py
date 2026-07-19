from __future__ import annotations

from dataclasses import dataclass
from pathlib import Path
from typing import Any

import joblib

RAW_SENSOR_FEATURES: list[str] = [
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


@dataclass(frozen=True)
class ModelBundle:
    pipeline: Any
    feature_names: list[str]
    training_stats: dict[str, dict[str, float]]
    target_clip: int
    artifact_path: Path


def load_model_bundle(path: Path) -> ModelBundle:
    if not path.exists():
        raise FileNotFoundError(
            f"Model artifact not found at {path}. Train/export the pipeline bundle first."
        )

    bundle = joblib.load(path)
    required_keys = {"pipeline", "feature_names"}
    missing_keys = required_keys.difference(bundle)
    if missing_keys:
        raise ValueError(
            f"Invalid model artifact: missing keys {sorted(missing_keys)}. "
            "Save a bundle with pipeline and feature_names."
        )

    feature_names = list(bundle["feature_names"])
    if len(feature_names) != len(set(feature_names)):
        raise ValueError("Invalid model artifact: duplicate feature names were saved.")

    return ModelBundle(
        pipeline=bundle["pipeline"],
        feature_names=feature_names,
        training_stats=bundle.get("training_stats", {}),
        target_clip=int(bundle.get("target_clip", 125)),
        artifact_path=path,
    )
