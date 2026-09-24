/**
 * PillPulse - Google Health Active Alarm & Routine Step Modal
 * Developer: Suhail Akhtar (https://suhail.top)
 */

import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Check, Clock, Volume2, VolumeX, ArrowRight, Pill } from 'lucide-react';
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
      setPulseScale((prev) => (prev === 1 ? 1.06 : 1));
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
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-black/60 overflow-y-auto">
        <motion.div
          initial={{ opacity: 0, y: 20, scale: 0.94 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: 15, scale: 0.94 }}
          transition={{ duration: 0.2, ease: 'easeOut' }}
          className="w-full max-w-sm bg-white dark:bg-[#1E1F20] rounded-[28px] p-5 sm:p-6 shadow-2xl border border-[#E0E3E7] dark:border-[#3C4043] flex flex-col relative overflow-hidden my-auto"
          role="dialog"
          aria-modal="true"
        >
          {/* Top header with alarm ringing status and mute */}
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <span className="relative flex h-2.5 w-2.5">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#FBBC04] opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-[#F29900]"></span>
              </span>
              <span className="text-[12px] font-medium text-[#B06000] dark:text-[#FBBC04]">
                Medication Due · {formatTime12h(dose.scheduledTime)}
              </span>
            </div>

            <button
              onClick={onMuteToggle}
              className="w-9 h-9 rounded-full hover:bg-[#F0F4F9] dark:hover:bg-[#282A2C] text-[#444746] dark:text-[#9AA0A6] transition-colors flex items-center justify-center cursor-pointer"
              title={isMuted ? 'Unmute alarm' : 'Mute alarm'}
              aria-label={isMuted ? 'Unmute alarm' : 'Mute alarm'}
            >
              {isMuted ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4 text-[#1A73E8] animate-pulse" />}
            </button>
          </div>

          {/* Routine Indicator if part of a routine */}
          {dose.routineName && (
            <div className="mb-4 p-3 rounded-[16px] bg-[#F0F4F9] dark:bg-[#282A2C] border border-[#E0E3E7] dark:border-[#3C4043] flex items-center justify-between">
              <div>
                <span
                  className="text-[11px] font-medium block"
                  style={{ color: 'var(--app-accent, #1A73E8)' }}
                >
                  {dose.routineName}
                </span>
                <span className="text-[12px] font-medium text-[#1F1F1F] dark:text-[#E3E3E3]">
                  Step {dose.stepIndex} of {dose.totalSteps}
                </span>
              </div>
              {dose.nextMedicineName && (
                <div
                  className="flex items-center gap-1 text-[11px] px-2.5 py-0.5 rounded-full font-medium"
                  style={{
                    color: 'var(--app-accent, #1A73E8)',
                    backgroundColor: 'var(--app-accent-subtle, #E8F0FE)',
                  }}
                >
                  <span>Next in {dose.nextStepGapMinutes || 5}m:</span>
                  <span className="font-medium">{dose.nextMedicineName}</span>
                </div>
              )}
            </div>
          )}

          {/* Medicine Card Hero */}
          <div className="text-center my-3">
            <motion.div
              style={{ scale: pulseScale }}
              className={`inline-flex items-center justify-center w-16 h-16 rounded-[20px] mb-3 shadow-xs ${colorStyle.bg} ${colorStyle.text} border ${colorStyle.border}`}
            >
              <Pill className="w-8 h-8 -rotate-45" />
            </motion.div>

            <h2 className="text-xl sm:text-2xl font-medium text-[#1F1F1F] dark:text-[#E3E3E3] tracking-normal font-sans">
              {dose.medicineName}
            </h2>
            <p className="text-[14px] font-medium text-[#444746] dark:text-[#9AA0A6] mt-0.5">
              {dose.dosage}
            </p>

            {dose.instructions && (
              <p className="text-[12px] text-[#1F1F1F] dark:text-[#E3E3E3] mt-2 px-3.5 py-1 rounded-full bg-[#F0F4F9] dark:bg-[#282A2C] inline-block max-w-xs border border-[#E0E3E7] dark:border-[#3C4043]">
                {dose.instructions}
              </p>
            )}
          </div>

          {/* Cascading Next Pill Note */}
          {dose.nextMedicineName && (
            <div className="mt-1 mb-4 text-center text-[12px] text-[#444746] dark:text-[#9AA0A6] flex items-center justify-center gap-1">
              <span>Taking this starts a {dose.nextStepGapMinutes || 5}m timer for</span>
              <span className="font-medium text-[#1F1F1F] dark:text-[#E3E3E3]">{dose.nextMedicineName}</span>
              <ArrowRight className="w-3.5 h-3.5" style={{ color: 'var(--app-accent, #1A73E8)' }} />
            </div>
          )}

          {/* Action Buttons */}
          <div className="mt-3 space-y-2">
            <button
              onClick={() => onTake(dose)}
              className="w-full py-3.5 px-5 bg-[#1E8E3E] hover:bg-[#188038] active:scale-[0.98] text-white font-medium text-[15px] rounded-full shadow-xs transition-all flex items-center justify-center gap-2 cursor-pointer"
            >
              <Check className="w-4 h-4 stroke-[3]" />
              Mark as Taken
            </button>

            <div className="grid grid-cols-2 gap-2">
              <button
                onClick={() => onSnooze(dose, 5)}
                className="py-2.5 px-3 bg-[#F0F4F9] dark:bg-[#282A2C] hover:bg-[#E0E3E7] dark:hover:bg-[#3C4043] text-[#1F1F1F] dark:text-[#E3E3E3] font-medium text-[13px] rounded-full transition-colors flex items-center justify-center gap-1.5 cursor-pointer active:scale-95"
              >
                <Clock className="w-3.5 h-3.5 text-[#B06000] dark:text-[#FBBC04]" />
                Snooze 5m
              </button>
              <button
                onClick={() => onSkip(dose)}
                className="py-2.5 px-3 text-[#444746] dark:text-[#9AA0A6] hover:text-[#EA4335] font-medium text-[13px] rounded-full transition-colors cursor-pointer"
              >
                Skip Dose
              </button>
            </div>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
