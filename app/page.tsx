import { connection } from "next/server";
import { getProducts } from "@/lib/products";
import { trendingOrder } from "@/lib/catalog";
import HeroCarousel from "./components/HeroCarousel";
import TrendingProducts from "./components/TrendingProducts";
import ShopByBrands from "./components/ShopByBrands";
import ShopByCategory from "./components/ShopByCategory";
import Advantages from "./components/Advantages";

// Rendered on the server; only the sections that move or react ship their own browser code.
// The time of this visit. Read at request time: the page waits for connection() first.
const now = () => Date.now();

export default async function Home() {
  // Built on every visit, so trending shoes and store numbers always match the database.
  await connection();
  // Trending gets a new mix every 24 hours.
  const trending = trendingOrder((await getProducts()).filter((product) => product.isTrending), now());

  return (
    <main id="main-content" tabIndex={-1} className="min-h-screen outline-none">
      <section aria-label="Featured collections">
        <HeroCarousel />

        <div className="content-shell border-b border-border py-8 sm:py-10 lg:py-12">
          <h1 className="page-title">Find your next pair<span className="title-mark">.</span></h1>
          
          <h3 className="section-title mt-3 text-[clamp(1.125rem,1.8vw,1.625rem)] text-brand">For the everyday. For the extra mile. Make your next move<span className="text-foreground">.</span></h3>
        </div>
      </section>
      <TrendingProducts products={trending} />
      <ShopByBrands />
      <ShopByCategory />
      <Advantages />
    </main>
  );
}
