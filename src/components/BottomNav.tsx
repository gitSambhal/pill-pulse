/**
 * PillPulse - Material Design 3 Navigation Bar
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
    <nav className="fixed bottom-0 left-0 right-0 z-40 bg-[#F0F4F9] dark:bg-[#1E1F20] border-t border-[#E0E3E7] dark:border-[#3C4043] pb-safe transition-colors">
      <div className="max-w-2xl mx-auto px-2 sm:px-6 h-19 sm:h-20 flex items-center justify-around relative">
        {/* Today Tab */}
        <button
          onClick={() => onTabChange('today')}
          className="flex flex-col items-center justify-center group cursor-pointer w-16"
          title="Today's Schedule"
        >
          <div
            className={`px-4.5 py-1 rounded-full flex items-center justify-center transition-all relative ${
              activeTab === 'today' ? 'scale-100' : 'hover:bg-[#E0E3E7]/50 dark:hover:bg-[#282A2C]'
            }`}
            style={{
              backgroundColor: activeTab === 'today' ? 'var(--app-accent-subtle, #E8F0FE)' : 'transparent',
              color: activeTab === 'today' ? 'var(--app-accent, #1A73E8)' : '#444746',
            }}
          >
            <Calendar className="w-5 h-5 stroke-[2.2]" />
            {pendingCount > 0 && (
              <span className="absolute -top-1 -right-1 w-4.5 h-4.5 rounded-full bg-[#EA4335] text-white text-[10px] font-bold flex items-center justify-center shadow-xs">
                {pendingCount}
              </span>
            )}
          </div>
          <span
            className={`text-[11px] mt-1 font-medium transition-colors ${
              activeTab === 'today'
                ? 'text-[#1F1F1F] dark:text-[#E3E3E3] font-semibold'
                : 'text-[#444746] dark:text-[#9AA0A6]'
            }`}
          >
            Schedule
          </span>
        </button>

        {/* Routines Tab */}
        <button
          onClick={() => onTabChange('routines')}
          className="flex flex-col items-center justify-center group cursor-pointer w-16"
          title="Routines"
        >
          <div
            className={`px-4.5 py-1 rounded-full flex items-center justify-center transition-all ${
              activeTab === 'routines' ? 'scale-100' : 'hover:bg-[#E0E3E7]/50 dark:hover:bg-[#282A2C]'
            }`}
            style={{
              backgroundColor: activeTab === 'routines' ? 'var(--app-accent-subtle, #E8F0FE)' : 'transparent',
              color: activeTab === 'routines' ? 'var(--app-accent, #1A73E8)' : '#444746',
            }}
          >
            <Layers className="w-5 h-5 stroke-[2.2]" />
          </div>
          <span
            className={`text-[11px] mt-1 font-medium transition-colors ${
              activeTab === 'routines'
                ? 'text-[#1F1F1F] dark:text-[#E3E3E3] font-semibold'
                : 'text-[#444746] dark:text-[#9AA0A6]'
            }`}
          >
            Routines
          </span>
        </button>

        {/* Google Material 3 Floating Action Button (FAB) */}
        <div className="flex flex-col items-center justify-center -mt-6">
          <button
            onClick={onOpenQuickRoutine}
            className="w-14 h-14 rounded-[18px] text-white flex items-center justify-center shadow-md hover:shadow-lg active:scale-95 transition-all cursor-pointer relative group"
            style={{
              backgroundColor: 'var(--app-accent, #1A73E8)',
              boxShadow: '0 4px 12px var(--app-accent-ring, rgba(26, 115, 232, 0.35))',
            }}
            title="Create New Routine"
            aria-label="Create New Routine"
          >
            <Plus className="w-7 h-7 stroke-[2.5] transition-transform group-hover:rotate-90 duration-200" />
          </button>
          <span className="text-[10px] font-medium text-[#444746] dark:text-[#9AA0A6] mt-1">
            New
          </span>
        </div>

        {/* Medicines / Cabinet Tab */}
        <button
          onClick={() => onTabChange('medicines')}
          className="flex flex-col items-center justify-center group cursor-pointer w-16"
          title="Medication Cabinet"
        >
          <div
            className={`px-4.5 py-1 rounded-full flex items-center justify-center transition-all ${
              activeTab === 'medicines' ? 'scale-100' : 'hover:bg-[#E0E3E7]/50 dark:hover:bg-[#282A2C]'
            }`}
            style={{
              backgroundColor: activeTab === 'medicines' ? 'var(--app-accent-subtle, #E8F0FE)' : 'transparent',
              color: activeTab === 'medicines' ? 'var(--app-accent, #1A73E8)' : '#444746',
            }}
          >
            <Pill className="w-5 h-5 stroke-[2.2]" />
          </div>
          <span
            className={`text-[11px] mt-1 font-medium transition-colors ${
              activeTab === 'medicines'
                ? 'text-[#1F1F1F] dark:text-[#E3E3E3] font-semibold'
                : 'text-[#444746] dark:text-[#9AA0A6]'
            }`}
          >
            Cabinet
          </span>
        </button>

        {/* Summary Tab */}
        <button
          onClick={() => onTabChange('adherence')}
          className="flex flex-col items-center justify-center group cursor-pointer w-16"
          title="Adherence & Insights"
        >
          <div
            className={`px-4.5 py-1 rounded-full flex items-center justify-center transition-all ${
              activeTab === 'adherence' ? 'scale-100' : 'hover:bg-[#E0E3E7]/50 dark:hover:bg-[#282A2C]'
            }`}
            style={{
              backgroundColor: activeTab === 'adherence' ? 'var(--app-accent-subtle, #E8F0FE)' : 'transparent',
              color: activeTab === 'adherence' ? 'var(--app-accent, #1A73E8)' : '#444746',
            }}
          >
            <Flame className="w-5 h-5 stroke-[2.2]" />
          </div>
          <span
            className={`text-[11px] mt-1 font-medium transition-colors ${
              activeTab === 'adherence'
                ? 'text-[#1F1F1F] dark:text-[#E3E3E3] font-semibold'
                : 'text-[#444746] dark:text-[#9AA0A6]'
            }`}
          >
            Insights
          </span>
        </button>
      </div>
    </nav>
  );
};

