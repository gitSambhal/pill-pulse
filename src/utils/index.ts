/**
 * PillPulse - Utilities & Helper Functions
 * Developer: Suhail Akhtar (https://suhail.top)
 */

import confetti from 'canvas-confetti';
import { PillColor, PillShape, TimeSlot } from '../types';

export function getTodayDateString(): string {
  const d = new Date();
  const year = d.getFullYear();
  const month = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

export function formatTime12h(time24: string): string {
  if (!time24) return '';
  const [hoursStr, minutesStr] = time24.split(':');
  let hours = parseInt(hoursStr, 10);
  const minutes = minutesStr || '00';
  const ampm = hours >= 12 ? 'PM' : 'AM';
  hours = hours % 12;
  hours = hours ? hours : 12; // '0' should be '12'
  return `${hours}:${minutes} ${ampm}`;
}

export function addMinutesToTime(time24: string, minutesToAdd: number): string {
  if (!time24) return '08:00';
  const [hStr, mStr] = time24.split(':');
  let totalMinutes = parseInt(hStr, 10) * 60 + parseInt(mStr || '0', 10) + minutesToAdd;
  totalMinutes = ((totalMinutes % (24 * 60)) + (24 * 60)) % (24 * 60);
  const newH = Math.floor(totalMinutes / 60);
  const newM = totalMinutes % 60;
  return `${String(newH).padStart(2, '0')}:${String(newM).padStart(2, '0')}`;
}

export function addDays(dateStr: string, days: number): string {
  const [y, m, d] = dateStr.split('-').map(Number);
  const date = new Date(y, m - 1, d);
  date.setDate(date.getDate() + days);
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

export function isToday(dateStr: string): boolean {
  return dateStr === getTodayDateString();
}

export function isPastDate(dateStr: string): boolean {
  return dateStr < getTodayDateString();
}

export function isFutureDate(dateStr: string): boolean {
  return dateStr > getTodayDateString();
}

export function getRelativeDateLabel(dateStr: string): string {
  const today = getTodayDateString();
  const yesterday = addDays(today, -1);
  const tomorrow = addDays(today, 1);

  if (dateStr === today) return 'Today';
  if (dateStr === yesterday) return 'Yesterday';
  if (dateStr === tomorrow) return 'Tomorrow';

  const [y, m, d] = dateStr.split('-').map(Number);
  const date = new Date(y, m - 1, d);
  return date.toLocaleDateString(undefined, { weekday: 'short', month: 'short', day: 'numeric' });
}

export function getWeekDates(centerDateStr: string, totalDays = 7): {
  dateStr: string;
  dayName: string;
  dayNumber: number;
  isToday: boolean;
}[] {
  const half = Math.floor(totalDays / 2);
  const dates = [];
  const today = getTodayDateString();

  for (let i = -half; i <= half; i++) {
    const dStr = addDays(centerDateStr, i);
    const [y, m, d] = dStr.split('-').map(Number);
    const date = new Date(y, m - 1, d);
    dates.push({
      dateStr: dStr,
      dayName: date.toLocaleDateString(undefined, { weekday: 'short' }),
      dayNumber: date.getDate(),
      isToday: dStr === today,
    });
  }

  return dates;
}

export function formatDisplayDate(dateStr: string): string {
  const [y, m, d] = dateStr.split('-').map(Number);
  const date = new Date(y, m - 1, d);
  return date.toLocaleDateString(undefined, {
    weekday: 'short',
    month: 'short',
    day: 'numeric',
  });
}

export function getSlotLabel(slot: TimeSlot): string {
  switch (slot) {
    case 'morning':
      return 'Morning (Wakeup)';
    case 'afternoon':
      return 'Afternoon (Lunch)';
    case 'evening':
      return 'Evening (Dinner)';
    case 'night':
      return 'Night (Bedtime)';
    case 'custom':
      return 'Custom Time';
  }
}

export function getSlotDefaultTime(
  slot: TimeSlot,
  customTimes?: Partial<Record<TimeSlot, string>>
): string {
  if (customTimes && customTimes[slot]) {
    return customTimes[slot]!;
  }
  switch (slot) {
    case 'morning':
      return '08:00';
    case 'afternoon':
      return '13:00';
    case 'evening':
      return '19:00';
    case 'night':
      return '22:00';
    case 'custom':
      return '12:00';
  }
}

export function getPillColorClasses(color: PillColor): {
  bg: string;
  text: string;
  border: string;
  glow: string;
  badge: string;
} {
  switch (color) {
    case 'teal':
      return {
        bg: 'bg-[#30B0C7]/15 dark:bg-[#30B0C7]/20',
        text: 'text-[#008299] dark:text-[#30B0C7]',
        border: 'border-[#30B0C7]/30 dark:border-[#30B0C7]/40',
        glow: '',
        badge: 'bg-[#30B0C7]/12 text-[#008299] dark:text-[#30B0C7]',
      };
    case 'sky':
      return {
        bg: 'bg-[#007AFF]/15 dark:bg-[#007AFF]/20',
        text: 'text-[#007AFF] dark:text-[#0A84FF]',
        border: 'border-[#007AFF]/30 dark:border-[#007AFF]/40',
        glow: '',
        badge: 'bg-[#007AFF]/12 text-[#007AFF] dark:text-[#0A84FF]',
      };
    case 'indigo':
      return {
        bg: 'bg-[#5856D6]/15 dark:bg-[#5856D6]/20',
        text: 'text-[#5856D6] dark:text-[#5E5CE6]',
        border: 'border-[#5856D6]/30 dark:border-[#5856D6]/40',
        glow: '',
        badge: 'bg-[#5856D6]/12 text-[#5856D6] dark:text-[#5E5CE6]',
      };
    case 'purple':
      return {
        bg: 'bg-[#AF52DE]/15 dark:bg-[#AF52DE]/20',
        text: 'text-[#AF52DE] dark:text-[#BF5AF2]',
        border: 'border-[#AF52DE]/30 dark:border-[#AF52DE]/40',
        glow: '',
        badge: 'bg-[#AF52DE]/12 text-[#AF52DE] dark:text-[#BF5AF2]',
      };
    case 'amber':
      return {
        bg: 'bg-[#FF9500]/15 dark:bg-[#FF9500]/20',
        text: 'text-[#C97000] dark:text-[#FF9F0A]',
        border: 'border-[#FF9500]/30 dark:border-[#FF9500]/40',
        glow: '',
        badge: 'bg-[#FF9500]/12 text-[#C97000] dark:text-[#FF9F0A]',
      };
    case 'rose':
      return {
        bg: 'bg-[#FF2D55]/15 dark:bg-[#FF2D55]/20',
        text: 'text-[#D01A40] dark:text-[#FF375F]',
        border: 'border-[#FF2D55]/30 dark:border-[#FF2D55]/40',
        glow: '',
        badge: 'bg-[#FF2D55]/12 text-[#D01A40] dark:text-[#FF375F]',
      };
    case 'emerald':
      return {
        bg: 'bg-[#34C759]/15 dark:bg-[#34C759]/20',
        text: 'text-[#248A3D] dark:text-[#32D74B]',
        border: 'border-[#34C759]/30 dark:border-[#34C759]/40',
        glow: '',
        badge: 'bg-[#34C759]/12 text-[#248A3D] dark:text-[#32D74B]',
      };
    case 'coral':
    default:
      return {
        bg: 'bg-[#FF3B30]/15 dark:bg-[#FF3B30]/20',
        text: 'text-[#D70015] dark:text-[#FF453A]',
        border: 'border-[#FF3B30]/30 dark:border-[#FF3B30]/40',
        glow: '',
        badge: 'bg-[#FF3B30]/12 text-[#D70015] dark:text-[#FF453A]',
      };
  }
}

export function triggerDoseCelebration(): void {
  try {
    confetti({
      particleCount: 55,
      spread: 60,
      origin: { y: 0.75 },
      colors: ['#0d9488', '#0284c7', '#38bdf8', '#10b981', '#f59e0b'],
      disableForReducedMotion: true,
    });
  } catch {
    // ignore
  }
}
