import { AlertTriangle, Gauge, Sigma, TrendingUp } from 'lucide-react';
import { motion } from 'motion/react';
import { fleetEngines, fleetMetrics, type EngineRisk, type FleetEngine } from '../data/fleetMl';
import { useInView } from '../hooks/useInView';
import type { FleetSummaryMl } from '../types/fleet';

const riskClasses: Record<EngineRisk, string> = {
  Normal: 'bg-emerald-50 text-emerald-700 border-emerald-200',
  Warning: 'bg-amber-50 text-amber-700 border-amber-200',
  Critical: 'bg-rose-50 text-rose-700 border-rose-200',
};

const barClasses: Record<EngineRisk, string> = {
  Normal: 'bg-emerald-500',
  Warning: 'bg-amber-500',
  Critical: 'bg-rose-500',
};

type EngineRowData = Pick<FleetEngine, 'id' | 'route' | 'rul' | 'anomalyScore' | 'topSignal' | 'risk'>;

function EngineRow({ engine, trigger }: { key?: string; engine: EngineRowData; trigger: boolean }) {
  return (
    <div className="grid grid-cols-[72px_1fr_62px_92px] gap-3 items-center py-2.5 border-b border-gray-200/70 last:border-0">
      <div>
        <div className="text-sm font-semibold text-gray-900">{engine.id}</div>
        <div className="text-[11px] text-gray-500 font-mono">{engine.route}</div>
      </div>

      <div>
        <div className="flex items-center gap-2">
          <div className="h-2 bg-gray-200 rounded-full overflow-hidden flex-1">
            <motion.div
              className={`h-full rounded-full ${barClasses[engine.risk]}`}
              initial={{ width: 0 }}
              animate={trigger ? { width: `${engine.anomalyScore}%` } : { width: 0 }}
              transition={{ duration: 0.8, ease: 'easeOut' }}
            />
          </div>
          <span className="text-xs font-semibold text-gray-900 w-8 text-right">{engine.anomalyScore}</span>
        </div>
        <div className="text-xs text-gray-500 mt-1 truncate">{engine.topSignal}</div>
      </div>

      <div className="text-right">
        <div className="text-sm font-semibold text-gray-900">{engine.rul}</div>
        <div className="text-[11px] text-gray-500">cycles</div>
      </div>

      <div className="flex justify-end">
        <span className={`text-[11px] font-semibold px-2 py-1 rounded-full border ${riskClasses[engine.risk]}`}>
          {engine.risk}
        </span>
      </div>
    </div>
  );
}

interface AnomalyPanelProps {
  fleetSummary?: FleetSummaryMl | null;
  isLoading?: boolean;
  error?: string | null;
}

export function AnomalyPanel({ fleetSummary, isLoading = false, error = null }: AnomalyPanelProps) {
  const [ref, isInView] = useInView({ threshold: 0.1 });
  const metrics = fleetSummary?.metrics ?? fleetMetrics;
  const engines = fleetSummary?.engines ?? fleetEngines;

  return (
    <div ref={ref as any} className="bg-white rounded-2xl p-5 border border-gray-200/70 shadow-sm h-full">
      <div className="flex items-start justify-between gap-4 mb-4">
        <div>
          <h3 className="text-xl font-semibold text-gray-900">ML Anomaly Ranking</h3>
        </div>
        <span className="inline-flex items-center gap-1.5 text-xs font-semibold text-rose-700 bg-rose-50 border border-rose-200 px-3 py-1.5 rounded-full">
          <AlertTriangle size={14} />
          {metrics.criticalEngines} critical
        </span>
      </div>

      {error && (
        <div className="mb-4 rounded-xl border border-amber-200 bg-amber-50 px-3 py-2 text-xs text-amber-800">
          ML fleet service unavailable. Showing cached sample values.
        </div>
      )}

      <div className="grid grid-cols-3 gap-3 mb-4">
        <div className="bg-gray-50 rounded-xl border border-gray-200/70 p-3">
          <Gauge size={15} className="text-emerald-600 mb-1.5" />
          <div className="text-lg font-semibold text-gray-900">{metrics.healthIndex}%</div>
          <div className="text-xs text-gray-500">Fleet health</div>
        </div>
        <div className="bg-gray-50 rounded-xl border border-gray-200/70 p-3">
          <TrendingUp size={15} className="text-amber-600 mb-1.5" />
          <div className="text-lg font-semibold text-gray-900">{metrics.averageRul}</div>
          <div className="text-xs text-gray-500">Avg RUL</div>
        </div>
        <div className="bg-gray-50 rounded-xl border border-gray-200/70 p-3">
          <Sigma size={15} className="text-blue-600 mb-1.5" />
          <div className="text-lg font-semibold text-gray-900">{metrics.maxSigma.toFixed(1)}</div>
          <div className="text-xs text-gray-500">Max sigma</div>
        </div>
      </div>

      <div className="bg-gray-50 rounded-xl border border-gray-200/70 px-4 max-h-[360px] overflow-y-auto">
        {isLoading && (
          <div className="py-4 text-sm text-gray-500">Loading model-ranked engines...</div>
        )}
        {!isLoading && engines.map((engine) => (
          <EngineRow key={engine.id} engine={engine} trigger={isInView} />
        ))}
      </div>
    </div>
  );
}
