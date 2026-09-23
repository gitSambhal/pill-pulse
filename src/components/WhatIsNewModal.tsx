/**
 * PillPulse - What's New & Changelog Modal
 * Developer: Suhail Akhtar (https://suhail.top)
 */

import React from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Sparkles, X, Check, Calendar, CheckCheck, Hourglass, Zap, Sliders, Clock, Moon, Keyboard, Sunrise } from 'lucide-react';

interface WhatIsNewModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const WhatIsNewModal: React.FC<WhatIsNewModalProps> = ({ isOpen, onClose }) => {
  React.useEffect(() => {
    if (!isOpen) return;
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const features = [
    {
      icon: <Sunrise className="w-5 h-5 text-amber-500" />,
      title: 'Visual Timing Icons Everywhere',
      desc: 'Sunrise (Morning), Sun (Afternoon), Sunset (Evening), and Moon (Night) icons integrated across dose cards, routine items, filter tabs, and banners.',
    },
    {
      icon: <Clock className="w-5 h-5 text-teal-500" />,
      title: 'Custom Morning, Afternoon, Evening & Night Times',
      desc: 'Set custom hours for each daily slot in Settings (Default Schedule Times) or directly on each slot button when creating a routine.',
    },
    {
      icon: <Moon className="w-5 h-5 text-indigo-500" />,
      title: 'Working Dark/Light Mode',
      desc: 'Seamless theme switching with custom variant synchronization for Tailwind v4 and native color-scheme styling.',
    },
    {
      icon: <Sliders className="w-5 h-5 text-sky-500" />,
      title: 'Inline Time Editing Everywhere',
      desc: 'Tap the time badge on any routine card or today dose to instantly reschedule or shift start times.',
    },
    {
      icon: <Keyboard className="w-5 h-5 text-purple-500" />,
      title: 'Escape Key & Mobile Ergonomics',
      desc: 'Quickly close any modal with the Esc key or backdrop tap, with touch-friendly buttons optimized for mobile.',
    },
    {
      icon: <CheckCheck className="w-5 h-5 text-emerald-500" />,
      title: 'Dashboard Widgets & Filters',
      desc: 'Upcoming & Taken Today cards with adherence progress bars and 1-tap status filtering.',
    },
  ];

  return (
    <AnimatePresence>
      <div
        className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-xs"
        onClick={onClose}
      >
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 15 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95 }}
          className="w-full max-w-md bg-white dark:bg-slate-900 rounded-3xl p-6 shadow-2xl border border-slate-200 dark:border-slate-800 max-h-[85vh] flex flex-col"
          onClick={(e) => e.stopPropagation()}
        >
          <div className="flex items-center justify-between pb-4 border-b border-slate-100 dark:border-slate-800">
            <div className="flex items-center gap-2.5">
              <div className="p-2 rounded-xl bg-teal-50 dark:bg-teal-950/50 text-teal-600 dark:text-teal-400">
                <Sparkles className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-base font-semibold text-slate-900 dark:text-white">What's New</h3>
                <p className="text-xs text-slate-500 dark:text-slate-400">PillPulse Version v1.3.0</p>
              </div>
            </div>
            <button
              onClick={onClose}
              className="p-1.5 rounded-lg text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          <div className="overflow-y-auto py-4 space-y-3.5 pr-1">
            {features.map((feat, i) => (
              <div key={i} className="flex items-start gap-3">
                <div className="mt-0.5 p-1.5 rounded-lg bg-slate-100 dark:bg-slate-800 shrink-0">
                  {feat.icon}
                </div>
                <div>
                  <h4 className="text-sm font-semibold text-slate-900 dark:text-white">{feat.title}</h4>
                  <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed mt-0.5">
                    {feat.desc}
                  </p>
                </div>
              </div>
            ))}
          </div>

          <div className="pt-4 border-t border-slate-100 dark:border-slate-800 flex justify-end">
            <button
              onClick={onClose}
              className="py-2.5 px-5 bg-teal-600 hover:bg-teal-700 text-white font-semibold text-xs rounded-xl shadow-xs transition-colors flex items-center gap-1.5"
            >
              <Check className="w-4 h-4" />
              Got It
            </button>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
