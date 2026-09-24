/**
 * PillPulse - Google Material 3 Confirmation Dialog
 * Developer: Suhail Akhtar (https://suhail.top)
 */

import React, { useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { AlertTriangle } from 'lucide-react';

interface ConfirmModalProps {
  isOpen: boolean;
  title: string;
  message: string;
  confirmLabel?: string;
  cancelLabel?: string;
  isDestructive?: boolean;
  onConfirm: () => void;
  onCancel: () => void;
}

export const ConfirmModal: React.FC<ConfirmModalProps> = ({
  isOpen,
  title,
  message,
  confirmLabel = 'Confirm',
  cancelLabel = 'Cancel',
  isDestructive = true,
  onConfirm,
  onCancel,
}) => {
  useEffect(() => {
    if (!isOpen) return;
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onCancel();
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onCancel]);

  return (
    <AnimatePresence>
      {isOpen && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50"
          onClick={onCancel}
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.94, y: 10 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.94 }}
            transition={{ duration: 0.16, ease: 'easeOut' }}
            className="w-full max-w-sm bg-white dark:bg-[#1E1F20] rounded-[28px] p-6 shadow-2xl border border-[#E0E3E7] dark:border-[#3C4043] text-center"
            role="dialog"
            aria-modal="true"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="w-12 h-12 rounded-full bg-[#FEF7E0] dark:bg-[#FBBC04]/20 text-[#B06000] dark:text-[#FBBC04] flex items-center justify-center mx-auto mb-3">
              <AlertTriangle className="w-6 h-6 stroke-[2]" />
            </div>
            <h3 className="text-[18px] font-medium text-[#1F1F1F] dark:text-[#E3E3E3]">{title}</h3>
            <p className="text-[13px] text-[#444746] dark:text-[#9AA0A6] leading-relaxed mt-2 mb-6 px-1">
              {message}
            </p>
            <div className="flex items-center justify-end gap-2">
              <button
                onClick={onCancel}
                className="py-2.5 px-4 text-[13px] font-medium text-[#444746] dark:text-[#9AA0A6] hover:bg-[#F0F4F9] dark:hover:bg-[#282A2C] rounded-full transition-colors cursor-pointer"
              >
                {cancelLabel}
              </button>
              <button
                onClick={onConfirm}
                className={`py-2.5 px-5 text-[13px] font-medium rounded-full text-white transition-all shadow-xs active:scale-95 cursor-pointer ${
                  isDestructive
                    ? 'bg-[#EA4335] hover:bg-[#D93025]'
                    : 'bg-[#1A73E8] hover:bg-[#155724]'
                }`}
              >
                {confirmLabel}
              </button>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};
