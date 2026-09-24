/**
 * PillPulse - Application Navbar
 * Developer: Suhail Akhtar (https://suhail.top)
 */

import React from 'react';
import { Pill, Sun, Moon, Volume2, Bell, Download } from 'lucide-react';
import { useTheme } from '../hooks/useTheme';
import { usePWAInstall } from '../hooks/usePWAInstall';

interface NavbarProps {
  onTestSound: () => void;
  onOpenSettings: () => void;
  onOpenQuickRoutine: () => void;
  activeAlarmCount: number;
}

export const Navbar: React.FC<NavbarProps> = ({
  onTestSound,
  onOpenSettings,
  onOpenQuickRoutine,
  activeAlarmCount,
}) => {
  const { theme, toggleTheme } = useTheme();
  const { isInstallable, install, isIOS } = usePWAInstall();

  return (
    <header className="sticky top-0 z-30 bg-white/85 dark:bg-slate-950/85 backdrop-blur-md border-b border-slate-200/80 dark:border-slate-800/80 transition-colors">
      <div className="max-w-xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
        {/* Brand */}
        <div className="flex items-center gap-2.5">
          <div className="w-9 h-9 rounded-2xl bg-linear-to-tr from-teal-600 to-sky-500 flex items-center justify-center text-white shadow-md shadow-teal-500/20">
            <Pill className="w-5 h-5 -rotate-45" />
          </div>
          <div>
            <div className="flex items-center gap-1.5">
              <span className="font-bold text-base tracking-tight text-slate-900 dark:text-white">
                PillPulse
              </span>
              <span className="inline-block w-2 h-2 rounded-full bg-emerald-500 animate-pulse" title="Alarm engine active" />
            </div>
            <p className="text-[10px] font-medium text-slate-500 dark:text-slate-400 leading-none">
              Smart Routine Reminders
            </p>
          </div>
        </div>

        {/* Header Actions */}
        <div className="flex items-center gap-1 sm:gap-1.5">
          {/* Quick Sound Test */}
          <button
            onClick={onTestSound}
            className="p-2 rounded-xl text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors relative"
            title="Test alarm sound"
            aria-label="Test alarm sound"
          >
            <Volume2 className="w-4 h-4 text-teal-600 dark:text-teal-400" />
            {activeAlarmCount > 0 && (
              <span className="absolute top-1 right-1 w-2 h-2 bg-rose-500 rounded-full animate-ping" />
            )}
          </button>

          {/* Install PWA Button if available */}
          {isInstallable && (
            <button
              onClick={install}
              className="p-2 rounded-xl text-teal-600 dark:text-teal-400 hover:bg-teal-50 dark:hover:bg-teal-950/50 transition-colors"
              title="Install App"
              aria-label="Install App"
            >
              <Download className="w-4 h-4" />
            </button>
          )}

          {/* Theme Toggle */}
          <button
            onClick={toggleTheme}
            className="p-2 rounded-xl text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
            title={`Switch to ${theme === 'dark' ? 'Light' : 'Dark'} mode`}
            aria-label="Toggle theme"
          >
            {theme === 'dark' ? <Sun className="w-4 h-4 text-amber-400" /> : <Moon className="w-4 h-4 text-slate-700" />}
          </button>

          {/* Settings button */}
          <button
            onClick={onOpenSettings}
            className="p-2 rounded-xl text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
            title="Settings & Audio"
            aria-label="Settings"
          >
            <Bell className="w-4 h-4" />
          </button>
        </div>
      </div>
    </header>
  );
};
