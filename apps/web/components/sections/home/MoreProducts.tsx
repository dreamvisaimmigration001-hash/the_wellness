'use client';

import { ShoppingCart, ChevronLeft, ChevronRight } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import React, { useState, useRef } from 'react';

import { useCart } from '@/context/CartContext';
import { Product } from '@/lib/products';

interface MoreProductsProps {
  products?: Product[];
  loading?: boolean;
}

export default function MoreProducts({ products = [], loading = false }: MoreProductsProps) {
  const { addToCart } = useCart();
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(true);

  if (!loading && products.length === 0) {
    return null;
  }

  // Reverse or offset products for variety from the first carousel
  const displayProducts = products.length > 5 ? [...products].reverse() : products;

  const checkScroll = () => {
    if (scrollContainerRef.current) {
      const { scrollLeft, scrollWidth, clientWidth } = scrollContainerRef.current;
      setCanScrollLeft(scrollLeft > 10);
      setCanScrollRight(scrollLeft < scrollWidth - clientWidth - 10);
    }
  };

  const handleScroll = (direction: 'left' | 'right') => {
    if (scrollContainerRef.current) {
      const scrollAmount = direction === 'left' ? -320 : 320;
      scrollContainerRef.current.scrollBy({ left: scrollAmount, behavior: 'smooth' });
    }
  };

  return (
    <section className="py-12 md:py-16 bg-white border-b border-slate-100">
      <div className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-8">
        {/* Centered Title */}
        <div className="text-center mb-8">
          <h2 className="text-2xl sm:text-3xl font-heading font-black text-[#0F2744]">
            More Products For You
          </h2>
          <div className="w-12 h-1 bg-slate-300 rounded-full mx-auto mt-2.5" />
        </div>

        {/* Carousel Container */}
        {loading ? (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-4">
            {[1, 2, 3, 4, 5].map((n) => (
              <div
                key={n}
                className="h-72 rounded-2xl bg-slate-100 animate-pulse border border-slate-200"
              />
            ))}
          </div>
        ) : (
          <div className="relative group/carousel">
            {/* Left Nav Arrow */}
            <button
              type="button"
              onClick={() => {
                handleScroll('left');
              }}
              disabled={!canScrollLeft}
              className="absolute -left-3 sm:-left-5 top-1/2 -translate-y-1/2 z-20 w-10 h-10 rounded-full bg-white border border-slate-200 text-slate-700 flex items-center justify-center shadow-md hover:bg-[#0F2744] hover:text-white transition-all disabled:opacity-0 cursor-pointer"
              aria-label="Previous products"
            >
              <ChevronLeft size={20} />
            </button>

            {/* Right Nav Arrow */}
            <button
              type="button"
              onClick={() => {
                handleScroll('right');
              }}
              disabled={!canScrollRight}
              className="absolute -right-3 sm:-right-5 top-1/2 -translate-y-1/2 z-20 w-10 h-10 rounded-full bg-white border border-slate-200 text-slate-700 flex items-center justify-center shadow-md hover:bg-[#0F2744] hover:text-white transition-all disabled:opacity-0 cursor-pointer"
              aria-label="Next products"
            >
              <ChevronRight size={20} />
            </button>

            {/* Scrollable Products List */}
            <div
              ref={scrollContainerRef}
              onScroll={checkScroll}
              className="flex gap-4 overflow-x-auto no-scrollbar py-2 scroll-smooth snap-x snap-mandatory px-1"
            >
              {displayProducts.map((product) => {
                const stock = product.availableQty ?? product.stockQty ?? 0;
                const isOutOfStock = stock <= 0 || product.stockStatus === 'out_of_stock';

                return (
                  <div
                    key={`more-${product.id}`}
                    className="w-[200px] sm:w-[220px] md:w-[240px] shrink-0 snap-start bg-white border border-slate-200/90 rounded-2xl p-4 flex flex-col justify-between hover:shadow-lg transition-all duration-300 group"
                  >
                    <div>
                      {/* Product Image */}
                      <Link
                        href={`/products/${product.id}`}
                        className="block relative aspect-square bg-[#F8FAFC] rounded-xl p-3 mb-3 overflow-hidden"
                      >
                        <Image
                          src={product.image}
                          alt={product.name}
                          fill
                          sizes="(max-width: 768px) 180px, 220px"
                          className={`object-contain transition-transform duration-500 group-hover:scale-105 ${
                            isOutOfStock ? 'grayscale opacity-50' : ''
                          }`}
                          referrerPolicy="no-referrer"
                          unoptimized={product.image.startsWith('http')}
                        />
                      </Link>

                      {/* Title */}
                      <h3 className="font-heading font-bold text-xs sm:text-sm text-[#0F2744] line-clamp-2 leading-snug group-hover:text-blue-600 transition-colors">
                        <Link href={`/products/${product.id}`}>{product.name}</Link>
                      </h3>

                      {/* Price */}
                      <div className="mt-2 flex items-baseline gap-2">
                        <span className="text-sm sm:text-base font-bold text-[#0F2744] font-mono">
                          ₹
                          {product.price.toLocaleString('en-IN', {
                            minimumFractionDigits: 0,
                            maximumFractionDigits: 2,
                          })}
                        </span>
                        {product.mrp && product.mrp > product.price && (
                          <span className="text-xs text-slate-400 line-through font-mono">
                            ₹{product.mrp}
                          </span>
                        )}
                      </div>
                    </div>

                    {/* Add to Cart Button */}
                    <div className="pt-3 mt-2 border-t border-slate-100">
                      <button
                        type="button"
                        disabled={isOutOfStock}
                        onClick={() => {
                          void addToCart(product, 1);
                        }}
                        className={`w-full py-2 px-3 rounded-lg text-xs font-bold border transition-all flex items-center justify-center gap-1.5 cursor-pointer shadow-2xs ${
                          isOutOfStock
                            ? 'bg-slate-100 text-slate-400 border-slate-200 cursor-not-allowed'
                            : 'bg-white hover:bg-[#0F2744] text-[#0F2744] hover:text-white border-slate-200 hover:border-[#0F2744] active:scale-95'
                        }`}
                      >
                        <ShoppingCart size={13} className="stroke-[2.2]" />
                        <span>{isOutOfStock ? 'Out of Stock' : 'Add to Cart'}</span>
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* View All Products Centered Button */}
        <div className="text-center mt-8">
          <Link
            href="/products"
            className="inline-flex items-center gap-2 bg-[#0F2744] hover:bg-[#1D4ED8] text-white text-xs font-bold px-7 py-3 rounded-full transition-all duration-300 shadow-md hover:shadow-lg active:scale-95"
          >
            <span>View All Products</span>
          </Link>
        </div>
      </div>
    </section>
  );
}
