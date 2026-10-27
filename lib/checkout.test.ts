import { describe, expect, test } from "vitest";
import { mockProducts } from "@/data/mockProducts";
import {
  arrivalDate,
  bagLines,
  bagTotals,
  formatCardNumber,
  formatExpiry,
  isCardNumber,
  isCvc,
  isEmail,
  isExpiry,
  type Line,
} from "@/lib/checkout";

// A fixed "today" (Monday 26 October 2026), so date tests give the same answer every day.
const MONDAY = new Date(2026, 9, 26);

// The Badbo 1.1 ($132, full price), used to build bags.
const badbo = mockProducts.find((product) => product.id === "m37")!;

/** A bag line for a shoe at a chosen price. */
const line = (price: number, quantity = 1): Line => ({
  key: `test-${price}-${quantity}`,
  productId: badbo.id,
  variant: 0,
  size: 9,
  quantity,
  product: { ...badbo, price },
});

describe("isCardNumber", () => {
  test("accepts the demo card", () => {
    expect(isCardNumber("4242 4242 4242 4242")).toBe(true);
  });

  test("accepts it without spaces", () => {
    expect(isCardNumber("4242424242424242")).toBe(true);
  });

  test("rejects a wrong card", () => {
    expect(isCardNumber("1234 5678 9012 3456")).toBe(false);
  });

  test("rejects a number that is too short", () => {
    expect(isCardNumber("4242")).toBe(false);
  });
});

describe("isCvc", () => {
  test("accepts 3 or 4 digits", () => {
    expect(isCvc("123")).toBe(true);
    expect(isCvc("1234")).toBe(true);
  });

  test("rejects 2 digits", () => {
    expect(isCvc("12")).toBe(false);
  });

  test("rejects letters", () => {
    expect(isCvc("abc")).toBe(false);
  });
});

describe("isExpiry", () => {
  test("accepts a future date", () => {
    expect(isExpiry("12/30", MONDAY)).toBe(true);
  });

  test("accepts this month", () => {
    expect(isExpiry("10/26", MONDAY)).toBe(true);
  });

  test("rejects last month", () => {
    expect(isExpiry("09/26", MONDAY)).toBe(false);
  });

  test("rejects month 13 and a missing slash", () => {
    expect(isExpiry("13/30", MONDAY)).toBe(false);
    expect(isExpiry("1230", MONDAY)).toBe(false);
  });
});

describe("isEmail", () => {
  test("accepts a normal address", () => {
    expect(isEmail("name@example.com")).toBe(true);
  });

  test("rejects an address without @ or a dot", () => {
    expect(isEmail("name.example.com")).toBe(false);
    expect(isEmail("name@example")).toBe(false);
  });
});

describe("formatting while typing", () => {
  test("groups card digits in fours", () => {
    expect(formatCardNumber("4242424242424242")).toBe("4242 4242 4242 4242");
  });

  test("adds the slash to the expiry date", () => {
    expect(formatExpiry("1230")).toBe("12/30");
    expect(formatExpiry("12")).toBe("12");
  });
});

describe("bagTotals: delivery rule", () => {
  test("charges $10 delivery under $150", () => {
    const totals = bagTotals([line(149)]);
    expect(totals.delivery).toBe(10);
    expect(totals.total).toBe(159);
    expect(totals.toFreeDelivery).toBe(1);
  });

  test("makes delivery free at exactly $150", () => {
    const totals = bagTotals([line(150)]);
    expect(totals.delivery).toBe(0);
    expect(totals.total).toBe(150);
    expect(totals.toFreeDelivery).toBe(0);
  });

  test("counts quantity in the price and the item count", () => {
    const totals = bagTotals([line(100, 2)]);
    expect(totals.subtotal).toBe(200);
    expect(totals.itemCount).toBe(2);
    expect(totals.delivery).toBe(0);
  });
});

describe("bagLines", () => {
  test("skips shoes that are no longer in the catalogue", () => {
    const lines = bagLines([
      { key: "m37-0-9", productId: "m37", variant: 0, size: 9, quantity: 1 },
      { key: "gone-0-9", productId: "gone", variant: 0, size: 9, quantity: 1 },
    ]);
    expect(lines).toHaveLength(1);
    expect(lines[0].product.name).toBe("Adidas Bad Bunny Badbo 1.1");
  });
});

describe("arrivalDate", () => {
  test("is 3 days after the order", () => {
    expect(arrivalDate(MONDAY)).toBe("Thursday 29 October");
  });
});
