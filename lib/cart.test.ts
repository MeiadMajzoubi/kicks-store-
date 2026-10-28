import { beforeEach, describe, expect, test } from "vitest";
import {
  MAX_QUANTITY,
  addToCart,
  changeSize,
  clearCart,
  removeFromCart,
  setQuantity,
  type CartItem,
} from "@/lib/cart";

/** What the bag saved in the browser: the same place a refresh reads it back from. */
const saved = (): CartItem[] => JSON.parse(window.localStorage.getItem("red-kicks:bag") ?? "[]");

// Every test starts with an empty bag.
beforeEach(() => clearCart());

describe("addToCart", () => {
  test("adds a shoe and saves it in the browser", () => {
    addToCart("m37", 0, 9);
    expect(saved()).toEqual([{ key: "m37-0-9", productId: "m37", variant: 0, size: 9, quantity: 1 }]);
  });

  test("the same shoe and size twice becomes quantity 2", () => {
    addToCart("m37", 0, 9);
    addToCart("m37", 0, 9);
    expect(saved()).toHaveLength(1);
    expect(saved()[0].quantity).toBe(2);
  });

  test("the same shoe in another size is a new line", () => {
    addToCart("m37", 0, 9);
    addToCart("m37", 0, 10);
    expect(saved()).toHaveLength(2);
  });

  test(`stops at ${MAX_QUANTITY} pairs`, () => {
    for (let i = 0; i < MAX_QUANTITY + 3; i++) addToCart("m37", 0, 9);
    expect(saved()[0].quantity).toBe(MAX_QUANTITY);
  });
});

describe("setQuantity", () => {
  test("changes the quantity", () => {
    addToCart("m37", 0, 9);
    setQuantity("m37-0-9", 3);
    expect(saved()[0].quantity).toBe(3);
  });

  test("going below 1 removes the line", () => {
    addToCart("m37", 0, 9);
    setQuantity("m37-0-9", 0);
    expect(saved()).toEqual([]);
  });
});

describe("removeFromCart and clearCart", () => {
  test("removes one line and keeps the rest", () => {
    addToCart("m37", 0, 9);
    addToCart("m38", 0, 6);
    removeFromCart("m37-0-9");
    expect(saved().map((item) => item.key)).toEqual(["m38-0-6"]);
  });

  test("clearCart empties the bag", () => {
    addToCart("m37", 0, 9);
    clearCart();
    expect(saved()).toEqual([]);
  });
});

describe("changeSize", () => {
  test("moves a line to the new size", () => {
    addToCart("m37", 0, 9);
    changeSize("m37-0-9", 10);
    expect(saved()).toEqual([{ key: "m37-0-10", productId: "m37", variant: 0, size: 10, quantity: 1 }]);
  });

  test("merges into a line that already has that size", () => {
    addToCart("m37", 0, 9);
    addToCart("m37", 0, 10);
    changeSize("m37-0-9", 10);
    expect(saved()).toHaveLength(1);
    expect(saved()[0].quantity).toBe(2);
  });
});
