import { describe, expect, test } from "vitest";
import { mockProducts } from "@/data/mockProducts";
import { searchProducts, suggest } from "@/lib/search";

const search = (query: string) => searchProducts(mockProducts, query);
const nikeCount = mockProducts.filter((product) => product.brand === "Nike").length;

describe("searchProducts: finding shoes", () => {
  test("finds every Nike for 'nike'", () => {
    const { products } = search("nike");
    expect(products).toHaveLength(nikeCount);
    expect(products.every((product) => product.brand === "Nike")).toBe(true);
  });

  test("forgives one typo: 'nikee' finds the same shoes", () => {
    expect(search("nikee").products).toHaveLength(nikeCount);
  });

  test("accepts the start of a word: 'nik' finds the same shoes", () => {
    expect(search("nik").products).toHaveLength(nikeCount);
  });

  test("finds nothing for a word no shoe has", () => {
    expect(search("banana").products).toHaveLength(0);
  });

  test("finds nothing for an empty search", () => {
    expect(search("").products).toHaveLength(0);
  });

  test("ignores filler words: 'shoes' finds everything", () => {
    expect(search("shoes").products).toHaveLength(mockProducts.length);
  });
});

describe("searchProducts: gender and category words", () => {
  test("'womens running' keeps only women's running shoes", () => {
    const { products } = search("womens running");
    expect(products.length).toBeGreaterThan(0);
    expect(products.every((p) => p.gender === "women" && p.category === "running")).toBe(true);
  });

  test("'mens nike' keeps only men's Nike shoes", () => {
    const { products } = search("mens nike");
    expect(products.every((p) => p.gender === "men" && p.brand === "Nike")).toBe(true);
  });
});

describe("searchProducts: the corrected title", () => {
  test("fixes a typo: 'nikee' becomes 'nike'", () => {
    expect(search("nikee").corrections).toEqual({ nikee: "nike" });
  });

  test("completes a word: 'nik' becomes 'nike'", () => {
    expect(search("nik").corrections).toEqual({ nik: "nike" });
  });

  test("leaves an ambiguous start alone: 'ad' could be Adidas or Adizero", () => {
    const { products, corrections } = search("ad");
    expect(products.length).toBeGreaterThan(0);
    expect(corrections).toEqual({});
  });

  test("leaves a correct word alone", () => {
    expect(search("nike").corrections).toEqual({});
  });
});

describe("suggest", () => {
  test("suggests the Nike brand page while typing 'nik'", () => {
    expect(suggest("nik").some((s) => s.href === "/brands/nike")).toBe(true);
  });
});
