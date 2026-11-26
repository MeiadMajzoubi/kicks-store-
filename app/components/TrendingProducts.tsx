"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import Link from "next/link";
import { ImageOff } from "lucide-react";
import { Tabs as TabsPrimitive } from "@base-ui/react/tabs";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { colourRamp, TRENDING_PER_TAB_PHONE } from "@/lib/mix";
import type { Product } from "@/lib/products";
import Price from "./Price";
import ProductPhoto from "./ProductPhoto";

function ProductCard({ product }: { product: Product }) {
  const [imageMissing, setImageMissing] = useState(false);

  return (
    <Link
      href={`/products/${product.id}`}
      className="product-card"
      data-image-missing={imageMissing || undefined}
    >
      <div className="product-image">
        {imageMissing ? (
          <div className="product-unavailable" role="img" aria-label={`Photo unavailable for ${product.name}`}>
            <ImageOff aria-hidden="true" className="size-6" strokeWidth={1} />
            <span>Photo unavailable</span>
          </div>
        ) : (
          // A square as tall as the tile, centred: the photo fills it, so every shoe gets the same space.
          <div className="relative mx-auto aspect-square h-full">
            <ProductPhoto
              src={product.variants[0].image}
              alt={product.name}
              sizes="(min-width: 1024px) 180px, (min-width: 640px) 22vw, 42vw"
              // Cut-outs fill their box edge to edge. This room makes them look the same size as the studio photos
              // (ProductPhoto scales those to 87% of the box), which are mostly low, flat shoes.
              inset="p-[8%]"
              onError={() => setImageMissing(true)}
            />
          </div>
        )}
      </div>
      <div className="product-details">
        <p className="text-xs text-muted-foreground">{product.brand.name}</p>
        <h3 className="text-sm font-semibold leading-snug tracking-tight">{product.name}</h3>
        <Price product={product} className="mt-1 text-sm font-medium" />
      </div>
    </Link>
  );
}

/**
 * Phones: one row you swipe sideways (about two and a half cards in view, each snapping into place), with a
 * thin line under it whose dark part shows how much of the row is in view and where. Only the first
 * TRENDING_PER_TAB_PHONE shoes of the mixed order show there. Tablets up: the full grid, 3 columns, 5 from `lg`,
 * in colour-ramp order.
 */
function ShoeRow({ products }: { products: Product[] }) {
  const listRef = useRef<HTMLUListElement>(null);
  const thumbRef = useRef<HTMLSpanElement>(null);

  // Sets the dark part's length (the share of the row in view) and position (how far it has been swiped).
  const update = useCallback(() => {
    const list = listRef.current;
    const thumb = thumbRef.current;
    if (!list || !thumb || list.scrollWidth === 0) return;
    const shown = Math.min(1, list.clientWidth / list.scrollWidth);
    const along = list.scrollLeft / Math.max(1, list.scrollWidth - list.clientWidth);
    thumb.style.width = `${shown * 100}%`;
    thumb.style.transform = `translateX(${((along * (1 - shown)) / shown) * 100}%)`;
  }, []);

  // Measure again whenever the row's size changes (a rotated phone, a resized window), after the new layout.
  useEffect(() => {
    const list = listRef.current;
    if (!list) return;
    const observer = new ResizeObserver(update);
    observer.observe(list);
    return () => observer.disconnect();
  }, [update]);

  // Tablets up show every shoe along the colour ramp, so the wide grid looks tidy; phones keep the mixed order.
  const ramp = useMemo(() => colourRamp(products), [products]);

  return (
    <>
      <ul
        ref={listRef}
        onScroll={update}
        className="-mx-4 flex snap-x snap-mandatory scroll-px-4 gap-3 overflow-x-auto px-4 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden sm:hidden"
      >
        {products.slice(0, TRENDING_PER_TAB_PHONE).map((product) => (
          <li key={product.id} className="w-[42%] shrink-0 snap-start">
            <ProductCard product={product} />
          </li>
        ))}
      </ul>
      <ul className="hidden sm:grid sm:grid-cols-3 sm:gap-x-6 sm:gap-y-8 lg:grid-cols-5 lg:gap-x-8 lg:gap-y-6">
        {ramp.map((product) => (
          <li key={product.id} className="min-w-0">
            <ProductCard product={product} />
          </li>
        ))}
      </ul>
      <div aria-hidden="true" className="mt-6 h-0.5 overflow-hidden rounded-full bg-border sm:hidden">
        <span ref={thumbRef} className="block h-full w-1/3 rounded-full bg-foreground" />
      </div>
    </>
  );
}

// products: the trending shoes, loaded and already mixed by the home page (a server page) and passed down.
export default function TrendingProducts({ products }: { products: Product[] }) {
  const [selected, setSelected] = useState("men");
  const collections = [
    { value: "men", label: "Men", products: products.filter((product) => product.gender === "men") },
    { value: "women", label: "Women", products: products.filter((product) => product.gender === "women") },
  ];

  return (
    // The title sits on the page like the other home sections; the grey panel holds the pill and the shoes.
    <section id="trending" aria-labelledby="trending-title" className="content-shell section-space">
      <div className="mb-8 flex flex-wrap items-end justify-between gap-4 sm:mb-10">
        <h2 id="trending-title" className="section-title">Trending now</h2>
        <Link href="/shop" className="text-link">
          Shop all
        </Link>
      </div>

      {/* Phones: no panel, so each grey photo tile stands on the white page. Tablets up: the grey panel. */}
      <div className="sm:rounded-[7.5px] sm:bg-surface sm:p-8 lg:px-10 lg:py-10">
        {/* Switching is one smooth move: the black pill glides to the new tab (600ms on the calm in-out easing, transform only,
            so it can be interrupted mid-way), while the two lists, both already loaded, crossfade in the same spot. The
            leaving list fades quicker than the new one arrives. */}
        <Tabs value={selected} onValueChange={(next) => setSelected(String(next))} className="w-full gap-0">
          <TabsList aria-label="Trending collections" className="relative h-11 w-max gap-0 rounded-full border border-border bg-background p-1 group-data-horizontal/tabs:h-11">
            <TabsPrimitive.Indicator
              aria-hidden="true"
              className="absolute top-1 bottom-1 left-0 w-(--active-tab-width) translate-x-(--active-tab-left) rounded-full bg-foreground transition-transform duration-600 ease-(--ease-in-out)"
            />
            {collections.map(({ value, label }) => (
              <TabsTrigger
                key={value}
                id={`trending-tab-${value}`}
                value={value}
                aria-controls={`trending-panel-${value}`}
                className="z-10 h-full w-24 flex-none rounded-full px-0 text-sm font-semibold text-foreground shadow-none transition-[color,transform] duration-400 after:hidden active:scale-[0.97] data-active:bg-transparent! data-active:text-white! data-active:shadow-none!"
              >
                {label}
              </TabsTrigger>
            ))}
          </TabsList>

          <div className="mt-4 grid grid-cols-[minmax(0,1fr)] sm:mt-6">
            {collections.map(({ value, products }) => {
              const active = value === selected;
              return (
                <div
                  key={value}
                  id={`trending-panel-${value}`}
                  role="tabpanel"
                  aria-labelledby={`trending-tab-${value}`}
                  inert={!active}
                  className={`col-start-1 row-start-1 min-w-0 transition-[opacity,translate] motion-reduce:delay-0 ${
                    active ? "translate-y-0 opacity-100 delay-100 duration-550 ease-(--ease-in-out)" : "pointer-events-none translate-y-2 opacity-0 duration-250 ease-out"
                  }`}
                >
                  <ShoeRow products={products} />
                </div>
              );
            })}
          </div>
        </Tabs>
      </div>
    </section>
  );
}