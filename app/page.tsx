import HeroCarousel from "./components/HeroCarousel";
import TrendingProducts from "./components/TrendingProducts";
import ShopByBrands from "./components/ShopByBrands";
import ShopByCategory from "./components/ShopByCategory";
import Advantages from "./components/Advantages";

// Rendered on the server; only the sections that move or react ship their own browser code.
export default function Home() {
  return (
    <main id="main-content" tabIndex={-1} className="min-h-screen outline-none">
      <section aria-label="Featured collections">
        <HeroCarousel />

        <div className="content-shell border-b border-border py-8 sm:py-10 lg:py-12">
          <h1 className="page-title">Find your next pair<span className="title-mark">.</span></h1>
          <p className="section-intro">For the everyday. For the extra mile. Make your next move.</p>
        </div>
      </section>
      <div className="pt-6 sm:pt-10 lg:pt-14">
        <TrendingProducts />
      </div>
      <ShopByBrands />
      <ShopByCategory />
      <Advantages />
    </main>
  );
}
