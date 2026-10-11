"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { ImageOff } from "lucide-react";
import type { Product } from "@/data/mockProducts";
import { categoryLabel } from "@/lib/catalog";
import Price from "../Price";

type ListingCardProps = {
  product: Product;
  /** Loads the first row eagerly so the page doesn't open on empty tiles. */
  priority?: boolean;
};

export default function ListingCard({ product, priority = false }: ListingCardProps) {
  const percentOff = product.salePrice
    ? Math.round((1 - product.salePrice / product.price) * 100)
    : 0;
  const [activeVariant, setActiveVariant] = useState(0);
  const [imageMissing, setImageMissing] = useState(false);

  const variant = product.variants[activeVariant];
  const href = `/products/${product.id}`;
  const colourCount = product.variants.length;
  const hasColourways = colourCount > 1;

  return (
    <article className="group relative">
      {/* Duplicate of the title link for pointer users; the title link carries the name. */}
      <Link href={href} tabIndex={-1} aria-hidden="true" className="block">
        {/* Photos are 500×500; the grid keeps tiles near that width so they stay sharp. */}
        <div className="relative aspect-square overflow-hidden rounded-lg bg-surface">
          {percentOff > 0 && (
            <span className="absolute top-3 left-3 z-10 rounded-[4px] bg-brand px-2 py-1 text-[13px] leading-none font-semibold text-white tabular-nums">
              <span className="sr-only">On sale, </span>−{percentOff}%
            </span>
          )}
          {imageMissing ? (
            <div className="product-unavailable">
              <ImageOff aria-hidden="true" className="size-6" strokeWidth={1} />
              <span>Photo unavailable</span>
            </div>
          ) : (
            <Image
              key={variant.image}
              src={variant.image}
              alt=""
              fill
              preload={priority}
              quality={100}
              sizes="(min-width: 1280px) 28vw, (min-width: 1024px) 30vw, 50vw"
              className="object-contain p-[5%]"
              onError={() => setImageMissing(true)}
            />
          )}
        </div>
      </Link>

      <div className="relative pt-4">
        {hasColourways && (
          <ul
            aria-label={`${product.name} colours`}
            className="mb-2 hidden gap-1.5 group-hover:flex group-focus-within:flex"
          >
            {product.variants.map((option, index) => (
              <li key={option.image}>
                <button
                  type="button"
                  aria-label={`Show colour ${index + 1} of ${colourCount}`}
                  aria-pressed={index === activeVariant}
                  onMouseEnter={() => setActiveVariant(index)}
                  onFocus={() => setActiveVariant(index)}
                  onClick={() => setActiveVariant(index)}
                  className={`relative z-10 block size-12 overflow-hidden rounded-lg bg-surface ring-offset-2 ${
                    index === activeVariant ? "ring-1 ring-foreground" : ""
                  }`}
                >
                  <Image src={option.image} alt="" fill sizes="48px" quality={100} className="object-contain p-1" />
                </button>
              </li>
            ))}
          </ul>
        )}

        <h3 className="text-base font-medium leading-snug">
          <Link href={href} className="after:absolute after:inset-0 hover:underline hover:underline-offset-4">
            {product.name}
          </Link>
        </h3>
        <p className="text-[15px] text-muted-foreground">{categoryLabel(product.gender, product.category)}</p>
        <p className={`text-[15px] text-muted-foreground ${hasColourways ? "group-hover:hidden group-focus-within:hidden" : ""}`}>
          {colourCount} {colourCount === 1 ? "Colour" : "Colours"}
        </p>
        <Price product={product} className="mt-2 text-base" />
      </div>
    </article>
  );
}
