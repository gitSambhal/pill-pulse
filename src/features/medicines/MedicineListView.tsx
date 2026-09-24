/**
 * PillPulse - Medicines & Cabinet View
 * Developer: Suhail Akhtar (https://suhail.top)
 */

import React, { useState } from 'react';
import { Pill, Plus, Edit2, Trash2, AlertCircle, Sparkles } from 'lucide-react';
import { Medicine } from '../../types';
import { getPillColorClasses } from '../../utils';

interface MedicineListViewProps {
  medicines: Medicine[];
  onAddMedicine: () => void;
  onEditMedicine: (med: Medicine) => void;
  onDeleteMedicine: (id: string) => void;
}

export const MedicineListView: React.FC<MedicineListViewProps> = ({
  medicines,
  onAddMedicine,
  onEditMedicine,
  onDeleteMedicine,
}) => {
  const [filterQuery, setFilterQuery] = useState('');

  const filtered = medicines.filter((m) =>
    m.name.toLowerCase().includes(filterQuery.toLowerCase()) ||
    m.dosage.toLowerCase().includes(filterQuery.toLowerCase())
  );

  return (
    <div className="space-y-5 sm:space-y-6">
      {/* Top action bar */}
      <div className="flex items-center justify-between gap-3">
        <div>
          <h2 className="text-lg font-bold text-slate-900 dark:text-white tracking-tight">
            Medicine Cabinet
          </h2>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
            {medicines.length} registered medications & supplements
          </p>
        </div>

        <button
          onClick={onAddMedicine}
          className="py-2.5 px-4 bg-teal-600 hover:bg-teal-700 text-white font-semibold text-xs rounded-xl shadow-xs hover:shadow-teal-500/20 transition-all flex items-center gap-1.5 min-h-[40px]"
        >
          <Plus className="w-4 h-4" />
          Add Medicine
        </button>
      </div>

      {/* Search Input */}
      {medicines.length > 3 && (
        <input
          type="text"
          value={filterQuery}
          onChange={(e) => setFilterQuery(e.target.value)}
          placeholder="Search medicines in cabinet..."
          className="w-full px-4 py-2.5 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-xs text-slate-900 dark:text-white placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-teal-500 shadow-xs"
        />
      )}

      {/* List */}
      <div className="space-y-3">
        {filtered.map((med) => {
          const colorStyle = getPillColorClasses(med.color);
          const isLowStock =
            med.inventoryCount !== undefined &&
            med.lowStockThreshold !== undefined &&
            med.inventoryCount <= med.lowStockThreshold;

          return (
            <div
              key={med.id}
              className="p-4 sm:p-5 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800/80 shadow-xs hover:border-slate-300 dark:hover:border-slate-700 transition-all flex items-center justify-between gap-3.5"
            >
              <div className="flex items-center gap-3.5 min-w-0">
                <div
                  className={`w-11 h-11 rounded-2xl flex items-center justify-center shrink-0 shadow-xs ${colorStyle.bg} ${colorStyle.text} border ${colorStyle.border}`}
                >
                  <Pill className="w-5 h-5 -rotate-45" />
                </div>
                <div className="min-w-0">
                  <div className="flex items-center gap-2">
                    <h3 className="text-sm sm:text-base font-bold text-slate-900 dark:text-white truncate">
                      {med.name}
                    </h3>
                    {isLowStock && (
                      <span className="flex items-center gap-1 text-[10px] font-semibold text-rose-600 dark:text-rose-400 bg-rose-50 dark:bg-rose-950/50 px-2 py-0.5 rounded-md">
                        <AlertCircle className="w-3 h-3" /> Low Stock
                      </span>
                    )}
                  </div>
                  <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                    {med.dosage}
                    {med.instructions ? ` · ${med.instructions}` : ''}
                  </p>
                  {med.inventoryCount !== undefined && (
                    <p className="text-[11px] text-slate-400 dark:text-slate-500 mt-1">
                      {med.inventoryCount} pills left in stock
                    </p>
                  )}
                </div>
              </div>

              {/* Actions */}
              <div className="flex items-center gap-1 shrink-0">
                <button
                  onClick={() => onEditMedicine(med)}
                  className="p-2.5 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-xl transition-colors"
                  title="Edit medicine"
                >
                  <Edit2 className="w-4 h-4" />
                </button>
                <button
                  onClick={() => onDeleteMedicine(med.id)}
                  className="p-2.5 text-slate-400 hover:text-rose-600 dark:hover:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-950/40 rounded-xl transition-colors"
                  title="Delete medicine"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          );
        })}

        {filtered.length === 0 && (
          <div className="text-center py-12 bg-white dark:bg-slate-900 rounded-3xl border border-slate-200/80 dark:border-slate-800/80 p-8 shadow-xs text-slate-500 dark:text-slate-400 text-xs">
            No medicines match your search.
          </div>
        )}
      </div>
    </div>
  );
};
