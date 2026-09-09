'use client';

import { Sparkles, Menu, X, ExternalLink } from 'lucide-react';
import Link from 'next/link';
import React from 'react';

import { AdminTab } from '../types';

interface AdminHeaderProps {
  activeTab: AdminTab;
  mobileOpen: boolean;
  onToggleMobile: () => void;
}

const tabTitles: Record<AdminTab, string> = {
  analytics: 'Analytics & Insights',
  products: 'Products Catalog',
  inventory: 'Inventory Control',
  categories: 'Categories Management',
  queries: 'Customer Inquiries',
  orders: 'Orders Management',
  promotions: 'Promotions & Banners',
};

export default function AdminHeader({ activeTab, mobileOpen, onToggleMobile }: AdminHeaderProps) {
  return (
    <>
      {/* Mobile Header Top-Bar */}
      <div className="lg:hidden fixed top-0 left-0 right-0 h-16 bg-white/95 backdrop-blur-md border-b border-wellness-gray-200 z-30 px-4 sm:px-6 flex items-center justify-between shadow-xs">
        <div className="flex items-center gap-2 sm:gap-2.5 min-w-0">
          <div className="w-8 h-8 rounded-lg bg-wellness-green text-wellness-navy flex items-center justify-center font-black shadow-xs shrink-0">
            <Sparkles size={16} />
          </div>
          <span className="text-xs font-heading font-black tracking-tight text-wellness-navy truncate">
            The Wellness<span className="text-wellness-green">.</span>
          </span>
          <span className="text-wellness-charcoal/30 text-xs shrink-0">/</span>
          <span className="text-[11px] font-heading font-extrabold text-wellness-navy uppercase tracking-wider truncate max-w-[130px] sm:max-w-xs">
            {tabTitles[activeTab]}
          </span>
        </div>
        <button
          onClick={onToggleMobile}
          className="w-10 h-10 rounded-xl bg-wellness-gray-100 flex items-center justify-center text-wellness-navy border border-wellness-gray-200 cursor-pointer hover:bg-wellness-light-green/20 shrink-0 ml-2"
          aria-label={mobileOpen ? 'Close menu' : 'Open menu'}
        >
          {mobileOpen ? <X size={18} /> : <Menu size={18} />}
        </button>
      </div>

      {/* Desktop Header */}
      <header className="hidden lg:flex h-16 border-b border-wellness-gray-200/80 bg-white/95 backdrop-blur-md sticky top-0 z-30 px-6 xl:px-8 items-center justify-between shadow-xs">
        <div className="flex items-center gap-2.5 xl:gap-3 min-w-0">
          <span className="text-[9px] uppercase font-black text-wellness-green tracking-widest bg-wellness-green/10 px-3 py-1 rounded-full border border-wellness-green/20 shrink-0">
            Clinical Control Center
          </span>
          <span className="text-wellness-charcoal/30">/</span>
          <span className="text-xs font-heading font-extrabold text-wellness-navy uppercase tracking-wider truncate">
            {tabTitles[activeTab]}
          </span>
        </div>
        <div className="flex items-center gap-3 xl:gap-5 text-xs font-semibold text-wellness-charcoal/60 shrink-0">
          <span className="inline-flex items-center gap-1.5 text-[10px] font-extrabold uppercase tracking-wider bg-emerald-50 text-emerald-700 px-2.5 py-1 rounded-full border border-emerald-200/60">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
            API Connected
          </span>
          <Link
            href="/"
            target="_blank"
            className="flex items-center gap-1.5 text-xs font-extrabold text-wellness-navy hover:text-wellness-green bg-wellness-gray-100/80 hover:bg-wellness-light-green/30 px-3.5 py-1.5 rounded-xl border border-wellness-gray-200 transition-colors shadow-2xs"
          >
            <span>View Storefront</span>
            <ExternalLink size={13} />
          </Link>
          <span className="hidden xl:inline-block font-mono text-xs text-wellness-charcoal/40 border-l border-wellness-gray-200 pl-4">
            {new Date().toLocaleDateString('en-US', {
              weekday: 'short',
              month: 'short',
              day: 'numeric',
            })}
          </span>
        </div>
      </header>
    </>
  );
}
