import { mockProducts, type Product } from "@/data/mockProducts";
import type { CartItem } from "@/lib/cart";
import { effectivePrice } from "@/lib/catalog";

/*
 * Money rules shared by the bag and checkout, so both always show the same numbers.
 * Express delivery is the only option: free from $150, otherwise $10.
 */
export const FREE_DELIVERY_FROM = 150;
export const DELIVERY_FEE = 10;
export const DELIVERY_DAYS = 3;

export const currency = new Intl.NumberFormat("en-US", { style: "currency", currency: "USD" });

export type Line = CartItem & { product: Product };

/** Bag items joined to their shoes. Shoes no longer in the catalogue are skipped. */
export function bagLines(items: readonly CartItem[]): Line[] {
  return items.flatMap((item) => {
    const product = mockProducts.find((candidate) => candidate.id === item.productId);
    return product?.variants[item.variant] ? [{ ...item, product }] : [];
  });
}

export function bagTotals(lines: readonly Line[]) {
  const itemCount = lines.reduce((total, line) => total + line.quantity, 0);
  const fullPrice = lines.reduce((total, line) => total + line.product.price * line.quantity, 0);
  const subtotal = lines.reduce((total, line) => total + effectivePrice(line.product) * line.quantity, 0);
  const delivery = subtotal >= FREE_DELIVERY_FROM ? 0 : DELIVERY_FEE;
  return {
    itemCount,
    fullPrice,
    subtotal,
    saving: fullPrice - subtotal,
    delivery,
    /** How much more to spend for free delivery; 0 once it's free. */
    toFreeDelivery: Math.max(FREE_DELIVERY_FROM - subtotal, 0),
    total: subtotal + delivery,
  };
}

/** "Thursday 29 October": the latest day an order placed now arrives. */
export function arrivalDate(from = new Date()) {
  const date = new Date(from);
  date.setDate(date.getDate() + DELIVERY_DAYS);
  return date.toLocaleDateString("en-GB", { weekday: "long", day: "numeric", month: "long" });
}

/** A made-up order number like "RK-482913". */
export const newOrderNumber = () => `RK-${Math.floor(100000 + Math.random() * 900000)}`;

/* Card checks for the demo payment form: format only, no money ever moves. */

const digits = (value: string) => value.replace(/\D/g, "");

/** Luhn checksum, the check every real card number passes (4242 4242 4242 4242 does). */
export function isCardNumber(value: string) {
  const number = digits(value);
  if (number.length < 13 || number.length > 19) return false;
  let sum = 0;
  for (let i = 0; i < number.length; i++) {
    let digit = Number(number[number.length - 1 - i]);
    if (i % 2 === 1) {
      digit *= 2;
      if (digit > 9) digit -= 9;
    }
    sum += digit;
  }
  return sum % 10 === 0;
}

/** "MM/YY", this month or later. */
export function isExpiry(value: string, now = new Date()) {
  const match = /^(\d{2})\s*\/\s*(\d{2})$/.exec(value.trim());
  if (!match) return false;
  const month = Number(match[1]);
  const year = 2000 + Number(match[2]);
  if (month < 1 || month > 12) return false;
  return year > now.getFullYear() || (year === now.getFullYear() && month >= now.getMonth() + 1);
}

export const isCvc = (value: string) => /^\d{3,4}$/.test(value.trim());

export const isEmail = (value: string) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value.trim());

/** "4242424242424242" → "4242 4242 4242 4242" while typing. */
export const formatCardNumber = (value: string) => digits(value).slice(0, 19).replace(/(\d{4})(?=\d)/g, "$1 ");

/** "1228" → "12/28" while typing. */
export function formatExpiry(value: string) {
  const d = digits(value).slice(0, 4);
  return d.length > 2 ? `${d.slice(0, 2)}/${d.slice(2)}` : d;
}
