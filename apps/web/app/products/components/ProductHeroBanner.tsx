'use client';

import Image from 'next/image';
import React from 'react';

interface ProductHeroBannerProps {
  activeCategory: string;
}

export default function ProductHeroBanner({ activeCategory }: ProductHeroBannerProps) {
  return (
    <div className="relative w-full h-[240px] sm:h-[360px] md:h-[500px] overflow-hidden bg-wellness-navy">
      <Image
        src="/images/products/products_hero_banner.jpg"
        alt="Premium laboratory formulations and amber dropper bottles"
        fill
        sizes="100vw"
        priority
        className="object-cover object-center brightness-[0.60]"
      />
      {/* Soft premium gradient overlay */}
      <div className="absolute inset-0 bg-gradient-to-t from-wellness-navy via-wellness-navy/50 to-transparent"></div>
      <div className="absolute inset-0 z-10 flex flex-col items-center justify-center text-center p-4 pb-12 sm:pb-24">
        <h1 className="text-2xl sm:text-5xl md:text-7xl lg:text-[7.5rem] font-heading font-black text-white tracking-[0.03em] uppercase select-none leading-tight transition-all duration-300 max-w-full px-4 truncate">
          {activeCategory === 'All' ? 'Shop' : activeCategory}
        </h1>
        <p className="hidden sm:block text-xs sm:text-sm md:text-base text-white/90 max-w-lg font-medium mt-2 sm:mt-3 leading-relaxed drop-shadow-sm px-4">
          Explore our certified clinical treatments, premium therapeutics, and evidence-based
          formulations.
        </p>
      </div>
    </div>
  );
}
