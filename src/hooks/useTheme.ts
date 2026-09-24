/**
 * PillPulse - Dark/Light Mode Theme Hook
 * Developer: Suhail Akhtar (https://suhail.top)
 */

import { useEffect, useState } from 'react';
import { ThemeColor } from '../types';
import { THEME_COLORS } from '../utils/themeColors';

type Theme = 'light' | 'dark';

export function useTheme() {
  const [theme, setTheme] = useState<Theme>(() => {
    try {
      const saved = localStorage.getItem('pillpulse_theme_v1');
      if (saved === 'dark' || saved === 'light') {
        if (saved === 'dark') {
          document.documentElement.classList.add('dark');
          document.documentElement.style.colorScheme = 'dark';
        } else {
          document.documentElement.classList.remove('dark');
          document.documentElement.style.colorScheme = 'light';
        }
        return saved;
      }
      const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
      if (prefersDark) {
        document.documentElement.classList.add('dark');
        document.documentElement.style.colorScheme = 'dark';
      } else {
        document.documentElement.classList.remove('dark');
        document.documentElement.style.colorScheme = 'light';
      }
      return prefersDark ? 'dark' : 'light';
    } catch {
      return 'dark';
    }
  });

  const [themeColor, setThemeColorState] = useState<ThemeColor>(() => {
    try {
      const saved = localStorage.getItem('pillpulse_accent_color_v1') as ThemeColor;
      if (saved && THEME_COLORS[saved]) {
        return saved;
      }
      return 'blue';
    } catch {
      return 'blue';
    }
  });

  // Apply light/dark class
  useEffect(() => {
    const root = document.documentElement;
    if (theme === 'dark') {
      root.classList.add('dark');
      root.style.colorScheme = 'dark';
    } else {
      root.classList.remove('dark');
      root.style.colorScheme = 'light';
    }
    try {
      localStorage.setItem('pillpulse_theme_v1', theme);
    } catch {
      // ignore
    }
  }, [theme]);

  // Apply theme accent color to root CSS variables
  useEffect(() => {
    const root = document.documentElement;
    const config = THEME_COLORS[themeColor] || THEME_COLORS.blue;
    const isDark = theme === 'dark';

    root.style.setProperty('--app-accent', isDark ? config.primaryDark : config.primary);
    root.style.setProperty('--app-accent-hover', config.hover);
    root.style.setProperty('--app-accent-subtle', isDark ? config.subtleDark : config.subtleLight);
    root.style.setProperty('--app-accent-ring', config.ring);

    // Also update meta theme-color for mobile address bar
    const metaThemeColor = document.querySelector('meta[name="theme-color"]');
    if (metaThemeColor) {
      metaThemeColor.setAttribute('content', isDark ? '#000000' : '#FFFFFF');
    }

    try {
      localStorage.setItem('pillpulse_accent_color_v1', themeColor);
    } catch {
      // ignore
    }
  }, [themeColor, theme]);

  const toggleTheme = () => {
    setTheme((prev) => (prev === 'dark' ? 'light' : 'dark'));
  };

  const setThemeColor = (newColor: ThemeColor) => {
    setThemeColorState(newColor);
  };

  return {
    theme,
    toggleTheme,
    isDark: theme === 'dark',
    themeColor,
    setThemeColor,
  };
}
