/**
 * PillPulse - Google Health Medicines & Cabinet View
 * Developer: Suhail Akhtar (https://suhail.top)
 */

import React, { useState } from 'react';
import { Pill, Plus, Edit2, Trash2, AlertCircle, Search } from 'lucide-react';
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
    <div className="space-y-4 sm:space-y-5">
      {/* Top Header */}
      <div className="flex items-center justify-between gap-3">
        <div>
          <h2 className="text-xl sm:text-2xl font-medium text-[#1F1F1F] dark:text-[#E3E3E3] tracking-normal font-sans">
            Cabinet
          </h2>
          <p className="text-[13px] text-[#444746] dark:text-[#9AA0A6] mt-0.5">
            {medicines.length} registered medications
          </p>
        </div>

        <button
          onClick={onAddMedicine}
          className="py-2.5 px-5 text-white font-medium text-[13px] rounded-full shadow-xs transition-all flex items-center gap-1.5 active:scale-95 cursor-pointer"
          style={{ backgroundColor: 'var(--app-accent, #1A73E8)' }}
        >
          <Plus className="w-4 h-4 stroke-[2.5]" />
          Add Medication
        </button>
      </div>

      {/* Google Search Bar */}
      {medicines.length > 1 && (
        <div className="relative">
          <Search className="w-4 h-4 text-[#444746] dark:text-[#9AA0A6] absolute left-4 top-1/2 -translate-y-1/2 pointer-events-none" />
          <input
            type="text"
            value={filterQuery}
            onChange={(e) => setFilterQuery(e.target.value)}
            placeholder="Search medications..."
            className="w-full pl-11 pr-4 py-2.5 rounded-full bg-[#F0F4F9] dark:bg-[#282A2C] border border-[#E0E3E7] dark:border-[#3C4043] focus:border-[var(--app-accent,#1A73E8)] text-[14px] text-[#1F1F1F] dark:text-[#E3E3E3] placeholder:text-[#444746] dark:placeholder:text-[#9AA0A6] focus:outline-none transition-colors"
          />
        </div>
      )}

      {/* Medication Items List */}
      <div className="space-y-2.5">
        {filtered.map((med) => {
          const colorStyle = getPillColorClasses(med.color);
          const isLowStock =
            med.inventoryCount !== undefined &&
            med.lowStockThreshold !== undefined &&
            med.inventoryCount <= med.lowStockThreshold;

          return (
            <div
              key={med.id}
              className="p-4 rounded-[20px] bg-white dark:bg-[#1E1F20] border border-[#E0E3E7] dark:border-[#3C4043] shadow-xs hover:border-[#C4C7C5] dark:hover:border-[#5E6368] transition-all flex items-center justify-between gap-3"
            >
              <div className="flex items-center gap-3 min-w-0">
                <div
                  className={`w-10 h-10 rounded-[14px] flex items-center justify-center shrink-0 ${colorStyle.bg} ${colorStyle.text} border ${colorStyle.border}`}
                >
                  <Pill className="w-5 h-5 -rotate-45" />
                </div>
                <div className="min-w-0">
                  <div className="flex items-center gap-2">
                    <h3 className="text-[16px] font-medium text-[#1F1F1F] dark:text-[#E3E3E3] truncate">
                      {med.name}
                    </h3>
                    {isLowStock && (
                      <span className="flex items-center gap-1 text-[10px] font-medium text-[#C5221F] dark:text-[#F28B82] bg-[#FCE8E6] dark:bg-[#EA4335]/20 px-2 py-0.5 rounded-full">
                        <AlertCircle className="w-3 h-3" /> Low Stock
                      </span>
                    )}
                  </div>
                  <p className="text-[13px] text-[#444746] dark:text-[#9AA0A6] mt-0.5">
                    {med.dosage}
                    {med.instructions ? ` · ${med.instructions}` : ''}
                  </p>
                  {med.inventoryCount !== undefined && (
                    <p className="text-[11px] text-[#444746] dark:text-[#9AA0A6] mt-0.5">
                      {med.inventoryCount} remaining
                    </p>
                  )}
                </div>
              </div>

              {/* Action buttons */}
              <div className="flex items-center gap-1 shrink-0">
                <button
                  onClick={() => onEditMedicine(med)}
                  className="w-9 h-9 rounded-full hover:bg-[#F0F4F9] dark:hover:bg-[#282A2C] text-[#444746] dark:text-[#C4C7C5] hover:text-[var(--app-accent,#1A73E8)] transition-colors flex items-center justify-center cursor-pointer active:scale-95"
                  title="Edit medication"
                >
                  <Edit2 className="w-4 h-4" />
                </button>
                <button
                  onClick={() => onDeleteMedicine(med.id)}
                  className="w-9 h-9 rounded-full hover:bg-[#FCE8E6] dark:hover:bg-[#EA4335]/20 text-[#EA4335] transition-colors flex items-center justify-center cursor-pointer active:scale-95"
                  title="Delete medication"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          );
        })}

        {filtered.length === 0 && (
          <div className="text-center py-12 bg-white dark:bg-[#1E1F20] rounded-[24px] border border-[#E0E3E7] dark:border-[#3C4043] p-8 shadow-xs text-[#444746] dark:text-[#9AA0A6] text-sm">
            No medications found in your cabinet.
          </div>
        )}
      </div>
    </div>
  );
};
