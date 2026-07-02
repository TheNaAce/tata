import React, { useState, useEffect } from 'react';
import { Activity, TrendingUp, Gauge, ShieldCheck, Heart, Zap, RefreshCw, ChevronDown } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { useInView } from '../hooks/useInView';

interface EngineConfig {
  id: string;
  name: string;
  category: string;
  egt: number;
  rpm: number;
  vibration: number;
  pressure: number;
  health: number;
  primarySolution: string;
}

export function Solutions() {
  const [ref, isInView] = useInView({ threshold: 0.1 });
  const [selectedEngineId, setSelectedEngineId] = useState('turbofan');
  const [diagnosticActive, setDiagnosticActive] = useState(false);
  const [diagnosticProgress, setDiagnosticProgress] = useState(0);
  const [diagnosticResult, setDiagnosticResult] = useState<'normal' | 'optimal' | 'warning' | null>(null);
  const [expandedCard, setExpandedCard] = useState<number | null>(null);

  const enginesList: EngineConfig[] = [
    {
      id: 'turbofan',
      name: 'GE90-115B Turbofan',
      category: 'Commercial Widebody',
      egt: 692,
      rpm: 92.4,
      vibration: 0.44,
      pressure: 82,
      health: 96,
      primarySolution: 'Thermal Margin Profiling & Turbine Anomaly Detection',
    },
    {
      id: 'turboprop',
      name: 'PW150 Turboprop',
      category: 'Regional Commuter',
      egt: 580,
      rpm: 88.1,
      vibration: 1.15,
      pressure: 64,
      health: 91,
      primarySolution: 'Vibration Spectral Analysis & Blade Pitch Diagnostics',
    },
    {
      id: 'turbojet',
      name: 'F110-GE-129 Turbojet',
      category: 'Tactical Defense',
      egt: 820,
      rpm: 98.7,
      vibration: 0.88,
      pressure: 95,
      health: 89,
      primarySolution: 'High-Transient Signal Decoding & Core Stall Diagnostics',
    },
  ];

  const currentEngine = enginesList.find((eng) => eng.id === selectedEngineId) || enginesList[0];

  const runDiagnostic = () => {
    setDiagnosticActive(true);
    setDiagnosticProgress(0);
    setDiagnosticResult(null);
  };

  useEffect(() => {
    let interval: any;
    if (diagnosticActive) {
      interval = setInterval(() => {
        setDiagnosticProgress((prev) => {
          if (prev >= 100) {
            clearInterval(interval);
            setDiagnosticActive(false);
            // Randomly select premium result
            const results: ('normal' | 'optimal' | 'warning')[] = ['optimal', 'normal', 'optimal'];
            setDiagnosticResult(results[Math.floor(Math.random() * results.length)]);
            return 100;
          }
          return prev + 25;
        });
      }, 350);
    }
    return () => clearInterval(interval);
  }, [diagnosticActive]);

  const solutionsList = [
    {
      icon: Activity,
      title: 'Anomaly Detection',
      description: 'Watches sensor signals as they come in and flags anything that drifts from normal — before it becomes a work order.',
      detail: 'Classified as Normal, Warning, or Critical in real time',
    },
    {
      icon: TrendingUp,
      title: 'Failure Prediction',
      description: 'Estimates how many cycles an engine has left, so you schedule the fix instead of reacting to the failure.',
      detail: 'Forecasts update continuously as new telemetry arrives',
    },
    {
      icon: Gauge,
      title: 'Fleet Health Scoring',
      description: 'Rolls every engine\'s condition into one number you can check in five seconds.',
      detail: 'Same index shown live on the Dashboard tab',
    },
  ];

  return (
    <section id="solutions-section" className="relative py-16 bg-gray-50">
      <div className="max-w-7xl mx-auto px-8">
        
        {/* Section Header */}
        <div className="flex flex-col items-center text-center mb-16">
          <span className="text-sm font-semibold text-gray-600 tracking-wider mb-4 uppercase">
            HOW WE BREAK IT DOWN
          </span>
          <h2 className="flex flex-col items-center mb-6 select-none">
            <span className="text-5xl md:text-6xl lg:text-7xl font-normal text-gray-500 leading-none tracking-tighter">
              Three Jobs.
            </span>
            <span className="text-5xl md:text-6xl lg:text-7xl font-normal text-[#202A36] leading-none tracking-tighter -mt-[12px]">
              One System.
            </span>
          </h2>
          <p className="text-lg md:text-xl text-gray-600 max-w-2xl mx-auto font-normal">
            Detect it, predict it, score it — that's the whole job.
          </p>
        </div>

        {/* Dynamic Solution Pillars Grid */}
        <div ref={ref as any} className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-20">
          {solutionsList.map((sol, index) => {
            const Icon = sol.icon;
            const isExpanded = expandedCard === index;
            return (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
                transition={{ duration: 0.8, delay: index * 0.12, ease: 'easeOut' }}
                onClick={() => setExpandedCard(isExpanded ? null : index)}
                className="bg-gray-100 rounded-2xl p-8 relative overflow-hidden hover:-translate-y-1 hover:shadow-lg transition-all duration-300 border border-gray-200/20 group cursor-pointer"
              >
                {/* Header section with Icon & Chevron */}
                <div className="flex items-start justify-between mb-6">
                  {/* Icon wrapper */}
                  <div className="w-14 h-14 rounded-full bg-white flex items-center justify-center shadow-sm text-[#202A36] group-hover:scale-110 transition-transform duration-300">
                    <Icon size={32} />
                  </div>
                  
                  {/* Expand Indicator */}
                  <div className="p-1 rounded-full bg-white/50 border border-gray-200 text-gray-400 group-hover:text-gray-600 transition-colors">
                    <ChevronDown
                      size={18}
                      className={`transition-transform duration-300 ${isExpanded ? 'rotate-180 text-[#202A36]' : ''}`}
                    />
                  </div>
                </div>

                {/* Title */}
                <h3 className="text-xl font-semibold text-gray-900 mb-3 tracking-tight">
                  {sol.title}
                </h3>

                {/* Description */}
                <p className="text-gray-600 text-sm leading-relaxed">
                  {sol.description}
                </p>

                {/* Extra Detail Row (Expanded) */}
                <div
                  className={`transition-all duration-300 ease-out overflow-hidden ${
                    isExpanded ? 'max-h-20 opacity-100 mt-4' : 'max-h-0 opacity-0'
                  }`}
                >
                  <div className="pt-3 border-t border-gray-200/60 text-xs font-semibold text-[#202A36] tracking-wide uppercase">
                    {sol.detail}
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>

        {/* Interactive Engine Configurator / Intelligence Simulator */}
        <div className="bg-white rounded-3xl border border-gray-200/60 p-8 shadow-sm">
          <div className="flex flex-col lg:flex-row gap-12">
            
            {/* Left Column: Engine Selector */}
            <div className="lg:w-1/3 space-y-6">
              <div>
                <span className="text-xs font-semibold text-gray-400 uppercase tracking-wider">Engine Configuration</span>
                <h3 className="text-2xl font-semibold text-gray-900 mt-1 tracking-tight">Live Core Diagnostics</h3>
                <p className="text-sm text-gray-500 mt-2">
                  Select an engine configuration to run AI diagnostics and evaluate telemetry parameters instantly.
                </p>
              </div>

              <div className="space-y-3">
                {enginesList.map((eng) => (
                  <button
                    key={eng.id}
                    onClick={() => {
                      setSelectedEngineId(eng.id);
                      setDiagnosticResult(null);
                    }}
                    className={`w-full text-left p-4 rounded-xl border transition-all duration-300 focus:outline-none cursor-pointer flex justify-between items-center ${
                      selectedEngineId === eng.id
                        ? 'bg-gray-50 border-gray-900 shadow-sm'
                        : 'bg-transparent border-gray-100 hover:bg-gray-100/50'
                    }`}
                  >
                    <div>
                      <div className="text-sm font-semibold text-gray-900">{eng.name}</div>
                      <div className="text-[10px] text-gray-400 font-medium font-mono uppercase mt-0.5">{eng.category}</div>
                    </div>
                    <div className="text-xs font-mono font-bold text-emerald-600 bg-emerald-50 px-2.5 py-1 rounded-full">
                      {eng.health}% Health
                    </div>
                  </button>
                ))}
              </div>
            </div>

            {/* Right Column: Engine Simulator Screen */}
            <div className="lg:w-2/3 flex-1 bg-gray-50 rounded-2xl border border-gray-200/50 p-6 flex flex-col justify-between">
              
              {/* Telemetry Live Feed */}
              <div className="space-y-6">
                <div className="flex justify-between items-center border-b border-gray-200 pb-3">
                  <div className="flex items-center gap-2">
                    <Heart className="text-rose-500 fill-rose-500 animate-pulse" size={16} />
                    <span className="text-xs font-mono font-bold text-gray-500 uppercase tracking-wider">Core Parameters</span>
                  </div>
                  <span className="text-[10px] font-mono font-bold text-gray-400 uppercase tracking-wider">Active Stream</span>
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                  <div className="p-3 bg-white rounded-xl border border-gray-200/40 shadow-sm text-center">
                    <div className="text-lg font-bold font-mono text-gray-800">{currentEngine.egt} °C</div>
                    <div className="text-[10px] text-gray-400 font-semibold uppercase tracking-wider mt-0.5">Exhaust Gas Temp</div>
                  </div>
                  <div className="p-3 bg-white rounded-xl border border-gray-200/40 shadow-sm text-center">
                    <div className="text-lg font-bold font-mono text-gray-800">{currentEngine.rpm} %</div>
                    <div className="text-[10px] text-gray-400 font-semibold uppercase tracking-wider mt-0.5">Turbine RPM (N1)</div>
                  </div>
                  <div className="p-3 bg-white rounded-xl border border-gray-200/40 shadow-sm text-center">
                    <div className="text-lg font-bold font-mono text-gray-800">{currentEngine.vibration} ips</div>
                    <div className="text-[10px] text-gray-400 font-semibold uppercase tracking-wider mt-0.5">Shaft Vibration</div>
                  </div>
                  <div className="p-3 bg-white rounded-xl border border-gray-200/40 shadow-sm text-center">
                    <div className="text-lg font-bold font-mono text-gray-800">{currentEngine.pressure} psi</div>
                    <div className="text-[10px] text-gray-400 font-semibold uppercase tracking-wider mt-0.5">Oil Pressure</div>
                  </div>
                </div>

                <div className="p-4 bg-white rounded-xl border border-gray-200/40 space-y-2">
                  <span className="text-[10px] font-mono font-bold text-gray-400 uppercase tracking-wider">Assigned Defense Model</span>
                  <div className="flex items-center gap-3">
                    <div className="p-2 rounded-lg bg-[#202A36]/5 text-[#202A36]">
                      <ShieldCheck size={20} />
                    </div>
                    <div>
                      <div className="text-sm font-semibold text-gray-800">{currentEngine.primarySolution}</div>
                      <p className="text-xs text-gray-500 mt-0.5">Continuously mapping thermodynamic boundaries via AeroGuard AI neural decoders.</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Action Buttons & Progress bars */}
              <div className="mt-8 pt-4 border-t border-gray-200">
                <div className="flex flex-col sm:flex-row items-center gap-4 justify-between">
                  <div className="w-full sm:w-2/3">
                    <AnimatePresence mode="wait">
                      {diagnosticActive ? (
                        <div className="space-y-2">
                          <div className="flex justify-between text-xs font-mono font-semibold text-gray-500">
                            <span>Scanning Core Layers...</span>
                            <span>{diagnosticProgress}%</span>
                          </div>
                          <div className="w-full bg-gray-200 h-2 rounded-full overflow-hidden">
                            <motion.div
                              className="h-full bg-[#202A36]"
                              initial={{ width: '0%' }}
                              animate={{ width: `${diagnosticProgress}%` }}
                              transition={{ duration: 0.3 }}
                            />
                          </div>
                        </div>
                      ) : diagnosticResult ? (
                        <motion.div
                          initial={{ opacity: 0, y: 5 }}
                          animate={{ opacity: 1, y: 0 }}
                          className={`p-3 rounded-lg border text-xs font-medium flex items-center justify-between ${
                            diagnosticResult === 'optimal'
                              ? 'bg-emerald-50 border-emerald-100 text-emerald-800'
                              : 'bg-indigo-50 border-indigo-100 text-indigo-800'
                          }`}
                        >
                          <div className="flex items-center gap-2">
                            <Zap size={14} />
                            <span>Diagnosis: {diagnosticResult === 'optimal' ? 'OPTIMAL PARAMETER CONFIDENCE' : 'STANDARD ALIGNMENT'}</span>
                          </div>
                          <span className="font-mono font-bold uppercase text-[10px] bg-white px-2 py-0.5 rounded shadow-sm">PASS</span>
                        </motion.div>
                      ) : (
                        <span className="text-xs text-gray-400 font-medium font-mono">
                          Ready to run high-precision thermodynamic engine diagnostic sweeps.
                        </span>
                      )}
                    </AnimatePresence>
                  </div>

                  <button
                    disabled={diagnosticActive}
                    onClick={runDiagnostic}
                    className={`w-full sm:w-auto px-6 py-2.5 rounded-full text-sm font-medium transition-all duration-300 flex items-center justify-center gap-2 cursor-pointer border ${
                      diagnosticActive
                        ? 'bg-gray-100 text-gray-400 border-gray-200 cursor-not-allowed'
                        : 'bg-[#202A36] text-white border-transparent hover:bg-[#1a2229] hover:shadow-md'
                    }`}
                  >
                    <RefreshCw size={14} className={diagnosticActive ? 'animate-spin' : ''} />
                    <span>Run Diagnostic</span>
                  </button>
                </div>
              </div>

            </div>

          </div>
        </div>

      </div>
    </section>
  );
}
