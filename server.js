import 'dotenv/config';
import express from 'express';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const app = express();
const port = Number(process.env.PORT || 3001);
const fastApiPredictUrl = process.env.FASTAPI_PREDICT_URL || 'http://127.0.0.1:8000/predict';
const fastApiFleetUrl = process.env.FASTAPI_FLEET_URL || fastApiPredictUrl.replace(/\/predict$/, '/fleet-summary');
const __dirname = path.dirname(fileURLToPath(import.meta.url));

app.use(express.json({ limit: '32kb' }));

app.get('/api/health', async (_req, res) => {
  try {
    const response = await fetch(fastApiPredictUrl.replace(/\/predict$/, '/health'));
    const payload = await response.json();
    res.status(response.status).json(payload);
  } catch (error) {
    res.status(503).json({
      detail: error instanceof Error ? error.message : 'FastAPI service unavailable',
    });
  }
});

app.post('/api/predict', async (req, res) => {
  try {
    const response = await fetch(fastApiPredictUrl, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(req.body),
    });
    const payload = await response.json();
    res.status(response.status).json(payload);
  } catch (error) {
    res.status(503).json({
      detail: error instanceof Error ? error.message : 'FastAPI service unavailable',
    });
  }
});

app.get('/api/fleet-summary', async (_req, res) => {
  try {
    const response = await fetch(fastApiFleetUrl);
    const payload = await response.json();
    res.status(response.status).json(payload);
  } catch (error) {
    res.status(503).json({
      detail: error instanceof Error ? error.message : 'FastAPI fleet service unavailable',
    });
  }
});

app.use(express.static(path.join(__dirname, 'dist')));
app.get('*', (_req, res) => {
  res.sendFile(path.join(__dirname, 'dist', 'index.html'));
});

app.listen(port, () => {
  console.log(`AeroGuard web server listening on http://127.0.0.1:${port}`);
  console.log(`Forwarding predictions to ${fastApiPredictUrl}`);
  console.log(`Forwarding fleet summaries to ${fastApiFleetUrl}`);
});
