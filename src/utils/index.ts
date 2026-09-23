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
        bg: 'bg-teal-500/10 dark:bg-teal-500/20',
        text: 'text-teal-600 dark:text-teal-400',
        border: 'border-teal-200 dark:border-teal-800',
        glow: 'shadow-teal-500/20',
        badge: 'bg-teal-50 dark:bg-teal-950/60 text-teal-700 dark:text-teal-300',
      };
    case 'sky':
      return {
        bg: 'bg-sky-500/10 dark:bg-sky-500/20',
        text: 'text-sky-600 dark:text-sky-400',
        border: 'border-sky-200 dark:border-sky-800',
        glow: 'shadow-sky-500/20',
        badge: 'bg-sky-50 dark:bg-sky-950/60 text-sky-700 dark:text-sky-300',
      };
    case 'indigo':
      return {
        bg: 'bg-indigo-500/10 dark:bg-indigo-500/20',
        text: 'text-indigo-600 dark:text-indigo-400',
        border: 'border-indigo-200 dark:border-indigo-800',
        glow: 'shadow-indigo-500/20',
        badge: 'bg-indigo-50 dark:bg-indigo-950/60 text-indigo-700 dark:text-indigo-300',
      };
    case 'purple':
      return {
        bg: 'bg-purple-500/10 dark:bg-purple-500/20',
        text: 'text-purple-600 dark:text-purple-400',
        border: 'border-purple-200 dark:border-purple-800',
        glow: 'shadow-purple-500/20',
        badge: 'bg-purple-50 dark:bg-purple-950/60 text-purple-700 dark:text-purple-300',
      };
    case 'amber':
      return {
        bg: 'bg-amber-500/10 dark:bg-amber-500/20',
        text: 'text-amber-600 dark:text-amber-400',
        border: 'border-amber-200 dark:border-amber-800',
        glow: 'shadow-amber-500/20',
        badge: 'bg-amber-50 dark:bg-amber-950/60 text-amber-700 dark:text-amber-300',
      };
    case 'rose':
      return {
        bg: 'bg-rose-500/10 dark:bg-rose-500/20',
        text: 'text-rose-600 dark:text-rose-400',
        border: 'border-rose-200 dark:border-rose-800',
        glow: 'shadow-rose-500/20',
        badge: 'bg-rose-50 dark:bg-rose-950/60 text-rose-700 dark:text-rose-300',
      };
    case 'emerald':
      return {
        bg: 'bg-emerald-500/10 dark:bg-emerald-500/20',
        text: 'text-emerald-600 dark:text-emerald-400',
        border: 'border-emerald-200 dark:border-emerald-800',
        glow: 'shadow-emerald-500/20',
        badge: 'bg-emerald-50 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-300',
      };
    case 'coral':
    default:
      return {
        bg: 'bg-orange-500/10 dark:bg-orange-500/20',
        text: 'text-orange-600 dark:text-orange-400',
        border: 'border-orange-200 dark:border-orange-800',
        glow: 'shadow-orange-500/20',
        badge: 'bg-orange-50 dark:bg-orange-950/60 text-orange-700 dark:text-orange-300',
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
