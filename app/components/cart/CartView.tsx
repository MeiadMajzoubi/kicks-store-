"use client";

import { useState, useSyncExternalStore } from "react";
import Image from "next/image";
import Link from "next/link";
import { ChevronDown, Minus, Plus, Trash2 } from "lucide-react";
import { mockProducts, type Product } from "@/data/mockProducts";
import { MAX_QUANTITY, changeSize, removeFromCart, setQuantity, useCart, type CartItem } from "@/lib/cart";
import { categoryLabel, colourName, effectivePrice } from "@/lib/catalog";

const currency = new Intl.NumberFormat("en-US", { style: "currency", currency: "USD" });

// The bag lives in the browser, so the server can't know what's in it. Until the page has
// loaded we show a quiet placeholder instead of flashing "Your bag is empty".
const noop = () => () => {};
const useHasLoaded = () => useSyncExternalStore(noop, () => true, () => false);

type Line = CartItem & { product: Product };

export default function CartView() {
  const loaded = useHasLoaded();
  const cart = useCart();
  const [checkoutNote, setCheckoutNote] = useState(false);

  // Lines whose shoe is no longer in the catalogue are skipped.
  const lines: Line[] = cart.flatMap((item) => {
    const product = mockProducts.find((candidate) => candidate.id === item.productId);
    return product?.variants[item.variant] ? [{ ...item, product }] : [];
  });

  const itemCount = lines.reduce((total, line) => total + line.quantity, 0);
  const subtotal = lines.reduce((total, line) => total + effectivePrice(line.product) * line.quantity, 0);
  const fullPrice = lines.reduce((total, line) => total + line.product.price * line.quantity, 0);
  const saving = fullPrice - subtotal;

  if (!loaded) {
    return <div aria-hidden="true" className="min-h-[50vh]" />;
  }

  if (!lines.length) {
    return (
      <div className="pb-10">
        <h1 className="section-title">Bag</h1>
        <p className="mt-4 text-[15px] text-muted-foreground">There are no items in your bag.</p>
        <Link href="/shop" className="text-link mt-2">
          Start shopping
        </Link>
      </div>
    );
  }

  return (
    <div className="grid gap-10 lg:grid-cols-[minmax(0,1fr)_360px] lg:gap-14">
      <section aria-labelledby="bag-title">
        <h1 id="bag-title" className="section-title">
          Bag{" "}
          <span className="font-normal text-muted-foreground tabular-nums">
            {itemCount} {itemCount === 1 ? "item" : "items"}
          </span>
        </h1>

        <ul className="mt-6 divide-y divide-border border-t border-border">
          {lines.map((line) => (
            <CartLine key={line.key} line={line} />
          ))}
        </ul>
      </section>

      <aside aria-labelledby="summary-title" className="lg:sticky lg:top-6 lg:self-start">
        <h2 id="summary-title" className="text-2xl font-semibold tracking-[-0.02em]">
          Summary
        </h2>

        <dl className="mt-6 space-y-3 text-[15px]">
          <div className="flex justify-between gap-4">
            <dt>Subtotal</dt>
            <dd className="tabular-nums">{currency.format(fullPrice)}</dd>
          </div>
          {saving > 0 && (
            <div className="flex justify-between gap-4 text-brand">
              <dt>Sale savings</dt>
              <dd className="tabular-nums">−{currency.format(saving)}</dd>
            </div>
          )}
          <div className="flex justify-between gap-4">
            <dt>Delivery</dt>
            <dd className="text-right text-muted-foreground">Calculated at checkout</dd>
          </div>
        </dl>

        <div className="mt-5 flex justify-between gap-4 border-y border-border py-4 text-base font-semibold">
          <span>Total</span>
          <span className="tabular-nums">{currency.format(subtotal)}</span>
        </div>

        <button
          type="button"
          onClick={() => setCheckoutNote(true)}
          className="mt-6 flex min-h-14 w-full items-center justify-center rounded-full bg-foreground text-base font-medium text-background transition-opacity hover:opacity-85 active:scale-[0.99]"
        >
          Checkout
        </button>
        <p aria-live="polite" className="mt-3 min-h-5 text-center text-sm text-muted-foreground">
          {checkoutNote ? "Checkout isn’t open yet. Your bag is saved on this device." : ""}
        </p>

        <p className="mt-4 text-sm text-muted-foreground">Express delivery: arrives within 3 days.</p>
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
  const sizeId = `size-${line.key}`;

  return (
    <li className="flex gap-4 py-6 sm:gap-6">
      <Link
        href={href}
        tabIndex={-1}
        aria-hidden="true"
        className="relative size-28 shrink-0 overflow-hidden rounded-lg bg-surface sm:size-40"
      >
        <Image src={variant.image} alt="" fill sizes="160px" quality={100} className="object-contain p-2" />
      </Link>

      <div className="flex min-w-0 flex-1 flex-col">
        <div className="flex flex-wrap items-start justify-between gap-x-6 gap-y-1">
          <div className="min-w-0">
            <h3 className="text-[17px] font-semibold leading-snug">
              <Link href={href} className="hover:underline hover:underline-offset-4">
                {product.name}
              </Link>
            </h3>
            <p className="mt-1 text-sm text-foreground/75">{categoryLabel(product.gender, product.category)}</p>
            <p className="text-sm text-foreground/75">{colourName(variant.colors)}</p>
          </div>

          <p className="text-[17px] font-semibold tabular-nums">
            {product.salePrice ? (
              <>
                <span className="text-brand">{currency.format(unit * line.quantity)}</span>
                <s className="ml-2 text-[0.85em] font-normal text-muted-foreground">
                  <span className="sr-only">was </span>
                  {currency.format(product.price * line.quantity)}
                </s>
              </>
            ) : (
              currency.format(unit * line.quantity)
            )}
          </p>
        </div>

        <div className="mt-4 flex flex-wrap items-center gap-3">
          <label htmlFor={sizeId} className="sr-only">
            Size for {product.name}
          </label>
          <span className="relative inline-flex">
            <select
              id={sizeId}
              value={line.size}
              onChange={(event) => changeSize(line.key, Number(event.target.value))}
              className="min-h-11 cursor-pointer appearance-none rounded-full border border-border bg-background py-2 pr-9 pl-4 text-[15px] tabular-nums transition-colors hover:border-foreground"
            >
              {sizes.map((size) => (
                <option key={size} value={size}>
                  Size UK {size}
                </option>
              ))}
            </select>
            <ChevronDown
              aria-hidden="true"
              className="pointer-events-none absolute top-1/2 right-3.5 size-4 -translate-y-1/2"
              strokeWidth={1.75}
            />
          </span>

          <div
            role="group"
            aria-label={`Quantity of ${product.name}`}
            className="inline-flex min-h-11 items-center rounded-full border border-border"
          >
            <button
              type="button"
              onClick={() => setQuantity(line.key, line.quantity - 1)}
              aria-label={line.quantity === 1 ? `Remove ${product.name}` : "Decrease quantity"}
              className="flex size-11 items-center justify-center rounded-full transition-colors hover:text-brand"
            >
              {line.quantity === 1 ? (
                <Trash2 aria-hidden="true" className="size-[18px]" strokeWidth={1.75} />
              ) : (
                <Minus aria-hidden="true" className="size-[18px]" strokeWidth={1.75} />
              )}
            </button>
            <span aria-live="polite" className="min-w-6 text-center text-[15px] font-medium tabular-nums">
              {line.quantity}
            </span>
            <button
              type="button"
              onClick={() => setQuantity(line.key, line.quantity + 1)}
              disabled={line.quantity >= MAX_QUANTITY}
              aria-label="Increase quantity"
              className="flex size-11 items-center justify-center rounded-full transition-colors hover:text-brand disabled:text-muted-foreground/50"
            >
              <Plus aria-hidden="true" className="size-[18px]" strokeWidth={1.75} />
            </button>
          </div>

          <button
            type="button"
            onClick={() => removeFromCart(line.key)}
            className="ml-auto inline-flex min-h-11 items-center text-sm font-medium text-muted-foreground underline underline-offset-4 hover:text-brand"
          >
            Remove
          </button>
        </div>
      </div>
    </li>
  );
}
