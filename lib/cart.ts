"use client";

import { useSyncExternalStore } from "react";

/*
 * The shopping bag. It lives in this browser's storage, so it survives a refresh and is
 * shared by every tab, but never leaves the shopper's device. Storage can be blocked
 * (private mode), so every access is guarded and the bag then simply lasts for the visit.
 */

export type CartItem = {
  /** One line per product, colourway and size: "m12-0-9.5". */
  key: string;
  productId: string;
  variant: number;
  size: number;
  quantity: number;
};

export const MAX_QUANTITY = 10;

const STORAGE_KEY = "red-kicks:bag";
const EMPTY: CartItem[] = [];

let items: CartItem[] = EMPTY;
let loaded = false;
const listeners = new Set<() => void>();

const lineKey = (productId: string, variant: number, size: number) => `${productId}-${variant}-${size}`;

function load() {
  if (loaded || typeof window === "undefined") return;
  loaded = true;
  try {
    const saved = JSON.parse(window.localStorage.getItem(STORAGE_KEY) ?? "[]");
    if (Array.isArray(saved)) {
      items = saved.filter(
        (item): item is CartItem =>
          typeof item?.productId === "string" &&
          Number.isInteger(item.variant) &&
          typeof item.size === "number" &&
          Number.isInteger(item.quantity) &&
          item.quantity > 0,
      );
    }
  } catch {
    items = EMPTY;
  }
}

function save(next: CartItem[]) {
  items = next;
  try {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
  } catch {
    // Storage unavailable: the bag still works until the page is closed.
  }
  listeners.forEach((listener) => listener());
}

function subscribe(listener: () => void) {
  listeners.add(listener);
  // Keep tabs in step: adding a shoe in one tab updates the bag icon in the others.
  const onStorage = (event: StorageEvent) => {
    if (event.key !== STORAGE_KEY) return;
    loaded = false;
    load();
    listener();
  };
  window.addEventListener("storage", onStorage);
  return () => {
    listeners.delete(listener);
    window.removeEventListener("storage", onStorage);
  };
}

function getSnapshot() {
  load();
  return items;
}

/** The bag's lines. Empty while rendering on the server; filled in once the page loads. */
export function useCart() {
  return useSyncExternalStore(subscribe, getSnapshot, () => EMPTY);
}

/** Total pairs in the bag, for the bag icon. */
export function useCartCount() {
  return useCart().reduce((total, item) => total + item.quantity, 0);
}

export function addToCart(productId: string, variant: number, size: number) {
  load();
  const key = lineKey(productId, variant, size);
  const existing = items.find((item) => item.key === key);
  save(
    existing
      ? items.map((item) =>
          item.key === key ? { ...item, quantity: Math.min(item.quantity + 1, MAX_QUANTITY) } : item,
        )
      : [...items, { key, productId, variant, size, quantity: 1 }],
  );
}

export function setQuantity(key: string, quantity: number) {
  if (quantity < 1) return removeFromCart(key);
  save(items.map((item) => (item.key === key ? { ...item, quantity: Math.min(quantity, MAX_QUANTITY) } : item)));
}

export function removeFromCart(key: string) {
  save(items.filter((item) => item.key !== key));
}

/** Empty the bag, once an order is placed. */
export function clearCart() {
  save(EMPTY);
}

/** Switch a line to another size; if that size is already in the bag, the two lines merge. */
export function changeSize(key: string, size: number) {
  const line = items.find((item) => item.key === key);
  if (!line || line.size === size) return;
  const newKey = lineKey(line.productId, line.variant, size);
  const target = items.find((item) => item.key === newKey);
  save(
    target
      ? items
          .filter((item) => item.key !== key)
          .map((item) =>
            item.key === newKey
              ? { ...item, quantity: Math.min(item.quantity + line.quantity, MAX_QUANTITY) }
              : item,
          )
      : items.map((item) => (item.key === key ? { ...item, key: newKey, size } : item)),
  );
}
