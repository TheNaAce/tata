import React, { useState } from 'react';
import { ChevronDown, Search, HelpCircle, ThumbsUp, ThumbsDown, Check } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

interface FAQItem {
  question: string;
  answer: string;
  category: 'general' | 'technology' | 'integration' | 'security';
}

export function FAQ() {
  const [activeIndex, setActiveIndex] = useState<number | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [ratedQuestions, setRatedQuestions] = useState<Record<number, 'yes' | 'no'>>({});

  const faqItems: FAQItem[] = [
    {
      question: 'What is AeroGuard AI?',
      answer: 'Reads live sensor telemetry off each engine and flags anomalies before they show up in a maintenance log.',
      category: 'general',
    },
    {
      question: 'How does anomaly detection work?',
      answer: 'It continuously analyzes engine telemetry and flags deviations from normal operating patterns, classified as Normal, Warning, or Critical.',
      category: 'technology',
    },
    {
      question: 'What is RUL (Remaining Useful Life)?',
      answer: 'RUL is the number of flight cycles an engine component has left before it needs servicing — it\'s a forecast, not a guarantee, and it tightens as more data comes in.',
      category: 'technology',
    },
    {
      question: 'How accurate are the failure predictions?',
      answer: 'Accuracy is checked against actual maintenance records on a rolling basis — the model gets corrected, not just trusted.',
      category: 'technology',
    },
    {
      question: 'Can AeroGuard integrate with our existing fleet management system?',
      answer: 'Yes, it connects via API to existing fleet ops and maintenance tracking systems.',
      category: 'integration',
    },
    {
      question: 'Is flight data secure on this platform?',
      answer: 'Yes, all telemetry is encrypted in transit and at rest, with role-based access controls.',
      category: 'security',
    },
  ];

  const handleToggle = (index: number) => {
    setActiveIndex(activeIndex === index ? null : index);
  };

  const handleRate = (index: number, rating: 'yes' | 'no', e: React.MouseEvent) => {
    e.stopPropagation(); // Avoid triggering accordion close
    setRatedQuestions((prev) => ({ ...prev, [index]: rating }));
  };

  // Filter based on search query matching question text
  const filteredItems = faqItems.filter((item) => {
    return item.question.toLowerCase().includes(searchTerm.toLowerCase());
  });

  return (
    <section id="faq-section" className="relative py-16 bg-gray-50">
      <div className="max-w-4xl mx-auto px-8">
        
        {/* Section Header */}
        <div className="flex flex-col items-center text-center mb-12">
          <span className="text-sm font-semibold text-gray-600 tracking-wider mb-4 uppercase">
            BEFORE YOU SIGN OFF
          </span>
          <h2 className="flex flex-col items-center mb-6 select-none">
            <span className="text-5xl md:text-6xl lg:text-7xl font-normal text-gray-500 leading-none tracking-tighter">
              Questions.
            </span>
            <span className="text-5xl md:text-6xl lg:text-7xl font-normal text-[#202A36] leading-none tracking-tighter -mt-[12px]">
              From The Field.
            </span>
          </h2>
          <p className="text-lg md:text-xl text-gray-600 max-w-2xl mx-auto font-normal">
            The questions every maintenance lead asks before signing off.
          </p>
        </div>

        {/* Live Filter Input */}
        <div className="relative w-full max-w-sm mx-auto mb-8">
          <Search className="absolute left-5 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
          <input
            type="text"
            placeholder="Search questions..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-12 pr-5 py-2.5 rounded-full border border-gray-200 focus:outline-none focus:ring-2 focus:ring-[#202A36] focus:border-transparent transition-all bg-white text-sm shadow-sm"
          />
        </div>

        {/* Accordion FAQ Panel Container */}
        <div className="bg-white rounded-3xl border border-gray-200/60 p-6 sm:p-8 shadow-sm">
          <AnimatePresence mode="wait">
            {filteredItems.length > 0 ? (
              <motion.div
                key="faq-list"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="divide-y divide-gray-100"
              >
                {filteredItems.map((item, index) => {
                  const isOpen = activeIndex === index;
                  const originalIndex = faqItems.findIndex(orig => orig.question === item.question);
                  const isRated = ratedQuestions[originalIndex];

                  return (
                    <div
                      key={index}
                      className="py-5 first:pt-0 last:pb-0"
                    >
                      {/* Question Row */}
                      <button
                        onClick={() => handleToggle(index)}
                        className="w-full flex items-center justify-between text-left text-base sm:text-lg font-medium text-gray-900 hover:text-gray-700 transition-colors duration-200 select-none focus:outline-none cursor-pointer"
                      >
                        <div className="flex items-center gap-3 pr-4">
                          <HelpCircle size={18} className="text-gray-400 shrink-0" />
                          <span>{item.question}</span>
                        </div>
                        <ChevronDown
                          size={20}
                          className={`text-gray-400 transition-transform duration-300 shrink-0 ${
                            isOpen ? 'rotate-180 text-[#202A36]' : ''
                          }`}
                        />
                      </button>

                      {/* Answer Accordion Body */}
                      <div
                        className={`transition-all duration-300 ease-out overflow-hidden ${
                          isOpen ? 'max-h-60 opacity-100 mt-4' : 'max-h-0 opacity-0'
                        }`}
                      >
                        <div className="pl-7 pr-4 space-y-4">
                          <p className="text-gray-600 text-sm sm:text-base leading-relaxed">
                            {item.answer}
                          </p>

                          {/* Helpfulness Rating component */}
                          <div className="flex items-center gap-3 pt-3 border-t border-gray-100/50 text-xs">
                            <span className="text-gray-400 font-medium">Was this helpful?</span>
                            {isRated ? (
                              <span className="text-emerald-600 font-semibold flex items-center gap-1.5 animate-fade-in">
                                <Check size={14} />
                                <span>Thank you for your feedback!</span>
                              </span>
                            ) : (
                              <div className="flex items-center gap-2">
                                <button
                                  onClick={(e) => handleRate(originalIndex, 'yes', e)}
                                  className="p-1.5 rounded bg-gray-50 hover:bg-emerald-50 text-gray-500 hover:text-emerald-600 transition-all cursor-pointer flex items-center gap-1"
                                >
                                  <ThumbsUp size={12} />
                                  <span className="text-[10px] font-bold">Yes</span>
                                </button>
                                <button
                                  onClick={(e) => handleRate(originalIndex, 'no', e)}
                                  className="p-1.5 rounded bg-gray-50 hover:bg-rose-50 text-gray-500 hover:text-rose-600 transition-all cursor-pointer flex items-center gap-1"
                                >
                                  <ThumbsDown size={12} />
                                  <span className="text-[10px] font-bold">No</span>
                                </button>
                              </div>
                            )}
                          </div>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </motion.div>
            ) : (
              <motion.div
                key="empty-state"
                initial={{ opacity: 0, scale: 0.98 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0 }}
                className="py-12 text-center"
              >
                <div className="w-12 h-12 rounded-full bg-gray-100 flex items-center justify-center mx-auto mb-4 text-gray-400">
                  <Search size={22} />
                </div>
                <h4 className="text-sm font-semibold text-gray-900 mb-1">No matching questions found</h4>
                <p className="text-xs text-gray-500 max-w-xs mx-auto leading-relaxed">
                  Try adjusting your search keywords to find the right answer.
                </p>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

      </div>
    </section>
  );
}
