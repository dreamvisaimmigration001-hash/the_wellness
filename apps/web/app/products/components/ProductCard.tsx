'use client';

import { Check, Eye, ShoppingCart, Star } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import React, { useState } from 'react';

import type { Product } from '@/lib/products';

interface ProductCardProps {
  product: Product;
  onAddToCart: (product: Product, quantity?: number) => void;
}

export default function ProductCard({ product, onAddToCart }: ProductCardProps) {
  const [isAdded, setIsAdded] = useState(false);
  const sp = product.price;
  const mrp = product.mrp || product.originalPrice || Math.round(sp * 1.25);
  const discountPercent = mrp > sp ? Math.round(((mrp - sp) / mrp) * 100) : 0;
  const stock = product.availableQty ?? product.inventoryQty ?? product.stockQty ?? 0;
  const isOutOfStock = stock <= 0 || product.stockStatus === 'out_of_stock';
  const isLowStock = !isOutOfStock && stock <= 10;

  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (isOutOfStock) return;
    onAddToCart(product, 1);
    setIsAdded(true);
    setTimeout(() => {
      setIsAdded(false);
    }, 1500);
  };

  return (
    <div
      className={`group relative flex flex-col h-full bg-white rounded-2xl border transition-all duration-300 overflow-hidden ${
        isOutOfStock
          ? 'border-slate-200/70 opacity-80'
          : 'border-slate-200/90 hover:border-blue-300/80 hover:shadow-[0_16px_36px_rgba(15,39,68,0.08)] hover:-translate-y-1'
      }`}
    >
      {/* Product Image Frame */}
      <div className="relative aspect-[4/3] bg-gradient-to-b from-[#F8FAFC] to-[#F1F5F9] p-4 flex items-center justify-center overflow-hidden border-b border-slate-100">
        <Link href={`/products/${product.id}`} className="relative w-full h-full block">
          <Image
            src={product.image}
            alt={product.name}
            fill
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 380px"
            className={`object-contain p-2 transition-transform duration-500 group-hover:scale-105 ${
              isOutOfStock ? 'grayscale opacity-50' : ''
            }`}
            referrerPolicy="no-referrer"
          />
        </Link>

        {/* Floating Top-Left Badges */}
        <div className="absolute top-3 left-3 z-10 flex flex-col gap-1.5 pointer-events-none">
          <span
            className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider shadow-xs backdrop-blur-xs ${
              product.type === 'Prescription (Rx)'
                ? 'bg-rose-50 text-rose-700 border border-rose-200'
                : 'bg-blue-50 text-blue-700 border border-blue-200'
            }`}
          >
            {product.type === 'Prescription (Rx)' ? 'Rx' : 'OTC'}
          </span>
          {product.isFeatured && (
            <span className="px-2 py-0.5 rounded-full text-[9px] font-black uppercase tracking-wider bg-emerald-100 text-emerald-800 border border-emerald-200 shadow-xs">
              Featured
            </span>
          )}
          {product.isBestSeller && (
            <span className="px-2 py-0.5 rounded-full text-[9px] font-black uppercase tracking-wider bg-amber-100 text-amber-800 border border-amber-200 shadow-xs">
              Bestseller
            </span>
          )}
        </div>

        {/* Floating Top-Right Badges */}
        <div className="absolute top-3 right-3 z-10 flex flex-col items-end gap-1.5 pointer-events-none">
          {isOutOfStock ? (
            <span className="px-2.5 py-0.5 rounded-full text-[10px] font-extrabold uppercase tracking-wider bg-slate-900 text-white shadow-xs">
              Out of Stock
            </span>
          ) : isLowStock ? (
            <span className="px-2.5 py-0.5 rounded-full text-[10px] font-extrabold uppercase tracking-wider bg-amber-500 text-white shadow-xs">
              Only {stock} Left
            </span>
          ) : discountPercent > 0 ? (
            <span className="px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider bg-emerald-600 text-white shadow-xs">
              {discountPercent}% OFF
            </span>
          ) : null}
        </div>
      </div>

      {/* Card Body & Details */}
      <div className="p-4 sm:p-5 flex flex-col flex-grow justify-between gap-3.5">
        <div className="space-y-2">
          {/* Category & Rating */}
          <div className="flex items-center justify-between gap-2">
            <span className="text-[10px] font-bold tracking-wider uppercase text-blue-700 bg-blue-50 px-2 py-0.5 rounded-md border border-blue-100">
              {product.category}
            </span>
            <div className="flex items-center gap-1 text-slate-400 text-xs font-semibold">
              <Star size={12} className="fill-amber-400 text-amber-400" />
              <span className="text-[#0F2744] font-bold text-xs">4.8</span>
            </div>
          </div>

          {/* Product Name */}
          <h3 className="text-sm sm:text-base font-heading font-bold text-[#0F2744] group-hover:text-blue-600 transition-colors line-clamp-2 leading-snug min-h-[2.6rem]">
            <Link href={`/products/${product.id}`} className="hover:underline">
              {product.name}
            </Link>
          </h3>

          {/* Description */}
          <p className="text-xs text-slate-500 line-clamp-2 leading-relaxed font-normal">
            {product.description}
          </p>

          {/* Key Ingredient Tag */}
          {product.ingredients.length > 0 && (
            <div className="pt-1 text-[11px] text-slate-400 font-medium truncate flex items-center gap-1.5">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 shrink-0" />
              <span className="truncate">Active: {product.ingredients.join(', ')}</span>
            </div>
          )}
        </div>

        {/* Price & Action Buttons */}
        <div className="pt-3 border-t border-slate-100 mt-auto">
          <div className="flex items-baseline justify-between mb-3.5">
            <div className="flex items-baseline gap-2">
              <span className="text-lg sm:text-xl font-heading font-black text-[#0F2744]">
                ₹{sp.toLocaleString('en-IN')}
              </span>
              {mrp > sp && (
                <span className="text-xs text-slate-400 line-through font-semibold">
                  ₹{mrp.toLocaleString('en-IN')}
                </span>
              )}
            </div>
            {discountPercent > 0 && (
              <span className="text-[10px] font-bold text-emerald-700 bg-emerald-50 border border-emerald-200 px-2 py-0.5 rounded-md">
                Save ₹{(mrp - sp).toLocaleString('en-IN')}
              </span>
            )}
          </div>

          {/* Dual Action Buttons */}
          <div className="grid grid-cols-2 gap-2">
            <Link
              href={`/products/${product.id}`}
              className="py-2.5 px-3 min-h-[38px] rounded-xl border border-slate-200 bg-slate-50/80 hover:bg-slate-100 hover:border-slate-300 text-[#0F2744] text-xs font-bold transition-all flex items-center justify-center gap-1.5 shadow-2xs cursor-pointer active:scale-95"
            >
              <Eye size={14} className="stroke-[2.2] text-slate-500" />
              <span>Details</span>
            </Link>

            <button
              disabled={isOutOfStock}
              onClick={handleAddToCart}
              type="button"
              className={`py-2.5 px-3 min-h-[38px] rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-1.5 shadow-2xs ${
                isOutOfStock
                  ? 'bg-slate-100 text-slate-400 border border-slate-200 cursor-not-allowed'
                  : isAdded
                    ? 'bg-emerald-600 text-white shadow-emerald-600/20'
                    : 'bg-[#2563EB] hover:bg-[#1D4ED8] text-white shadow-blue-600/20 cursor-pointer active:scale-95'
              }`}
            >
              {isAdded ? (
                <>
                  <Check size={14} className="stroke-[3]" />
                  <span>Added!</span>
                </>
              ) : (
                <>
                  <ShoppingCart size={14} className="stroke-[2.2]" />
                  <span>{isOutOfStock ? 'Out of Stock' : 'Add to Cart'}</span>
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
