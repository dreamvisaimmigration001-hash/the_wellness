'use client';

import {
  HeartPulse,
  Brain,
  Wind,
  Sparkles,
  Baby,
  Activity,
  Pill,
  type LucideIcon,
} from 'lucide-react';
import Link from 'next/link';
import React, { useState, useEffect } from 'react';

import { API_BASE_URL } from '@/lib/config';

interface ApiCategory {
  id: string;
  name: string;
  slug?: string;
  description?: string | null;
  isActive?: boolean;
}

interface ApiProduct {
  id: string;
  name: string;
  categoryId?: string | null;
  categoryName?: string | null;
  category?: string | null;
}

interface CategoryItem {
  id: string;
  name: string;
  slug: string;
  icon: LucideIcon;
  color: string;
  count: number;
}

interface CategoryTheme {
  icon: LucideIcon;
  color: string;
}

const DEFAULT_THEMES: CategoryTheme[] = [
  { icon: HeartPulse, color: 'bg-red-50 text-red-600 border-red-200' },
  { icon: Wind, color: 'bg-teal-50 text-teal-600 border-teal-200' },
  { icon: Brain, color: 'bg-purple-50 text-purple-600 border-purple-200' },
  { icon: Activity, color: 'bg-blue-50 text-blue-600 border-blue-200' },
  { icon: Sparkles, color: 'bg-amber-50 text-amber-600 border-amber-200' },
  { icon: Baby, color: 'bg-indigo-50 text-indigo-600 border-indigo-200' },
  { icon: Pill, color: 'bg-emerald-50 text-emerald-600 border-emerald-200' },
];

function getCategoryTheme(name: string, index: number): CategoryTheme {
  const lower = name.toLowerCase();
  if (lower.includes('cardio') || lower.includes('heart')) {
    return { icon: HeartPulse, color: 'bg-red-50 text-red-600 border-red-200' };
  }
  if (lower.includes('respira') || lower.includes('lung') || lower.includes('wind')) {
    return { icon: Wind, color: 'bg-teal-50 text-teal-600 border-teal-200' };
  }
  if (lower.includes('neuro') || lower.includes('brain') || lower.includes('mental')) {
    return { icon: Brain, color: 'bg-purple-50 text-purple-600 border-purple-200' };
  }
  if (lower.includes('infect') || lower.includes('immune') || lower.includes('anti')) {
    return { icon: Activity, color: 'bg-blue-50 text-blue-600 border-blue-200' };
  }
  if (lower.includes('pediatric') || lower.includes('child') || lower.includes('baby')) {
    return { icon: Baby, color: 'bg-indigo-50 text-indigo-600 border-indigo-200' };
  }
  if (lower.includes('wellness') || lower.includes('supplement') || lower.includes('vitamin')) {
    return { icon: Sparkles, color: 'bg-amber-50 text-amber-600 border-amber-200' };
  }
  if (lower.includes('otc') || lower.includes('pill') || lower.includes('tablet')) {
    return { icon: Pill, color: 'bg-emerald-50 text-emerald-600 border-emerald-200' };
  }

  return DEFAULT_THEMES[index % DEFAULT_THEMES.length];
}

export default function FeaturedCategories() {
  const [categories, setCategories] = useState<CategoryItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let isMounted = true;

    async function fetchData() {
      try {
        const API_BASE = API_BASE_URL;

        const [catRes, prodRes] = await Promise.all([
          fetch(`${API_BASE}/api/categories`, {
            signal: AbortSignal.timeout(12000),
          }).catch(() => null),
          fetch(`${API_BASE}/api/products?limit=100`, {
            signal: AbortSignal.timeout(12000),
          }).catch(() => null),
        ]);

        let apiCategories: ApiCategory[] = [];
        if (catRes && catRes.ok) {
          const catJson = (await catRes.json()) as {
            data?: ApiCategory[];
            categories?: ApiCategory[];
          };
          apiCategories = catJson.data || catJson.categories || [];
        }

        let apiProducts: ApiProduct[] = [];
        if (prodRes && prodRes.ok) {
          const prodJson = (await prodRes.json()) as {
            data?: { products?: ApiProduct[]; items?: ApiProduct[] };
            products?: ApiProduct[];
          };
          apiProducts = prodJson.data?.products || prodJson.data?.items || prodJson.products || [];
        }

        if (!isMounted) return;

        // Group categories from real database records
        const categoryMap = new Map<string, { id: string; name: string; slug: string }>();

        // 1. Add categories from API
        apiCategories.forEach((cat) => {
          if (cat.name && cat.isActive !== false) {
            categoryMap.set(cat.name.toLowerCase(), {
              id: cat.id,
              name: cat.name,
              slug: cat.slug || cat.name.toLowerCase().replace(/[^a-z0-9]+/g, '-'),
            });
          }
        });

        // 2. Add any additional categories present in products
        apiProducts.forEach((p) => {
          const catName = p.categoryName || p.category;
          if (catName && catName !== 'All' && !categoryMap.has(catName.toLowerCase())) {
            categoryMap.set(catName.toLowerCase(), {
              id: p.categoryId || catName.toLowerCase(),
              name: catName,
              slug: catName.toLowerCase().replace(/[^a-z0-9]+/g, '-'),
            });
          }
        });

        // Map categories to display items with real counts
        const items: CategoryItem[] = Array.from(categoryMap.values()).map((cat, idx) => {
          const count = apiProducts.filter((p) => {
            if (p.categoryId && p.categoryId === cat.id) return true;
            const pCat = (
              p.categoryName ||
              p.category ||
              (cat.name === 'OTC & Wellness' ? 'OTC & Wellness' : '')
            ).toLowerCase();
            return (
              pCat === cat.name.toLowerCase() ||
              (cat.name === 'OTC & Wellness' && !p.categoryName && !p.category) ||
              (cat.name.length >= 4 && pCat.includes(cat.name.toLowerCase()))
            );
          }).length;

          const theme = getCategoryTheme(cat.name, idx);

          return {
            id: cat.id,
            name: cat.name,
            slug: cat.slug,
            icon: theme.icon,
            color: theme.color,
            count,
          };
        });

        setCategories(items);
      } catch (err) {
        console.error('Failed to fetch categories:', err);
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    }

    void fetchData();

    return () => {
      isMounted = false;
    };
  }, []);

  if (!loading && categories.length === 0) {
    return null;
  }

  return (
    <section className="py-16 md:py-20 bg-white border-b border-wellness-gray-200">
      <div className="container mx-auto px-6 md:px-12">
        {/* Section Header */}
        <div className="text-center max-w-xl mx-auto mb-12 space-y-2">
          <h2 className="text-3xl md:text-4xl font-heading font-black text-wellness-navy uppercase tracking-tight">
            Explore Featured Categories
          </h2>
          <p className="text-wellness-charcoal/70 text-sm font-medium">
            Discover tailored pharmaceutical solutions across key healthcare categories.
          </p>
        </div>

        {/* Loading Skeletons */}
        {loading && (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4 md:gap-6">
            {[1, 2, 3, 4, 5, 6].map((i) => (
              <div
                key={i}
                className="flex flex-col items-center justify-between p-5 bg-wellness-gray-50 rounded-2xl border border-wellness-gray-200/80 animate-pulse h-40 text-center"
              >
                <div className="w-12 h-12 rounded-xl bg-wellness-gray-200 mb-3" />
                <div className="w-20 h-4 rounded bg-wellness-gray-200 mb-2" />
                <div className="w-12 h-3 rounded bg-wellness-gray-200" />
              </div>
            ))}
          </div>
        )}

        {/* Categories Grid from live API */}
        {!loading && categories.length > 0 && (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4 md:gap-6">
            {categories.map((cat) => {
              const IconComponent = cat.icon;
              return (
                <Link
                  key={cat.id}
                  href={`/products?category=${encodeURIComponent(cat.name)}`}
                  className="group flex flex-col items-center justify-between p-5 bg-wellness-gray-50 hover:bg-white rounded-2xl border border-wellness-gray-200/80 hover:border-wellness-green/40 hover:shadow-md transition-all duration-200 h-full text-center"
                >
                  <div
                    className={`w-12 h-12 rounded-xl ${cat.color} border flex items-center justify-center mb-3 shadow-xs`}
                  >
                    <IconComponent size={22} />
                  </div>

                  <div>
                    <h3 className="font-heading font-bold text-wellness-navy group-hover:text-wellness-green transition-colors text-sm mb-1">
                      {cat.name}
                    </h3>
                    <span className="text-[11px] font-semibold text-wellness-charcoal/50 group-hover:text-wellness-charcoal/80 transition-colors">
                      {cat.count > 0
                        ? `${String(cat.count)} ${cat.count === 1 ? 'Product' : 'Products'}`
                        : 'Explore'}
                    </span>
                  </div>
                </Link>
              );
            })}
          </div>
        )}
      </div>
    </section>
  );
}
