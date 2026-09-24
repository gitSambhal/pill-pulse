/**
 * PillPulse - Google Health Preferences & Sounds Modal
 * Developer: Suhail Akhtar (https://suhail.top)
 */

import React from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  X,
  Volume2,
  Bell,
  Play,
  Check,
  Vibrate,
  RotateCcw,
  Clock,
  Sunrise,
  Sun,
  Sunset,
  Moon,
} from 'lucide-react';
import { NotificationSettings, SoundPreset, SlotTimeSettings, ThemeColor } from '../../types';
import { audioService } from '../../services/audioService';
import { notificationService } from '../../services/notificationService';
import { formatTime12h } from '../../utils';
import { DEFAULT_SLOT_TIMES } from '../../services/storageService';
import { ThemeColorPicker } from '../../components/ThemeColorPicker';
import { THEME_COLORS } from '../../utils/themeColors';
import { useTheme } from '../../hooks/useTheme';

interface SettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
  settings: NotificationSettings;
  onUpdateSettings: (newSettings: NotificationSettings) => void;
  onResetData: () => void;
}

const SOUND_PRESETS: { id: SoundPreset; label: string; desc: string }[] = [
  { id: 'zen', label: 'Zen Chime', desc: 'Harmonious, gentle bell chord' },
  { id: 'marimba', label: 'Modern Marimba', desc: 'Upbeat melodic acoustic chimes' },
  { id: 'pulse', label: 'Pulsing Bell', desc: 'Warm double-tone reminder' },
  { id: 'urgent', label: 'Urgent Alert', desc: 'Crisp, high-priority alert' },
  { id: 'harp', label: 'Soothing Harp', desc: 'Gentle ascending glissando' },
];

export const SettingsModal: React.FC<SettingsModalProps> = ({
  isOpen,
  onClose,
  settings,
  onUpdateSettings,
  onResetData,
}) => {
  const { themeColor, setThemeColor } = useTheme();

  React.useEffect(() => {
    if (!isOpen) return;
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  const handleSoundTest = (preset: SoundPreset) => {
    audioService.playAlarm(preset, settings.soundVolume, 1);
  };

  const handleRequestNotification = async () => {
    const granted = await notificationService.requestPermission();
    onUpdateSettings({
      ...settings,
      browserNotifications: granted,
    });
    if (granted) {
      notificationService.showNotification('PillPulse Notifications Enabled', {
        body: 'You will receive alarms and routine countdowns on this device.',
      });
    }
  };

  const activeThemeColor = settings.themeColor || themeColor || 'blue';

  const handleColorChange = (newColor: ThemeColor) => {
    setThemeColor(newColor);
    onUpdateSettings({
      ...settings,
      themeColor: newColor,
    });
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-black/50 overflow-y-auto"
          onClick={onClose}
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.94, y: 12 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.94, y: 8 }}
            transition={{ duration: 0.18, ease: 'easeOut' }}
            className="w-full max-w-lg bg-white dark:bg-[#1E1F20] rounded-[28px] p-5 sm:p-6 shadow-2xl border border-[#E0E3E7] dark:border-[#3C4043] flex flex-col max-h-[90vh] overflow-hidden my-auto"
            role="dialog"
            aria-modal="true"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header */}
            <div className="flex items-center justify-between pb-4 border-b border-[#E0E3E7] dark:border-[#3C4043] shrink-0">
              <div className="flex items-center gap-3">
                <div
                  className="w-10 h-10 rounded-[14px] flex items-center justify-center text-white shrink-0 shadow-xs"
                  style={{ backgroundColor: 'var(--app-accent, #1A73E8)' }}
                >
                  <Volume2 className="w-5 h-5" />
                </div>
                <div>
                  <h2 className="text-[18px] font-medium text-[#1F1F1F] dark:text-[#E3E3E3]">
                    Preferences & Sounds
                  </h2>
                  <p className="text-[12px] text-[#444746] dark:text-[#9AA0A6]">
                    Theme colors, audio chimes & routine timings
                  </p>
                </div>
              </div>
              <button
                onClick={onClose}
                className="w-9 h-9 rounded-full hover:bg-[#F0F4F9] dark:hover:bg-[#282A2C] text-[#444746] dark:text-[#9AA0A6] transition-colors flex items-center justify-center cursor-pointer"
                title="Close"
              >
                <X className="w-4.5 h-4.5" />
              </button>
            </div>

            <div className="overflow-y-auto px-0.5 py-4 space-y-4 flex-1">
              {/* Theme Color Selection (Google Material You Palettes) */}
              <div className="p-4 rounded-[22px] bg-[#F0F4F9]/60 dark:bg-[#282A2C]/60 border border-[#E0E3E7] dark:border-[#3C4043]">
                <ThemeColorPicker
                  selectedColor={activeThemeColor}
                  onSelectColor={handleColorChange}
                />
              </div>

              {/* Sound Presets */}
              <div className="p-4 rounded-[22px] bg-[#F0F4F9]/60 dark:bg-[#282A2C]/60 border border-[#E0E3E7] dark:border-[#3C4043] space-y-3">
                <div>
                  <p className="text-[13px] font-medium text-[#1F1F1F] dark:text-[#E3E3E3]">
                    Alarm Melody
                  </p>
                  <p className="text-[11px] text-[#444746] dark:text-[#9AA0A6]">
                    Web Audio synth chimes for medication alarms
                  </p>
                </div>

                <div className="space-y-2">
                  {SOUND_PRESETS.map((item) => {
                    const isSelected = settings.soundPreset === item.id;
                    return (
                      <div
                        key={item.id}
                        className={`p-3 rounded-[16px] border transition-all flex items-center justify-between ${
                          isSelected
                            ? 'bg-white dark:bg-[#1E1F20] border-[var(--app-accent,#1A73E8)] shadow-xs'
                            : 'bg-white/80 dark:bg-[#1E1F20]/80 border-[#E0E3E7] dark:border-[#3C4043]'
                        }`}
                      >
                        <div
                          onClick={() => onUpdateSettings({ ...settings, soundPreset: item.id })}
                          className="flex items-center gap-2.5 flex-1 cursor-pointer select-none"
                        >
                          <div
                            className={`w-4.5 h-4.5 rounded-full flex items-center justify-center shrink-0 ${
                              isSelected
                                ? 'text-white'
                                : 'border border-[#747775] dark:border-[#8E918F]'
                            }`}
                            style={{
                              backgroundColor: isSelected ? 'var(--app-accent, #1A73E8)' : undefined,
                            }}
                          >
                            {isSelected && <Check className="w-3 h-3 stroke-[3]" />}
                          </div>
                          <div>
                            <p className="text-[13px] font-medium text-[#1F1F1F] dark:text-[#E3E3E3]">
                              {item.label}
                            </p>
                            <p className="text-[11px] text-[#444746] dark:text-[#9AA0A6]">
                              {item.desc}
                            </p>
                          </div>
                        </div>

                        <button
                          type="button"
                          onClick={() => handleSoundTest(item.id)}
                          className="px-3 py-1.5 rounded-full bg-[#F0F4F9] dark:bg-[#282A2C] hover:bg-[#E0E3E7] dark:hover:bg-[#3C4043] transition-colors text-[12px] font-medium flex items-center gap-1.5 text-[#1F1F1F] dark:text-[#E3E3E3] cursor-pointer"
                          title="Listen to melody"
                        >
                          <Play className="w-3 h-3 fill-current" />
                          Play
                        </button>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Volume Control */}
              <div className="p-4 rounded-[22px] bg-[#F0F4F9]/60 dark:bg-[#282A2C]/60 border border-[#E0E3E7] dark:border-[#3C4043] space-y-2.5">
                <div className="flex items-center justify-between">
                  <span className="text-[13px] font-medium text-[#1F1F1F] dark:text-[#E3E3E3]">
                    Alarm Volume
                  </span>
                  <span
                    className="text-[13px] font-mono font-medium"
                    style={{ color: 'var(--app-accent, #1A73E8)' }}
                  >
                    {Math.round(settings.soundVolume * 100)}%
                  </span>
                </div>
                <input
                  type="range"
                  min="0.1"
                  max="1.0"
                  step="0.05"
                  value={settings.soundVolume}
                  onChange={(e) =>
                    onUpdateSettings({ ...settings, soundVolume: parseFloat(e.target.value) })
                  }
                  className="w-full h-2 bg-[#E0E3E7] dark:bg-[#3C4043] rounded-lg appearance-none cursor-pointer"
                  style={{ accentColor: 'var(--app-accent, #1A73E8)' }}
                />
              </div>

              {/* Repeat count */}
              <div className="flex items-center justify-between p-4 rounded-[22px] bg-[#F0F4F9]/60 dark:bg-[#282A2C]/60 border border-[#E0E3E7] dark:border-[#3C4043]">
                <div>
                  <p className="text-[13px] font-medium text-[#1F1F1F] dark:text-[#E3E3E3]">Alarm Repetition</p>
                  <p className="text-[11px] text-[#444746] dark:text-[#9AA0A6]">Number of melodic loops</p>
                </div>
                <div className="flex items-center gap-1.5">
                  {[1, 2, 3, 5].map((rep) => (
                    <button
                      key={rep}
                      type="button"
                      onClick={() => onUpdateSettings({ ...settings, soundRepeat: rep })}
                      className="px-3 py-1.5 text-[12px] font-medium rounded-full transition-all cursor-pointer"
                      style={
                        settings.soundRepeat === rep
                          ? { backgroundColor: 'var(--app-accent, #1A73E8)', color: '#FFFFFF' }
                          : { backgroundColor: 'rgba(68, 71, 70, 0.12)', color: 'inherit' }
                      }
                    >
                      {rep}x
                    </button>
                  ))}
                </div>
              </div>

              {/* Push Notifications Toggle */}
              <div className="p-4 rounded-[22px] bg-[#F0F4F9]/60 dark:bg-[#282A2C]/60 border border-[#E0E3E7] dark:border-[#3C4043] flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div
                    className="p-2.5 rounded-[12px] text-white"
                    style={{ backgroundColor: 'var(--app-accent, #1A73E8)' }}
                  >
                    <Bell className="w-4 h-4" />
                  </div>
                  <div>
                    <p className="text-[13px] font-medium text-[#1F1F1F] dark:text-[#E3E3E3]">
                      Device Notifications
                    </p>
                    <p className="text-[11px] text-[#444746] dark:text-[#9AA0A6]">
                      {notificationService.getPermission() === 'granted'
                        ? 'Push notifications enabled'
                        : 'Requires browser permission'}
                    </p>
                  </div>
                </div>

                {notificationService.getPermission() !== 'granted' ? (
                  <button
                    type="button"
                    onClick={handleRequestNotification}
                    className="px-4 py-1.5 text-white text-[12px] font-medium rounded-full shadow-xs transition-colors cursor-pointer"
                    style={{ backgroundColor: 'var(--app-accent, #1A73E8)' }}
                  >
                    Enable
                  </button>
                ) : (
                  <span className="text-[12px] text-[#1E8E3E] dark:text-[#81C995] font-medium flex items-center gap-1">
                    <Check className="w-3.5 h-3.5 stroke-[2.5]" /> Active
                  </span>
                )}
              </div>

              {/* Daily Schedule Default Times */}
              <div className="p-4 rounded-[22px] bg-[#F0F4F9]/60 dark:bg-[#282A2C]/60 border border-[#E0E3E7] dark:border-[#3C4043] space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Clock className="w-4 h-4" style={{ color: 'var(--app-accent, #1A73E8)' }} />
                    <div>
                      <p className="text-[13px] font-medium text-[#1F1F1F] dark:text-[#E3E3E3]">
                        Default Schedule Times
                      </p>
                      <p className="text-[11px] text-[#444746] dark:text-[#9AA0A6]">
                        Daily routine hours for your slots
                      </p>
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                  {[
                    {
                      key: 'morning' as keyof SlotTimeSettings,
                      label: 'Morning (Wakeup)',
                      icon: <Sunrise className="w-4 h-4 text-[#F29900]" />,
                      defaultTime: DEFAULT_SLOT_TIMES.morning,
                    },
                    {
                      key: 'afternoon' as keyof SlotTimeSettings,
                      label: 'Afternoon (Lunch)',
                      icon: <Sun className="w-4 h-4 text-[#1A73E8]" />,
                      defaultTime: DEFAULT_SLOT_TIMES.afternoon,
                    },
                    {
                      key: 'evening' as keyof SlotTimeSettings,
                      label: 'Evening (Dinner)',
                      icon: <Sunset className="w-4 h-4 text-[#EA4335]" />,
                      defaultTime: DEFAULT_SLOT_TIMES.evening,
                    },
                    {
                      key: 'night' as keyof SlotTimeSettings,
                      label: 'Night (Bedtime)',
                      icon: <Moon className="w-4 h-4 text-[#9334E6]" />,
                      defaultTime: DEFAULT_SLOT_TIMES.night,
                    },
                  ].map((slot) => {
                    const currentVal =
                      settings.slotTimes?.[slot.key] || slot.defaultTime;
                    return (
                      <label
                        key={slot.key}
                        className="p-3 rounded-[16px] bg-white dark:bg-[#1E1F20] border border-[#E0E3E7] dark:border-[#3C4043] flex items-center justify-between gap-2.5 hover:border-[var(--app-accent,#1A73E8)] transition-colors cursor-pointer shadow-xs"
                      >
                        <div className="flex items-center gap-2 min-w-0">
                          {slot.icon}
                          <span className="text-[12px] font-medium text-[#1F1F1F] dark:text-[#E3E3E3] truncate">
                            {slot.label}
                          </span>
                        </div>
                        <div className="flex items-center gap-1.5 shrink-0">
                          <span
                            className="text-[12px] font-mono font-medium"
                            style={{ color: 'var(--app-accent, #1A73E8)' }}
                          >
                            {formatTime12h(currentVal)}
                          </span>
                          <input
                            type="time"
                            value={currentVal}
                            onChange={(e) => {
                              const newSlotTimes = {
                                ...DEFAULT_SLOT_TIMES,
                                ...(settings.slotTimes || {}),
                                [slot.key]: e.target.value,
                              };
                              onUpdateSettings({
                                ...settings,
                                slotTimes: newSlotTimes,
                              });
                            }}
                            className="w-6 h-6 opacity-0 absolute cursor-pointer"
                          />
                        </div>
                      </label>
                    );
                  })}
                </div>
              </div>

              {/* Vibrate Toggle */}
              <div className="flex items-center justify-between p-4 rounded-[22px] bg-[#F0F4F9]/60 dark:bg-[#282A2C]/60 border border-[#E0E3E7] dark:border-[#3C4043]">
                <div className="flex items-center gap-3">
                  <div className="p-2.5 rounded-[12px] bg-black/5 dark:bg-white/10 text-[#1F1F1F] dark:text-[#E3E3E3]">
                    <Vibrate className="w-4 h-4" />
                  </div>
                  <div>
                    <p className="text-[13px] font-medium text-[#1F1F1F] dark:text-[#E3E3E3]">Haptic Vibration</p>
                    <p className="text-[11px] text-[#444746] dark:text-[#9AA0A6]">Pulse device on alarms</p>
                  </div>
                </div>
                <input
                  type="checkbox"
                  checked={settings.vibrateEnabled}
                  onChange={(e) =>
                    onUpdateSettings({ ...settings, vibrateEnabled: e.target.checked })
                  }
                  className="w-5 h-5 rounded cursor-pointer"
                  style={{ accentColor: 'var(--app-accent, #1A73E8)' }}
                />
              </div>

              {/* Reset Data */}
              <div className="pt-2">
                <button
                  type="button"
                  onClick={onResetData}
                  className="w-full py-2.5 px-4 text-[13px] font-medium text-[#EA4335] hover:bg-[#FCE8E6] dark:hover:bg-[#EA4335]/15 rounded-full transition-colors flex items-center justify-center gap-2 cursor-pointer active:scale-95"
                >
                  <RotateCcw className="w-4 h-4" />
                  Reset All Medications & Schedules
                </button>
              </div>
            </div>

            <div className="pt-3 border-t border-[#E0E3E7] dark:border-[#3C4043] flex justify-end shrink-0">
              <button
                onClick={onClose}
                className="w-full py-3 px-6 text-white rounded-full text-[14px] font-medium shadow-xs transition-all active:scale-95 cursor-pointer"
                style={{ backgroundColor: 'var(--app-accent, #1A73E8)' }}
              >
                Done
              </button>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};
