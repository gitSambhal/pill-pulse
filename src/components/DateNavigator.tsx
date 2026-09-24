/**
 * PillPulse - Google Calendar Material 3 Date Navigator
 * Developer: Suhail Akhtar (https://suhail.top)
 */

import React, { useRef } from 'react';
import {
  ChevronLeft,
  ChevronRight,
  Calendar as CalendarIcon,
  History,
  Info,
} from 'lucide-react';
import {
  addDays,
  formatDisplayDate,
  getRelativeDateLabel,
  getTodayDateString,
  getWeekDates,
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
    <div className="space-y-2 mb-3">
      {/* Google Calendar Top Bar */}
      <div className="flex items-center justify-between bg-white dark:bg-[#1E1F20] px-3 py-2.5 rounded-[20px] border border-[#E0E3E7] dark:border-[#3C4043] shadow-xs">
        {/* Left: Jump to Today + Day Step chevrons */}
        <div className="flex items-center gap-2">
          <button
            onClick={handleTodayClick}
            className={`px-3.5 py-1 text-xs font-medium rounded-full border transition-colors cursor-pointer ${
              isCurrentDayToday
                ? 'border-[#E0E3E7] dark:border-[#3C4043] text-[#444746] dark:text-[#9AA0A6] bg-[#F0F4F9]/60 dark:bg-[#282A2C]/60'
                : 'border-[#747775] dark:border-[#8E918F] text-[#1F1F1F] dark:text-[#E3E3E3] hover:bg-[#F0F4F9] dark:hover:bg-[#282A2C]'
            }`}
            title="Jump to Today"
          >
            Today
          </button>

          <div className="flex items-center gap-0.5">
            <button
              onClick={handlePrevDay}
              className="w-8 h-8 rounded-full hover:bg-[#F0F4F9] dark:hover:bg-[#282A2C] transition-colors flex items-center justify-center cursor-pointer text-[#444746] dark:text-[#C4C7C5]"
              title="Previous Day"
              aria-label="Previous Day"
            >
              <ChevronLeft className="w-4.5 h-4.5" />
            </button>
            <button
              onClick={handleNextDay}
              className="w-8 h-8 rounded-full hover:bg-[#F0F4F9] dark:hover:bg-[#282A2C] transition-colors flex items-center justify-center cursor-pointer text-[#444746] dark:text-[#C4C7C5]"
              title="Next Day"
              aria-label="Next Day"
            >
              <ChevronRight className="w-4.5 h-4.5" />
            </button>
          </div>
        </div>

        {/* Right: Date Title & Calendar Picker */}
        <div className="flex items-center gap-2">
          <div className="text-right">
            <span className="text-[13px] font-medium text-[#1F1F1F] dark:text-[#E3E3E3] block leading-tight">
              {getRelativeDateLabel(selectedDate)}
            </span>
            <span className="text-[11px] text-[#444746] dark:text-[#9AA0A6] leading-none">
              {formatDisplayDate(selectedDate)}
            </span>
          </div>

          <label
            className="w-8.5 h-8.5 rounded-full hover:bg-[#F0F4F9] dark:hover:bg-[#282A2C] transition-colors cursor-pointer flex items-center justify-center relative text-[#444746] dark:text-[#C4C7C5]"
            title="Open Calendar Picker"
            aria-label="Select date"
          >
            <CalendarIcon className="w-4 h-4 pointer-events-none" />
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
        </div>
      </div>

      {/* Google Calendar 7-Day Day Selector Strip */}
      <div className="grid grid-cols-7 gap-1 bg-white dark:bg-[#1E1F20] p-1.5 rounded-[20px] border border-[#E0E3E7] dark:border-[#3C4043] shadow-xs">
        {weekDays.map((item) => {
          const isSelected = item.dateStr === selectedDate;
          return (
            <button
              key={item.dateStr}
              onClick={() => onSelectDate(item.dateStr)}
              className="py-1.5 px-0.5 rounded-2xl flex flex-col items-center justify-center transition-all group active:scale-95 cursor-pointer"
            >
              <span
                className={`text-[11px] font-medium tracking-normal ${
                  isSelected
                    ? 'text-[var(--app-accent,#1A73E8)] font-semibold'
                    : 'text-[#444746] dark:text-[#9AA0A6]'
                }`}
              >
                {item.dayName.slice(0, 1)}
              </span>
              <div
                className={`w-8.5 h-8.5 rounded-full flex items-center justify-center mt-1 text-[13px] font-medium transition-all ${
                  !isSelected && !item.isToday
                    ? 'text-[#1F1F1F] dark:text-[#E3E3E3] group-hover:bg-[#F0F4F9] dark:group-hover:bg-[#282A2C]'
                    : ''
                }`}
                style={
                  isSelected
                    ? {
                        backgroundColor: 'var(--app-accent, #1A73E8)',
                        color: '#FFFFFF',
                        boxShadow: '0 1px 3px rgba(0,0,0,0.18)',
                      }
                    : item.isToday
                    ? {
                        backgroundColor: 'var(--app-accent-subtle, #E8F0FE)',
                        color: 'var(--app-accent, #1A73E8)',
                        fontWeight: 600,
                      }
                    : undefined
                }
              >
                {item.dayNumber}
              </div>
            </button>
          );
        })}
      </div>

      {/* Google Informational Notice Banner */}
      {!isCurrentDayToday && (
        <div className="px-3.5 py-2 rounded-[16px] text-xs flex items-center justify-between gap-2.5 bg-[#F0F4F9] dark:bg-[#282A2C] border border-[#E0E3E7] dark:border-[#3C4043]">
          <div className="flex items-center gap-2 min-w-0">
            {isCurrentDayPast ? (
              <History className="w-4 h-4 text-[#444746] dark:text-[#9AA0A6] shrink-0" />
            ) : (
              <Info className="w-4 h-4 shrink-0" style={{ color: 'var(--app-accent, #1A73E8)' }} />
            )}
            <span className="text-[12px] text-[#444746] dark:text-[#C4C7C5] leading-snug">
              {isCurrentDayPast
                ? `Historical record · ${takenCount} of ${dosesCount} doses recorded.`
                : `Upcoming schedule · Previewing plan for ${formatDisplayDate(selectedDate)}.`}
            </span>
          </div>
          <button
            onClick={handleTodayClick}
            className="text-[12px] font-medium hover:underline shrink-0 cursor-pointer"
            style={{ color: 'var(--app-accent, #1A73E8)' }}
          >
            Jump to Today
          </button>
        </div>
      )}
    </div>
  );
};
