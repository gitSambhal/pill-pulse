/**
 * PillPulse - What's New & Changelog Modal (Google Product UI)
 * Developer: Suhail Akhtar (https://suhail.top)
 */

import React from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Sparkles, X, Check, Calendar, Palette, Navigation, HeartPulse } from 'lucide-react';

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

  const features = [
    {
      icon: <HeartPulse className="w-5 h-5 text-[#1A73E8]" />,
      title: 'Google Product & Material 3 Aesthetic',
      desc: 'Transformed look and feel into an official Google Health application featuring Material You surface containers, 24px corner radii, and Google Sans typography.',
    },
    {
      icon: <Calendar className="w-5 h-5 text-[#34A853]" />,
      title: 'Google Calendar Date Navigation',
      desc: 'Interactive date switcher modeled directly after Google Calendar with active blue circular day indicator, adherence dots, and "Today" quick jump button.',
    },
    {
      icon: <Navigation className="w-5 h-5 text-[#FBBC04]" />,
      title: 'Material 3 Navigation Bar & Floating Action Button',
      desc: 'Bottom bar with Material 3 pill active highlights and an elevated central Google Floating Action Button (FAB) for instant routine creation.',
    },
    {
      icon: <Palette className="w-5 h-5 text-[#EA4335]" />,
      title: 'Google 4-Color Motif & Material You Palettes',
      desc: 'Accented with Google’s signature Blue (#4285F4), Red (#EA4335), Yellow (#FBBC04), and Green (#34A853), plus Material You tonal accents.',
    },
  ];

  return (
    <AnimatePresence>
      {isOpen && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50"
          onClick={onClose}
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.94, y: 12 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.94, y: 8 }}
            transition={{ duration: 0.18, ease: 'easeOut' }}
            className="w-full max-w-md bg-white dark:bg-[#1E1F20] rounded-[28px] p-6 shadow-2xl border border-[#E0E3E7] dark:border-[#3C4043] max-h-[85vh] flex flex-col"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between pb-4 border-b border-[#E0E3E7] dark:border-[#3C4043]">
              <div className="flex items-center gap-3">
                <div
                  className="w-10 h-10 rounded-[14px] flex items-center justify-center shrink-0"
                  style={{
                    backgroundColor: 'var(--app-accent-subtle, #E8F0FE)',
                    color: 'var(--app-accent, #1A73E8)',
                  }}
                >
                  <Sparkles className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-[18px] font-medium text-[#1F1F1F] dark:text-[#E3E3E3]">What's New</h3>
                  <p className="text-[12px] text-[#444746] dark:text-[#9AA0A6]">PillPulse v1.6.0</p>
                </div>
              </div>
              <button
                onClick={onClose}
                className="w-9 h-9 rounded-full hover:bg-[#F0F4F9] dark:hover:bg-[#282A2C] text-[#444746] dark:text-[#9AA0A6] transition-colors flex items-center justify-center cursor-pointer"
                title="Close"
              >
                <X className="w-4.5 h-4.5" />
              </button>
            </div>

            <div className="overflow-y-auto py-4 space-y-4 pr-1">
              {features.map((feat, i) => (
                <div key={i} className="flex items-start gap-3">
                  <div className="mt-0.5 p-2 rounded-[12px] bg-[#F0F4F9] dark:bg-[#282A2C] shrink-0">
                    {feat.icon}
                  </div>
                  <div>
                    <h4 className="text-[14px] font-medium text-[#1F1F1F] dark:text-[#E3E3E3]">{feat.title}</h4>
                    <p className="text-[12px] text-[#444746] dark:text-[#9AA0A6] leading-relaxed mt-0.5">
                      {feat.desc}
                    </p>
                  </div>
                </div>
              ))}
            </div>

            <div className="pt-3 border-t border-[#E0E3E7] dark:border-[#3C4043]">
              <button
                onClick={onClose}
                className="w-full py-3 px-5 text-white font-medium text-[14px] rounded-full shadow-xs transition-colors flex items-center justify-center gap-1.5 active:scale-95 cursor-pointer"
                style={{ backgroundColor: 'var(--app-accent, #1A73E8)' }}
              >
                <Check className="w-4 h-4 stroke-[2.5]" />
                Explore Google Product UI
              </button>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};
