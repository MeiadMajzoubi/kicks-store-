"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { ArrowUpRight, ImageOff } from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { mockProducts, sortByColor } from "@/data/mockProducts";
import type { MockProduct } from "@/data/mockProducts";

const collections = [
  { value: "men", label: "Men", products: sortByColor(mockProducts.filter((product) => product.gender === "men")) },
  { value: "women", label: "Women", products: sortByColor(mockProducts.filter((product) => product.gender === "women")) },
];

const currency = new Intl.NumberFormat("en-US", { style: "currency", currency: "USD" });

function ProductCard({ product }: { product: MockProduct }) {
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
          <Image
            src={product.image}
            alt={product.name}
            fill
            sizes="(min-width: 1024px) 208px, (min-width: 640px) 30vw, 45vw"
            className="object-contain"
            onError={() => setImageMissing(true)}
          />
        )}
      </div>
      <div className="product-details">
        <p className="text-[11px] text-muted-foreground">{product.brand}</p>
        <h3 className="text-sm font-semibold leading-snug tracking-tight">{product.name}</h3>
        <p className="mt-1 text-sm font-medium tabular-nums">{currency.format(product.price)}</p>
      </div>
    </Link>
  );
}

export default function TrendingProducts() {
  return (
    <section id="trending" aria-labelledby="trending-title" className="content-shell mb-4 rounded-[1.5rem] bg-surface px-4 py-7 sm:rounded-[2rem] sm:p-8 lg:px-10 lg:py-10">
      <div className="mb-6 flex flex-wrap items-end justify-between gap-4 sm:mb-8">
        <div>
          <p className="eyebrow mb-3">In the rotation</p>
          <h2 id="trending-title" className="section-title">Trending now</h2>
        </div>
        <Link href="/shop" className="text-link">
          Shop all <ArrowUpRight aria-hidden="true" className="size-4" />
        </Link>
      </div>

      <Tabs defaultValue="men" className="w-full gap-0">
        <TabsList aria-label="Trending collections" className="h-11 w-max gap-1 rounded-full border border-border bg-background p-1">
          {collections.map(({ value, label }) => (
            <TabsTrigger
              key={value}
              value={value}
              className="h-full flex-none rounded-full px-6 text-sm font-semibold text-foreground shadow-none after:hidden data-active:bg-foreground! data-active:text-white! data-active:shadow-none!"
            >
              {label}
            </TabsTrigger>
          ))}
        </TabsList>

        {collections.map(({ value, products }) => (
          <TabsContent key={value} value={value} className="mt-4 sm:mt-6">
            <ul className="grid grid-cols-2 gap-x-2 gap-y-3 sm:grid-cols-3 sm:gap-x-5 lg:grid-cols-5 lg:gap-y-2">
              {products.map((product) => (
                <li key={product.id} className="min-w-0">
                  <ProductCard product={product} />
                </li>
              ))}
            </ul>
          </TabsContent>
        ))}
      </Tabs>
    </section>
  );
}
