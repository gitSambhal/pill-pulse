/**
 * PillPulse - Theme Accent Color Selector
 * Developer: Suhail Akhtar (https://suhail.top)
 */

import React from 'react';
import { Check } from 'lucide-react';
import { ThemeColor } from '../types';
import { THEME_COLORS } from '../utils/themeColors';

interface ThemeColorPickerProps {
  selectedColor: ThemeColor;
  onSelectColor: (color: ThemeColor) => void;
  showLabels?: boolean;
}

export const ThemeColorPicker: React.FC<ThemeColorPickerProps> = ({
  selectedColor,
  onSelectColor,
  showLabels = false,
}) => {
  const colorList = Object.values(THEME_COLORS);

  return (
    <div className="flex items-center gap-2 sm:gap-2.5 flex-wrap">
      {colorList.map((c) => {
        const isSelected = selectedColor === c.id;

        return (
          <button
            key={c.id}
            type="button"
            onClick={() => onSelectColor(c.id)}
            style={{
              backgroundColor: c.primary,
              boxShadow: isSelected ? `0 0 0 2px var(--apple-card-light, #fff), 0 0 0 4px ${c.primary}` : undefined,
            }}
            className={`w-7 h-7 sm:w-8 sm:h-8 rounded-full flex items-center justify-center transition-all relative cursor-pointer active:scale-90 ${
              isSelected
                ? 'scale-110 shadow-sm'
                : 'hover:scale-105 opacity-85 hover:opacity-100'
            }`}
            title={c.name}
            aria-label={`Select ${c.name} theme`}
          >
            {isSelected && <Check className="w-4 h-4 text-white stroke-[3] drop-shadow-xs" />}
            {showLabels && (
              <span className="sr-only">{c.name}</span>
            )}
          </button>
        );
      })}
    </div>
  );
};
