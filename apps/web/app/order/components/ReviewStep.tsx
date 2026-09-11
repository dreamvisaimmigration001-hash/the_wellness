'use client';

import { ArrowLeft, ArrowRight, ShieldCheck, Package, Truck } from 'lucide-react';
import { motion } from 'motion/react';
import Image from 'next/image';
import Link from 'next/link';
import React from 'react';

import type { CartItem } from '@/context/CartContext';

interface ReviewStepProps {
  items: CartItem[];
  onSubmit: () => void;
}

export default function ReviewStep({ items, onSubmit }: ReviewStepProps) {
  return (
    <motion.div
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: 20 }}
      transition={{ duration: 0.3 }}
      className="space-y-6"
    >
      <div>
        <h2 className="text-2xl sm:text-3xl font-heading font-bold text-wellness-navy mb-2">
          Review Your Order
        </h2>
        <p className="text-xs sm:text-sm text-wellness-charcoal/70">
          Verify your items and quantities before proceeding to delivery address.
        </p>
      </div>

      {/* Cart Items List */}
      <div className="bg-white border border-wellness-gray-200 rounded-2xl p-4 sm:p-6 space-y-4">
        <div className="flex items-center justify-between pb-3 border-b border-wellness-gray-200">
          <span className="text-xs font-bold uppercase tracking-wider text-wellness-charcoal/60">
            Selected Products ({items.reduce((acc, i) => acc + i.quantity, 0)} Items)
          </span>
          <Link href="/products" className="text-xs font-bold text-wellness-green hover:underline">
            + Add More Items
          </Link>
        </div>

        <div className="divide-y divide-wellness-gray-100 max-h-[380px] overflow-y-auto pr-1">
          {items.map((item) => (
            <div key={item.product.id} className="py-3 flex items-center justify-between gap-4">
              <div className="flex items-center gap-3 min-w-0">
                <div className="w-12 h-12 rounded-xl bg-wellness-gray-50 border border-wellness-gray-200/80 p-1 shrink-0 relative overflow-hidden">
                  <Image
                    src={item.product.image || '/images/cardiostatin.png'}
                    alt={item.product.name}
                    fill
                    className="object-contain"
                  />
                </div>
                <div className="min-w-0">
                  <h4 className="font-heading font-bold text-xs sm:text-sm text-wellness-navy truncate">
                    {item.product.name}
                  </h4>
                  <p className="text-[11px] text-wellness-charcoal/60 font-medium">
                    Qty: {item.quantity} × ₹{item.product.price.toLocaleString('en-IN')}
                  </p>
                </div>
              </div>
              <span className="font-mono font-bold text-xs sm:text-sm text-wellness-navy shrink-0">
                ₹{(item.product.price * item.quantity).toLocaleString('en-IN')}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* Order Assurances */}
      <div className="bg-[#FAF9F6] border border-wellness-gray-200/80 rounded-2xl p-4 sm:p-5 grid grid-cols-1 sm:grid-cols-3 gap-3">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-lg bg-emerald-500/10 text-emerald-600 flex items-center justify-center shrink-0">
            <ShieldCheck size={16} />
          </div>
          <div>
            <h5 className="text-xs font-bold text-wellness-navy">100% Genuine</h5>
            <p className="text-[10px] text-wellness-charcoal/60">Batch-certified stock</p>
          </div>
        </div>

        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-lg bg-blue-500/10 text-blue-600 flex items-center justify-center shrink-0">
            <Package size={16} />
          </div>
          <div>
            <h5 className="text-xs font-bold text-wellness-navy">Secure Packaging</h5>
            <p className="text-[10px] text-wellness-charcoal/60">Tamper-evident seals</p>
          </div>
        </div>

        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-lg bg-amber-500/10 text-amber-600 flex items-center justify-center shrink-0">
            <Truck size={16} />
          </div>
          <div>
            <h5 className="text-xs font-bold text-wellness-navy">Express Dispatch</h5>
            <p className="text-[10px] text-wellness-charcoal/60">With live tracking</p>
          </div>
        </div>
      </div>

      <div className="flex justify-between items-center pt-2">
        <Link
          href="/products"
          className="inline-flex items-center gap-2 text-xs sm:text-sm font-semibold text-wellness-charcoal/60 hover:text-wellness-navy transition-colors"
        >
          <ArrowLeft size={16} />
          <span>Back to Shop</span>
        </Link>
        <button
          type="button"
          onClick={onSubmit}
          className="bg-wellness-green hover:bg-wellness-navy text-white px-6 sm:px-8 py-3.5 sm:py-4 rounded-xl font-semibold flex items-center gap-2 transition-colors shadow-md cursor-pointer text-xs sm:text-sm uppercase tracking-wider"
        >
          <span>Shipping Address</span>
          <ArrowRight size={16} />
        </button>
      </div>
    </motion.div>
  );
}
