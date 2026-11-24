"use client";

import { useState } from "react";
import Link from "next/link";
import { ArrowRight, ImageOff } from "lucide-react";
import { Tabs as TabsPrimitive } from "@base-ui/react/tabs";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
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
          // The frame's padding keeps the shoe small; the inner box is what the photo fills.
          <div className="relative size-full">
            <ProductPhoto
              src={product.variants[0].image}
              alt={product.name}
              sizes="(min-width: 1024px) 180px, (min-width: 640px) 22vw, 34vw"
              inset=""
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

// products: the trending shoes, loaded and already mixed by the home page (a server page) and passed down.
export default function TrendingProducts({ products }: { products: Product[] }) {
  const [selected, setSelected] = useState("men");
  const collections = [
    { value: "men", label: "Men", products: products.filter((product) => product.gender === "men") },
    { value: "women", label: "Women", products: products.filter((product) => product.gender === "women") },
  ];

  return (
    <section id="trending" aria-labelledby="trending-title" className="content-shell mb-4 rounded-3xl bg-surface px-4 py-7 sm:p-8 lg:px-10 lg:py-10">
      <div className="mb-6 flex flex-wrap items-end justify-between gap-4 sm:mb-8">
        <h2 id="trending-title" className="section-title">Trending now</h2>
        <Link href="/shop" className="text-link">
          Shop all <ArrowRight aria-hidden="true" className="size-4" />
        </Link>
      </div>

      {/* Switching is one smooth move: the black pill glides to the new tab (700ms on the spring easing, transform only,
          so it can be interrupted mid-way), while the two lists, both already loaded, crossfade in the same spot. The
          leaving list fades quicker than the new one arrives. */}
      <Tabs value={selected} onValueChange={(next) => setSelected(String(next))} className="w-full gap-0">
        <TabsList aria-label="Trending collections" className="relative h-11 w-max gap-0 rounded-full border border-border bg-background p-1 group-data-horizontal/tabs:h-11">
          <TabsPrimitive.Indicator
            aria-hidden="true"
            className="absolute top-1 bottom-1 left-0 w-(--active-tab-width) translate-x-(--active-tab-left) rounded-full bg-foreground transition-transform duration-700 ease-(--ease-spring)"
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

        <div className="mt-4 grid sm:mt-6">
          {collections.map(({ value, products }) => {
            const active = value === selected;
            return (
              <div
                key={value}
                id={`trending-panel-${value}`}
                role="tabpanel"
                aria-labelledby={`trending-tab-${value}`}
                inert={!active}
                className={`col-start-1 row-start-1 transition-[opacity,translate] motion-reduce:delay-0 ${
                  active ? "translate-y-0 opacity-100 delay-150 duration-600 ease-(--ease-spring)" : "pointer-events-none translate-y-2 opacity-0 duration-300 ease-out"
                }`}
              >
                <ul className="grid grid-cols-2 gap-x-4 gap-y-8 sm:grid-cols-3 sm:gap-x-6 lg:grid-cols-5 lg:gap-x-8 lg:gap-y-6">
                  {products.map((product) => (
                    <li key={product.id} className="min-w-0">
                      <ProductCard product={product} />
                    </li>
                  ))}
                </ul>
              </div>
            );
          })}
        </div>
      </Tabs>
    </section>
  );
}