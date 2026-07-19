from __future__ import annotations

import math


def classify_health(predicted_rul: float) -> str:
    if predicted_rul <= 30:
        return "Critical"
    if predicted_rul <= 100:
        return "Warning"
    return "Normal"


def estimate_failure_probability(predicted_rul: float, target_clip: int) -> float:
    """Map RUL to a monotonic risk score without overriding the model prediction."""
    midpoint = max(20.0, target_clip * 0.45)
    scale = max(8.0, target_clip * 0.12)
    probability = 100.0 / (1.0 + math.exp((predicted_rul - midpoint) / scale))
    return round(min(99.0, max(1.0, probability)), 1)


def recommend_action(predicted_rul: float) -> str:
    if predicted_rul <= 30:
        return "Immediate maintenance required"
    if predicted_rul <= 100:
        return "Schedule inspection within 100 operating cycles"
    return "Continue monitoring under normal maintenance schedule"
