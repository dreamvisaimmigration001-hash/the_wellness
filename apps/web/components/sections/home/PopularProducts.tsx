'use client';

import { ShoppingCart, Eye, ArrowRight, Sparkles, ChevronLeft, ChevronRight } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import React, { useState, useEffect, useRef, useMemo } from 'react';

import { useCart } from '@/context/CartContext';
import { API_BASE_URL } from '@/lib/config';
import { Product } from '@/lib/products';

type TabType = 'best-sellers' | 'new-arrivals' | 'featured' | 'all';

interface ApiProduct {
  id: string;
  name: string;
  categoryName?: string | null;
  category?: string | null;
  type?: string | null;
  description?: string | null;
  primaryImage?: string | null;
  image?: string | null;
  sellingPrice?: string | number;
  isBestSeller?: boolean;
  isNewest?: boolean;
  isFeatured?: boolean;
  availableQty?: number;
  stockQty?: number;
  inventoryQty?: number;
  stockStatus?: 'in_stock' | 'out_of_stock';
  status?: 'listed' | 'unlisted' | 'discontinued';
}

interface ApiResponse {
  success?: boolean;
  products?: ApiProduct[];
  data?: {
    products?: ApiProduct[];
    items?: ApiProduct[];
  };
}

export default function PopularProducts() {
  const { addToCart } = useCart();
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const [activeTab, setActiveTab] = useState<TabType>('best-sellers');
  const [productsList, setProductsList] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(true);

  useEffect(() => {
    let isMounted = true;

    async function fetchProducts() {
      try {
        const API_BASE = API_BASE_URL;
        const res = await fetch(`${API_BASE}/api/products?limit=100`, {
          signal: AbortSignal.timeout(5000),
        });

        if (res.ok) {
          const json = (await res.json()) as ApiResponse;
          const items = json.data?.products || json.data?.items || json.products || [];

          if (Array.isArray(items) && isMounted) {
            const mapped: Product[] = items.map((item) => {
              const sp = item.sellingPrice;
              const price = typeof sp === 'number' ? sp : parseFloat(sp || '0');
              const itemType =
                item.type === 'Prescription (Rx)'
                  ? ('Prescription (Rx)' as const)
                  : ('Over-The-Counter (OTC)' as const);

              return {
                id: item.id,
                name: item.name,
                category: item.categoryName || item.category || 'OTC & Wellness',
                type: itemType,
                description: item.description || 'Verified pharmaceutical formulation.',
                benefits: [],
                ingredients: [],
                image: item.primaryImage || item.image || '/images/cardiostatin.png',
                price,
                isBestSeller: Boolean(item.isBestSeller),
                isNewest: Boolean(item.isNewest),
                isFeatured: Boolean(item.isFeatured),
                availableQty: item.availableQty ?? item.inventoryQty ?? item.stockQty ?? 0,
                stockStatus: item.stockStatus ?? 'in_stock',
              };
            });

            setProductsList(mapped);
          }
        }
      } catch (err) {
        console.error('Failed to load products in PopularProducts:', err);
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    }

    void fetchProducts();

    return () => {
      isMounted = false;
    };
  }, []);

  const bestSellers = useMemo(() => productsList.filter((p) => p.isBestSeller), [productsList]);
  const newArrivals = useMemo(() => productsList.filter((p) => p.isNewest), [productsList]);
  const featured = useMemo(() => productsList.filter((p) => p.isFeatured), [productsList]);

  const availableTabs = useMemo(() => {
    const tabs: Array<{ id: TabType; label: string; count: number }> = [];
    if (bestSellers.length > 0) {
      tabs.push({ id: 'best-sellers', label: 'Best Sellers', count: bestSellers.length });
    }
    if (newArrivals.length > 0) {
      tabs.push({ id: 'new-arrivals', label: 'New Arrivals', count: newArrivals.length });
    }
    if (featured.length > 0) {
      tabs.push({ id: 'featured', label: 'Featured', count: featured.length });
    }
    if (tabs.length === 0 && productsList.length > 0) {
      tabs.push({ id: 'all', label: 'All Products', count: productsList.length });
    }
    return tabs;
  }, [bestSellers, newArrivals, featured, productsList]);

  const effectiveTab: TabType = useMemo(() => {
    if (availableTabs.length === 0) return 'all';
    if (availableTabs.some((t) => t.id === activeTab)) return activeTab;
    return availableTabs[0].id;
  }, [availableTabs, activeTab]);

  const visibleProducts = useMemo(() => {
    if (effectiveTab === 'best-sellers') return bestSellers;
    if (effectiveTab === 'new-arrivals') return newArrivals;
    if (effectiveTab === 'featured') return featured;
    return productsList;
  }, [effectiveTab, bestSellers, newArrivals, featured, productsList]);

  const checkScroll = () => {
    if (scrollContainerRef.current) {
      const { scrollLeft, scrollWidth, clientWidth } = scrollContainerRef.current;
      setCanScrollLeft(scrollLeft > 15);
      setCanScrollRight(scrollLeft + clientWidth < scrollWidth - 15);
    }
  };

  useEffect(() => {
    checkScroll();
  }, [visibleProducts]);

  const handleScroll = (direction: 'left' | 'right') => {
    if (scrollContainerRef.current) {
      const scrollAmount = direction === 'left' ? -380 : 380;
      scrollContainerRef.current.scrollBy({ left: scrollAmount, behavior: 'smooth' });
    }
  };

  if (!loading && productsList.length === 0) {
    return null;
  }

  return (
    <section className="py-16 md:py-24 bg-white border-b border-wellness-gray-200 overflow-hidden w-full">
      <div className="max-w-[1720px] mx-auto px-6 md:px-10 lg:px-14">
        {/* Section Header & Tab Controls */}
        <div className="flex flex-col items-center text-center mb-8 md:mb-12 space-y-4">
          <div className="max-w-2xl mx-auto space-y-2 flex flex-col items-center">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-wellness-green/10 text-wellness-green text-xs font-bold uppercase tracking-wider">
              <Sparkles size={13} />
              <span>Curated Selection</span>
            </div>
            <h2 className="text-3xl md:text-4xl font-heading font-black text-wellness-navy uppercase tracking-tight">
              Essential Healthcare Products
            </h2>
            <p className="text-wellness-charcoal/70 text-sm font-medium">
              Explore our best-selling, newest, and featured clinical healthcare solutions.
            </p>
          </div>

          {/* Navigation Tabs */}
          {availableTabs.length > 1 && (
            <div className="flex flex-wrap justify-center bg-wellness-gray-100 p-1.5 rounded-2xl border border-wellness-gray-200/80 gap-1 mt-2">
              {availableTabs.map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => {
                    setActiveTab(tab.id);
                  }}
                  className={`px-4 py-2 rounded-xl text-xs font-bold transition-all duration-200 cursor-pointer flex items-center gap-1.5 ${
                    effectiveTab === tab.id
                      ? 'bg-wellness-navy text-white shadow-xs'
                      : 'text-wellness-charcoal/70 hover:text-wellness-navy hover:bg-white/60'
                  }`}
                >
                  <span>{tab.label}</span>
                  <span
                    className={`text-[10px] px-1.5 py-0.2 rounded-full ${
                      effectiveTab === tab.id
                        ? 'bg-white/20 text-white'
                        : 'bg-wellness-gray-200 text-wellness-charcoal/60'
                    }`}
                  >
                    {tab.count}
                  </span>
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Loading Skeletons in Track */}
        {loading && (
          <div className="flex gap-6 overflow-hidden py-2">
            {[1, 2, 3, 4].map((i) => (
              <div
                key={i}
                className="w-[280px] sm:w-[320px] md:w-[340px] shrink-0 bg-wellness-gray-50/70 border border-wellness-gray-200/80 rounded-2xl p-6 animate-pulse space-y-4"
              >
                <div className="aspect-[4/3] rounded-xl bg-wellness-gray-200" />
                <div className="w-1/3 h-4 rounded bg-wellness-gray-200" />
                <div className="w-3/4 h-5 rounded bg-wellness-gray-200" />
                <div className="w-full h-3 rounded bg-wellness-gray-200" />
                <div className="pt-4 border-t border-wellness-gray-200 flex justify-between items-center">
                  <div className="w-20 h-5 rounded bg-wellness-gray-200" />
                  <div className="w-24 h-8 rounded-xl bg-wellness-gray-200" />
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Interactive Products Carousel with Hover-Revealed Navigation Buttons & No Visible Scrollbar */}
        {!loading && visibleProducts.length > 0 && (
          <div className="group/carousel relative">
            {/* Left Hover Navigation Button */}
            <button
              onClick={() => {
                handleScroll('left');
              }}
              disabled={!canScrollLeft}
              aria-label="Previous products"
              className={`absolute -left-3 md:-left-5 top-1/2 -translate-y-1/2 z-20 w-11 h-11 rounded-full bg-white text-wellness-navy hover:bg-wellness-green hover:text-white shadow-xl border border-wellness-gray-200 flex items-center justify-center transition-all duration-300 cursor-pointer ${
                canScrollLeft
                  ? 'opacity-0 group-hover/carousel:opacity-100 pointer-events-auto scale-100 hover:scale-105'
                  : 'opacity-0 pointer-events-none scale-90'
              }`}
            >
              <ChevronLeft size={20} className="stroke-[2.5]" />
            </button>

            {/* Right Hover Navigation Button */}
            <button
              onClick={() => {
                handleScroll('right');
              }}
              disabled={!canScrollRight}
              aria-label="Next products"
              className={`absolute -right-3 md:-right-5 top-1/2 -translate-y-1/2 z-20 w-11 h-11 rounded-full bg-white text-wellness-navy hover:bg-wellness-green hover:text-white shadow-xl border border-wellness-gray-200 flex items-center justify-center transition-all duration-300 cursor-pointer ${
                canScrollRight
                  ? 'opacity-0 group-hover/carousel:opacity-100 pointer-events-auto scale-100 hover:scale-105'
                  : 'opacity-0 pointer-events-none scale-90'
              }`}
            >
              <ChevronRight size={20} className="stroke-[2.5]" />
            </button>

            {/* Products Scroll Container with Hidden Scrollbar */}
            <div
              ref={scrollContainerRef}
              onScroll={checkScroll}
              className="flex gap-6 overflow-x-auto py-2 scroll-smooth snap-x snap-mandatory [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden"
            >
              {visibleProducts.map((product) => {
                const stock = product.availableQty ?? product.stockQty ?? 0;
                const isOutOfStock = stock <= 0 || product.stockStatus === 'out_of_stock';

                return (
                  <div
                    key={product.id}
                    className="w-[280px] sm:w-[320px] md:w-[340px] shrink-0 snap-start group bg-white border border-wellness-gray-200/80 rounded-2xl overflow-hidden hover:shadow-md hover:border-wellness-green/40 transition-all duration-200 flex flex-col justify-between"
                  >
                    <div className="p-5 space-y-4">
                      {/* Image & Badges */}
                      <div className="relative aspect-[4/3] rounded-xl overflow-hidden bg-wellness-gray-100/50">
                        <Image
                          src={product.image}
                          alt={product.name}
                          fill
                          sizes="(max-width: 768px) 280px, 340px"
                          className={`object-contain p-4 ${isOutOfStock ? 'grayscale-[30%]' : ''}`}
                          referrerPolicy="no-referrer"
                          unoptimized={product.image.startsWith('http')}
                        />

                        {/* Stock & Highlights Badges */}
                        {isOutOfStock ? (
                          <span className="absolute top-3 right-3 bg-red-600 text-white text-[9px] font-extrabold px-2 py-0.5 rounded uppercase tracking-wider shadow-xs z-10">
                            Out of Stock
                          </span>
                        ) : (
                          <div className="absolute top-3 right-3 flex flex-wrap items-center justify-end gap-1.5 z-10 max-w-[85%]">
                            {product.isFeatured && (
                              <span className="bg-wellness-green text-white font-bold text-[9px] uppercase tracking-wider px-2 py-0.5 rounded shadow-xs">
                                Featured
                              </span>
                            )}
                            {product.isBestSeller && (
                              <span className="bg-amber-500 text-white font-bold text-[9px] uppercase tracking-wider px-2 py-0.5 rounded shadow-xs">
                                Bestseller
                              </span>
                            )}
                            {product.isNewest && (
                              <span className="bg-blue-600 text-white font-bold text-[9px] uppercase tracking-wider px-2 py-0.5 rounded shadow-xs">
                                New
                              </span>
                            )}
                            <span className="bg-wellness-navy text-white text-[9px] font-semibold px-2 py-0.5 rounded shadow-xs">
                              {product.type}
                            </span>
                          </div>
                        )}
                      </div>

                      {/* Meta & Title */}
                      <div className="space-y-2">
                        <span className="text-[10px] font-bold tracking-wider uppercase text-wellness-green bg-wellness-green/10 px-2.5 py-0.5 rounded-full inline-block">
                          {product.category}
                        </span>

                        <h3 className="text-lg font-heading font-bold text-wellness-navy group-hover:text-wellness-green transition-colors line-clamp-1">
                          <Link href={`/products/${product.id}`}>{product.name}</Link>
                        </h3>

                        <p className="text-xs text-wellness-charcoal/70 leading-relaxed font-normal line-clamp-2">
                          {product.description}
                        </p>
                      </div>
                    </div>

                    {/* Pricing & Actions */}
                    <div className="p-5 pt-0 border-t border-wellness-gray-100 mt-3 flex items-center justify-between gap-4">
                      <div>
                        <span className="text-[9px] font-bold text-wellness-charcoal/40 uppercase tracking-wider block">
                          Price
                        </span>
                        <span className="text-lg font-black text-wellness-navy">
                          ₹
                          {product.price.toLocaleString('en-IN', {
                            minimumFractionDigits: 2,
                            maximumFractionDigits: 2,
                          })}
                        </span>
                      </div>

                      <div className="flex items-center gap-2">
                        <button
                          disabled={isOutOfStock}
                          onClick={() => {
                            if (!isOutOfStock) {
                              void addToCart(product, 1);
                            }
                          }}
                          className={`text-xs font-bold py-2 px-3.5 rounded-xl transition-colors duration-200 flex items-center gap-1.5 shadow-xs ${
                            isOutOfStock
                              ? 'bg-gray-200 text-gray-400 cursor-not-allowed'
                              : 'bg-wellness-green hover:bg-wellness-navy text-white cursor-pointer'
                          }`}
                        >
                          <ShoppingCart size={13} />
                          <span>{isOutOfStock ? 'Unavailable' : 'Add to Cart'}</span>
                        </button>

                        <Link
                          href={`/products/${product.id}`}
                          className="p-2 bg-wellness-gray-100 hover:bg-wellness-gray-200 text-wellness-navy rounded-xl transition-colors duration-200 flex items-center justify-center border border-wellness-gray-200/60 cursor-pointer"
                          title="View Details"
                        >
                          <Eye size={14} />
                        </Link>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* View Catalog Banner */}
        <div className="mt-10 md:mt-12 text-center">
          <Link
            href="/products"
            className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-wellness-navy hover:text-wellness-green transition-colors border-b-2 border-wellness-navy hover:border-wellness-green pb-1"
          >
            <span>Explore Complete Product Portfolio</span>
            <ArrowRight size={14} />
          </Link>
        </div>
      </div>
    </section>
  );
}
