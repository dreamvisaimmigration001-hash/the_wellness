'use client';

import {
  Truck,
  ShieldCheck,
  Award,
  Headphones,
  ArrowRight,
  Sparkles,
  CheckCircle2,
} from 'lucide-react';
import Link from 'next/link';
import React, { useState } from 'react';

export default function CTA() {
  const [email, setEmail] = useState('');
  const [subscribed, setSubscribed] = useState(false);

  const handleSubscribe = (e: React.SyntheticEvent) => {
    e.preventDefault();
    if (email.trim()) {
      setSubscribed(true);
      setEmail('');
    }
  };

  return (
    <section className="bg-wellness-navy text-white py-16 md:py-20 relative overflow-hidden border-t border-wellness-gray-800">
      {/* Background ambient accents */}
      <div className="absolute top-0 right-0 w-96 h-96 bg-wellness-green/10 rounded-full blur-3xl pointer-events-none -mr-20 -mt-20" />
      <div className="absolute bottom-0 left-0 w-96 h-96 bg-teal-500/5 rounded-full blur-3xl pointer-events-none -ml-20 -mb-20" />

      <div className="container mx-auto px-6 md:px-12 relative z-10">
        {/* E-Commerce Trust Badges Grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 pb-14 border-b border-white/10">
          <div className="flex items-center gap-3.5">
            <div className="w-12 h-12 rounded-2xl bg-white/10 flex items-center justify-center text-wellness-green shrink-0">
              <Truck size={22} />
            </div>
            <div>
              <h4 className="text-sm font-bold text-white">Free Express Shipping</h4>
              <p className="text-xs text-white/60">On orders above ₹499</p>
            </div>
          </div>

          <div className="flex items-center gap-3.5">
            <div className="w-12 h-12 rounded-2xl bg-white/10 flex items-center justify-center text-wellness-green shrink-0">
              <ShieldCheck size={22} />
            </div>
            <div>
              <h4 className="text-sm font-bold text-white">100% Genuine Care</h4>
              <p className="text-xs text-white/60">Depot-certified medicines</p>
            </div>
          </div>

          <div className="flex items-center gap-3.5">
            <div className="w-12 h-12 rounded-2xl bg-white/10 flex items-center justify-center text-wellness-green shrink-0">
              <Award size={22} />
            </div>
            <div>
              <h4 className="text-sm font-bold text-white">Pharmacist Verified</h4>
              <p className="text-xs text-white/60">Prescription audit & advice</p>
            </div>
          </div>

          <div className="flex items-center gap-3.5">
            <div className="w-12 h-12 rounded-2xl bg-white/10 flex items-center justify-center text-wellness-green shrink-0">
              <Headphones size={22} />
            </div>
            <div>
              <h4 className="text-sm font-bold text-white">24/7 Clinical Support</h4>
              <p className="text-xs text-white/60">Help when you need it</p>
            </div>
          </div>
        </div>

        {/* E-Commerce Offer & Lead Capture */}
        <div className="pt-14 grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
          <div className="lg:col-span-7 space-y-4">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-wellness-green/20 text-wellness-light-green text-xs font-bold uppercase tracking-wider">
              <Sparkles size={13} />
              <span>Special Welcome Offer</span>
            </div>
            <h2 className="text-3xl md:text-5xl font-heading font-black tracking-tight text-white leading-tight">
              Get ₹150 off your first healthcare order.
            </h2>
            <p className="text-white/70 text-sm md:text-base font-normal max-w-xl">
              Subscribe to health alerts, clinical dosage reminders, and exclusive flash discounts
              delivered straight to your inbox.
            </p>

            <div className="pt-2 flex flex-wrap gap-4">
              <Link
                href="/products"
                className="inline-flex items-center gap-2 bg-wellness-green text-white text-xs font-bold uppercase tracking-wider px-6 py-3.5 rounded-xl hover:bg-wellness-green/90 transition-colors shadow-md"
              >
                <span>Shop All Products</span>
                <ArrowRight size={15} />
              </Link>
              <Link
                href="/products?type=Prescription"
                className="inline-flex items-center gap-2 bg-white/10 hover:bg-white/20 text-white text-xs font-bold uppercase tracking-wider px-6 py-3.5 rounded-xl transition-colors border border-white/15"
              >
                <span>Upload Prescription</span>
              </Link>
            </div>
          </div>

          {/* Email Subscription Card */}
          <div className="lg:col-span-5 bg-white/5 border border-white/10 p-6 md:p-8 rounded-3xl backdrop-blur-sm">
            {subscribed ? (
              <div className="flex items-center gap-3 text-wellness-light-green p-4 rounded-2xl bg-wellness-green/20 border border-wellness-green/30">
                <CheckCircle2 size={24} className="shrink-0" />
                <div>
                  <h4 className="text-sm font-bold">You&apos;re subscribed!</h4>
                  <p className="text-xs text-white/70">
                    Use code <strong className="text-white font-mono">WELLNESS150</strong> at
                    checkout.
                  </p>
                </div>
              </div>
            ) : (
              <form onSubmit={handleSubscribe} className="space-y-4">
                <h3 className="text-lg font-heading font-bold text-white">
                  Claim your discount code
                </h3>
                <p className="text-xs text-white/60">
                  Instant coupon sent to your email with zero spam guarantee.
                </p>
                <div className="flex flex-col sm:flex-row gap-2">
                  <input
                    type="email"
                    required
                    placeholder="Enter your email address"
                    value={email}
                    onChange={(e) => {
                      setEmail(e.target.value);
                    }}
                    className="flex-1 px-4 py-3 rounded-xl bg-white/10 border border-white/15 text-white placeholder:text-white/40 text-xs font-medium focus:outline-none focus:border-wellness-green transition-colors"
                  />
                  <button
                    type="submit"
                    className="px-5 py-3 rounded-xl bg-wellness-green hover:bg-wellness-green/90 text-white text-xs font-bold uppercase tracking-wider transition-colors shrink-0 cursor-pointer shadow-sm"
                  >
                    Claim
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
