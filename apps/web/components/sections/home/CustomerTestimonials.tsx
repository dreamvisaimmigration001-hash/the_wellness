'use client';

import { Star, Quote, ChevronLeft, ChevronRight, CheckCircle2 } from 'lucide-react';
import React, { useState } from 'react';

export interface ReviewItem {
  id?: string;
  name: string;
  avatarText?: string | null;
  designation?: string | null;
  rating: number;
  comment: string;
}

const DEFAULT_TESTIMONIALS: ReviewItem[] = [
  {
    name: 'Anita Sharma',
    avatarText: 'AS',
    designation: 'Verified Patient',
    rating: 5,
    comment:
      'Very fast delivery and genuine products. The medicines were safely packed with batch codes verified. Highly recommended for chronic care regimens!',
  },
  {
    name: 'Dr. Rohit Verma',
    avatarText: 'RV',
    designation: 'Clinical Pharmacist',
    rating: 5,
    comment:
      'The purity standards and laboratory testing documentation give me complete confidence in recommending their neuro and cardiac therapeutics.',
  },
  {
    name: 'Priya Nair',
    avatarText: 'PN',
    designation: 'Verified Patient',
    rating: 5,
    comment:
      'Great offers and transparent pricing. Received cold-chain medicines on time in pristine insulated packaging with temperature indicators intact.',
  },
  {
    name: 'Karan Malhotra',
    avatarText: 'KM',
    designation: 'Verified Buyer',
    rating: 5,
    comment:
      'The automated prescription verification was quick and hassle-free. Customer support helped explain the dosage details with complete clarity.',
  },
  {
    name: 'Dr. Meera Iyer',
    avatarText: 'MI',
    designation: 'Preventive Care Physician',
    rating: 5,
    comment:
      'Consistently high bioavailability in their supplements. The third-party lot verification sets a new benchmark in digital healthcare.',
  },
];

interface CustomerTestimonialsProps {
  reviews?: ReviewItem[];
}

export default function CustomerTestimonials({ reviews = [] }: CustomerTestimonialsProps) {
  const activeTestimonials = reviews.length > 0 ? reviews : DEFAULT_TESTIMONIALS;
  const [currentIndex, setCurrentIndex] = useState(0);

  const handlePrev = () => {
    setCurrentIndex((prev) => (prev === 0 ? activeTestimonials.length - 1 : prev - 1));
  };

  const handleNext = () => {
    setCurrentIndex((prev) => (prev === activeTestimonials.length - 1 ? 0 : prev + 1));
  };

  // Get current active items for responsive display:
  // Mobile: 1 card, Tablet: 2 cards, Desktop: 3 cards
  const firstItem = activeTestimonials[currentIndex % activeTestimonials.length];
  const secondItem = activeTestimonials[(currentIndex + 1) % activeTestimonials.length];
  const thirdItem = activeTestimonials[(currentIndex + 2) % activeTestimonials.length];

  return (
    <section className="py-14 md:py-20 bg-[#F8FAFC] border-b border-slate-100 relative overflow-hidden">
      <div className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header with Integrated Mobile-Friendly Navigation */}
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-10">
          <div>
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-wellness-green/10 text-wellness-green text-xs font-black uppercase tracking-wider mb-3 shadow-xs">
              <Star size={13} className="fill-wellness-green text-wellness-green" />
              <span>Patient & Doctor Stories</span>
            </div>
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-heading font-black text-[#0F2744] tracking-tight">
              What Our Customers Say
            </h2>
            <p className="text-xs sm:text-sm text-slate-600 font-medium mt-1.5 max-w-xl leading-relaxed">
              Real feedback from patients, healthcare practitioners, and families who rely on our
              clinically certified therapeutics.
            </p>
          </div>

          {/* Navigation Buttons: Visible on both Mobile & Desktop */}
          <div className="flex items-center gap-2 self-end sm:self-auto shrink-0">
            <button
              type="button"
              onClick={handlePrev}
              className="w-10 h-10 rounded-xl bg-white border border-slate-200 text-wellness-navy hover:bg-wellness-navy hover:text-white flex items-center justify-center transition-all duration-200 shadow-xs hover:shadow-md cursor-pointer active:scale-95"
              aria-label="Previous testimonial"
            >
              <ChevronLeft size={20} />
            </button>
            <button
              type="button"
              onClick={handleNext}
              className="w-10 h-10 rounded-xl bg-white border border-slate-200 text-wellness-navy hover:bg-wellness-navy hover:text-white flex items-center justify-center transition-all duration-200 shadow-xs hover:shadow-md cursor-pointer active:scale-95"
              aria-label="Next testimonial"
            >
              <ChevronRight size={20} />
            </button>
          </div>
        </div>

        {/* Testimonials Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {/* Card 1: Always visible on all screens */}
          <TestimonialCard item={firstItem} />

          {/* Card 2: Visible on Tablet and Desktop */}
          <div className="hidden md:block">
            <TestimonialCard item={secondItem} />
          </div>

          {/* Card 3: Visible on Desktop */}
          <div className="hidden lg:block">
            <TestimonialCard item={thirdItem} />
          </div>
        </div>

        {/* Carousel Indicator Dots */}
        <div className="flex items-center justify-center gap-2 mt-8">
          {activeTestimonials.map((_, dotIdx) => (
            <button
              key={dotIdx}
              type="button"
              onClick={() => {
                setCurrentIndex(dotIdx);
              }}
              className={`h-2 rounded-full transition-all cursor-pointer ${
                dotIdx === currentIndex
                  ? 'w-7 bg-wellness-navy'
                  : 'w-2 bg-slate-300 hover:bg-slate-400'
              }`}
              aria-label={`Go to slide ${String(dotIdx + 1)}`}
            />
          ))}
        </div>
      </div>
    </section>
  );
}

function TestimonialCard({ item }: { item: ReviewItem }) {
  return (
    <div className="bg-white border border-slate-200/80 rounded-3xl p-6 sm:p-7 flex flex-col justify-between shadow-xs hover:border-wellness-green/40 hover:shadow-xl hover:-translate-y-0.5 transition-all duration-300 h-full">
      <div className="space-y-4">
        {/* Top Header: Quote Mark + Star Rating */}
        <div className="flex items-center justify-between">
          <div className="w-10 h-10 rounded-2xl bg-wellness-green/10 text-wellness-green flex items-center justify-center shadow-xs">
            <Quote size={18} className="fill-wellness-green/20 stroke-wellness-green" />
          </div>

          <div className="flex items-center gap-1 bg-amber-50 border border-amber-200/60 px-2.5 py-1 rounded-full">
            <div className="flex items-center gap-0.5 text-amber-500">
              {[1, 2, 3, 4, 5].slice(0, item.rating).map((starNum) => (
                <Star key={starNum} size={13} className="fill-amber-400 text-amber-400" />
              ))}
            </div>
            <span className="text-[11px] font-black text-amber-700 ml-1">
              {item.rating.toFixed(1)}
            </span>
          </div>
        </div>

        {/* Comment Text */}
        <p className="text-xs sm:text-sm text-slate-700 leading-relaxed font-medium min-h-[64px] italic">
          &ldquo;{item.comment}&rdquo;
        </p>
      </div>

      {/* Customer Verification Footer */}
      <div className="pt-5 mt-5 border-t border-slate-100 flex items-center justify-between gap-3">
        <div className="flex items-center gap-3 min-w-0">
          <div className="w-10 h-10 rounded-full bg-wellness-navy text-wellness-light-green flex items-center justify-center text-xs font-black shrink-0 shadow-xs">
            {item.avatarText || item.name.slice(0, 2).toUpperCase()}
          </div>
          <div className="min-w-0">
            <h4 className="text-xs sm:text-sm font-bold text-[#0F2744] truncate">{item.name}</h4>
            <div className="flex items-center gap-1 text-[11px] font-semibold text-slate-500 mt-0.5">
              <CheckCircle2 size={12} className="text-wellness-green shrink-0" />
              <span className="truncate">{item.designation || 'Verified Patient'}</span>
            </div>
          </div>
        </div>

        <span className="text-[10px] font-bold uppercase tracking-wider text-wellness-green bg-wellness-green/10 px-2.5 py-0.5 rounded-full shrink-0">
          Verified
        </span>
      </div>
    </div>
  );
}
