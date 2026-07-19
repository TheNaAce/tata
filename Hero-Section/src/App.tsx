/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState } from 'react';
import { Menu, X, ArrowLeft } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { FleetDashboard } from './components/FleetDashboard';
import { Solutions } from './components/Solutions';
import { FAQ } from './components/FAQ';
import { HowItWorks } from './components/HowItWorks';

type ViewType = 'home' | 'dashboard' | 'how-it-works' | 'solutions' | 'faq';

export default function App() {
  const [currentView, setCurrentView] = useState<ViewType>('home');
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [showDemoModal, setShowDemoModal] = useState(false);

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const handleNavigate = (view: ViewType) => {
    setCurrentView(view);
    setIsMenuOpen(false);
  };

  return (
    <div id="outer-container" className="min-h-screen bg-gray-50 text-gray-900 font-sans flex flex-col relative">
      
      {/* Navigation Bar */}
      <nav id="main-navigation" className={`w-full z-50 ${currentView === 'home' ? 'absolute top-0 left-0 bg-transparent' : 'bg-white border-b border-gray-200/60 sticky top-0'}`}>
        <div className="max-w-7xl mx-auto px-8 py-6 flex items-center justify-between">
          
          {/* Brand Name */}
          <button
            id="brand-logo"
            onClick={() => handleNavigate('home')}
            className="text-2xl font-semibold text-gray-900 tracking-tight select-none cursor-pointer focus:outline-none flex items-center gap-2"
          >
            <span>AeroGuard AI</span>
          </button>

          {/* Desktop Menu */}
          <div id="desktop-menu" className="hidden md:flex items-center gap-2">
            <button
              id="nav-home"
              onClick={() => handleNavigate('home')}
              className={`transition-all duration-200 text-sm font-semibold focus:outline-none cursor-pointer py-2 px-4 rounded-full ${
                currentView === 'home' ? 'bg-[#202A36] text-white shadow-sm' : 'text-gray-700 hover:bg-gray-100/70'
              }`}
            >
              Home
            </button>
            <button
              id="nav-dashboard"
              onClick={() => handleNavigate('dashboard')}
              className={`transition-all duration-200 text-sm font-semibold focus:outline-none cursor-pointer py-2 px-4 rounded-full ${
                currentView === 'dashboard' ? 'bg-[#202A36] text-white shadow-sm' : 'text-gray-700 hover:bg-gray-100/70'
              }`}
            >
              Dashboard
            </button>
            <button
              id="nav-how-it-works"
              onClick={() => handleNavigate('how-it-works')}
              className={`transition-all duration-200 text-sm font-semibold focus:outline-none cursor-pointer py-2 px-4 rounded-full ${
                currentView === 'how-it-works' ? 'bg-[#202A36] text-white shadow-sm' : 'text-gray-700 hover:bg-gray-100/70'
              }`}
            >
              How It Works
            </button>
            <button
              id="nav-solutions"
              onClick={() => handleNavigate('solutions')}
              className={`transition-all duration-200 text-sm font-semibold focus:outline-none cursor-pointer py-2 px-4 rounded-full ${
                currentView === 'solutions' ? 'bg-[#202A36] text-white shadow-sm' : 'text-gray-700 hover:bg-gray-100/70'
              }`}
            >
              Solutions
            </button>
            <button
              id="nav-faq"
              onClick={() => handleNavigate('faq')}
              className={`transition-all duration-200 text-sm font-semibold focus:outline-none cursor-pointer py-2 px-4 rounded-full ${
                currentView === 'faq' ? 'bg-[#202A36] text-white shadow-sm' : 'text-gray-700 hover:bg-gray-100/70'
              }`}
            >
              FAQ
            </button>
          </div>

          {/* Mobile hamburger menu button */}
          <div className="md:hidden">
            <button
              id="mobile-menu-toggle"
              onClick={toggleMenu}
              className="text-gray-900 hover:text-gray-700 focus:outline-none transition-colors duration-200 p-2"
              aria-label="Toggle navigation menu"
            >
              {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>

        {/* Mobile menu dropdown */}
        {isMenuOpen && (
          <div className="px-8 pb-6 md:hidden absolute left-0 right-0 z-50">
            <div
              id="mobile-dropdown-container"
              className="bg-white/95 backdrop-blur-md rounded-2xl shadow-xl border border-gray-100 p-6 flex flex-col gap-3"
            >
              <button
                id="mobile-nav-home"
                onClick={() => handleNavigate('home')}
                className={`text-left font-semibold text-base py-2 px-4 rounded-xl cursor-pointer focus:outline-none ${
                  currentView === 'home' ? 'bg-[#202A36] text-white' : 'text-gray-900 hover:bg-gray-50'
                }`}
              >
                Home
              </button>
              <button
                id="mobile-nav-dashboard"
                onClick={() => handleNavigate('dashboard')}
                className={`text-left font-semibold text-base py-2 px-4 rounded-xl cursor-pointer focus:outline-none ${
                  currentView === 'dashboard' ? 'bg-[#202A36] text-white' : 'text-gray-900 hover:bg-gray-50'
                }`}
              >
                Dashboard
              </button>
              <button
                id="mobile-nav-how-it-works"
                onClick={() => handleNavigate('how-it-works')}
                className={`text-left font-semibold text-base py-2 px-4 rounded-xl cursor-pointer focus:outline-none ${
                  currentView === 'how-it-works' ? 'bg-[#202A36] text-white' : 'text-gray-900 hover:bg-gray-50'
                }`}
              >
                How It Works
              </button>
              <button
                id="mobile-nav-solutions"
                onClick={() => handleNavigate('solutions')}
                className={`text-left font-semibold text-base py-2 px-4 rounded-xl cursor-pointer focus:outline-none ${
                  currentView === 'solutions' ? 'bg-[#202A36] text-white' : 'text-gray-900 hover:bg-gray-50'
                }`}
              >
                Solutions
              </button>
              <button
                id="mobile-nav-faq"
                onClick={() => handleNavigate('faq')}
                className={`text-left font-semibold text-base py-2 px-4 rounded-xl cursor-pointer focus:outline-none ${
                  currentView === 'faq' ? 'bg-[#202A36] text-white' : 'text-gray-900 hover:bg-gray-50'
                }`}
              >
                FAQ
              </button>
            </div>
          </div>
        )}
      </nav>

      {/* Main View Area */}
      <main className="flex-1">
        <AnimatePresence mode="wait">
          {currentView === 'home' ? (
            <motion.div
              key="hero-view"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.5 }}
              className="relative h-screen overflow-hidden"
            >
              {/* Video Background */}
              <video
                id="hero-video-bg"
                autoPlay
                muted
                loop
                playsInline
                className="absolute inset-0 w-full h-full object-cover"
              >
                <source
                  src="https://d8j0ntlcm91z4.cloudfront.net/user_38xzZboKViGWJOttwIXH07lWA1P/hf_20260328_091828_e240eb17-6edc-4129-ad9d-98678e3fd238.mp4"
                  type="video/mp4"
                />
              </video>

              {/* High-end contrast overlay */}
              <div id="video-overlay" className="absolute inset-0 bg-white/35 backdrop-blur-[1px]"></div>

              {/* Main content area */}
              <div id="main-content-area" className="relative z-10 h-full flex flex-col items-center justify-center">
                
                {/* Hero Content */}
                <motion.div
                  id="hero-content"
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 1.2, ease: 'easeOut' }}
                  className="flex flex-col items-center text-center -mt-32 px-6 max-w-4xl"
                >
                  {/* Upper Label */}
                  <motion.span
                    id="hero-label"
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.2, duration: 0.8 }}
                    className="text-sm font-semibold text-gray-600 tracking-wider mb-4 uppercase"
                  >
                    PREDICTIVE MAINTENANCE
                  </motion.span>

                  {/* Heading with overlap effect */}
                  <h1 id="hero-heading" className="flex flex-col items-center mb-4 select-none">
                    <motion.span
                      initial={{ opacity: 0, scale: 0.98 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ delay: 0.3, duration: 0.8 }}
                      className="text-6xl md:text-7xl lg:text-8xl font-normal text-gray-500 leading-none tracking-tighter"
                    >
                      Predict.
                    </motion.span>
                    <motion.span
                      initial={{ opacity: 0, scale: 0.98 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ delay: 0.5, duration: 0.8 }}
                      className="text-6xl md:text-7xl lg:text-8xl font-normal text-[#202A36] leading-none tracking-tighter -mt-[12px]"
                    >
                      Protect.
                    </motion.span>
                  </h1>

                  {/* Subtitle */}
                  <motion.p
                    id="hero-subtitle"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.7, duration: 0.8 }}
                    className="text-lg md:text-xl text-gray-600 mb-6 max-w-2xl font-normal leading-relaxed"
                  >
                    AI-driven insights that keep every engine flying safely.
                  </motion.p>
                </motion.div>
              </div>
            </motion.div>
          ) : currentView === 'dashboard' ? (
            <motion.div
              key="dashboard-view"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.4 }}
              className="bg-gray-50 min-h-screen"
            >
              <div className="max-w-7xl mx-auto px-8 pt-8 flex items-center">
                <button
                  onClick={() => handleNavigate('home')}
                  className="flex items-center gap-2 text-sm text-gray-500 hover:text-gray-900 transition-colors cursor-pointer group font-medium"
                >
                  <ArrowLeft size={16} className="group-hover:-translate-x-1 transition-transform" />
                  <span>Back to Landing</span>
                </button>
              </div>
              <FleetDashboard />
            </motion.div>
          ) : currentView === 'how-it-works' ? (
            <motion.div
              key="how-it-works-view"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.4 }}
              className="bg-gray-50 min-h-screen"
            >
              <div className="max-w-7xl mx-auto px-8 pt-8 flex items-center">
                <button
                  onClick={() => handleNavigate('home')}
                  className="flex items-center gap-2 text-sm text-gray-500 hover:text-gray-900 transition-colors cursor-pointer group font-medium"
                >
                  <ArrowLeft size={16} className="group-hover:-translate-x-1 transition-transform" />
                  <span>Back to Landing</span>
                </button>
              </div>
              <HowItWorks />
            </motion.div>
          ) : currentView === 'solutions' ? (
            <motion.div
              key="solutions-view"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.4 }}
              className="bg-gray-50 min-h-screen"
            >
              <div className="max-w-7xl mx-auto px-8 pt-8 flex items-center">
                <button
                  onClick={() => handleNavigate('home')}
                  className="flex items-center gap-2 text-sm text-gray-500 hover:text-gray-900 transition-colors cursor-pointer group font-medium"
                >
                  <ArrowLeft size={16} className="group-hover:-translate-x-1 transition-transform" />
                  <span>Back to Landing</span>
                </button>
              </div>
              <Solutions />
            </motion.div>
          ) : (
            <motion.div
              key="faq-view"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.4 }}
              className="bg-gray-50 min-h-screen"
            >
              <div className="max-w-7xl mx-auto px-8 pt-8 flex items-center">
                <button
                  onClick={() => handleNavigate('home')}
                  className="flex items-center gap-2 text-sm text-gray-500 hover:text-gray-900 transition-colors cursor-pointer group font-medium"
                >
                  <ArrowLeft size={16} className="group-hover:-translate-x-1 transition-transform" />
                  <span>Back to Landing</span>
                </button>
              </div>
              <FAQ />
            </motion.div>
          )}
        </AnimatePresence>
      </main>

      {/* Demo Request Modal */}
      <AnimatePresence>
        {showDemoModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setShowDemoModal(false)}
              className="fixed inset-0 bg-black/50 backdrop-blur-sm"
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="bg-white rounded-2xl max-w-md w-full p-8 shadow-2xl relative z-10 border border-gray-100"
            >
              <button
                onClick={() => setShowDemoModal(false)}
                className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 focus:outline-none cursor-pointer"
              >
                <X size={20} />
              </button>

              <div className="text-center">
                <div className="mx-auto w-12 h-12 rounded-full bg-[#202A36]/5 flex items-center justify-center mb-4">
                  <span className="text-xl font-bold text-[#202A36]">A</span>
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">Request Demo</h3>
                <p className="text-sm text-gray-500 mb-6">
                  Schedule a private tour of AeroGuard AI's predictive telemetry fleet tracking suit.
                </p>
              </div>

              <form onSubmit={(e) => { e.preventDefault(); setShowDemoModal(false); alert('Demo request submitted successfully!'); }} className="space-y-4">
                <div>
                  <label className="block text-xs font-semibold text-gray-500 mb-1 uppercase tracking-wider">Email Address</label>
                  <input
                    type="email"
                    required
                    placeholder="name@airline.com"
                    className="w-full px-4 py-2.5 rounded-lg border border-gray-200 focus:ring-2 focus:ring-[#202A36] focus:outline-none transition-all text-sm"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-gray-500 mb-1 uppercase tracking-wider">Fleet Size</label>
                  <select className="w-full px-4 py-2.5 rounded-lg border border-gray-200 focus:ring-2 focus:ring-[#202A36] focus:outline-none transition-all text-sm">
                    <option>1 - 10 Aircrafts</option>
                    <option>11 - 50 Aircrafts</option>
                    <option>50+ Aircrafts</option>
                  </select>
                </div>
                <button
                  type="submit"
                  className="w-full py-3 bg-[#202A36] hover:bg-[#1a2229] text-white rounded-lg font-medium transition-colors text-sm cursor-pointer"
                >
                  Submit Request
                </button>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}


