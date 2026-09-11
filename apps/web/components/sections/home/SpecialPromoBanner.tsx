'use client';

import { motion } from 'motion/react';
import Image from 'next/image';
import Link from 'next/link';
import React from 'react';

interface SpecialPromoBannerProps {
  banner?: { imageUrl: string; targetUrl?: string } | null;
  loading?: boolean;
}

export default function SpecialPromoBanner({
  banner = null,
  loading = false,
}: SpecialPromoBannerProps) {
  if (loading || !banner) {
    return null;
  }

  const bannerImage = banner.imageUrl;
  const bannerLink = banner.targetUrl || '/products';

  return (
    <section className="py-4 md:py-8 bg-white relative overflow-hidden w-full">
      <motion.div
        initial={{ opacity: 0, y: 15 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: '-50px' }}
        transition={{ duration: 0.6, ease: 'easeOut' }}
        className="w-full"
      >
        <Link href={bannerLink} className="block w-full">
          <div className="group relative w-full h-[180px] sm:h-[260px] md:h-[340px] lg:h-[420px] overflow-hidden shadow-md hover:shadow-xl transition-all duration-500 cursor-pointer">
            {/* Overlay shadow for aesthetic glow */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/15 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 z-10"></div>

            <Image
              src={bannerImage}
              alt="Special Advertisement Banner"
              fill
              className="object-cover transition-transform duration-700 ease-out group-hover:scale-[1.01]"
              priority
              sizes="100vw"
              unoptimized={bannerImage.startsWith('data:')}
            />
          </div>
        </Link>
      </motion.div>
    </section>
  );
}
