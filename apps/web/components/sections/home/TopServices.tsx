'use client';

import { Stethoscope, UserCheck, Truck, ClipboardList } from 'lucide-react';
import React from 'react';

const SERVICES = [
  {
    title: 'Find Specialist',
    description: 'Consult certified doctors & pharmacists from home.',
    icon: Stethoscope,
  },
  {
    title: 'Consultation Near You',
    description: 'Book trusted clinic appointments & specialist guidance easily.',
    icon: UserCheck,
  },
  {
    title: 'Quick Delivery 24/7',
    description: 'Doorstep medicines delivered in temperature-safe packaging.',
    icon: Truck,
  },
  {
    title: 'Diagnostic Health Tests',
    description: 'Accurate clinical diagnostics and routine health checkups.',
    icon: ClipboardList,
  },
];

export default function TopServices() {
  return (
    <section className="py-12 md:py-16 bg-white border-b border-slate-100">
      <div className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center mb-10">
          <h2 className="text-2xl sm:text-3xl font-heading font-black text-[#0F2744]">
            Top Services For You
          </h2>
          <div className="w-12 h-1 bg-slate-300 rounded-full mx-auto mt-2.5" />
        </div>

        {/* 4 Pastel Cards Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {SERVICES.map((service) => {
            const Icon = service.icon;
            return (
              <div
                key={service.title}
                className="group p-6 rounded-2xl bg-[#EAF3FE] border border-[#D5E6FC] transition-all duration-300 flex flex-col justify-between min-h-[160px] shadow-xs"
              >
                <div className="space-y-3">
                  <div className="w-11 h-11 rounded-xl bg-white text-[#1D4ED8] flex items-center justify-center shadow-xs transition-transform group-hover:scale-105">
                    <Icon size={22} className="stroke-[2.2]" />
                  </div>
                  <div>
                    <h3 className="font-heading font-bold text-base text-[#0F2744]">
                      {service.title}
                    </h3>
                    <p className="text-xs text-slate-600 mt-1 leading-relaxed font-medium">
                      {service.description}
                    </p>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
