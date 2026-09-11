'use client';

import { Star, Quote, ChevronLeft, ChevronRight } from 'lucide-react';
import React, { useState } from 'react';

const TESTIMONIALS = [
  {
    name: 'Anita Sharma',
    avatarText: 'AS',
    rating: 5,
    comment:
      'Very fast delivery and genuine products. The medicines were safely packed with batch codes verified. Highly recommended!',
  },
  {
    name: 'Rohit Verma',
    avatarText: 'RV',
    rating: 5,
    comment:
      'Excellent service and prompt support for dosage advice. Website is super smooth and easy to order from.',
  },
  {
    name: 'Priya Nair',
    avatarText: 'PN',
    rating: 5,
    comment:
      'Great offers and transparent pricing. Received cold-chain medicines on time in pristine insulated packaging.',
  },
];

export default function CustomerTestimonials() {
  const [currentIndex, setCurrentIndex] = useState(0);

  const handlePrev = () => {
    setCurrentIndex((prev) => (prev === 0 ? TESTIMONIALS.length - 1 : prev - 1));
  };

  const handleNext = () => {
    setCurrentIndex((prev) => (prev === TESTIMONIALS.length - 1 ? 0 : prev + 1));
  };

  return (
    <section className="py-14 md:py-20 bg-[#F8FAFC] border-b border-slate-100">
      <div className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-8">
        {/* Centered Title */}
        <div className="text-center mb-10">
          <h2 className="text-2xl sm:text-3xl font-heading font-black text-[#0F2744]">
            What Our Customers Say
          </h2>
          <div className="w-12 h-1 bg-slate-300 rounded-full mx-auto mt-2.5" />
        </div>

        {/* Carousel Container */}
        <div className="relative">
          {/* Left Arrow */}
          <button
            type="button"
            onClick={handlePrev}
            className="hidden lg:flex absolute -left-5 top-1/2 -translate-y-1/2 z-20 w-10 h-10 rounded-full bg-white border border-slate-200 text-slate-700 items-center justify-center shadow-md hover:bg-[#0F2744] hover:text-white transition-all cursor-pointer"
            aria-label="Previous review"
          >
            <ChevronLeft size={20} />
          </button>

          {/* Right Arrow */}
          <button
            type="button"
            onClick={handleNext}
            className="hidden lg:flex absolute -right-5 top-1/2 -translate-y-1/2 z-20 w-10 h-10 rounded-full bg-white border border-slate-200 text-slate-700 items-center justify-center shadow-md hover:bg-[#0F2744] hover:text-white transition-all cursor-pointer"
            aria-label="Next review"
          >
            <ChevronRight size={20} />
          </button>

          {/* 3 Review Cards Grid */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {TESTIMONIALS.map((t, idx) => (
              <div
                key={t.name}
                className={`bg-white border rounded-2xl p-6 sm:p-7 flex flex-col justify-between shadow-xs transition-all duration-300 ${
                  idx === currentIndex
                    ? 'border-blue-300 shadow-md ring-1 ring-blue-100'
                    : 'border-slate-200/90'
                }`}
              >
                <div className="space-y-4">
                  {/* Quote Icon */}
                  <div className="w-9 h-9 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center">
                    <Quote size={18} className="fill-blue-600/20 stroke-blue-600" />
                  </div>

                  {/* Comment */}
                  <p className="text-xs sm:text-sm text-slate-600 leading-relaxed italic">
                    &ldquo;{t.comment}&rdquo;
                  </p>

                  {/* 5 Stars */}
                  <div className="flex items-center gap-1 text-amber-400">
                    {[1, 2, 3, 4, 5].slice(0, t.rating).map((starNum) => (
                      <Star key={starNum} size={14} className="fill-amber-400 text-amber-400" />
                    ))}
                  </div>
                </div>

                {/* Customer Details */}
                <div className="pt-5 mt-5 border-t border-slate-100 flex items-center gap-3">
                  <div className="w-9 h-9 rounded-full bg-[#0F2744] text-white flex items-center justify-center text-xs font-bold shrink-0">
                    {t.avatarText}
                  </div>
                  <div>
                    <h4 className="text-xs font-bold text-[#0F2744]">{t.name}</h4>
                    <span className="text-[10px] text-slate-400 font-medium">Verified Patient</span>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* 3 Carousel Indicator Dots */}
          <div className="flex items-center justify-center gap-2 mt-8">
            {TESTIMONIALS.map((_, dotIdx) => (
              <button
                key={dotIdx}
                type="button"
                onClick={() => {
                  setCurrentIndex(dotIdx);
                }}
                className={`w-2 h-2 rounded-full transition-all cursor-pointer ${
                  dotIdx === currentIndex ? 'w-6 bg-blue-600' : 'bg-slate-300 hover:bg-slate-400'
                }`}
                aria-label={`Slide ${String(dotIdx + 1)}`}
              />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
