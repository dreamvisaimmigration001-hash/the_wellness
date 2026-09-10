'use client';

import { AlertTriangle, CheckCircle2, Info, Trash2, X, Loader2 } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import React, { useState, useEffect } from 'react';

export type AlertModalVariant = 'danger' | 'warning' | 'info' | 'success';

export interface AlertModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  message: string;
  confirmText?: string;
  cancelText?: string;
  variant?: AlertModalVariant;
  onConfirm?: () => Promise<void> | void;
  isAlertOnly?: boolean;
}

export default function AlertModal({
  isOpen,
  onClose,
  title,
  message,
  confirmText = 'Confirm',
  cancelText = 'Cancel',
  variant = 'danger',
  onConfirm,
  isAlertOnly = false,
}: AlertModalProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Close on Escape key
  useEffect(() => {
    if (!isOpen) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && !isSubmitting) {
        onClose();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [isOpen, isSubmitting, onClose]);

  const handleConfirm = async () => {
    if (!onConfirm) {
      onClose();
      return;
    }

    try {
      setIsSubmitting(true);
      await onConfirm();
      onClose();
    } catch (err) {
      console.error('AlertModal action error:', err);
    } finally {
      setIsSubmitting(false);
    }
  };

  const getVariantStyles = () => {
    switch (variant) {
      case 'danger':
        return {
          icon: <Trash2 size={24} className="text-rose-600" />,
          iconBg: 'bg-rose-50 border-rose-200 text-rose-600',
          confirmBtn:
            'bg-rose-600 hover:bg-rose-700 text-white shadow-rose-200/60 focus:ring-rose-400',
        };
      case 'warning':
        return {
          icon: <AlertTriangle size={24} className="text-amber-600" />,
          iconBg: 'bg-amber-50 border-amber-200 text-amber-600',
          confirmBtn:
            'bg-amber-600 hover:bg-amber-700 text-white shadow-amber-200/60 focus:ring-amber-400',
        };
      case 'success':
        return {
          icon: <CheckCircle2 size={24} className="text-emerald-600" />,
          iconBg: 'bg-emerald-50 border-emerald-200 text-emerald-600',
          confirmBtn:
            'bg-emerald-600 hover:bg-emerald-700 text-white shadow-emerald-200/60 focus:ring-emerald-400',
        };
      case 'info':
      default:
        return {
          icon: <Info size={24} className="text-wellness-navy" />,
          iconBg: 'bg-blue-50 border-blue-200 text-wellness-navy',
          confirmBtn:
            'bg-wellness-navy hover:bg-wellness-green text-white shadow-wellness-navy/20 focus:ring-wellness-green',
        };
    }
  };

  const styles = getVariantStyles();

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[100000] flex items-center justify-center p-4 sm:p-6 overflow-y-auto">
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            onClick={() => {
              if (!isSubmitting) onClose();
            }}
            className="fixed inset-0 bg-wellness-navy/60 backdrop-blur-md"
          />

          {/* Modal Container */}
          <motion.div
            initial={{ opacity: 0, scale: 0.94, y: 10 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.94, y: 10 }}
            transition={{ type: 'spring', damping: 25, stiffness: 350 }}
            className="relative w-full max-w-md bg-white rounded-3xl p-6 sm:p-7 shadow-2xl border border-wellness-gray-200 z-10 overflow-hidden"
          >
            {/* Close Button */}
            <button
              type="button"
              disabled={isSubmitting}
              onClick={onClose}
              className="absolute top-5 right-5 text-wellness-charcoal/40 hover:text-wellness-navy p-1.5 rounded-full hover:bg-wellness-gray-100 transition-colors disabled:opacity-40 cursor-pointer"
              aria-label="Close dialog"
            >
              <X size={18} />
            </button>

            <div className="flex items-start gap-4">
              {/* Icon badge */}
              <div
                className={`w-12 h-12 rounded-2xl border flex items-center justify-center shrink-0 shadow-xs ${styles.iconBg}`}
              >
                {styles.icon}
              </div>

              {/* Text content */}
              <div className="space-y-1.5 pt-0.5 min-w-0 flex-1">
                <h3 className="text-base font-heading font-extrabold text-wellness-navy tracking-tight">
                  {title}
                </h3>
                <p className="text-xs text-wellness-charcoal/70 leading-relaxed font-medium break-words">
                  {message}
                </p>
              </div>
            </div>

            {/* Actions footer */}
            <div className="mt-6 pt-4 border-t border-wellness-gray-150 flex items-center justify-end gap-2.5">
              {!isAlertOnly && (
                <button
                  type="button"
                  disabled={isSubmitting}
                  onClick={onClose}
                  className="px-4 py-2.5 rounded-xl border border-wellness-gray-200 text-wellness-navy font-bold text-xs hover:bg-wellness-gray-50 active:bg-wellness-gray-100 transition-colors cursor-pointer disabled:opacity-50"
                >
                  {cancelText}
                </button>
              )}

              <button
                type="button"
                disabled={isSubmitting}
                onClick={() => {
                  void handleConfirm();
                }}
                className={`px-5 py-2.5 rounded-xl font-bold text-xs shadow-sm transition-all flex items-center gap-2 cursor-pointer disabled:opacity-50 focus:outline-none focus:ring-2 focus:ring-offset-1 ${styles.confirmBtn}`}
              >
                {isSubmitting ? (
                  <>
                    <Loader2 size={14} className="animate-spin" />
                    <span>Processing...</span>
                  </>
                ) : (
                  <span>{confirmText}</span>
                )}
              </button>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
