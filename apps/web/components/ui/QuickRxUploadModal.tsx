'use client';

import {
  UploadCloud,
  FileText,
  X,
  CheckCircle2,
  AlertCircle,
  Phone,
  User,
  ShieldCheck,
  ArrowRight,
} from 'lucide-react';
import { AnimatePresence, motion } from 'motion/react';
import { useRouter } from 'next/navigation';
import React, { useState, useRef } from 'react';

interface QuickRxUploadModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function QuickRxUploadModal({ isOpen, onClose }: QuickRxUploadModalProps) {
  const router = useRouter();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [patientName, setPatientName] = useState('');
  const [phone, setPhone] = useState('');
  const [notes, setNotes] = useState('');
  const [error, setError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  const handleFileDrop = (e: React.DragEvent) => {
    e.preventDefault();
    const dropped = e.dataTransfer.files.item(0);
    if (dropped) {
      validateAndSetFile(dropped);
    }
  };

  const handleFileInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      validateAndSetFile(file);
    }
  };

  const validateAndSetFile = (file: File) => {
    setError('');
    const validTypes = ['image/jpeg', 'image/png', 'image/webp', 'application/pdf'];
    if (!validTypes.includes(file.type)) {
      setError('Please upload a valid image (JPG, PNG, WebP) or PDF prescription.');
      return;
    }
    if (file.size > 10 * 1024 * 1024) {
      setError('File size must be under 10MB.');
      return;
    }
    setSelectedFile(file);
  };

  const handleSubmit = (e: React.SyntheticEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!selectedFile) {
      setError('Please upload or attach your doctor prescription.');
      return;
    }
    if (!phone || phone.trim().length < 10) {
      setError('Please enter a valid 10-digit mobile phone number.');
      return;
    }

    setIsSubmitting(true);
    // Simulate upload and redirect
    setTimeout(() => {
      setIsSubmitting(false);
      setIsSuccess(true);
      setTimeout(() => {
        onClose();
        router.push('/order?step=review&rx=attached');
      }, 1200);
    }, 1000);
  };

  const handleReset = () => {
    setSelectedFile(null);
    setError('');
    setIsSuccess(false);
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[150] flex items-center justify-center p-4">
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 0.6 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-wellness-navy/80 backdrop-blur-sm cursor-pointer"
          />

          {/* Modal Card */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            transition={{ type: 'spring', damping: 25, stiffness: 300 }}
            className="relative w-full max-w-lg bg-white rounded-3xl shadow-2xl border border-wellness-gray-200 overflow-hidden z-10 max-h-[90vh] flex flex-col"
          >
            {/* Header */}
            <div className="bg-gradient-to-r from-wellness-navy to-[#183153] px-6 py-5 text-white flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-wellness-green/20 text-wellness-green flex items-center justify-center border border-wellness-green/30">
                  <FileText size={20} />
                </div>
                <div>
                  <h3 className="font-heading font-bold text-base md:text-lg">
                    Upload Doctor Prescription
                  </h3>
                  <p className="text-[11px] text-wellness-light-green/80 font-medium">
                    Verified by registered clinical pharmacists
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={onClose}
                className="w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center text-white transition-colors cursor-pointer"
                aria-label="Close modal"
              >
                <X size={16} />
              </button>
            </div>

            {/* Content Body */}
            <div className="p-6 overflow-y-auto space-y-5">
              {isSuccess ? (
                <div className="py-8 text-center space-y-3">
                  <div className="w-16 h-16 rounded-full bg-wellness-green/10 text-wellness-green flex items-center justify-center mx-auto">
                    <CheckCircle2 size={36} />
                  </div>
                  <h4 className="text-xl font-heading font-bold text-wellness-navy">
                    Prescription Uploaded!
                  </h4>
                  <p className="text-xs text-wellness-charcoal/70 max-w-xs mx-auto">
                    Our licensed pharmacist will verify the medication dosages. Redirecting you to
                    order review...
                  </p>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-4">
                  {/* Drag and Drop Zone */}
                  <div
                    onDragOver={(e) => {
                      e.preventDefault();
                    }}
                    onDrop={handleFileDrop}
                    onClick={() => {
                      fileInputRef.current?.click();
                    }}
                    className={`border-2 border-dashed rounded-2xl p-6 text-center cursor-pointer transition-all ${
                      selectedFile
                        ? 'border-wellness-green bg-emerald-50/40'
                        : 'border-wellness-gray-300 hover:border-wellness-green/60 bg-wellness-gray-50/60 hover:bg-wellness-gray-50'
                    }`}
                  >
                    <input
                      ref={fileInputRef}
                      type="file"
                      accept=".jpg,.jpeg,.png,.webp,.pdf"
                      onChange={handleFileInput}
                      className="hidden"
                    />

                    {selectedFile ? (
                      <div className="space-y-2">
                        <div className="w-12 h-12 rounded-2xl bg-wellness-green text-white flex items-center justify-center mx-auto shadow-sm">
                          <CheckCircle2 size={24} />
                        </div>
                        <p className="text-xs font-bold text-wellness-navy truncate max-w-xs mx-auto">
                          {selectedFile.name}
                        </p>
                        <p className="text-[10px] text-wellness-charcoal/50">
                          {(selectedFile.size / 1024).toFixed(1)} KB &bull; Click to change
                        </p>
                        <button
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation();
                            handleReset();
                          }}
                          className="text-[11px] font-bold text-red-500 hover:text-red-700 underline pt-1 cursor-pointer"
                        >
                          Remove file
                        </button>
                      </div>
                    ) : (
                      <div className="space-y-2">
                        <div className="w-12 h-12 rounded-2xl bg-wellness-green/10 text-wellness-green flex items-center justify-center mx-auto">
                          <UploadCloud size={26} />
                        </div>
                        <h4 className="text-xs font-bold text-wellness-navy">
                          Drag & drop your prescription, or{' '}
                          <span className="text-wellness-green underline">browse files</span>
                        </h4>
                        <p className="text-[10px] text-wellness-charcoal/50">
                          Supports JPG, PNG, WebP or PDF (up to 10MB)
                        </p>
                      </div>
                    )}
                  </div>

                  {/* Error Notification */}
                  {error && (
                    <div className="flex items-center gap-2 p-3 bg-red-50 border border-red-200 text-red-700 rounded-xl text-xs font-semibold">
                      <AlertCircle size={15} className="shrink-0" />
                      <span>{error}</span>
                    </div>
                  )}

                  {/* Patient Info Fields */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
                    <div className="space-y-1">
                      <label className="text-[11px] font-bold text-wellness-navy uppercase tracking-wider flex items-center gap-1">
                        <User size={12} className="text-wellness-green" />
                        <span>Patient Name</span>
                      </label>
                      <input
                        type="text"
                        value={patientName}
                        onChange={(e) => {
                          setPatientName(e.target.value);
                        }}
                        placeholder="e.g. John Doe"
                        className="w-full px-3.5 py-2.5 rounded-xl border border-wellness-gray-200 text-xs text-wellness-navy focus:outline-none focus:border-wellness-green transition-all"
                      />
                    </div>

                    <div className="space-y-1">
                      <label className="text-[11px] font-bold text-wellness-navy uppercase tracking-wider flex items-center gap-1">
                        <Phone size={12} className="text-wellness-green" />
                        <span>Mobile Phone *</span>
                      </label>
                      <input
                        type="tel"
                        required
                        value={phone}
                        onChange={(e) => {
                          setPhone(e.target.value);
                        }}
                        placeholder="+91 98765 43210"
                        className="w-full px-3.5 py-2.5 rounded-xl border border-wellness-gray-200 text-xs text-wellness-navy focus:outline-none focus:border-wellness-green transition-all"
                      />
                    </div>
                  </div>

                  {/* Doctor Notes */}
                  <div className="space-y-1">
                    <label className="text-[11px] font-bold text-wellness-navy uppercase tracking-wider">
                      Special Notes / Days of Supply (Optional)
                    </label>
                    <textarea
                      rows={2}
                      value={notes}
                      onChange={(e) => {
                        setNotes(e.target.value);
                      }}
                      placeholder="e.g. Need 30-day supply, please substitute with generic if available"
                      className="w-full px-3.5 py-2 rounded-xl border border-wellness-gray-200 text-xs text-wellness-navy focus:outline-none focus:border-wellness-green transition-all resize-none"
                    />
                  </div>

                  {/* Clinical Trust Note */}
                  <div className="flex items-start gap-2 p-3 bg-wellness-gray-50 rounded-xl border border-wellness-gray-200/60">
                    <ShieldCheck size={16} className="text-wellness-green shrink-0 mt-0.5" />
                    <p className="text-[10px] text-wellness-charcoal/70 leading-relaxed font-medium">
                      Our certified pharmacists will verify your doctor&apos;s credentials and
                      contact you before preparing your prescription package.
                    </p>
                  </div>

                  {/* Submit Button */}
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full py-3.5 px-6 bg-wellness-navy hover:bg-wellness-green text-white font-bold text-xs uppercase tracking-wider rounded-xl transition-all duration-300 shadow-md hover:shadow-lg flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
                  >
                    {isSubmitting ? (
                      <span>Verifying & Submitting...</span>
                    ) : (
                      <>
                        <span>Submit Prescription & Continue</span>
                        <ArrowRight size={14} />
                      </>
                    )}
                  </button>
                </form>
              )}
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
