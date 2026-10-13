"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { ImageOff } from "lucide-react";
import type { Product, ProductColor } from "@/data/mockProducts";
import { categoryLabel } from "@/lib/catalog";
import Price from "../Price";

const COLOUR_NAMES: Partial<Record<ProductColor, string>> = { multi: "Multicolour" };

/** ["black", "multi"] → "Black - Multicolour", the colourway as a shopper reads it. */
function colourName(colors: ProductColor[]) {
  return colors
    .map((color) => COLOUR_NAMES[color] ?? color[0].toUpperCase() + color.slice(1))
    .join(" - ");
}

const saveFormat = new Intl.NumberFormat("en-US", {
  style: "currency",
  currency: "USD",
  maximumFractionDigits: 0,
});

type ListingCardProps = {
  product: Product;
  /** Loads the first row eagerly so the page doesn't open on empty tiles. */
  priority?: boolean;
};

export default function ListingCard({ product, priority = false }: ListingCardProps) {
  const saving = product.salePrice ? product.price - product.salePrice : 0;
  const [activeVariant, setActiveVariant] = useState(0);
  const [imageMissing, setImageMissing] = useState(false);

  const variant = product.variants[activeVariant];
  const href = `/products/${product.id}`;
  const hasColourways = product.variants.length > 1;

  return (
    <article className="group relative">
      {/* Duplicate of the title link for pointer users; the title link carries the name. */}
      <Link href={href} tabIndex={-1} aria-hidden="true" className="block">
        {/* Photos are 500×500; the grid keeps tiles near that width so they stay sharp. */}
        <div className="relative aspect-square overflow-hidden rounded-lg bg-surface">
          {saving > 0 && (
            <Ribbon className="bg-brand" edge="#ff9ca0">
              Save {saveFormat.format(saving)}
            </Ribbon>
          )}
          {product.isNew && (
            <Ribbon className="bg-foreground" edge="#cfcfcf">
              New
            </Ribbon>
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
          // Colourways are always visible; the line under a photo marks the one shown.
          <ul aria-label={`${product.name} colours`} className="mb-3 flex gap-2">
            {product.variants.map((option, index) => (
              <li key={option.image}>
                <button
                  type="button"
                  aria-label={`Show ${colourName(option.colors)}`}
                  aria-pressed={index === activeVariant}
                  onMouseEnter={() => setActiveVariant(index)}
                  onFocus={() => setActiveVariant(index)}
                  onClick={() => setActiveVariant(index)}
                  className={`relative z-10 block w-14 border-b-2 pb-1.5 transition-colors duration-150 ${
                    index === activeVariant ? "border-foreground" : "border-transparent hover:border-border"
                  }`}
                >
                  <span className="relative block aspect-[4/3]">
                    <Image src={option.image} alt="" fill sizes="56px" quality={100} className="object-contain" />
                  </span>
                </button>
              </li>
            ))}
          </ul>
        )}

        <h3 className="text-[17px] font-semibold leading-snug tracking-[-0.01em]">
          <Link href={href} className="after:absolute after:inset-0 hover:underline hover:underline-offset-4">
            {product.name}
          </Link>
        </h3>
        <p className="mt-1.5 text-sm leading-relaxed text-foreground/75">
          {categoryLabel(product.gender, product.category)}
          <br />
          {colourName(variant.colors)}
        </p>
        <Price product={product} className="mt-3 text-[17px] font-semibold" />
      </div>
    </article>
  );
}

/**
 * Corner ribbon: a band wrapped across a corner of the photo. The tile's rounded,
 * overflow-hidden edge cuts both ends, so it reads as wrapped around the card.
 */
function Ribbon({
  className,
  edge,
  children,
}: {
  className: string;
  /** Colour of the thin lines along both long edges of the band. */
  edge: string;
  children: React.ReactNode;
}) {
  return (
    <span
      style={{
        boxShadow: `inset 0 1px 0 ${edge}, inset 0 -1px 0 ${edge}, 0 2px 6px rgba(0, 0, 0, 0.18)`,
      }}
      className={`absolute top-[22px] z-10 w-[180px] py-1.5 text-center text-[13px] leading-none font-semibold text-white tabular-nums -left-[46px] -rotate-45 ${className}`}
    >
      {children}
    </span>
  );
}
