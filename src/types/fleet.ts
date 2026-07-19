export type EngineRisk = 'Normal' | 'Warning' | 'Critical';

export interface FleetEngineMl {
  id: string;
  aircraft: string;
  route: string;
  rul: number;
  risk: EngineRisk;
  failureProbability: number;
  anomalyScore: number;
  deviationSigma: number;
  topSignal: string;
  recommendation: string;
}

export interface FleetMetricsMl {
  totalEngines: number;
  healthIndex: number;
  criticalEngines: number;
  warningEngines: number;
  normalEngines: number;
  averageRul: number;
  activeAnomalies: number;
  maxSigma: number;
}

export interface FleetSummaryMl {
  metrics: FleetMetricsMl;
  engines: FleetEngineMl[];
  source: string;
  featureOrder: string[];
}
