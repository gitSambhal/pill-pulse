/**
 * PillPulse - Add / Edit Medicine Modal
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
          className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-slate-950/70 backdrop-blur-xs overflow-y-auto"
          onClick={onClose}
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95 }}
            className="w-full max-w-lg bg-white dark:bg-slate-900 rounded-3xl p-6 sm:p-7 shadow-2xl border border-slate-200 dark:border-slate-800 flex flex-col max-h-[90vh] overflow-hidden my-auto"
            role="dialog"
            aria-modal="true"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Modal Header */}
            <div className="flex items-center justify-between pb-4 border-b border-slate-100 dark:border-slate-800 shrink-0">
              <div className="flex items-center gap-3">
                <div className="p-2.5 rounded-2xl bg-teal-50 dark:bg-teal-950/60 text-teal-600 dark:text-teal-400">
                  <Pill className="w-5 h-5" />
                </div>
                <div>
                  <h2 className="text-base sm:text-lg font-bold text-slate-900 dark:text-white">
                    {editingMedicine ? 'Edit Medicine' : 'Add New Medicine'}
                  </h2>
                  <p className="text-xs text-slate-500 dark:text-slate-400">
                    {editingMedicine ? 'Update dosage, instructions, and stock' : 'Register a medicine or supplement in your cabinet'}
                  </p>
                </div>
              </div>
              <button
                onClick={onClose}
                className="p-2 rounded-xl text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
                title="Close"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Modal Form */}
            <form onSubmit={handleSubmit} className="overflow-y-auto px-1 sm:px-2 py-5 space-y-5 flex-1">
              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
                  Medicine Name *
                </label>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="e.g. Metformin, Vitamin D, Omega 3"
                  className="w-full px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/50 text-slate-900 dark:text-white text-sm focus:outline-none focus:ring-2 focus:ring-teal-500 transition-all"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
                  Dosage / Strength
                </label>
                <input
                  type="text"
                  value={dosage}
                  onChange={(e) => setDosage(e.target.value)}
                  placeholder="e.g. 500mg, 1 tablet, 2000 IU"
                  className="w-full px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/50 text-slate-900 dark:text-white text-sm focus:outline-none focus:ring-2 focus:ring-teal-500 transition-all"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
                  Instructions / Clinical Notes
                </label>
                <input
                  type="text"
                  value={instructions}
                  onChange={(e) => setInstructions(e.target.value)}
                  placeholder="e.g. With food, Before breakfast, Full glass of water"
                  className="w-full px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/50 text-slate-900 dark:text-white text-sm focus:outline-none focus:ring-2 focus:ring-teal-500 transition-all"
                />
              </div>

              {/* Shape selection */}
              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-2">
                  Pill Form / Type
                </label>
                <div className="grid grid-cols-3 gap-2.5">
                  {PILL_SHAPES.map((item) => (
                    <button
                      key={item.id}
                      type="button"
                      onClick={() => setShape(item.id)}
                      className={`py-2.5 px-3 rounded-xl text-xs font-medium border transition-all text-center ${
                        shape === item.id
                          ? 'border-teal-500 bg-teal-50 dark:bg-teal-950/50 text-teal-700 dark:text-teal-300 font-semibold ring-1 ring-teal-500/30'
                          : 'border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800/50'
                      }`}
                    >
                      {item.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Color Accent Selection */}
              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-2">
                  Visual Color Accent
                </label>
                <div className="flex items-center gap-3 flex-wrap">
                  {PILL_COLORS.map((col) => {
                    const colorMap: Record<PillColor, string> = {
                      teal: 'bg-teal-500',
                      sky: 'bg-sky-500',
                      indigo: 'bg-indigo-500',
                      purple: 'bg-purple-500',
                      amber: 'bg-amber-500',
                      emerald: 'bg-emerald-500',
                      rose: 'bg-rose-500',
                      coral: 'bg-orange-500',
                    };
                    const isSelected = color === col;
                    return (
                      <button
                        key={col}
                        type="button"
                        onClick={() => setColor(col)}
                        className={`w-8 h-8 rounded-full ${colorMap[col]} flex items-center justify-center text-white transition-all ${
                          isSelected ? 'ring-2 ring-offset-2 ring-teal-500 scale-110 shadow-xs' : 'opacity-80 hover:opacity-100 hover:scale-105'
                        }`}
                      >
                        {isSelected && <Check className="w-4 h-4 stroke-[3]" />}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Inventory & Low Stock Tracking */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-1">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
                    Pills in Stock
                  </label>
                  <input
                    type="number"
                    min="0"
                    value={inventoryCount}
                    onChange={(e) => setInventoryCount(parseInt(e.target.value, 10) || 0)}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/50 text-slate-900 dark:text-white text-xs focus:outline-none focus:ring-2 focus:ring-teal-500"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
                    Refill Alert At
                  </label>
                  <input
                    type="number"
                    min="0"
                    value={lowStockThreshold}
                    onChange={(e) => setLowStockThreshold(parseInt(e.target.value, 10) || 0)}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/50 text-slate-900 dark:text-white text-xs focus:outline-none focus:ring-2 focus:ring-teal-500"
                  />
                </div>
              </div>

              {/* Action Buttons */}
              <div className="pt-4 border-t border-slate-100 dark:border-slate-800 flex items-center justify-end gap-3 shrink-0">
                <button
                  type="button"
                  onClick={onClose}
                  className="px-4 py-2.5 text-xs font-semibold text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-xl transition-colors min-h-[42px]"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2.5 bg-teal-600 hover:bg-teal-700 text-white font-semibold text-xs rounded-xl shadow-xs hover:shadow-teal-500/20 transition-all min-h-[42px] flex items-center gap-1.5"
                >
                  <Check className="w-4 h-4" />
                  {editingMedicine ? 'Save Changes' : 'Save Medicine'}
                </button>
              </div>
            </form>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};
