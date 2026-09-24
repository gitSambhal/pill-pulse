/**
 * PillPulse - Google Product App Bar (Material Design 3)
 * Developer: Suhail Akhtar (https://suhail.top)
 */

import React, { useState, useRef, useEffect } from 'react';
import { Sun, Moon, Volume2, Settings, Download, Palette, Check, ExternalLink, ShieldCheck } from 'lucide-react';
import { useTheme } from '../hooks/useTheme';
import { usePWAInstall } from '../hooks/usePWAInstall';
import { THEME_COLORS } from '../utils/themeColors';

interface NavbarProps {
  onTestSound: () => void;
  onOpenSettings: () => void;
  onOpenQuickRoutine: () => void;
  activeAlarmCount: number;
}

export const Navbar: React.FC<NavbarProps> = ({
  onTestSound,
  onOpenSettings,
  activeAlarmCount,
}) => {
  const { theme, toggleTheme, themeColor, setThemeColor } = useTheme();
  const { isInstallable, install } = usePWAInstall();
  const [isPaletteOpen, setIsPaletteOpen] = useState(false);
  const [isAccountOpen, setIsAccountOpen] = useState(false);
  const paletteMenuRef = useRef<HTMLDivElement>(null);
  const accountMenuRef = useRef<HTMLDivElement>(null);

  // Close menus on outside click
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (paletteMenuRef.current && !paletteMenuRef.current.contains(e.target as Node)) {
        setIsPaletteOpen(false);
      }
      if (accountMenuRef.current && !accountMenuRef.current.contains(e.target as Node)) {
        setIsAccountOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const currentColorConfig = THEME_COLORS[themeColor] || THEME_COLORS.blue;

  return (
    <header className="sticky top-0 z-30 bg-[#FFFFFF] dark:bg-[#1E1F20] border-b border-[#E0E3E7] dark:border-[#3C4043] transition-colors">
      <div className="max-w-2xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between gap-3">
        {/* Google Product Brand Lockup */}
        <div className="flex items-center gap-3">
          {/* Google 4-Color Motif & Pill Icon */}
          <div className="relative flex items-center justify-center">
            <div className="w-9 h-9 rounded-full bg-[#F0F4F9] dark:bg-[#282A2C] border border-[#E0E3E7] dark:border-[#3C4043] flex items-center justify-center shadow-xs">
              <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                {/* Google 4-Color Pill Cross */}
                <path d="M12 3V12" stroke="#4285F4" strokeWidth="3" strokeLinecap="round" />
                <path d="M12 12V21" stroke="#34A853" strokeWidth="3" strokeLinecap="round" />
                <path d="M3 12H12" stroke="#EA4335" strokeWidth="3" strokeLinecap="round" />
                <path d="M12 12H21" stroke="#FBBC04" strokeWidth="3" strokeLinecap="round" />
                <circle cx="12" cy="12" r="2.5" fill="var(--app-accent, #1A73E8)" />
              </svg>
            </div>
            {/* Subtle Google Green live status dot */}
            <span
              className="absolute -bottom-0.5 -right-0.5 w-2.5 h-2.5 rounded-full bg-[#34A853] ring-2 ring-white dark:ring-[#1E1F20]"
              title="Google Health Engine Active"
            />
          </div>

          <div>
            <div className="flex items-center gap-1.5">
              <span className="font-medium text-[19px] tracking-[-0.02em] text-[#1F1F1F] dark:text-[#E3E3E3] font-sans">
                PillPulse
              </span>
              <span
                className="text-[10px] font-medium px-1.5 py-0.5 rounded-md"
                style={{
                  backgroundColor: 'var(--app-accent-subtle, #E8F0FE)',
                  color: 'var(--app-accent, #1A73E8)',
                }}
              >
                Health
              </span>
            </div>
            <p className="text-[11px] font-normal text-[#444746] dark:text-[#9AA0A6] leading-none">
              Daily Routines & Interval Tracker
            </p>
          </div>
        </div>

        {/* Google Material 3 Action Bar */}
        <div className="flex items-center gap-1 sm:gap-1.5">
          {/* Material You Dynamic Palette Selector */}
          <div className="relative" ref={paletteMenuRef}>
            <button
              onClick={() => setIsPaletteOpen((prev) => !prev)}
              className="w-10 h-10 rounded-full hover:bg-[#F0F4F9] dark:hover:bg-[#282A2C] active:bg-[#E0E3E7] dark:active:bg-[#3C4043] transition-colors flex items-center justify-center cursor-pointer"
              title={`Material Theme: ${currentColorConfig.name}`}
              aria-label="Change Material Palette"
            >
              <span
                className="w-4 h-4 rounded-full border-2 border-white dark:border-[#1E1F20] shadow-xs transition-transform hover:scale-110"
                style={{ backgroundColor: 'var(--app-accent, #1A73E8)' }}
              />
            </button>

            {/* Google Material 3 Theme Palette Popover */}
            {isPaletteOpen && (
              <div className="absolute right-0 top-12 z-50 w-60 p-3.5 bg-white dark:bg-[#282A2C] rounded-[24px] border border-[#E0E3E7] dark:border-[#3C4043] shadow-lg animate-in fade-in zoom-in-95 duration-150">
                <div className="flex items-center justify-between pb-2 mb-2.5 border-b border-[#E0E3E7] dark:border-[#3C4043]">
                  <span className="text-[12px] font-medium text-[#1F1F1F] dark:text-[#E3E3E3] flex items-center gap-1.5">
                    <Palette className="w-3.5 h-3.5" style={{ color: 'var(--app-accent)' }} />
                    Material You Colors
                  </span>
                  <span className="text-[11px] text-[#444746] dark:text-[#9AA0A6] font-medium">
                    {currentColorConfig.name}
                  </span>
                </div>
                <div className="grid grid-cols-4 gap-2 pt-1">
                  {Object.values(THEME_COLORS).map((c) => {
                    const isSelected = themeColor === c.id;
                    return (
                      <button
                        key={c.id}
                        type="button"
                        onClick={() => {
                          setThemeColor(c.id);
                          setIsPaletteOpen(false);
                        }}
                        className="flex flex-col items-center gap-1 group cursor-pointer active:scale-90 transition-transform"
                        title={c.name}
                      >
                        <div
                          className={`w-8 h-8 rounded-full flex items-center justify-center transition-all ${
                            isSelected ? 'ring-2 ring-offset-2 ring-offset-white dark:ring-offset-[#282A2C] scale-110' : 'hover:scale-105'
                          }`}
                          style={{ backgroundColor: c.primary }}
                        >
                          {isSelected && <Check className="w-4 h-4 text-white stroke-[3]" />}
                        </div>
                        <span className="text-[10px] text-[#444746] dark:text-[#9AA0A6] group-hover:text-black dark:group-hover:text-white truncate max-w-full">
                          {c.name.replace('Google ', '')}
                        </span>
                      </button>
                    );
                  })}
                </div>
              </div>
            )}
          </div>

          {/* Quick Sound Test */}
          <button
            onClick={onTestSound}
            className="w-10 h-10 rounded-full hover:bg-[#F0F4F9] dark:hover:bg-[#282A2C] active:bg-[#E0E3E7] dark:active:bg-[#3C4043] transition-colors flex items-center justify-center relative cursor-pointer text-[#444746] dark:text-[#C4C7C5]"
            title="Test alarm chime"
            aria-label="Test alarm sound"
          >
            <Volume2 className="w-4.5 h-4.5" />
            {activeAlarmCount > 0 && (
              <span className="absolute top-2 right-2 w-2 h-2 bg-[#EA4335] rounded-full animate-ping" />
            )}
          </button>

          {/* Install PWA Button */}
          {isInstallable && (
            <button
              onClick={install}
              className="w-10 h-10 rounded-full hover:bg-[#F0F4F9] dark:hover:bg-[#282A2C] active:bg-[#E0E3E7] dark:active:bg-[#3C4043] transition-colors flex items-center justify-center cursor-pointer text-[#444746] dark:text-[#C4C7C5]"
              title="Install App"
              aria-label="Install App"
            >
              <Download className="w-4.5 h-4.5" />
            </button>
          )}

          {/* Theme Dark/Light Toggle */}
          <button
            onClick={toggleTheme}
            className="w-10 h-10 rounded-full hover:bg-[#F0F4F9] dark:hover:bg-[#282A2C] active:bg-[#E0E3E7] dark:active:bg-[#3C4043] transition-colors flex items-center justify-center cursor-pointer text-[#444746] dark:text-[#C4C7C5]"
            title={`Switch to ${theme === 'dark' ? 'Light' : 'Dark'} mode`}
            aria-label="Toggle theme"
          >
            {theme === 'dark' ? <Sun className="w-4.5 h-4.5 text-[#FBBC04]" /> : <Moon className="w-4.5 h-4.5" />}
          </button>

          {/* Settings Button */}
          <button
            onClick={onOpenSettings}
            className="w-10 h-10 rounded-full hover:bg-[#F0F4F9] dark:hover:bg-[#282A2C] active:bg-[#E0E3E7] dark:active:bg-[#3C4043] transition-colors flex items-center justify-center cursor-pointer text-[#444746] dark:text-[#C4C7C5]"
            title="Settings & Preferences"
            aria-label="Settings"
          >
            <Settings className="w-4.5 h-4.5" />
          </button>

          {/* Google Account Profile Button */}
          <div className="relative ml-1" ref={accountMenuRef}>
            <button
              onClick={() => setIsAccountOpen((prev) => !prev)}
              className="w-8.5 h-8.5 rounded-full p-0.5 ring-2 ring-[#E0E3E7] dark:ring-[#3C4043] hover:ring-[var(--app-accent)] transition-all cursor-pointer flex items-center justify-center overflow-hidden"
              title="Google Account: Suhail Akhtar"
              aria-label="Google Account Profile"
            >
              <div
                className="w-full h-full rounded-full flex items-center justify-center text-white font-medium text-[13px] shadow-xs"
                style={{ backgroundColor: 'var(--app-accent, #1A73E8)' }}
              >
                S
              </div>
            </button>

            {/* Google Account Card Popover */}
            {isAccountOpen && (
              <div className="absolute right-0 top-11 z-50 w-72 p-4 bg-white dark:bg-[#282A2C] rounded-[28px] border border-[#E0E3E7] dark:border-[#3C4043] shadow-xl animate-in fade-in zoom-in-95 duration-150">
                <div className="flex flex-col items-center text-center pb-3 border-b border-[#E0E3E7] dark:border-[#3C4043]">
                  <div
                    className="w-14 h-14 rounded-full flex items-center justify-center text-white font-semibold text-xl mb-2 shadow-sm"
                    style={{ backgroundColor: 'var(--app-accent, #1A73E8)' }}
                  >
                    S
                  </div>
                  <h4 className="text-[14px] font-medium text-[#1F1F1F] dark:text-[#E3E3E3]">
                    Suhail Akhtar
                  </h4>
                  <p className="text-[12px] text-[#444746] dark:text-[#9AA0A6] mt-0.5">
                    Lead Full-Stack Developer
                  </p>
                  <div className="flex items-center gap-1 text-[11px] text-[#1E8E3E] font-medium mt-1">
                    <ShieldCheck className="w-3.5 h-3.5" />
                    <span>Verified Author & Maintainer</span>
                  </div>
                </div>

                <div className="pt-3 space-y-2">
                  <a
                    href="https://suhail.top"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-full py-2 px-3 rounded-full border border-[#747775] dark:border-[#8E918F] hover:bg-[#F0F4F9] dark:hover:bg-[#3C4043] text-[#1F1F1F] dark:text-[#E3E3E3] text-[12px] font-medium flex items-center justify-center gap-1.5 transition-colors"
                  >
                    <span>Visit suhail.top</span>
                    <ExternalLink className="w-3 h-3 text-[#444746] dark:text-[#9AA0A6]" />
                  </a>

                  <button
                    onClick={() => {
                      setIsAccountOpen(false);
                      onOpenSettings();
                    }}
                    className="w-full py-2 px-3 rounded-full text-[12px] font-medium text-center transition-colors cursor-pointer"
                    style={{
                      backgroundColor: 'var(--app-accent-subtle, #E8F0FE)',
                      color: 'var(--app-accent, #1A73E8)',
                    }}
                  >
                    Manage Settings & Storage
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};

