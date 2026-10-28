import { describe, expect, test } from "vitest";
import { mockProducts } from "@/data/mockProducts";
import {
  applyFilters,
  categoryLabel,
  colourName,
  countActiveFilters,
  effectivePrice,
  facetOptions,
  filtersToQuery,
  parseFilters,
  type CatalogFilters,
} from "@/lib/catalog";

/** No filters at all, like a fresh /shop page. */
const none: CatalogFilters = {
  sizes: [],
  colors: [],
  brands: [],
  prices: [],
  isNew: false,
  sale: false,
  sort: "featured",
};

describe("parseFilters: reading the URL", () => {
  test("reads /men?size=9&color=black", () => {
    const filters = parseFilters({ size: "9", color: "black" });
    expect(filters.sizes).toEqual([9]);
    expect(filters.colors).toEqual(["black"]);
  });

  test("reads several sizes", () => {
    expect(parseFilters({ size: ["8", "9.5"] }).sizes).toEqual([8, 9.5]);
  });

  test("ignores values the store doesn't have", () => {
    const filters = parseFilters({ size: "big", color: "rainbow", category: "golf", sort: "random" });
    expect(filters.sizes).toEqual([]);
    expect(filters.colors).toEqual([]);
    expect(filters.category).toBeUndefined();
    expect(filters.sort).toBe("featured");
  });

  test("New and Sale can't both be on: Sale wins", () => {
    const filters = parseFilters({ new: "1", sale: "1" });
    expect(filters.isNew).toBe(false);
    expect(filters.sale).toBe(true);
  });
});

describe("filtersToQuery: writing the URL", () => {
  test("leaves defaults out, so a clean page has a clean URL", () => {
    expect(filtersToQuery(none)).toBe("");
  });

  test("survives a round trip: URL → filters → the same URL", () => {
    const query = "?category=running&size=9&color=black&sort=price-asc";
    const params = Object.fromEntries(new URLSearchParams(query));
    expect(filtersToQuery(parseFilters(params))).toBe(query);
  });
});

describe("applyFilters", () => {
  test("no filters keeps every shoe", () => {
    expect(applyFilters(mockProducts, none)).toHaveLength(mockProducts.length);
  });

  test("size 9 keeps only shoes with size 9 in stock", () => {
    const results = applyFilters(mockProducts, { ...none, sizes: [9] });
    expect(results.length).toBeGreaterThan(0);
    for (const product of results) {
      expect(product.variants.some((variant) => variant.sizes.available.includes(9))).toBe(true);
    }
  });

  test("a sold-out size doesn't count", () => {
    // The Bad Bunny Gazelle is sold out in size 9.
    const results = applyFilters(mockProducts, { ...none, sizes: [9] });
    expect(results.some((product) => product.id === "m38")).toBe(false);
  });

  test("two brands means either one (OR)", () => {
    const results = applyFilters(mockProducts, { ...none, brands: ["Nike", "On"] });
    expect(results.every((product) => product.brand === "Nike" || product.brand === "On")).toBe(true);
    expect(results.some((product) => product.brand === "On")).toBe(true);
  });

  test("brand and category together means both (AND)", () => {
    const results = applyFilters(mockProducts, { ...none, brands: ["Nike"], category: "running" });
    expect(results.every((product) => product.brand === "Nike" && product.category === "running")).toBe(true);
  });

  test("under $100 keeps only shoes under $100", () => {
    const results = applyFilters(mockProducts, { ...none, prices: ["under-100"] });
    expect(results.every((product) => effectivePrice(product) < 100)).toBe(true);
  });

  test("sorts by price, low to high", () => {
    const prices = applyFilters(mockProducts, { ...none, sort: "price-asc" }).map(effectivePrice);
    expect(prices).toEqual([...prices].sort((a, b) => a - b));
  });
});

describe("countActiveFilters", () => {
  test("counts each picked option", () => {
    expect(countActiveFilters({ ...none, sizes: [8, 9], colors: ["black"], sale: true })).toBe(4);
  });

  test("sort is not a filter", () => {
    expect(countActiveFilters({ ...none, sort: "price-desc" })).toBe(0);
  });
});

describe("facetOptions", () => {
  test("lists each brand once, A to Z", () => {
    const { brands } = facetOptions(mockProducts);
    expect(new Set(brands).size).toBe(brands.length);
    expect(brands[0]).toBe("Adidas");
  });

  test("counts men and women", () => {
    const { menCount, womenCount } = facetOptions(mockProducts);
    expect(menCount + womenCount).toBe(mockProducts.length);
  });
});

describe("labels", () => {
  test("names the page: Men's Running Shoes", () => {
    expect(categoryLabel("men", "running")).toBe("Men's Running Shoes");
    expect(categoryLabel("women")).toBe("Women's Shoes");
  });

  test("names a colourway: Black - Multicolour", () => {
    expect(colourName(["black", "multi"])).toBe("Black - Multicolour");
  });
});
