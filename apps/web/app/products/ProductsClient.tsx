'use client';

import { SlidersHorizontal } from 'lucide-react';
import { AnimatePresence, motion } from 'motion/react';
import { useSearchParams, useRouter } from 'next/navigation';
import React, { useState, useEffect, useCallback } from 'react';

import ProductCatalogFooter from './components/ProductCatalogFooter';
import ProductFilterSidebar from './components/ProductFilterSidebar';
import ProductGrid from './components/ProductGrid';
import ProductHeroBanner from './components/ProductHeroBanner';
import type { ProductClassification, ProductPriceRange, ProductHighlight } from './types';

import { useCart } from '@/context/CartContext';
import { API_BASE_URL } from '@/lib/config';
import { Product } from '@/lib/products';

export default function ProductsClient() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const categoryParam = searchParams.get('category') || 'All';
  const searchParam = searchParams.get('search') || '';

  const [categories, setCategories] = useState<string[]>([]);
  const [productsList, setProductsList] = useState<Product[]>([]);
  const [apiProducts, setApiProducts] = useState<Product[]>([]);
  const [isLoadingApi, setIsLoadingApi] = useState<boolean>(true);

  const [activeCategory, setActiveCategory] = useState(categoryParam);
  const [searchQuery, setSearchQuery] = useState(searchParam);
  const [activeType, setActiveType] = useState<ProductClassification>('All');
  const [activePrice, setActivePrice] = useState<ProductPriceRange>('All');
  const [activeHighlight, setActiveHighlight] = useState<ProductHighlight>('All');
  const [filteredProducts, setFilteredProducts] = useState<Product[]>([]);

  const { addToCart } = useCart();

  // Fetch real API products and categories from backend
  const fetchBackendData = useCallback(async () => {
    setIsLoadingApi(true);
    try {
      const API_BASE = API_BASE_URL;
      const prodUrl = searchParam.trim()
        ? `${API_BASE}/api/search?q=${encodeURIComponent(searchParam.trim())}`
        : `${API_BASE}/api/products`;

      const [prodsRes, catsRes] = await Promise.all([
        fetch(prodUrl, { signal: AbortSignal.timeout(5000) }),
        fetch(`${API_BASE}/api/categories`, { signal: AbortSignal.timeout(5000) }),
      ]);

      let mappedProducts: Product[] = [];
      if (prodsRes.ok) {
        const json = (await prodsRes.json()) as {
          data?: {
            products?: Array<{
              id: string;
              name: string;
              sellingPrice?: string | number;
              mrp?: string | number;
              startingPrice?: number;
              compareAtPrice?: number;
              stockQty?: number;
              inventoryQty?: number;
              availableQty?: number;
              reservedQty?: number;
              stockStatus?: 'in_stock' | 'out_of_stock';
              status?: 'listed' | 'unlisted' | 'discontinued';
              primaryImage?: string | null;
              categoryName?: string;
              category?: string;
              description?: string;
              shortDescription?: string;
              type?: string;
              isFeatured?: boolean;
              isBestSeller?: boolean;
              isNewest?: boolean;
            }>;
            items?: Array<{
              id: string;
              name: string;
              sellingPrice?: string | number;
              mrp?: string | number;
              startingPrice?: number;
              compareAtPrice?: number;
              stockQty?: number;
              inventoryQty?: number;
              availableQty?: number;
              reservedQty?: number;
              stockStatus?: 'in_stock' | 'out_of_stock';
              status?: 'listed' | 'unlisted' | 'discontinued';
              primaryImage?: string | null;
              categoryName?: string;
              category?: string;
              description?: string;
              shortDescription?: string;
              type?: string;
              isFeatured?: boolean;
              isBestSeller?: boolean;
              isNewest?: boolean;
            }>;
          };
          products?: Array<{
            id: string;
            name: string;
            sellingPrice?: string | number;
            mrp?: string | number;
            startingPrice?: number;
            compareAtPrice?: number;
            stockQty?: number;
            inventoryQty?: number;
            availableQty?: number;
            reservedQty?: number;
            stockStatus?: 'in_stock' | 'out_of_stock';
            status?: 'listed' | 'unlisted' | 'discontinued';
            primaryImage?: string | null;
            categoryName?: string;
            category?: string;
            description?: string;
            shortDescription?: string;
            type?: string;
            isFeatured?: boolean;
            isBestSeller?: boolean;
            isNewest?: boolean;
          }>;
        };

        const rawList = json.data?.products || json.data?.items || json.products || [];
        if (Array.isArray(rawList)) {
          mappedProducts = rawList
            .map((item): Product => {
              const spNum =
                typeof item.sellingPrice === 'number'
                  ? item.sellingPrice
                  : typeof item.sellingPrice === 'string'
                    ? parseFloat(item.sellingPrice)
                    : item.startingPrice || 0;
              const mrpNum =
                typeof item.mrp === 'number'
                  ? item.mrp
                  : typeof item.mrp === 'string'
                    ? parseFloat(item.mrp)
                    : item.compareAtPrice || spNum;

              const availQty = item.availableQty ?? item.inventoryQty ?? item.stockQty ?? 0;
              const resvQty = item.reservedQty ?? 0;
              const catName = item.categoryName || item.category || 'OTC & Wellness';

              return {
                id: item.id,
                name: item.name,
                category: catName,
                categoryName: catName,
                type:
                  item.type === 'Prescription (Rx)'
                    ? 'Prescription (Rx)'
                    : 'Over-The-Counter (OTC)',
                description:
                  item.description || item.shortDescription || 'No description provided.',
                benefits: [],
                ingredients: [],
                image: item.primaryImage || '/images/cardiostatin.png',
                images: item.primaryImage ? [item.primaryImage] : ['/images/cardiostatin.png'],
                price: spNum,
                originalPrice: mrpNum,
                mrp: mrpNum,
                sellingPrice: spNum,
                stockQty: item.stockQty ?? 0,
                inventoryQty: availQty,
                availableQty: availQty,
                reservedQty: resvQty,
                stockStatus: item.stockStatus ?? 'in_stock',
                status: item.status ?? 'listed',
                isFeatured: item.isFeatured ?? false,
                isBestSeller: item.isBestSeller ?? false,
                isNewest: item.isNewest ?? false,
                tags: [],
              };
            })
            .filter((p) => p.status === 'listed');
        }
      }

      setApiProducts(mappedProducts);

      if (catsRes.ok) {
        const catJson = (await catsRes.json()) as {
          data?: Array<{ id: string; name: string }>;
        };
        const apiCatNames =
          catJson.data && Array.isArray(catJson.data) ? catJson.data.map((c) => c.name) : [];
        const merged = Array.from(
          new Set(['All', ...apiCatNames, ...mappedProducts.map((p) => p.category)]),
        );
        setCategories(merged);
      } else {
        const distinct = Array.from(new Set(['All', ...mappedProducts.map((p) => p.category)]));
        setCategories(distinct);
      }
    } catch (e) {
      console.error('Failed to fetch product catalog from API:', e);
      setApiProducts([]);
      setCategories(['All']);
    } finally {
      setIsLoadingApi(false);
    }
  }, [searchParam]);

  useEffect(() => {
    void fetchBackendData();
  }, [fetchBackendData]);

  useEffect(() => {
    setProductsList(apiProducts);
  }, [apiProducts]);

  // Sync search query from URL params
  useEffect(() => {
    setSearchQuery(searchParams.get('search') || '');
  }, [searchParams]);

  // Sync category filter & search query & price/type filters
  useEffect(() => {
    const matchedCategory =
      categories.find((c) => c.toLowerCase() === categoryParam.toLowerCase()) || categoryParam;
    setActiveCategory(matchedCategory);

    let temp = productsList;
    if (categoryParam !== 'All') {
      const target = categoryParam.toLowerCase().trim();
      temp = temp.filter((p) => {
        const pCat = p.category.toLowerCase().trim();
        const pCatName = (p.categoryName || '').toLowerCase().trim();
        if (pCat === target || pCatName === target) return true;
        const normTarget = target.replace(/[^a-z0-9]/g, '');
        const normCat = pCat.replace(/[^a-z0-9]/g, '');
        if (normCat.length > 0 && normCat === normTarget) return true;
        if (target.length >= 4 && (pCat.includes(target) || target.includes(pCat))) return true;
        return false;
      });
    }

    if (activeType === 'Prescription') {
      temp = temp.filter((p) => p.type === 'Prescription (Rx)');
    } else if (activeType === 'OTC') {
      temp = temp.filter((p) => p.type === 'Over-The-Counter (OTC)');
    }

    if (activePrice === 'under-2000') {
      temp = temp.filter((p) => p.price < 2000);
    } else if (activePrice === '2000-5000') {
      temp = temp.filter((p) => p.price >= 2000 && p.price <= 5000);
    } else if (activePrice === 'above-5000') {
      temp = temp.filter((p) => p.price > 5000);
    }

    if (searchQuery.trim() !== '') {
      const query = searchQuery.toLowerCase();
      temp = temp.filter(
        (p) =>
          p.name.toLowerCase().includes(query) ||
          p.description.toLowerCase().includes(query) ||
          p.category.toLowerCase().includes(query) ||
          p.ingredients.some((ing) => ing.toLowerCase().includes(query)),
      );
    }

    // Apply active highlight sorting/filtering
    if (activeHighlight === 'new') {
      const newestOnly = temp.filter((p) => p.isNewest);
      temp = newestOnly.length > 0 ? newestOnly : [...temp].reverse();
    } else if (activeHighlight === 'best') {
      const bestsellersOnly = temp.filter((p) => p.isBestSeller);
      temp = bestsellersOnly.length > 0 ? bestsellersOnly : temp;
    } else if (activeHighlight === 'featured') {
      const featuredOnly = temp.filter((p) => p.isFeatured);
      temp = featuredOnly.length > 0 ? featuredOnly : temp;
    } else if (activeHighlight === 'discount') {
      temp = temp.filter((p) => p.price < 4000 || (p.mrp && p.price && p.mrp > p.price));
    }

    setFilteredProducts(temp);
  }, [
    categoryParam,
    searchQuery,
    productsList,
    activeType,
    activePrice,
    activeHighlight,
    categories,
  ]);

  const handleCategoryChange = (category: string) => {
    router.push(
      `/products${category === 'All' ? '' : `?category=${encodeURIComponent(category)}`}`,
      { scroll: false },
    );
  };

  const handleResetFilters = () => {
    setActiveCategory('All');
    setActiveType('All');
    setActivePrice('All');
    setActiveHighlight('All');
    setSearchQuery('');
    router.push('/products', { scroll: false });
  };

  const getCategoryCount = (category: string) => {
    if (category === 'All') return productsList.length;
    const target = category.toLowerCase().trim();
    return productsList.filter((p) => {
      const pCat = p.category.toLowerCase().trim();
      const pCatName = (p.categoryName || '').toLowerCase().trim();
      if (pCat === target || pCatName === target) return true;
      const normTarget = target.replace(/[^a-z0-9]/g, '');
      const normCat = pCat.replace(/[^a-z0-9]/g, '');
      if (normCat.length > 0 && normCat === normTarget) return true;
      if (target.length >= 4 && (pCat.includes(target) || target.includes(pCat))) return true;
      return false;
    }).length;
  };

  const activeFiltersCount =
    (activeCategory !== 'All' ? 1 : 0) +
    (activeType !== 'All' ? 1 : 0) +
    (activePrice !== 'All' ? 1 : 0) +
    (activeHighlight !== 'All' ? 1 : 0) +
    (searchQuery.trim() !== '' ? 1 : 0);

  const hasActiveFilters = activeFiltersCount > 0;

  const [mobileFilterOpen, setMobileFilterOpen] = useState(false);

  const handleAddToCart = (product: Product, quantity = 1) => {
    void addToCart(product, quantity);
  };

  return (
    <div className="w-full bg-[#FAF9F6] min-h-screen">
      {/* 1. Hero Header Banner */}
      <ProductHeroBanner activeCategory={activeCategory} />

      {/* 2. Main Overlapping Content Overlay */}
      <div className="relative z-20 max-w-[1600px] mx-auto px-3 sm:px-6 lg:px-8 -mt-10 sm:-mt-20 md:-mt-28 pb-24">
        <div className="bg-white rounded-[24px] sm:rounded-[32px] md:rounded-[40px] shadow-[0_20px_60px_rgba(12,27,51,0.06)] p-4 sm:p-6 lg:p-10 border border-wellness-gray-200/50">
          {/* Mobile Filter Action Bar & Horizontal Category Chips Strip */}
          <div className="lg:hidden mb-6 space-y-3">
            <div className="flex items-center justify-between gap-3">
              <button
                type="button"
                onClick={() => {
                  setMobileFilterOpen(true);
                }}
                className={`inline-flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold border transition-colors shadow-xs cursor-pointer ${
                  activeFiltersCount > 0
                    ? 'bg-wellness-navy text-white border-wellness-navy'
                    : 'bg-white text-wellness-navy border-wellness-gray-200 hover:bg-wellness-gray-50'
                }`}
              >
                <SlidersHorizontal size={14} />
                <span>Filters & Refine</span>
                {activeFiltersCount > 0 && (
                  <span className="bg-wellness-green text-white text-[10px] font-black w-5 h-5 rounded-full flex items-center justify-center">
                    {activeFiltersCount}
                  </span>
                )}
              </button>

              {hasActiveFilters && (
                <button
                  type="button"
                  onClick={handleResetFilters}
                  className="text-[11px] font-bold text-red-500 hover:text-red-700 uppercase tracking-wider cursor-pointer"
                >
                  Reset All
                </button>
              )}
            </div>

            {/* Horizontal Category Chips Bar */}
            <div className="flex items-center gap-2 overflow-x-auto no-scrollbar py-1 flex-nowrap">
              {['All', ...categories.filter((c) => c.toLowerCase() !== 'all')].map((cat) => {
                const isSelected = activeCategory.toLowerCase() === cat.toLowerCase();
                const count = getCategoryCount(cat);
                return (
                  <button
                    key={cat}
                    type="button"
                    onClick={() => {
                      handleCategoryChange(cat);
                    }}
                    className={`shrink-0 px-3.5 py-1.5 rounded-full text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 border whitespace-nowrap ${
                      isSelected
                        ? 'bg-wellness-green text-white border-wellness-green shadow-xs'
                        : 'bg-wellness-gray-100 text-wellness-navy border-wellness-gray-200/60 hover:bg-wellness-gray-200'
                    }`}
                  >
                    <span>{cat}</span>
                    <span
                      className={`text-[9px] px-1.5 py-0.2 rounded-full ${
                        isSelected ? 'bg-white/20 text-white' : 'bg-white text-wellness-charcoal/60'
                      }`}
                    >
                      {count}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>

          <div className="flex flex-col lg:flex-row gap-8 lg:gap-12">
            {/* Desktop Left Sidebar Filter Section */}
            <div className="hidden lg:block shrink-0">
              <ProductFilterSidebar
                categories={categories}
                activeCategory={activeCategory}
                activeType={activeType}
                activePrice={activePrice}
                activeHighlight={activeHighlight}
                hasActiveFilters={hasActiveFilters}
                onResetFilters={handleResetFilters}
                onSelectCategory={handleCategoryChange}
                onSelectType={setActiveType}
                onSelectPrice={setActivePrice}
                onSelectHighlight={setActiveHighlight}
                getCategoryCount={getCategoryCount}
              />
            </div>

            {/* Right Content Section */}
            <ProductGrid
              products={filteredProducts}
              isLoading={isLoadingApi}
              totalApiProductsCount={apiProducts.length}
              searchQuery={searchQuery}
              onSearchChange={setSearchQuery}
              onAddToCart={handleAddToCart}
            />
          </div>
        </div>

        {/* Mobile Filter Drawer Modal */}
        <AnimatePresence>
          {mobileFilterOpen && (
            <>
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 0.5 }}
                exit={{ opacity: 0 }}
                onClick={() => {
                  setMobileFilterOpen(false);
                }}
                className="fixed inset-0 bg-black z-[120] lg:hidden cursor-pointer"
              />
              <motion.div
                initial={{ x: '-100%' }}
                animate={{ x: 0 }}
                exit={{ x: '-100%' }}
                transition={{ type: 'spring', damping: 25, stiffness: 220 }}
                className="fixed left-0 top-0 bottom-0 w-[88vw] max-w-sm bg-white z-[130] p-4 sm:p-6 overflow-y-auto lg:hidden shadow-2xl"
              >
                <ProductFilterSidebar
                  categories={categories}
                  activeCategory={activeCategory}
                  activeType={activeType}
                  activePrice={activePrice}
                  activeHighlight={activeHighlight}
                  hasActiveFilters={hasActiveFilters}
                  onResetFilters={handleResetFilters}
                  onSelectCategory={handleCategoryChange}
                  onSelectType={setActiveType}
                  onSelectPrice={setActivePrice}
                  onSelectHighlight={setActiveHighlight}
                  getCategoryCount={getCategoryCount}
                  onClose={() => {
                    setMobileFilterOpen(false);
                  }}
                />
              </motion.div>
            </>
          )}
        </AnimatePresence>

        {/* Newsletter & Trust Badges */}
        <ProductCatalogFooter />
      </div>
    </div>
  );
}
