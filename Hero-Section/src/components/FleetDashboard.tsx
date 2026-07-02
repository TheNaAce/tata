import React, { useState } from 'react';
import { Home, Activity, AlertTriangle, Gauge, AlertCircle, Clock, Zap, Loader2, ClipboardList } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { useInView } from '../hooks/useInView';
import { CountUpNumber } from './CountUpNumber';
import { AnomalyPanel } from './AnomalyPanel';
import { HalfDonutGauge } from './HalfDonutGauge';

type TabType = 'dashboard' | 'anomaly' | 'failure';

export interface PredictionResult {
  predictedRUL: number;
  healthStatus: 'Normal' | 'Warning' | 'Critical';
  failureProbability: number;
  recommendedAction: string;
}

/**
 * Runs failure prediction on engine sensor signals.
 * Replace the mock implementation below with a real API call to your ML backend when ready.
 * e.g., const res = await fetch('/api/predict', { method: 'POST', body: JSON.stringify(data) }); return res.json();
 */
export const runFailurePrediction = async (data: Record<string, string>): Promise<PredictionResult> => {
  await new Promise(r => setTimeout(r, 1200));
  return {
    predictedRUL: 3120,
    healthStatus: 'Warning', // 'Normal' | 'Warning' | 'Critical'
    failureProbability: 34,
    recommendedAction: 'Schedule inspection within 200 operating cycles.'
  };
};

const predictionInputFields = [
  { key: 'engineId', label: 'Engine ID' },
  { key: 'operatingCycles', label: 'Operating Cycles' },
  { key: 'fanInletTemp', label: 'Fan Inlet Temperature (°R)' },
  { key: 'lpcOutletTemp', label: 'LPC Outlet Temperature (°R)' },
  { key: 'hpcOutletTemp', label: 'HPC Outlet Temperature (°R)' },
  { key: 'totalPressure', label: 'Total Pressure (psia)' },
  { key: 'fanSpeed', label: 'Physical Fan Speed (rpm)' },
  { key: 'coreSpeed', label: 'Physical Core Speed (rpm)' },
  { key: 'fuelFlowRatio', label: 'Fuel Flow Ratio (pps/psi)' },
  { key: 'bypassRatio', label: 'Bypass Ratio' },
  { key: 'bleedEnthalpy', label: 'Bleed Enthalpy' },
  { key: 'vibrationIndex', label: 'Vibration Index (mm/s)' },
];

export function FleetDashboard() {
  const [activeTab, setActiveTab] = useState<TabType>('dashboard');
  const [kpiRef, isKpiInView] = useInView({ threshold: 0.1 });

  // Failure prediction state
  const [formData, setFormData] = useState<Record<string, string>>({});
  const [isLoading, setIsLoading] = useState(false);
  const [predictionResult, setPredictionResult] = useState<PredictionResult | null>(null);

  const isFormIncomplete = predictionInputFields.some(field => !formData[field.key]?.trim());

  const handleInputChange = (key: string, value: string) => {
    setFormData(prev => ({ ...prev, [key]: value }));
  };

  const handleFormSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (isLoading || isFormIncomplete) return;
    setIsLoading(true);
    setPredictionResult(null);
    try {
      const result = await runFailurePrediction(formData);
      setPredictionResult(result);
    } catch (err) {
      console.error('Error running prediction:', err);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <section id="fleet-dashboard-section" className="relative py-20 md:py-32 bg-gray-50 border-t border-gray-200/40">
      <div className="max-w-7xl mx-auto px-8">
        
        {/* Section Header */}
        <div id="dashboard-header" className="flex flex-col items-center text-center mb-16">
          <span className="text-sm font-semibold text-gray-600 tracking-wider mb-4 uppercase">
            WHAT YOU'RE LOOKING AT
          </span>
          <h2 id="dashboard-heading" className="flex flex-col items-center mb-6 select-none">
            <span className="text-5xl md:text-6xl lg:text-7xl font-normal text-gray-500 leading-none tracking-tighter">
              Every Engine.
            </span>
            <span className="text-5xl md:text-6xl lg:text-7xl font-normal text-[#202A36] leading-none tracking-tighter -mt-[12px]">
              One Screen.
            </span>
          </h2>
          <p className="text-lg md:text-xl text-gray-600 max-w-2xl mx-auto font-normal">
            Telemetry from every engine, scored and ranked the moment it lands.
          </p>
        </div>

        {/* Interactive Tab Switcher */}
        <div id="tab-switcher" className="flex justify-center mb-12">
          <div className="flex flex-wrap items-center justify-center bg-gray-200/60 p-1.5 rounded-full gap-1 sm:gap-2 border border-gray-300/30">
            
            {/* Dashboard Tab */}
            <button
              id="tab-btn-dashboard"
              onClick={() => setActiveTab('dashboard')}
              className={`flex items-center gap-2 px-5 py-2.5 rounded-full text-sm font-medium transition-all duration-300 ${
                activeTab === 'dashboard'
                  ? 'bg-[#202A36] text-white shadow-md'
                  : 'text-gray-700 hover:text-gray-900 hover:bg-gray-300/50'
              }`}
            >
              <Home size={16} />
              <span>Dashboard</span>
            </button>

            {/* Anomaly Detection Tab */}
            <button
              id="tab-btn-anomaly"
              onClick={() => setActiveTab('anomaly')}
              className={`flex items-center gap-2 px-5 py-2.5 rounded-full text-sm font-medium transition-all duration-300 ${
                activeTab === 'anomaly'
                  ? 'bg-[#202A36] text-white shadow-md'
                  : 'text-gray-700 hover:text-gray-900 hover:bg-gray-300/50'
              }`}
            >
              <Activity size={16} />
              <span>Anomaly Detection</span>
            </button>

            {/* Failure Prediction Tab */}
            <button
              id="tab-btn-failure"
              onClick={() => setActiveTab('failure')}
              className={`flex items-center gap-2 px-5 py-2.5 rounded-full text-sm font-medium transition-all duration-300 ${
                activeTab === 'failure'
                  ? 'bg-[#202A36] text-white shadow-md'
                  : 'text-gray-700 hover:text-gray-900 hover:bg-gray-300/50'
              }`}
            >
              <AlertTriangle size={16} />
              <span>Failure Prediction</span>
            </button>

          </div>
        </div>

        {/* Tab Contents with smooth cross-fade animation */}
        <div id="tab-content-container" className="relative min-h-[400px]">
          <AnimatePresence mode="wait">
            
            {/* Dashboard Content */}
            {activeTab === 'dashboard' && (
              <motion.div
                key="dashboard"
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -15 }}
                transition={{ duration: 0.4 }}
              >
                <div
                  ref={kpiRef as any}
                  className="grid grid-cols-2 md:grid-cols-4 gap-4"
                >
                  {/* Card 1: Fleet Health Index */}
                  <div className="bg-[#202A36] rounded-2xl p-6 text-white relative overflow-hidden hover:-translate-y-1 transition-transform duration-300 border border-white/5 shadow-lg group">
                    <div className="flex justify-between items-start mb-4">
                      <span className="text-xs uppercase tracking-wider text-gray-300 font-semibold">
                        FLEET HEALTH INDEX
                      </span>
                      <Gauge size={24} className="text-emerald-400 opacity-80 group-hover:scale-110 transition-transform" />
                    </div>
                    <div className="text-4xl font-semibold tracking-tight">
                      <CountUpNumber target={78.9} decimals={1} trigger={isKpiInView} />%
                    </div>
                    <p className="text-xs text-gray-400 mt-2">Optimal fleet status operating band</p>
                  </div>

                  {/* Card 2: Critical Engines */}
                  <div className="bg-[#202A36] rounded-2xl p-6 text-white relative overflow-hidden hover:-translate-y-1 transition-transform duration-300 border border-white/5 shadow-lg group">
                    <div className="flex justify-between items-start mb-4">
                      <span className="text-xs uppercase tracking-wider text-gray-300 font-semibold">
                        CRITICAL ENGINES
                      </span>
                      <AlertCircle size={24} className="text-rose-500 opacity-80 group-hover:scale-110 transition-transform" />
                    </div>
                    <div className="text-4xl font-semibold tracking-tight text-red-400">
                      <CountUpNumber target={2} decimals={0} trigger={isKpiInView} />
                    </div>
                    <p className="text-xs text-gray-400 mt-2">Requires immediate inspection</p>
                  </div>

                  {/* Card 3: Avg RUL */}
                  <div className="bg-[#202A36] rounded-2xl p-6 text-white relative overflow-hidden hover:-translate-y-1 transition-transform duration-300 border border-white/5 shadow-lg group">
                    <div className="flex justify-between items-start mb-4">
                      <span className="text-xs uppercase tracking-wider text-gray-300 font-semibold">
                        AVG RUL (HOURS)
                      </span>
                      <Clock size={24} className="text-blue-400 opacity-80 group-hover:scale-110 transition-transform" />
                    </div>
                    <div className="text-4xl font-semibold tracking-tight">
                      <CountUpNumber target={3385} decimals={0} trigger={isKpiInView} />
                    </div>
                    <p className="text-xs text-gray-400 mt-2">Average remaining useful life</p>
                  </div>

                  {/* Card 4: Anomalies */}
                  <div className="bg-[#202A36] rounded-2xl p-6 text-white relative overflow-hidden hover:-translate-y-1 transition-transform duration-300 border border-white/5 shadow-lg group">
                    <div className="flex justify-between items-start mb-4">
                      <span className="text-xs uppercase tracking-wider text-gray-300 font-semibold">
                        ACTIVE ANOMALIES
                      </span>
                      <Activity size={24} className="text-amber-400 opacity-80 group-hover:scale-110 transition-transform" />
                    </div>
                    <div className="text-4xl font-semibold tracking-tight text-amber-400">
                      <CountUpNumber target={5} decimals={0} trigger={isKpiInView} />
                    </div>
                    <p className="text-xs text-gray-400 mt-2">Unusual thermodynamic signatures</p>
                  </div>

                </div>
              </motion.div>
            )}

            {/* Anomaly Detection Content */}
            {activeTab === 'anomaly' && (
              <motion.div
                key="anomaly"
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -15 }}
                transition={{ duration: 0.4 }}
                className="grid md:grid-cols-2 gap-6"
              >
                <AnomalyPanel />
                <HalfDonutGauge />
              </motion.div>
            )}

            {/* Failure Prediction Content */}
            {activeTab === 'failure' && (
              <motion.div
                key="failure"
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -15 }}
                transition={{ duration: 0.4 }}
                className="space-y-8"
              >
                {/* Tab Header */}
                <div className="flex flex-col items-center text-center">
                  <span className="text-sm font-semibold text-gray-600 tracking-wider mb-2 uppercase">
                    RUN PREDICTION
                  </span>
                  <p className="text-gray-600 text-base max-w-xl mx-auto text-center">
                    Enter live engine readings to forecast remaining useful life.
                  </p>
                </div>

                {/* Input Form Panel */}
                <div className="bg-gray-100 rounded-2xl p-8 mb-8">
                  <form onSubmit={handleFormSubmit} className="space-y-6">
                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-5">
                      {predictionInputFields.map((field) => (
                        <div key={field.key} className="flex flex-col">
                          <label className="text-xs uppercase tracking-wider text-gray-500 mb-1.5 font-semibold">
                            {field.label}
                          </label>
                          <input
                            type="number"
                            step="any"
                            placeholder="0.00"
                            value={formData[field.key] || ''}
                            onChange={(e) => handleInputChange(field.key, e.target.value)}
                            className="w-full bg-white rounded-xl px-4 py-2.5 border border-gray-200 focus:outline-none focus:ring-2 focus:ring-[#202A36] focus:border-transparent transition-all text-sm font-mono"
                          />
                        </div>
                      ))}
                    </div>

                    <div className="flex justify-center pt-2">
                      <button
                        type="submit"
                        disabled={isLoading || isFormIncomplete}
                        className="flex items-center gap-2 bg-[#202A36] text-white rounded-full px-8 py-3 font-semibold hover:bg-[#1a2229] transition-all duration-300 shadow-md cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed select-none text-sm"
                      >
                        <Zap size={16} />
                        <span>Run Prediction</span>
                      </button>
                    </div>
                  </form>
                </div>

                {/* Bottom Content Area: Placeholder, Loading, or Results */}
                <AnimatePresence mode="wait">
                  {isLoading ? (
                    <motion.div
                      key="predict-loading"
                      initial={{ opacity: 0, scale: 0.98 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0 }}
                      className="bg-white rounded-2xl border border-gray-200/60 p-12 text-center shadow-sm flex flex-col items-center justify-center min-h-[250px]"
                    >
                      <Loader2 className="animate-spin text-[#202A36] mb-4" size={40} />
                      <p className="text-gray-500 font-medium">Analyzing engine signals...</p>
                    </motion.div>
                  ) : predictionResult ? (
                    <motion.div
                      key="predict-results"
                      initial={{ opacity: 0, y: 16 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -16 }}
                      transition={{ duration: 0.5, ease: 'easeOut' }}
                      className="grid grid-cols-2 md:grid-cols-4 gap-4"
                    >
                      {/* Card 1: Predicted RUL */}
                      <div className="bg-[#202A36] rounded-2xl p-6 text-white relative overflow-hidden hover:-translate-y-1 transition-transform duration-300 border border-white/5 shadow-lg group">
                        <div className="flex justify-between items-start mb-4">
                          <span className="text-xs uppercase tracking-wider text-gray-300 font-semibold">
                            PREDICTED RUL
                          </span>
                          <Clock size={24} className="text-blue-400 opacity-80 group-hover:scale-110 transition-transform" />
                        </div>
                        <div className="text-4xl font-semibold tracking-tight">
                          {predictionResult.predictedRUL} <span className="text-lg font-normal text-gray-300">cycles</span>
                        </div>
                        <p className="text-xs text-gray-400 mt-2">Remaining useful engine lifetime</p>
                      </div>

                      {/* Card 2: Health Status */}
                      <div className="bg-[#202A36] rounded-2xl p-6 text-white relative overflow-hidden hover:-translate-y-1 transition-transform duration-300 border border-white/5 shadow-lg group">
                        <div className="flex justify-between items-start mb-4">
                          <span className="text-xs uppercase tracking-wider text-gray-300 font-semibold">
                            HEALTH STATUS
                          </span>
                          <AlertCircle size={24} className={`${
                            predictionResult.healthStatus === 'Normal' ? 'text-green-400' :
                            predictionResult.healthStatus === 'Warning' ? 'text-amber-400' : 'text-red-400'
                          } opacity-80 group-hover:scale-110 transition-transform`} />
                        </div>
                        <div className={`text-4xl font-semibold tracking-tight ${
                          predictionResult.healthStatus === 'Normal' ? 'text-green-400' :
                          predictionResult.healthStatus === 'Warning' ? 'text-amber-400' : 'text-red-400'
                        }`}>
                          {predictionResult.healthStatus}
                        </div>
                        <p className="text-xs text-gray-400 mt-2">Classified operational health tier</p>
                      </div>

                      {/* Card 3: Failure Probability */}
                      <div className="bg-[#202A36] rounded-2xl p-6 text-white relative overflow-hidden hover:-translate-y-1 transition-transform duration-300 border border-white/5 shadow-lg group">
                        <div className="flex justify-between items-start mb-4">
                          <span className="text-xs uppercase tracking-wider text-gray-300 font-semibold">
                            FAILURE PROBABILITY
                          </span>
                          <div className="flex items-center justify-center">
                            <svg className="w-8 h-8 transform -rotate-90" viewBox="0 0 36 36">
                              <path
                                className="text-gray-700/60"
                                strokeWidth="3.5"
                                stroke="currentColor"
                                fill="none"
                                d="M18 2.0845
                                  a 15.9155 15.9155 0 0 1 0 31.831
                                  a 15.9155 15.9155 0 0 1 0 -31.831"
                              />
                              <motion.path
                                className={
                                  predictionResult.healthStatus === 'Normal' ? 'text-green-400' :
                                  predictionResult.healthStatus === 'Warning' ? 'text-amber-400' : 'text-red-400'
                                }
                                strokeDasharray="0, 100"
                                strokeWidth="3.5"
                                strokeLinecap="round"
                                stroke="currentColor"
                                fill="none"
                                animate={{ strokeDasharray: `${predictionResult.failureProbability}, 100` }}
                                transition={{ duration: 1.2, ease: "easeOut" }}
                                d="M18 2.0845
                                  a 15.9155 15.9155 0 0 1 0 31.831
                                  a 15.9155 15.9155 0 0 1 0 -31.831"
                              />
                            </svg>
                          </div>
                        </div>
                        <div className="text-4xl font-semibold tracking-tight">
                          {predictionResult.failureProbability}%
                        </div>
                        <p className="text-xs text-gray-400 mt-2">Calculated temporal risk coefficient</p>
                      </div>

                      {/* Card 4: Recommended Action */}
                      <div className="bg-[#202A36] rounded-2xl p-6 text-white relative overflow-hidden hover:-translate-y-1 transition-transform duration-300 border border-white/5 shadow-lg group">
                        <div className="flex justify-between items-start mb-4">
                          <span className="text-xs uppercase tracking-wider text-gray-300 font-semibold">
                            RECOMMENDED ACTION
                          </span>
                          <ClipboardList size={24} className="text-indigo-400 opacity-80 group-hover:scale-110 transition-transform" />
                        </div>
                        <div className="text-sm font-medium text-gray-200 mt-1 leading-snug">
                          {predictionResult.recommendedAction}
                        </div>
                        <p className="text-xs text-gray-400 mt-2">Next step protocol suggestion</p>
                      </div>
                    </motion.div>
                  ) : (
                    <motion.div
                      key="predict-placeholder"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      className="bg-gray-100 rounded-2xl p-12 text-center border border-gray-200/50 flex flex-col items-center justify-center"
                    >
                      <div className="bg-white p-4 rounded-full shadow-sm border border-gray-200/30 mb-4 text-gray-400">
                        <AlertTriangle size={40} />
                      </div>
                      <h3 className="text-lg font-semibold text-gray-900 mb-2">Failure Prediction Active</h3>
                      <p className="text-gray-600 max-w-md">
                        Predictive alerts for upcoming maintenance windows and component degradation timelines.
                      </p>
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>
            )}

          </AnimatePresence>
        </div>

      </div>
    </section>
  );
}
