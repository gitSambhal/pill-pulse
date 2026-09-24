/**
 * PillPulse - Google Material 3 Routines Management View
 * Features: View routines, tap to change start time, toggle active, delete
 * Developer: Suhail Akhtar (https://suhail.top)
 */

import React from 'react';
import { Layers, Plus, Trash2, Clock } from 'lucide-react';
import { Routine, Medicine } from '../../types';
import { formatTime12h, addMinutesToTime } from '../../utils';
import { SlotTimingBadge } from '../../components/SlotTimingBadge';

interface RoutineManagerViewProps {
  routines: Routine[];
  medicines: Medicine[];
  onOpenQuickRoutine: () => void;
  onToggleActive: (id: string, active: boolean) => void;
  onDeleteRoutine: (id: string) => void;
  onUpdateStartTime?: (routineId: string, newStartTime: string) => void;
}

export const RoutineManagerView: React.FC<RoutineManagerViewProps> = ({
  routines,
  medicines,
  onOpenQuickRoutine,
  onToggleActive,
  onDeleteRoutine,
  onUpdateStartTime,
}) => {
  const medMap = new Map(medicines.map((m) => [m.id, m]));

  return (
    <div className="space-y-4 sm:space-y-5">
      {/* Top action header */}
      <div className="flex items-center justify-between gap-3">
        <div>
          <h2 className="text-xl sm:text-2xl font-medium text-[#1F1F1F] dark:text-[#E3E3E3] tracking-normal font-sans">
            Routines
          </h2>
          <p className="text-[13px] text-[#444746] dark:text-[#9AA0A6] mt-0.5">
            Sequential medicines with customizable interval spacing
          </p>
        </div>

        <button
          onClick={onOpenQuickRoutine}
          className="py-2.5 px-5 text-white font-medium text-[13px] rounded-full shadow-xs transition-all flex items-center gap-1.5 active:scale-95 cursor-pointer"
          style={{ backgroundColor: 'var(--app-accent, #1A73E8)' }}
        >
          <Plus className="w-4 h-4 stroke-[2.5]" />
          New Routine
        </button>
      </div>

      {/* Routine Cards */}
      <div className="space-y-3">
        {routines.map((routine) => {
          const sortedItems = [...routine.items].sort((a, b) => a.stepOrder - b.stepOrder);

          return (
            <div
              key={routine.id}
              className={`p-4 sm:p-5 rounded-[24px] border transition-all ${
                routine.active
                  ? 'bg-white dark:bg-[#1E1F20] border-[#E0E3E7] dark:border-[#3C4043] shadow-xs hover:border-[#C4C7C5] dark:hover:border-[#5E6368]'
                  : 'bg-[#F8F9FA]/80 dark:bg-[#18191A] border-[#E0E3E7]/60 dark:border-[#3C4043]/60 opacity-80'
              }`}
            >
              <div className="flex items-start justify-between gap-3 mb-3.5">
                <div>
                  <div className="flex items-center gap-2 flex-wrap">
                    <h3 className="text-[16px] sm:text-[17px] font-medium text-[#1F1F1F] dark:text-[#E3E3E3]">
                      {routine.name}
                    </h3>

                    {/* Interactive Start Time Badge: Material Pill */}
                    <label
                      className="relative inline-flex items-center gap-1.5 text-xs font-medium px-3 py-1 rounded-full cursor-pointer transition-all bg-[#F0F4F9] dark:bg-[#282A2C] hover:bg-[#E0E3E7] dark:hover:bg-[#3C4043] text-[#1F1F1F] dark:text-[#E3E3E3]"
                      title="Tap to change routine start time"
                    >
                      <Clock className="w-3.5 h-3.5 pointer-events-none" style={{ color: 'var(--app-accent, #1A73E8)' }} />
                      <span>{formatTime12h(routine.startTime)}</span>
                      <span className="text-[11px] font-medium ml-0.5" style={{ color: 'var(--app-accent, #1A73E8)' }}>
                        Edit
                      </span>
                      <input
                        type="time"
                        value={routine.startTime}
                        onChange={(e) => onUpdateStartTime?.(routine.id, e.target.value)}
                        className="absolute inset-0 opacity-0 cursor-pointer w-full h-full"
                      />
                    </label>
                  </div>

                  <div className="flex items-center gap-2 mt-1.5 flex-wrap">
                    <SlotTimingBadge slot={routine.slot} size="xs" />
                    <span className="text-[12px] text-[#444746] dark:text-[#9AA0A6]">
                      {routine.items.length} {routine.items.length === 1 ? 'medication' : 'medications'}
                    </span>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  {/* Material 3 Switch */}
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input
                      type="checkbox"
                      checked={routine.active}
                      onChange={(e) => onToggleActive(routine.id, e.target.checked)}
                      className="sr-only peer"
                    />
                    <div
                      className="w-12 h-7 bg-[#E0E3E7] peer-focus:outline-none rounded-full peer dark:bg-[#3C4043] peer-checked:after:translate-x-5 peer-checked:after:border-white after:content-[''] after:absolute after:top-[3px] after:left-[3px] after:bg-white after:rounded-full after:h-5.5 after:w-5.5 after:transition-all after:shadow-xs transition-colors"
                      style={{
                        backgroundColor: routine.active ? 'var(--app-accent, #1A73E8)' : undefined,
                      }}
                    />
                  </label>

                  {/* Delete Icon Button */}
                  <button
                    onClick={() => onDeleteRoutine(routine.id)}
                    className="w-9 h-9 rounded-full hover:bg-[#FCE8E6] dark:hover:bg-[#EA4335]/20 text-[#EA4335] transition-colors flex items-center justify-center cursor-pointer active:scale-95"
                    title="Delete routine"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>

              {/* Step Flow List with exact calculated pill times */}
              <div className="pt-3 border-t border-[#E0E3E7] dark:border-[#3C4043] space-y-2">
                {sortedItems.map((item, idx) => {
                  const med = medMap.get(item.medicineId);
                  const pillTime = addMinutesToTime(routine.startTime, item.offsetMinutes);
                  const prevItem = idx > 0 ? sortedItems[idx - 1] : null;
                  const stepGap = prevItem ? item.offsetMinutes - prevItem.offsetMinutes : 0;

                  return (
                    <div key={idx} className="flex items-center gap-2.5 text-xs py-0.5">
                      <span
                        className="w-5.5 h-5.5 rounded-full font-medium text-[11px] flex items-center justify-center shrink-0"
                        style={{
                          backgroundColor: 'var(--app-accent-subtle, #E8F0FE)',
                          color: 'var(--app-accent, #1A73E8)',
                        }}
                      >
                        {item.stepOrder}
                      </span>
                      <div className="flex-1 min-w-0">
                        <span className="font-medium text-[#1F1F1F] dark:text-[#E3E3E3]">
                          {med ? med.name : 'Unknown Medicine'}
                        </span>
                        {med && (
                          <span className="text-[#444746] dark:text-[#9AA0A6] ml-1.5">
                            ({med.dosage})
                          </span>
                        )}
                      </div>

                      {/* Pill Scheduled Time */}
                      <span className="text-[12px] font-mono text-[#444746] dark:text-[#9AA0A6]">
                        {formatTime12h(pillTime)}
                      </span>

                      {/* Interval Badge */}
                      <span
                        className={`text-[11px] font-medium px-2 py-0.5 rounded-full ${
                          idx === 0
                            ? 'text-[#444746] dark:text-[#9AA0A6] bg-[#F0F4F9] dark:bg-[#282A2C]'
                            : stepGap === 0
                            ? 'text-[#1A73E8] bg-[#E8F0FE] dark:bg-[#4285F4]/20'
                            : 'text-[#B06000] dark:text-[#FBBC04] bg-[#FEF7E0] dark:bg-[#FBBC04]/20'
                        }`}
                      >
                        {idx === 0
                          ? 'Start'
                          : stepGap === 0
                          ? 'Together'
                          : `+${stepGap}m`}
                      </span>
                    </div>
                  );
                })}
              </div>
            </div>
          );
        })}

        {routines.length === 0 && (
          <div className="text-center py-12 bg-white dark:bg-[#1E1F20] rounded-[24px] border border-[#E0E3E7] dark:border-[#3C4043] p-8 shadow-xs">
            <div
              className="w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-3"
              style={{
                backgroundColor: 'var(--app-accent-subtle, #E8F0FE)',
                color: 'var(--app-accent, #1A73E8)',
              }}
            >
              <Layers className="w-6 h-6" />
            </div>
            <h3 className="text-[17px] font-medium text-[#1F1F1F] dark:text-[#E3E3E3]">No Routines Yet</h3>
            <p className="text-[13px] text-[#444746] dark:text-[#9AA0A6] mt-1 max-w-sm mx-auto mb-5 leading-relaxed">
              Create a sequence of medicines to take together or with staggered 5-min intervals.
            </p>
            <button
              onClick={onOpenQuickRoutine}
              className="py-2.5 px-5 text-white font-medium text-[13px] rounded-full shadow-xs transition-colors cursor-pointer active:scale-95"
              style={{ backgroundColor: 'var(--app-accent, #1A73E8)' }}
            >
              Create Routine
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
