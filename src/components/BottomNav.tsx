/**
 * PillPulse - Mobile Bottom Navigation
 * Developer: Suhail Akhtar (https://suhail.top)
 */

import React from 'react';
import { Calendar, Layers, Pill, Flame, Plus } from 'lucide-react';

export type NavTab = 'today' | 'routines' | 'medicines' | 'adherence';

interface BottomNavProps {
  activeTab: NavTab;
  onTabChange: (tab: NavTab) => void;
  onOpenQuickRoutine: () => void;
  pendingCount: number;
}

export const BottomNav: React.FC<BottomNavProps> = ({
  activeTab,
  onTabChange,
  onOpenQuickRoutine,
  pendingCount,
}) => {
  return (
    <div className="fixed bottom-0 left-0 right-0 z-40 bg-white/90 dark:bg-slate-950/90 backdrop-blur-md border-t border-slate-200/80 dark:border-slate-800/80 pb-safe">
      <div className="max-w-md mx-auto px-3 h-16 flex items-center justify-around relative">
        {/* Today Tab */}
        <button
          onClick={() => onTabChange('today')}
          className={`flex flex-col items-center justify-center py-1 px-3 rounded-2xl transition-colors relative ${
            activeTab === 'today'
              ? 'text-teal-600 dark:text-teal-400 font-semibold'
              : 'text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
          }`}
        >
          <Calendar className="w-5 h-5" />
          <span className="text-[10px] mt-1">Today</span>
          {pendingCount > 0 && (
            <span className="absolute top-0.5 right-2 w-4 h-4 rounded-full bg-teal-600 text-white text-[9px] font-bold flex items-center justify-center">
              {pendingCount}
            </span>
          )}
        </button>

        {/* Routines Tab */}
        <button
          onClick={() => onTabChange('routines')}
          className={`flex flex-col items-center justify-center py-1 px-3 rounded-2xl transition-colors ${
            activeTab === 'routines'
              ? 'text-teal-600 dark:text-teal-400 font-semibold'
              : 'text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
          }`}
        >
          <Layers className="w-5 h-5" />
          <span className="text-[10px] mt-1">Routines</span>
        </button>

        {/* Floating Quick Routine / Add Button */}
        <button
          onClick={onOpenQuickRoutine}
          className="w-12 h-12 rounded-full bg-linear-to-tr from-teal-600 to-sky-500 text-white flex items-center justify-center shadow-lg shadow-teal-500/25 -mt-5 hover:scale-105 active:scale-95 transition-transform"
          title="Create 5-min Routine"
          aria-label="Create 5-min Routine"
        >
          <Plus className="w-6 h-6 stroke-[2.5]" />
        </button>

        {/* Cabinet Tab */}
        <button
          onClick={() => onTabChange('medicines')}
          className={`flex flex-col items-center justify-center py-1 px-3 rounded-2xl transition-colors ${
            activeTab === 'medicines'
              ? 'text-teal-600 dark:text-teal-400 font-semibold'
              : 'text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
          }`}
        >
          <Pill className="w-5 h-5" />
          <span className="text-[10px] mt-1">Cabinet</span>
        </button>

        {/* Progress / History Tab */}
        <button
          onClick={() => onTabChange('adherence')}
          className={`flex flex-col items-center justify-center py-1 px-3 rounded-2xl transition-colors ${
            activeTab === 'adherence'
              ? 'text-teal-600 dark:text-teal-400 font-semibold'
              : 'text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
          }`}
        >
          <Flame className="w-5 h-5" />
          <span className="text-[10px] mt-1">Streak</span>
        </button>
      </div>
    </div>
  );
};
