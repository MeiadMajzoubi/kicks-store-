"use client";

import { useState, useSyncExternalStore } from "react";
import Image from "next/image";
import Link from "next/link";
import { Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import { mockProducts, type Product } from "@/data/mockProducts";
import { addToCart } from "@/lib/cart";
import { categoryLabel, colourName } from "@/lib/catalog";
import { useWishlist } from "@/lib/wishlist";
import FavouriteButton from "../FavouriteButton";
import Price from "../Price";
import Ribbon from "../Ribbon";

const saveFormat = new Intl.NumberFormat("en-US", { style: "currency", currency: "USD", maximumFractionDigits: 0 });

// The wishlist lives in the browser; until the page has loaded we show a quiet placeholder
// instead of flashing an empty list.
const noop = () => () => {};
const useHasLoaded = () => useSyncExternalStore(noop, () => true, () => false);

/**
 * A wishlist is where shoppers come back to buy, so each saved shoe is shown large with
 * its sizes laid out: what's still in stock is visible at a glance, one tap from the bag.
 */
export default function WishlistView() {
  const loaded = useHasLoaded();
  const saved = useWishlist();

  // Shoes no longer in the catalogue are skipped.
  const entries = saved.flatMap((item) => {
    const product = mockProducts.find((candidate) => candidate.id === item.productId);
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
        <ul className="mt-8 grid gap-x-6 gap-y-14 md:grid-cols-2 xl:grid-cols-3 xl:gap-x-8">
          {entries.map(({ product, variant }, index) => (
            <SavedShoe key={product.id} product={product} variant={variant} priority={index < 2} />
          ))}
        </ul>
      )}
    </section>
  );
}

function SavedShoe({ product, variant, priority }: { product: Product; variant: number; priority: boolean }) {
  const [size, setSize] = useState<number | null>(null);
  const [added, setAdded] = useState(false);
  const colourway = product.variants[variant];
  const href = `/products/${product.id}`;
  const sizes = [...colourway.sizes.available, ...colourway.sizes.soldOut].sort((a, b) => a - b);
  const inStock = colourway.sizes.available.length > 0;
  const saving = product.salePrice ? product.price - product.salePrice : 0;

  const addToBag = () => {
    if (size === null) return;
    addToCart(product.id, variant, size);
    setAdded(true);
    window.setTimeout(() => setAdded(false), 2000);
  };

  return (
    <li className="flex flex-col">
      <div className="relative">
        <Link
          href={href}
          tabIndex={-1}
          aria-hidden="true"
          className="relative block aspect-[4/3] overflow-hidden rounded-lg bg-surface"
        >
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
          <Image
            src={colourway.image}
            alt=""
            fill
            preload={priority}
            quality={100}
            sizes="(min-width: 1280px) 30vw, (min-width: 768px) 45vw, 100vw"
            className="object-contain p-[6%]"
          />
        </Link>
        <FavouriteButton
          productId={product.id}
          productName={product.name}
          variant={variant}
          className="absolute top-2 right-2 z-20"
        />
      </div>

      <div className="mt-4 flex items-start justify-between gap-4">
        <div className="min-w-0">
          <h2 className="text-[17px] font-semibold leading-snug tracking-[-0.01em]">
            <Link href={href} className="hover:underline hover:underline-offset-4">
              {product.name}
            </Link>
          </h2>
          <p className="mt-1 text-sm text-foreground/75">
            {categoryLabel(product.gender, product.category)}
            <br />
            {colourName(colourway.colors)}
          </p>
        </div>
        <Price product={product} className="shrink-0 text-right text-[17px] font-semibold" />
      </div>

      {inStock ? (
        <>
          <div
            role="radiogroup"
            aria-label={`Size for ${product.name} (UK)`}
            className="mt-4 flex flex-wrap gap-1.5"
          >
            {sizes.map((value) => {
              const soldOut = colourway.sizes.soldOut.includes(value);
              const selected = size === value;
              return (
                <button
                  key={value}
                  type="button"
                  role="radio"
                  aria-checked={selected}
                  aria-label={soldOut ? `UK ${value}, sold out` : `UK ${value}`}
                  disabled={soldOut}
                  onClick={() => setSize(value)}
                  className={`flex h-9 min-w-11 items-center justify-center rounded-md border px-2 text-sm tabular-nums transition-colors duration-150 ${
                    soldOut
                      ? "cursor-not-allowed border-transparent bg-surface text-muted-foreground/50 line-through"
                      : selected
                        ? "border-foreground bg-foreground text-background"
                        : "border-border hover:border-foreground"
                  }`}
                >
                  {value}
                </button>
              );
            })}
          </div>

          <Button
            variant={size === null ? "outline-pill" : "solid"}
            size="pill-lg"
            onClick={addToBag}
            disabled={size === null}
            className="mt-4 w-full disabled:opacity-100 disabled:text-muted-foreground sm:w-auto sm:self-start"
          >
            {added ? (
              <>
                <Check aria-hidden="true" strokeWidth={2} />
                Added to Bag
              </>
            ) : size === null ? (
              "Pick a size to add to bag"
            ) : (
              `Add UK ${size} to Bag`
            )}
          </Button>
          <span aria-live="polite" className="sr-only">
            {added ? `${product.name} added to bag` : ""}
          </span>
        </>
      ) : (
        <p className="mt-4 text-sm text-muted-foreground">Sold out in every size right now.</p>
      )}
    </li>
  );
}
