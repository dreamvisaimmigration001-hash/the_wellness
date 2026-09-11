'use client';

import React, { useState, useEffect } from 'react';

import AdBanners from '@/components/sections/home/AdBanners';
import CustomerTestimonials from '@/components/sections/home/CustomerTestimonials';
import DoctorConsultBanner from '@/components/sections/home/DoctorConsultBanner';
import type { ApiCategory, ApiProduct } from '@/components/sections/home/FeaturedCategories';
import Hero from '@/components/sections/home/Hero';
import MoreProducts from '@/components/sections/home/MoreProducts';
import PopularProducts from '@/components/sections/home/PopularProducts';
import TopServices from '@/components/sections/home/TopServices';
import { API_BASE_URL } from '@/lib/config';
import { Product } from '@/lib/products';

interface ApiResponseCategories {
  success?: boolean;
  data?: ApiCategory[];
  categories?: ApiCategory[];
}

interface ApiResponseProducts {
  success?: boolean;
  data?: {
    products?: ApiProduct[];
    items?: ApiProduct[];
  };
  products?: ApiProduct[];
}

export default function Home() {
  const [, setCategories] = useState<ApiCategory[]>([]);
  const [, setRawProducts] = useState<ApiProduct[]>([]);
  const [mappedProducts, setMappedProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let isMounted = true;

    async function loadHomePageData() {
      try {
        const API_BASE = API_BASE_URL;

        // Fetch all home page routes simultaneously in a single Promise.all
        const [categoriesRes, productsRes] = await Promise.all([
          fetch(`${API_BASE}/api/categories`, { signal: AbortSignal.timeout(6000) }).catch(
            () => null,
          ),
          fetch(`${API_BASE}/api/products?limit=100`, { signal: AbortSignal.timeout(6000) }).catch(
            () => null,
          ),
        ]);

        if (!isMounted) return;

        // 1. Process Categories
        if (categoriesRes?.ok) {
          const catJson = (await categoriesRes.json()) as ApiResponseCategories;
          const rawCats = catJson.data || catJson.categories || [];
          if (Array.isArray(rawCats)) {
            setCategories(rawCats.filter((c) => c.isActive !== false));
          }
        }

        // 2. Process Products
        if (productsRes?.ok) {
          const prodJson = (await productsRes.json()) as ApiResponseProducts;
          const items = prodJson.data?.products || prodJson.data?.items || prodJson.products || [];
          if (Array.isArray(items)) {
            setRawProducts(items);

            const mapped: Product[] = items.map((item) => {
              const sp = item.sellingPrice;
              const price = typeof sp === 'number' ? sp : parseFloat(sp || '0');
              const mrpVal = item.mrp
                ? typeof item.mrp === 'number'
                  ? item.mrp
                  : parseFloat(item.mrp)
                : undefined;

              const itemType =
                item.type === 'Prescription (Rx)'
                  ? ('Prescription (Rx)' as const)
                  : ('Over-The-Counter (OTC)' as const);

              return {
                id: item.id,
                name: item.name,
                category: item.categoryName || item.category || 'OTC & Wellness',
                type: itemType,
                description: item.description || '',
                benefits: [],
                ingredients: [],
                image: item.primaryImage || item.image || '/images/cardiostatin.png',
                price,
                mrp: mrpVal,
                isBestSeller: Boolean(item.isBestSeller),
                isNewest: Boolean(item.isNewest),
                isFeatured: Boolean(item.isFeatured),
                availableQty: item.availableQty ?? item.inventoryQty ?? item.stockQty ?? 0,
                stockStatus: item.stockStatus ?? 'in_stock',
              };
            });

            setMappedProducts(mapped);
          }
        }
      } catch (err) {
        console.error('Failed to load home page data with Promise.all:', err);
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    }

    void loadHomePageData();

    return () => {
      isMounted = false;
    };
  }, []);

  return (
    <>
      <Hero />
      <TopServices />
      <PopularProducts
        title="Trending Health Products"
        products={mappedProducts}
        loading={loading}
      />
      <AdBanners />
      <DoctorConsultBanner />
      <MoreProducts products={mappedProducts} loading={loading} />
      <CustomerTestimonials />
    </>
  );
}
