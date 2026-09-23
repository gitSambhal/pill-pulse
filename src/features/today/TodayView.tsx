/**
 * PillPulse - Schedule & Dashboard View with Upcoming & Taken Today Breakdown
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
  CalendarCheck2,
  CheckCheck,
  AlertCircle,
  Calendar,
  Hourglass,
  Flame,
  Sunrise,
  Sun,
  Sunset,
  Moon,
} from 'lucide-react';
import { ScheduledDose, TimeSlot } from '../../types';
import {
  formatTime12h,
  getPillColorClasses,
  getSlotLabel,
  isToday,
  isPastDate,
  isFutureDate,
} from '../../utils';
import { NextUpBanner } from '../../components/NextUpBanner';
import { DateNavigator } from '../../components/DateNavigator';
import { SlotTimingBadge, getSlotIcon } from '../../components/SlotTimingBadge';

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

  // Helper to render a single dose card
  const renderDoseCard = (dose: ScheduledDose) => {
    const isTaken = dose.status === 'taken';
    const isPending = dose.status === 'pending';
    const isSnoozed = dose.status === 'snoozed';
    const isSkipped = dose.status === 'skipped';
    const colorStyle = getPillColorClasses(dose.color);
    const isTargetOfCountdown = activeStepCountdown?.targetDose.id === dose.id;
    const routineInfo = dose.routineId ? routineGroups.get(dose.routineId) : undefined;
    const canTakeEntireRoutine = dose.routineId && routineInfo && routineInfo.pendingCount > 1;

    return (
      <div
        key={dose.id}
        className={`p-4 rounded-3xl border transition-all ${
          isTargetOfCountdown
            ? 'border-teal-500 ring-2 ring-teal-500/30 bg-teal-50/40 dark:bg-teal-950/30 shadow-md'
            : isTaken
            ? 'bg-slate-50/70 dark:bg-slate-900/40 border-slate-200/50 dark:border-slate-800/50'
            : 'bg-white dark:bg-slate-900 border-slate-200/80 dark:border-slate-800/80 shadow-xs hover:border-slate-300 dark:hover:border-slate-700'
        }`}
      >
        <div className="flex items-start justify-between gap-3">
          {/* Left pill indicator & details */}
          <div className="flex items-start gap-3 min-w-0">
            <div
              className={`w-10 h-10 rounded-2xl flex items-center justify-center shrink-0 shadow-xs ${colorStyle.bg} ${colorStyle.text} border ${colorStyle.border}`}
            >
              <Pill className="w-5 h-5 -rotate-45" />
            </div>

            <div className="min-w-0">
              {/* Timing Slot & Routine step badge */}
              <div className="flex items-center gap-1.5 mb-1.5 flex-wrap">
                <SlotTimingBadge slot={dose.slot} size="xs" />

                {dose.routineName && (
                  <span className="text-[10px] font-semibold text-teal-600 dark:text-teal-400 bg-teal-50 dark:bg-teal-950/60 px-2 py-0.5 rounded-md">
                    Step {dose.stepIndex} of {dose.totalSteps}
                  </span>
                )}
                {dose.nextStepGapMinutes !== undefined && (
                  <span className="text-[10px] text-slate-400 dark:text-slate-500">
                    {dose.nextStepGapMinutes === 0
                      ? '· Together (0m)'
                      : `· +${dose.nextStepGapMinutes}m gap`}
                  </span>
                )}
                {isTargetOfCountdown && (
                  <span className="text-[10px] font-bold text-amber-600 dark:text-amber-400 bg-amber-50 dark:bg-amber-950/60 px-2 py-0.5 rounded-md animate-pulse">
                    {activeStepCountdown
                      ? `${Math.ceil(activeStepCountdown.totalSeconds / 60)}m Gap Active · Take Anytime`
                      : 'Gap Active · Take Anytime'}
                  </span>
                )}
              </div>

              <h3
                className={`text-base font-bold tracking-tight truncate ${
                  isTaken
                    ? 'line-through text-slate-400 dark:text-slate-500'
                    : 'text-slate-900 dark:text-white'
                }`}
              >
                {dose.medicineName}
              </h3>

              <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                {dose.dosage}
                {dose.instructions ? ` · ${dose.instructions}` : ''}
              </p>

              {/* Time & status text */}
              <div className="flex items-center gap-2 mt-2 text-xs font-mono font-medium text-slate-600 dark:text-slate-300 flex-wrap">
                {!isTaken ? (
                  <label
                    className="relative inline-flex items-center gap-1 cursor-pointer bg-slate-100 dark:bg-slate-800 hover:bg-teal-50 dark:hover:bg-teal-950/60 px-2 py-0.5 rounded-lg transition-colors border border-transparent hover:border-teal-200 dark:hover:border-teal-800"
                    title="Tap to change scheduled time"
                  >
                    <Clock className="w-3 h-3 text-teal-500 pointer-events-none" />
                    <span className="font-semibold text-slate-700 dark:text-slate-200">
                      {formatTime12h(dose.scheduledTime)}
                    </span>
                    <span className="text-[10px] text-teal-600 dark:text-teal-400 underline font-sans ml-0.5">
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
                  <div className="flex items-center gap-1">
                    <Clock className="w-3 h-3 text-teal-500" />
                    <span>{formatTime12h(dose.scheduledTime)}</span>
                  </div>
                )}
                {isSnoozed && (
                  <span className="text-[11px] text-amber-500 font-sans font-semibold">
                    (Snoozed)
                  </span>
                )}
                {isSkipped && (
                  <span className="text-[11px] text-rose-500 font-sans font-semibold">
                    (Skipped)
                  </span>
                )}
                {isTaken && dose.takenAt && (
                  <span className="text-[11px] text-emerald-600 dark:text-emerald-400 font-sans font-medium flex items-center gap-1">
                    <Check className="w-3 h-3" />
                    Taken {formatTime12h(new Date(dose.takenAt).toTimeString().slice(0, 5))}
                  </span>
                )}
              </div>
            </div>
          </div>

          {/* Right Action buttons */}
          <div className="flex flex-col items-end gap-1.5 shrink-0">
            {isTaken ? (
              <div className="flex flex-col items-end gap-1">
                <span className="inline-flex items-center gap-1 text-xs font-semibold text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/50 px-2.5 py-1 rounded-xl">
                  <Check className="w-3.5 h-3.5 stroke-[2.5]" /> Taken
                </span>
                {/* Undo button to mark back to pending if needed */}
                <button
                  onClick={() => onUndoDose(dose)}
                  className="text-[11px] text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 flex items-center gap-1 transition-colors px-1 py-0.5 rounded"
                  title="Revert status to pending"
                >
                  <RotateCcw className="w-2.5 h-2.5" /> Undo
                </button>
              </div>
            ) : (
              <div className="flex items-center gap-1">
                {/* Ring preview (only on today) */}
                {isViewingToday && (
                  <button
                    onClick={() => onTriggerAlarmNow(dose)}
                    className="p-2 text-slate-400 hover:text-teal-600 dark:hover:text-teal-400 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-xl transition-colors"
                    title="Ring alarm sound now"
                  >
                    <Volume2 className="w-4 h-4" />
                  </button>
                )}

                {/* Primary Take button: User can ALWAYS mark taken immediately, even during gaps! */}
                <button
                  onClick={() => onTakeDose(dose)}
                  className={`py-1.5 px-3 font-semibold text-xs rounded-xl shadow-xs transition-all flex items-center gap-1 active:scale-95 ${
                    isTargetOfCountdown
                      ? 'bg-amber-500 hover:bg-amber-600 text-white animate-pulse'
                      : 'bg-teal-600 hover:bg-teal-700 text-white'
                  }`}
                  title="Mark this medicine as taken"
                >
                  <CheckCircle2 className="w-3.5 h-3.5" />
                  {isTargetOfCountdown ? 'Take Early' : 'Take'}
                </button>
              </div>
            )}

            {!isTaken && isViewingToday && (
              <div className="flex items-center gap-2">
                <button
                  onClick={() => onSnoozeDose(dose, 5)}
                  className="text-[11px] text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
                >
                  Snooze
                </button>
                <button
                  onClick={() => onSkipDose(dose)}
                  className="text-[11px] text-slate-400 hover:text-rose-500 dark:hover:text-rose-400"
                >
                  Skip
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Take entire routine stack shortcut if multi-pill sequence */}
        {!isTaken && canTakeEntireRoutine && dose.stepIndex === 1 && (
          <div className="mt-3 pt-2.5 border-t border-slate-100 dark:border-slate-800/70 flex items-center justify-between text-xs">
            <span className="text-[11px] text-slate-500 dark:text-slate-400">
              Taking all {routineInfo.totalCount} pills together?
            </span>
            <button
              onClick={() => onTakeEntireRoutine(dose.routineId!)}
              className="text-[11px] font-semibold text-teal-600 dark:text-teal-400 hover:underline flex items-center gap-1"
            >
              <FastForward className="w-3 h-3" /> Mark Entire Stack Taken
            </button>
          </div>
        )}
      </div>
    );
  };

  return (
    <div className="space-y-3">
      {/* 1. Interactive Date Navigator: Safe native calendar picker + week strip */}
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

      {/* 3. Dashboard Metrics Cards: Upcoming Meds & Taken Today */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
        {/* Upcoming Meds Card */}
        <div
          onClick={() => setStatusFilter(statusFilter === 'upcoming' ? 'all' : 'upcoming')}
          className={`p-3.5 rounded-3xl border transition-all cursor-pointer select-none ${
            statusFilter === 'upcoming'
              ? 'bg-teal-50/80 dark:bg-teal-950/40 border-teal-500 ring-2 ring-teal-500/20 shadow-xs'
              : 'bg-white dark:bg-slate-900 border-slate-200/80 dark:border-slate-800/80 shadow-xs hover:border-teal-500/50'
          }`}
        >
          <div className="flex items-center justify-between mb-1.5">
            <div className="flex items-center gap-1.5">
              <div className="p-1.5 rounded-xl bg-amber-50 dark:bg-amber-950/60 text-amber-600 dark:text-amber-400">
                <Hourglass className="w-4 h-4" />
              </div>
              <span className="text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider">
                Upcoming Meds
              </span>
            </div>
            <span
              className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                pendingDoses.length > 0
                  ? 'bg-amber-100 dark:bg-amber-950/70 text-amber-800 dark:text-amber-300'
                  : 'bg-emerald-100 dark:bg-emerald-950/70 text-emerald-800 dark:text-emerald-300'
              }`}
            >
              {pendingDoses.length > 0 ? `${pendingDoses.length} Pending` : 'All Done 🎉'}
            </span>
          </div>

          <div className="mt-2">
            {nextDose ? (
              <div>
                <p className="text-sm font-bold text-slate-900 dark:text-white truncate">
                  {nextDose.medicineName} ({nextDose.dosage})
                </p>
                <p className="text-[11px] text-slate-500 dark:text-slate-400 flex items-center gap-1.5 mt-1 flex-wrap">
                  <Clock className="w-3 h-3 text-teal-500 shrink-0" />
                  <span>Scheduled for {formatTime12h(nextDose.scheduledTime)}</span>
                  <SlotTimingBadge slot={nextDose.slot} size="xs" />
                </p>
              </div>
            ) : (
              <p className="text-xs text-emerald-600 dark:text-emerald-400 font-medium">
                No upcoming medicines pending for this date!
              </p>
            )}
          </div>
        </div>

        {/* Taken Today Card */}
        <div
          onClick={() => setStatusFilter(statusFilter === 'taken' ? 'all' : 'taken')}
          className={`p-3.5 rounded-3xl border transition-all cursor-pointer select-none ${
            statusFilter === 'taken'
              ? 'bg-emerald-50/80 dark:bg-emerald-950/40 border-emerald-500 ring-2 ring-emerald-500/20 shadow-xs'
              : 'bg-white dark:bg-slate-900 border-slate-200/80 dark:border-slate-800/80 shadow-xs hover:border-emerald-500/50'
          }`}
        >
          <div className="flex items-center justify-between mb-1.5">
            <div className="flex items-center gap-1.5">
              <div className="p-1.5 rounded-xl bg-emerald-50 dark:bg-emerald-950/60 text-emerald-600 dark:text-emerald-400">
                <CheckCheck className="w-4 h-4" />
              </div>
              <span className="text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider">
                Taken Today
              </span>
            </div>
            <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-100 dark:bg-emerald-950/70 text-emerald-800 dark:text-emerald-300">
              {takenDoses.length} of {doses.length} ({adherenceRate}%)
            </span>
          </div>

          <div className="mt-2">
            {/* Progress Bar */}
            <div className="w-full bg-slate-100 dark:bg-slate-800 rounded-full h-2 mb-1.5 overflow-hidden">
              <div
                className="bg-linear-to-r from-teal-500 to-emerald-500 h-full rounded-full transition-all duration-300"
                style={{ width: `${adherenceRate}%` }}
              />
            </div>

            <p className="text-[11px] text-slate-500 dark:text-slate-400 truncate">
              {lastTakenDose
                ? `Last taken: ${lastTakenDose.medicineName} (${formatTime12h(
                    lastTakenDose.takenAt
                      ? new Date(lastTakenDose.takenAt).toTimeString().slice(0, 5)
                      : lastTakenDose.scheduledTime
                  )})`
                : 'No medicines marked taken yet today'}
            </p>
          </div>
        </div>
      </div>

      {/* 4. Dashboard Status Filter Tabs */}
      <div className="flex items-center justify-between gap-2 pt-1">
        <div className="flex items-center gap-1.5 p-1 bg-slate-100 dark:bg-slate-800/70 rounded-2xl">
          <button
            onClick={() => setStatusFilter('all')}
            className={`px-3 py-1 rounded-xl text-xs font-semibold transition-all ${
              statusFilter === 'all'
                ? 'bg-white dark:bg-slate-900 text-slate-900 dark:text-white shadow-xs'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
            }`}
          >
            All ({doses.length})
          </button>
          <button
            onClick={() => setStatusFilter('upcoming')}
            className={`px-3 py-1 rounded-xl text-xs font-semibold transition-all flex items-center gap-1 ${
              statusFilter === 'upcoming'
                ? 'bg-white dark:bg-slate-900 text-amber-600 dark:text-amber-400 shadow-xs'
                : 'text-slate-600 dark:text-slate-400 hover:text-amber-600'
            }`}
          >
            Upcoming ({pendingDoses.length})
          </button>
          <button
            onClick={() => setStatusFilter('taken')}
            className={`px-3 py-1 rounded-xl text-xs font-semibold transition-all flex items-center gap-1 ${
              statusFilter === 'taken'
                ? 'bg-white dark:bg-slate-900 text-emerald-600 dark:text-emerald-400 shadow-xs'
                : 'text-slate-600 dark:text-slate-400 hover:text-emerald-600'
            }`}
          >
            Taken ({takenDoses.length})
          </button>
        </div>

        <button
          onClick={onOpenQuickRoutine}
          className="inline-flex items-center gap-1 text-xs font-semibold text-teal-600 dark:text-teal-400 hover:underline shrink-0"
        >
          <Layers className="w-3.5 h-3.5" />
          + Stack
        </button>
      </div>

      {/* 5. Slot Filter Buttons */}
      <div className="flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-none">
        {slots.map((s) => (
          <button
            key={s.id}
            onClick={() => setSelectedSlot(s.id)}
            className={`px-3 py-1.5 rounded-xl text-xs font-medium transition-colors whitespace-nowrap inline-flex items-center gap-1.5 ${
              selectedSlot === s.id
                ? 'bg-teal-600 text-white shadow-xs font-semibold'
                : 'bg-white dark:bg-slate-900 text-slate-600 dark:text-slate-400 border border-slate-200/70 dark:border-slate-800/70 hover:bg-slate-50 dark:hover:bg-slate-800'
            }`}
          >
            {s.icon}
            <span>{s.label}</span>
          </button>
        ))}
      </div>

      {/* 6. Main Doses List: Grouped by Upcoming & Taken */}
      <div className="space-y-4">
        {/* If user selected "all", render explicit grouped sections */}
        {statusFilter === 'all' && (
          <>
            {/* Upcoming Section */}
            {pendingDoses.length > 0 && (
              <div className="space-y-2.5">
                <div className="flex items-center justify-between px-1">
                  <span className="text-xs font-bold uppercase tracking-wider text-amber-600 dark:text-amber-400 flex items-center gap-1.5">
                    <Hourglass className="w-3.5 h-3.5" />
                    Upcoming & Due ({pendingDoses.length})
                  </span>
                  <span className="text-[11px] text-slate-400 font-medium">Take anytime</span>
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
                  <span className="text-xs font-bold uppercase tracking-wider text-emerald-600 dark:text-emerald-400 flex items-center gap-1.5">
                    <CheckCircle2 className="w-3.5 h-3.5" />
                    Taken Today ({takenDoses.length})
                  </span>
                  <span className="text-[11px] text-slate-400 font-medium">Logged</span>
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
                  <span className="text-xs font-bold uppercase tracking-wider text-rose-500 flex items-center gap-1.5">
                    <AlertCircle className="w-3.5 h-3.5" />
                    Skipped Doses ({skippedDoses.length})
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
          <div className="text-center py-10 bg-white dark:bg-slate-900 rounded-3xl border border-slate-200/80 dark:border-slate-800/80 p-6">
            <Sparkles className="w-8 h-8 text-teal-500 mx-auto mb-2 opacity-70" />
            <h3 className="text-sm font-semibold text-slate-900 dark:text-white">
              {statusFilter === 'upcoming'
                ? 'All Caught Up! No Upcoming Medicines.'
                : statusFilter === 'taken'
                ? 'No Medicines Taken Yet.'
                : isViewingPast
                ? 'No Dose Records for this Past Date'
                : isViewingFuture
                ? 'No Scheduled Doses for this Future Date'
                : 'No Doses Scheduled for this Filter'}
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 max-w-xs mx-auto mb-4">
              {statusFilter === 'upcoming'
                ? 'You have completed all scheduled doses for this selection. Great job!'
                : statusFilter === 'taken'
                ? 'Mark your upcoming doses as taken to see them logged here.'
                : 'Add a single medicine or create a cascading routine stack to schedule your doses.'}
            </p>
            <button
              onClick={onOpenQuickRoutine}
              className="py-2.5 px-4 bg-teal-600 hover:bg-teal-700 text-white font-semibold text-xs rounded-xl transition-colors"
            >
              Add Cascading Routine
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
