from __future__ import annotations

from pathlib import Path

import numpy as np
import pandas as pd

from .feature_contract import ModelBundle, RAW_SENSOR_FEATURES, load_model_bundle
from .health import classify_health, estimate_failure_probability, recommend_action
from .schemas import EngineReading, PredictionResponse


class RULPredictionService:
    def __init__(self, artifact_path: Path):
        self.bundle: ModelBundle = load_model_bundle(artifact_path)

    def _make_feature_frame(self, reading: EngineReading) -> pd.DataFrame:
        raw_values = reading.model_dump()
        missing_raw = [name for name in RAW_SENSOR_FEATURES if name not in raw_values]
        if missing_raw:
            raise ValueError(f"Missing raw input fields: {missing_raw}")

        row = pd.DataFrame([raw_values], dtype=np.float64)
        missing_model_features = [
            name for name in self.bundle.feature_names if name not in row.columns
        ]
        if missing_model_features:
            raise ValueError(
                "The saved model expects engineered features that are not available "
                f"from this single-row request: {missing_model_features}. Retrain with "
                "the same raw feature contract or send the sequence/history required "
                "to compute these features."
            )

        return row.reindex(columns=self.bundle.feature_names)

    def _distribution_warnings(self, features: pd.DataFrame) -> list[str]:
        warnings: list[str] = []
        for feature_name, value in features.iloc[0].items():
            stats = self.bundle.training_stats.get(feature_name)
            if not stats:
                continue
            low = stats.get("p01")
            high = stats.get("p99")
            if low is not None and value < low:
                warnings.append(
                    f"{feature_name}={value:g} is below the training p01 ({low:g})."
                )
            if high is not None and value > high:
                warnings.append(
                    f"{feature_name}={value:g} is above the training p99 ({high:g})."
                )
        return warnings

    def predict(self, reading: EngineReading) -> PredictionResponse:
        features = self._make_feature_frame(reading)
        predicted_rul = float(self.bundle.pipeline.predict(features)[0])
        predicted_rul = round(max(0.0, predicted_rul), 1)
        health_status = classify_health(predicted_rul)

        return PredictionResponse(
            predictedRUL=predicted_rul,
            healthStatus=health_status,
            failureProbability=estimate_failure_probability(
                predicted_rul, self.bundle.target_clip
            ),
            recommendedAction=recommend_action(predicted_rul),
            featureOrder=self.bundle.feature_names,
            warnings=self._distribution_warnings(features),
        )
