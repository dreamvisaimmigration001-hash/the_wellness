import DailyDeals from '@/components/sections/home/DailyDeals';
import FeaturedCategories from '@/components/sections/home/FeaturedCategories';
import Hero from '@/components/sections/home/Hero';
import PopularProducts from '@/components/sections/home/PopularProducts';
import ProductCatalog from '@/components/sections/home/ProductCatalog';
import PromoBanners from '@/components/sections/home/PromoBanners';
import SpecialPromoBanner from '@/components/sections/home/SpecialPromoBanner';

export default function Home() {
  return (
    <>
      <Hero />
      <FeaturedCategories />
      <DailyDeals />
      <PopularProducts />
      <SpecialPromoBanner />
      <ProductCatalog />
      <PromoBanners />
    </>
  );
}
