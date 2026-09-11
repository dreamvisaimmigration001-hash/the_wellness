'use client';

import { ArrowLeft, AlertCircle, Package, MapPin } from 'lucide-react';
import { motion } from 'motion/react';
import Image from 'next/image';
import Script from 'next/script';
import React from 'react';

import { OrderShippingFormData } from '../types';

import { CartItem } from '@/context/CartContext';

interface PaymentStepProps {
  cartItems: CartItem[];
  cartSubtotal: number;
  shippingCost: number;
  taxCost: number;
  totalCost: number;
  shippingForm: OrderShippingFormData;
  paymentError: string;
  isSubmitting: boolean;
  onPayment: () => void;
  onBack: () => void;
}

export default function PaymentStep({
  cartItems,
  cartSubtotal,
  shippingCost,
  taxCost,
  totalCost,
  shippingForm,
  paymentError,
  isSubmitting,
  onPayment,
  onBack,
}: PaymentStepProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -10 }}
      transition={{ duration: 0.25 }}
      className="space-y-6"
    >
      <Script src="https://checkout.razorpay.com/v1/checkout.js" strategy="lazyOnload" />

      <div>
        <h2 className="text-2xl sm:text-3xl font-heading font-black text-wellness-navy mb-1.5">
          Order Summary & Payment
        </h2>
        <p className="text-xs sm:text-sm text-wellness-charcoal/70 font-medium">
          Please review your order summary below before completing your payment.
        </p>
      </div>

      {/* 1. Order Summary Card (Items & Cost Breakdown) */}
      <div className="bg-white border border-wellness-gray-200 rounded-3xl p-6 sm:p-8 space-y-6 shadow-xs">
        <div className="flex items-center justify-between border-b border-wellness-gray-100 pb-4">
          <div className="flex items-center gap-2 text-wellness-navy font-heading font-extrabold text-base">
            <Package size={18} className="text-wellness-green" />
            <span>Items Ordered ({cartItems.length})</span>
          </div>
          <span className="text-xs font-bold text-wellness-charcoal/50">
            {cartItems.reduce((acc, i) => acc + i.quantity, 0)} total units
          </span>
        </div>

        {/* Ordered items list */}
        <div className="space-y-3.5 divide-y divide-wellness-gray-100">
          {cartItems.map((item) => (
            <div key={item.product.id} className="flex gap-4 items-center pt-3.5 first:pt-0">
              <div className="relative w-14 h-14 bg-wellness-gray-50 rounded-xl border border-wellness-gray-200/80 overflow-hidden shrink-0">
                <Image
                  src={item.product.image}
                  alt={item.product.name}
                  fill
                  className="object-cover"
                  referrerPolicy="no-referrer"
                />
              </div>
              <div className="flex-grow min-w-0">
                <h4 className="text-xs sm:text-sm font-bold text-wellness-navy truncate">
                  {item.product.name}
                </h4>
                <div className="flex items-center gap-2 mt-1">
                  <span className="text-[10px] font-bold text-wellness-navy bg-wellness-gray-100 px-2 py-0.5 rounded-md uppercase tracking-wider">
                    {item.product.type}
                  </span>
                  <span className="text-xs text-wellness-charcoal/60 font-medium">
                    Qty: {item.quantity}
                  </span>
                </div>
              </div>
              <div className="text-right shrink-0">
                <span className="text-sm font-bold text-wellness-navy">
                  ₹{(item.product.price * item.quantity).toFixed(2)}
                </span>
                {item.quantity > 1 && (
                  <p className="text-[10px] text-wellness-charcoal/50">
                    ₹{item.product.price.toFixed(2)} each
                  </p>
                )}
              </div>
            </div>
          ))}
        </div>

        {/* Costs Breakdown */}
        <div className="border-t border-wellness-gray-100 pt-5 space-y-2.5 text-xs sm:text-sm font-medium text-wellness-charcoal/70">
          <div className="flex justify-between items-center">
            <span>Items Subtotal</span>
            <span className="text-wellness-navy font-bold">₹{cartSubtotal.toFixed(2)}</span>
          </div>
          <div className="flex justify-between items-center">
            <span>Delivery & Packaging</span>
            {shippingCost === 0 ? (
              <span className="text-wellness-green font-bold uppercase tracking-wider text-xs">
                Free
              </span>
            ) : (
              <span className="text-wellness-navy font-bold">₹{shippingCost.toFixed(2)}</span>
            )}
          </div>
          <div className="flex justify-between items-center">
            <span>Applicable Taxes (10%)</span>
            <span className="text-wellness-navy font-bold">₹{taxCost.toFixed(2)}</span>
          </div>

          <div className="border-t border-wellness-gray-200 pt-4 flex justify-between items-baseline">
            <div>
              <span className="text-xs uppercase tracking-wider font-extrabold text-wellness-charcoal/60 block">
                Total Payable
              </span>
              <span className="text-2xl sm:text-3xl font-heading font-black text-wellness-navy mt-0.5 block">
                ₹{totalCost.toFixed(2)}
              </span>
            </div>
            <span className="text-[11px] text-wellness-charcoal/50 font-medium">
              All taxes and charges included
            </span>
          </div>
        </div>
      </div>

      {/* 2. Delivery Destination Brief */}
      <div className="bg-white border border-wellness-gray-200 rounded-3xl p-6 sm:p-7 space-y-4 shadow-xs">
        <div className="flex items-center justify-between border-b border-wellness-gray-100 pb-3.5">
          <div className="flex items-center gap-2 text-wellness-navy font-heading font-bold text-sm">
            <MapPin size={16} className="text-wellness-green" />
            <span>Delivering To</span>
          </div>
          <button
            type="button"
            onClick={onBack}
            className="text-xs font-bold text-wellness-green hover:underline cursor-pointer"
          >
            Change Address
          </button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs sm:text-sm">
          <div>
            <p className="font-extrabold text-wellness-navy">{shippingForm.fullName}</p>
            <p className="text-wellness-charcoal/70 mt-1 font-medium">{shippingForm.phone}</p>
            <p className="text-wellness-charcoal/70 font-medium">{shippingForm.email}</p>
          </div>
          <div>
            <p className="text-wellness-charcoal/80 leading-relaxed font-medium">
              {shippingForm.address}
              <br />
              {shippingForm.city}
              {shippingForm.state ? `, ${shippingForm.state}` : ''} - {shippingForm.zipCode}
            </p>
          </div>
        </div>
      </div>

      {/* 3. Clean Payment Action */}
      <div className="bg-white border border-wellness-gray-200 rounded-3xl p-6 sm:p-8 space-y-5 shadow-xs">
        {paymentError && (
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-xl flex items-start gap-2.5 text-xs font-semibold">
            <AlertCircle className="shrink-0 text-red-500 mt-0.5" size={16} />
            <div>{paymentError}</div>
          </div>
        )}

        <button
          type="button"
          onClick={onPayment}
          disabled={isSubmitting}
          className="w-full bg-wellness-navy hover:bg-wellness-green text-white py-4.5 rounded-2xl font-extrabold text-base tracking-wide flex items-center justify-center gap-2 transition-all duration-300 shadow-md hover:shadow-lg cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isSubmitting ? (
            <div className="w-5 h-5 rounded-full border-2 border-white/30 border-t-white animate-spin" />
          ) : (
            <span>Pay ₹{totalCost.toFixed(2)}</span>
          )}
        </button>

        <div className="flex items-center justify-between pt-1">
          <button
            type="button"
            onClick={onBack}
            className="inline-flex items-center gap-2 text-xs sm:text-sm font-semibold text-wellness-charcoal/60 hover:text-wellness-navy transition-colors cursor-pointer"
          >
            <ArrowLeft size={16} />
            <span>Back to Shipping</span>
          </button>
        </div>
      </div>
    </motion.div>
  );
}
