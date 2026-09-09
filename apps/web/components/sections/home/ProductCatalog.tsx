'use client';

import {
  ArrowRight,
  Heart,
  Wind,
  Brain,
  Baby,
  Activity,
  Pill,
  Layers,
  Sparkles,
  type LucideIcon,
} from 'lucide-react';
import Image from 'next/image';
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
  primaryImage?: string | null;
  images?: Array<{ url: string; isPrimary?: boolean }>;
}

interface CategoryCardItem {
  id: string;
  name: string;
  slug: string;
  description: string;
  productCount: number;
  image: string;
  icon: LucideIcon;
  badge: string;
  badgeColor: string;
  glowColor: string;
}

const THEME_PALETTE = [
  {
    keywords: ['cardio', 'heart', 'vascular'],
    badge: 'Cardio Care',
    badgeColor: 'bg-red-50 text-red-600 border-red-200/80',
    glowColor: 'group-hover:bg-red-500/10',
    icon: Heart,
    fallbackImage: '/images/cardiostatin.png',
    defaultDesc: 'Comprehensive formulations for heart health, circulation, and hypertension care.',
  },
  {
    keywords: ['respira', 'lung', 'pulmonary', 'breath'],
    badge: 'Pulmonary Care',
    badgeColor: 'bg-teal-50 text-teal-600 border-teal-200/80',
    glowColor: 'group-hover:bg-teal-500/10',
    icon: Wind,
    fallbackImage: '/images/respira-inhaler.png',
    defaultDesc: 'Advanced inhalation treatments and therapies for optimal pulmonary wellness.',
  },
  {
    keywords: ['neuro', 'brain', 'nerve', 'mental', 'cognitive'],
    badge: 'Neuro Science',
    badgeColor: 'bg-purple-50 text-purple-600 border-purple-200/80',
    glowColor: 'group-hover:bg-purple-500/10',
    icon: Brain,
    fallbackImage: '/images/neurocognin.png',
    defaultDesc: 'Targeted products for cognitive function, nerve health, and brain support.',
  },
  {
    keywords: ['infect', 'immune', 'antibiotic', 'anti-infective', 'defense'],
    badge: 'Immune Defense',
    badgeColor: 'bg-blue-50 text-blue-600 border-blue-200/80',
    glowColor: 'group-hover:bg-blue-500/10',
    icon: Activity,
    fallbackImage: '/images/willmox.png',
    defaultDesc: 'Broad-spectrum anti-infective formulations and protective medical treatments.',
  },
  {
    keywords: ['pediatric', 'child', 'baby', 'kid'],
    badge: 'Child Health',
    badgeColor: 'bg-indigo-50 text-indigo-600 border-indigo-200/80',
    glowColor: 'group-hover:bg-indigo-500/10',
    icon: Baby,
    fallbackImage: '/images/pediacetamol.png',
    defaultDesc: 'Safe, specialized pediatric formulas gentle and effective for children.',
  },
  {
    keywords: ['wellness', 'otc', 'supplement', 'vitamin', 'nutrition'],
    badge: 'Daily Essentials',
    badgeColor: 'bg-amber-50 text-amber-600 border-amber-200/80',
    glowColor: 'group-hover:bg-amber-500/10',
    icon: Pill,
    fallbackImage: '/images/osteoflex.png',
    defaultDesc: 'Daily essential supplements, vitamins, and over-the-counter wellness products.',
  },
];

function getCategoryTheme(name: string, index: number) {
  const lower = name.toLowerCase();
  const matched = THEME_PALETTE.find((theme) =>
    theme.keywords.some((keyword) => lower.includes(keyword)),
  );

  if (matched) {
    return matched;
  }

  const fallbackThemes = [
    {
      badge: 'Healthcare',
      badgeColor: 'bg-emerald-50 text-emerald-600 border-emerald-200/80',
      glowColor: 'group-hover:bg-emerald-500/10',
      icon: Sparkles,
      fallbackImage: '/images/cardiostatin.png',
      defaultDesc: `Explore trusted, research-backed solutions in ${name}.`,
    },
    {
      badge: 'Therapeutics',
      badgeColor: 'bg-cyan-50 text-cyan-600 border-cyan-200/80',
      glowColor: 'group-hover:bg-cyan-500/10',
      icon: Layers,
      fallbackImage: '/images/neurocognin.png',
      defaultDesc: `Specialized therapeutic products designed for ${name}.`,
    },
    {
      badge: 'Specialized',
      badgeColor: 'bg-violet-50 text-violet-600 border-violet-200/80',
      glowColor: 'group-hover:bg-violet-500/10',
      icon: Activity,
      fallbackImage: '/images/willmox.png',
      defaultDesc: `Advanced healthcare formulations for ${name}.`,
    },
  ];

  return fallbackThemes[index % fallbackThemes.length];
}

export default function ProductCatalog() {
  const [categories, setCategories] = useState<CategoryCardItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let isMounted = true;

    async function loadData() {
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

        // Group categories by name from real database records
        const categoryMap = new Map<
          string,
          { id: string; name: string; slug: string; desc: string | null }
        >();

        // 1. Add categories from /api/categories
        apiCategories.forEach((cat) => {
          if (cat.name && cat.isActive !== false) {
            categoryMap.set(cat.name.toLowerCase(), {
              id: cat.id,
              name: cat.name,
              slug: cat.slug || cat.name.toLowerCase().replace(/[^a-z0-9]+/g, '-'),
              desc: cat.description || null,
            });
          }
        });

        // 2. Also register any distinct category names from real products
        apiProducts.forEach((p) => {
          const catName = p.categoryName || p.category;
          if (catName && catName !== 'All' && !categoryMap.has(catName.toLowerCase())) {
            categoryMap.set(catName.toLowerCase(), {
              id: p.categoryId || catName.toLowerCase(),
              name: catName,
              slug: catName.toLowerCase().replace(/[^a-z0-9]+/g, '-'),
              desc: null,
            });
          }
        });

        // Build category card items with matched products, images, and counts
        const cardItems: CategoryCardItem[] = Array.from(categoryMap.values()).map((cat, idx) => {
          const matchedProducts = apiProducts.filter((p) => {
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
          });

          // Try to find a primary image from associated products
          const productWithImage = matchedProducts.find(
            (p) => p.primaryImage || (p.images && p.images.length > 0),
          );
          const resolvedProductImage =
            productWithImage?.primaryImage || productWithImage?.images?.[0]?.url || null;

          const theme = getCategoryTheme(cat.name, idx);

          return {
            id: cat.id,
            name: cat.name,
            slug: cat.slug,
            description: cat.desc || theme.defaultDesc,
            productCount: matchedProducts.length,
            image: resolvedProductImage || theme.fallbackImage,
            icon: theme.icon,
            badge: theme.badge,
            badgeColor: theme.badgeColor,
            glowColor: theme.glowColor,
          };
        });

        setCategories(cardItems);
      } catch (err) {
        console.error('Failed to load catalog categories from routes:', err);
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    }

    void loadData();

    return () => {
      isMounted = false;
    };
  }, []);

  if (!loading && categories.length === 0) {
    return null;
  }

  return (
    <section className="py-20 md:py-28 bg-wellness-gray-100/40 border-b border-wellness-gray-200/80">
      <div className="container mx-auto px-6 md:px-12">
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 md:mb-16 gap-6">
          <div className="max-w-2xl">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-wellness-green/10 text-wellness-green text-xs font-black uppercase tracking-wider mb-3.5">
              <Layers size={14} className="stroke-[2.5]" />
              <span>Product Catalog</span>
            </div>
            <h2 className="text-3xl md:text-4xl lg:text-5xl font-heading font-black text-wellness-navy tracking-tight mb-4">
              Explore by Category
            </h2>
            <p className="text-base md:text-lg text-wellness-charcoal/70 font-medium">
              Browse our comprehensive product catalog organized by specialized health and wellness
              categories.
            </p>
          </div>
          <Link
            href="/products"
            className="group inline-flex items-center gap-2 text-wellness-navy font-bold hover:text-wellness-green transition-colors pb-1.5 border-b-2 border-wellness-navy hover:border-wellness-green self-start md:self-auto"
          >
            <span>Browse entire catalog</span>
            <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
          </Link>
        </div>

        {/* Loading Skeletons */}
        {loading && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">
            {[1, 2, 3].map((i) => (
              <div
                key={i}
                className="bg-white rounded-[28px] p-6 md:p-7 border border-wellness-gray-200/80 shadow-sm animate-pulse space-y-5"
              >
                <div className="flex items-center justify-between">
                  <div className="w-12 h-12 rounded-2xl bg-wellness-gray-200" />
                  <div className="w-20 h-6 rounded-full bg-wellness-gray-200" />
                </div>
                <div className="w-full aspect-[16/11] rounded-2xl bg-wellness-gray-200" />
                <div className="space-y-2">
                  <div className="w-3/4 h-6 rounded-lg bg-wellness-gray-200" />
                  <div className="w-full h-4 rounded-lg bg-wellness-gray-200" />
                </div>
                <div className="pt-4 border-t border-wellness-gray-100 flex items-center justify-between">
                  <div className="w-24 h-4 rounded bg-wellness-gray-200" />
                  <div className="w-8 h-8 rounded-full bg-wellness-gray-200" />
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Categories Grid from Live API */}
        {!loading && categories.length > 0 && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">
            {categories.map((category) => {
              const IconComponent = category.icon;
              return (
                <Link
                  key={category.id}
                  href={`/products?category=${encodeURIComponent(category.name)}`}
                  className="group flex flex-col justify-between h-full bg-white rounded-2xl p-6 border border-wellness-gray-200/80 shadow-xs hover:border-wellness-green/40 hover:shadow-md transition-all duration-200 overflow-hidden"
                >
                  <div>
                    {/* Header: Icon & Category Badge */}
                    <div className="flex items-center justify-between gap-3 mb-4">
                      <div
                        className={`w-11 h-11 rounded-xl border flex items-center justify-center shadow-xs ${category.badgeColor}`}
                      >
                        <IconComponent size={20} className="stroke-[2.2]" />
                      </div>
                      <span className="text-[11px] font-bold uppercase tracking-wider px-3 py-1 rounded-full bg-wellness-gray-100 text-wellness-charcoal/70 border border-wellness-gray-200/60">
                        {category.badge}
                      </span>
                    </div>

                    {/* Product Stage */}
                    <div className="relative w-full aspect-[16/11] rounded-xl overflow-hidden bg-wellness-gray-100/50 flex items-center justify-center mb-4">
                      <Image
                        src={category.image}
                        alt={category.name}
                        fill
                        sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                        className="object-contain p-4"
                        unoptimized={category.image.startsWith('http')}
                      />
                    </div>

                    {/* Category Title & Description */}
                    <div className="space-y-1.5 mb-4">
                      <div className="flex items-center justify-between gap-2">
                        <h3 className="text-lg font-heading font-bold text-wellness-navy group-hover:text-wellness-green transition-colors">
                          {category.name}
                        </h3>
                        {category.productCount > 0 && (
                          <span className="text-xs font-semibold px-2 py-0.5 rounded-md bg-wellness-green/10 text-wellness-green">
                            {category.productCount}{' '}
                            {category.productCount === 1 ? 'Product' : 'Products'}
                          </span>
                        )}
                      </div>
                      <p className="text-sm text-wellness-charcoal/70 leading-relaxed line-clamp-2">
                        {category.description}
                      </p>
                    </div>
                  </div>

                  {/* Card Footer: Explore CTA */}
                  <div className="pt-3 border-t border-wellness-gray-100 flex items-center justify-between text-xs font-bold text-wellness-navy group-hover:text-wellness-green transition-colors">
                    <span>Explore Products</span>
                    <div className="w-7 h-7 rounded-full bg-wellness-gray-100 flex items-center justify-center text-wellness-charcoal/70 group-hover:bg-wellness-green group-hover:text-white transition-colors duration-200">
                      <ArrowRight size={13} />
                    </div>
                  </div>
                </Link>
              );
            })}
          </div>
        )}

        {/* Empty state if no categories exist */}
        {!loading && categories.length === 0 && (
          <div className="text-center py-12 bg-white rounded-3xl border border-wellness-gray-200/80 p-8">
            <p className="text-wellness-charcoal/70 font-medium mb-4">
              No categories available at the moment.
            </p>
            <Link
              href="/products"
              className="inline-flex items-center gap-2 px-6 py-2.5 rounded-xl bg-wellness-navy text-white text-sm font-bold hover:bg-wellness-green transition-colors"
            >
              <span>Explore All Products</span>
              <ArrowRight size={16} />
            </Link>
          </div>
        )}
      </div>
    </section>
  );
}
