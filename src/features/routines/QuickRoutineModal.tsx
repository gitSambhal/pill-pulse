/**
 * PillPulse - Cascading Routine Setup Wizard
 * Supports: Clear start time configuration, No gap (take together 0m),
 * equal gaps (5m), custom gaps per medicine, Escape key shortcut, and relaxed UI
 * Developer: Suhail Akhtar (https://suhail.top)
 */

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  X,
  Plus,
  Trash2,
  Clock,
  Sparkles,
  Check,
  ArrowRight,
  Layers,
  Zap,
  Sliders,
  CalendarCheck2,
} from 'lucide-react';
import { TimeSlot } from '../../types';
import { getSlotDefaultTime, formatTime12h, addMinutesToTime } from '../../utils';
import { storageService, DEFAULT_SLOT_TIMES } from '../../services/storageService';
import { getSlotIcon, SlotTimingBadge } from '../../components/SlotTimingBadge';

export interface MedicineDraft {
  name: string;
  dosage: string;
  instructions: string;
  gapFromPrevious: number; // 0 for Step 1; for step 2 & 3: 0 (together), 5, 10, 15, 30, etc.
}

interface QuickRoutineModalProps {
  isOpen: boolean;
  onClose: () => void;
  onCreate: (payload: {
    routineName: string;
    slots: { slot: TimeSlot; time: string }[];
    medicines: MedicineDraft[];
  }) => void;
}

const COMMON_GAPS = [
  { label: '0m (Together)', value: 0 },
  { label: '5 min', value: 5 },
  { label: '10 min', value: 10 },
  { label: '15 min', value: 15 },
  { label: '30 min', value: 30 },
];

const PRESETS = [
  {
    name: 'Morning Staggered Stack (0m + 30m)',
    description: 'Pill 1 & 2 taken together, then 30 min wait before Pill 3 (with breakfast)',
    slots: ['morning'] as TimeSlot[],
    startTime: '08:00',
    medicines: [
      { name: 'Thyroid Hormone', dosage: '50 mcg', instructions: 'Empty stomach with water', gapFromPrevious: 0 },
      { name: 'Electrolyte Hydration', dosage: '1 tablet', instructions: 'Take together with Thyroid', gapFromPrevious: 0 },
      { name: 'Multivitamin & Omega-3', dosage: '1 capsule', instructions: 'Take 30m later with breakfast', gapFromPrevious: 30 },
    ],
  },
  {
    name: 'No Gap Combo (Take All 3 Together)',
    description: 'All 3 medicines taken at the exact same time without any wait interval (0 min gap)',
    slots: ['morning'] as TimeSlot[],
    startTime: '08:00',
    medicines: [
      { name: 'Blood Pressure Med', dosage: '10 mg', instructions: 'Take with morning water', gapFromPrevious: 0 },
      { name: 'Vitamin D3', dosage: '2000 IU', instructions: 'Take together', gapFromPrevious: 0 },
      { name: 'Zinc Supplement', dosage: '15 mg', instructions: 'Take together', gapFromPrevious: 0 },
    ],
  },
  {
    name: 'Standard 5-Min Cascade (5m + 5m)',
    description: '3 medicines staggered 5 minutes apart to avoid pill burden',
    slots: ['morning'] as TimeSlot[],
    startTime: '08:00',
    medicines: [
      { name: 'Levothyroxine', dosage: '50 mcg', instructions: 'Empty stomach', gapFromPrevious: 0 },
      { name: 'Vitamin D3', dosage: '2000 IU', instructions: '5 mins later', gapFromPrevious: 5 },
      { name: 'Omega-3', dosage: '1000 mg', instructions: '5 mins later', gapFromPrevious: 5 },
    ],
  },
  {
    name: 'Custom 3-Times Daily (5m + 15m)',
    description: 'Digestive pill, wait 5m for primary med, wait 15m for post-meal supplement',
    slots: ['morning', 'afternoon', 'evening'] as TimeSlot[],
    startTime: '08:00',
    medicines: [
      { name: 'Digestive Enzyme', dosage: '1 tablet', instructions: 'Pre-meal', gapFromPrevious: 0 },
      { name: 'Primary Prescription', dosage: '500 mg', instructions: '5m later', gapFromPrevious: 5 },
      { name: 'Probiotic Supplement', dosage: '1 capsule', instructions: '15m later after eating', gapFromPrevious: 15 },
    ],
  },
];

const QUICK_START_TIMES = [
  { label: '07:00 AM', time: '07:00' },
  { label: '08:00 AM', time: '08:00' },
  { label: '09:00 AM', time: '09:00' },
  { label: '12:30 PM', time: '12:30' },
  { label: '06:30 PM', time: '18:30' },
  { label: '08:00 PM', time: '20:00' },
];

export const QuickRoutineModal: React.FC<QuickRoutineModalProps> = ({
  isOpen,
  onClose,
  onCreate,
}) => {
  const [routineName, setRoutineName] = useState('Morning Medication Routine');

  // Slot custom times initialized from user's settings or defaults
  const userSettings = storageService.getSettings();
  const configuredSlotTimes = userSettings.slotTimes || DEFAULT_SLOT_TIMES;

  // Primary Start Time for first pill
  const [primaryStartTime, setPrimaryStartTime] = useState<string>(
    configuredSlotTimes.morning || '08:00'
  );

  // Selected slots
  const [selectedSlots, setSelectedSlots] = useState<{ [key in TimeSlot]?: boolean }>({
    morning: true,
    afternoon: false,
    evening: false,
    night: false,
  });

  // Slot custom times
  const [slotTimes, setSlotTimes] = useState<Record<TimeSlot, string>>({
    morning: configuredSlotTimes.morning || '08:00',
    afternoon: configuredSlotTimes.afternoon || '13:00',
    evening: configuredSlotTimes.evening || '19:00',
    night: configuredSlotTimes.night || '22:00',
    custom: '12:00',
  });

  // Medicines Draft (default 3 medicines)
  const [medicines, setMedicines] = useState<MedicineDraft[]>([
    { name: '', dosage: '1 tablet', instructions: 'First medicine', gapFromPrevious: 0 },
    { name: '', dosage: '1 capsule', instructions: 'Take next', gapFromPrevious: 5 },
    { name: '', dosage: '1 pill', instructions: 'Take next', gapFromPrevious: 5 },
  ]);

  // Support Escape key to close & re-sync settings on open
  useEffect(() => {
    if (!isOpen) return;
    const current = storageService.getSettings();
    const st = current.slotTimes || DEFAULT_SLOT_TIMES;
    setSlotTimes({
      morning: st.morning || '08:00',
      afternoon: st.afternoon || '13:00',
      evening: st.evening || '19:00',
      night: st.night || '22:00',
      custom: '12:00',
    });
    setPrimaryStartTime(st.morning || '08:00');

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  const toggleSlot = (slot: TimeSlot) => {
    setSelectedSlots((prev) => ({
      ...prev,
      [slot]: !prev[slot],
    }));
  };

  const handleApplyPreset = (preset: typeof PRESETS[0]) => {
    setRoutineName(preset.name);
    setPrimaryStartTime(preset.startTime || '08:00');
    const newSlots: { [key in TimeSlot]?: boolean } = {};
    preset.slots.forEach((s) => {
      newSlots[s] = true;
    });
    setSelectedSlots(newSlots);
    setMedicines(preset.medicines);
  };

  const handleSetAllGaps = (gapMinutes: number) => {
    setMedicines((prev) =>
      prev.map((med, idx) => ({
        ...med,
        gapFromPrevious: idx === 0 ? 0 : gapMinutes,
      }))
    );
  };

  const handleAddMedicineRow = () => {
    setMedicines((prev) => [
      ...prev,
      {
        name: '',
        dosage: '1 pill',
        instructions: `Step ${prev.length + 1}`,
        gapFromPrevious: 5,
      },
    ]);
  };

  const handleRemoveMedicineRow = (index: number) => {
    if (medicines.length <= 1) return;
    setMedicines((prev) => prev.filter((_, i) => i !== index));
  };

  const handleMedicineChange = <K extends keyof MedicineDraft>(
    index: number,
    field: K,
    value: MedicineDraft[K]
  ) => {
    setMedicines((prev) => {
      const next = [...prev];
      next[index] = { ...next[index], [field]: value };
      return next;
    });
  };

  // Calculate cumulative offsets for timeline preview
  let cumulativeMinutes = 0;
  const stepOffsets = medicines.map((m, idx) => {
    if (idx > 0) {
      cumulativeMinutes += m.gapFromPrevious;
    }
    return cumulativeMinutes;
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const activeSlots = (Object.keys(selectedSlots) as TimeSlot[]).filter(
      (slot) => selectedSlots[slot]
    );

    if (activeSlots.length === 0) {
      alert('Please select at least one time slot (e.g. Morning, Afternoon, or Evening).');
      return;
    }

    const validMeds = medicines.filter((m) => m.name.trim().length > 0);
    if (validMeds.length === 0) {
      alert('Please enter at least one medicine name.');
      return;
    }

    const formattedSlots = activeSlots.map((slot) => {
      // If only 1 slot is active, use the prominent primaryStartTime
      const timeToUse =
        activeSlots.length === 1 ? primaryStartTime : slotTimes[slot] || primaryStartTime;
      return {
        slot,
        time: timeToUse,
      };
    });

    onCreate({
      routineName: routineName.trim() || 'Medication Routine',
      slots: formattedSlots,
      medicines: validMeds,
    });
    onClose();
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-slate-950/70 backdrop-blur-xs overflow-y-auto"
          onClick={onClose}
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.96, y: 15 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.96 }}
            className="w-full max-w-2xl bg-white dark:bg-slate-900 rounded-3xl p-6 sm:p-7 shadow-2xl border border-slate-200/80 dark:border-slate-800 my-auto flex flex-col max-h-[90vh]"
            role="dialog"
            aria-modal="true"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header */}
            <div className="flex items-center justify-between pb-4 border-b border-slate-100 dark:border-slate-800 shrink-0">
              <div className="flex items-center gap-3">
                <div className="p-2.5 rounded-2xl bg-teal-50 dark:bg-teal-950/50 text-teal-600 dark:text-teal-400">
                  <Layers className="w-5 h-5" />
                </div>
                <div>
                  <h2 className="text-base sm:text-lg font-bold text-slate-900 dark:text-white tracking-tight">
                    Medication Routine Setup
                  </h2>
                  <p className="text-xs text-slate-500 dark:text-slate-400">
                    Set start time, intervals, and medicines in sequence
                  </p>
                </div>
              </div>
              <button
                onClick={onClose}
                className="p-2 rounded-xl text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
                title="Close (Esc)"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="overflow-y-auto px-1 sm:px-2.5 py-5 space-y-6 flex-1">
              {/* 1. Dedicated Starting Time Section */}
              <div className="p-4 sm:p-5 rounded-2xl bg-teal-50/50 dark:bg-teal-950/30 border border-teal-100 dark:border-teal-900/50 space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Clock className="w-4 h-4 text-teal-600 dark:text-teal-400" />
                    <span className="text-xs font-bold uppercase tracking-wider text-teal-900 dark:text-teal-200">
                      1. Choose Starting Time
                    </span>
                  </div>
                  <span className="text-xs font-mono font-bold text-teal-700 dark:text-teal-300 bg-white dark:bg-slate-900 px-3 py-1 rounded-xl shadow-xs border border-teal-200/50 dark:border-teal-800/50">
                    {formatTime12h(primaryStartTime)}
                  </span>
                </div>

                {/* Native Large Time Picker Input */}
                <div>
                  <label className="block relative cursor-pointer">
                    <span className="block text-[11px] font-medium text-slate-600 dark:text-slate-400 mb-1.5">
                      First Pill Scheduled At:
                    </span>
                    <div className="flex items-center gap-2.5 px-4 py-2.5 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 hover:border-teal-500 transition-colors shadow-xs">
                      <Clock className="w-4 h-4 text-teal-500 shrink-0" />
                      <input
                        type="time"
                        value={primaryStartTime}
                        onChange={(e) => {
                          setPrimaryStartTime(e.target.value);
                          setSlotTimes((prev) => ({
                            ...prev,
                            morning: e.target.value,
                          }));
                        }}
                        className="bg-transparent text-sm font-semibold font-mono text-slate-900 dark:text-white w-full focus:outline-none cursor-pointer"
                        required
                      />
                    </div>
                  </label>
                </div>

                {/* Quick Time Preset Chips */}
                <div>
                  <span className="block text-[11px] text-slate-600 dark:text-slate-400 mb-2 font-medium">
                    Quick starting times:
                  </span>
                  <div className="flex items-center gap-2 flex-wrap">
                    {QUICK_START_TIMES.map((qt) => (
                      <button
                        key={qt.time}
                        type="button"
                        onClick={() => {
                          setPrimaryStartTime(qt.time);
                          setSlotTimes((prev) => ({
                            ...prev,
                            morning: qt.time,
                          }));
                        }}
                        className={`px-3 py-1.5 rounded-xl text-xs font-mono transition-all ${
                          primaryStartTime === qt.time
                            ? 'bg-teal-600 text-white font-bold shadow-xs scale-102'
                            : 'bg-white dark:bg-slate-900 text-slate-600 dark:text-slate-400 border border-slate-200 dark:border-slate-800 hover:border-teal-500'
                        }`}
                      >
                        {qt.label}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Time Slots (Morning, Afternoon, Evening, Night) with custom times */}
                <div className="pt-3 border-t border-teal-100 dark:border-teal-900/40">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-[11px] font-semibold text-slate-700 dark:text-slate-300">
                      Slot Times & Frequency:
                    </span>
                    <span className="text-[10px] text-slate-500 dark:text-slate-400">
                      Tap time to customize
                    </span>
                  </div>
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 sm:gap-3">
                    {(['morning', 'afternoon', 'evening', 'night'] as TimeSlot[]).map((slot) => {
                      const isSelected = !!selectedSlots[slot];
                      const currentTime =
                        slotTimes[slot] || (slot === 'morning' ? primaryStartTime : '12:00');
                      return (
                        <div
                          key={slot}
                          className={`p-3 rounded-2xl border transition-all text-xs flex flex-col justify-between gap-2 ${
                            isSelected
                              ? 'border-teal-500 bg-white dark:bg-slate-900 text-teal-900 dark:text-teal-100 font-semibold shadow-xs ring-1 ring-teal-500/20'
                              : 'border-slate-200 dark:border-slate-800 bg-white/50 dark:bg-slate-900/40 text-slate-500 dark:text-slate-400'
                          }`}
                        >
                          <div
                            onClick={() => toggleSlot(slot)}
                            className="flex items-center justify-between cursor-pointer select-none"
                          >
                            <div className="flex items-center gap-1.5 min-w-0">
                              <span
                                className={
                                  slot === 'morning'
                                    ? 'text-amber-500'
                                    : slot === 'afternoon'
                                    ? 'text-orange-500'
                                    : slot === 'evening'
                                    ? 'text-rose-500'
                                    : 'text-indigo-400'
                                }
                              >
                                {getSlotIcon(slot, 'w-3.5 h-3.5')}
                              </span>
                              <span className="capitalize font-bold truncate">{slot}</span>
                            </div>
                            <div
                              className={`w-4 h-4 rounded-full flex items-center justify-center text-[10px] shrink-0 ${
                                isSelected
                                  ? 'bg-teal-600 text-white'
                                  : 'border border-slate-300 dark:border-slate-700'
                              }`}
                            >
                              {isSelected && <Check className="w-2.5 h-2.5 stroke-[3]" />}
                            </div>
                          </div>

                          {/* Inline Custom Time Picker for this slot */}
                          <label
                            className={`relative flex items-center justify-between gap-1 px-2.5 py-1.5 rounded-xl text-[11px] font-mono cursor-pointer transition-colors ${
                              isSelected
                                ? 'bg-teal-50 dark:bg-teal-950/60 text-teal-700 dark:text-teal-300 hover:bg-teal-100 dark:hover:bg-teal-900/40'
                                : 'bg-slate-100/70 dark:bg-slate-800/50 text-slate-400 opacity-60'
                            }`}
                            title={`Set custom time for ${slot}`}
                          >
                            <span>{formatTime12h(currentTime)}</span>
                            <Clock className="w-3 h-3 opacity-70 shrink-0" />
                            <input
                              type="time"
                              value={currentTime}
                              disabled={!isSelected}
                              onChange={(e) => {
                                const newTime = e.target.value;
                                setSlotTimes((prev) => ({ ...prev, [slot]: newTime }));
                                if (slot === 'morning') {
                                  setPrimaryStartTime(newTime);
                                }
                              }}
                              className="absolute inset-0 opacity-0 cursor-pointer w-full h-full disabled:cursor-not-allowed"
                            />
                          </label>
                        </div>
                      );
                    })}
                  </div>
                </div>
              </div>

              {/* 2. Regimen Name & 1-Click Templates */}
              <div className="p-4 sm:p-5 rounded-2xl bg-slate-50/70 dark:bg-slate-800/40 border border-slate-200/80 dark:border-slate-800 space-y-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
                    Routine Name
                  </label>
                  <input
                    type="text"
                    value={routineName}
                    onChange={(e) => setRoutineName(e.target.value)}
                    placeholder="e.g. Morning Medication Stack"
                    className="w-full px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-slate-900 dark:text-white text-sm focus:outline-none focus:ring-2 focus:ring-teal-500 transition-all shadow-xs"
                    required
                  />
                </div>

                {/* Ready-made Regimen Presets */}
                <div>
                  <span className="text-[11px] font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400 flex items-center gap-1.5 mb-2">
                    <Sparkles className="w-3.5 h-3.5 text-amber-500" />
                    Popular 1-Click Regimen Templates
                  </span>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                    {PRESETS.map((preset, idx) => (
                      <button
                        key={idx}
                        type="button"
                        onClick={() => handleApplyPreset(preset)}
                        className="text-left p-3 rounded-2xl border border-slate-200/80 dark:border-slate-800 bg-white dark:bg-slate-900 hover:border-teal-500 hover:bg-teal-50/30 dark:hover:bg-teal-950/20 transition-all text-xs shadow-xs"
                      >
                        <p className="font-semibold text-slate-900 dark:text-white truncate">{preset.name}</p>
                        <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-1 line-clamp-1">
                          {preset.description}
                        </p>
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              {/* 3. Quick Global Gap Presets */}
              <div className="p-4 sm:p-5 rounded-2xl bg-slate-100/80 dark:bg-slate-800/60 border border-slate-200/70 dark:border-slate-700/70 space-y-2">
                <span className="text-xs font-semibold text-slate-700 dark:text-slate-300 block">
                  Set Gap for All Next Pills:
                </span>
                <div className="flex items-center gap-2 flex-wrap">
                  <button
                    type="button"
                    onClick={() => handleSetAllGaps(0)}
                    className="px-3 py-1.5 rounded-xl text-xs font-semibold bg-white dark:bg-slate-900 text-teal-700 dark:text-teal-300 border border-slate-300 dark:border-slate-700 hover:border-teal-500 transition-colors flex items-center gap-1 shadow-xs"
                  >
                    <Zap className="w-3.5 h-3.5" />
                    No Gap (Take Together 0m)
                  </button>
                  <button
                    type="button"
                    onClick={() => handleSetAllGaps(5)}
                    className="px-3 py-1.5 rounded-xl text-xs font-semibold bg-white dark:bg-slate-900 text-slate-700 dark:text-slate-300 border border-slate-300 dark:border-slate-700 hover:border-teal-500 transition-colors shadow-xs"
                  >
                    5m Gap
                  </button>
                  <button
                    type="button"
                    onClick={() => handleSetAllGaps(10)}
                    className="px-3 py-1.5 rounded-xl text-xs font-semibold bg-white dark:bg-slate-900 text-slate-700 dark:text-slate-300 border border-slate-300 dark:border-slate-700 hover:border-teal-500 transition-colors shadow-xs"
                  >
                    10m Gap
                  </button>
                  <button
                    type="button"
                    onClick={() => handleSetAllGaps(15)}
                    className="px-3 py-1.5 rounded-xl text-xs font-semibold bg-white dark:bg-slate-900 text-slate-700 dark:text-slate-300 border border-slate-300 dark:border-slate-700 hover:border-teal-500 transition-colors shadow-xs"
                  >
                    15m Gap
                  </button>
                </div>
              </div>

              {/* 4. Medicines List with Per-Medicine Gaps */}
              <div className="space-y-3">
                <div className="flex items-center justify-between mb-1">
                  <label className="text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400">
                    Medicines in Sequence
                  </label>
                  <button
                    type="button"
                    onClick={handleAddMedicineRow}
                    className="inline-flex items-center gap-1.5 text-xs font-semibold text-teal-600 dark:text-teal-400 hover:underline px-2 py-1 rounded-lg hover:bg-teal-50 dark:hover:bg-teal-950/50 transition-colors"
                  >
                    <Plus className="w-4 h-4" />
                    Add Another Pill
                  </button>
                </div>

                <div className="space-y-3.5">
                  {medicines.map((med, index) => {
                    const isFirst = index === 0;
                    const offset = stepOffsets[index];
                    const calculatedTime = addMinutesToTime(primaryStartTime, offset);

                    return (
                      <div
                        key={index}
                        className="p-4 sm:p-5 rounded-2xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-800 space-y-3 shadow-xs"
                      >
                        {/* Step Header & Calculated Time */}
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-2.5">
                            <span className="w-6 h-6 rounded-full bg-teal-600 text-white font-bold text-xs flex items-center justify-center shadow-xs">
                              {index + 1}
                            </span>
                            <span className="text-xs font-bold text-slate-900 dark:text-white">
                              {isFirst ? 'First Medicine' : `Medicine ${index + 1}`}
                            </span>
                          </div>

                          <div className="flex items-center gap-2">
                            <span className="text-xs font-mono font-bold text-teal-700 dark:text-teal-300 bg-white dark:bg-slate-900 px-2.5 py-1 rounded-lg border border-slate-200 dark:border-slate-800 shadow-xs">
                              {formatTime12h(calculatedTime)}
                            </span>

                            {medicines.length > 1 && (
                              <button
                                type="button"
                                onClick={() => handleRemoveMedicineRow(index)}
                                className="text-slate-400 hover:text-rose-500 transition-colors p-1.5 rounded-lg hover:bg-slate-200/50 dark:hover:bg-slate-700/50"
                                title="Remove pill"
                              >
                                <Trash2 className="w-4 h-4" />
                              </button>
                            )}
                          </div>
                        </div>

                        {/* Name & Dosage */}
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                          <div>
                            <input
                              type="text"
                              placeholder="Medicine name *"
                              value={med.name}
                              onChange={(e) =>
                                handleMedicineChange(index, 'name', e.target.value)
                              }
                              className="w-full px-3.5 py-2.5 text-xs rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-teal-500"
                              required
                            />
                          </div>
                          <div>
                            <input
                              type="text"
                              placeholder="Dosage (e.g. 50mcg, 1 tablet)"
                              value={med.dosage}
                              onChange={(e) =>
                                handleMedicineChange(index, 'dosage', e.target.value)
                              }
                              className="w-full px-3.5 py-2.5 text-xs rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-teal-500"
                            />
                          </div>
                        </div>

                        {/* Instructions */}
                        <input
                          type="text"
                          placeholder="Instructions (e.g. With water, Empty stomach)"
                          value={med.instructions}
                          onChange={(e) =>
                            handleMedicineChange(index, 'instructions', e.target.value)
                          }
                          className="w-full px-3.5 py-2 text-xs rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-teal-500"
                        />

                        {/* Per-Medicine Gap Selector (For step 2 and beyond) */}
                        {!isFirst && (
                          <div className="pt-2.5 border-t border-slate-200/70 dark:border-slate-700/70 space-y-2">
                            <div className="flex items-center justify-between">
                              <span className="text-[11px] font-semibold text-slate-600 dark:text-slate-400">
                                Gap after Step {index}:
                              </span>
                              <span className="text-[11px] font-bold text-teal-600 dark:text-teal-400">
                                {med.gapFromPrevious === 0
                                  ? 'Take together (0m)'
                                  : `+${med.gapFromPrevious} min wait`}
                              </span>
                            </div>

                            <div className="flex items-center gap-2 flex-wrap">
                              {COMMON_GAPS.map((gap) => (
                                <button
                                  key={gap.value}
                                  type="button"
                                  onClick={() =>
                                    handleMedicineChange(index, 'gapFromPrevious', gap.value)
                                  }
                                  className={`px-2.5 py-1.5 rounded-lg text-xs transition-colors ${
                                    med.gapFromPrevious === gap.value
                                      ? 'bg-teal-600 text-white font-bold shadow-xs'
                                      : 'bg-white dark:bg-slate-900 text-slate-600 dark:text-slate-400 border border-slate-200 dark:border-slate-700 hover:border-teal-500'
                                  }`}
                                >
                                  {gap.label}
                                </button>
                              ))}
                              <div className="flex items-center gap-1.5 ml-auto">
                                <input
                                  type="number"
                                  min="0"
                                  max="180"
                                  value={med.gapFromPrevious}
                                  onChange={(e) =>
                                    handleMedicineChange(
                                      index,
                                      'gapFromPrevious',
                                      Math.max(0, parseInt(e.target.value, 10) || 0)
                                    )
                                  }
                                  className="w-14 px-2 py-1 text-xs text-center rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 font-mono"
                                />
                                <span className="text-[11px] text-slate-400">min</span>
                              </div>
                            </div>
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* 5. Live Visual Pipeline Preview */}
              <div className="p-4 sm:p-5 rounded-2xl bg-teal-50/60 dark:bg-teal-950/40 border border-teal-200/60 dark:border-teal-900/40 space-y-2.5">
                <span className="text-xs font-bold text-teal-900 dark:text-teal-200 block">
                  Regimen Timeline Preview:
                </span>
                <div className="flex items-center gap-2.5 overflow-x-auto pb-1 text-xs">
                  {medicines.map((m, idx) => {
                    const offset = stepOffsets[idx];
                    const calculatedTime = addMinutesToTime(primaryStartTime, offset);
                    return (
                      <React.Fragment key={idx}>
                        <div className="shrink-0 p-2.5 rounded-xl bg-white dark:bg-slate-900 border border-teal-200 dark:border-teal-800 text-center min-w-[100px] shadow-xs">
                          <span className="text-[10px] font-bold text-teal-600 dark:text-teal-400 block">
                            Step {idx + 1}
                          </span>
                          <span className="font-bold text-slate-900 dark:text-white truncate block text-[11px]">
                            {m.name || `Pill ${idx + 1}`}
                          </span>
                          <span className="text-[10px] font-mono text-slate-500 dark:text-slate-400">
                            {formatTime12h(calculatedTime)}
                          </span>
                        </div>
                        {idx < medicines.length - 1 && (
                          <div className="shrink-0 flex flex-col items-center">
                            <span className="text-[10px] font-bold text-teal-600 dark:text-teal-400">
                              {medicines[idx + 1].gapFromPrevious === 0
                                ? '+0m'
                                : `+${medicines[idx + 1].gapFromPrevious}m`}
                            </span>
                            <ArrowRight className="w-3.5 h-3.5 text-teal-400" />
                          </div>
                        )}
                      </React.Fragment>
                    );
                  })}
                </div>
              </div>

              {/* Submit & Cancel Actions */}
              <div className="pt-4 border-t border-slate-100 dark:border-slate-800 flex items-center justify-end gap-3 shrink-0">
                <button
                  type="button"
                  onClick={onClose}
                  className="py-2.5 px-4 text-xs font-semibold text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-xl transition-colors min-h-[42px]"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="py-2.5 px-5 bg-teal-600 hover:bg-teal-700 text-white font-semibold text-xs rounded-xl shadow-xs hover:shadow-teal-500/20 transition-all flex items-center gap-1.5 min-h-[42px]"
                >
                  <Check className="w-4 h-4" />
                  Create Routine Stack
                </button>
              </div>
            </form>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};
