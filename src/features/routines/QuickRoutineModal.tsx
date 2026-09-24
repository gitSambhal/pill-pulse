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
          className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-black/45 overflow-y-auto"
          onClick={onClose}
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.94, y: 12 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.94, y: 8 }}
            transition={{ duration: 0.18, ease: 'easeOut' }}
            className="w-full max-w-2xl bg-white dark:bg-[#1E1F20] rounded-[28px] p-5 sm:p-6 shadow-2xl border border-[#E0E3E7] dark:border-[#3C4043] my-auto flex flex-col max-h-[90vh]"
            role="dialog"
            aria-modal="true"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header */}
            <div className="flex items-center justify-between pb-4 border-b border-[#E0E3E7] dark:border-[#3C4043] shrink-0">
              <div className="flex items-center gap-3">
                <div
                  className="w-10 h-10 rounded-[14px] flex items-center justify-center shrink-0"
                  style={{
                    backgroundColor: 'var(--app-accent-subtle, #E8F0FE)',
                    color: 'var(--app-accent, #1A73E8)',
                  }}
                >
                  <Layers className="w-5 h-5" />
                </div>
                <div>
                  <h2 className="text-[18px] font-medium text-[#1F1F1F] dark:text-[#E3E3E3]">
                    Medication Routine Setup
                  </h2>
                  <p className="text-[12px] text-[#444746] dark:text-[#9AA0A6]">
                    Sequential schedule with custom timing intervals
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

            <form onSubmit={handleSubmit} className="overflow-y-auto px-0.5 sm:px-1 py-4 space-y-4 flex-1">
              {/* 1. Dedicated Starting Time Section */}
              <div className="p-4 rounded-2xl bg-[#F2F2F7] dark:bg-[#2C2C2E]/60 border border-[#E5E5EA] dark:border-[#2C2C2E] space-y-3.5">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Clock className="w-4 h-4 text-[#007AFF]" />
                    <span className="text-[12px] font-semibold uppercase tracking-wider text-black dark:text-white">
                      1. Starting Time
                    </span>
                  </div>
                  <span className="text-[12px] font-mono font-semibold text-[#007AFF] bg-white dark:bg-[#1C1C1E] px-2.5 py-1 rounded-full shadow-2xs border border-[#E5E5EA] dark:border-[#2C2C2E]">
                    {formatTime12h(primaryStartTime)}
                  </span>
                </div>

                {/* Native Time Picker Input */}
                <div>
                  <label className="block relative cursor-pointer">
                    <span className="block text-[12px] font-medium text-[#8E8E93] mb-1">
                      First Medicine Scheduled At:
                    </span>
                    <div className="flex items-center gap-2 px-3.5 py-2 rounded-xl bg-white dark:bg-[#1C1C1E] border border-transparent focus-within:border-[#007AFF] shadow-2xs">
                      <Clock className="w-4 h-4 text-[#007AFF] shrink-0" />
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
                        className="bg-transparent text-[14px] font-medium text-black dark:text-white w-full focus:outline-none cursor-pointer"
                        required
                      />
                    </div>
                  </label>
                </div>

                {/* Quick Time Preset Chips */}
                <div>
                  <span className="block text-[11px] text-[#8E8E93] mb-1.5 font-medium">
                    Quick times:
                  </span>
                  <div className="flex items-center gap-1.5 flex-wrap">
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
                        className={`px-3 py-1 rounded-full text-[12px] font-medium transition-all ${
                          primaryStartTime === qt.time
                            ? 'bg-[#007AFF] text-white font-semibold shadow-2xs'
                            : 'bg-white dark:bg-[#1C1C1E] text-[#8E8E93] border border-[#E5E5EA] dark:border-[#2C2C2E] hover:text-black dark:hover:text-white'
                        }`}
                      >
                        {qt.label}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Time Slots (Morning, Afternoon, Evening, Night) with custom times */}
                <div className="pt-3 border-t border-[#E5E5EA] dark:border-[#2C2C2E]">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-[12px] font-semibold text-black dark:text-white">
                      Time Slot Application:
                    </span>
                    <span className="text-[11px] text-[#8E8E93]">
                      Tap time to edit
                    </span>
                  </div>
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                    {(['morning', 'afternoon', 'evening', 'night'] as TimeSlot[]).map((slot) => {
                      const isSelected = !!selectedSlots[slot];
                      const currentTime =
                        slotTimes[slot] || (slot === 'morning' ? primaryStartTime : '12:00');
                      return (
                        <div
                          key={slot}
                          className={`p-2.5 rounded-xl border transition-all text-xs flex flex-col justify-between gap-1.5 ${
                            isSelected
                              ? 'border-[#007AFF] bg-white dark:bg-[#1C1C1E] text-black dark:text-white font-semibold shadow-2xs'
                              : 'border-transparent bg-white/60 dark:bg-[#1C1C1E]/60 text-[#8E8E93]'
                          }`}
                        >
                          <div
                            onClick={() => toggleSlot(slot)}
                            className="flex items-center justify-between cursor-pointer select-none"
                          >
                            <div className="flex items-center gap-1.5 min-w-0">
                              <span>
                                {getSlotIcon(slot, 'w-3.5 h-3.5')}
                              </span>
                              <span className="capitalize font-semibold truncate text-[12px]">{slot}</span>
                            </div>
                            <div
                              className={`w-4 h-4 rounded-full flex items-center justify-center text-[10px] shrink-0 ${
                                isSelected
                                  ? 'bg-[#007AFF] text-white'
                                  : 'border border-[#E5E5EA] dark:border-[#2C2C2E]'
                              }`}
                            >
                              {isSelected && <Check className="w-2.5 h-2.5 stroke-[3]" />}
                            </div>
                          </div>

                          {/* Inline Custom Time Picker for this slot */}
                          <label
                            className={`relative flex items-center justify-between gap-1 px-2 py-1 rounded-lg text-[11px] font-mono cursor-pointer transition-colors ${
                              isSelected
                                ? 'bg-[#F2F2F7] dark:bg-[#2C2C2E] text-[#007AFF]'
                                : 'bg-transparent text-[#8E8E93] opacity-60'
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

              {/* 2. Routine Name & Presets */}
              <div className="p-4 rounded-2xl bg-[#F2F2F7] dark:bg-[#2C2C2E]/60 border border-[#E5E5EA] dark:border-[#2C2C2E] space-y-3">
                <div>
                  <label className="block text-[13px] font-medium text-black dark:text-white mb-1.5">
                    Routine Name
                  </label>
                  <input
                    type="text"
                    value={routineName}
                    onChange={(e) => setRoutineName(e.target.value)}
                    placeholder="e.g. Morning Medication Routine"
                    className="w-full px-3.5 py-2.5 rounded-xl border border-transparent focus:border-[#007AFF] bg-white dark:bg-[#1C1C1E] text-black dark:text-white text-[14px] focus:outline-none transition-all shadow-2xs"
                    required
                  />
                </div>

                {/* Ready-made Regimen Presets */}
                <div>
                  <span className="text-[11px] font-semibold uppercase tracking-wider text-[#8E8E93] flex items-center gap-1.5 mb-2">
                    <Sparkles className="w-3.5 h-3.5 text-[#FF9500]" />
                    Presets
                  </span>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                    {PRESETS.map((preset, idx) => (
                      <button
                        key={idx}
                        type="button"
                        onClick={() => handleApplyPreset(preset)}
                        className="text-left p-3 rounded-xl border border-transparent hover:border-[#007AFF] bg-white dark:bg-[#1C1C1E] transition-all text-xs shadow-2xs active:scale-[0.99]"
                      >
                        <p className="font-semibold text-black dark:text-white truncate text-[13px]">{preset.name}</p>
                        <p className="text-[11px] text-[#8E8E93] mt-0.5 line-clamp-1">
                          {preset.description}
                        </p>
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              {/* 3. Quick Global Gap Presets */}
              <div className="p-3.5 rounded-2xl bg-[#F2F2F7] dark:bg-[#2C2C2E]/60 border border-[#E5E5EA] dark:border-[#2C2C2E] space-y-2">
                <span className="text-[12px] font-medium text-[#8E8E93] block">
                  Quick set intervals:
                </span>
                <div className="flex items-center gap-1.5 flex-wrap">
                  <button
                    type="button"
                    onClick={() => handleSetAllGaps(0)}
                    className="px-3 py-1 rounded-full text-[12px] font-semibold bg-white dark:bg-[#1C1C1E] text-[#007AFF] border border-[#E5E5EA] dark:border-[#2C2C2E] hover:border-[#007AFF] transition-colors flex items-center gap-1 shadow-2xs"
                  >
                    <Zap className="w-3.5 h-3.5" />
                    Together (0m)
                  </button>
                  <button
                    type="button"
                    onClick={() => handleSetAllGaps(5)}
                    className="px-3 py-1 rounded-full text-[12px] font-medium bg-white dark:bg-[#1C1C1E] text-black dark:text-white border border-[#E5E5EA] dark:border-[#2C2C2E] hover:border-[#007AFF] transition-colors shadow-2xs"
                  >
                    5m Gap
                  </button>
                  <button
                    type="button"
                    onClick={() => handleSetAllGaps(10)}
                    className="px-3 py-1 rounded-full text-[12px] font-medium bg-white dark:bg-[#1C1C1E] text-black dark:text-white border border-[#E5E5EA] dark:border-[#2C2C2E] hover:border-[#007AFF] transition-colors shadow-2xs"
                  >
                    10m Gap
                  </button>
                  <button
                    type="button"
                    onClick={() => handleSetAllGaps(15)}
                    className="px-3 py-1 rounded-full text-[12px] font-medium bg-white dark:bg-[#1C1C1E] text-black dark:text-white border border-[#E5E5EA] dark:border-[#2C2C2E] hover:border-[#007AFF] transition-colors shadow-2xs"
                  >
                    15m Gap
                  </button>
                </div>
              </div>

              {/* 4. Medicines List with Per-Medicine Gaps */}
              <div className="space-y-2.5">
                <div className="flex items-center justify-between mb-1">
                  <label className="text-[12px] font-semibold uppercase tracking-wider text-[#8E8E93]">
                    Medicines in Sequence
                  </label>
                  <button
                    type="button"
                    onClick={handleAddMedicineRow}
                    className="inline-flex items-center gap-1 text-[13px] font-semibold text-[#007AFF] hover:underline px-2 py-0.5"
                  >
                    <Plus className="w-3.5 h-3.5" />
                    Add Pill
                  </button>
                </div>

                <div className="space-y-2.5">
                  {medicines.map((med, index) => {
                    const isFirst = index === 0;
                    const offset = stepOffsets[index];
                    const calculatedTime = addMinutesToTime(primaryStartTime, offset);

                    return (
                      <div
                        key={index}
                        className="p-3.5 sm:p-4 rounded-2xl bg-white dark:bg-[#1C1C1E] border border-[#E5E5EA] dark:border-[#2C2C2E] space-y-2.5 shadow-2xs"
                      >
                        {/* Step Header & Calculated Time */}
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-2">
                            <span className="w-5 h-5 rounded-full bg-[#007AFF]/12 text-[#007AFF] font-bold text-[11px] flex items-center justify-center">
                              {index + 1}
                            </span>
                            <span className="text-[13px] font-semibold text-black dark:text-white">
                              {isFirst ? 'First Medicine' : `Medicine ${index + 1}`}
                            </span>
                          </div>

                          <div className="flex items-center gap-2">
                            <span className="text-[12px] font-mono font-semibold text-[#007AFF] bg-[#F2F2F7] dark:bg-[#2C2C2E] px-2.5 py-0.5 rounded-full">
                              {formatTime12h(calculatedTime)}
                            </span>

                            {medicines.length > 1 && (
                              <button
                                type="button"
                                onClick={() => handleRemoveMedicineRow(index)}
                                className="w-7 h-7 rounded-full text-[#FF3B30] hover:bg-[#FF3B30]/12 transition-colors flex items-center justify-center"
                                title="Remove"
                              >
                                <Trash2 className="w-3.5 h-3.5" />
                              </button>
                            )}
                          </div>
                        </div>

                        {/* Name & Dosage */}
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                          <div>
                            <input
                              type="text"
                              placeholder="Medicine name *"
                              value={med.name}
                              onChange={(e) =>
                                handleMedicineChange(index, 'name', e.target.value)
                              }
                              className="w-full px-3 py-2 text-[13px] rounded-xl border border-transparent focus:border-[#007AFF] bg-[#F2F2F7] dark:bg-[#2C2C2E] text-black dark:text-white focus:outline-none"
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
                              className="w-full px-3 py-2 text-[13px] rounded-xl border border-transparent focus:border-[#007AFF] bg-[#F2F2F7] dark:bg-[#2C2C2E] text-black dark:text-white focus:outline-none"
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
                          className="w-full px-3 py-2 text-[13px] rounded-xl border border-transparent focus:border-[#007AFF] bg-[#F2F2F7] dark:bg-[#2C2C2E] text-black dark:text-white focus:outline-none"
                        />

                        {/* Per-Medicine Gap Selector (For step 2 and beyond) */}
                        {!isFirst && (
                          <div className="pt-2 border-t border-[#E5E5EA] dark:border-[#2C2C2E] space-y-1.5">
                            <div className="flex items-center justify-between">
                              <span className="text-[11px] font-medium text-[#8E8E93]">
                                Gap after Step {index}:
                              </span>
                              <span className="text-[11px] font-semibold text-[#007AFF]">
                                {med.gapFromPrevious === 0
                                  ? 'Together (0m)'
                                  : `+${med.gapFromPrevious} min wait`}
                              </span>
                            </div>

                            <div className="flex items-center gap-1.5 flex-wrap">
                              {COMMON_GAPS.map((gap) => (
                                <button
                                  key={gap.value}
                                  type="button"
                                  onClick={() =>
                                    handleMedicineChange(index, 'gapFromPrevious', gap.value)
                                  }
                                  className={`px-2.5 py-1 rounded-full text-[11px] transition-colors ${
                                    med.gapFromPrevious === gap.value
                                      ? 'bg-[#007AFF] text-white font-semibold shadow-2xs'
                                      : 'bg-[#F2F2F7] dark:bg-[#2C2C2E] text-[#8E8E93] hover:text-black dark:hover:text-white'
                                  }`}
                                >
                                  {gap.label}
                                </button>
                              ))}
                              <div className="flex items-center gap-1 ml-auto">
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
                                  className="w-12 px-2 py-0.5 text-xs text-center rounded-lg border border-[#E5E5EA] dark:border-[#2C2C2E] bg-[#F2F2F7] dark:bg-[#2C2C2E] font-mono text-black dark:text-white"
                                />
                                <span className="text-[11px] text-[#8E8E93]">min</span>
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
              <div className="p-3.5 rounded-2xl bg-[#F2F2F7] dark:bg-[#2C2C2E]/60 border border-[#E5E5EA] dark:border-[#2C2C2E] space-y-2">
                <span className="text-[12px] font-semibold text-black dark:text-white block">
                  Sequence Preview:
                </span>
                <div className="flex items-center gap-2 overflow-x-auto pb-1 text-xs">
                  {medicines.map((m, idx) => {
                    const offset = stepOffsets[idx];
                    const calculatedTime = addMinutesToTime(primaryStartTime, offset);
                    return (
                      <React.Fragment key={idx}>
                        <div className="shrink-0 p-2 rounded-xl bg-white dark:bg-[#1C1C1E] border border-[#E5E5EA] dark:border-[#2C2C2E] text-center min-w-[95px] shadow-2xs">
                          <span className="text-[10px] font-semibold text-[#007AFF] block">
                            Step {idx + 1}
                          </span>
                          <span className="font-semibold text-black dark:text-white truncate block text-[12px]">
                            {m.name || `Pill ${idx + 1}`}
                          </span>
                          <span className="text-[11px] font-mono text-[#8E8E93]">
                            {formatTime12h(calculatedTime)}
                          </span>
                        </div>
                        {idx < medicines.length - 1 && (
                          <div className="shrink-0 flex flex-col items-center">
                            <span
                              className="text-[10px] font-semibold"
                              style={{ color: 'var(--app-accent, #007AFF)' }}
                            >
                              {medicines[idx + 1].gapFromPrevious === 0
                                ? '+0m'
                                : `+${medicines[idx + 1].gapFromPrevious}m`}
                            </span>
                            <ArrowRight className="w-3 h-3 text-[#8E8E93]" />
                          </div>
                        )}
                      </React.Fragment>
                    );
                  })}
                </div>
              </div>

              {/* Submit & Cancel Actions */}
              <div className="pt-3 border-t border-[#E0E3E7] dark:border-[#3C4043] flex items-center justify-end gap-2.5 shrink-0">
                <button
                  type="button"
                  onClick={onClose}
                  className="px-5 py-2.5 text-[13px] font-medium text-[#444746] dark:text-[#9AA0A6] hover:bg-[#F0F4F9] dark:hover:bg-[#282A2C] rounded-full transition-colors cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-6 py-2.5 text-white font-medium text-[13px] rounded-full shadow-xs transition-all flex items-center gap-1.5 active:scale-95 cursor-pointer"
                  style={{ backgroundColor: 'var(--app-accent, #1A73E8)' }}
                >
                  <Check className="w-3.5 h-3.5 stroke-[2.5]" />
                  Save Routine
                </button>
              </div>
            </form>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};
