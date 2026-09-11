'use client';

import Image from 'next/image';
import Link from 'next/link';
import React from 'react';

export default function AdBanners() {
  return (
    <section className="py-10 md:py-14 bg-white border-b border-slate-100">
      <div className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 items-stretch">
          {/* 1. Left Tall Banner: Vitamins & Supplements */}
          <div className="lg:col-span-4 rounded-3xl bg-gradient-to-b from-[#E7F2FE] to-[#DCECFD] p-6 sm:p-8 flex flex-col justify-between border border-[#CFE4FD] relative overflow-hidden group min-h-[340px] sm:min-h-[400px]">
            <div className="space-y-3 z-10 max-w-[240px]">
              <span className="inline-block bg-[#0F2744] text-white text-[10px] font-extrabold uppercase tracking-wider px-2.5 py-1 rounded-md">
                UP TO 25% OFF
              </span>
              <h3 className="text-2xl sm:text-3xl font-heading font-black text-[#0F2744] leading-tight">
                Vitamins &amp; Supplements
              </h3>
              <p className="text-xs text-slate-600 font-medium">
                Strengthen your immunity every day
              </p>
              <div className="pt-2">
                <Link
                  href="/products"
                  className="inline-flex items-center text-xs font-bold bg-[#0F2744] hover:bg-[#1D4ED8] text-white px-5 py-2.5 rounded-full transition-colors shadow-xs"
                >
                  Shop Now
                </Link>
              </div>
            </div>

            {/* Product Graphic */}
            <div className="absolute right-[-10px] bottom-0 w-44 h-48 sm:w-52 sm:h-56">
              <Image
                src="/images/osteoflex.png"
                alt="Vitamins and Supplements Formulation"
                fill
                className="object-contain object-bottom group-hover:scale-105 transition-transform duration-500 drop-shadow-lg"
              />
            </div>
          </div>

          {/* 2. Middle Stacked Banners: Pain Relief + Personal Care */}
          <div className="lg:col-span-4 flex flex-col gap-5 justify-between">
            {/* Middle Top: Pain Relief Range */}
            <div className="rounded-3xl bg-gradient-to-r from-[#EAF3FE] to-[#DFEEFD] p-6 flex items-center justify-between border border-[#CFE4FD] relative overflow-hidden group min-h-[160px] sm:min-h-[190px]">
              <div className="space-y-2 z-10 max-w-[190px]">
                <span className="inline-block bg-[#0F2744] text-white text-[9px] font-extrabold uppercase tracking-wider px-2 py-0.5 rounded-md">
                  FLAT 15% OFF
                </span>
                <h3 className="text-xl sm:text-2xl font-heading font-black text-[#0F2744] leading-tight">
                  Pain Relief Range
                </h3>
                <div>
                  <Link
                    href="/products"
                    className="inline-flex items-center text-xs font-bold bg-[#0F2744] hover:bg-[#1D4ED8] text-white px-4 py-2 rounded-full transition-colors shadow-xs"
                  >
                    Shop Now
                  </Link>
                </div>
              </div>
              <div className="relative w-32 h-32 sm:w-36 sm:h-36 shrink-0">
                <Image
                  src="/images/pediacetamol.png"
                  alt="Pain Relief Tablets and Formulations"
                  fill
                  className="object-contain group-hover:scale-105 transition-transform duration-500 drop-shadow-md"
                />
              </div>
            </div>

            {/* Middle Bottom: Personal Care Essentials */}
            <div className="rounded-3xl bg-gradient-to-r from-[#EAF3FE] to-[#DFEEFD] p-6 flex items-center justify-between border border-[#CFE4FD] relative overflow-hidden group min-h-[160px] sm:min-h-[190px]">
              <div className="space-y-2 z-10 max-w-[190px]">
                <span className="inline-block bg-[#0F2744] text-white text-[9px] font-extrabold uppercase tracking-wider px-2 py-0.5 rounded-md">
                  UP TO 50% OFF
                </span>
                <h3 className="text-xl sm:text-2xl font-heading font-black text-[#0F2744] leading-tight">
                  Personal Care Essentials
                </h3>
                <div>
                  <Link
                    href="/products"
                    className="inline-flex items-center text-xs font-bold bg-[#0F2744] hover:bg-[#1D4ED8] text-white px-4 py-2 rounded-full transition-colors shadow-xs"
                  >
                    Shop Now
                  </Link>
                </div>
              </div>
              <div className="relative w-32 h-32 sm:w-36 sm:h-36 shrink-0">
                <Image
                  src="/images/willmox.png"
                  alt="Personal Care and Dermatological Therapeutics"
                  fill
                  className="object-contain group-hover:scale-105 transition-transform duration-500 drop-shadow-md"
                />
              </div>
            </div>
          </div>

          {/* 3. Right Tall Banner: Subscribe & Save */}
          <div className="lg:col-span-4 rounded-3xl bg-gradient-to-b from-[#E7F2FE] to-[#DCECFD] p-6 sm:p-8 flex flex-col justify-between border border-[#CFE4FD] relative overflow-hidden group min-h-[340px] sm:min-h-[400px]">
            <div className="space-y-3 z-10 max-w-[240px]">
              <span className="inline-block bg-[#0F2744] text-white text-[10px] font-extrabold uppercase tracking-wider px-2.5 py-1 rounded-md">
                SAVE MORE
              </span>
              <h3 className="text-2xl sm:text-3xl font-heading font-black text-[#0F2744] leading-tight">
                Subscribe &amp; Save
              </h3>
              <p className="text-xs text-slate-600 font-medium">
                Extra discounts on recurring monthly orders
              </p>
              <div className="pt-2">
                <Link
                  href="/products"
                  className="inline-flex items-center text-xs font-bold bg-[#0F2744] hover:bg-[#1D4ED8] text-white px-5 py-2.5 rounded-full transition-colors shadow-xs"
                >
                  Subscribe Now
                </Link>
              </div>
            </div>

            {/* Product Graphic */}
            <div className="absolute right-[-10px] bottom-0 w-44 h-48 sm:w-52 sm:h-56">
              <Image
                src="/images/cardiostatin.png"
                alt="Monthly Health Delivery Refill"
                fill
                className="object-contain object-bottom group-hover:scale-105 transition-transform duration-500 drop-shadow-lg"
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
