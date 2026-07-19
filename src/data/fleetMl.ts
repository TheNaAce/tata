export type EngineRisk = 'Normal' | 'Warning' | 'Critical';

export interface FleetEngine {
  id: string;
  aircraft: string;
  route: string;
  rul: number;
  anomalyScore: number;
  deviationSigma: number;
  topSignal: string;
  health: number;
  risk: EngineRisk;
  failureProbability: number;
  recommendation: string;
}

const rawFleetReadings = [
  { id: 'ENG-06', aircraft: 'VT-AGR', route: 'DEL-LHR', rul: 12, deviationSigma: 4.5, topSignal: 'HPT coolant bleed drop' },
  { id: 'ENG-01', aircraft: 'VT-AQF', route: 'DEL-BLR', rul: 28, deviationSigma: 3.8, topSignal: 'LPT outlet temperature' },
  { id: 'ENG-05', aircraft: 'VT-AXR', route: 'BLR-PNQ', rul: 34, deviationSigma: 2.7, topSignal: 'Fuel flow ratio rise' },
  { id: 'ENG-03', aircraft: 'VT-AHM', route: 'HYD-DEL', rul: 73, deviationSigma: 1.9, topSignal: 'Core speed drift' },
  { id: 'ENG-04', aircraft: 'VT-AMA', route: 'MAA-SIN', rul: 110, deviationSigma: 0.8, topSignal: 'Normal thermal margin' },
  { id: 'ENG-02', aircraft: 'VT-ABM', route: 'BOM-DXB', rul: 121, deviationSigma: 0.4, topSignal: 'Stable baseline' },
];

function riskFromSignals(rul: number, anomalyScore: number): EngineRisk {
  if (rul <= 30 || anomalyScore >= 75) return 'Critical';
  if (rul <= 90 || anomalyScore >= 45) return 'Warning';
  return 'Normal';
}

function recommendationFor(risk: EngineRisk, rul: number): string {
  if (risk === 'Critical') return 'Immediate maintenance required';
  if (risk === 'Warning') return rul <= 50 ? 'Inspect within 50 cycles' : 'Monitor trend';
  return 'Continue normal monitoring';
}

export const fleetEngines: FleetEngine[] = rawFleetReadings
  .map((engine) => {
    const rulRisk = Math.max(0, Math.min(100, 100 - (engine.rul / 125) * 100));
    const deviationRisk = Math.max(0, Math.min(100, (engine.deviationSigma / 5) * 100));
    const anomalyScore = Math.round(rulRisk * 0.55 + deviationRisk * 0.45);
    const health = Math.round(Math.max(0, Math.min(100, 100 - anomalyScore)));
    const risk = riskFromSignals(engine.rul, anomalyScore);
    const failureProbability = Math.round(Math.max(1, Math.min(99, anomalyScore * 0.92 + (risk === 'Critical' ? 8 : 0))));

    return {
      ...engine,
      anomalyScore,
      health,
      risk,
      failureProbability,
      recommendation: recommendationFor(risk, engine.rul),
    };
  })
  .sort((left, right) => {
    const riskOrder: Record<EngineRisk, number> = { Critical: 0, Warning: 1, Normal: 2 };
    return riskOrder[left.risk] - riskOrder[right.risk] || left.rul - right.rul;
  });

export const fleetMetrics = {
  totalEngines: 24,
  normalEngines: 18,
  warningEngines: 4,
  criticalEngines: 2,
  activeAnomalies: 6,
  healthIndex: 78.9,
  averageRul: Math.round(fleetEngines.reduce((sum, engine) => sum + engine.rul, 0) / fleetEngines.length),
  maxSigma: Math.max(...fleetEngines.map((engine) => engine.deviationSigma)),
};

export const modelTrainingSummary = {
  artifact: 'ml_backend/artifacts/rul_xgb_pipeline.joblib',
  datasets: ['FD001', 'FD002', 'FD003', 'FD004'],
  rows: 160359,
  units: 709,
  mae: 12.78,
  rmse: 18.09,
  r2: 0.809,
  target: 'Clipped RUL regression',
};
