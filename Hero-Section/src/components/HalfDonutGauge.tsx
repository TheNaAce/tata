import { motion } from 'motion/react';
import { useInView } from '../hooks/useInView';

export function HalfDonutGauge() {
  const [ref, isInView] = useInView({ threshold: 0.2 });

  // Radius = 80, Center = (100, 100)
  // Arc length = PI * r = 3.14159 * 80 ≈ 251.327
  const pathLength = 251.327;
  // Fill 78.9% of the health index gauge
  const fillPercentage = 0.789;
  const targetOffset = pathLength * (1 - fillPercentage);

  return (
    <div
      ref={ref as any}
      className="bg-gray-100 rounded-2xl p-8 flex flex-col items-center justify-center relative w-full h-full min-h-[350px] border border-gray-200/50"
    >
      <h3 className="text-xl font-semibold text-gray-900 mb-6 text-center">Fleet Distribution</h3>

      <div className="relative w-56 h-36 flex items-center justify-center">
        <svg viewBox="0 0 200 120" className="w-full h-full">
          <defs>
            {/* Rainbow gradient for active arc */}
            <linearGradient id="rainbowGrad" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="#ef4444" /> {/* Red */}
              <stop offset="30%" stopColor="#a855f7" /> {/* Purple */}
              <stop offset="60%" stopColor="#3b82f6" /> {/* Blue */}
              <stop offset="85%" stopColor="#14b8a6" /> {/* Teal */}
              <stop offset="100%" stopColor="#22c55e" /> {/* Green */}
            </linearGradient>

            {/* Inner glow or shadow effect if needed */}
          </defs>

          {/* Background Arc */}
          <path
            d="M 20 100 A 80 80 0 0 1 180 100"
            fill="none"
            stroke="#e5e7eb"
            strokeWidth="16"
            strokeLinecap="round"
          />

          {/* Animated Rainbow Foreground Arc */}
          <motion.path
            d="M 20 100 A 80 80 0 0 1 180 100"
            fill="none"
            stroke="url(#rainbowGrad)"
            strokeWidth="16"
            strokeLinecap="round"
            strokeDasharray={pathLength}
            initial={{ strokeDashoffset: pathLength }}
            animate={isInView ? { strokeDashoffset: targetOffset } : { strokeDashoffset: pathLength }}
            transition={{ duration: 1.5, ease: 'easeOut' }}
          />
        </svg>

        {/* Live HUD text inside the gauge */}
        <div className="absolute bottom-2 flex flex-col items-center justify-center">
          <span className="text-3xl font-bold text-gray-900 tracking-tight">78.9%</span>
          <span className="text-[10px] font-semibold text-gray-500 uppercase tracking-wider">Overall Health</span>
        </div>
      </div>

      {/* Legend below gauge */}
      <div className="w-full max-w-[240px] mt-6 flex flex-col gap-3">
        <div className="flex items-center justify-between py-1 border-b border-gray-200/50">
          <div className="flex items-center gap-2.5">
            <span className="w-3 h-3 rounded-full bg-emerald-500 shadow-sm"></span>
            <span className="text-sm font-medium text-gray-700">Normal</span>
          </div>
          <span className="text-xs font-semibold text-gray-500 bg-gray-200/60 px-2 py-0.5 rounded-full">18 Engines</span>
        </div>
        <div className="flex items-center justify-between py-1 border-b border-gray-200/50">
          <div className="flex items-center gap-2.5">
            <span className="w-3 h-3 rounded-full bg-blue-500 shadow-sm"></span>
            <span className="text-sm font-medium text-gray-700">Warning</span>
          </div>
          <span className="text-xs font-semibold text-gray-500 bg-gray-200/60 px-2 py-0.5 rounded-full">4 Engines</span>
        </div>
        <div className="flex items-center justify-between py-1">
          <div className="flex items-center gap-2.5">
            <span className="w-3 h-3 rounded-full bg-rose-500 shadow-sm"></span>
            <span className="text-sm font-medium text-gray-700">Critical</span>
          </div>
          <span className="text-xs font-semibold text-rose-600 bg-rose-50 px-2 py-0.5 rounded-full">2 Engines</span>
        </div>
      </div>
    </div>
  );
}
