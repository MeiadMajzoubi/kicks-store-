"use client";

import { useState } from "react";
import Link from "next/link";
import { Check, ChevronDown } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import type { Product } from "@/lib/products";
import { addToCart } from "@/lib/cart";
import { useHasLoaded } from "@/lib/use-has-loaded";
import { useWishlist } from "@/lib/wishlist";
import ListingCard from "../listing/ListingCard";

// The wishlist lives in the browser; until the page has loaded we show a quiet placeholder
// instead of flashing an empty list.
/**
 * Saved shoes in the same grid and cards as the shop pages, each with one "Select Size"
 * button: picking a size adds that pair to the bag (the pattern big sneaker stores use).
 */
// products: every shoe, loaded from Postgres by the wishlist page (a server page) and passed down.
export default function WishlistView({ products }: { products: Product[] }) {
  const loaded = useHasLoaded();
  const saved = useWishlist();

  // Shoes no longer in the catalogue are skipped.
  const entries = saved.flatMap((item) => {
    const product = products.find((candidate) => candidate.id === item.productId);
    return product ? [{ product, variant: product.variants[item.variant] ? item.variant : 0 }] : [];
  });

  if (!loaded) return <div aria-hidden="true" className="min-h-[50vh]" />;

  return (
    <section aria-labelledby="wishlist-title">
      <h1 id="wishlist-title" className="section-title">
        Wishlist{" "}
        {entries.length > 0 && (
          <span className="font-normal text-muted-foreground tabular-nums">{entries.length}</span>
        )}
      </h1>

      {entries.length === 0 ? (
        <div className="mt-4 pb-10">
          <p className="text-[15px] text-muted-foreground">
            Tap the heart on any shoe to save it here. No account needed.
          </p>
          <Link href="/shop" className="text-link mt-2">
            Start shopping
          </Link>
        </div>
      ) : (
        <ul className="mt-8 grid grid-cols-2 gap-x-3 gap-y-10 sm:grid-cols-3 sm:gap-x-4 lg:grid-cols-4 2xl:grid-cols-5">
          {entries.map(({ product, variant }, index) => (
            <li key={product.id} className="flex flex-col">
              <ListingCard product={product} priority={index < 4} />
              <SelectSize product={product} variant={variant} />
            </li>
          ))}
        </ul>
      )}
    </section>
  );
}

/** One outlined button; it opens the sizes, and picking one adds that pair to the bag. */
function SelectSize({ product, variant }: { product: Product; variant: number }) {
  const [added, setAdded] = useState<number | null>(null);
  const sizes = product.variants[variant].sizes;

  const button =
    "mt-4 inline-flex h-10 w-full items-center justify-center gap-1.5 rounded-full border border-border text-sm font-medium transition-colors hover:border-foreground";

  if (!sizes.some((size) => size.stock > 0)) {
    return (
      <span className={`${button} cursor-not-allowed text-muted-foreground hover:border-border`}>Sold out</span>
    );
  }

  return (
    <>
      <DropdownMenu>
        <DropdownMenuTrigger
          aria-label={`Select a size to add ${product.name} to your bag`}
          className={`${button} group/size data-[popup-open]:border-foreground`}
        >
          {added !== null ? (
            <>
              <Check aria-hidden="true" className="size-4" strokeWidth={2} />
              Added UK {added}
            </>
          ) : (
            <>
              Select Size
              <ChevronDown
                aria-hidden="true"
                className="size-4 transition-transform duration-200 group-data-[popup-open]/size:rotate-180 motion-reduce:transition-none"
                strokeWidth={1.75}
              />
            </>
          )}
        </DropdownMenuTrigger>
        <DropdownMenuContent align="start" sideOffset={6} className="w-64 rounded-lg p-2">
          <DropdownMenuGroup>
            <DropdownMenuLabel className="px-1 pb-2 text-xs font-medium text-muted-foreground">
              Size (UK)
            </DropdownMenuLabel>
            <div className="grid grid-cols-4 gap-1.5">
            {sizes.map(({ value: size, stock }) => {
              const isSoldOut = stock === 0;
              return (
                <DropdownMenuItem
                  key={size}
                  disabled={isSoldOut}
                  aria-label={isSoldOut ? `UK ${size}, sold out` : `Add UK ${size} to bag`}
                  onClick={() => {
                    addToCart(product.id, variant, size);
                    setAdded(size);
                    window.setTimeout(() => setAdded(null), 2200);
                  }}
                  className={`h-9 justify-center rounded-md border px-0 text-sm tabular-nums ${
                    isSoldOut
                      ? "border-transparent bg-surface text-muted-foreground/60 line-through data-disabled:opacity-100"
                      : "border-border focus:border-foreground focus:bg-foreground focus:text-background"
                  }`}
                >
                  {size}
                </DropdownMenuItem>
              );
            })}
            </div>
          </DropdownMenuGroup>
        </DropdownMenuContent>
      </DropdownMenu>
      <span aria-live="polite" className="sr-only">
        {added !== null ? `${product.name}, UK ${added}, added to bag` : ""}
      </span>
    </>
  );
}
