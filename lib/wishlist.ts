"use client";

import { useSyncExternalStore } from "react";

/*
 * The wishlist. Like the bag it lives in this browser's storage, so guests can save shoes
 * without an account; signing in would only be needed to sync across devices later.
 * Storage can be blocked (private mode), so every access is guarded.
 */

export type WishlistItem = {
  productId: string;
  /** The colourway that was showing when the heart was tapped. */
  variant: number;
};

const STORAGE_KEY = "red-kicks:wishlist";
const EMPTY: WishlistItem[] = [];

let items: WishlistItem[] = EMPTY;
let loaded = false;
const listeners = new Set<() => void>();

function load() {
  if (loaded || typeof window === "undefined") return;
  loaded = true;
  try {
    const saved = JSON.parse(window.localStorage.getItem(STORAGE_KEY) ?? "[]");
    if (Array.isArray(saved)) {
      items = saved.filter(
        (item): item is WishlistItem => typeof item?.productId === "string" && Number.isInteger(item.variant),
      );
    }
  } catch {
    items = EMPTY;
  }
}

function save(next: WishlistItem[]) {
  items = next;
  try {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
  } catch {
    // Storage unavailable: the wishlist still works until the page is closed.
  }
  listeners.forEach((listener) => listener());
}

function subscribe(listener: () => void) {
  listeners.add(listener);
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

/** Saved shoes, newest first. Empty while rendering on the server. */
export function useWishlist() {
  return useSyncExternalStore(subscribe, getSnapshot, () => EMPTY);
}

export function useIsSaved(productId: string) {
  return useWishlist().some((item) => item.productId === productId);
}

/** Saves the shoe, or removes it if it's already saved. One entry per shoe. */
export function toggleWishlist(productId: string, variant = 0) {
  load();
  const saved = items.some((item) => item.productId === productId);
  save(saved ? items.filter((item) => item.productId !== productId) : [{ productId, variant }, ...items]);
}

export function removeFromWishlist(productId: string) {
  save(items.filter((item) => item.productId !== productId));
}
