'use client';

import { ArrowRight, ShieldCheck, Clock, CheckCircle2 } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import React from 'react';

export default function Hero() {
  return (
    <section className="relative bg-gradient-to-b from-[#EBF4FE] via-[#F2F7FF] to-white pt-10 md:pt-16 pb-14 md:pb-20 overflow-hidden border-b border-blue-100/60">
      {/* Soft Background Leaf/Circle Silhouettes */}
      <div className="absolute -top-20 -left-20 w-96 h-96 rounded-full bg-blue-200/30 blur-3xl pointer-events-none" />
      <div className="absolute top-1/2 right-0 w-[500px] h-[500px] rounded-full bg-blue-100/40 blur-3xl pointer-events-none" />

      <div className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">
          {/* Left Column: Heading, Subtitle, Assurances, CTA */}
          <div className="lg:col-span-7 space-y-6">
            <h1 className="text-3xl sm:text-5xl lg:text-[3.25rem] font-heading font-black text-[#0F2744] leading-[1.12] tracking-tight">
              Healthcare, Delivered <br />
              <span className="text-[#2563EB]">To Your Doorstep</span>
            </h1>

            <p className="text-sm sm:text-base text-slate-600 max-w-lg leading-relaxed font-medium">
              Order medicines &amp; health products online with fast delivery, authentic sourcing,
              and best prices.
            </p>

            {/* 3 Inline Assurances */}
            <div className="flex flex-wrap items-center gap-4 sm:gap-6 pt-1 text-xs text-slate-700 font-semibold">
              <div className="flex items-center gap-2">
                <div className="w-5 h-5 rounded-full bg-blue-600/10 text-blue-600 flex items-center justify-center shrink-0">
                  <ShieldCheck size={14} className="stroke-[2.5]" />
                </div>
                <span>100% Genuine Products</span>
              </div>

              <div className="flex items-center gap-2">
                <div className="w-5 h-5 rounded-full bg-blue-600/10 text-blue-600 flex items-center justify-center shrink-0">
                  <CheckCircle2 size={14} className="stroke-[2.5]" />
                </div>
                <span>Secure Payments</span>
              </div>

              <div className="flex items-center gap-2">
                <div className="w-5 h-5 rounded-full bg-blue-600/10 text-blue-600 flex items-center justify-center shrink-0">
                  <Clock size={14} className="stroke-[2.5]" />
                </div>
                <span>On-time Delivery</span>
              </div>
            </div>

            {/* Order Now Button */}
            <div className="pt-2">
              <Link
                href="/products"
                className="inline-flex items-center gap-2.5 bg-[#2563EB] hover:bg-[#1D4ED8] text-white text-sm font-bold px-7 py-3.5 rounded-full transition-all duration-300 shadow-md hover:shadow-lg hover:shadow-blue-500/25 active:scale-95"
              >
                <span>Order Now</span>
                <ArrowRight size={16} />
              </Link>
            </div>
          </div>

          {/* Right Column: Circular Backdrop with Doctor Image */}
          <div className="lg:col-span-5 flex justify-center lg:justify-end relative">
            <div className="relative w-[300px] h-[340px] sm:w-[380px] sm:h-[420px] lg:w-[420px] lg:h-[460px] flex items-end justify-center">
              {/* Soft Circular Backdrop */}
              <div className="absolute inset-x-4 bottom-0 top-12 rounded-full bg-gradient-to-t from-[#B9D7FE] to-[#DCEBFE] -z-10 shadow-inner" />

              {/* Doctor Visual */}
              <div className="relative w-full h-full">
                <Image
                  src="/images/home/pharmacy_doctor_hero.jpg"
                  alt="Certified Doctor & Clinical Pharmacist"
                  fill
                  priority
                  sizes="(max-width: 768px) 340px, 420px"
                  className="object-cover object-top rounded-b-full drop-shadow-xl"
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
