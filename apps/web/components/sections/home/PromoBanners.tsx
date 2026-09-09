'use client';

import { ArrowRight, Tag } from 'lucide-react';
import Link from 'next/link';
import React, { useRef, useState, useEffect } from 'react';

import { API_BASE_URL } from '@/lib/config';

interface PromotionItem {
  id: string;
  title: string;
  description?: string | null;
  discountPercentage?: number | null;
  targetUrl?: string | null;
  bannerType?: string;
  badge?: string | null;
}

export default function PromoBanners() {
  const container = useRef<HTMLDivElement>(null);
  const [promotions, setPromotions] = useState<PromotionItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let isMounted = true;
    async function fetchPromos() {
      try {
        const res = await fetch(`${API_BASE_URL}/api/promotions`, {
          signal: AbortSignal.timeout(8000),
        });
        if (res.ok) {
          const json = (await res.json()) as {
            success?: boolean;
            data?: Array<PromotionItem & { isActive?: boolean }>;
          };
          if (json.success && Array.isArray(json.data) && isMounted) {
            const active = json.data.filter((p) => p.isActive !== false);
            setPromotions(active);
          }
        }
      } catch {
        // ignore
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    }
    void fetchPromos();
    return () => {
      isMounted = false;
    };
  }, []);

  if (loading || promotions.length === 0) {
    return null;
  }

  return (
    <section ref={container} className="py-20 bg-white border-b border-wellness-gray-200">
      <div className="container mx-auto px-6 md:px-12">
        {/* Banners Grid */}
        <div className="promo-grid grid grid-cols-1 lg:grid-cols-3 gap-8">
          {promotions.map((item) => {
            const tag = item.discountPercentage
              ? `${String(item.discountPercentage)}% OFF`
              : item.badge || 'PROMOTION';
            const desc =
              item.description || 'Special clinical promotion and verified formulations.';
            const link = item.targetUrl || '/products';

            return (
              <div
                key={item.id}
                className="promo-banner-card group relative overflow-hidden rounded-[32px] p-8 border bg-gradient-to-br from-wellness-navy to-[#183153] border-wellness-navy/35 text-white flex flex-col justify-between min-h-[280px] shadow-lg"
              >
                {/* Glowing Orb Overlay */}
                <div className="absolute -right-12 -top-12 w-40 h-40 rounded-full blur-2xl pointer-events-none -z-10 bg-wellness-green/20" />

                {/* Top Text Details */}
                <div className="space-y-4">
                  <span className="inline-block bg-white/10 backdrop-blur-md px-3.5 py-1 rounded-md text-[10px] font-black uppercase tracking-wider">
                    {tag}
                  </span>

                  <div className="space-y-2">
                    <h3 className="text-xl md:text-2xl font-heading font-bold leading-tight tracking-tight max-w-[200px]">
                      {item.title}
                    </h3>
                    <p className="text-xs text-white/70 font-semibold leading-relaxed max-w-[220px]">
                      {desc}
                    </p>
                  </div>
                </div>

                {/* Bottom CTA & Icon */}
                <div className="flex justify-between items-end mt-6">
                  <Link
                    href={link}
                    className="inline-flex items-center gap-1.5 bg-white text-wellness-navy text-xs font-black uppercase tracking-wider px-5 py-3 rounded-xl hover:bg-wellness-green hover:text-white transition-all duration-300"
                  >
                    <span>Shop Now</span>
                    <ArrowRight
                      size={14}
                      className="group-hover:translate-x-1 transition-transform"
                    />
                  </Link>

                  <div className="w-12 h-12 rounded-2xl bg-white/10 flex items-center justify-center text-white/50 group-hover:scale-110 group-hover:rotate-6 transition-all duration-500">
                    <Tag size={24} className="stroke-[1.8]" />
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
