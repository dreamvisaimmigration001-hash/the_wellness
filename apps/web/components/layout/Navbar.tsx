'use client';

import Link from 'next/link';
import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import React, { useState, useEffect, useRef } from 'react';

import AnnouncementBar from './navbar/AnnouncementBar';
import MobileNavDrawer from './navbar/MobileNavDrawer';
import NavbarSearch from './navbar/NavbarSearch';
import NavDesktopBar from './navbar/NavDesktopBar';
import NavUserActions from './navbar/NavUserActions';
import type { SearchSuggestionItem } from './navbar/types';

import { useCart } from '@/context/CartContext';
import { authClient } from '@/lib/auth-client';
import { API_BASE_URL } from '@/lib/config';

export default function Navbar() {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const { toggleCart, cartCount } = useCart();
  const { data: session } = authClient.useSession();

  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [mobileSearchOpen, setMobileSearchOpen] = useState(false);
  const [categoryDropdownOpen, setCategoryDropdownOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [showBanner, setShowBanner] = useState(false);

  // Search Suggestions State
  const [suggestions, setSuggestions] = useState<SearchSuggestionItem[]>([]);
  const [isLoadingSuggestions, setIsLoadingSuggestions] = useState(false);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [focusedIndex, setFocusedIndex] = useState(-1);
  const [navCategories, setNavCategories] = useState<string[]>([]);

  const dropdownRef = useRef<HTMLDivElement>(null);
  const navBarContentRef = useRef<HTMLDivElement>(null);
  const searchContainerRef = useRef<HTMLDivElement>(null);
  const mobileSearchContainerRef = useRef<HTMLDivElement>(null);

  // Fetch real categories from Backend
  useEffect(() => {
    let isMounted = true;
    async function loadNavCategories() {
      try {
        const res = await fetch(`${API_BASE_URL}/api/categories`);
        if (res.ok) {
          const json = (await res.json()) as {
            data?: Array<{ name: string; isActive?: boolean }>;
          };
          const list = json.data || [];
          const names = list.filter((c) => c.isActive !== false && c.name).map((c) => c.name);
          if (isMounted && names.length > 0) {
            setNavCategories(names);
          }
        }
      } catch {
        // ignore
      }
    }
    void loadNavCategories();
    return () => {
      isMounted = false;
    };
  }, []);

  // Fetch Live Search Suggestions from Backend
  useEffect(() => {
    if (!searchQuery || searchQuery.trim().length < 1) {
      setSuggestions([]);
      setShowSuggestions(false);
      return;
    }

    const timer = setTimeout(() => {
      void (async () => {
        setIsLoadingSuggestions(true);
        try {
          const API_BASE = API_BASE_URL;
          const res = await fetch(
            `${API_BASE}/api/search/suggestions?q=${encodeURIComponent(searchQuery.trim())}&limit=6`,
          );
          if (res.ok) {
            const json = (await res.json()) as {
              data?: { suggestions?: SearchSuggestionItem[] };
              suggestions?: SearchSuggestionItem[];
            };
            const items: SearchSuggestionItem[] = json.data?.suggestions ?? json.suggestions ?? [];
            setSuggestions(items);
            setShowSuggestions(true);
            setFocusedIndex(-1);
          }
        } catch (err) {
          console.error('Failed to fetch search suggestions:', err);
        } finally {
          setIsLoadingSuggestions(false);
        }
      })();
    }, 220);

    return () => {
      clearTimeout(timer);
    };
  }, [searchQuery]);

  // Check localStorage for banner state on mount
  useEffect(() => {
    const bannerClosed = localStorage.getItem('offer_banner_closed');
    if (!bannerClosed) {
      setShowBanner(true);
    }
  }, []);

  // Dynamically set --header-height CSS variable on mount and resize
  useEffect(() => {
    if (!navBarContentRef.current) return;

    const observer = new ResizeObserver((entries) => {
      for (const entry of entries) {
        const height = entry.borderBoxSize[0]
          ? entry.borderBoxSize[0].blockSize
          : entry.contentRect.height;
        document.documentElement.style.setProperty('--header-height', String(height) + 'px');
      }
    });

    observer.observe(navBarContentRef.current);
    return () => {
      observer.disconnect();
    };
  }, []);

  // Sync search input with URL if we are on the products page
  useEffect(() => {
    if (pathname === '/products') {
      setSearchQuery(searchParams.get('search') || '');
    }
  }, [searchParams, pathname]);

  // Close dropdowns on click outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setCategoryDropdownOpen(false);
      }
      const isDesktopOutside =
        searchContainerRef.current && !searchContainerRef.current.contains(event.target as Node);
      const isMobileOutside =
        mobileSearchContainerRef.current &&
        !mobileSearchContainerRef.current.contains(event.target as Node);

      if (isDesktopOutside && isMobileOutside) {
        setShowSuggestions(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const handleSearchSubmit = (e: React.SyntheticEvent<HTMLFormElement>) => {
    e.preventDefault();
    setShowSuggestions(false);
    if (focusedIndex >= 0 && suggestions[focusedIndex]) {
      handleSuggestionClick(suggestions[focusedIndex]);
      return;
    }
    if (searchQuery.trim() !== '') {
      router.push(`/products?search=${encodeURIComponent(searchQuery.trim())}`);
    } else {
      router.push('/products');
    }
  };

  const handleSuggestionClick = (item: SearchSuggestionItem) => {
    setShowSuggestions(false);
    setMobileMenuOpen(false);
    if (item.type === 'product') {
      router.push(`/products/${item.id}`);
    } else {
      router.push(`/products?category=${encodeURIComponent(item.label)}`);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (!showSuggestions || suggestions.length === 0) return;

    if (e.key === 'ArrowDown') {
      e.preventDefault();
      setFocusedIndex((prev) => (prev < suggestions.length - 1 ? prev + 1 : 0));
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      setFocusedIndex((prev) => (prev > 0 ? prev - 1 : suggestions.length - 1));
    } else if (e.key === 'Escape') {
      setShowSuggestions(false);
    }
  };

  const selectCategory = (category: string) => {
    setCategoryDropdownOpen(false);
    setMobileMenuOpen(false);
    router.push(`/products?category=${encodeURIComponent(category)}`);
  };

  return (
    <header className="fixed top-0 left-0 right-0 z-[100] w-full flex flex-col">
      <div
        ref={navBarContentRef}
        className="w-full flex flex-col border-b border-wellness-gray-200 bg-white shadow-sm"
      >
        {/* 1. Promo Offer Banner */}
        <AnnouncementBar
          showBanner={showBanner}
          onClose={() => {
            setShowBanner(false);
            localStorage.setItem('offer_banner_closed', 'true');
          }}
        />

        {/* 2. Main Header Middle Bar */}
        <div className="bg-white py-3.5 sm:py-4 w-full">
          <div className="px-4 sm:px-6 md:px-12 flex items-center justify-between gap-3 sm:gap-6 max-w-7xl mx-auto w-full">
            {/* Logo */}
            <Link
              href="/"
              className="text-lg sm:text-2xl font-heading font-black tracking-tight flex items-center gap-2 group/logo text-wellness-navy shrink-0"
            >
              <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-bl-xl rounded-tr-xl bg-wellness-green flex items-center justify-center transition-all duration-500 group-hover/logo:rotate-180 group-hover/logo:bg-wellness-navy shadow-md shadow-wellness-green/20">
                <div className="w-2.5 h-2.5 sm:w-3 sm:h-3 rounded-full bg-white transition-transform duration-500 group-hover/logo:scale-75" />
              </div>
              <span>
                The Wellness<span className="text-wellness-green font-medium">.</span>
              </span>
            </Link>

            {/* Search Bar with Live Autocomplete Suggestions */}
            <NavbarSearch
              searchQuery={searchQuery}
              setSearchQuery={setSearchQuery}
              suggestions={suggestions}
              isLoadingSuggestions={isLoadingSuggestions}
              showSuggestions={showSuggestions}
              setShowSuggestions={setShowSuggestions}
              focusedIndex={focusedIndex}
              setFocusedIndex={setFocusedIndex}
              onSearchSubmit={handleSearchSubmit}
              onSuggestionClick={handleSuggestionClick}
              onKeyDown={handleKeyDown}
              containerRef={searchContainerRef}
            />

            {/* User & Cart Actions */}
            <NavUserActions
              cartCount={cartCount}
              toggleCart={toggleCart}
              session={session}
              mobileMenuOpen={mobileMenuOpen}
              setMobileMenuOpen={(open) => {
                setMobileMenuOpen(open);
                if (open) setMobileSearchOpen(false);
              }}
              mobileSearchOpen={mobileSearchOpen}
              setMobileSearchOpen={(open) => {
                setMobileSearchOpen(open);
                if (open) setMobileMenuOpen(false);
              }}
            />
          </div>
        </div>

        {/* Mobile Search Expandable Row */}
        {mobileSearchOpen && (
          <div className="px-4 pb-3 pt-1 border-t border-wellness-gray-100 bg-white md:hidden animate-in fade-in slide-in-from-top-1 duration-150">
            <NavbarSearch
              searchQuery={searchQuery}
              setSearchQuery={setSearchQuery}
              suggestions={suggestions}
              isLoadingSuggestions={isLoadingSuggestions}
              showSuggestions={showSuggestions}
              setShowSuggestions={setShowSuggestions}
              focusedIndex={focusedIndex}
              setFocusedIndex={setFocusedIndex}
              onSearchSubmit={(e) => {
                handleSearchSubmit(e);
                setMobileSearchOpen(false);
              }}
              onSuggestionClick={(item) => {
                handleSuggestionClick(item);
                setMobileSearchOpen(false);
              }}
              onKeyDown={handleKeyDown}
              containerRef={mobileSearchContainerRef}
              isMobile
            />
          </div>
        )}

        {/* 3. Bottom Navigation & Categories Bar */}
        <NavDesktopBar
          pathname={pathname}
          categoryDropdownOpen={categoryDropdownOpen}
          setCategoryDropdownOpen={setCategoryDropdownOpen}
          onSelectCategory={selectCategory}
          dropdownRef={dropdownRef}
          categories={navCategories}
        />
      </div>

      {/* 4. Mobile Menu Drawer (Decoupled from height observation) */}
      <MobileNavDrawer
        mobileMenuOpen={mobileMenuOpen}
        setMobileMenuOpen={setMobileMenuOpen}
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
        suggestions={suggestions}
        isLoadingSuggestions={isLoadingSuggestions}
        showSuggestions={showSuggestions}
        setShowSuggestions={setShowSuggestions}
        focusedIndex={focusedIndex}
        setFocusedIndex={setFocusedIndex}
        onSearchSubmit={handleSearchSubmit}
        onSuggestionClick={handleSuggestionClick}
        onKeyDown={handleKeyDown}
        onSelectCategory={selectCategory}
        session={session}
        mobileSearchContainerRef={mobileSearchContainerRef}
        categories={navCategories}
      />
    </header>
  );
}
