/**
 * PillPulse - Google Health Schedule & Dashboard View
 * Developer: Suhail Akhtar (https://suhail.top)
 */

import React, { useState } from 'react';
import {
  CheckCircle2,
  Clock,
  Volume2,
  Layers,
  Sparkles,
  Pill,
  Check,
  RotateCcw,
  FastForward,
  Hourglass,
  Sunrise,
  Sun,
  Sunset,
  Moon,
  Info,
} from 'lucide-react';
import { ScheduledDose } from '../../types';
import {
  formatTime12h,
  getPillColorClasses,
  isToday,
  isPastDate,
  isFutureDate,
} from '../../utils';
import { NextUpBanner } from '../../components/NextUpBanner';
import { DateNavigator } from '../../components/DateNavigator';
import { SlotTimingBadge } from '../../components/SlotTimingBadge';

interface TodayViewProps {
  selectedDate: string;
  onSelectDate: (dateStr: string) => void;
  doses: ScheduledDose[];
  activeStepCountdown: {
    targetDose: ScheduledDose;
    remainingSeconds: number;
    totalSeconds: number;
  } | null;
  onTakeDose: (dose: ScheduledDose) => void;
  onUndoDose: (dose: ScheduledDose) => void;
  onTakeEntireRoutine: (routineId: string) => void;
  onSnoozeDose: (dose: ScheduledDose, minutes: number) => void;
  onSkipDose: (dose: ScheduledDose) => void;
  onTriggerAlarmNow: (dose: ScheduledDose) => void;
  onDismissCountdown: () => void;
  onOpenQuickRoutine: () => void;
  onUpdateDoseTime?: (doseId: string, newTime: string) => void;
}

type DashboardStatusFilter = 'all' | 'upcoming' | 'taken';

export const TodayView: React.FC<TodayViewProps> = ({
  selectedDate,
  onSelectDate,
  doses,
  activeStepCountdown,
  onTakeDose,
  onUndoDose,
  onTakeEntireRoutine,
  onSnoozeDose,
  onSkipDose,
  onTriggerAlarmNow,
  onDismissCountdown,
  onOpenQuickRoutine,
  onUpdateDoseTime,
}) => {
  const [selectedSlot, setSelectedSlot] = useState<string>('all');
  const [statusFilter, setStatusFilter] = useState<DashboardStatusFilter>('all');

  const isViewingToday = isToday(selectedDate);
  const isViewingPast = isPastDate(selectedDate);
  const isViewingFuture = isFutureDate(selectedDate);

  // Split doses into statuses
  const pendingDoses = doses.filter((d) => d.status === 'pending' || d.status === 'snoozed');
  const takenDoses = doses.filter((d) => d.status === 'taken');
  const skippedDoses = doses.filter((d) => d.status === 'skipped');

  // Next upcoming pending dose
  const nextDose = pendingDoses[0] || null;

  // Last taken dose (most recent)
  const lastTakenDose = takenDoses[takenDoses.length - 1] || null;

  // Adherence percentage
  const adherenceRate = doses.length > 0 ? Math.round((takenDoses.length / doses.length) * 100) : 0;

  // Filter doses by slot & status
  const filteredDoses = doses.filter((d) => {
    const slotMatch = selectedSlot === 'all' || d.slot === selectedSlot;
    if (!slotMatch) return false;

    if (statusFilter === 'upcoming') {
      return d.status === 'pending' || d.status === 'snoozed';
    }
    if (statusFilter === 'taken') {
      return d.status === 'taken';
    }
    return true;
  });

  // Group routines present in the list that have multiple pending items
  const routineGroups = React.useMemo(() => {
    const map = new Map<string, { name: string; pendingCount: number; totalCount: number }>();
    doses.forEach((d) => {
      if (d.routineId) {
        const existing = map.get(d.routineId) || {
          name: d.routineName || 'Routine',
          pendingCount: 0,
          totalCount: 0,
        };
        existing.totalCount++;
        if (d.status === 'pending' || d.status === 'snoozed') existing.pendingCount++;
        map.set(d.routineId, existing);
      }
    });
    return map;
  }, [doses]);

  const slots: { id: string; label: string; icon: React.ReactNode }[] = [
    { id: 'all', label: 'All Slots', icon: <Layers className="w-3.5 h-3.5" /> },
    { id: 'morning', label: 'Morning', icon: <Sunrise className="w-3.5 h-3.5 text-amber-500" /> },
    { id: 'afternoon', label: 'Afternoon', icon: <Sun className="w-3.5 h-3.5 text-orange-500" /> },
    { id: 'evening', label: 'Evening', icon: <Sunset className="w-3.5 h-3.5 text-rose-500" /> },
    { id: 'night', label: 'Night', icon: <Moon className="w-3.5 h-3.5 text-indigo-400" /> },
  ];

  // Helper to render a single Google M3 dose card
  const renderDoseCard = (dose: ScheduledDose) => {
    const isTaken = dose.status === 'taken';
    const isSnoozed = dose.status === 'snoozed';
    const isSkipped = dose.status === 'skipped';
    const colorStyle = getPillColorClasses(dose.color);
    const isTargetOfCountdown = activeStepCountdown?.targetDose.id === dose.id;
    const routineInfo = dose.routineId ? routineGroups.get(dose.routineId) : undefined;
    const canTakeEntireRoutine = dose.routineId && routineInfo && routineInfo.pendingCount > 1;

    return (
      <div
        key={dose.id}
        className={`p-4 sm:p-4.5 rounded-[22px] border transition-all ${
          isTargetOfCountdown
            ? 'border-[var(--app-accent,#1A73E8)] ring-2 ring-[var(--app-accent-subtle,#E8F0FE)] bg-white dark:bg-[#1E1F20] shadow-sm'
            : isTaken
            ? 'bg-[#F8F9FA]/80 dark:bg-[#18191A] border-[#E0E3E7]/80 dark:border-[#3C4043]/80 opacity-90'
            : 'bg-white dark:bg-[#1E1F20] border-[#E0E3E7] dark:border-[#3C4043] shadow-2xs hover:shadow-xs hover:border-[#C4C7C5] dark:hover:border-[#5E6368]'
        }`}
      >
        <div className="flex items-start justify-between gap-3">
          {/* Left pill indicator & details */}
          <div className="flex items-start gap-3 min-w-0">
            <div
              className={`w-10 h-10 rounded-[14px] flex items-center justify-center shrink-0 ${colorStyle.bg} ${colorStyle.text} border ${colorStyle.border}`}
            >
              <Pill className="w-5 h-5 -rotate-45" />
            </div>

            <div className="min-w-0">
              {/* Timing Slot & Routine step badge */}
              <div className="flex items-center gap-1.5 mb-1 flex-wrap">
                <SlotTimingBadge slot={dose.slot} size="xs" />

                {dose.routineName && (
                  <span
                    className="text-[11px] font-medium px-2 py-0.5 rounded-full"
                    style={{
                      color: 'var(--app-accent, #1A73E8)',
                      backgroundColor: 'var(--app-accent-subtle, #E8F0FE)',
                    }}
                  >
                    Step {dose.stepIndex} of {dose.totalSteps}
                  </span>
                )}
                {dose.nextStepGapMinutes !== undefined && (
                  <span className="text-[11px] text-[#444746] dark:text-[#9AA0A6]">
                    {dose.nextStepGapMinutes === 0
                      ? '· Together'
                      : `· +${dose.nextStepGapMinutes}m gap`}
                  </span>
                )}
                {isTargetOfCountdown && (
                  <span className="text-[11px] font-medium text-[#B06000] dark:text-[#FBBC04] bg-[#FEF7E0] dark:bg-[#FBBC04]/15 px-2 py-0.5 rounded-full">
                    Interval Active
                  </span>
                )}
              </div>

              <h3
                className={`text-[16px] sm:text-[17px] font-medium tracking-normal truncate ${
                  isTaken
                    ? 'line-through text-[#444746] dark:text-[#9AA0A6]'
                    : 'text-[#1F1F1F] dark:text-[#E3E3E3]'
                }`}
              >
                {dose.medicineName}
              </h3>

              <p className="text-[13px] text-[#444746] dark:text-[#9AA0A6] mt-0.5">
                {dose.dosage}
                {dose.instructions ? ` · ${dose.instructions}` : ''}
              </p>

              {/* Time & status text */}
              <div className="flex items-center gap-2 mt-2 text-xs font-medium text-[#444746] dark:text-[#9AA0A6] flex-wrap">
                {!isTaken ? (
                  <label
                    className="relative inline-flex items-center gap-1.5 cursor-pointer bg-[#F0F4F9] dark:bg-[#282A2C] hover:bg-[#E0E3E7] dark:hover:bg-[#3C4043] px-3 py-1 rounded-full transition-colors border border-transparent"
                    title="Tap to adjust scheduled time"
                  >
                    <Clock className="w-3.5 h-3.5 pointer-events-none" style={{ color: 'var(--app-accent, #1A73E8)' }} />
                    <span className="font-medium text-[#1F1F1F] dark:text-[#E3E3E3]">
                      {formatTime12h(dose.scheduledTime)}
                    </span>
                    <span className="text-[11px] font-medium ml-0.5" style={{ color: 'var(--app-accent, #1A73E8)' }}>
                      Edit
                    </span>
                    <input
                      type="time"
                      value={dose.scheduledTime}
                      onChange={(e) => onUpdateDoseTime?.(dose.id, e.target.value)}
                      className="absolute inset-0 opacity-0 cursor-pointer w-full h-full"
                    />
                  </label>
                ) : (
                  <div className="flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-[#E6F4EA] dark:bg-[#0D652D]/30 text-[#1E8E3E] dark:text-[#81C995]">
                    <Clock className="w-3.5 h-3.5" />
                    <span>{formatTime12h(dose.scheduledTime)}</span>
                  </div>
                )}
                {isSnoozed && (
                  <span className="text-[11px] text-[#B06000] dark:text-[#FBBC04] font-medium">
                    (Snoozed)
                  </span>
                )}
                {isSkipped && (
                  <span className="text-[11px] text-[#EA4335] font-medium">
                    (Skipped)
                  </span>
                )}
                {isTaken && dose.takenAt && (
                  <span className="text-[11px] text-[#1E8E3E] dark:text-[#81C995] font-medium flex items-center gap-1">
                    <Check className="w-3 h-3" />
                    Logged {formatTime12h(new Date(dose.takenAt).toTimeString().slice(0, 5))}
                  </span>
                )}
              </div>
            </div>
          </div>

          {/* Right Action buttons */}
          <div className="flex flex-col items-end gap-1.5 shrink-0">
            {isTaken ? (
              <div className="flex flex-col items-end gap-1">
                <span className="inline-flex items-center gap-1 text-[12px] font-medium text-[#1E8E3E] dark:text-[#81C995] bg-[#E6F4EA] dark:bg-[#0D652D]/30 px-3 py-1 rounded-full">
                  <Check className="w-3.5 h-3.5 stroke-[2.5]" /> Taken
                </span>
                {/* Undo button */}
                <button
                  onClick={() => onUndoDose(dose)}
                  className="text-[11px] text-[#444746] dark:text-[#9AA0A6] hover:text-[#1F1F1F] dark:hover:text-[#E3E3E3] flex items-center gap-1 transition-colors px-1 py-0.5 cursor-pointer"
                  title="Undo mark as taken"
                >
                  <RotateCcw className="w-2.5 h-2.5" /> Undo
                </button>
              </div>
            ) : (
              <div className="flex items-center gap-1.5">
                {/* Chime ring preview (only on today) */}
                {isViewingToday && (
                  <button
                    onClick={() => onTriggerAlarmNow(dose)}
                    className="w-8.5 h-8.5 rounded-full hover:bg-[#F0F4F9] dark:hover:bg-[#282A2C] transition-colors flex items-center justify-center cursor-pointer text-[#444746] dark:text-[#C4C7C5]"
                    title="Ring alarm chime now"
                  >
                    <Volume2 className="w-4 h-4" />
                  </button>
                )}

                {/* Google Material 3 Primary Take button */}
                <button
                  onClick={() => onTakeDose(dose)}
                  className="py-1.5 px-4 font-medium text-[13px] rounded-full shadow-xs transition-all flex items-center gap-1.5 active:scale-95 text-white cursor-pointer"
                  style={{
                    backgroundColor: isTargetOfCountdown ? '#B06000' : 'var(--app-accent, #1A73E8)',
                  }}
                  title="Mark medicine as taken"
                >
                  <CheckCircle2 className="w-3.5 h-3.5" />
                  {isTargetOfCountdown ? 'Take Early' : 'Take'}
                </button>
              </div>
            )}

            {!isTaken && isViewingToday && (
              <div className="flex items-center gap-2 pt-0.5">
                <button
                  onClick={() => onSnoozeDose(dose, 5)}
                  className="text-[11px] text-[#444746] dark:text-[#9AA0A6] hover:underline px-1 py-0.5 cursor-pointer"
                  style={{ color: 'var(--app-accent, #1A73E8)' }}
                >
                  Snooze
                </button>
                <button
                  onClick={() => onSkipDose(dose)}
                  className="text-[11px] text-[#444746] dark:text-[#9AA0A6] hover:text-[#EA4335] px-1 py-0.5 cursor-pointer"
                >
                  Skip
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Take entire routine stack shortcut if multi-pill sequence */}
        {!isTaken && canTakeEntireRoutine && dose.stepIndex === 1 && (
          <div className="mt-3 pt-2.5 border-t border-[#E0E3E7] dark:border-[#3C4043] flex items-center justify-between text-xs">
            <span className="text-[12px] text-[#444746] dark:text-[#9AA0A6]">
              Taking all {routineInfo.totalCount} medicines in this routine together?
            </span>
            <button
              onClick={() => onTakeEntireRoutine(dose.routineId!)}
              className="text-[12px] font-medium hover:underline flex items-center gap-1 cursor-pointer"
              style={{ color: 'var(--app-accent, #1A73E8)' }}
            >
              <FastForward className="w-3.5 h-3.5" /> Mark All Taken
            </button>
          </div>
        )}
      </div>
    );
  };

  return (
    <div className="space-y-4">
      {/* 1. Google Calendar Interactive Date Navigator */}
      <DateNavigator
        selectedDate={selectedDate}
        onSelectDate={onSelectDate}
        dosesCount={doses.length}
        takenCount={takenDoses.length}
      />

      {/* 2. Top Banner: Live countdown or active next dose on Today */}
      {isViewingToday && (
        <NextUpBanner
          nextDose={nextDose}
          activeStepCountdown={activeStepCountdown}
          onTakeDose={onTakeDose}
          onTriggerNow={onTriggerAlarmNow}
          onDismissCountdown={onDismissCountdown}
        />
      )}

      {/* 3. Google Health Dashboard Metric Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        {/* Upcoming Meds Card */}
        <div
          onClick={() => setStatusFilter(statusFilter === 'upcoming' ? 'all' : 'upcoming')}
          className={`p-4 sm:p-4.5 rounded-[24px] border transition-all cursor-pointer select-none space-y-1.5 ${
            statusFilter === 'upcoming'
              ? 'bg-white dark:bg-[#1E1F20] border-[var(--app-accent,#1A73E8)] ring-2 ring-[var(--app-accent-subtle,#E8F0FE)] shadow-xs'
              : 'bg-white dark:bg-[#1E1F20] border-[#E0E3E7] dark:border-[#3C4043] shadow-xs hover:border-[#C4C7C5] dark:hover:border-[#5E6368]'
          }`}
        >
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="w-7 h-7 rounded-full bg-[#FEF7E0] dark:bg-[#FBBC04]/20 text-[#B06000] dark:text-[#FBBC04] flex items-center justify-center">
                <Hourglass className="w-3.5 h-3.5" />
              </div>
              <span className="text-[12px] font-medium text-[#444746] dark:text-[#9AA0A6]">
                Upcoming
              </span>
            </div>
            <span
              className={`text-[11px] font-medium px-2 py-0.5 rounded-full ${
                pendingDoses.length > 0
                  ? 'bg-[#FEF7E0] dark:bg-[#FBBC04]/15 text-[#B06000] dark:text-[#FBBC04]'
                  : 'bg-[#E6F4EA] dark:bg-[#0D652D]/30 text-[#1E8E3E] dark:text-[#81C995]'
              }`}
            >
              {pendingDoses.length > 0 ? `${pendingDoses.length} Pending` : 'All Done'}
            </span>
          </div>

          <div className="pt-1">
            {nextDose ? (
              <div>
                <p className="text-[15px] font-medium text-[#1F1F1F] dark:text-[#E3E3E3] truncate">
                  {nextDose.medicineName} ({nextDose.dosage})
                </p>
                <div className="text-[12px] text-[#444746] dark:text-[#9AA0A6] flex items-center gap-1.5 mt-1 flex-wrap">
                  <Clock className="w-3 h-3 shrink-0" style={{ color: 'var(--app-accent, #1A73E8)' }} />
                  <span>{formatTime12h(nextDose.scheduledTime)}</span>
                  <SlotTimingBadge slot={nextDose.slot} size="xs" />
                </div>
              </div>
            ) : (
              <p className="text-[13px] text-[#1E8E3E] dark:text-[#81C995] font-medium">
                No upcoming medications pending for this date!
              </p>
            )}
          </div>
        </div>

        {/* Taken Today Card */}
        <div
          onClick={() => setStatusFilter(statusFilter === 'taken' ? 'all' : 'taken')}
          className={`p-4 sm:p-4.5 rounded-[24px] border transition-all cursor-pointer select-none space-y-1.5 ${
            statusFilter === 'taken'
              ? 'bg-white dark:bg-[#1E1F20] border-[#1E8E3E] ring-2 ring-[#E6F4EA] dark:ring-[#0D652D]/30 shadow-xs'
              : 'bg-white dark:bg-[#1E1F20] border-[#E0E3E7] dark:border-[#3C4043] shadow-xs hover:border-[#C4C7C5] dark:hover:border-[#5E6368]'
          }`}
        >
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="w-7 h-7 rounded-full bg-[#E6F4EA] dark:bg-[#0D652D]/20 text-[#1E8E3E] dark:text-[#81C995] flex items-center justify-center">
                <CheckCircle2 className="w-3.5 h-3.5" />
              </div>
              <span className="text-[12px] font-medium text-[#444746] dark:text-[#9AA0A6]">
                Adherence Rate
              </span>
            </div>
            <span className="text-[11px] font-medium px-2 py-0.5 rounded-full bg-[#E6F4EA] dark:bg-[#0D652D]/30 text-[#1E8E3E] dark:text-[#81C995]">
              {takenDoses.length} of {doses.length} ({adherenceRate}%)
            </span>
          </div>

          <div className="pt-1">
            {/* Google Linear Track */}
            <div className="w-full bg-[#F0F4F9] dark:bg-[#282A2C] rounded-full h-2 mb-2 overflow-hidden">
              <div
                className="bg-[#1E8E3E] dark:bg-[#81C995] h-full rounded-full transition-all duration-300"
                style={{ width: `${adherenceRate}%` }}
              />
            </div>

            <p className="text-[12px] text-[#444746] dark:text-[#9AA0A6] truncate">
              {lastTakenDose
                ? `Last: ${lastTakenDose.medicineName} (${formatTime12h(
                    lastTakenDose.takenAt
                      ? new Date(lastTakenDose.takenAt).toTimeString().slice(0, 5)
                      : lastTakenDose.scheduledTime
                  )})`
                : 'No medications recorded yet'}
            </p>
          </div>
        </div>
      </div>

      {/* 4. Google Material 3 Filter Chips for Status */}
      <div className="flex items-center justify-between gap-3 pt-1">
        <div className="flex items-center gap-1.5 p-1 bg-[#F0F4F9] dark:bg-[#282A2C] rounded-full flex-1 max-w-sm">
          <button
            onClick={() => setStatusFilter('all')}
            className={`flex-1 py-1.5 text-[12px] font-medium rounded-full transition-all text-center cursor-pointer ${
              statusFilter === 'all'
                ? 'bg-white dark:bg-[#3C4043] text-[#1F1F1F] dark:text-[#E3E3E3] shadow-xs'
                : 'text-[#444746] dark:text-[#9AA0A6] hover:text-black dark:hover:text-white'
            }`}
          >
            All ({doses.length})
          </button>
          <button
            onClick={() => setStatusFilter('upcoming')}
            className={`flex-1 py-1.5 text-[12px] font-medium rounded-full transition-all text-center cursor-pointer ${
              statusFilter === 'upcoming'
                ? 'bg-white dark:bg-[#3C4043] text-[#B06000] dark:text-[#FBBC04] shadow-xs'
                : 'text-[#444746] dark:text-[#9AA0A6] hover:text-[#B06000]'
            }`}
          >
            Upcoming ({pendingDoses.length})
          </button>
          <button
            onClick={() => setStatusFilter('taken')}
            className={`flex-1 py-1.5 text-[12px] font-medium rounded-full transition-all text-center cursor-pointer ${
              statusFilter === 'taken'
                ? 'bg-white dark:bg-[#3C4043] text-[#1E8E3E] dark:text-[#81C995] shadow-xs'
                : 'text-[#444746] dark:text-[#9AA0A6] hover:text-[#1E8E3E]'
            }`}
          >
            Taken ({takenDoses.length})
          </button>
        </div>

        <button
          onClick={onOpenQuickRoutine}
          className="inline-flex items-center gap-1 text-[13px] font-medium hover:underline shrink-0 px-2 py-1 cursor-pointer"
          style={{ color: 'var(--app-accent, #1A73E8)' }}
        >
          <Layers className="w-4 h-4" />
          + Routine
        </button>
      </div>

      {/* 5. Google Material 3 Time Slot Filter Chips */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none">
        {slots.map((s) => (
          <button
            key={s.id}
            onClick={() => setSelectedSlot(s.id)}
            className={`px-3.5 py-1.5 rounded-full text-[12px] font-medium transition-all whitespace-nowrap inline-flex items-center gap-1.5 active:scale-95 cursor-pointer ${
              selectedSlot === s.id
                ? 'shadow-xs'
                : 'bg-white dark:bg-[#1E1F20] text-[#444746] dark:text-[#9AA0A6] border border-[#E0E3E7] dark:border-[#3C4043] hover:text-[#1F1F1F] dark:hover:text-[#E3E3E3]'
            }`}
            style={
              selectedSlot === s.id
                ? {
                    backgroundColor: 'var(--app-accent-subtle, #E8F0FE)',
                    color: 'var(--app-accent, #1A73E8)',
                    borderColor: 'var(--app-accent, #1A73E8)',
                    borderWidth: '1px',
                  }
                : undefined
            }
          >
            {s.icon}
            <span>{s.label}</span>
          </button>
        ))}
      </div>

      {/* 6. Main Medication Doses List */}
      <div className="space-y-4">
        {/* If user selected "all", render explicit grouped sections */}
        {statusFilter === 'all' && (
          <>
            {/* Upcoming Section */}
            {pendingDoses.length > 0 && (
              <div className="space-y-2.5">
                <div className="flex items-center justify-between px-1">
                  <span className="text-[12px] font-medium text-[#B06000] dark:text-[#FBBC04] flex items-center gap-1.5">
                    <Hourglass className="w-3.5 h-3.5" />
                    Due & Upcoming ({pendingDoses.length})
                  </span>
                  <span className="text-[11px] text-[#444746] dark:text-[#9AA0A6]">Can take anytime</span>
                </div>
                {pendingDoses
                  .filter((d) => selectedSlot === 'all' || d.slot === selectedSlot)
                  .map(renderDoseCard)}
              </div>
            )}

            {/* Taken Today Section */}
            {takenDoses.length > 0 && (
              <div className="space-y-2.5">
                <div className="flex items-center justify-between px-1">
                  <span className="text-[12px] font-medium text-[#1E8E3E] dark:text-[#81C995] flex items-center gap-1.5">
                    <CheckCircle2 className="w-3.5 h-3.5" />
                    Taken ({takenDoses.length})
                  </span>
                  <span className="text-[11px] text-[#444746] dark:text-[#9AA0A6]">Recorded in history</span>
                </div>
                {takenDoses
                  .filter((d) => selectedSlot === 'all' || d.slot === selectedSlot)
                  .map(renderDoseCard)}
              </div>
            )}

            {/* Skipped Section */}
            {skippedDoses.length > 0 && (
              <div className="space-y-2.5">
                <div className="flex items-center justify-between px-1">
                  <span className="text-[12px] font-medium text-[#EA4335] flex items-center gap-1.5">
                    <Info className="w-3.5 h-3.5" />
                    Skipped ({skippedDoses.length})
                  </span>
                </div>
                {skippedDoses
                  .filter((d) => selectedSlot === 'all' || d.slot === selectedSlot)
                  .map(renderDoseCard)}
              </div>
            )}
          </>
        )}

        {/* If user filtered specifically by upcoming or taken */}
        {statusFilter !== 'all' && (
          <div className="space-y-2.5">
            {filteredDoses.map(renderDoseCard)}
          </div>
        )}

        {/* Empty State */}
        {filteredDoses.length === 0 && (
          <div className="text-center py-12 bg-white dark:bg-[#1E1F20] rounded-[24px] border border-[#E0E3E7] dark:border-[#3C4043] p-8 shadow-xs">
            <div
              className="w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-3"
              style={{
                backgroundColor: 'var(--app-accent-subtle, #E8F0FE)',
                color: 'var(--app-accent, #1A73E8)',
              }}
            >
              <Sparkles className="w-6 h-6" />
            </div>
            <h3 className="text-[17px] font-medium text-[#1F1F1F] dark:text-[#E3E3E3]">
              {statusFilter === 'upcoming'
                ? 'All Caught Up'
                : statusFilter === 'taken'
                ? 'No Medicines Taken Yet'
                : isViewingPast
                ? 'No Dose Records'
                : isViewingFuture
                ? 'No Scheduled Doses'
                : 'No Doses for this Filter'}
            </h3>
            <p className="text-[13px] text-[#444746] dark:text-[#9AA0A6] mt-1.5 max-w-sm mx-auto mb-5 leading-relaxed">
              {statusFilter === 'upcoming'
                ? 'You have completed all scheduled medications for this selection.'
                : statusFilter === 'taken'
                ? 'Mark your upcoming doses as taken to see them logged here.'
                : 'Add a medication or create a routine to schedule your doses.'}
            </p>
            <button
              onClick={onOpenQuickRoutine}
              className="py-2.5 px-5 text-white font-medium text-[13px] rounded-full shadow-xs transition-colors cursor-pointer active:scale-95"
              style={{ backgroundColor: 'var(--app-accent, #1A73E8)' }}
            >
              Add Routine
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
