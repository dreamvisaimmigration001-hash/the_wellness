'use client';

import { useGSAP } from '@gsap/react';
import gsap from 'gsap';
import { ArrowRight, Truck, ShieldCheck, BadgePercent, Sparkles, Activity } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import React, { useRef } from 'react';

export default function Hero() {
  const container = useRef(null);

  useGSAP(
    () => {
      const tl = gsap.timeline();

      tl.from('.hero-sub', {
        y: 20,
        opacity: 0,
        duration: 0.6,
        ease: 'power3.out',
      })
        .from(
          '.hero-heading-line',
          {
            y: 40,
            opacity: 0,
            duration: 0.7,
            stagger: 0.1,
            ease: 'power3.out',
          },
          '-=0.4',
        )
        .from(
          '.hero-desc',
          {
            y: 20,
            opacity: 0,
            duration: 0.6,
            ease: 'power3.out',
          },
          '-=0.5',
        )
        .from(
          '.hero-cta-btn',
          {
            scale: 0.9,
            opacity: 0,
            duration: 0.5,
            ease: 'back.out(1.7)',
          },
          '-=0.4',
        )
        .from(
          '.hero-image-container',
          {
            x: 50,
            opacity: 0,
            duration: 1,
            ease: 'power2.out',
          },
          '-=0.8',
        )
        .from(
          '.hero-badge-float',
          {
            scale: 0,
            opacity: 0,
            duration: 0.6,
            stagger: 0.15,
            ease: 'back.out(1.5)',
          },
          '-=0.5',
        )
        .from(
          '.feature-bar-item',
          {
            y: 20,
            opacity: 0,
            duration: 0.6,
            stagger: 0.1,
            ease: 'power2.out',
          },
          '-=0.3',
        );
    },
    { scope: container },
  );

  return (
    <section ref={container} className="relative bg-[#FAF8F5] pt-12 pb-16 overflow-hidden">
      {/* Decorative Orbs & Grid lines */}
      <div className="absolute inset-0 bg-[radial-gradient(#e2e8f0_1.2px,transparent_1.2px)] [background-size:32px_32px] opacity-30 pointer-events-none"></div>
      <div className="absolute right-[5%] top-[15%] w-[550px] h-[550px] bg-wellness-light-green/45 glow-orb blur-[120px] rounded-full pointer-events-none -z-10"></div>
      <div className="absolute left-[10%] bottom-[5%] w-[350px] h-[350px] bg-amber-50/40 glow-orb blur-[100px] rounded-full pointer-events-none -z-10"></div>

      <div className="container mx-auto px-6 md:px-12 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center min-h-[550px]">
          {/* Left Text Detail */}
          <div className="lg:col-span-6 flex flex-col items-start space-y-6">
            <span className="hero-sub inline-block bg-wellness-green/10 text-wellness-green text-xs font-extrabold uppercase tracking-wider px-3.5 py-1.5 rounded-md">
              SPECIAL OFFERS • 25% OFF SELECTED THERAPIES
            </span>

            <h1 className="text-4xl md:text-5xl lg:text-6xl font-heading font-black text-wellness-navy leading-[1.08] tracking-tight">
              <div className="overflow-hidden py-1">
                <div className="hero-heading-line">Your Medication</div>
              </div>
              <div className="overflow-hidden py-1">
                <div className="hero-heading-line text-wellness-green font-medium">
                  Now Made Easy.
                </div>
              </div>
            </h1>

            <p className="hero-desc text-wellness-charcoal/70 text-sm md:text-base leading-relaxed max-w-md font-semibold">
              Browse, order, and track authentic prescription drugs and daily wellness supplements.
              Hand-delivered directly from certified laboratory depots to your home.
            </p>

            <div className="hero-cta-btn pt-2">
              <Link
                href="/products"
                className="group inline-flex items-center gap-2 bg-wellness-navy text-white text-sm font-extrabold uppercase tracking-wider px-8 py-4 rounded-xl hover:bg-wellness-green transition-all duration-300 shadow-md hover:shadow-lg hover:shadow-wellness-green/10 cursor-pointer border border-transparent"
              >
                <span>Shop Catalog Now</span>
                <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
              </Link>
            </div>
          </div>

          {/* Right Brand Healthcare Visual Showcase */}
          <div className="lg:col-span-6 flex justify-center items-center relative">
            <div className="hero-image-container relative w-[320px] md:w-[400px] aspect-[4/5] rounded-[36px] bg-white shadow-2xl shadow-wellness-navy/[0.05] p-6 border border-wellness-gray-200/60 flex flex-col justify-between overflow-visible">
              {/* Header badge row */}
              <div className="flex justify-between items-center">
                <div className="flex items-center gap-2">
                  <span className="w-2.5 h-2.5 rounded-full bg-wellness-green animate-pulse" />
                  <span className="text-[10px] font-black uppercase tracking-wider text-wellness-navy">
                    Laboratory Verified
                  </span>
                </div>
                <span className="text-[10px] font-extrabold text-wellness-green bg-wellness-green/10 px-2.5 py-1 rounded-full uppercase tracking-wider">
                  Audited Platform
                </span>
              </div>

              {/* Centered Brand Healthcare Visual */}
              <div className="relative w-full h-[68%] my-auto rounded-2xl overflow-hidden bg-wellness-navy/5 flex items-center justify-center group shadow-inner">
                <Image
                  src="/images/premium_3d_dna_render.png"
                  alt="Certified Healthcare Formulations and Research"
                  fill
                  sizes="(max-width: 768px) 100vw, 400px"
                  className="object-cover group-hover:scale-105 transition-transform duration-700"
                  priority
                />
                <div className="absolute inset-0 bg-gradient-to-t from-wellness-navy/85 via-wellness-navy/20 to-transparent pointer-events-none" />
                <div className="absolute bottom-4 left-4 right-4 text-white">
                  <p className="text-[10px] font-extrabold uppercase tracking-widest text-wellness-green mb-1">
                    Science & Purity
                  </p>
                  <h3 className="text-sm md:text-base font-bold leading-snug">
                    Audited Healthcare & Certified Therapeutics
                  </h3>
                </div>
              </div>

              {/* Bottom Dispensary Footer Card */}
              <div className="bg-wellness-gray-100 p-3.5 rounded-2xl flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-xl bg-wellness-navy text-white flex items-center justify-center font-black text-xs shrink-0">
                    Rx
                  </div>
                  <div>
                    <h4 className="text-xs font-bold text-wellness-navy">Licensed Dispensary</h4>
                    <p className="text-[10px] text-wellness-charcoal/60 font-medium">
                      Direct cold-chain logistics
                    </p>
                  </div>
                </div>
                <div className="text-right shrink-0">
                  <span className="text-xs font-black text-wellness-green">★ 4.9/5</span>
                  <p className="text-[9px] text-wellness-charcoal/50 font-bold uppercase">
                    Clinical Trust
                  </p>
                </div>
              </div>

              {/* Floating Badges */}
              <div className="hero-badge-float absolute -top-4 -left-6 bg-white/95 backdrop-blur-md px-4 py-2.5 rounded-full border border-wellness-gray-200/60 shadow-lg shadow-wellness-navy/5 flex items-center gap-2">
                <div className="w-5.5 h-5.5 rounded-full bg-wellness-green/15 text-wellness-green flex items-center justify-center">
                  <ShieldCheck size={12} className="stroke-[2.5]" />
                </div>
                <span className="text-[10px] font-extrabold text-wellness-navy uppercase tracking-wider">
                  Certified Safe
                </span>
              </div>

              <div className="hero-badge-float absolute top-1/2 -right-8 bg-white/95 backdrop-blur-md px-4 py-2.5 rounded-full border border-wellness-gray-200/60 shadow-lg shadow-wellness-navy/5 flex items-center gap-2">
                <div className="w-5.5 h-5.5 rounded-full bg-wellness-green/15 text-wellness-green flex items-center justify-center">
                  <Activity size={12} className="stroke-[2.5]" />
                </div>
                <span className="text-[10px] font-extrabold text-wellness-navy uppercase tracking-wider">
                  Lab Tested
                </span>
              </div>

              <div className="hero-badge-float absolute -bottom-4 -left-4 bg-white/95 backdrop-blur-md px-4 py-2.5 rounded-full border border-wellness-gray-200/60 shadow-lg shadow-wellness-navy/5 flex items-center gap-2">
                <div className="w-5.5 h-5.5 rounded-full bg-wellness-green/15 text-wellness-green flex items-center justify-center">
                  <Sparkles size={12} className="stroke-[2.5]" />
                </div>
                <span className="text-[10px] font-extrabold text-wellness-navy uppercase tracking-wider">
                  100% Purity
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Triple E-Commerce Value Props Bar */}
        <div className="mt-20 border-t border-wellness-gray-200/60 pt-10">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="feature-bar-item flex items-center gap-4 bg-white p-5 rounded-2xl border border-wellness-gray-200/50 shadow-sm">
              <div className="w-12 h-12 rounded-2xl bg-wellness-green/10 text-wellness-green flex items-center justify-center shrink-0">
                <Truck size={24} className="stroke-[2]" />
              </div>
              <div>
                <h3 className="text-sm font-extrabold text-wellness-navy uppercase tracking-wider">
                  Free Shipping & Delivery
                </h3>
                <p className="text-[11px] text-wellness-charcoal/50 font-semibold mt-0.5">
                  On orders above ₹1,999 in selective cities.
                </p>
              </div>
            </div>

            <div className="feature-bar-item flex items-center gap-4 bg-white p-5 rounded-2xl border border-wellness-gray-200/50 shadow-sm">
              <div className="w-12 h-12 rounded-2xl bg-wellness-green/10 text-wellness-green flex items-center justify-center shrink-0">
                <BadgePercent size={24} className="stroke-[2]" />
              </div>
              <div>
                <h3 className="text-sm font-extrabold text-wellness-navy uppercase tracking-wider">
                  Price Match Guarantee
                </h3>
                <p className="text-[11px] text-wellness-charcoal/50 font-semibold mt-0.5">
                  Find a lower price? We will match it directly.
                </p>
              </div>
            </div>

            <div className="feature-bar-item flex items-center gap-4 bg-white p-5 rounded-2xl border border-wellness-gray-200/50 shadow-sm">
              <div className="w-12 h-12 rounded-2xl bg-wellness-green/10 text-wellness-green flex items-center justify-center shrink-0">
                <ShieldCheck size={24} className="stroke-[2]" />
              </div>
              <div>
                <h3 className="text-sm font-extrabold text-wellness-navy uppercase tracking-wider">
                  Certified Laboratory
                </h3>
                <p className="text-[11px] text-wellness-charcoal/50 font-semibold mt-0.5">
                  100% authentic, audited clinical products.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
