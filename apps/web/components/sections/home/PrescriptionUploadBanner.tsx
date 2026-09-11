'use client';

import { UploadCloud, ShieldCheck, PhoneCall } from 'lucide-react';
import Image from 'next/image';
import React, { useState } from 'react';

import QuickRxUploadModal from '@/components/ui/QuickRxUploadModal';

export default function PrescriptionUploadBanner() {
  const [isRxModalOpen, setIsRxModalOpen] = useState(false);

  return (
    <>
      <section className="py-12 md:py-16 bg-[#FAF9F6] border-b border-wellness-gray-200/60">
        <div className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-8">
          <div className="relative rounded-[32px] overflow-hidden bg-gradient-to-r from-wellness-navy via-[#103055] to-teal-950 text-white p-6 sm:p-10 lg:p-12 shadow-xl">
            {/* Background Decorative Rings */}
            <div className="absolute -top-24 -right-24 w-96 h-96 rounded-full bg-emerald-500/10 blur-3xl pointer-events-none" />
            <div className="absolute bottom-0 right-1/3 w-64 h-64 rounded-full bg-teal-400/10 blur-2xl pointer-events-none" />

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center relative z-10">
              {/* Left Text & Workflow Steps */}
              <div className="lg:col-span-7 space-y-6">
                <div className="inline-flex items-center gap-2 bg-wellness-green/20 text-wellness-light-green border border-wellness-green/30 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider">
                  <ShieldCheck size={14} />
                  <span>Licensed Tele-Pharmacy Service</span>
                </div>

                <h2 className="text-2xl sm:text-4xl lg:text-5xl font-heading font-black leading-tight">
                  Upload Prescription &amp; <br />
                  <span className="text-wellness-green">Get Medicines Delivered</span>
                </h2>

                <p className="text-xs sm:text-sm text-white/80 max-w-xl leading-relaxed font-normal">
                  Don&apos;t spend hours searching for individual generic formulations. Simply
                  upload your doctor&apos;s valid prescription and our licensed pharmacists will
                  verify dosages, coordinate with your physician, and deliver safely to your door.
                </p>

                {/* 3 Steps Visual Indicators */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-2">
                  <div className="bg-white/10 backdrop-blur-md p-3.5 rounded-2xl border border-white/10 flex items-center gap-3">
                    <div className="w-8 h-8 rounded-xl bg-wellness-green text-white font-black text-xs flex items-center justify-center shrink-0">
                      1
                    </div>
                    <div>
                      <h4 className="text-xs font-bold text-white">Upload Rx</h4>
                      <p className="text-[10px] text-white/70">Photo or PDF document</p>
                    </div>
                  </div>

                  <div className="bg-white/10 backdrop-blur-md p-3.5 rounded-2xl border border-white/10 flex items-center gap-3">
                    <div className="w-8 h-8 rounded-xl bg-wellness-green text-white font-black text-xs flex items-center justify-center shrink-0">
                      2
                    </div>
                    <div>
                      <h4 className="text-xs font-bold text-white">Pharmacist Review</h4>
                      <p className="text-[10px] text-white/70">Dose verification</p>
                    </div>
                  </div>

                  <div className="bg-white/10 backdrop-blur-md p-3.5 rounded-2xl border border-white/10 flex items-center gap-3">
                    <div className="w-8 h-8 rounded-xl bg-wellness-green text-white font-black text-xs flex items-center justify-center shrink-0">
                      3
                    </div>
                    <div>
                      <h4 className="text-xs font-bold text-white">Cold-Chain Delivery</h4>
                      <p className="text-[10px] text-white/70">Dispatched in 24-48h</p>
                    </div>
                  </div>
                </div>

                {/* CTA Action Buttons */}
                <div className="flex flex-wrap items-center gap-4 pt-2">
                  <button
                    type="button"
                    onClick={() => {
                      setIsRxModalOpen(true);
                    }}
                    className="inline-flex items-center gap-2 bg-wellness-green hover:bg-white hover:text-wellness-navy text-white text-xs sm:text-sm font-bold uppercase tracking-wider px-7 py-4 rounded-xl transition-all duration-300 shadow-lg cursor-pointer"
                  >
                    <UploadCloud size={18} />
                    <span>Upload Prescription Now</span>
                  </button>

                  <a
                    href="tel:+918001234567"
                    className="inline-flex items-center gap-2 bg-white/10 hover:bg-white/20 text-white text-xs sm:text-sm font-bold px-5 py-4 rounded-xl transition-colors border border-white/15"
                  >
                    <PhoneCall size={16} className="text-wellness-green" />
                    <span>Call a Pharmacist</span>
                  </a>
                </div>
              </div>

              {/* Right Visual Image */}
              <div className="lg:col-span-5 flex justify-center items-center">
                <div className="relative w-full max-w-[420px] aspect-[16/10] sm:aspect-[16/9] rounded-2xl overflow-hidden shadow-2xl border border-white/20">
                  <Image
                    src="/images/home/prescription_pad_art.jpg"
                    alt="Prescription Verification and Safe Packaging"
                    fill
                    sizes="(max-width: 768px) 100vw, 420px"
                    className="object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-wellness-navy/60 via-transparent to-transparent pointer-events-none" />
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Prescription Upload Modal */}
      <QuickRxUploadModal
        isOpen={isRxModalOpen}
        onClose={() => {
          setIsRxModalOpen(false);
        }}
      />
    </>
  );
}
