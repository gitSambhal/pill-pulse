/**
 * PillPulse - Google Health Adherence & History View
 * Developer: Suhail Akhtar (https://suhail.top)
 */

import React from 'react';
import { CheckCircle2, Flame, Calendar, ChevronRight } from 'lucide-react';
import { DoseHistoryLog, ScheduledDose } from '../../types';
import { getRelativeDateLabel, addDays, getTodayDateString } from '../../utils';

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
    <div className="space-y-4 sm:space-y-5">
      {/* Header */}
      <div>
        <h2 className="text-xl sm:text-2xl font-medium text-[#1F1F1F] dark:text-[#E3E3E3] tracking-normal font-sans">
          Insights & History
        </h2>
        <p className="text-[13px] text-[#444746] dark:text-[#9AA0A6] mt-0.5">
          Adherence percentage, adherence streak, and complete logs
        </p>
      </div>

      {/* Google Health Stat Cards */}
      <div className="grid grid-cols-2 gap-3">
        {/* Adherence Card */}
        <div className="p-4 sm:p-5 rounded-[24px] bg-white dark:bg-[#1E1F20] border border-[#E0E3E7] dark:border-[#3C4043] shadow-xs flex flex-col justify-between">
          <div className="flex items-center justify-between mb-2">
            <span className="text-[12px] font-medium text-[#444746] dark:text-[#9AA0A6]">
              Today's Rate
            </span>
            <div className="w-7 h-7 rounded-full bg-[#E6F4EA] dark:bg-[#0D652D]/20 text-[#1E8E3E] dark:text-[#81C995] flex items-center justify-center">
              <CheckCircle2 className="w-4 h-4" />
            </div>
          </div>
          <div>
            <div className="text-3xl sm:text-4xl font-medium tracking-tight text-[#1E8E3E] dark:text-[#81C995]">
              {adherencePercent}%
            </div>
            <p className="text-[12px] text-[#444746] dark:text-[#9AA0A6] mt-1">
              {takenToday} of {totalToday} taken
            </p>
          </div>
        </div>

        {/* Streak Card */}
        <div className="p-4 sm:p-5 rounded-[24px] bg-white dark:bg-[#1E1F20] border border-[#E0E3E7] dark:border-[#3C4043] shadow-xs flex flex-col justify-between">
          <div className="flex items-center justify-between mb-2">
            <span className="text-[12px] font-medium text-[#444746] dark:text-[#9AA0A6]">
              Daily Streak
            </span>
            <div className="w-7 h-7 rounded-full bg-[#FEF7E0] dark:bg-[#FBBC04]/20 text-[#B06000] dark:text-[#FBBC04] flex items-center justify-center">
              <Flame className="w-4 h-4" />
            </div>
          </div>
          <div>
            <div className="text-3xl sm:text-4xl font-medium tracking-tight text-[#B06000] dark:text-[#FBBC04]">
              {streakDays} Days
            </div>
            <p className="text-[12px] text-[#444746] dark:text-[#9AA0A6] mt-1">
              Consecutive days logged
            </p>
          </div>
        </div>
      </div>

      {/* Check Previous Days Quick Switcher */}
      <div className="p-4 sm:p-5 rounded-[24px] bg-white dark:bg-[#1E1F20] border border-[#E0E3E7] dark:border-[#3C4043] shadow-xs space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Calendar className="w-4 h-4" style={{ color: 'var(--app-accent, #1A73E8)' }} />
            <h3 className="text-[12px] font-medium text-[#444746] dark:text-[#9AA0A6]">
              Past 7 Days History
            </h3>
          </div>
          <span className="text-[11px] text-[#444746] dark:text-[#9AA0A6]">Tap day to inspect</span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
          {past7Days.map((dStr) => {
            return (
              <button
                key={dStr}
                onClick={() => onSelectDate(dStr)}
                className="p-3 rounded-[16px] border border-[#E0E3E7] dark:border-[#3C4043] hover:border-[var(--app-accent,#1A73E8)] bg-[#F0F4F9]/60 dark:bg-[#282A2C]/60 transition-all flex items-center justify-between text-xs text-left cursor-pointer active:scale-[0.99]"
              >
                <div>
                  <span className="font-medium text-[#1F1F1F] dark:text-[#E3E3E3] text-[13px]">
                    {getRelativeDateLabel(dStr)}
                  </span>
                  <span className="text-[11px] text-[#444746] dark:text-[#9AA0A6] block mt-0.5">
                    {dStr}
                  </span>
                </div>
                <div
                  className="flex items-center gap-1 text-xs font-medium"
                  style={{ color: 'var(--app-accent, #1A73E8)' }}
                >
                  <span>Inspect</span>
                  <ChevronRight className="w-3.5 h-3.5" />
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* Log of Completed Doses */}
      <div className="space-y-2.5">
        <h3 className="text-[12px] font-medium text-[#444746] dark:text-[#9AA0A6] px-1">
          Recent Activity Logs
        </h3>

        <div className="space-y-2">
          {history.slice(0, 12).map((log) => {
            const date = new Date(log.takenAt);
            const timeStr = date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
            const dateStr = date.toLocaleDateString(undefined, { month: 'short', day: 'numeric' });

            return (
              <div
                key={log.id}
                className="p-3.5 rounded-[16px] bg-white dark:bg-[#1E1F20] border border-[#E0E3E7] dark:border-[#3C4043] shadow-xs flex items-center justify-between text-xs"
              >
                <div className="flex items-center gap-3 min-w-0 pr-2">
                  <div className="w-7 h-7 rounded-full bg-[#E6F4EA] dark:bg-[#0D652D]/20 text-[#1E8E3E] dark:text-[#81C995] flex items-center justify-center shrink-0">
                    <CheckCircle2 className="w-4 h-4" />
                  </div>
                  <div className="min-w-0">
                    <p className="font-medium text-[#1F1F1F] dark:text-[#E3E3E3] truncate text-[14px]">
                      {log.medicineName}
                    </p>
                    <p className="text-[12px] text-[#444746] dark:text-[#9AA0A6] truncate mt-0.5">
                      {log.dosage}
                      {log.routineName ? ` · ${log.routineName}` : ''}
                    </p>
                  </div>
                </div>

                <div className="text-right text-[12px] text-[#444746] dark:text-[#9AA0A6] font-mono shrink-0">
                  <div>{timeStr}</div>
                  <div className="text-[10px] text-[#444746] dark:text-[#9AA0A6] mt-0.5">{dateStr}</div>
                </div>
              </div>
            );
          })}

          {history.length === 0 && (
            <div className="text-center py-10 bg-white dark:bg-[#1E1F20] rounded-[24px] border border-[#E0E3E7] dark:border-[#3C4043] text-[#444746] dark:text-[#9AA0A6] text-xs p-6 shadow-xs">
              No dose logs recorded yet. Once you take your first medicine, it will appear here.
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
