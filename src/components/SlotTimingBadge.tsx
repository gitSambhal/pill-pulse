/**
 * PillPulse - Google Material 3 Slot Timing Badge
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
        bg: 'bg-[#FEF7E0] dark:bg-[#FBBC04]/15',
        text: 'text-[#B06000] dark:text-[#FBBC04]',
        border: 'border-[#FEEFC3] dark:border-[#FBBC04]/25',
        iconColor: 'text-[#F29900]',
      };
    case 'afternoon':
      return {
        label: 'Afternoon',
        bg: 'bg-[#E8F0FE] dark:bg-[#4285F4]/15',
        text: 'text-[#1A73E8] dark:text-[#8AB4F8]',
        border: 'border-[#D2E3FC] dark:border-[#4285F4]/25',
        iconColor: 'text-[#1A73E8]',
      };
    case 'evening':
      return {
        label: 'Evening',
        bg: 'bg-[#FCE8E6] dark:bg-[#EA4335]/15',
        text: 'text-[#C5221F] dark:text-[#F28B82]',
        border: 'border-[#FAD2CF] dark:border-[#EA4335]/25',
        iconColor: 'text-[#EA4335]',
      };
    case 'night':
      return {
        label: 'Night',
        bg: 'bg-[#F3E8FD] dark:bg-[#A142F4]/15',
        text: 'text-[#8430CE] dark:text-[#C58AF9]',
        border: 'border-[#E8D0FC] dark:border-[#A142F4]/25',
        iconColor: 'text-[#9334E6]',
      };
    case 'custom':
    default:
      return {
        label: 'Custom',
        bg: 'bg-[#E6F4EA] dark:bg-[#34A853]/15',
        text: 'text-[#137333] dark:text-[#81C995]',
        border: 'border-[#CEEAD6] dark:border-[#34A853]/25',
        iconColor: 'text-[#1E8E3E]',
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
    xs: 'px-2 py-0.5 text-[10px] gap-1 rounded-full',
    sm: 'px-2.5 py-0.5 text-[11px] gap-1.5 rounded-full',
    md: 'px-3 py-1 text-xs gap-1.5 rounded-full',
  }[size];

  const iconSizes = {
    xs: 'w-3 h-3',
    sm: 'w-3.5 h-3.5',
    md: 'w-4 h-4',
  }[size];

  return (
    <span
      className={`inline-flex items-center font-medium ${theme.bg} ${theme.text} ${theme.border} border ${sizeClasses} ${className}`}
    >
      <span className={theme.iconColor}>{getSlotIcon(slot, iconSizes)}</span>
      {showLabel && <span>{getSlotLabel(slot)}</span>}
    </span>
  );
};
