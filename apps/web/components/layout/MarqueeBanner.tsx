'use client';

import {
  ShieldCheck,
  Truck,
  FlaskConical,
  Stethoscope,
  Sparkles,
  Award,
  HeartPulse,
  Lock,
} from 'lucide-react';
import React from 'react';

const MARQUEE_ITEMS = [
  {
    icon: ShieldCheck,
    title: 'WHO-GMP Certified',
    subtitle: 'Grade A/B Cleanrooms',
  },
  {
    icon: Truck,
    title: 'Cold-Chain Delivery',
    subtitle: 'Temp-Monitored Transit',
  },
  {
    icon: FlaskConical,
    title: '3rd-Party Lab Tested',
    subtitle: '100% Batch Released',
  },
  {
    icon: Stethoscope,
    title: 'Clinical Specialist Oversight',
    subtitle: 'Physician Approved',
  },
  {
    icon: Sparkles,
    title: 'High Bioavailability',
    subtitle: 'Active Therapeutic Yield',
  },
  {
    icon: Award,
    title: 'ISO 9001:2015 Accredited',
    subtitle: 'End-to-End Traceability',
  },
  {
    icon: HeartPulse,
    title: 'Evidence-Based Formulations',
    subtitle: 'Pure Clinical Potency',
  },
  {
    icon: Lock,
    title: 'Tamper-Evident Medical Packaging',
    subtitle: 'Batch Coded & Sealed',
  },
];

export default function MarqueeBanner() {
  // Duplicate array to achieve infinite seamless 50% translation loop
  const displayItems = [...MARQUEE_ITEMS, ...MARQUEE_ITEMS];

  return (
    <aside
      aria-label="Clinical quality & trust highlights"
      className="bg-[#060e1a] text-wellness-light-green border-t border-slate-800/80 border-b border-slate-800/50 relative overflow-hidden py-4 sm:py-4.5 select-none group"
    >
      {/* Left and Right Edge Gradient Masks */}
      <div className="pointer-events-none absolute inset-y-0 left-0 w-16 sm:w-32 md:w-44 bg-gradient-to-r from-[#060e1a] to-transparent z-10" />
      <div className="pointer-events-none absolute inset-y-0 right-0 w-16 sm:w-32 md:w-44 bg-gradient-to-l from-[#060e1a] to-transparent z-10" />

      {/* Marquee Track */}
      <div className="flex animate-marquee items-center gap-8 sm:gap-12">
        {displayItems.map((item, idx) => {
          const Icon = item.icon;
          return (
            <div
              key={`${item.title}-${String(idx)}`}
              className="flex items-center gap-3 shrink-0 transition-opacity duration-200"
            >
              {/* Icon badge */}
              <div className="w-8 h-8 rounded-xl bg-wellness-green/15 text-wellness-green border border-wellness-green/30 flex items-center justify-center shrink-0 shadow-xs">
                <Icon size={16} className="stroke-[2.2]" />
              </div>

              {/* Text pair */}
              <div className="flex items-baseline gap-2">
                <span className="text-xs sm:text-sm font-heading font-black tracking-wider uppercase text-white whitespace-nowrap">
                  {item.title}
                </span>
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest hidden sm:inline whitespace-nowrap">
                  {item.subtitle}
                </span>
              </div>

              {/* Dot divider */}
              <div className="w-1.5 h-1.5 rounded-full bg-wellness-green/50 ml-5 sm:ml-8 shrink-0" />
            </div>
          );
        })}
      </div>
    </aside>
  );
}
