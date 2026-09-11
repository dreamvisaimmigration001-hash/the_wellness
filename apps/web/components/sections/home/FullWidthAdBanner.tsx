'use client';

import { ChevronLeft, ChevronRight } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import React, { useState, useEffect, useCallback } from 'react';

export interface PromotionBannerItem {
  id: string;
  title: string;
  imageUrl: string;
  targetUrl: string;
  discountText?: string | null;
  description?: string | null;
  isActive?: boolean;
}

interface FullWidthAdBannerProps {
  banners?: PromotionBannerItem[];
  loading?: boolean;
}

const DEFAULT_BANNER: PromotionBannerItem = {
  id: 'clinical-therapeutics-banner',
  title: 'Advanced Clinical Therapeutics & Bioactive Formulations',
  imageUrl: '/images/clinical_ad_banner.jpg',
  targetUrl: '/products',
  discountText: 'UP TO 25% OFF',
  description:
    'Pharmaceutical-grade active bioavailability, batch-certified purity, and ISO/WHO-GMP verified quality.',
  isActive: true,
};

const DEFAULT_BANNERS: PromotionBannerItem[] = [
  DEFAULT_BANNER,
  {
    id: 'coldchain-logistics-banner',
    title: 'Certified Cold-Chain Prescription Delivery',
    imageUrl: '/images/coldchain_ad_banner.jpg',
    targetUrl: '/products',
    discountText: 'CLINICAL COLD-CHAIN',
    description:
      'Precision temperature-monitored distribution ensuring maximum therapeutic potency from lab to doorstep.',
    isActive: true,
  },
];

export default function FullWidthAdBanner({
  banners = [],
  loading = false,
}: FullWidthAdBannerProps) {
  // Use active banners provided or default fallback if none uploaded yet
  const activeBanners = banners.filter((b) => b.isActive !== false);
  const displayBanners = activeBanners.length > 0 ? activeBanners : DEFAULT_BANNERS;

  const [currentIndex, setCurrentIndex] = useState(0);
  const [isPaused, setIsPaused] = useState(false);

  const totalBanners = displayBanners.length;

  const handleNext = useCallback(() => {
    setCurrentIndex((prev) => (prev + 1) % totalBanners);
  }, [totalBanners]);

  const handlePrev = useCallback(() => {
    setCurrentIndex((prev) => (prev - 1 + totalBanners) % totalBanners);
  }, [totalBanners]);

  // Auto-play timer (changes slide every 6 seconds if multiple banners exist)
  useEffect(() => {
    if (totalBanners <= 1 || isPaused) return;

    const timer = setInterval(() => {
      handleNext();
    }, 6000);

    return () => {
      clearInterval(timer);
    };
  }, [totalBanners, isPaused, handleNext]);

  if (loading && displayBanners.length === 0) {
    return (
      <section className="w-full py-2 bg-slate-100/50 animate-pulse">
        <div className="w-full h-[220px] sm:h-[300px] md:h-[380px] lg:h-[440px] bg-slate-200" />
      </section>
    );
  }

  const currentBanner = displayBanners[currentIndex] ?? DEFAULT_BANNER;
  const isExternalImage =
    currentBanner.imageUrl.startsWith('http://') ||
    currentBanner.imageUrl.startsWith('https://') ||
    currentBanner.imageUrl.startsWith('data:');

  return (
    <section
      aria-label="Promotional Advertisement Banner"
      className="w-full relative overflow-hidden bg-wellness-navy/5 my-4 md:my-8 group"
      onMouseEnter={() => {
        setIsPaused(true);
      }}
      onMouseLeave={() => {
        setIsPaused(false);
      }}
    >
      <div className="w-full relative h-[200px] sm:h-[280px] md:h-[360px] lg:h-[440px] xl:h-[480px] overflow-hidden">
        <Link
          href={currentBanner.targetUrl || '/products'}
          className="block w-full h-full relative cursor-pointer select-none"
        >
          {/* Background Image Banner */}
          <div className="absolute inset-0 w-full h-full bg-slate-900">
            <Image
              key={currentBanner.id}
              src={currentBanner.imageUrl}
              alt={currentBanner.title || 'Promotional Advertisement Banner'}
              fill
              priority
              sizes="100vw"
              className="object-cover object-center transition-transform duration-700 ease-out group-hover:scale-[1.015]"
              unoptimized={isExternalImage}
            />

            {/* Subtle Gradient Overlay to ensure legibility and polish */}
            <div className="absolute inset-0 bg-gradient-to-t sm:bg-gradient-to-r from-[#081324]/85 via-[#081324]/35 to-transparent z-10 transition-opacity duration-300" />
          </div>

          {/* Banner Content (Only if title or description is present) */}
          {(currentBanner.title || currentBanner.description) && (
            <div className="absolute inset-0 z-20 flex flex-col justify-center px-6 sm:px-12 md:px-16 lg:px-24 max-w-2xl text-white">
              <div className="space-y-2 sm:space-y-3">
                {currentBanner.title && (
                  <h2 className="text-xl sm:text-3xl md:text-4xl lg:text-5xl font-heading font-black tracking-tight leading-tight drop-shadow-md text-white">
                    {currentBanner.title}
                  </h2>
                )}

                {currentBanner.description && (
                  <p className="text-xs sm:text-sm md:text-base text-white/90 font-medium max-w-lg line-clamp-2 drop-shadow-sm">
                    {currentBanner.description}
                  </p>
                )}

                <div className="pt-2">
                  <span className="inline-flex items-center gap-2 bg-white hover:bg-wellness-green text-wellness-navy hover:text-white font-bold text-xs sm:text-sm px-5 py-2.5 sm:px-6 sm:py-3 rounded-full transition-all duration-300 shadow-lg group/btn">
                    <span>Shop Collection</span>
                    <span className="group-hover/btn:translate-x-1 transition-transform">→</span>
                  </span>
                </div>
              </div>
            </div>
          )}
        </Link>

        {/* Carousel Controls if multiple banners uploaded by admin/employee */}
        {totalBanners > 1 && (
          <>
            {/* Previous Button */}
            <button
              type="button"
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
                handlePrev();
              }}
              aria-label="Previous promotional banner"
              className="absolute left-4 top-1/2 -translate-y-1/2 z-30 w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-black/40 hover:bg-black/70 backdrop-blur-md text-white flex items-center justify-center transition-all duration-300 opacity-0 group-hover:opacity-100 hover:scale-105 border border-white/20 shadow-lg cursor-pointer"
            >
              <ChevronLeft size={22} />
            </button>

            {/* Next Button */}
            <button
              type="button"
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
                handleNext();
              }}
              aria-label="Next promotional banner"
              className="absolute right-4 top-1/2 -translate-y-1/2 z-30 w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-black/40 hover:bg-black/70 backdrop-blur-md text-white flex items-center justify-center transition-all duration-300 opacity-0 group-hover:opacity-100 hover:scale-105 border border-white/20 shadow-lg cursor-pointer"
            >
              <ChevronRight size={22} />
            </button>

            {/* Indicator Dots */}
            <div className="absolute bottom-4 left-1/2 -translate-x-1/2 z-30 flex items-center gap-2 bg-black/30 backdrop-blur-md px-3 py-1.5 rounded-full border border-white/10">
              {displayBanners.map((b, idx) => (
                <button
                  key={`dot-${b.id}-${String(idx)}`}
                  type="button"
                  onClick={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    setCurrentIndex(idx);
                  }}
                  aria-label={`Go to slide ${String(idx + 1)}`}
                  className={`h-2 rounded-full transition-all duration-300 cursor-pointer ${
                    idx === currentIndex
                      ? 'w-6 bg-wellness-green'
                      : 'w-2 bg-white/50 hover:bg-white'
                  }`}
                />
              ))}
            </div>
          </>
        )}
      </div>
    </section>
  );
}
