import { Mail, Phone, MapPin, ShieldCheck, ArrowUpRight, Award, CheckCircle2 } from 'lucide-react';
import Link from 'next/link';
import React from 'react';

export default function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-[#081324] text-wellness-light-green border-t border-slate-800/80 relative overflow-hidden">
      {/* Subtle background ambient glows */}
      <div className="absolute top-0 right-1/4 w-96 h-96 bg-wellness-green/5 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 left-10 w-80 h-80 bg-wellness-light-green/5 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-8 pt-16 pb-10 relative z-10">
        {/* Main Grid: 12-column system for balanced alignment */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-10 lg:gap-8 pb-14 border-b border-slate-800/80">
          {/* Brand and Mission Column (4 cols) */}
          <div className="lg:col-span-4 pr-0 lg:pr-6 space-y-6">
            <Link
              href="/"
              className="text-xl sm:text-2xl font-heading font-black tracking-tight inline-flex items-center gap-2.5 text-white group/logo"
            >
              <div className="w-8 h-8 rounded-bl-xl rounded-tr-xl bg-wellness-green flex items-center justify-center transition-all duration-500 group-hover/logo:rotate-180 shadow-md shadow-wellness-green/20 shrink-0">
                <div className="w-3 h-3 rounded-full bg-white transition-transform duration-500 group-hover/logo:scale-75" />
              </div>
              <span>
                The Wellness<span className="text-wellness-green font-bold">.</span>
              </span>
            </Link>

            <p className="text-xs sm:text-sm text-slate-300/80 leading-relaxed font-normal max-w-sm">
              Empowering proactive well-being through clinically validated therapeutics, cold-chain
              certified pharmaceuticals, and science-led health solutions.
            </p>

            {/* Certifications & Trust Badges */}
            <div className="space-y-2.5 pt-1">
              <span className="text-[10px] font-extrabold uppercase tracking-widest text-slate-400 block">
                Quality & Verification
              </span>
              <div className="flex flex-wrap items-center gap-2">
                <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-white/5 border border-white/10 text-[11px] font-medium text-slate-300">
                  <Award size={13} className="text-wellness-green shrink-0" />
                  WHO-GMP Certified
                </span>
                <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-white/5 border border-white/10 text-[11px] font-medium text-slate-300">
                  <CheckCircle2 size={13} className="text-wellness-green shrink-0" />
                  ISO 9001:2015
                </span>
                <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-white/5 border border-white/10 text-[11px] font-medium text-slate-300">
                  <ShieldCheck size={13} className="text-wellness-green shrink-0" />
                  Cold-Chain Verified
                </span>
              </div>
            </div>
          </div>

          {/* Column 2: Therapeutics & Products (3 cols) */}
          <div className="lg:col-span-3 space-y-4">
            <h4 className="text-xs font-black uppercase tracking-widest text-white flex items-center gap-1.5">
              <span className="w-1.5 h-1.5 rounded-full bg-wellness-green" />
              Products
            </h4>
            <ul className="space-y-2.5 text-xs sm:text-[13px] text-slate-300/80">
              <li>
                <Link
                  href="/products"
                  className="hover:text-white hover:translate-x-1 transition-all duration-200 inline-block"
                >
                  All Formulations
                </Link>
              </li>
              <li>
                <Link
                  href="/products?category=wellness"
                  className="hover:text-white hover:translate-x-1 transition-all duration-200 inline-block"
                >
                  Daily Wellness
                </Link>
              </li>
              <li>
                <Link
                  href="/products?category=supplements"
                  className="hover:text-white hover:translate-x-1 transition-all duration-200 inline-block"
                >
                  Vitamins & Minerals
                </Link>
              </li>
              <li>
                <Link
                  href="/products?category=immunity"
                  className="hover:text-white hover:translate-x-1 transition-all duration-200 inline-block"
                >
                  Immune Defense
                </Link>
              </li>
              <li>
                <Link
                  href="/products?category=cardiovascular"
                  className="hover:text-white hover:translate-x-1 transition-all duration-200 inline-block"
                >
                  Cardiovascular Care
                </Link>
              </li>
              <li>
                <Link
                  href="/products?category=personal-care"
                  className="hover:text-white hover:translate-x-1 transition-all duration-200 inline-block"
                >
                  Personal Care
                </Link>
              </li>
            </ul>
          </div>

          {/* Column 3: Science & Company (2 cols) */}
          <div className="lg:col-span-2 space-y-4">
            <h4 className="text-xs font-black uppercase tracking-widest text-white flex items-center gap-1.5">
              <span className="w-1.5 h-1.5 rounded-full bg-wellness-green" />
              Company
            </h4>
            <ul className="space-y-2.5 text-xs sm:text-[13px] text-slate-300/80">
              <li>
                <Link
                  href="/about"
                  className="hover:text-white hover:translate-x-1 transition-all duration-200 inline-block"
                >
                  About Our Mission
                </Link>
              </li>
              <li>
                <Link
                  href="/research"
                  className="hover:text-white hover:translate-x-1 transition-all duration-200 inline-block"
                >
                  Clinical Research
                </Link>
              </li>
              <li>
                <Link
                  href="/quality"
                  className="hover:text-white hover:translate-x-1 transition-all duration-200 inline-block"
                >
                  Quality Standards
                </Link>
              </li>
              <li>
                <Link
                  href="/contact"
                  className="hover:text-white hover:translate-x-1 transition-all duration-200 inline-block"
                >
                  Press & Media
                </Link>
              </li>
            </ul>
          </div>

          {/* Column 4: Contact & Inquiries (3 cols) */}
          <div className="lg:col-span-3 space-y-4">
            <h4 className="text-xs font-black uppercase tracking-widest text-white flex items-center gap-1.5">
              <span className="w-1.5 h-1.5 rounded-full bg-wellness-green" />
              Contact
            </h4>
            <ul className="space-y-3.5 text-xs text-slate-300/80">
              <li>
                <a
                  href="mailto:hello@thewellness.com"
                  className="group flex items-start gap-2.5 hover:text-white transition-colors"
                >
                  <Mail size={15} className="text-wellness-green shrink-0 mt-0.5" />
                  <span className="break-all font-medium">hello@thewellness.com</span>
                </a>
              </li>
              <li>
                <a
                  href="tel:+18009355637"
                  className="group flex items-start gap-2.5 hover:text-white transition-colors"
                >
                  <Phone size={15} className="text-wellness-green shrink-0 mt-0.5" />
                  <span className="font-medium">+1 (800) 935-5637</span>
                </a>
              </li>
              <li className="flex items-start gap-2.5 text-slate-300/70">
                <MapPin size={15} className="text-wellness-green shrink-0 mt-0.5" />
                <span className="leading-relaxed font-normal">
                  123 Science Way, Suite 400
                  <br />
                  San Francisco, CA 94107
                </span>
              </li>
              <li className="pt-1">
                <Link
                  href="/contact"
                  className="inline-flex items-center gap-1 text-[11px] font-bold text-wellness-green hover:text-white transition-colors group"
                >
                  <span>Submit an Inquiry</span>
                  <ArrowUpRight
                    size={13}
                    className="transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
                  />
                </Link>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar: Copyright, Security Guarantee, Legal Links */}
        <div className="pt-8 flex flex-col md:flex-row items-center justify-between gap-4 text-xs text-slate-400">
          <div className="flex flex-col sm:flex-row items-center gap-2 sm:gap-3 text-center sm:text-left">
            <p className="font-medium">
              &copy; {currentYear} The Wellness Inc. All rights reserved.
            </p>
            <span className="hidden sm:inline text-slate-600">•</span>
            <p className="text-[11px] text-slate-400">
              Licensed Digital Dispensary & Healthcare Provider
            </p>
          </div>

          <div className="flex flex-wrap items-center justify-center gap-4 text-[11px] text-slate-400">
            <Link href="/about" className="hover:text-white transition-colors">
              Privacy Policy
            </Link>
            <span>•</span>
            <Link href="/about" className="hover:text-white transition-colors">
              Terms of Service
            </Link>
            <span>•</span>
            <Link href="/quality" className="hover:text-white transition-colors">
              Clinical Quality
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
