import { describe, expect, test } from "vitest";
import { testProducts } from "@/lib/test-products";
import {
  applyFilters,
  categoryLabel,
  colourName,
  countActiveFilters,
  effectivePrice,
  facetOptions,
  filtersToQuery,
  mixProducts,
  TRENDING_PER_TAB,
  trendingOrder,
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
    expect(applyFilters(testProducts, none)).toHaveLength(testProducts.length);
  });

  test("size 9 keeps only shoes with size 9 in stock", () => {
    const results = applyFilters(testProducts, { ...none, sizes: [9] });
    expect(results.length).toBeGreaterThan(0);
    for (const product of results) {
      expect(product.variants.some((variant) => variant.sizes.some((size) => size.value === 9 && size.stock > 0))).toBe(true);
    }
  });

  test("a sold-out size doesn't count", () => {
    // The Bad Bunny Gazelle is sold out in size 9.
    const results = applyFilters(testProducts, { ...none, sizes: [9] });
    expect(results.some((product) => product.id === "m38")).toBe(false);
  });

  test("two brands means either one (OR)", () => {
    const results = applyFilters(testProducts, { ...none, brands: ["Nike", "On"] });
    expect(results.every((product) => product.brand.name === "Nike" || product.brand.name === "On")).toBe(true);
    expect(results.some((product) => product.brand.name === "On")).toBe(true);
  });

  test("brand and category together means both (AND)", () => {
    const results = applyFilters(testProducts, { ...none, brands: ["Nike"], category: "running" });
    expect(results.every((product) => product.brand.name === "Nike" && product.category === "running")).toBe(true);
  });

  test("under $100 keeps only shoes under $100", () => {
    const results = applyFilters(testProducts, { ...none, prices: ["under-100"] });
    expect(results.every((product) => effectivePrice(product) < 100)).toBe(true);
  });

  test("sorts by price, low to high", () => {
    const prices = applyFilters(testProducts, { ...none, sort: "price-asc" }).map(effectivePrice);
    expect(prices).toEqual([...prices].sort((a, b) => a - b));
  });
});

describe("mixProducts: the Featured order", () => {
  const men = testProducts.filter((product) => product.gender === "men");
  const women = testProducts.filter((product) => product.gender === "women");
  const ids = (products: { id: string }[]) => products.map((product) => product.id);

  test("keeps every shoe exactly once", () => {
    expect(ids(mixProducts(men)).sort()).toEqual(ids(men).sort());
  });

  test("same shoes give the same order, whatever order the database returns them in", () => {
    expect(ids(mixProducts([...men].reverse()))).toEqual(ids(mixProducts(men)));
  });

  test("a different seed gives a different order", () => {
    expect(ids(mixProducts(men, 2))).not.toEqual(ids(mixProducts(men, 1)));
  });

  test("new styles come first", () => {
    const mixed = mixProducts(men);
    const newCount = men.filter((product) => product.isNew).length;
    expect(mixed.slice(0, newCount).every((product) => product.isNew)).toBe(true);
  });

  test("Trending mixes new styles in with the rest", () => {
    const trending = men.filter((product) => product.isTrending);
    const firstCards = new Set([1, 2, 3, 4, 5, 6].map((day) => mixProducts(trending, day, { newFirst: false })[0].id));
    expect(firstCards.size).toBeGreaterThan(1);
  });

  test("no two neighbours share a brand", () => {
    for (const list of [men, women, men.filter((product) => product.isTrending)]) {
      for (const seed of [1, 2, 3, 20000]) {
        const mixed = mixProducts(list, seed);
        const repeats = mixed.filter((product, i) => i > 0 && product.brand.name === mixed[i - 1].brand.name);
        expect(repeats).toEqual([]);
      }
    }
  });

  test("Featured mixes the list; search keeps its best-match order", () => {
    expect(ids(applyFilters(men, none))).toEqual(ids(mixProducts(men)));
    expect(ids(applyFilters(men, none, { mix: false }))).toEqual(ids(men));
  });
});

describe("trendingOrder: new shoes and a new order every 24 hours", () => {
  const trending = testProducts.filter((product) => product.isTrending);
  const HOUR = 60 * 60 * 1000;
  const start = Date.parse("2026-11-24T00:00:00Z"); // the start of one 24-hour period
  const order = (time: number) => trendingOrder(trending, time).map((product) => product.id);

  test("stays the same for 24 hours", () => {
    for (const hours of [1, 6, 12, 18, 23.99]) {
      expect(order(start + hours * HOUR)).toEqual(order(start));
    }
  });

  test("changes after 24 hours", () => {
    expect(order(start + 24 * HOUR)).not.toEqual(order(start));
  });

  test("changes again every 24 hours for a week", () => {
    for (let day = 1; day <= 7; day++) {
      expect(order(start + day * 24 * HOUR)).not.toEqual(order(start + (day - 1) * 24 * HOUR));
    }
  });

  const tab = (gender: string, day: number) =>
    trendingOrder(trending, start + day * 24 * HOUR).filter((product) => product.gender === gender);

  test("shows 20 per tab, men first, then women", () => {
    const shoes = trendingOrder(trending, start);
    expect(shoes.slice(0, TRENDING_PER_TAB).every((product) => product.gender === "men")).toBe(true);
    expect(shoes.slice(TRENDING_PER_TAB).every((product) => product.gender === "women")).toBe(true);
    expect(shoes).toHaveLength(2 * TRENDING_PER_TAB);
    expect(new Set(shoes.map((product) => product.id)).size).toBe(shoes.length);
  });

  test("the shoes themselves change, not just their places", () => {
    for (const gender of ["men", "women"]) {
      const today = new Set(tab(gender, 0).map((product) => product.id));
      expect(tab(gender, 1).some((product) => !today.has(product.id))).toBe(true);
    }
  });

  test("every trending shoe gets shown within a week", () => {
    for (const gender of ["men", "women"]) {
      const seen = new Set([0, 1, 2, 3, 4, 5, 6].flatMap((day) => tab(gender, day).map((product) => product.id)));
      expect(seen.size).toBe(trending.filter((product) => product.gender === gender).length);
    }
  });

  test("each brand keeps its share, so no two neighbours share a brand", () => {
    for (const gender of ["men", "women"]) {
      for (let day = 0; day < 30; day++) {
        const shoes = tab(gender, day);
        const repeats = shoes.filter((product, i) => i > 0 && product.brand.name === shoes[i - 1].brand.name);
        expect(repeats).toEqual([]);
      }
    }
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
    const { brands } = facetOptions(testProducts);
    expect(new Set(brands).size).toBe(brands.length);
    expect(brands[0]).toBe("Adidas");
  });

  test("counts men and women", () => {
    const { menCount, womenCount } = facetOptions(testProducts);
    expect(menCount + womenCount).toBe(testProducts.length);
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
