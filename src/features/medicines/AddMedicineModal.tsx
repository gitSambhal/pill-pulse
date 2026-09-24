/**
 * PillPulse - Google Material 3 Add / Edit Medicine Modal
 * Developer: Suhail Akhtar (https://suhail.top)
 */

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, Pill, Check } from 'lucide-react';
import { Medicine, PillColor, PillShape } from '../../types';

interface AddMedicineModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (med: Partial<Medicine>) => void;
  editingMedicine?: Medicine | null;
}

const PILL_COLORS: PillColor[] = ['teal', 'sky', 'indigo', 'purple', 'amber', 'emerald', 'rose', 'coral'];
const PILL_SHAPES: { id: PillShape; label: string }[] = [
  { id: 'capsule', label: 'Capsule' },
  { id: 'tablet', label: 'Tablet' },
  { id: 'liquid', label: 'Liquid / Syrup' },
  { id: 'drop', label: 'Drops' },
  { id: 'injection', label: 'Injection' },
];

export const AddMedicineModal: React.FC<AddMedicineModalProps> = ({
  isOpen,
  onClose,
  onSave,
  editingMedicine,
}) => {
  const [name, setName] = useState('');
  const [dosage, setDosage] = useState('');
  const [instructions, setInstructions] = useState('');
  const [shape, setShape] = useState<PillShape>('capsule');
  const [color, setColor] = useState<PillColor>('teal');
  const [inventoryCount, setInventoryCount] = useState<number>(30);
  const [lowStockThreshold, setLowStockThreshold] = useState<number>(7);

  useEffect(() => {
    if (editingMedicine) {
      setName(editingMedicine.name);
      setDosage(editingMedicine.dosage);
      setInstructions(editingMedicine.instructions);
      setShape(editingMedicine.shape);
      setColor(editingMedicine.color);
      setInventoryCount(editingMedicine.inventoryCount ?? 30);
      setLowStockThreshold(editingMedicine.lowStockThreshold ?? 7);
    } else {
      setName('');
      setDosage('');
      setInstructions('');
      setShape('capsule');
      setColor('teal');
      setInventoryCount(30);
      setLowStockThreshold(7);
    }
  }, [editingMedicine, isOpen]);

  useEffect(() => {
    if (!isOpen) return;
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;

    onSave({
      id: editingMedicine ? editingMedicine.id : `med-${Date.now()}`,
      name: name.trim(),
      dosage: dosage.trim() || '1 dose',
      instructions: instructions.trim(),
      shape,
      color,
      inventoryCount: Number(inventoryCount) || undefined,
      lowStockThreshold: Number(lowStockThreshold) || undefined,
    });
    onClose();
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
            {/* Modal Header */}
            <div className="flex items-center justify-between pb-4 border-b border-[#E0E3E7] dark:border-[#3C4043] shrink-0">
              <div className="flex items-center gap-3">
                <div
                  className="w-10 h-10 rounded-[14px] flex items-center justify-center shrink-0"
                  style={{
                    backgroundColor: 'var(--app-accent-subtle, #E8F0FE)',
                    color: 'var(--app-accent, #1A73E8)',
                  }}
                >
                  <Pill className="w-5 h-5 -rotate-45" />
                </div>
                <div>
                  <h2 className="text-[18px] font-medium text-[#1F1F1F] dark:text-[#E3E3E3]">
                    {editingMedicine ? 'Edit Medication' : 'Add Medication'}
                  </h2>
                  <p className="text-[12px] text-[#444746] dark:text-[#9AA0A6]">
                    {editingMedicine ? 'Update dosage, instructions, and stock' : 'Register a medicine in your cabinet'}
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

            <form onSubmit={handleSubmit} className="overflow-y-auto px-0.5 py-4 space-y-4 flex-1">
              {/* Medicine Name */}
              <div>
                <label className="block text-[12px] font-medium text-[#444746] dark:text-[#9AA0A6] mb-1.5">
                  Medication Name *
                </label>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="e.g. Metformin, Vitamin D3, Lisinopril"
                  required
                  className="w-full px-4 py-2.5 rounded-[12px] bg-[#F0F4F9] dark:bg-[#282A2C] border border-[#E0E3E7] dark:border-[#3C4043] focus:border-[var(--app-accent,#1A73E8)] text-[14px] text-[#1F1F1F] dark:text-[#E3E3E3] placeholder:text-[#444746] dark:placeholder:text-[#9AA0A6] focus:outline-none transition-colors"
                />
              </div>

              {/* Dosage & Shape */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-[12px] font-medium text-[#444746] dark:text-[#9AA0A6] mb-1.5">
                    Dosage *
                  </label>
                  <input
                    type="text"
                    value={dosage}
                    onChange={(e) => setDosage(e.target.value)}
                    placeholder="e.g. 500 mg, 1 tablet"
                    required
                    className="w-full px-4 py-2.5 rounded-[12px] bg-[#F0F4F9] dark:bg-[#282A2C] border border-[#E0E3E7] dark:border-[#3C4043] focus:border-[var(--app-accent,#1A73E8)] text-[14px] text-[#1F1F1F] dark:text-[#E3E3E3] placeholder:text-[#444746] dark:placeholder:text-[#9AA0A6] focus:outline-none transition-colors"
                  />
                </div>

                <div>
                  <label className="block text-[12px] font-medium text-[#444746] dark:text-[#9AA0A6] mb-1.5">
                    Form Factor
                  </label>
                  <select
                    value={shape}
                    onChange={(e) => setShape(e.target.value as PillShape)}
                    className="w-full px-4 py-2.5 rounded-[12px] bg-[#F0F4F9] dark:bg-[#282A2C] border border-[#E0E3E7] dark:border-[#3C4043] focus:border-[var(--app-accent,#1A73E8)] text-[14px] text-[#1F1F1F] dark:text-[#E3E3E3] focus:outline-none transition-colors"
                  >
                    {PILL_SHAPES.map((s) => (
                      <option key={s.id} value={s.id}>
                        {s.label}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Instructions */}
              <div>
                <label className="block text-[12px] font-medium text-[#444746] dark:text-[#9AA0A6] mb-1.5">
                  Instructions / Notes
                </label>
                <input
                  type="text"
                  value={instructions}
                  onChange={(e) => setInstructions(e.target.value)}
                  placeholder="e.g. Take with breakfast, with plenty of water"
                  className="w-full px-4 py-2.5 rounded-[12px] bg-[#F0F4F9] dark:bg-[#282A2C] border border-[#E0E3E7] dark:border-[#3C4043] focus:border-[var(--app-accent,#1A73E8)] text-[14px] text-[#1F1F1F] dark:text-[#E3E3E3] placeholder:text-[#444746] dark:placeholder:text-[#9AA0A6] focus:outline-none transition-colors"
                />
              </div>

              {/* Material You Color Tag Selection */}
              <div>
                <label className="block text-[12px] font-medium text-[#444746] dark:text-[#9AA0A6] mb-2">
                  Color Tag
                </label>
                <div className="flex items-center gap-2 flex-wrap">
                  {PILL_COLORS.map((c) => (
                    <button
                      key={c}
                      type="button"
                      onClick={() => setColor(c)}
                      className={`w-8 h-8 rounded-full flex items-center justify-center transition-all cursor-pointer ${
                        color === c ? 'ring-2 ring-offset-2 ring-offset-white dark:ring-offset-[#1E1F20] scale-110' : 'hover:scale-105'
                      }`}
                      style={{
                        backgroundColor:
                          c === 'teal' ? '#00796B' :
                          c === 'sky' ? '#0288D1' :
                          c === 'indigo' ? '#3949AB' :
                          c === 'purple' ? '#7B1FA2' :
                          c === 'amber' ? '#FFA000' :
                          c === 'emerald' ? '#2E7D32' :
                          c === 'rose' ? '#C2185B' :
                          '#E64A19',
                      }}
                      title={c}
                    >
                      {color === c && <Check className="w-4 h-4 text-white stroke-[3]" />}
                    </button>
                  ))}
                </div>
              </div>

              {/* Inventory & Low Stock */}
              <div className="grid grid-cols-2 gap-3 pt-2 border-t border-[#E0E3E7] dark:border-[#3C4043]">
                <div>
                  <label className="block text-[12px] font-medium text-[#444746] dark:text-[#9AA0A6] mb-1.5">
                    Remaining Units
                  </label>
                  <input
                    type="number"
                    min="0"
                    value={inventoryCount}
                    onChange={(e) => setInventoryCount(Math.max(0, parseInt(e.target.value) || 0))}
                    className="w-full px-4 py-2.5 rounded-[12px] bg-[#F0F4F9] dark:bg-[#282A2C] border border-[#E0E3E7] dark:border-[#3C4043] focus:border-[var(--app-accent,#1A73E8)] text-[14px] text-[#1F1F1F] dark:text-[#E3E3E3] focus:outline-none transition-colors"
                  />
                </div>
                <div>
                  <label className="block text-[12px] font-medium text-[#444746] dark:text-[#9AA0A6] mb-1.5">
                    Low Stock Alert At
                  </label>
                  <input
                    type="number"
                    min="0"
                    value={lowStockThreshold}
                    onChange={(e) => setLowStockThreshold(Math.max(0, parseInt(e.target.value) || 0))}
                    className="w-full px-4 py-2.5 rounded-[12px] bg-[#F0F4F9] dark:bg-[#282A2C] border border-[#E0E3E7] dark:border-[#3C4043] focus:border-[var(--app-accent,#1A73E8)] text-[14px] text-[#1F1F1F] dark:text-[#E3E3E3] focus:outline-none transition-colors"
                  />
                </div>
              </div>

              {/* Footer Actions */}
              <div className="pt-4 border-t border-[#E0E3E7] dark:border-[#3C4043] flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={onClose}
                  className="px-5 py-2.5 text-[13px] font-medium rounded-full hover:bg-[#F0F4F9] dark:hover:bg-[#282A2C] text-[#444746] dark:text-[#9AA0A6] transition-colors cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-6 py-2.5 text-[13px] font-medium rounded-full text-white shadow-xs transition-all active:scale-95 cursor-pointer"
                  style={{ backgroundColor: 'var(--app-accent, #1A73E8)' }}
                >
                  {editingMedicine ? 'Save Changes' : 'Add Medication'}
                </button>
              </div>
            </form>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};
