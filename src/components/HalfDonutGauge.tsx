import { AlertCircle, AlertTriangle, CheckCircle2 } from 'lucide-react';
import { motion } from 'motion/react';
import { fleetMetrics } from '../data/fleetMl';
import { useInView } from '../hooks/useInView';
import type { FleetSummaryMl } from '../types/fleet';

export function HalfDonutGauge({ fleetSummary }: { fleetSummary?: FleetSummaryMl | null }) {
  const [ref, isInView] = useInView({ threshold: 0.2 });
  const metrics = fleetSummary?.metrics ?? fleetMetrics;
  const pathLength = 251.327;
  const targetOffset = pathLength * (1 - metrics.healthIndex / 100);

  const distribution = [
    { label: 'Normal', count: metrics.normalEngines, color: 'bg-emerald-500', icon: CheckCircle2, text: 'text-emerald-700' },
    { label: 'Warning', count: metrics.warningEngines, color: 'bg-amber-500', icon: AlertCircle, text: 'text-amber-700' },
    { label: 'Critical', count: metrics.criticalEngines, color: 'bg-rose-500', icon: AlertTriangle, text: 'text-rose-700' },
  ];

  return (
    <div
      ref={ref as any}
      className="bg-white rounded-2xl p-5 flex flex-col border border-gray-200/70 shadow-sm h-full"
    >
      <div className="flex items-start justify-between gap-4">
        <div>
          <h3 className="text-xl font-semibold text-gray-900">Fleet Risk Mix</h3>
        </div>
      </div>

      <div className="relative w-56 h-34 flex items-center justify-center mx-auto my-5">
        <svg viewBox="0 0 200 120" className="w-full h-full">
          <defs>
            <linearGradient id="fleetRiskGrad" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="#f43f5e" />
              <stop offset="48%" stopColor="#f59e0b" />
              <stop offset="100%" stopColor="#10b981" />
            </linearGradient>
          </defs>
          <path d="M 20 100 A 80 80 0 0 1 180 100" fill="none" stroke="#e5e7eb" strokeWidth="18" strokeLinecap="round" />
          <motion.path
            d="M 20 100 A 80 80 0 0 1 180 100"
            fill="none"
            stroke="url(#fleetRiskGrad)"
            strokeWidth="18"
            strokeLinecap="round"
            strokeDasharray={pathLength}
            initial={{ strokeDashoffset: pathLength }}
            animate={isInView ? { strokeDashoffset: targetOffset } : { strokeDashoffset: pathLength }}
            transition={{ duration: 1.2, ease: 'easeOut' }}
          />
        </svg>

        <div className="absolute bottom-2 flex flex-col items-center">
          <span className="text-4xl font-semibold text-gray-900 tracking-tight">{metrics.healthIndex}%</span>
          <span className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Fleet Health</span>
        </div>
      </div>

      <div className="space-y-2.5">
        {distribution.map((item) => {
          const Icon = item.icon;
          const width = metrics.totalEngines > 0 ? (item.count / metrics.totalEngines) * 100 : 0;
          return (
            <div key={item.label} className="p-3 bg-gray-50 rounded-xl border border-gray-200/70">
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-2.5">
                  <span className={`w-2.5 h-2.5 rounded-full ${item.color}`} />
                  <span className="text-sm font-semibold text-gray-900">{item.label}</span>
                </div>
                <div className={`flex items-center gap-2 font-semibold ${item.text}`}>
                  <Icon size={16} />
                  <span>{item.count}</span>
                </div>
              </div>
              <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
                <motion.div
                  className={`h-full ${item.color}`}
                  initial={{ width: 0 }}
                  animate={isInView ? { width: `${width}%` } : { width: 0 }}
                  transition={{ duration: 0.8 }}
                />
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
