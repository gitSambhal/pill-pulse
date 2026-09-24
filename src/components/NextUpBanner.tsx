/**
 * PillPulse - Google At-a-Glance Next Up & Cascading Routine Step Countdown
 * Developer: Suhail Akhtar (https://suhail.top)
 */

import React from 'react';
import { Clock, CheckCircle2, Timer, Bell, X } from 'lucide-react';
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
  // Cascading Routine Live Countdown View (Material 3 Banner)
  if (activeStepCountdown) {
    const { targetDose, remainingSeconds, totalSeconds } = activeStepCountdown;
    const mins = Math.floor(remainingSeconds / 60);
    const secs = remainingSeconds % 60;
    const progress = Math.max(0, Math.min(100, ((totalSeconds - remainingSeconds) / totalSeconds) * 100));

    return (
      <div className="rounded-[24px] bg-[#FFFFFF] dark:bg-[#1E1F20] text-[#1F1F1F] dark:text-[#E3E3E3] p-4.5 sm:p-5 shadow-xs border border-[#E0E3E7] dark:border-[#3C4043] mb-3 transition-colors">
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center gap-2">
            <span
              className="w-7 h-7 rounded-full flex items-center justify-center"
              style={{
                backgroundColor: 'var(--app-accent-subtle, #E8F0FE)',
                color: 'var(--app-accent, #1A73E8)',
              }}
            >
              <Timer className="w-4 h-4 animate-spin" style={{ animationDuration: '4s' }} />
            </span>
            <span
              className="text-[12px] font-medium tracking-normal"
              style={{ color: 'var(--app-accent, #1A73E8)' }}
            >
              {targetDose.routineName || 'Cascading Routine in Progress'}
            </span>
          </div>
          <div className="flex items-center gap-1.5">
            <SlotTimingBadge slot={targetDose.slot} size="xs" />
            <span className="text-[11px] font-medium px-2 py-0.5 rounded-full bg-[#F0F4F9] dark:bg-[#282A2C] text-[#444746] dark:text-[#9AA0A6]">
              Step {targetDose.stepIndex} of {targetDose.totalSteps}
            </span>
          </div>
        </div>

        <div className="flex items-end justify-between my-2.5">
          <div>
            <div className="flex items-center gap-1.5 text-[12px] text-[#444746] dark:text-[#9AA0A6]">
              <span>Next interval: {Math.ceil(totalSeconds / 60)} min gap</span>
              <span
                className="text-[10px] px-1.5 py-0.5 rounded-md font-medium"
                style={{
                  backgroundColor: 'var(--app-accent-subtle, #E8F0FE)',
                  color: 'var(--app-accent, #1A73E8)',
                }}
              >
                Safe to take early
              </span>
            </div>
            <h3 className="text-[18px] font-medium text-[#1F1F1F] dark:text-[#E3E3E3] mt-1">
              {targetDose.medicineName}
            </h3>
            <p className="text-[13px] text-[#444746] dark:text-[#9AA0A6] mt-0.5">{targetDose.dosage}</p>
          </div>

          <div className="text-right">
            <div
              className="text-2xl sm:text-3xl font-mono font-medium tracking-tight"
              style={{ color: 'var(--app-accent, #1A73E8)' }}
            >
              {String(mins).padStart(2, '0')}:{String(secs).padStart(2, '0')}
            </div>
            <p className="text-[11px] text-[#444746] dark:text-[#9AA0A6] mt-0.5">remaining</p>
          </div>
        </div>

        {/* Google Material 3 Linear Progress Bar */}
        <div className="w-full bg-[#F0F4F9] dark:bg-[#282A2C] rounded-full h-2 mt-3 mb-3.5 overflow-hidden">
          <div
            className="h-2 rounded-full transition-all duration-1000 ease-linear"
            style={{
              width: `${progress}%`,
              backgroundColor: 'var(--app-accent, #1A73E8)',
            }}
          />
        </div>

        {/* Material 3 Actions */}
        <div className="flex items-center gap-2 pt-1">
          <button
            onClick={() => onTakeDose(targetDose)}
            className="flex-1 py-2.5 px-4 text-white font-medium text-[13px] rounded-full transition-all flex items-center justify-center gap-1.5 shadow-xs cursor-pointer active:scale-98"
            style={{ backgroundColor: 'var(--app-accent, #1A73E8)' }}
          >
            <CheckCircle2 className="w-4 h-4" />
            Mark Taken
          </button>
          
          <button
            onClick={() => onTriggerNow(targetDose)}
            className="py-2.5 px-3.5 rounded-full border border-[#747775] dark:border-[#8E918F] hover:bg-[#F0F4F9] dark:hover:bg-[#282A2C] text-[#1F1F1F] dark:text-[#E3E3E3] font-medium text-[13px] transition-colors flex items-center gap-1.5 cursor-pointer active:scale-95"
            title="Ring chime alert now"
          >
            <Bell className="w-3.5 h-3.5" style={{ color: 'var(--app-accent, #1A73E8)' }} />
            Chime
          </button>

          {onDismissCountdown && (
            <button
              onClick={onDismissCountdown}
              className="w-10 h-10 rounded-full hover:bg-[#F0F4F9] dark:hover:bg-[#282A2C] text-[#444746] dark:text-[#9AA0A6] flex items-center justify-center transition-colors cursor-pointer active:scale-95"
              title="Dismiss timer"
              aria-label="Dismiss timer"
            >
              <X className="w-4 h-4" />
            </button>
          )}
        </div>
      </div>
    );
  }

  // Next Dose Standard View
  if (!nextDose) {
    return (
      <div className="p-4 sm:p-5 rounded-[24px] bg-white dark:bg-[#1E1F20] border border-[#E0E3E7] dark:border-[#3C4043] text-center mb-3 shadow-xs">
        <div className="w-10 h-10 rounded-full bg-[#E6F4EA] dark:bg-[#0D652D]/30 text-[#1E8E3E] dark:text-[#81C995] flex items-center justify-center mx-auto mb-2">
          <CheckCircle2 className="w-5 h-5" />
        </div>
        <h3 className="text-[16px] font-medium text-[#1F1F1F] dark:text-[#E3E3E3]">
          All Medications Completed
        </h3>
        <p className="text-[13px] text-[#444746] dark:text-[#9AA0A6] mt-0.5">
          All scheduled doses for this day are marked taken.
        </p>
      </div>
    );
  }

  const colorStyle = getPillColorClasses(nextDose.color);

  return (
    <div className="rounded-[24px] bg-white dark:bg-[#1E1F20] p-4 sm:p-5 shadow-xs border border-[#E0E3E7] dark:border-[#3C4043] relative mb-3">
      <div className="flex items-center justify-between mb-2">
        <div className="flex items-center gap-2">
          <span
            className="w-7 h-7 rounded-full flex items-center justify-center"
            style={{
              backgroundColor: 'var(--app-accent-subtle, #E8F0FE)',
              color: 'var(--app-accent, #1A73E8)',
            }}
          >
            <Clock className="w-3.5 h-3.5" />
          </span>
          <span className="text-[12px] font-medium text-[#444746] dark:text-[#9AA0A6]">
            At a Glance · Up Next
          </span>
        </div>
        <div className="flex items-center gap-1.5">
          <SlotTimingBadge slot={nextDose.slot} size="xs" />
          <span
            className="text-xs font-mono font-medium px-2 py-0.5 rounded-full"
            style={{
              color: 'var(--app-accent, #1A73E8)',
              backgroundColor: 'var(--app-accent-subtle, #E8F0FE)',
            }}
          >
            {formatTime12h(nextDose.scheduledTime)}
          </span>
        </div>
      </div>

      <div className="flex items-center justify-between gap-3 mt-2.5">
        <div className="min-w-0 pr-2">
          {nextDose.routineName && (
            <span
              className="text-[11px] font-medium block truncate"
              style={{ color: 'var(--app-accent, #1A73E8)' }}
            >
              {nextDose.routineName} · Step {nextDose.stepIndex} of {nextDose.totalSteps}
            </span>
          )}
          <h3 className="text-[17px] font-medium text-[#1F1F1F] dark:text-[#E3E3E3] tracking-normal truncate">
            {nextDose.medicineName}
          </h3>
          <p className="text-[13px] text-[#444746] dark:text-[#9AA0A6] truncate mt-0.5">
            {nextDose.dosage} {nextDose.instructions ? `· ${nextDose.instructions}` : ''}
          </p>
        </div>

        <button
          onClick={() => onTakeDose(nextDose)}
          className="py-2 px-5 text-white font-medium text-[13px] rounded-full shadow-xs transition-all flex items-center gap-1.5 shrink-0 active:scale-95 cursor-pointer"
          style={{ backgroundColor: 'var(--app-accent, #1A73E8)' }}
        >
          <CheckCircle2 className="w-3.5 h-3.5" />
          Take
        </button>
      </div>
    </div>
  );
};
