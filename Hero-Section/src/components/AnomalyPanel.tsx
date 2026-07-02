import { motion } from 'motion/react';
import { useInView } from '../hooks/useInView';

interface ProgressBarProps {
  key?: string | number;
  label: string;
  percentage: number;
  fillClass: string;
  trigger: boolean;
}

function ProgressBar({ label, percentage, fillClass, trigger }: ProgressBarProps) {
  return (
    <div className="group relative flex flex-col mb-4 last:mb-0">
      <div className="flex justify-between items-center mb-1.5">
        <span className="text-xs font-semibold text-gray-500 uppercase tracking-wider">{label}</span>
        {/* Tooltip showing the percentage on hover */}
        <div className="opacity-0 group-hover:opacity-100 transition-opacity duration-200 bg-[#202A36] text-white text-[11px] font-mono px-2 py-0.5 rounded shadow-md pointer-events-none absolute right-0 -top-1">
          {percentage}% Health
        </div>
      </div>
      
      {/* Track */}
      <div className="bg-white h-3 w-full rounded-full shadow-inner overflow-hidden border border-gray-200/40 relative">
        {/* Fill */}
        <motion.div
          className={`h-full rounded-full ${fillClass}`}
          initial={{ width: 0 }}
          animate={trigger ? { width: `${percentage}%` } : { width: 0 }}
          transition={{ duration: 1.2, ease: 'easeOut' }}
        />
      </div>
    </div>
  );
}

export function AnomalyPanel() {
  const [ref, isInView] = useInView({ threshold: 0.1 });

  const enginesData = [
    { label: 'Engine 01', percentage: 21, fillClass: 'bg-red-500' },
    { label: 'Engine 02', percentage: 98, fillClass: 'bg-green-500' },
    { label: 'Engine 03', percentage: 50, fillClass: 'bg-gradient-to-r from-blue-500 to-green-500' },
    { label: 'Engine 04', percentage: 82, fillClass: 'bg-gradient-to-r from-blue-500 via-teal-500 to-green-500' },
    { label: 'Engine 05', percentage: 29, fillClass: 'bg-gradient-to-r from-red-500 to-[#202A36]' },
    { label: 'Engine 06', percentage: 7, fillClass: 'bg-[#4a0e17]' }, // Dark Maroon
  ];

  return (
    <div
      ref={ref as any}
      className="bg-gray-100 rounded-2xl p-8 border border-gray-200/50"
    >
      <h3 className="text-xl font-semibold text-gray-900 mb-6">Fleet Health Index</h3>
      
      <div className="flex flex-col gap-2">
        {enginesData.map((engine, idx) => (
          <ProgressBar
            key={idx}
            label={engine.label}
            percentage={engine.percentage}
            fillClass={engine.fillClass}
            trigger={isInView}
          />
        ))}
      </div>
    </div>
  );
}
