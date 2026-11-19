"use client";

import { useState, type CSSProperties, type ReactNode } from "react";
import type { Product } from "@/lib/products";
import { colourName } from "@/lib/catalog";
import ProductGallery from "./ProductGallery";
import ProductPurchase from "./ProductPurchase";
import ProductPhoto from "../ProductPhoto";

type ProductDetailProps = {
  productId: string;
  name: string;
  variants: Product["variants"];
  /** Which colourway opens first (the `?colour=` number in the link). */
  initialVariant: number;
  /** Ribbon laid over the main photo. */
  badge?: ReactNode;
  /** Name, category and price. Rendered on the server and shown above the colour picker. */
  heading: ReactNode;
};

/**
 * The photo, the colour picker and the buying panel. They live together because they all depend on
 * the chosen colour: each colourway has its own photos and its own sizes in stock.
 */
export default function ProductDetail({ productId, name, variants, initialVariant, badge, heading }: ProductDetailProps) {
  const [active, setActive] = useState(initialVariant);
  const variant = variants[active];
  const hasColourways = variants.length > 1;

  const choose = (index: number) => {
    setActive(index);
    // Keep the colour in the link so it can be shared and survives a reload. No navigation: the page
    // already has every colourway.
    const url = new URL(window.location.href);
    if (index === 0) url.searchParams.delete("colour");
    else url.searchParams.set("colour", String(index));
    window.history.replaceState(null, "", url);
  };

  return (
    // The photo column shrinks with the window height (page top 12.8rem; thumbnails and their gap add 5rem),
    // so the whole photo is on screen when the page opens and the buying panel stays close beside it.
    // Never below 21rem, never past 620px.
    <div
      style={
        {
          "--photo-column": `min(620px, max(${variant.images.length > 1 ? "26rem" : "21rem"}, calc(100svh - ${variant.images.length > 1 ? "7.8rem" : "12.8rem"})))`,
        } as CSSProperties
      }
      className="mx-auto grid max-w-[1240px] gap-8 lg:grid-cols-[minmax(0,var(--photo-column))_minmax(0,500px)] lg:justify-center lg:gap-12 xl:gap-16"
    >
      <div className="lg:sticky lg:top-6 lg:self-start">
        {/* `key`: switching colour starts the gallery again from the first photo. */}
        <ProductGallery key={active} images={variant.images} name={name} badge={badge} />
      </div>

      <div>
        {heading}

        {hasColourways && (
          <div className="mt-6">
            <h2 id="colour-label" className="mb-3 text-base font-medium">
              Colour: <span className="font-normal text-foreground/75">{colourName(variant.colors)}</span>
            </h2>
            <ul aria-labelledby="colour-label" className="flex flex-wrap gap-2">
              {variants.map((option, index) => (
                <li key={option.images[0]}>
                  <button
                    type="button"
                    aria-label={colourName(option.colors)}
                    aria-pressed={index === active}
                    onClick={() => choose(index)}
                    className={`relative block size-16 overflow-hidden rounded-md bg-surface ring-2 transition-shadow duration-150 ${
                      index === active ? "ring-foreground" : "ring-transparent hover:ring-border"
                    }`}
                  >
                    <ProductPhoto src={option.images[0]} alt="" sizes="64px" inset="p-1.5" />
                  </button>
                </li>
              ))}
            </ul>
          </div>
        )}

        <div className="mt-8">
          {/* `key`: a different colour has different sizes in stock, so the chosen size starts empty. */}
          <ProductPurchase key={active} productId={productId} variant={active} sizes={variant.sizes} />
        </div>
      </div>
    </div>
  );
}
