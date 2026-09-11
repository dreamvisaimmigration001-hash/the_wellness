'use client';

import { CheckCircle2, ShieldCheck, Video, Clock } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import React from 'react';

export default function DoctorConsultBanner() {
  return (
    <section className="py-12 md:py-16 bg-[#F8FAFC] border-b border-slate-100">
      <div className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-white rounded-3xl border border-slate-200/90 p-6 sm:p-10 lg:p-12 shadow-sm">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">
            {/* Left: Doctor Visual + Floating Assurances Card */}
            <div className="lg:col-span-6 relative flex justify-center">
              <div className="relative w-full max-w-[480px] aspect-[4/3] rounded-2xl overflow-hidden shadow-md border border-slate-100 bg-slate-50">
                <Image
                  src="/images/home/telehealth_doctor.jpg"
                  alt="Doctor consulting online via laptop"
                  fill
                  sizes="(max-width: 768px) 100vw, 480px"
                  className="object-cover"
                />

                {/* Left Floating Badge: Consult From Home */}
                <div className="absolute top-4 left-4 bg-[#0F2744]/90 backdrop-blur-md text-white p-3.5 rounded-xl text-xs space-y-1.5 shadow-lg max-w-[170px]">
                  <div className="flex items-center gap-1.5 font-bold text-blue-200 text-[11px] pb-1 border-b border-white/10">
                    <Video size={13} />
                    <span>Consult From Home</span>
                  </div>
                  <div className="flex items-center gap-1.5 text-[10px] text-white/90">
                    <CheckCircle2 size={11} className="text-emerald-400 shrink-0" />
                    <span>Certified Doctors</span>
                  </div>
                  <div className="flex items-center gap-1.5 text-[10px] text-white/90">
                    <CheckCircle2 size={11} className="text-emerald-400 shrink-0" />
                    <span>Secure &amp; Private</span>
                  </div>
                  <div className="flex items-center gap-1.5 text-[10px] text-white/90">
                    <CheckCircle2 size={11} className="text-emerald-400 shrink-0" />
                    <span>Quick Support</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Right: Consultation Details & CTA */}
            <div className="lg:col-span-6 space-y-5">
              <span className="text-xs font-bold text-slate-500 uppercase tracking-wider block">
                Need Expert Advice?
              </span>

              <h2 className="text-2xl sm:text-4xl font-heading font-black text-[#0F2744] leading-tight">
                Consult Online <br />
                <span className="text-[#2563EB]">With Our Doctors</span>
              </h2>

              <p className="text-xs sm:text-sm text-slate-600 leading-relaxed font-medium">
                Get professional clinical guidance for your health concerns from experienced
                clinicians, general physicians, and healthcare specialists.
              </p>

              {/* 3 Checkmark Bullet Points */}
              <div className="space-y-2.5 pt-1 text-xs sm:text-sm text-slate-700 font-semibold">
                <div className="flex items-center gap-2.5">
                  <div className="w-5 h-5 rounded-full bg-blue-50 text-blue-600 flex items-center justify-center shrink-0">
                    <Video size={13} />
                  </div>
                  <span>Instant video &amp; chat consultation</span>
                </div>

                <div className="flex items-center gap-2.5">
                  <div className="w-5 h-5 rounded-full bg-blue-50 text-blue-600 flex items-center justify-center shrink-0">
                    <ShieldCheck size={13} />
                  </div>
                  <span>Dosage, interactions &amp; treatment guidance</span>
                </div>

                <div className="flex items-center gap-2.5">
                  <div className="w-5 h-5 rounded-full bg-blue-50 text-blue-600 flex items-center justify-center shrink-0">
                    <Clock size={13} />
                  </div>
                  <span>Follow-up care &amp; routine health tracking</span>
                </div>
              </div>

              {/* Book Consultation Button */}
              <div className="pt-2">
                <Link
                  href="/products"
                  className="inline-flex items-center gap-2 bg-[#0F2744] hover:bg-[#1D4ED8] text-white text-xs sm:text-sm font-bold px-7 py-3.5 rounded-full transition-all duration-300 shadow-md hover:shadow-lg active:scale-95"
                >
                  <span>Book Consultation</span>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
