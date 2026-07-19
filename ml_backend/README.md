# AeroGuard AI ML Backend

This FastAPI service is intentionally strict about the ML contract:

- training and inference use the same ordered feature list
- preprocessing is saved inside the model artifact whenever scaling is needed
- inference builds a Pandas `DataFrame` by column name, then reindexes to the training order
- missing, non-finite, or out-of-distribution inputs are surfaced in the API response
- health status, failure probability, and recommendation are derived from the predicted RUL

## Train a new artifact

Place the NASA C-MAPSS files somewhere local, then run either the full archive training command or a single-subset command.

```powershell
python -m pip install -r ml_backend/requirements.txt
python ml_backend/training/train_cmapss_xgboost.py --train-dir dataset_archive\CMaps --artifact ml_backend/artifacts/rul_xgb_pipeline.joblib
```

For FD001-only training:

```powershell
python ml_backend/training/train_cmapss_xgboost.py --train-file dataset_archive\CMaps\train_FD001.txt --artifact ml_backend/artifacts/rul_xgb_pipeline.joblib
```

The artifact is a single Joblib bundle with:

- `pipeline`: fitted preprocessing + XGBoost regressor
- `feature_names`: exact ordered feature names expected at inference
- `training_stats`: quantiles used to warn about out-of-distribution manual inputs
- `target_clip`: RUL cap used during training

## Run the API

```powershell
python -m uvicorn app.main:app --app-dir ml_backend --reload --host 127.0.0.1 --port 8000
```

Set `AEROGUARD_MODEL_ARTIFACT` if the model lives somewhere else.
