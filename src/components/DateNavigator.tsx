/**
 * PillPulse - Date Navigator & Calendar Strip
 * Developer: Suhail Akhtar (https://suhail.top)
 */

import React, { useRef } from 'react';
import {
  ChevronLeft,
  ChevronRight,
  Calendar as CalendarIcon,
  RotateCcw,
  Clock,
  History,
  Sparkles,
} from 'lucide-react';
import {
  addDays,
  formatDisplayDate,
  getRelativeDateLabel,
  getTodayDateString,
  getWeekDates,
  isFutureDate,
  isPastDate,
  isToday,
} from '../utils';

interface DateNavigatorProps {
  selectedDate: string;
  onSelectDate: (dateStr: string) => void;
  dosesCount?: number;
  takenCount?: number;
}

export const DateNavigator: React.FC<DateNavigatorProps> = ({
  selectedDate,
  onSelectDate,
  dosesCount = 0,
  takenCount = 0,
}) => {
  const dateInputRef = useRef<HTMLInputElement>(null);
  const weekDays = getWeekDates(selectedDate, 7);
  const today = getTodayDateString();
  const isCurrentDayToday = isToday(selectedDate);
  const isCurrentDayPast = isPastDate(selectedDate);
  const isCurrentDayFuture = isFutureDate(selectedDate);

  const handlePrevDay = () => {
    onSelectDate(addDays(selectedDate, -1));
  };

  const handleNextDay = () => {
    onSelectDate(addDays(selectedDate, 1));
  };

  const handleTodayClick = () => {
    onSelectDate(today);
  };

  return (
    <div className="space-y-3 mb-2">
      {/* Top Controls Bar */}
      <div className="flex items-center justify-between bg-white dark:bg-slate-900 p-3 sm:p-3.5 rounded-3xl border border-slate-200/80 dark:border-slate-800/80 shadow-xs">
        {/* Previous Day */}
        <button
          onClick={handlePrevDay}
          className="p-2 rounded-xl text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
          title="Previous day"
          aria-label="Previous day"
        >
          <ChevronLeft className="w-5 h-5" />
        </button>

        {/* Center Date Display & Title */}
        <div className="text-center flex-1 px-2 flex items-center justify-center gap-2">
          <div>
            <div className="flex items-center justify-center gap-1.5">
              <span className="text-sm font-bold text-slate-900 dark:text-white tracking-tight">
                {getRelativeDateLabel(selectedDate)}
              </span>
              {!isCurrentDayToday && (
                <span
                  className={`text-[10px] font-semibold px-2 py-0.5 rounded-md ${
                    isCurrentDayPast
                      ? 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400'
                      : 'bg-teal-50 dark:bg-teal-950/60 text-teal-600 dark:text-teal-400'
                  }`}
                >
                  {isCurrentDayPast ? 'Past' : 'Future'}
                </span>
              )}
            </div>
            <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5">
              {formatDisplayDate(selectedDate)}
            </p>
          </div>
        </div>

        {/* Right Actions: Jump to Today + Date Picker */}
        <div className="flex items-center gap-1 sm:gap-1.5">
          {!isCurrentDayToday && (
            <button
              onClick={handleTodayClick}
              className="px-2.5 py-1 text-[11px] font-semibold text-teal-600 dark:text-teal-400 bg-teal-50 dark:bg-teal-950/60 hover:bg-teal-100 dark:hover:bg-teal-900/60 rounded-lg transition-colors flex items-center gap-1"
              title="Jump to today"
            >
              <RotateCcw className="w-3 h-3" />
              Today
            </button>
          )}

          {/* Calendar Picker Trigger (Safe Native HTML5 Date Picker - No showPicker exception) */}
          <label
            className="relative p-2 rounded-xl text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors cursor-pointer flex items-center justify-center"
            title="Pick any date (past or future)"
            aria-label="Select date"
          >
            <CalendarIcon className="w-4 h-4 text-teal-600 dark:text-teal-400 pointer-events-none" />
            <input
              ref={dateInputRef}
              type="date"
              value={selectedDate}
              onChange={(e) => {
                if (e.target.value) {
                  onSelectDate(e.target.value);
                }
              }}
              className="absolute inset-0 opacity-0 cursor-pointer w-full h-full z-10"
              tabIndex={0}
            />
          </label>

          {/* Next Day */}
          <button
            onClick={handleNextDay}
            className="p-2 rounded-xl text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
            title="Next day"
            aria-label="Next day"
          >
            <ChevronRight className="w-5 h-5" />
          </button>
        </div>
      </div>

      {/* Horizontal 7-Day Day Selector Strip */}
      <div className="grid grid-cols-7 gap-1.5 bg-white dark:bg-slate-900 p-2 rounded-2xl border border-slate-200/80 dark:border-slate-800/80 shadow-xs">
        {weekDays.map((item) => {
          const isSelected = item.dateStr === selectedDate;
          return (
            <button
              key={item.dateStr}
              onClick={() => onSelectDate(item.dateStr)}
              className={`py-2 px-1 rounded-xl flex flex-col items-center justify-center transition-all ${
                isSelected
                  ? 'bg-teal-600 text-white shadow-xs font-bold scale-[1.02]'
                  : item.isToday
                  ? 'bg-teal-50 dark:bg-teal-950/40 text-teal-700 dark:text-teal-300 font-semibold'
                  : 'text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800'
              }`}
            >
              <span className="text-[10px] uppercase font-medium">{item.dayName}</span>
              <span className="text-xs mt-0.5">{item.dayNumber}</span>
              {item.isToday && !isSelected && (
                <span className="w-1 h-1 rounded-full bg-teal-500 mt-0.5" />
              )}
            </button>
          );
        })}
      </div>

      {/* Contextual Notice Banner when looking at Past or Future */}
      {!isCurrentDayToday && (
        <div
          className={`px-4 py-2.5 rounded-2xl text-xs flex items-center justify-between gap-2.5 border shadow-xs ${
            isCurrentDayPast
              ? 'bg-slate-100/90 dark:bg-slate-900/90 text-slate-700 dark:text-slate-300 border-slate-200 dark:border-slate-800'
              : 'bg-teal-50/80 dark:bg-teal-950/40 text-teal-800 dark:text-teal-200 border-teal-200/60 dark:border-teal-900/60'
          }`}
        >
          <div className="flex items-center gap-2 min-w-0">
            {isCurrentDayPast ? (
              <History className="w-4 h-4 text-slate-500 shrink-0" />
            ) : (
              <Sparkles className="w-4 h-4 text-teal-500 shrink-0" />
            )}
            <span className="text-[11px] leading-snug">
              {isCurrentDayPast
                ? `Past Date · ${takenCount} of ${dosesCount} doses taken. You can update records.`
                : `Future Date · Projected schedule for ${formatDisplayDate(selectedDate)}.`}
            </span>
          </div>
          <button
            onClick={handleTodayClick}
            className="text-[11px] font-semibold text-teal-600 dark:text-teal-400 hover:underline shrink-0"
          >
            Back to Today
          </button>
        </div>
      )}
    </div>
  );
};
