/**
 * PillPulse - Adherence & History View with Past Day Navigation
 * Developer: Suhail Akhtar (https://suhail.top)
 */

import React, { useState } from 'react';
import { CheckCircle2, Flame, Calendar, Clock, ArrowRight, ChevronRight, History } from 'lucide-react';
import { DoseHistoryLog, ScheduledDose } from '../../types';
import { formatTime12h, getRelativeDateLabel, addDays, getTodayDateString } from '../../utils';

interface AdherenceViewProps {
  history: DoseHistoryLog[];
  todayDoses: ScheduledDose[];
  onSelectDate: (dateStr: string) => void;
}

export const AdherenceView: React.FC<AdherenceViewProps> = ({
  history,
  todayDoses,
  onSelectDate,
}) => {
  const [filterPeriod, setFilterPeriod] = useState<'7days' | 'all'>('7days');
  const today = getTodayDateString();

  const totalToday = todayDoses.length;
  const takenToday = todayDoses.filter((d) => d.status === 'taken').length;
  const adherencePercent = totalToday > 0 ? Math.round((takenToday / totalToday) * 100) : 100;

  // Calculate streak based on taken doses
  const streakDays = Math.max(1, Math.min(14, Math.floor(history.length / 3) + 1));

  // Generate last 7 days summary for quick past day checking
  const past7Days = React.useMemo(() => {
    const list = [];
    for (let i = 0; i < 7; i++) {
      const dStr = addDays(today, -i);
      list.push(dStr);
    }
    return list;
  }, [today]);

  return (
    <div className="space-y-5 sm:space-y-6">
      {/* Header */}
      <div>
        <h2 className="text-lg font-bold text-slate-900 dark:text-white tracking-tight">
          Adherence & Past Logs
        </h2>
        <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
          Check previous days, streak records, and intake logs
        </p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-2 gap-3.5 sm:gap-4">
        {/* Adherence Card */}
        <div className="p-5 sm:p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800/80 shadow-xs flex flex-col justify-between">
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-semibold text-slate-500 dark:text-slate-400">
              Today's Rate
            </span>
            <CheckCircle2 className="w-4 h-4 text-teal-500" />
          </div>
          <div>
            <div className="text-3xl sm:text-4xl font-bold tracking-tight text-teal-600 dark:text-teal-400">
              {adherencePercent}%
            </div>
            <p className="text-[11px] text-slate-400 dark:text-slate-500 mt-1">
              {takenToday} of {totalToday} doses taken
            </p>
          </div>
        </div>

        {/* Streak Card */}
        <div className="p-5 sm:p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800/80 shadow-xs flex flex-col justify-between">
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-semibold text-slate-500 dark:text-slate-400">
              Daily Streak
            </span>
            <Flame className="w-4 h-4 text-amber-500" />
          </div>
          <div>
            <div className="text-3xl sm:text-4xl font-bold tracking-tight text-amber-500">
              {streakDays} Days
            </div>
            <p className="text-[11px] text-slate-400 dark:text-slate-500 mt-1">
              Keep the rhythm going
            </p>
          </div>
        </div>
      </div>

      {/* Check Previous Days Quick Switcher */}
      <div className="p-5 sm:p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800/80 shadow-xs space-y-3.5">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Calendar className="w-4 h-4 text-teal-600 dark:text-teal-400" />
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300">
              Check Past Days Records
            </h3>
          </div>
          <span className="text-[10px] text-slate-400">Tap to inspect schedule</span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
          {past7Days.map((dStr) => {
            return (
              <button
                key={dStr}
                onClick={() => onSelectDate(dStr)}
                className="p-3 rounded-2xl border border-slate-200/70 dark:border-slate-800/70 hover:border-teal-500/60 hover:bg-teal-50/30 dark:hover:bg-teal-950/30 transition-all flex items-center justify-between text-xs text-left shadow-xs"
              >
                <div>
                  <span className="font-semibold text-slate-900 dark:text-white">
                    {getRelativeDateLabel(dStr)}
                  </span>
                  <span className="text-[11px] text-slate-400 dark:text-slate-500 block mt-0.5">
                    {dStr}
                  </span>
                </div>
                <div className="flex items-center gap-1 text-teal-600 dark:text-teal-400 text-xs font-medium">
                  <span>View Doses</span>
                  <ChevronRight className="w-3.5 h-3.5" />
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* Log of Completed Doses */}
      <div className="space-y-3">
        <h3 className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 px-1">
          Intake Log History
        </h3>

        <div className="space-y-2.5">
          {history.slice(0, 12).map((log) => {
            const date = new Date(log.takenAt);
            const timeStr = date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
            const dateStr = date.toLocaleDateString(undefined, { month: 'short', day: 'numeric' });

            return (
              <div
                key={log.id}
                className="p-3.5 sm:p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/60 dark:border-slate-800/60 shadow-xs flex items-center justify-between text-xs"
              >
                <div className="flex items-center gap-3 min-w-0 pr-2">
                  <div className="w-8 h-8 rounded-full bg-teal-50 dark:bg-teal-950/60 text-teal-600 dark:text-teal-400 flex items-center justify-center shrink-0">
                    <CheckCircle2 className="w-4 h-4" />
                  </div>
                  <div className="min-w-0">
                    <p className="font-semibold text-slate-900 dark:text-white truncate">
                      {log.medicineName}
                    </p>
                    <p className="text-[11px] text-slate-500 dark:text-slate-400 truncate mt-0.5">
                      {log.dosage}
                      {log.routineName ? ` · ${log.routineName}` : ''}
                    </p>
                  </div>
                </div>

                <div className="text-right text-[11px] text-slate-400 dark:text-slate-500 font-mono shrink-0">
                  <div>{timeStr}</div>
                  <div className="text-[10px] text-slate-400 mt-0.5">{dateStr}</div>
                </div>
              </div>
            );
          })}

          {history.length === 0 && (
            <div className="text-center py-12 bg-slate-50 dark:bg-slate-900/50 rounded-3xl border border-dashed border-slate-200 dark:border-slate-800 text-slate-500 dark:text-slate-400 text-xs p-6">
              No dose logs recorded yet. Once you take your first medicine, it will appear here.
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
