/**
 * PillPulse - Next Up & Cascading Routine Step Countdown
 * Developer: Suhail Akhtar (https://suhail.top)
 */

import React from 'react';
import { Clock, CheckCircle2, Sparkles, Timer, FastForward, Bell } from 'lucide-react';
import { ScheduledDose } from '../types';
import { formatTime12h, getPillColorClasses } from '../utils';
import { SlotTimingBadge } from './SlotTimingBadge';

interface NextUpBannerProps {
  nextDose: ScheduledDose | null;
  activeStepCountdown: {
    targetDose: ScheduledDose;
    remainingSeconds: number;
    totalSeconds: number;
  } | null;
  onTakeDose: (dose: ScheduledDose) => void;
  onTriggerNow: (dose: ScheduledDose) => void;
  onDismissCountdown?: () => void;
}

export const NextUpBanner: React.FC<NextUpBannerProps> = ({
  nextDose,
  activeStepCountdown,
  onTakeDose,
  onTriggerNow,
  onDismissCountdown,
}) => {
  // Cascading Routine Live Countdown View
  if (activeStepCountdown) {
    const { targetDose, remainingSeconds, totalSeconds } = activeStepCountdown;
    const mins = Math.floor(remainingSeconds / 60);
    const secs = remainingSeconds % 60;
    const progress = Math.max(0, Math.min(100, ((totalSeconds - remainingSeconds) / totalSeconds) * 100));

    return (
      <div className="relative overflow-hidden rounded-3xl bg-linear-to-br from-teal-900 to-slate-900 text-white p-5 sm:p-6 shadow-xl border border-teal-500/30 mb-3 sm:mb-4">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <span className="p-1.5 rounded-xl bg-teal-500/20 text-teal-300">
              <Timer className="w-4 h-4 animate-spin" style={{ animationDuration: '4s' }} />
            </span>
            <span className="text-xs font-semibold uppercase tracking-wider text-teal-300">
              {targetDose.routineName || 'Cascading Routine'}
            </span>
          </div>
          <div className="flex items-center gap-1.5">
            <SlotTimingBadge slot={targetDose.slot} size="xs" />
            <span className="text-xs font-medium px-2.5 py-0.5 rounded-full bg-teal-500/20 text-teal-200">
              Step {targetDose.stepIndex} of {targetDose.totalSteps}
            </span>
          </div>
        </div>

        <div className="flex items-end justify-between my-2.5">
          <div>
            <div className="flex items-center gap-1.5 text-xs text-teal-200">
              <span>Next up in {Math.ceil(totalSeconds / 60)}-min interval</span>
              <span className="text-[10px] px-1.5 py-0.5 rounded bg-teal-500/30 text-teal-100 font-medium">
                Take early anytime
              </span>
            </div>
            <h3 className="text-xl font-bold tracking-tight text-white mt-1">
              {targetDose.medicineName}
            </h3>
            <p className="text-xs font-medium text-teal-300 mt-0.5">{targetDose.dosage}</p>
          </div>

          <div className="text-right">
            <div className="text-2xl sm:text-3xl font-mono font-bold tracking-tight text-teal-400">
              {String(mins).padStart(2, '0')}:{String(secs).padStart(2, '0')}
            </div>
            <p className="text-[10px] text-slate-400 mt-0.5">timer remaining</p>
          </div>
        </div>

        {/* Progress bar */}
        <div className="w-full bg-slate-800/80 rounded-full h-2 mt-3 mb-4 overflow-hidden">
          <div
            className="bg-teal-400 h-2 rounded-full transition-all duration-1000 ease-linear"
            style={{ width: `${progress}%` }}
          />
        </div>

        {/* Actions */}
        <div className="flex items-center gap-2 pt-1">
          <button
            onClick={() => onTakeDose(targetDose)}
            className="flex-1 py-2.5 px-4 bg-teal-500 hover:bg-teal-400 active:scale-[0.98] text-slate-950 font-bold text-xs rounded-xl transition-all flex items-center justify-center gap-1.5 shadow-md shadow-teal-500/20 min-h-[42px]"
          >
            <CheckCircle2 className="w-4 h-4" />
            Mark Taken Now (Even with Gap)
          </button>
          
          <button
            onClick={() => onTriggerNow(targetDose)}
            className="py-2.5 px-3.5 bg-white/10 hover:bg-white/20 text-white font-medium text-xs rounded-xl transition-colors flex items-center gap-1.5 min-h-[42px]"
            title="Ring alarm tone now"
          >
            <Bell className="w-3.5 h-3.5" />
            Ring
          </button>

          {onDismissCountdown && (
            <button
              onClick={onDismissCountdown}
              className="py-2.5 px-3 bg-white/10 hover:bg-white/20 text-slate-300 font-medium text-xs rounded-xl transition-colors min-h-[42px]"
              title="Dismiss gap timer"
            >
              Skip Gap
            </button>
          )}
        </div>
      </div>
    );
  }

  // Next Dose Standard View
  if (!nextDose) {
    return (
      <div className="p-5 sm:p-6 rounded-3xl bg-teal-50 dark:bg-slate-900/80 border border-teal-200/60 dark:border-slate-800 text-center mb-3 sm:mb-4">
        <div className="inline-flex p-2 rounded-2xl bg-teal-100 dark:bg-teal-950/60 text-teal-600 dark:text-teal-400 mb-2">
          <Sparkles className="w-5 h-5" />
        </div>
        <h3 className="text-sm sm:text-base font-bold text-slate-900 dark:text-white">
          All Doses Completed for this Day!
        </h3>
        <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
          All scheduled medications for this date are marked taken.
        </p>
      </div>
    );
  }

  const colorStyle = getPillColorClasses(nextDose.color);

  return (
    <div className="rounded-3xl bg-white dark:bg-slate-900 p-5 sm:p-6 shadow-xs border border-slate-200 dark:border-slate-800 relative overflow-hidden mb-3 sm:mb-4">
      <div className="flex items-center justify-between mb-2.5">
        <div className="flex items-center gap-2">
          <span className="p-1.5 rounded-xl bg-teal-50 dark:bg-teal-950/50 text-teal-600 dark:text-teal-400">
            <Clock className="w-4 h-4" />
          </span>
          <span className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
            Next Scheduled Dose
          </span>
        </div>
        <div className="flex items-center gap-1.5">
          <SlotTimingBadge slot={nextDose.slot} size="xs" />
          <span className="text-xs font-mono font-bold text-teal-600 dark:text-teal-400 bg-teal-50 dark:bg-teal-950/60 px-2.5 py-0.5 rounded-lg">
            {formatTime12h(nextDose.scheduledTime)}
          </span>
        </div>
      </div>

      <div className="flex items-center justify-between gap-3 mt-2.5">
        <div className="min-w-0 pr-2">
          {nextDose.routineName && (
            <span className="text-[11px] font-semibold text-teal-600 dark:text-teal-400 block truncate">
              {nextDose.routineName} · Step {nextDose.stepIndex} of {nextDose.totalSteps}
            </span>
          )}
          <h3 className="text-base sm:text-lg font-bold text-slate-900 dark:text-white tracking-tight truncate">
            {nextDose.medicineName}
          </h3>
          <p className="text-xs text-slate-500 dark:text-slate-400 truncate mt-0.5">
            {nextDose.dosage} {nextDose.instructions ? `· ${nextDose.instructions}` : ''}
          </p>
        </div>

        <button
          onClick={() => onTakeDose(nextDose)}
          className="py-2.5 px-4 bg-teal-600 hover:bg-teal-700 text-white font-semibold text-xs rounded-xl shadow-xs hover:shadow-teal-500/20 transition-all flex items-center gap-1.5 shrink-0 active:scale-95 min-h-[40px]"
        >
          <CheckCircle2 className="w-3.5 h-3.5" />
          Mark Taken
        </button>
      </div>
    </div>
  );
};
