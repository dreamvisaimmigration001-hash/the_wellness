'use client';

import { ArrowRight, Tag } from 'lucide-react';
import Link from 'next/link';
import React, { useRef } from 'react';

export interface PromotionItem {
  id: string;
  title: string;
  description?: string | null;
  discountPercentage?: number | null;
  targetUrl?: string | null;
  bannerType?: string;
  badge?: string | null;
}

interface PromoBannersProps {
  promotions?: PromotionItem[];
  loading?: boolean;
}

export default function PromoBanners({ promotions = [], loading = false }: PromoBannersProps) {
  const container = useRef<HTMLDivElement>(null);

  if (!loading && promotions.length === 0) {
    return null;
  }

  if (loading) {
    return null;
  }

  return (
    <section
      ref={container}
      className="py-12 md:py-16 bg-[#FAF9F6] border-b border-wellness-gray-200/60"
    >
      <div className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-8 gap-3">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="w-2 h-2 rounded-full bg-wellness-green" />
              <span className="text-[11px] font-extrabold uppercase tracking-widest text-wellness-green">
                Featured Value Offers
              </span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-heading font-black text-wellness-navy">
              Special Therapeutic Ranges
            </h2>
          </div>
          <p className="text-xs text-wellness-charcoal/60 max-w-sm font-medium">
            Curated clinical bundles and monthly subscription refills delivered with verified cold
            chain.
          </p>
        </div>

        {/* Banners Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {promotions.map((item, idx) => {
            const tag = item.discountPercentage
              ? `${String(item.discountPercentage)}% OFF`
              : item.badge || 'SPECIAL OFFER';
            const desc =
              item.description || 'Special clinical promotion and verified formulations.';
            const link = item.targetUrl || '/products';

            const bgGradients = [
              'from-wellness-navy via-[#142d50] to-[#1a3a60]',
              'from-emerald-950 via-[#0a382c] to-teal-950',
              'from-[#1e293b] via-[#334155] to-[#1e293b]',
            ];

            return (
              <div
                key={item.id}
                className={`group relative overflow-hidden rounded-[28px] p-6 sm:p-8 border border-wellness-navy/20 bg-gradient-to-br ${
                  bgGradients[idx % bgGradients.length]
                } text-white flex flex-col justify-between min-h-[250px] shadow-md hover:shadow-xl transition-all duration-300`}
              >
                {/* Glowing Orb */}
                <div className="absolute -right-8 -top-8 w-36 h-36 rounded-full blur-2xl pointer-events-none -z-10 bg-wellness-green/20" />

                {/* Top Tag & Info */}
                <div className="space-y-3">
                  <span className="inline-block bg-white/15 backdrop-blur-md px-3 py-1 rounded-md text-[10px] font-black uppercase tracking-wider">
                    {tag}
                  </span>

                  <div className="space-y-1.5">
                    <h3 className="text-lg sm:text-xl font-heading font-bold leading-tight tracking-tight">
                      {item.title}
                    </h3>
                    <p className="text-xs text-white/75 font-normal leading-relaxed">{desc}</p>
                  </div>
                </div>

                {/* Bottom CTA */}
                <div className="flex justify-between items-end mt-6 pt-4 border-t border-white/10">
                  <Link
                    href={link}
                    className="inline-flex items-center gap-1.5 bg-white text-wellness-navy text-xs font-bold uppercase tracking-wider px-4 py-2.5 rounded-xl hover:bg-wellness-green hover:text-white transition-all duration-300 shadow-sm"
                  >
                    <span>Shop Range</span>
                    <ArrowRight
                      size={13}
                      className="group-hover:translate-x-1 transition-transform"
                    />
                  </Link>

                  <div className="w-10 h-10 rounded-xl bg-white/10 flex items-center justify-center text-white/60 group-hover:scale-110 group-hover:rotate-6 transition-all duration-300">
                    <Tag size={18} />
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
