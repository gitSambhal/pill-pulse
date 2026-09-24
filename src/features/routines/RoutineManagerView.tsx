/**
 * PillPulse - Routines Management View
 * Features: View routines, tap to change start time, toggle active, delete
 * Developer: Suhail Akhtar (https://suhail.top)
 */

import React from 'react';
import { Layers, Plus, Trash2, Clock, Check, ArrowRight, Edit3 } from 'lucide-react';
import { Routine, Medicine } from '../../types';
import { formatTime12h, getSlotLabel, addMinutesToTime } from '../../utils';
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
    <div className="space-y-5 sm:space-y-6">
      {/* Top action header */}
      <div className="flex items-center justify-between gap-3">
        <div>
          <h2 className="text-lg font-bold text-slate-900 dark:text-white tracking-tight">
            Cascading Routines
          </h2>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
            Multi-pill routines with staggered or zero-gap timing
          </p>
        </div>

        <button
          onClick={onOpenQuickRoutine}
          className="py-2.5 px-4 bg-teal-600 hover:bg-teal-700 text-white font-semibold text-xs rounded-xl shadow-xs hover:shadow-teal-500/20 transition-all flex items-center gap-1.5 min-h-[40px]"
        >
          <Plus className="w-4 h-4" />
          New Routine
        </button>
      </div>

      {/* Routine Cards */}
      <div className="space-y-3.5">
        {routines.map((routine) => {
          const sortedItems = [...routine.items].sort((a, b) => a.stepOrder - b.stepOrder);

          return (
            <div
              key={routine.id}
              className={`p-5 sm:p-6 rounded-3xl border transition-all ${
                routine.active
                  ? 'bg-white dark:bg-slate-900 border-slate-200/80 dark:border-slate-800 shadow-xs hover:border-slate-300 dark:hover:border-slate-700'
                  : 'bg-slate-50/70 dark:bg-slate-900/40 border-slate-200/50 dark:border-slate-800/40 opacity-70'
              }`}
            >
              <div className="flex items-start justify-between gap-3.5 mb-4">
                <div>
                  <div className="flex items-center gap-2.5 flex-wrap">
                    <h3 className="text-base font-bold text-slate-900 dark:text-white">
                      {routine.name}
                    </h3>

                    {/* Interactive Start Time Badge: Tap to Change Start Time */}
                    <label
                      className="relative inline-flex items-center gap-1.5 text-xs font-mono font-bold text-teal-700 dark:text-teal-300 bg-teal-50 dark:bg-teal-950/60 hover:bg-teal-100 dark:hover:bg-teal-900/50 px-2.5 py-1 rounded-xl cursor-pointer transition-all border border-teal-200/60 dark:border-teal-800/60 shadow-xs"
                      title="Tap to change routine start time"
                    >
                      <Clock className="w-3.5 h-3.5 text-teal-600 dark:text-teal-400 pointer-events-none" />
                      <span>{formatTime12h(routine.startTime)}</span>
                      <span className="text-[10px] text-teal-600 dark:text-teal-400 font-sans font-normal underline ml-0.5">
                        Change
                      </span>
                      <input
                        type="time"
                        value={routine.startTime}
                        onChange={(e) => onUpdateStartTime?.(routine.id, e.target.value)}
                        className="absolute inset-0 opacity-0 cursor-pointer w-full h-full"
                      />
                    </label>
                  </div>

                  <div className="flex items-center gap-2 mt-2 flex-wrap">
                    <SlotTimingBadge slot={routine.slot} size="xs" />
                    <span className="text-xs text-slate-500 dark:text-slate-400">
                      {routine.items.length} {routine.items.length === 1 ? 'medicine' : 'medicines'}
                    </span>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  {/* Active toggle */}
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input
                      type="checkbox"
                      checked={routine.active}
                      onChange={(e) => onToggleActive(routine.id, e.target.checked)}
                      className="sr-only peer"
                    />
                    <div className="w-9 h-5 bg-slate-200 peer-focus:outline-none rounded-full peer dark:bg-slate-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-teal-600"></div>
                  </label>

                  <button
                    onClick={() => onDeleteRoutine(routine.id)}
                    className="p-2 text-slate-400 hover:text-rose-600 dark:hover:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-950/40 rounded-xl transition-colors"
                    title="Delete routine"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>

              {/* Step Flow List with exact calculated pill times */}
              <div className="pt-3.5 border-t border-slate-100 dark:border-slate-800/80 space-y-2.5">
                {sortedItems.map((item, idx) => {
                  const med = medMap.get(item.medicineId);
                  const pillTime = addMinutesToTime(routine.startTime, item.offsetMinutes);
                  const prevItem = idx > 0 ? sortedItems[idx - 1] : null;
                  const stepGap = prevItem ? item.offsetMinutes - prevItem.offsetMinutes : 0;

                  return (
                    <div key={idx} className="flex items-center gap-3 text-xs py-1">
                      <span className="w-5 h-5 rounded-full bg-teal-50 dark:bg-teal-950/60 text-teal-700 dark:text-teal-300 font-bold text-[11px] flex items-center justify-center shrink-0 border border-teal-200/50 dark:border-teal-800/50">
                        {item.stepOrder}
                      </span>
                      <div className="flex-1 min-w-0">
                        <span className="font-semibold text-slate-800 dark:text-slate-200">
                          {med ? med.name : 'Unknown Medicine'}
                        </span>
                        {med && (
                          <span className="text-slate-500 dark:text-slate-400 ml-1.5">
                            ({med.dosage})
                          </span>
                        )}
                      </div>

                      {/* Pill Scheduled Time */}
                      <span className="text-[11px] font-mono text-slate-500 dark:text-slate-400">
                        {formatTime12h(pillTime)}
                      </span>

                      {/* Interval Badge */}
                      <span
                        className={`text-[10px] font-mono px-2 py-0.5 rounded-md ${
                          idx === 0
                            ? 'text-slate-500 dark:text-slate-400 bg-slate-100 dark:bg-slate-800'
                            : stepGap === 0
                            ? 'text-teal-700 dark:text-teal-300 bg-teal-50 dark:bg-teal-950/60 font-semibold'
                            : 'text-amber-700 dark:text-amber-300 bg-amber-50 dark:bg-amber-950/60 font-medium'
                        }`}
                      >
                        {idx === 0
                          ? 'Start'
                          : stepGap === 0
                          ? 'Together (0m)'
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
          <div className="text-center py-12 bg-white dark:bg-slate-900 rounded-3xl border border-dashed border-slate-300 dark:border-slate-800 p-8 shadow-xs">
            <Layers className="w-9 h-9 text-teal-500 mx-auto mb-3 opacity-80" />
            <h3 className="text-base font-bold text-slate-900 dark:text-white">No Routines Yet</h3>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-1.5 max-w-sm mx-auto mb-5 leading-relaxed">
              Create a sequence of medicines to take together or with staggered 5-min intervals.
            </p>
            <button
              onClick={onOpenQuickRoutine}
              className="py-2.5 px-5 bg-teal-600 hover:bg-teal-700 text-white font-semibold text-xs rounded-xl shadow-xs transition-colors min-h-[42px]"
            >
              Create Medication Routine
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
