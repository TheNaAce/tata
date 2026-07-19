from __future__ import annotations

from pathlib import Path

import numpy as np
import pandas as pd

from .feature_contract import RAW_SENSOR_FEATURES
from .health import classify_health, estimate_failure_probability, recommend_action
from .model_service import RULPredictionService
from .schemas import FleetEngineResponse, FleetMetricsResponse, FleetSummaryResponse

COLUMN_NAMES = (
    ["unit_number", "time_cycles", "setting_1", "setting_2", "setting_3"]
    + [f"sensor_{index}" for index in range(1, 22)]
)

ENGINE_META = [
    ("ENG-06", "VT-AGR", "DEL-LHR"),
    ("ENG-01", "VT-AQF", "DEL-BLR"),
    ("ENG-05", "VT-AXR", "BLR-PNQ"),
    ("ENG-03", "VT-AHM", "HYD-DEL"),
    ("ENG-04", "VT-AMA", "MAA-SIN"),
    ("ENG-02", "VT-ABM", "BOM-DXB"),
]

FALLBACK_READINGS = [
    {
        "setting_1": 0.0023,
        "setting_2": 0.0003,
        "sensor_2": 518.67,
        "sensor_3": 642.85,
        "sensor_4": 1589.70,
        "sensor_6": 14.62,
        "sensor_7": 21.61,
        "sensor_8": 1400.60,
        "sensor_9": 9046.19,
        "sensor_11": 47.47,
        "sensor_12": 392.00,
        "sensor_13": 2388.06,
        "sensor_14": 8138.62,
        "sensor_15": 8.4195,
        "sensor_17": 39.06,
        "sensor_20": 0.03,
        "sensor_21": 0.02,
    },
    {
        "setting_1": -0.0006,
        "setting_2": -0.0002,
        "sensor_2": 518.67,
        "sensor_3": 642.70,
        "sensor_4": 1591.20,
        "sensor_6": 14.62,
        "sensor_7": 21.58,
        "sensor_8": 1402.10,
        "sensor_9": 9051.30,
        "sensor_11": 47.55,
        "sensor_12": 391.88,
        "sensor_13": 2388.08,
        "sensor_14": 8133.80,
        "sensor_15": 8.4310,
        "sensor_17": 393.0,
        "sensor_20": 38.56,
        "sensor_21": 23.17,
    },
    {
        "setting_1": 0.0010,
        "setting_2": 0.0001,
        "sensor_2": 518.67,
        "sensor_3": 642.20,
        "sensor_4": 1586.10,
        "sensor_6": 14.62,
        "sensor_7": 21.72,
        "sensor_8": 1397.90,
        "sensor_9": 9040.40,
        "sensor_11": 47.34,
        "sensor_12": 392.70,
        "sensor_13": 2388.03,
        "sensor_14": 8146.20,
        "sensor_15": 8.4012,
        "sensor_17": 392.0,
        "sensor_20": 38.88,
        "sensor_21": 23.28,
    },
    {
        "setting_1": -0.0001,
        "setting_2": 0.0000,
        "sensor_2": 518.67,
        "sensor_3": 641.95,
        "sensor_4": 1583.75,
        "sensor_6": 14.62,
        "sensor_7": 21.82,
        "sensor_8": 1394.70,
        "sensor_9": 9031.90,
        "sensor_11": 47.21,
        "sensor_12": 393.25,
        "sensor_13": 2388.00,
        "sensor_14": 8156.10,
        "sensor_15": 8.3875,
        "sensor_17": 391.0,
        "sensor_20": 39.08,
        "sensor_21": 23.35,
    },
    {
        "setting_1": 0.0002,
        "setting_2": -0.0001,
        "sensor_2": 518.67,
        "sensor_3": 641.65,
        "sensor_4": 1581.40,
        "sensor_6": 14.62,
        "sensor_7": 21.93,
        "sensor_8": 1392.10,
        "sensor_9": 9022.60,
        "sensor_11": 47.12,
        "sensor_12": 393.76,
        "sensor_13": 2388.00,
        "sensor_14": 8166.30,
        "sensor_15": 8.3710,
        "sensor_17": 391.0,
        "sensor_20": 39.22,
        "sensor_21": 23.44,
    },
    {
        "setting_1": -0.0003,
        "setting_2": 0.0000,
        "sensor_2": 518.67,
        "sensor_3": 641.35,
        "sensor_4": 1579.60,
        "sensor_6": 14.62,
        "sensor_7": 22.05,
        "sensor_8": 1389.90,
        "sensor_9": 9012.50,
        "sensor_11": 47.01,
        "sensor_12": 394.30,
        "sensor_13": 2388.00,
        "sensor_14": 8175.50,
        "sensor_15": 8.3580,
        "sensor_17": 390.0,
        "sensor_20": 39.38,
        "sensor_21": 23.53,
    },
]


def _dataset_root() -> Path:
    return Path(__file__).resolve().parents[2] / "dataset_archive" / "CMaps"


def _load_cmapss_sample() -> tuple[pd.DataFrame, str]:
    train_file = _dataset_root() / "train_FD001.txt"
    if not train_file.exists():
        return pd.DataFrame(FALLBACK_READINGS), "embedded fallback readings"

    frame = pd.read_csv(train_file, sep=r"\s+", header=None, names=COLUMN_NAMES)
    max_cycle = frame.groupby("unit_number")["time_cycles"].transform("max")
    frame["actual_rul"] = max_cycle - frame["time_cycles"]

    targets = [8, 24, 45, 72, 108, 124]
    selected_rows: list[pd.Series] = []
    used_units: set[int] = set()
    for target in targets:
        candidates = frame[~frame["unit_number"].isin(used_units)].copy()
        candidates["distance"] = (candidates["actual_rul"] - target).abs()
        row = candidates.sort_values(["distance", "unit_number", "time_cycles"]).iloc[0]
        used_units.add(int(row["unit_number"]))
        selected_rows.append(row)

    sample = pd.DataFrame(selected_rows).reset_index(drop=True)
    return sample[RAW_SENSOR_FEATURES], str(train_file)


def _feature_frame(service: RULPredictionService, readings: pd.DataFrame) -> pd.DataFrame:
    return readings.astype(np.float64).reindex(columns=service.bundle.feature_names)


def _deviation(feature_name: str, value: float, stats: dict[str, float]) -> float:
    mean = stats.get("mean")
    std = stats.get("std")
    if mean is not None and std not in (None, 0):
        return abs(value - mean) / std

    low = stats.get("p01")
    high = stats.get("p99")
    if low is None or high is None or low == high:
        return 0.0
    if low <= value <= high:
        return 0.0
    return abs(value - min(max(value, low), high)) / abs(high - low)


def _anomaly_details(features: pd.Series, stats_by_feature: dict[str, dict[str, float]]) -> tuple[int, float, str]:
    deviations = []
    for feature_name, value in features.items():
        stats = stats_by_feature.get(feature_name)
        if not stats:
            continue
        deviations.append((feature_name, _deviation(feature_name, float(value), stats)))

    if not deviations:
        return 0, 0.0, "Model confidence baseline"

    top_signal, max_sigma = max(deviations, key=lambda item: item[1])
    anomaly_score = int(round(min(100.0, max_sigma * 22.0)))
    return anomaly_score, round(float(max_sigma), 1), top_signal.replace("_", " ")


def build_fleet_summary(service: RULPredictionService) -> FleetSummaryResponse:
    readings, source = _load_cmapss_sample()
    features = _feature_frame(service, readings)
    predictions = service.bundle.pipeline.predict(features)

    engines: list[FleetEngineResponse] = []
    for index, predicted in enumerate(predictions):
        engine_id, aircraft, route = ENGINE_META[index % len(ENGINE_META)]
        rul = int(round(max(0.0, float(predicted))))
        risk = classify_health(rul)
        anomaly_score, deviation_sigma, top_signal = _anomaly_details(
            features.iloc[index], service.bundle.training_stats
        )
        risk_score = max(anomaly_score, int(round(estimate_failure_probability(rul, service.bundle.target_clip))))

        engines.append(
            FleetEngineResponse(
                id=engine_id,
                aircraft=aircraft,
                route=route,
                rul=rul,
                risk=risk,
                failureProbability=estimate_failure_probability(rul, service.bundle.target_clip),
                anomalyScore=risk_score,
                deviationSigma=deviation_sigma,
                topSignal=top_signal,
                recommendation=recommend_action(rul),
            )
        )

    engines.sort(key=lambda engine: (engine.rul, -engine.anomalyScore))
    total = len(engines)
    critical = sum(engine.risk == "Critical" for engine in engines)
    warning = sum(engine.risk == "Warning" for engine in engines)
    normal = total - critical - warning
    average_rul = int(round(sum(engine.rul for engine in engines) / total))
    health_index = round(
        max(0.0, min(100.0, 100.0 - (critical * 22.0 + warning * 8.0 + average_rul * 0.05))),
        1,
    )

    return FleetSummaryResponse(
        metrics=FleetMetricsResponse(
            totalEngines=total,
            healthIndex=health_index,
            criticalEngines=critical,
            warningEngines=warning,
            normalEngines=normal,
            averageRul=average_rul,
            activeAnomalies=critical + warning,
            maxSigma=max(engine.deviationSigma for engine in engines),
        ),
        engines=engines,
        source=source,
        featureOrder=service.bundle.feature_names,
    )
