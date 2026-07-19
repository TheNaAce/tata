from __future__ import annotations

from typing import Literal

from pydantic import BaseModel, ConfigDict, Field, field_validator

from .feature_contract import RAW_SENSOR_FEATURES


class EngineReading(BaseModel):
    model_config = ConfigDict(extra="forbid")

    setting_1: float = Field(..., description="Operational setting 1")
    setting_2: float = Field(..., description="Operational setting 2")
    sensor_2: float
    sensor_3: float
    sensor_4: float
    sensor_6: float
    sensor_7: float
    sensor_8: float
    sensor_9: float
    sensor_11: float
    sensor_12: float
    sensor_13: float
    sensor_14: float
    sensor_15: float
    sensor_17: float
    sensor_20: float
    sensor_21: float

    @field_validator(*RAW_SENSOR_FEATURES)
    @classmethod
    def must_be_finite(cls, value: float) -> float:
        if value != value or value in (float("inf"), float("-inf")):
            raise ValueError("Value must be finite.")
        return float(value)


class PredictionResponse(BaseModel):
    predictedRUL: float
    healthStatus: Literal["Normal", "Warning", "Critical"]
    failureProbability: float
    recommendedAction: str
    featureOrder: list[str]
    warnings: list[str] = []


class FleetEngineResponse(BaseModel):
    id: str
    aircraft: str
    route: str
    rul: int
    risk: Literal["Normal", "Warning", "Critical"]
    failureProbability: float
    anomalyScore: int
    deviationSigma: float
    topSignal: str
    recommendation: str


class FleetMetricsResponse(BaseModel):
    totalEngines: int
    healthIndex: float
    criticalEngines: int
    warningEngines: int
    normalEngines: int
    averageRul: int
    activeAnomalies: int
    maxSigma: float


class FleetSummaryResponse(BaseModel):
    metrics: FleetMetricsResponse
    engines: list[FleetEngineResponse]
    source: str
    featureOrder: list[str]
