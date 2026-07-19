import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Cpu, Wifi, ShieldCheck, Hammer, ArrowRight } from 'lucide-react';

interface Step {
  id: string;
  number: string;
  title: string;
  description: string;
  icon: any;
}

export function HowItWorks() {
  const [activeStepIndex, setActiveStepIndex] = useState(0);
  const [simulatedHours, setSimulatedHours] = useState(320);

  const steps: Step[] = [
    {
      id: 'ingest',
      number: '01',
      title: 'Ingest',
      description: 'Over 150 live parameters streamed at 10Hz.',
      icon: Wifi,
    },
    {
      id: 'process',
      number: '02',
      title: 'Process',
      description: 'Edge classification filters out sensor noise.',
      icon: Cpu,
    },
    {
      id: 'predict',
      number: '03',
      title: 'Predict',
      description: 'LSTM models calculate Remaining Useful Life.',
      icon: ShieldCheck,
    },
    {
      id: 'dispatch',
      number: '04',
      title: 'Dispatch',
      description: 'Automated dispatch of parts and work orders.',
      icon: Hammer,
    },
  ];

  const progressPercentage = (activeStepIndex / 3) * 100;

  // RUL degradation math
  const calculatedHealth = Math.max(10, Math.min(100, Math.round(100 - (simulatedHours / 600) * 85)));
  const calculatedRUL = Math.max(0, 600 - simulatedHours);

  return (
    <section id="how-it-works-section" className="relative py-20 md:py-32 bg-gray-50">
      <div className="max-w-7xl mx-auto px-8">
        
        {/* Section Header */}
        <div className="flex flex-col items-center text-center mb-16">
          <span className="text-sm font-semibold text-gray-600 tracking-wider mb-4 uppercase">
            HOW WE WORK
          </span>
          <h2 className="flex flex-col items-center mb-6 select-none">
            <span className="text-5xl md:text-6xl lg:text-7xl font-normal text-gray-500 leading-none tracking-tighter">
              Step-By-Step.
            </span>
            <span className="text-5xl md:text-6xl lg:text-7xl font-normal text-[#202A36] leading-none tracking-tighter -mt-[12px]">
              To The Gate.
            </span>
          </h2>
          <p className="text-lg md:text-xl text-gray-600 max-w-2xl mx-auto font-normal">
            Four distinct stages that transform raw engine sensor telemetry into a signed-off plane.
          </p>
        </div>

        {/* Interactive Step Sequence */}
        <div className="relative mb-12">
          
          {/* Connecting progress bar */}
          <div className="absolute hidden lg:block left-[12.5%] right-[12.5%] top-[56px] h-1 bg-gray-200/50 z-0">
            <div
              className="h-full bg-[#202A36] transition-all duration-500 ease-out"
              style={{ width: `${progressPercentage}%` }}
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 relative z-10">
            {steps.map((step, idx) => {
              const isActive = idx === activeStepIndex;
              const Icon = step.icon;
              return (
                <button
                  key={step.id}
                  onClick={() => setActiveStepIndex(idx)}
                  className={`text-left p-8 rounded-2xl transition-all duration-300 focus:outline-none flex flex-col items-start cursor-pointer relative ${
                    isActive
                      ? 'bg-white border-2 border-[#202A36] shadow-md scale-[1.02] z-20'
                      : 'bg-gray-100 border border-transparent opacity-75 hover:opacity-100'
                  }`}
                >
                  {/* Step Number Badge */}
                  <span className="absolute top-4 right-4 text-xs font-mono font-bold text-gray-400">
                    {step.number}
                  </span>

                  {/* Icon Wrapper */}
                  <div className={`w-12 h-12 rounded-full flex items-center justify-center mb-6 shadow-sm transition-transform duration-300 ${
                    isActive ? 'bg-[#202A36] text-white' : 'bg-white text-[#202A36]'
                  }`}>
                    <Icon size={22} />
                  </div>

                  {/* Title & Description */}
                  <h3 className="text-lg font-semibold text-gray-900 mb-2 tracking-tight">
                    {step.title}
                  </h3>
                  <p className="text-gray-600 text-xs sm:text-sm leading-relaxed">
                    {step.description}
                  </p>
                </button>
              );
            })}
          </div>
        </div>

        {/* Expandable Detail Panel */}
        <div className="transition-all duration-300 ease-out bg-[#202A36] text-white rounded-3xl p-8 shadow-xl min-h-[220px] flex flex-col justify-center">
          <AnimatePresence mode="wait">
            
            {activeStepIndex === 0 && (
              <motion.div
                key="ingest-detail"
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -15 }}
                transition={{ duration: 0.3 }}
              >
                <div className="space-y-4">
                  <div className="flex items-center justify-between border-b border-white/10 pb-3">
                    <div className="flex items-center gap-2">
                      <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse" />
                      <span className="text-xs font-mono font-bold text-gray-300 uppercase tracking-wider">Ingestion Console</span>
                    </div>
                    <span className="text-xs font-mono font-bold text-gray-400">10Hz / SSL / SECURE</span>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-center">
                    <div className="space-y-2 font-mono text-xs sm:text-sm text-gray-300">
                      <div className="flex justify-between bg-white/5 p-2.5 rounded-lg border border-white/5">
                        <span>EGT (Exhaust Gas Temp):</span>
                        <span className="text-emerald-400 font-bold">684.2 °C</span>
                      </div>
                      <div className="flex justify-between bg-white/5 p-2.5 rounded-lg border border-white/5">
                        <span>N1 Speed (Fan Speed):</span>
                        <span className="text-emerald-400 font-bold">94.8%</span>
                      </div>
                      <div className="flex justify-between bg-white/5 p-2.5 rounded-lg border border-white/5">
                        <span>Fuel Flow Ratio:</span>
                        <span className="text-emerald-400 font-bold">12.4 klbs/hr</span>
                      </div>
                      <div className="flex justify-between bg-white/5 p-2.5 rounded-lg border border-white/5">
                        <span>Vibration Index:</span>
                        <span className="text-emerald-400 font-bold">0.42 mm/s</span>
                      </div>
                    </div>
                    <div className="bg-white/5 rounded-2xl p-6 border border-white/5 flex flex-col items-center justify-center text-center space-y-4">
                      <div className="flex items-center justify-center gap-6 relative py-2">
                        <div className="flex flex-col items-center">
                          <span className="text-3xl">✈️</span>
                          <span className="text-[10px] font-mono text-gray-400 mt-1">FLEET_AC_24</span>
                        </div>
                        <div className="w-20 h-0.5 bg-dashed border-t-2 border-dashed border-white/20 relative">
                          <span className="absolute -top-1 left-1/4 w-2 h-2 rounded-full bg-emerald-500 animate-ping" />
                          <span className="absolute -top-1 left-3/4 w-2 h-2 rounded-full bg-[#38bdf8] animate-ping" />
                        </div>
                        <div className="w-10 h-10 rounded-xl bg-white/10 flex items-center justify-center border border-white/10">
                          <Cpu className="text-white" size={18} />
                        </div>
                      </div>
                      <p className="text-xs text-gray-400 leading-relaxed max-w-xs">
                        Streaming 150+ telemetry parameters dynamically via on-board SATCOM and secure terrestrial networks.
                      </p>
                    </div>
                  </div>
                </div>
              </motion.div>
            )}

            {activeStepIndex === 1 && (
              <motion.div
                key="process-detail"
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -15 }}
                transition={{ duration: 0.3 }}
              >
                <div className="space-y-4">
                  <div className="flex items-center justify-between border-b border-white/10 pb-3">
                    <div className="flex items-center gap-2">
                      <span className="w-2.5 h-2.5 rounded-full bg-indigo-400 animate-pulse" />
                      <span className="text-xs font-mono font-bold text-gray-300 uppercase tracking-wider">Processing Wave</span>
                    </div>
                    <div className="bg-indigo-500/20 border border-indigo-400/30 px-3 py-1 rounded-full text-[10px] font-mono font-bold text-indigo-300 animate-pulse flex items-center gap-1.5">
                      <span className="w-1.5 h-1.5 rounded-full bg-indigo-400" />
                      Noise Cleaned / Transient Spikes Filtered
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-center">
                    <div className="md:col-span-2 h-44 border border-white/10 rounded-2xl bg-black/20 flex flex-col justify-end p-4 relative overflow-hidden">
                      <div className="absolute inset-0 bg-[linear-gradient(to_right,#ffffff_1px,transparent_1px),linear-gradient(to_bottom,#ffffff_1px,transparent_1px)] bg-[size:20px_20px] opacity-[0.03]" />
                      
                      {/* Animated wave */}
                      <svg className="w-full h-24 stroke-indigo-400 stroke-2 fill-none" viewBox="0 0 100 20" preserveAspectRatio="none">
                        <path d="M 0 10 Q 5 15 10 10 T 20 10 T 30 10 T 40 4 T 50 16 T 60 2 T 70 12 T 80 10 T 90 10 T 100 10">
                          <animate attributeName="d" 
                                   values="M 0 10 Q 5 15 10 10 T 20 10 T 30 10 T 40 4 T 50 16 T 60 2 T 70 12 T 80 10 T 90 10 T 100 10;
                                           M 0 10 Q 5 5 10 10 T 20 10 T 30 10 T 40 16 T 50 4 T 60 18 T 70 8 T 80 10 T 90 10 T 100 10;
                                           M 0 10 Q 5 15 10 10 T 20 10 T 30 10 T 40 4 T 50 16 T 60 2 T 70 12 T 80 10 T 90 10 T 100 10" 
                                   dur="4s" repeatCount="indefinite" />
                        </path>
                      </svg>
                    </div>
                    <div className="space-y-3">
                      <div className="px-4 py-3 bg-white/5 rounded-xl border border-white/5 text-center">
                        <div className="font-bold text-emerald-400 text-sm">Noise Cleaned</div>
                        <div className="text-xs text-gray-400 mt-1">Transient signal spikes smoothed</div>
                      </div>
                      <div className="px-4 py-3 bg-white/5 rounded-xl border border-white/5 text-center">
                        <div className="font-bold text-indigo-400 text-sm">Normal Band Verified</div>
                        <div className="text-xs text-gray-400 mt-1">Classification confidence: 99.4%</div>
                      </div>
                    </div>
                  </div>
                </div>
              </motion.div>
            )}

            {activeStepIndex === 2 && (
              <motion.div
                key="predict-detail"
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -15 }}
                transition={{ duration: 0.3 }}
              >
                <div className="space-y-4">
                  <div className="flex items-center justify-between border-b border-white/10 pb-3">
                    <span className="text-xs font-mono font-bold text-gray-300 uppercase tracking-wider">LSTM Wear Predictor</span>
                    <span className="text-xs font-mono font-bold text-emerald-400 bg-emerald-400/10 px-2.5 py-1 rounded-full">
                      {simulatedHours} Operating Cycles Run
                    </span>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-center">
                    <div className="space-y-4">
                      <div className="flex justify-between items-center">
                        <span className="text-xs font-semibold text-gray-300 uppercase tracking-wider">Wear Simulation Controller</span>
                        <span className="text-xs text-gray-400 font-mono">Slide to simulate lifecycle</span>
                      </div>

                      <input
                        type="range"
                        min="50"
                        max="580"
                        value={simulatedHours}
                        onChange={(e) => setSimulatedHours(Number(e.target.value))}
                        className="w-full h-2 bg-white/10 rounded-lg appearance-none cursor-pointer accent-white"
                      />
                      <p className="text-xs text-gray-400 leading-relaxed">
                        LSTM recurrent neural networks project the degradation curves against historical fleet failure data to lock in remaining life parameters.
                      </p>
                    </div>
                    
                    <div className="grid grid-cols-2 gap-4">
                      <div className="p-4 bg-white/5 rounded-2xl border border-white/5 text-center">
                        <div className="text-2xl sm:text-3xl font-bold text-white font-mono">{calculatedRUL} hrs</div>
                        <div className="text-[10px] text-gray-400 font-semibold uppercase tracking-wider mt-1">Remaining Useful Life</div>
                      </div>
                      <div className="p-4 bg-white/5 rounded-2xl border border-white/5 text-center">
                        <div className={`text-2xl sm:text-3xl font-bold font-mono ${calculatedHealth > 70 ? 'text-emerald-400' : calculatedHealth > 40 ? 'text-amber-400' : 'text-rose-400'}`}>
                          {calculatedHealth}%
                        </div>
                        <div className="text-[10px] text-gray-400 font-semibold uppercase tracking-wider mt-1">Engine Health Score</div>
                      </div>
                    </div>
                  </div>
                </div>
              </motion.div>
            )}

            {activeStepIndex === 3 && (
              <motion.div
                key="dispatch-detail"
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -15 }}
                transition={{ duration: 0.3 }}
              >
                <div className="space-y-4">
                  <div className="flex items-center justify-between border-b border-white/10 pb-3">
                    <span className="text-xs font-mono font-bold text-gray-300 uppercase tracking-wider">Mitigation Hangar Dispatch Ticket</span>
                    <span className="text-xs font-mono font-bold text-rose-400 bg-rose-400/10 px-2.5 py-1 rounded-full">CRITICAL_ALERT</span>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-center">
                    <div className="md:col-span-8 bg-black/20 border border-white/10 rounded-2xl p-5 space-y-2.5 font-mono text-xs text-gray-300">
                      <div>Target Asset: <span className="text-white font-semibold">GE90-115B (SN_874291)</span></div>
                      <div>Location Alert: <span className="text-white font-semibold">Hartsfield-Jackson Atlanta (ATL)</span></div>
                      <div>Action Item: <span className="text-white font-semibold">Pre-route exhaust temperature thermocouple part to ATL Hangar 4</span></div>
                      <div>System Status: <span className="text-emerald-400 font-semibold">Dispatch pre-queued / Awaiting final approval</span></div>
                    </div>
                    <div className="md:col-span-4">
                      <button
                        onClick={() => alert('Mitigation action simulated. Work order dispatched successfully!')}
                        className="w-full py-4 bg-white hover:bg-gray-100 text-[#202A36] rounded-xl font-bold text-sm transition-all duration-300 shadow-md cursor-pointer text-center flex items-center justify-center gap-2 group"
                      >
                        <span>Approve Mitigation Dispatch</span>
                        <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
                      </button>
                    </div>
                  </div>
                </div>
              </motion.div>
            )}

          </AnimatePresence>
        </div>

      </div>
    </section>
  );
}
