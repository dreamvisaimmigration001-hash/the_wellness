'use client';

import {
  Pill,
  HeartPulse,
  Brain,
  Wind,
  Sparkles,
  Baby,
  Activity,
  Layers,
  ArrowRight,
  type LucideIcon,
} from 'lucide-react';
import Link from 'next/link';
import React from 'react';

export interface ApiCategory {
  id: string;
  name: string;
  slug?: string;
  description?: string | null;
  isActive?: boolean;
}

export interface ApiProduct {
  id: string;
  name: string;
  categoryId?: string | null;
  categoryName?: string | null;
  category?: string | null;
  sellingPrice?: string | number;
  mrp?: string | number;
  type?: string | null;
  description?: string | null;
  primaryImage?: string | null;
  image?: string | null;
  isBestSeller?: boolean;
  isNewest?: boolean;
  isFeatured?: boolean;
  availableQty?: number;
  stockQty?: number;
  inventoryQty?: number;
  stockStatus?: 'in_stock' | 'out_of_stock';
}

interface CategoryItem {
  id: string;
  name: string;
  slug: string;
  icon: LucideIcon;
  bgColor: string;
  textColor: string;
  borderColor: string;
  count: number;
}

interface FeaturedCategoriesProps {
  categories?: ApiCategory[];
  products?: ApiProduct[];
  loading?: boolean;
}

function getCategoryVisuals(
  name: string,
  index: number,
): {
  icon: LucideIcon;
  bgColor: string;
  textColor: string;
  borderColor: string;
} {
  const lower = name.toLowerCase();
  if (lower.includes('cardio') || lower.includes('heart')) {
    return {
      icon: HeartPulse,
      bgColor: 'bg-red-50',
      textColor: 'text-red-700',
      borderColor: 'border-red-200',
    };
  }
  if (lower.includes('respira') || lower.includes('lung') || lower.includes('inhaler')) {
    return {
      icon: Wind,
      bgColor: 'bg-teal-50',
      textColor: 'text-teal-700',
      borderColor: 'border-teal-200',
    };
  }
  if (lower.includes('neuro') || lower.includes('brain')) {
    return {
      icon: Brain,
      bgColor: 'bg-purple-50',
      textColor: 'text-purple-700',
      borderColor: 'border-purple-200',
    };
  }
  if (lower.includes('baby') || lower.includes('child') || lower.includes('pediatric')) {
    return {
      icon: Baby,
      bgColor: 'bg-pink-50',
      textColor: 'text-pink-700',
      borderColor: 'border-pink-200',
    };
  }
  if (lower.includes('vitamin') || lower.includes('supplement') || lower.includes('nutrition')) {
    return {
      icon: Sparkles,
      bgColor: 'bg-amber-50',
      textColor: 'text-amber-700',
      borderColor: 'border-amber-200',
    };
  }
  if (lower.includes('rx') || lower.includes('prescription') || lower.includes('medicine')) {
    return {
      icon: Pill,
      bgColor: 'bg-emerald-50',
      textColor: 'text-emerald-700',
      borderColor: 'border-emerald-200',
    };
  }

  const palette = [
    {
      icon: Activity,
      bgColor: 'bg-emerald-50',
      textColor: 'text-emerald-700',
      borderColor: 'border-emerald-200',
    },
    {
      icon: Pill,
      bgColor: 'bg-blue-50',
      textColor: 'text-blue-700',
      borderColor: 'border-blue-200',
    },
    {
      icon: Layers,
      bgColor: 'bg-indigo-50',
      textColor: 'text-indigo-700',
      borderColor: 'border-indigo-200',
    },
    {
      icon: Sparkles,
      bgColor: 'bg-teal-50',
      textColor: 'text-teal-700',
      borderColor: 'border-teal-200',
    },
  ];

  const defaultItem = {
    icon: Activity,
    bgColor: 'bg-emerald-50',
    textColor: 'text-emerald-700',
    borderColor: 'border-emerald-200',
  };

  return palette[index % palette.length] ?? defaultItem;
}

export default function FeaturedCategories({
  categories = [],
  products = [],
  loading = false,
}: FeaturedCategoriesProps) {
  const categoryItems: CategoryItem[] = React.useMemo(() => {
    return categories.map((cat, idx) => {
      const matchedCount = products.filter((p) => {
        if (p.categoryId && p.categoryId === cat.id) return true;
        const pCat = (p.categoryName || p.category || '').toLowerCase();
        return pCat === cat.name.toLowerCase();
      }).length;

      const visuals = getCategoryVisuals(cat.name, idx);

      return {
        id: cat.id,
        name: cat.name,
        slug: cat.slug || cat.name.toLowerCase().replace(/[^a-z0-9]+/g, '-'),
        icon: visuals.icon,
        bgColor: visuals.bgColor,
        textColor: visuals.textColor,
        borderColor: visuals.borderColor,
        count: matchedCount,
      };
    });
  }, [categories, products]);

  if (!loading && categoryItems.length === 0) {
    return null;
  }

  return (
    <section className="py-12 md:py-16 bg-[#FAF9F6] border-b border-wellness-gray-200/60">
      <div className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h2 className="text-2xl sm:text-3xl font-heading font-black text-wellness-navy">
              Shop by Health Category
            </h2>
          </div>

          <Link
            href="/products"
            className="group hidden sm:inline-flex items-center gap-1.5 text-xs font-bold text-wellness-navy hover:text-wellness-green transition-colors"
          >
            <span>View All Categories</span>
            <ArrowRight size={14} className="group-hover:translate-x-1 transition-transform" />
          </Link>
        </div>

        {/* Loading Skeletons */}
        {loading && (
          <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-6 gap-3 sm:gap-4">
            {[1, 2, 3, 4].map((i) => (
              <div
                key={i}
                className="h-36 rounded-2xl bg-wellness-gray-100 animate-pulse border border-wellness-gray-200/60"
              />
            ))}
          </div>
        )}

        {/* Categories Grid from live API */}
        {!loading && categoryItems.length > 0 && (
          <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-6 gap-3 sm:gap-4">
            {categoryItems.map((item) => {
              const IconComponent = item.icon;
              return (
                <Link
                  key={item.id}
                  href={`/products?category=${encodeURIComponent(item.name)}`}
                  className="group flex flex-col items-center text-center p-4 sm:p-5 rounded-2xl bg-white border border-wellness-gray-200/80 hover:border-wellness-green/60 hover:shadow-md transition-all duration-200 cursor-pointer"
                >
                  {/* Icon Bubble */}
                  <div
                    className={`w-14 h-14 sm:w-16 sm:h-16 rounded-2xl flex items-center justify-center ${item.bgColor} ${item.textColor} border ${item.borderColor} shadow-xs group-hover:scale-105 transition-transform duration-200 mb-3`}
                  >
                    <IconComponent size={26} className="stroke-[2]" />
                  </div>

                  {/* Category Name */}
                  <h3 className="font-heading font-bold text-xs sm:text-sm text-wellness-navy group-hover:text-wellness-green transition-colors line-clamp-2 leading-tight min-h-[32px] flex items-center justify-center">
                    {item.name}
                  </h3>

                  {/* Items Count Badge */}
                  {item.count > 0 && (
                    <span className="text-[10px] text-wellness-charcoal/50 font-semibold mt-1">
                      {item.count} {item.count === 1 ? 'Product' : 'Products'}
                    </span>
                  )}
                </Link>
              );
            })}
          </div>
        )}

        {/* Mobile View All Link */}
        <div className="sm:hidden text-center mt-6">
          <Link
            href="/products"
            className="inline-flex items-center gap-1.5 text-xs font-bold text-wellness-navy bg-white border border-wellness-gray-200 px-5 py-2.5 rounded-xl shadow-xs"
          >
            <span>View All Categories</span>
            <ArrowRight size={14} />
          </Link>
        </div>
      </div>
    </section>
  );
}
