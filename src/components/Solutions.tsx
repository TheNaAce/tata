import React, { useEffect, useMemo, useState } from 'react';
import {
  Activity,
  AlertTriangle,
  BarChart3,
  CheckCircle2,
  Gauge,
  RadioTower,
  ShieldCheck,
  TrendingUp,
  Wrench,
} from 'lucide-react';
import { motion } from 'motion/react';
import { useInView } from '../hooks/useInView';
import { fleetEngines } from '../data/fleetMl';
import type { EngineRisk, FleetEngineMl, FleetSummaryMl } from '../types/fleet';

const FLEET_API_URL = import.meta.env.VITE_AEROGUARD_FLEET_API_URL || '/api/fleet-summary';

type DecisionEngine = FleetEngineMl & {
  health: number;
};

const fallbackEngines: DecisionEngine[] = fleetEngines.map((engine) => ({
  id: engine.id,
  aircraft: engine.aircraft,
  route: engine.route,
  rul: engine.rul,
  risk: engine.risk,
  failureProbability: engine.failureProbability,
  anomalyScore: engine.anomalyScore,
  deviationSigma: engine.deviationSigma,
  topSignal: engine.topSignal,
  recommendation: engine.recommendation,
  health: engine.health,
}));

const solutionsList = [
  {
    icon: RadioTower,
    title: 'Telemetry Intake',
    description: 'Normalize engine settings and sensor readings before they enter the ML service.',
    detail: 'Prevents raw JSON drift, missing fields, and wrong feature order.',
  },
  {
    icon: Activity,
    title: 'Anomaly Detection',
    description: 'Detects sensor deviation using health, RUL, and signal drift together.',
    detail: 'Critical when deviation rises above operational baseline.',
  },
  {
    icon: TrendingUp,
    title: 'RUL Prediction',
    description: 'Uses the saved preprocessing pipeline and XGBoost model to estimate cycles remaining.',
    detail: 'Dashboard risk labels are derived from model output.',
  },
  {
    icon: BarChart3,
    title: 'Fleet Prioritization',
    description: 'Ranks engines so maintenance teams know which aircraft need attention first.',
    detail: 'Combines predicted RUL, health score, and anomaly severity.',
  },
];

function getRiskStyle(risk: EngineRisk) {
  if (risk === 'Critical') {
    return {
      label: 'Critical',
      className: 'bg-rose-50 text-rose-700 border-rose-200',
      icon: AlertTriangle,
    };
  }
  if (risk === 'Warning') {
    return {
      label: 'Warning',
      className: 'bg-amber-50 text-amber-700 border-amber-200',
      icon: Wrench,
    };
  }
  return {
    label: 'Normal',
    className: 'bg-emerald-50 text-emerald-700 border-emerald-200',
    icon: CheckCircle2,
  };
}

function MetricTile({
  icon: Icon,
  label,
  value,
}: {
  icon: React.ElementType;
  label: string;
  value: string;
}) {
  return (
    <div className="bg-white rounded-xl border border-gray-200/70 p-4">
      <Icon size={18} className="text-[#202A36] mb-3" />
      <div className="text-lg font-semibold text-gray-900 font-mono">{value}</div>
      <div className="text-xs text-gray-500 uppercase tracking-wider font-semibold mt-1">{label}</div>
    </div>
  );
}

export function Solutions() {
  const [ref, isInView] = useInView({ threshold: 0.1 });
  const [selectedEngineId, setSelectedEngineId] = useState('ENG-06');
  const [expandedCard, setExpandedCard] = useState<number | null>(0);
  const [fleetSummary, setFleetSummary] = useState<FleetSummaryMl | null>(null);
  const [fleetError, setFleetError] = useState<string | null>(null);

  useEffect(() => {
    let isMounted = true;

    fetch(FLEET_API_URL)
      .then(async (response) => {
        if (!response.ok) {
          const errorPayload = await response.json().catch(() => null);
          throw new Error(errorPayload?.detail || `Fleet summary request failed with status ${response.status}`);
        }
        return response.json() as Promise<FleetSummaryMl>;
      })
      .then((summary) => {
        if (!isMounted) return;
        setFleetSummary(summary);
        setFleetError(null);
        if (summary.engines.length > 0) {
          setSelectedEngineId(summary.engines[0].id);
        }
      })
      .catch((err) => {
        if (!isMounted) return;
        console.error('Error loading solution ML summary:', err);
        setFleetError(err instanceof Error ? err.message : 'Fleet ML service unavailable');
      });

    return () => {
      isMounted = false;
    };
  }, []);

  const enginesList = useMemo<DecisionEngine[]>(() => {
    if (!fleetSummary?.engines.length) return fallbackEngines;
    return fleetSummary.engines.map((engine) => ({
      ...engine,
      health: Math.max(0, Math.min(100, Math.round(100 - engine.failureProbability))),
    }));
  }, [fleetSummary]);

  const currentEngine = enginesList.find((engine) => engine.id === selectedEngineId) || enginesList[0];
  const risk = useMemo(() => getRiskStyle(currentEngine.risk), [currentEngine.risk]);
  const RiskIcon = risk.icon;
  const diagnosticTitle = `${currentEngine.topSignal} risk profiling`;

  return (
    <section id="solutions-section" className="relative py-16 bg-gray-50">
      <div className="max-w-7xl mx-auto px-8">
        <div className="flex flex-col items-center text-center mb-14">
          <span className="text-sm font-semibold text-gray-600 tracking-wider mb-4 uppercase">
            SYSTEM ARCHITECTURE
          </span>
          <h2 className="flex flex-col items-center mb-6 select-none">
            <span className="text-5xl md:text-6xl lg:text-7xl font-normal text-gray-500 leading-none tracking-tighter">
              Detect.
            </span>
            <span className="text-5xl md:text-6xl lg:text-7xl font-normal text-[#202A36] leading-none tracking-tighter -mt-[12px]">
              Decide.
            </span>
          </h2>
          <p className="text-lg md:text-xl text-gray-600 max-w-2xl mx-auto font-normal">
            A clear pipeline from engine telemetry to maintenance action.
          </p>
        </div>

        <div ref={ref as any} className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-12">
          {solutionsList.map((solution, index) => {
            const Icon = solution.icon;
            const isExpanded = expandedCard === index;
            return (
              <motion.button
                key={solution.title}
                type="button"
                initial={{ opacity: 0, y: 18 }}
                animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 18 }}
                transition={{ duration: 0.5, delay: index * 0.08, ease: 'easeOut' }}
                onClick={() => setExpandedCard(isExpanded ? null : index)}
                className={`text-left bg-white rounded-2xl p-6 border transition-all duration-300 ${
                  isExpanded ? 'border-[#202A36] shadow-md' : 'border-gray-200/70 hover:border-gray-300 hover:shadow-sm'
                }`}
              >
                <div className="w-11 h-11 rounded-xl bg-gray-100 flex items-center justify-center text-[#202A36] mb-5">
                  <Icon size={23} />
                </div>
                <h3 className="text-base font-semibold text-gray-900 mb-2">{solution.title}</h3>
                <p className="text-sm text-gray-600 leading-relaxed">{solution.description}</p>
                <div className={`overflow-hidden transition-all duration-300 ${isExpanded ? 'max-h-20 opacity-100 mt-4' : 'max-h-0 opacity-0'}`}>
                  <div className="pt-3 border-t border-gray-200 text-xs font-semibold text-[#202A36] uppercase tracking-wide">
                    {solution.detail}
                  </div>
                </div>
              </motion.button>
            );
          })}
        </div>

        <div className="bg-white rounded-2xl border border-gray-200/70 p-6 md:p-8 shadow-sm">
          <div className="grid lg:grid-cols-[320px_1fr] gap-8">
            <div>
              <span className="text-xs font-semibold text-gray-400 uppercase tracking-wider">Engine Scenario</span>
              <h3 className="text-2xl font-semibold text-gray-900 mt-1">Maintenance Decision View</h3>
              <p className="text-sm text-gray-500 mt-2">
                Select a model-ranked engine and see how AeroGuard turns telemetry into a risk tier and action.
              </p>
              {fleetError && (
                <div className="mt-4 rounded-xl border border-amber-200 bg-amber-50 px-3 py-2 text-xs text-amber-800">
                  ML fleet service unavailable. Showing cached sample values.
                </div>
              )}

              <div className="space-y-3 mt-6">
                {enginesList.map((engine) => {
                  const engineRisk = getRiskStyle(engine.risk);
                  return (
                    <button
                      key={engine.id}
                      type="button"
                      onClick={() => setSelectedEngineId(engine.id)}
                      className={`w-full text-left p-4 rounded-xl border transition-all duration-200 ${
                        selectedEngineId === engine.id
                          ? 'bg-gray-50 border-gray-900 shadow-sm'
                          : 'bg-white border-gray-200 hover:bg-gray-50'
                      }`}
                    >
                      <div className="flex items-start justify-between gap-3">
                        <div>
                          <div className="text-sm font-semibold text-gray-900">{engine.id}</div>
                          <div className="text-xs text-gray-500 font-mono uppercase mt-1">{engine.aircraft} / {engine.route}</div>
                        </div>
                        <span className={`text-xs font-semibold px-2 py-1 rounded-full border ${engineRisk.className}`}>
                          {engineRisk.label}
                        </span>
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>

            <div className="bg-gray-50 rounded-2xl border border-gray-200/70 p-5 md:p-6">
              <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-4 pb-5 border-b border-gray-200">
                <div>
                  <div className="flex items-center gap-2 text-xs font-semibold text-gray-500 uppercase tracking-wider">
                    <ShieldCheck size={16} />
                    Active ML Diagnostic Model
                  </div>
                  <h4 className="text-xl font-semibold text-gray-900 mt-2">{diagnosticTitle}</h4>
                </div>
                <span className={`inline-flex items-center gap-2 text-sm font-semibold px-3 py-1.5 rounded-full border ${risk.className}`}>
                  <RiskIcon size={16} />
                  {risk.label}
                </span>
              </div>

              <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mt-5">
                <MetricTile icon={TrendingUp} label="Predicted RUL" value={`${currentEngine.rul} cycles`} />
                <MetricTile icon={Gauge} label="Failure Risk" value={`${currentEngine.failureProbability}%`} />
                <MetricTile icon={Activity} label="Sensor Drift" value={`${currentEngine.deviationSigma.toFixed(1)} sigma`} />
                <MetricTile icon={AlertTriangle} label="Anomaly Score" value={`${currentEngine.anomalyScore}%`} />
              </div>

              <div className="grid md:grid-cols-2 gap-4 mt-5">
                <div className="bg-white rounded-xl border border-gray-200/70 p-4">
                  <div className="flex justify-between text-sm font-semibold mb-2">
                    <span className="text-gray-700">Health score</span>
                    <span className="text-gray-900">{currentEngine.health}%</span>
                  </div>
                  <div className="h-2.5 bg-gray-200 rounded-full overflow-hidden">
                    <motion.div
                      className={currentEngine.health < 50 ? 'h-full bg-rose-500' : currentEngine.health < 75 ? 'h-full bg-amber-500' : 'h-full bg-emerald-500'}
                      initial={{ width: 0 }}
                      animate={{ width: `${currentEngine.health}%` }}
                      transition={{ duration: 0.6 }}
                    />
                  </div>
                </div>

                <div className="bg-white rounded-xl border border-gray-200/70 p-4">
                  <div className="flex justify-between text-sm font-semibold mb-2">
                    <span className="text-gray-700">Anomaly score</span>
                    <span className="text-gray-900">{currentEngine.anomalyScore}%</span>
                  </div>
                  <div className="h-2.5 bg-gray-200 rounded-full overflow-hidden">
                    <motion.div
                      className={currentEngine.anomalyScore >= 60 ? 'h-full bg-rose-500' : currentEngine.anomalyScore >= 30 ? 'h-full bg-amber-500' : 'h-full bg-emerald-500'}
                      initial={{ width: 0 }}
                      animate={{ width: `${currentEngine.anomalyScore}%` }}
                      transition={{ duration: 0.6 }}
                    />
                  </div>
                </div>
              </div>

              <div className="mt-5 bg-[#202A36] text-white rounded-xl p-5">
                <div className="flex items-start gap-3">
                  <Wrench size={20} className="text-amber-300 shrink-0 mt-0.5" />
                  <div>
                    <div className="text-sm font-semibold mb-1">Recommended action</div>
                    <p className="text-sm text-gray-200 leading-relaxed">{currentEngine.recommendation}</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
