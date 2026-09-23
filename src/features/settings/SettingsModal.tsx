/**
 * PillPulse - Settings & Sound Customization Modal
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
  Music,
  Sliders,
  Sparkles,
  Clock,
  Sunrise,
  Sun,
  Sunset,
  Moon,
} from 'lucide-react';
import { NotificationSettings, SoundPreset, SlotTimeSettings } from '../../types';
import { audioService } from '../../services/audioService';
import { notificationService } from '../../services/notificationService';
import { formatTime12h } from '../../utils';
import { DEFAULT_SLOT_TIMES } from '../../services/storageService';

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
  React.useEffect(() => {
    if (!isOpen) return;
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

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

  return (
    <AnimatePresence>
      <div
        className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-950/70 backdrop-blur-xs"
        onClick={onClose}
      >
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95 }}
          className="w-full max-w-md bg-white dark:bg-slate-900 rounded-3xl p-5 sm:p-6 shadow-2xl border border-slate-200 dark:border-slate-800 flex flex-col max-h-[85vh] overflow-hidden"
          role="dialog"
          aria-modal="true"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Header */}
          <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800 shrink-0">
            <div className="flex items-center gap-2.5">
              <div className="p-2 rounded-2xl bg-teal-50 dark:bg-teal-950/60 text-teal-600 dark:text-teal-400">
                <Volume2 className="w-5 h-5" />
              </div>
              <div>
                <h2 className="text-base font-bold text-slate-900 dark:text-white">
                  Sound & Reminders
                </h2>
                <p className="text-xs text-slate-500 dark:text-slate-400">
                  Synthesizer alarms & alert preferences
                </p>
              </div>
            </div>
            <button
              onClick={onClose}
              className="p-1.5 rounded-lg text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          <div className="overflow-y-auto pr-1 py-4 space-y-5 flex-1">
            {/* Alarm Sound Preset Selector */}
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400 mb-2">
                Alarm Melody
              </label>
              <div className="space-y-1.5">
                {SOUND_PRESETS.map((item) => {
                  const isSelected = settings.soundPreset === item.id;
                  return (
                    <div
                      key={item.id}
                      className={`flex items-center justify-between p-3 rounded-2xl border transition-all ${
                        isSelected
                          ? 'border-teal-500 bg-teal-50/50 dark:bg-teal-950/40'
                          : 'border-slate-200 dark:border-slate-800 bg-slate-50/40 dark:bg-slate-800/20'
                      }`}
                    >
                      <button
                        type="button"
                        onClick={() => onUpdateSettings({ ...settings, soundPreset: item.id })}
                        className="flex-1 text-left"
                      >
                        <div className="flex items-center gap-2">
                          <p className="text-xs font-semibold text-slate-900 dark:text-white">
                            {item.label}
                          </p>
                          {isSelected && <Check className="w-3.5 h-3.5 text-teal-600 dark:text-teal-400" />}
                        </div>
                        <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5">
                          {item.desc}
                        </p>
                      </button>

                      <button
                        type="button"
                        onClick={() => handleSoundTest(item.id)}
                        className="px-2.5 py-1.5 rounded-xl bg-slate-200/80 dark:bg-slate-700/80 hover:bg-teal-600 hover:text-white dark:hover:bg-teal-500 transition-colors text-xs font-medium flex items-center gap-1 text-slate-700 dark:text-slate-200"
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
            <div>
              <div className="flex items-center justify-between mb-1.5">
                <span className="text-xs font-semibold text-slate-700 dark:text-slate-300">
                  Alarm Volume
                </span>
                <span className="text-xs font-mono font-semibold text-teal-600 dark:text-teal-400">
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
                className="w-full h-2 bg-slate-200 dark:bg-slate-700 rounded-lg appearance-none cursor-pointer accent-teal-600"
              />
            </div>

            {/* Repeat count */}
            <div className="flex items-center justify-between p-3 rounded-2xl bg-slate-50 dark:bg-slate-800/40 border border-slate-200 dark:border-slate-800">
              <div>
                <p className="text-xs font-semibold text-slate-900 dark:text-white">Alarm Repetition</p>
                <p className="text-[11px] text-slate-500 dark:text-slate-400">Number of melodic loops</p>
              </div>
              <div className="flex items-center gap-1">
                {[1, 2, 3, 5].map((rep) => (
                  <button
                    key={rep}
                    type="button"
                    onClick={() => onUpdateSettings({ ...settings, soundRepeat: rep })}
                    className={`px-2.5 py-1 text-xs font-medium rounded-lg transition-colors ${
                      settings.soundRepeat === rep
                        ? 'bg-teal-600 text-white font-semibold'
                        : 'bg-slate-200/80 dark:bg-slate-700 text-slate-600 dark:text-slate-300'
                    }`}
                  >
                    {rep}x
                  </button>
                ))}
              </div>
            </div>

            {/* Push Notifications Toggle */}
            <div className="p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-800/40 border border-slate-200 dark:border-slate-800 flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <div className="p-2 rounded-xl bg-teal-50 dark:bg-teal-950/50 text-teal-600 dark:text-teal-400">
                  <Bell className="w-4 h-4" />
                </div>
                <div>
                  <p className="text-xs font-semibold text-slate-900 dark:text-white">
                    Device Notifications
                  </p>
                  <p className="text-[11px] text-slate-500 dark:text-slate-400">
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
                  className="px-3 py-1.5 bg-teal-600 hover:bg-teal-700 text-white text-xs font-semibold rounded-xl shadow-xs transition-colors"
                >
                  Enable
                </button>
              ) : (
                <span className="text-xs text-emerald-600 dark:text-emerald-400 font-semibold flex items-center gap-1">
                  <Check className="w-3.5 h-3.5" /> Active
                </span>
              )}
            </div>

            {/* Daily Schedule Default Times (Morning, Afternoon, Evening, Night) */}
            <div className="p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-800/40 border border-slate-200 dark:border-slate-800 space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="p-1.5 rounded-lg bg-teal-50 dark:bg-teal-950/50 text-teal-600 dark:text-teal-400">
                    <Clock className="w-4 h-4" />
                  </div>
                  <div>
                    <p className="text-xs font-semibold text-slate-900 dark:text-white">
                      Default Schedule Times
                    </p>
                    <p className="text-[11px] text-slate-500 dark:text-slate-400">
                      Set custom daily hours for your routines
                    </p>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                {[
                  {
                    key: 'morning' as keyof SlotTimeSettings,
                    label: 'Morning (Wakeup)',
                    icon: <Sunrise className="w-4 h-4 text-amber-500" />,
                    defaultTime: DEFAULT_SLOT_TIMES.morning,
                  },
                  {
                    key: 'afternoon' as keyof SlotTimeSettings,
                    label: 'Afternoon (Lunch)',
                    icon: <Sun className="w-4 h-4 text-amber-500" />,
                    defaultTime: DEFAULT_SLOT_TIMES.afternoon,
                  },
                  {
                    key: 'evening' as keyof SlotTimeSettings,
                    label: 'Evening (Dinner)',
                    icon: <Sunset className="w-4 h-4 text-orange-500" />,
                    defaultTime: DEFAULT_SLOT_TIMES.evening,
                  },
                  {
                    key: 'night' as keyof SlotTimeSettings,
                    label: 'Night (Bedtime)',
                    icon: <Moon className="w-4 h-4 text-indigo-400" />,
                    defaultTime: DEFAULT_SLOT_TIMES.night,
                  },
                ].map((slot) => {
                  const currentVal =
                    settings.slotTimes?.[slot.key] || slot.defaultTime;
                  return (
                    <label
                      key={slot.key}
                      className="p-2.5 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700/80 flex items-center justify-between gap-2 hover:border-teal-500/50 transition-colors cursor-pointer"
                    >
                      <div className="flex items-center gap-2 min-w-0">
                        {slot.icon}
                        <span className="text-xs font-medium text-slate-700 dark:text-slate-300 truncate">
                          {slot.label}
                        </span>
                      </div>
                      <div className="flex items-center gap-1.5 shrink-0">
                        <span className="text-xs font-mono font-bold text-teal-700 dark:text-teal-300">
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
            <div className="flex items-center justify-between p-3 rounded-2xl bg-slate-50 dark:bg-slate-800/40 border border-slate-200 dark:border-slate-800">
              <div className="flex items-center gap-2.5">
                <div className="p-2 rounded-xl bg-slate-200/60 dark:bg-slate-700/60 text-slate-700 dark:text-slate-300">
                  <Vibrate className="w-4 h-4" />
                </div>
                <div>
                  <p className="text-xs font-semibold text-slate-900 dark:text-white">Haptic Vibration</p>
                  <p className="text-[11px] text-slate-500 dark:text-slate-400">Pulse device on alarms</p>
                </div>
              </div>
              <input
                type="checkbox"
                checked={settings.vibrateEnabled}
                onChange={(e) =>
                  onUpdateSettings({ ...settings, vibrateEnabled: e.target.checked })
                }
                className="w-4 h-4 accent-teal-600 rounded"
              />
            </div>

            {/* Reset Data */}
            <div className="pt-2 border-t border-slate-100 dark:border-slate-800">
              <button
                type="button"
                onClick={onResetData}
                className="w-full py-2.5 px-3 text-xs font-medium text-rose-600 dark:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-950/30 rounded-xl transition-colors flex items-center justify-center gap-1.5"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                Reset All Medications & Schedules
              </button>
            </div>
          </div>

          <div className="pt-3 border-t border-slate-100 dark:border-slate-800 flex justify-end">
            <button
              onClick={onClose}
              className="px-5 py-2 bg-teal-600 hover:bg-teal-700 text-white rounded-xl text-xs font-semibold transition-colors"
            >
              Done
            </button>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
