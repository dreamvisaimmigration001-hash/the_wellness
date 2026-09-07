'use client';

import { X } from 'lucide-react';
import { AnimatePresence, motion } from 'motion/react';
import Link from 'next/link';
import React, { useEffect, useState } from 'react';

import { AnnouncementItem, announcements as defaultAnnouncements } from './types';

import { API_BASE_URL } from '@/lib/config';

interface AnnouncementBarProps {
  showBanner: boolean;
  onClose: () => void;
}

export default function AnnouncementBar({ showBanner, onClose }: AnnouncementBarProps) {
  const [announcementsList, setAnnouncementsList] =
    useState<AnnouncementItem[]>(defaultAnnouncements);
  const [isEnabled, setIsEnabled] = useState(true);
  const [currentAnnouncementIdx, setCurrentAnnouncementIdx] = useState(0);

  useEffect(() => {
    let isMounted = true;
    async function loadSettings() {
      try {
        const res = await fetch(`${API_BASE_URL}/api/settings`);
        if (res.ok) {
          const json = (await res.json()) as {
            success?: boolean;
            data?: {
              announcement?: {
                enabled: boolean;
                badge: string;
                text: string;
                code?: string | null;
                cta?: string | null;
                link?: string | null;
              };
            };
          };
          if (json.success && json.data?.announcement && isMounted) {
            const ann = json.data.announcement;
            setIsEnabled(ann.enabled);
            if (ann.text) {
              setAnnouncementsList([
                {
                  badge: ann.badge || 'Limited Offer',
                  text: ann.text,
                  code: ann.code || '',
                  cta: ann.cta || 'Shop Now',
                  link: ann.link || '/products',
                },
              ]);
            }
          }
        }
      } catch (e) {
        console.warn('Failed to load announcement settings:', e);
      }
    }
    void loadSettings();
    return () => {
      isMounted = false;
    };
  }, []);

  useEffect(() => {
    if (!showBanner || !isEnabled || announcementsList.length <= 1) return;
    const interval = setInterval(() => {
      setCurrentAnnouncementIdx((prev) => (prev + 1) % announcementsList.length);
    }, 5000);
    return () => {
      clearInterval(interval);
    };
  }, [showBanner, isEnabled, announcementsList.length]);

  if (!isEnabled || !showBanner || announcementsList.length === 0) {
    return null;
  }

  const currentItem = announcementsList[currentAnnouncementIdx] ?? announcementsList[0];

  return (
    <AnimatePresence>
      <motion.div
        initial={{ height: 0, opacity: 0 }}
        animate={{ height: 'auto', opacity: 1 }}
        exit={{ height: 0, opacity: 0 }}
        transition={{ duration: 0.3, ease: 'easeInOut' }}
        className="bg-gradient-to-r from-wellness-navy via-[#1E5C5A] to-wellness-green text-white relative overflow-hidden shrink-0 animate-gradient-shift border-b border-white/5 shadow-sm"
      >
        <div className="h-10 max-w-7xl mx-auto px-6 md:px-12 flex justify-between items-center w-full relative">
          {/* Cycling Announcement Carousel */}
          <div className="flex-1 flex justify-center items-center h-full px-8 sm:px-12">
            <AnimatePresence mode="wait">
              <motion.div
                key={currentAnnouncementIdx}
                initial={{ y: 12, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                exit={{ y: -12, opacity: 0 }}
                transition={{ duration: 0.3, ease: 'easeInOut' }}
                className="flex items-center justify-center gap-1.5 sm:gap-3 text-xs w-full"
              >
                <span className="hidden sm:inline-flex bg-wellness-light-green/20 text-wellness-light-green text-[9px] sm:text-[10px] font-extrabold uppercase tracking-widest px-2.5 py-0.5 rounded border border-wellness-light-green/20 shadow-sm select-none shrink-0 animate-pulse">
                  {currentItem.badge}
                </span>
                <Link
                  href={currentItem.link || '/products'}
                  className="flex items-center gap-1.5 sm:gap-2 text-[10px] sm:text-xs text-wellness-light-green/95 hover:text-white font-semibold transition-colors truncate max-w-full"
                >
                  <span className="truncate">{currentItem.text}</span>
                  {currentItem.code && (
                    <span className="bg-white/10 px-1.5 py-0.5 rounded text-white font-mono text-[9px] sm:text-[10px] border border-white/10 font-bold shrink-0">
                      {currentItem.code}
                    </span>
                  )}
                </Link>
                {currentItem.cta && (
                  <Link
                    href={currentItem.link || '/products'}
                    className="hidden md:inline-flex text-white hover:text-wellness-light-green underline underline-offset-4 text-xs font-extrabold transition-colors shrink-0 group items-center gap-1"
                  >
                    <span>{currentItem.cta}</span>
                    <span className="transition-transform group-hover:translate-x-0.5">→</span>
                  </Link>
                )}
              </motion.div>
            </AnimatePresence>
          </div>

          {/* Close Button */}
          <button
            onClick={onClose}
            className="p-1 rounded-full text-white/70 hover:text-white hover:bg-white/10 transition-all cursor-pointer absolute right-2 sm:right-8"
            aria-label="Close Announcement"
          >
            <X size={14} />
          </button>
        </div>
      </motion.div>
    </AnimatePresence>
  );
}
