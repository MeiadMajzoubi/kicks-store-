"use client";

import { useRef, useState } from "react";
import Link from "next/link";
import { Check, ChevronDown, Heart } from "lucide-react";
import type { VariantSizes } from "@/data/mockProducts";
import { addToCart, useCartCount } from "@/lib/cart";
import { toggleWishlist, useIsSaved } from "@/lib/wishlist";

type ProductPurchaseProps = {
  productId: string;
  variant: number;
  sizes: VariantSizes;
};

export default function ProductPurchase({ productId, variant, sizes }: ProductPurchaseProps) {
  const [selected, setSelected] = useState<number | null>(null);
  const [error, setError] = useState(false);
  const [added, setAdded] = useState(false);
  const favourite = useIsSaved(productId);
  const sizeGroupRef = useRef<HTMLDivElement>(null);
  const bagCount = useCartCount();

  const allSizes = [...sizes.available, ...sizes.soldOut].sort((a, b) => a - b);
  const hasSizes = allSizes.length > 0;

  const addToBag = () => {
    if (selected === null) {
      setError(true);
      sizeGroupRef.current?.querySelector<HTMLButtonElement>("button:not(:disabled)")?.focus();
      return;
    }
    addToCart(productId, variant, selected);
    setAdded(true);
    window.setTimeout(() => setAdded(false), 2000);
  };

  return (
    <div>
      <div className="mb-3 flex items-baseline justify-between gap-4">
        <h2 id="size-label" className="text-base font-medium">
          Select size <span className="font-normal text-muted-foreground">(UK)</span>
        </h2>
      </div>

      {hasSizes ? (
        <div
          ref={sizeGroupRef}
          role="radiogroup"
          aria-labelledby="size-label"
          aria-describedby={error ? "size-error" : undefined}
          className={`grid grid-cols-3 gap-2 rounded-lg sm:grid-cols-4 lg:grid-cols-3 xl:grid-cols-4 ${
            error ? "outline-1 outline-offset-4 outline-brand" : ""
          }`}
        >
          {allSizes.map((size) => {
            const soldOut = sizes.soldOut.includes(size);
            const isSelected = selected === size;
            return (
              <button
                key={size}
                type="button"
                role="radio"
                aria-checked={isSelected}
                aria-label={soldOut ? `UK ${size}, sold out` : `UK ${size}`}
                disabled={soldOut}
                onClick={() => {
                  setSelected(size);
                  setError(false);
                }}
                className={`flex min-h-12 items-center justify-center rounded-md border text-[15px] tabular-nums transition-colors duration-150 ${
                  soldOut
                    ? "cursor-not-allowed border-border bg-surface text-muted-foreground/60 line-through"
                    : isSelected
                      ? "border-foreground ring-1 ring-foreground"
                      : "border-border hover:border-foreground"
                }`}
              >
                {size}
              </button>
            );
          })}
        </div>
      ) : (
        <p className="rounded-md bg-surface px-4 py-3 text-sm text-muted-foreground">
          Sizes for this shoe aren&rsquo;t listed yet.
        </p>
      )}

      {error && (
        <p id="size-error" role="alert" className="mt-3 text-sm font-medium text-brand">
          Select a size to add this shoe to your bag.
        </p>
      )}

      <div className="mt-6 space-y-3">
        <button
          type="button"
          onClick={addToBag}
          disabled={!hasSizes}
          className="flex min-h-14 w-full items-center justify-center gap-2 rounded-full bg-foreground text-base font-medium text-background transition-opacity duration-150 hover:opacity-85 active:scale-[0.99] disabled:opacity-40"
        >
          {added ? (
            <>
              <Check aria-hidden="true" className="size-5" strokeWidth={2} />
              Added to Bag
            </>
          ) : (
            "Add to Bag"
          )}
        </button>
        <button
          type="button"
          onClick={() => toggleWishlist(productId, variant)}
          aria-pressed={favourite}
          className="flex min-h-14 w-full items-center justify-center gap-2 rounded-full border border-border text-base font-medium transition-colors duration-150 hover:border-foreground"
        >
          {favourite ? "Saved to Wishlist" : "Save to Wishlist"}
          <Heart
            aria-hidden="true"
            className={`size-5 ${favourite ? "fill-brand text-brand" : ""}`}
            strokeWidth={1.75}
          />
        </button>
        <p aria-live="polite" className="sr-only">
          {added ? `Added to bag. ${bagCount} ${bagCount === 1 ? "item" : "items"} in your bag.` : ""}
        </p>
        {bagCount > 0 && (
          <p className="pt-1 text-center text-sm text-muted-foreground">
            {bagCount} {bagCount === 1 ? "item" : "items"} in your bag ·{" "}
            <Link href="/cart" className="font-medium text-foreground underline underline-offset-4 hover:text-brand">
              View Bag
            </Link>
          </p>
        )}
      </div>

      <details className="group mt-10 border-t border-b border-border">
        <summary className="flex min-h-16 cursor-pointer list-none items-center justify-between text-lg font-medium [&::-webkit-details-marker]:hidden">
          Delivery and Returns
          <ChevronDown
            aria-hidden="true"
            className="size-5 transition-transform duration-200 group-open:rotate-180 motion-reduce:transition-none"
            strokeWidth={1.5}
          />
        </summary>
        <div className="space-y-2 pb-6 text-[15px] leading-relaxed text-foreground/80">
          <p>Express delivery: arrives within 3 days.</p>
          <p>Need to send something back? Our support team is here around the clock.</p>
        </div>
      </details>
    </div>
  );
}
