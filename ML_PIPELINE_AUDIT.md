# AeroGuard AI ML Pipeline Audit

## What was present

The supplied package contained a React/Vite dashboard only. It did not include:

- Jupyter notebook training code
- NASA C-MAPSS files
- FastAPI service
- Node API proxy
- saved XGBoost model
- saved scaler/preprocessing objects
- feature-name metadata

Because those artifacts were absent, the actual trained model could not be verified against the notebook. The project was refactored to prevent the common failure mode that likely caused the reported result: inference silently passing raw or misordered values into a model trained with a different feature contract.

## Issues fixed

1. **No enforceable feature order**

   The React form sent a plain JSON object. A model loaded from Joblib has no guarantee that incoming values are aligned to the training feature order unless the backend explicitly reorders by saved feature names.

   **Fix:** `ml_backend/app/model_service.py` builds a Pandas row by field name and reindexes it to `feature_names` saved in the artifact.

2. **Scaler/preprocessing could be skipped**

   If the notebook fit a `StandardScaler` separately and only saved the XGBoost model, FastAPI would feed raw values to a model trained on scaled values.

   **Fix:** `ml_backend/training/train_cmapss_xgboost.py` saves a single sklearn `Pipeline` containing `StandardScaler` and `XGBRegressor`.

3. **Training metadata was not available at inference**

   Without saved feature names and training ranges, the API cannot detect wrong columns, missing engineered columns, or manual values outside the C-MAPSS distribution.

   **Fix:** the training script saves `feature_names`, `training_stats`, `target_clip`, and validation metrics with the model.

4. **Single-row manual input cannot reproduce sequence features**

   If the notebook used rolling means, deltas, lags, unit-cycle features, or window statistics, a single dashboard form row cannot compute those safely.

   **Fix:** the FastAPI service refuses artifacts that expect engineered features unavailable from the request. It returns a 422 error explaining which features are missing instead of generating misleading predictions.

5. **Dashboard swallowed API failures**

   The UI only logged prediction errors to the console.

   **Fix:** `FleetDashboard.tsx` now shows API/model-contract failures and out-of-distribution warnings to the user.

6. **No Node backend layer**

   The requested React → Node → FastAPI path was absent.

   **Fix:** `server.js` adds an Express proxy at `/api/predict` and `/api/health`, forwarding responses and error details from FastAPI.

## Important model note

C-MAPSS manual values can easily be outside the training distribution or physically inconsistent as a single snapshot. A severe-looking sensor combination will not necessarily produce critical RUL if:

- the values are outside the NASA training distribution
- the notebook trained on normalized values but inference sends raw values
- feature order differs between training and inference
- the model was trained with capped RUL targets and no near-failure examples matching the manual input
- the model expects time-window degradation patterns, but the UI sends only one row

The corrected backend exposes those problems instead of hiding them.
