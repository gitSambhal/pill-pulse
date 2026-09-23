/**
 * PillPulse - Active Alarm & Routine Step Modal
 * Developer: Suhail Akhtar (https://suhail.top)
 */

import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { BellRing, Check, Clock, Volume2, VolumeX, ArrowRight, Pill } from 'lucide-react';
import { ScheduledDose } from '../types';
import { formatTime12h, getPillColorClasses } from '../utils';

interface ActiveAlarmModalProps {
  dose: ScheduledDose | null;
  onTake: (dose: ScheduledDose) => void;
  onSnooze: (dose: ScheduledDose, minutes: number) => void;
  onSkip: (dose: ScheduledDose) => void;
  onMuteToggle: () => void;
  isMuted: boolean;
}

export const ActiveAlarmModal: React.FC<ActiveAlarmModalProps> = ({
  dose,
  onTake,
  onSnooze,
  onSkip,
  onMuteToggle,
  isMuted,
}) => {
  const [pulseScale, setPulseScale] = useState(1);

  useEffect(() => {
    if (!dose) return;
    const interval = setInterval(() => {
      setPulseScale((prev) => (prev === 1 ? 1.08 : 1));
    }, 900);
    return () => clearInterval(interval);
  }, [dose]);

  useEffect(() => {
    if (!dose) return;
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onSnooze(dose, 5);
      }
    };
    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, [dose, onSnooze]);

  if (!dose) return null;

  const colorStyle = getPillColorClasses(dose.color);

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md">
        <motion.div
          initial={{ opacity: 0, y: 50, scale: 0.95 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: 50, scale: 0.95 }}
          transition={{ type: 'spring', damping: 24, stiffness: 280 }}
          className="w-full max-w-md bg-white dark:bg-slate-900 rounded-3xl p-6 sm:p-7 shadow-2xl border border-slate-200 dark:border-slate-800 flex flex-col relative overflow-hidden"
          role="dialog"
          aria-modal="true"
        >
          {/* Subtle colored glow top bar */}
          <div className="absolute top-0 left-0 right-0 h-1.5 bg-linear-to-r from-teal-500 via-sky-500 to-indigo-500" />

          {/* Top header with alarm ringing status and mute */}
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <span className="relative flex h-3 w-3">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-teal-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-3 w-3 bg-teal-500"></span>
              </span>
              <span className="text-xs font-semibold tracking-wider uppercase text-teal-600 dark:text-teal-400">
                Alarm Ringing · {formatTime12h(dose.scheduledTime)}
              </span>
            </div>

            <button
              onClick={onMuteToggle}
              className="p-2 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white transition-colors"
              title={isMuted ? 'Unmute alarm' : 'Mute alarm'}
              aria-label={isMuted ? 'Unmute alarm' : 'Mute alarm'}
            >
              {isMuted ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4 text-teal-500 animate-pulse" />}
            </button>
          </div>

          {/* Routine Indicator if part of a routine */}
          {dose.routineName && (
            <div className="mb-4 p-3 rounded-2xl bg-teal-50 dark:bg-teal-950/40 border border-teal-100 dark:border-teal-900/60 flex items-center justify-between">
              <div>
                <span className="text-[11px] font-medium text-teal-700 dark:text-teal-300 uppercase tracking-wider block">
                  {dose.routineName}
                </span>
                <span className="text-xs font-semibold text-slate-800 dark:text-slate-200">
                  Step {dose.stepIndex} of {dose.totalSteps}
                </span>
              </div>
              {dose.nextMedicineName && (
                <div className="flex items-center gap-1.5 text-xs text-teal-700 dark:text-teal-300 bg-teal-100 dark:bg-teal-900/60 px-2.5 py-1 rounded-xl">
                  <span>Next in {dose.nextStepGapMinutes || 5}m:</span>
                  <span className="font-semibold">{dose.nextMedicineName}</span>
                </div>
              )}
            </div>
          )}

          {/* Medicine Card Hero */}
          <div className="text-center my-3">
            <motion.div
              style={{ scale: pulseScale }}
              className={`inline-flex items-center justify-center w-20 h-20 rounded-3xl mb-3 shadow-lg ${colorStyle.bg} ${colorStyle.text} border ${colorStyle.border}`}
            >
              <Pill className="w-10 h-10" />
            </motion.div>

            <h2 className="text-2xl font-bold text-slate-900 dark:text-white tracking-tight">
              {dose.medicineName}
            </h2>
            <p className="text-sm font-semibold text-teal-600 dark:text-teal-400 mt-0.5">
              {dose.dosage}
            </p>

            {dose.instructions && (
              <p className="text-xs text-slate-600 dark:text-slate-400 mt-2 px-4 py-1.5 rounded-xl bg-slate-100 dark:bg-slate-800/80 inline-block max-w-xs">
                {dose.instructions}
              </p>
            )}
          </div>

          {/* Cascading Next Pill Note */}
          {dose.nextMedicineName && (
            <div className="mt-2 mb-4 text-center text-xs text-slate-500 dark:text-slate-400 flex items-center justify-center gap-1.5">
              <span>Taking this starts a {dose.nextStepGapMinutes || 5}-min gap for</span>
              <span className="font-semibold text-slate-700 dark:text-slate-300">{dose.nextMedicineName}</span>
              <ArrowRight className="w-3 h-3 text-teal-500" />
            </div>
          )}

          {/* Action Buttons */}
          <div className="mt-3 space-y-2.5">
            <button
              onClick={() => onTake(dose)}
              className="w-full py-3.5 px-4 bg-teal-600 hover:bg-teal-700 active:scale-[0.98] text-white font-semibold text-base rounded-2xl shadow-lg shadow-teal-500/20 transition-all flex items-center justify-center gap-2"
            >
              <Check className="w-5 h-5 stroke-[2.5]" />
              Mark as Taken
            </button>

            <div className="grid grid-cols-2 gap-2.5">
              <button
                onClick={() => onSnooze(dose, 5)}
                className="py-2.5 px-3 bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 font-medium text-xs rounded-xl transition-colors flex items-center justify-center gap-1.5"
              >
                <Clock className="w-3.5 h-3.5 text-amber-500" />
                Snooze 5 mins
              </button>
              <button
                onClick={() => onSkip(dose)}
                className="py-2.5 px-3 text-slate-500 dark:text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 font-medium text-xs rounded-xl transition-colors"
              >
                Skip This Dose
              </button>
            </div>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
