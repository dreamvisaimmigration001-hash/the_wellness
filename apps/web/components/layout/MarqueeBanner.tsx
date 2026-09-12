'use client';

import {
  ShieldCheck,
  Truck,
  FlaskConical,
  Stethoscope,
  Sparkles,
  Award,
  HeartPulse,
  Lock,
  CheckCircle2,
  Zap,
  Shield,
  Star,
  FileCheck,
  Pill,
  Heart,
  BadgeCheck,
  Activity,
  type LucideIcon,
} from 'lucide-react';
import React, { useEffect, useState } from 'react';

import { API_BASE_URL } from '@/lib/config';

export const MARQUEE_ICONS: Record<string, LucideIcon | undefined> = {
  ShieldCheck,
  Truck,
  FlaskConical,
  Stethoscope,
  Sparkles,
  Award,
  HeartPulse,
  Lock,
  CheckCircle2,
  Zap,
  Shield,
  Star,
  FileCheck,
  Pill,
  Heart,
  BadgeCheck,
  Activity,
};

export function getMarqueeIcon(iconName?: string): LucideIcon {
  if (!iconName) return ShieldCheck;
  return MARQUEE_ICONS[iconName] ?? ShieldCheck;
}

export const DEFAULT_MARQUEE_ITEMS = [
  {
    id: '1',
    icon: 'ShieldCheck',
    title: 'WHO-GMP Certified',
    subtitle: 'Grade A/B Cleanrooms',
  },
  {
    id: '2',
    icon: 'Truck',
    title: 'Cold-Chain Delivery',
    subtitle: 'Temp-Monitored Transit',
  },
  {
    id: '3',
    icon: 'FlaskConical',
    title: '3rd-Party Lab Tested',
    subtitle: '100% Batch Released',
  },
  {
    id: '4',
    icon: 'Stethoscope',
    title: 'Clinical Specialist Oversight',
    subtitle: 'Physician Approved',
  },
  {
    id: '5',
    icon: 'Sparkles',
    title: 'High Bioavailability',
    subtitle: 'Active Therapeutic Yield',
  },
  {
    id: '6',
    icon: 'Award',
    title: 'ISO 9001:2015 Accredited',
    subtitle: 'End-to-End Traceability',
  },
  {
    id: '7',
    icon: 'HeartPulse',
    title: 'Evidence-Based Formulations',
    subtitle: 'Pure Clinical Potency',
  },
  {
    id: '8',
    icon: 'Lock',
    title: 'Tamper-Evident Medical Packaging',
    subtitle: 'Batch Coded & Sealed',
  },
];

export interface MarqueeItemData {
  id?: string | null;
  icon: string;
  title: string;
  subtitle: string;
}

export interface MarqueeBannerProps {
  previewSettings?: {
    enabled: boolean;
    speed?: number | null;
    items: MarqueeItemData[];
  };
}

export default function MarqueeBanner({ previewSettings }: MarqueeBannerProps = {}) {
  const [marqueeItems, setMarqueeItems] = useState<MarqueeItemData[]>(DEFAULT_MARQUEE_ITEMS);
  const [enabled, setEnabled] = useState(true);
  const [speed, setSpeed] = useState<number>(35);

  useEffect(() => {
    // If preview settings are supplied directly, do not fetch
    if (previewSettings) return;

    let isMounted = true;
    async function loadSettings() {
      try {
        const res = await fetch(`${API_BASE_URL}/api/settings`);
        if (res.ok) {
          const json = (await res.json()) as {
            success?: boolean;
            data?: {
              marquee?: {
                enabled: boolean;
                speed?: number | null;
                items: MarqueeItemData[];
              };
            };
          };

          if (json.success && json.data?.marquee && isMounted) {
            const m = json.data.marquee;
            setEnabled(m.enabled);
            if (typeof m.speed === 'number' && m.speed > 0) {
              setSpeed(m.speed);
            }
            if (Array.isArray(m.items) && m.items.length > 0) {
              setMarqueeItems(m.items);
            }
          }
        }
      } catch (err) {
        console.warn('Failed to load marquee settings, using defaults:', err);
      }
    }

    void loadSettings();
    return () => {
      isMounted = false;
    };
  }, [previewSettings]);

  const isCurrentlyEnabled = previewSettings?.enabled ?? enabled;
  const activeItems = previewSettings?.items ?? marqueeItems;
  const activeSpeed = previewSettings?.speed ?? speed;

  // If disabled and not in preview mode, don't render on the storefront
  if (!isCurrentlyEnabled && !previewSettings) {
    return null;
  }

  // Duplicate array to achieve seamless infinite translation loop
  const rawItems = activeItems.length > 0 ? activeItems : DEFAULT_MARQUEE_ITEMS;
  const displayItems =
    rawItems.length < 5
      ? [...rawItems, ...rawItems, ...rawItems, ...rawItems]
      : [...rawItems, ...rawItems];

  return (
    <aside
      aria-label="Clinical quality & trust highlights"
      className="bg-[#060e1a] text-wellness-light-green border-t border-slate-800/80 border-b border-slate-800/50 relative overflow-hidden py-4 sm:py-4.5 select-none group"
    >
      {/* Left and Right Edge Gradient Masks */}
      <div className="pointer-events-none absolute inset-y-0 left-0 w-16 sm:w-32 md:w-44 bg-gradient-to-r from-[#060e1a] to-transparent z-10" />
      <div className="pointer-events-none absolute inset-y-0 right-0 w-16 sm:w-32 md:w-44 bg-gradient-to-l from-[#060e1a] to-transparent z-10" />

      {/* Marquee Track */}
      <div
        className="flex animate-marquee items-center gap-8 sm:gap-12"
        style={{ animationDuration: `${String(activeSpeed)}s` }}
      >
        {displayItems.map((item, idx) => {
          const Icon = getMarqueeIcon(item.icon);
          return (
            <div
              key={`${item.title}-${String(idx)}`}
              className="flex items-center gap-3 shrink-0 transition-opacity duration-200"
            >
              {/* Icon badge */}
              <div className="w-8 h-8 rounded-xl bg-wellness-green/15 text-wellness-green border border-wellness-green/30 flex items-center justify-center shrink-0 shadow-xs">
                <Icon size={16} className="stroke-[2.2]" />
              </div>

              {/* Text pair */}
              <div className="flex items-baseline gap-2">
                <span className="text-xs sm:text-sm font-heading font-black tracking-wider uppercase text-white whitespace-nowrap">
                  {item.title}
                </span>
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest hidden sm:inline whitespace-nowrap">
                  {item.subtitle}
                </span>
              </div>

              {/* Dot divider */}
              <div className="w-1.5 h-1.5 rounded-full bg-wellness-green/50 ml-5 sm:ml-8 shrink-0" />
            </div>
          );
        })}
      </div>
    </aside>
  );
}
