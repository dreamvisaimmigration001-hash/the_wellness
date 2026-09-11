'use client';

import { Stethoscope, UserCheck, Truck, ClipboardList, ArrowRight } from 'lucide-react';
import Link from 'next/link';
import React from 'react';

const SERVICES = [
  {
    title: 'Find Specialist',
    description: 'Consult certified doctors & pharmacists from home.',
    icon: Stethoscope,
    href: '/products',
  },
  {
    title: 'Consultation Near You',
    description: 'Book trusted clinic appointments & specialist guidance easily.',
    icon: UserCheck,
    href: '/products',
  },
  {
    title: 'Quick Delivery 24/7',
    description: 'Doorstep medicines delivered in temperature-safe packaging.',
    icon: Truck,
    href: '/products',
  },
  {
    title: 'Diagnostic Health Tests',
    description: 'Accurate clinical diagnostics and routine health checkups.',
    icon: ClipboardList,
    href: '/account',
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
              <Link
                key={service.title}
                href={service.href}
                className="group p-6 rounded-2xl bg-[#EAF3FE] hover:bg-[#E0EEFE] border border-[#D5E6FC] transition-all duration-300 flex flex-col justify-between min-h-[170px] shadow-xs hover:shadow-md cursor-pointer"
              >
                <div className="space-y-3">
                  <div className="w-11 h-11 rounded-xl bg-white text-[#1D4ED8] flex items-center justify-center shadow-xs group-hover:scale-105 transition-transform">
                    <Icon size={22} className="stroke-[2.2]" />
                  </div>
                  <div>
                    <h3 className="font-heading font-bold text-base text-[#0F2744] group-hover:text-[#1D4ED8] transition-colors">
                      {service.title}
                    </h3>
                    <p className="text-xs text-slate-600 mt-1 leading-relaxed font-medium">
                      {service.description}
                    </p>
                  </div>
                </div>

                <div className="pt-4 flex justify-end">
                  <div className="w-8 h-8 rounded-full bg-[#1D4ED8] text-white flex items-center justify-center shadow-xs group-hover:bg-[#0F2744] group-hover:translate-x-0.5 transition-all">
                    <ArrowRight size={14} className="stroke-[2.5]" />
                  </div>
                </div>
              </Link>
            );
          })}
        </div>
      </div>
    </section>
  );
}
