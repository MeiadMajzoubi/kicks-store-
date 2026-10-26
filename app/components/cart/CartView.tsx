"use client";

import { useSyncExternalStore } from "react";
import Image from "next/image";
import Link from "next/link";
import { Minus, Plus, Trash2 } from "lucide-react";
import { Button, buttonVariants } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { MAX_QUANTITY, changeSize, setQuantity, useCart } from "@/lib/cart";
import { categoryLabel, colourName, effectivePrice } from "@/lib/catalog";
import { bagLines, bagTotals, currency, type Line } from "@/lib/checkout";
import OrderTotals from "./OrderTotals";

// The bag lives in the browser, so the server can't know what's in it. Until the page has
// loaded we show a quiet placeholder instead of flashing an empty bag.
const noop = () => () => {};
const useHasLoaded = () => useSyncExternalStore(noop, () => true, () => false);

export default function CartView() {
  const loaded = useHasLoaded();
  const cart = useCart();
  const lines = bagLines(cart);
  const totals = bagTotals(lines);
  const { itemCount } = totals;

  if (!loaded) {
    return <div aria-hidden="true" className="min-h-[50vh]" />;
  }

  if (!lines.length) {
    return (
      <div className="pb-10">
        <h1 className="text-2xl font-semibold tracking-[-0.02em]">Bag</h1>
        <p className="mt-3 text-[15px] text-muted-foreground">There are no items in your bag.</p>
        <Link href="/shop" className="text-link mt-2">
          Start shopping
        </Link>
      </div>
    );
  }

  return (
    <div className="grid gap-10 lg:grid-cols-[minmax(0,1fr)_380px] lg:gap-12 xl:grid-cols-[minmax(0,1fr)_440px] xl:gap-16">
      {/* --bag-indent: the heading's column width. The grey line starts there, and so do the shoes. */}
      <section aria-labelledby="bag-title" className="[--bag-indent:8rem]">
        <div className="grid grid-cols-[var(--bag-indent)_minmax(0,1fr)] items-center">
          <h1 id="bag-title" className="text-2xl font-semibold whitespace-nowrap tracking-[-0.02em]">
            Bag{" "}
            <span className="text-base font-normal tracking-normal text-muted-foreground tabular-nums">
              {itemCount} {itemCount === 1 ? "item" : "items"}
            </span>
          </h1>
          <span aria-hidden="true" className="h-px bg-border" />
        </div>

        <ul className="mt-2 divide-y divide-border sm:ml-(--bag-indent)">
          {lines.map((line) => (
            <CartLine key={line.key} line={line} />
          ))}
        </ul>
      </section>

      <aside aria-labelledby="summary-title" className="lg:sticky lg:top-6 lg:self-start">
        <h2 id="summary-title" className="text-2xl font-semibold tracking-[-0.02em]">
          Summary
        </h2>

        <div className="mt-5 border-t border-border pt-5">
          <OrderTotals totals={totals} />
        </div>

        <Link href="/checkout" className={buttonVariants({ variant: "solid", size: "pill-lg", className: "mt-5 w-full" })}>
          Checkout
        </Link>
      </aside>
    </div>
  );
}

function CartLine({ line }: { line: Line }) {
  const { product } = line;
  const variant = product.variants[line.variant];
  const href = `/products/${product.id}`;
  const unit = effectivePrice(product);
  // Every size this colourway comes in that isn't sold out, plus the one already chosen.
  const sizes = [...new Set([...variant.sizes.available, line.size])].sort((a, b) => a - b);
  const sizeItems = sizes.map((size) => ({ value: size, label: `UK ${size}` }));

  return (
    <li className="flex gap-4 py-6 sm:gap-5">
      <Link
        href={href}
        tabIndex={-1}
        aria-hidden="true"
        className="relative size-28 shrink-0 overflow-hidden rounded-lg bg-surface sm:size-32"
      >
        <Image src={variant.image} alt="" fill sizes="128px" quality={100} className="object-contain p-2" />
      </Link>

      <div className="flex min-w-0 flex-1 flex-col">
        <div className="flex items-start justify-between gap-4">
          <div className="min-w-0">
            <h3 className="text-base font-semibold leading-snug">
              <Link href={href} className="hover:underline hover:underline-offset-4">
                {product.name}
              </Link>
            </h3>
            <p className="mt-1 text-sm text-foreground/75">{categoryLabel(product.gender, product.category)}</p>
            <p className="text-sm text-foreground/75">{colourName(variant.colors)}</p>
          </div>
          <p className="shrink-0 text-right text-base font-semibold tabular-nums">
            {product.salePrice ? (
              <>
                <span className="block text-brand">{currency.format(unit * line.quantity)}</span>
                <s className="block text-sm font-normal text-muted-foreground">
                  <span className="sr-only">was </span>
                  {currency.format(product.price * line.quantity)}
                </s>
              </>
            ) : (
              currency.format(unit * line.quantity)
            )}
          </p>
        </div>

        <div className="mt-auto flex flex-wrap items-center gap-2.5 pt-4">
          <Select
            value={line.size}
            items={sizeItems}
            onValueChange={(size) => {
              if (typeof size === "number") changeSize(line.key, size);
            }}
          >
            <SelectTrigger
              aria-label={`Size for ${product.name}`}
              className="h-10 min-w-28 rounded-full border-border px-4 text-sm tabular-nums hover:border-foreground data-[size=default]:h-10"
            >
              <SelectValue />
            </SelectTrigger>
            <SelectContent className="min-w-32 rounded-xl p-1">
              {sizeItems.map((item) => (
                <SelectItem key={item.value} value={item.value} className="min-h-9 rounded-lg px-3 text-sm tabular-nums">
                  {item.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <div
            role="group"
            aria-label={`Quantity of ${product.name}`}
            className="inline-flex h-10 items-center rounded-full border border-border"
          >
            <Button
              variant="ghost"
              size="icon-pill"
              onClick={() => setQuantity(line.key, line.quantity - 1)}
              aria-label={line.quantity === 1 ? `Remove ${product.name} from bag` : "Decrease quantity"}
              className="hover:bg-surface hover:text-brand"
            >
              {line.quantity === 1 ? <Trash2 strokeWidth={1.75} /> : <Minus strokeWidth={1.75} />}
            </Button>
            <span aria-live="polite" className="w-6 text-center text-sm font-medium tabular-nums">
              {line.quantity}
            </span>
            <Button
              variant="ghost"
              size="icon-pill"
              onClick={() => setQuantity(line.key, line.quantity + 1)}
              disabled={line.quantity >= MAX_QUANTITY}
              aria-label="Increase quantity"
              className="hover:bg-surface hover:text-brand"
            >
              <Plus strokeWidth={1.75} />
            </Button>
          </div>
        </div>
      </div>
    </li>
  );
}
