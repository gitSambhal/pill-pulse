/**
 * PillPulse - Slot Timing Badge & Icons for Morning, Afternoon, Evening, Night
 * Developer: Suhail Akhtar (https://suhail.top)
 */

import React from 'react';
import { Sunrise, Sun, Sunset, Moon, Clock } from 'lucide-react';
import { TimeSlot } from '../types';
import { getSlotLabel } from '../utils';

export function getSlotIcon(slot: TimeSlot, className: string = 'w-3.5 h-3.5') {
  switch (slot) {
    case 'morning':
      return <Sunrise className={className} />;
    case 'afternoon':
      return <Sun className={className} />;
    case 'evening':
      return <Sunset className={className} />;
    case 'night':
      return <Moon className={className} />;
    case 'custom':
    default:
      return <Clock className={className} />;
  }
}

export function getSlotTheme(slot: TimeSlot) {
  switch (slot) {
    case 'morning':
      return {
        label: 'Morning',
        bg: 'bg-amber-50 dark:bg-amber-950/40',
        text: 'text-amber-700 dark:text-amber-300',
        border: 'border-amber-200/80 dark:border-amber-800/60',
        iconColor: 'text-amber-500 dark:text-amber-400',
        badgeBg: 'bg-amber-100/70 dark:bg-amber-900/30',
      };
    case 'afternoon':
      return {
        label: 'Afternoon',
        bg: 'bg-orange-50 dark:bg-orange-950/40',
        text: 'text-orange-700 dark:text-orange-300',
        border: 'border-orange-200/80 dark:border-orange-800/60',
        iconColor: 'text-orange-500 dark:text-orange-400',
        badgeBg: 'bg-orange-100/70 dark:bg-orange-900/30',
      };
    case 'evening':
      return {
        label: 'Evening',
        bg: 'bg-rose-50 dark:bg-rose-950/40',
        text: 'text-rose-700 dark:text-rose-300',
        border: 'border-rose-200/80 dark:border-rose-800/60',
        iconColor: 'text-rose-500 dark:text-rose-400',
        badgeBg: 'bg-rose-100/70 dark:bg-rose-900/30',
      };
    case 'night':
      return {
        label: 'Night',
        bg: 'bg-indigo-50 dark:bg-indigo-950/40',
        text: 'text-indigo-700 dark:text-indigo-300',
        border: 'border-indigo-200/80 dark:border-indigo-800/60',
        iconColor: 'text-indigo-400 dark:text-indigo-300',
        badgeBg: 'bg-indigo-100/70 dark:bg-indigo-900/30',
      };
    case 'custom':
    default:
      return {
        label: 'Custom',
        bg: 'bg-teal-50 dark:bg-teal-950/40',
        text: 'text-teal-700 dark:text-teal-300',
        border: 'border-teal-200/80 dark:border-teal-800/60',
        iconColor: 'text-teal-600 dark:text-teal-400',
        badgeBg: 'bg-teal-100/70 dark:bg-teal-900/30',
      };
  }
}

interface SlotTimingBadgeProps {
  slot: TimeSlot;
  showLabel?: boolean;
  size?: 'xs' | 'sm' | 'md';
  className?: string;
}

export const SlotTimingBadge: React.FC<SlotTimingBadgeProps> = ({
  slot,
  showLabel = true,
  size = 'sm',
  className = '',
}) => {
  const theme = getSlotTheme(slot);

  const sizeClasses = {
    xs: 'px-1.5 py-0.5 text-[10px] gap-1',
    sm: 'px-2 py-0.5 text-xs gap-1.5',
    md: 'px-2.5 py-1 text-xs gap-1.5',
  }[size];

  const iconSizes = {
    xs: 'w-3 h-3',
    sm: 'w-3.5 h-3.5',
    md: 'w-4 h-4',
  }[size];

  return (
    <span
      className={`inline-flex items-center font-medium rounded-lg border ${theme.bg} ${theme.text} ${theme.border} ${sizeClasses} ${className}`}
    >
      <span className={theme.iconColor}>{getSlotIcon(slot, iconSizes)}</span>
      {showLabel && <span className="capitalize">{getSlotLabel(slot)}</span>}
    </span>
  );
};
