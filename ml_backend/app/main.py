from __future__ import annotations

import os
from functools import lru_cache
from pathlib import Path

from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware

from .fleet_service import build_fleet_summary
from .model_service import RULPredictionService
from .schemas import EngineReading, FleetSummaryResponse, PredictionResponse

DEFAULT_ARTIFACT_PATH = (
    Path(__file__).resolve().parents[1] / "artifacts" / "rul_xgb_pipeline.joblib"
)

app = FastAPI(title="AeroGuard AI RUL Prediction API", version="1.0.0")

app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://127.0.0.1:3000",
        "http://localhost:3000",
        "http://127.0.0.1:5173",
        "http://localhost:5173",
    ],
    allow_credentials=True,
    allow_methods=["POST", "GET"],
    allow_headers=["*"],
)


@lru_cache(maxsize=1)
def get_prediction_service() -> RULPredictionService:
    artifact_path = Path(os.getenv("AEROGUARD_MODEL_ARTIFACT", DEFAULT_ARTIFACT_PATH))
    return RULPredictionService(artifact_path)


@app.get("/health")
def health() -> dict[str, str]:
    try:
        service = get_prediction_service()
    except Exception as exc:
        raise HTTPException(status_code=503, detail=str(exc)) from exc
    return {"status": "ok", "artifact": str(service.bundle.artifact_path)}


@app.post("/predict", response_model=PredictionResponse)
def predict(reading: EngineReading) -> PredictionResponse:
    try:
        return get_prediction_service().predict(reading)
    except FileNotFoundError as exc:
        raise HTTPException(status_code=503, detail=str(exc)) from exc
    except ValueError as exc:
        raise HTTPException(status_code=422, detail=str(exc)) from exc


@app.get("/fleet-summary", response_model=FleetSummaryResponse)
def fleet_summary() -> FleetSummaryResponse:
    try:
        return build_fleet_summary(get_prediction_service())
    except FileNotFoundError as exc:
        raise HTTPException(status_code=503, detail=str(exc)) from exc
    except ValueError as exc:
        raise HTTPException(status_code=422, detail=str(exc)) from exc
