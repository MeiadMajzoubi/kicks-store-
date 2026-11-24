import {
  COLOR_ORDER,
  type Gender,
  type ProductCategory,
  type ProductColor,
} from "@/lib/product-types";
import type { Product } from "@/lib/products";

/* Filters live in the URL (/men?category=running&size=9&color=black) so every
   result can be shared, bookmarked, and linked from the navbar. */

export type SortKey = "featured" | "price-asc" | "price-desc";
export type PriceRange = "under-100" | "100-150" | "150-200" | "over-200";

export type CatalogFilters = {
  /** Only used on pages that mix both, like a brand page. */
  gender?: Gender;
  category?: ProductCategory;
  sizes: number[];
  colors: ProductColor[];
  brands: string[];
  prices: PriceRange[];
  isNew: boolean;
  sale: boolean;
  sort: SortKey;
};

export type SearchParams = Record<string, string | string[] | undefined>;

export const CATEGORY_OPTIONS: { value: ProductCategory; label: string }[] = [
  { value: "running", label: "Running" },
  { value: "training", label: "Training" },
  { value: "lifestyle", label: "Lifestyle" },
  { value: "outdoor", label: "Outdoor" },
  { value: "sandals", label: "Sandals" },
];

export const SORT_OPTIONS: { value: SortKey; label: string }[] = [
  { value: "featured", label: "Featured" },
  { value: "price-asc", label: "Price: Low to High" },
  { value: "price-desc", label: "Price: High to Low" },
];

export const PRICE_OPTIONS: { value: PriceRange; label: string; min: number; max: number }[] = [
  { value: "under-100", label: "Under $100", min: 0, max: 100 },
  { value: "100-150", label: "$100 – $150", min: 100, max: 150 },
  { value: "150-200", label: "$150 – $200", min: 150, max: 200 },
  { value: "over-200", label: "Over $200", min: 200, max: Infinity },
];

/** Swatch fill for each colour filter. */
export const COLOR_SWATCHES: Record<ProductColor, string> = {
  white: "#ffffff",
  cream: "#efe6cf",
  grey: "#9a9a96",
  silver: "linear-gradient(135deg, #f2f2f2, #a9a9a9 55%, #e4e4e4)",
  black: "#181818",
  brown: "#7a4a2a",
  red: "#d71920",
  orange: "#f2731c",
  yellow: "#f5c518",
  green: "#2f9e44",
  blue: "#2563eb",
  purple: "#7c3aed",
  pink: "#f17fb5",
  multi: "conic-gradient(#d71920, #f5c518, #2f9e44, #2563eb, #7c3aed, #d71920)",
};

const GENDER_LABEL: Record<Gender, string> = { men: "Men's", women: "Women's" };

const CATEGORY_NOUN: Record<ProductCategory, string> = {
  running: "Running Shoes",
  training: "Training Shoes",
  lifestyle: "Shoes",
  outdoor: "Outdoor Shoes",
  sandals: "Sandals",
  uncategorized: "Shoes",
};

/** "Running Shoes", or "Shoes" when no category is picked. */
export function categoryNoun(category?: ProductCategory) {
  return CATEGORY_NOUN[category ?? "uncategorized"];
}

/** "Men's Running Shoes": the card subtitle and the page title. */
export function categoryLabel(gender: Gender, category?: ProductCategory) {
  return `${GENDER_LABEL[gender]} ${CATEGORY_NOUN[category ?? "uncategorized"]}`;
}

const COLOUR_NAMES: Partial<Record<ProductColor, string>> = { multi: "Multicolour" };

/** ["black", "multi"] → "Black - Multicolour", the colourway as a shopper reads it. */
export function colourName(colors: ProductColor[]) {
  return colors
    .map((color) => COLOUR_NAMES[color] ?? color[0].toUpperCase() + color.slice(1))
    .join(" - ");
}

/** The price a shopper pays. salePrice is missing or null when the shoe isn't on sale. */
export function effectivePrice(product: { price: number; salePrice?: number | null }) {
  return product.salePrice ?? product.price;
}

const list = (value: string | string[] | undefined) =>
  (Array.isArray(value) ? value : value ? [value] : []).filter(Boolean);

export function parseFilters(params: SearchParams): CatalogFilters {
  const category = CATEGORY_OPTIONS.find((option) => option.value === params.category)?.value;
  const sort = SORT_OPTIONS.find((option) => option.value === params.sort)?.value ?? "featured";

  const gender = params.gender === "men" || params.gender === "women" ? params.gender : undefined;

  return {
    gender,
    category,
    sizes: list(params.size).map(Number).filter(Number.isFinite),
    colors: list(params.color).filter((color): color is ProductColor =>
      COLOR_ORDER.includes(color as ProductColor),
    ),
    brands: list(params.brand),
    prices: list(params.price).filter((price): price is PriceRange =>
      PRICE_OPTIONS.some((option) => option.value === price),
    ),
    // New arrivals are never on sale, so the two can't combine; sale wins if both are in the URL.
    isNew: params.new === "1" && params.sale !== "1",
    sale: params.sale === "1",
    sort,
  };
}

/** Builds the query string for a set of filters; defaults are left out. */
export function filtersToQuery(filters: CatalogFilters) {
  const query = new URLSearchParams();
  if (filters.gender) query.set("gender", filters.gender);
  if (filters.category) query.set("category", filters.category);
  filters.sizes.forEach((size) => query.append("size", String(size)));
  filters.colors.forEach((color) => query.append("color", color));
  filters.brands.forEach((brand) => query.append("brand", brand));
  filters.prices.forEach((price) => query.append("price", price));
  if (filters.isNew) query.set("new", "1");
  if (filters.sale) query.set("sale", "1");
  if (filters.sort !== "featured") query.set("sort", filters.sort);
  const result = query.toString();
  return result ? `?${result}` : "";
}

export function countActiveFilters(filters: CatalogFilters) {
  return (
    filters.sizes.length +
    filters.colors.length +
    filters.brands.length +
    filters.prices.length +
    (filters.gender ? 1 : 0) +
    (filters.isNew ? 1 : 0) +
    (filters.sale ? 1 : 0)
  );
}

function inStockInSize(product: Product, sizes: number[]) {
  return product.variants.some((variant) =>
    variant.sizes.some((size) => size.stock > 0 && sizes.includes(size.value)),
  );
}

/** Sort by the default colourway's first colour (white first, multi last), without changing the input. */
export function sortByColor<T extends { variants: { colors: string[] }[] }>(products: readonly T[]): T[] {
  const rank = (product: T) => {
    const index = COLOR_ORDER.indexOf(product.variants[0]?.colors[0] as ProductColor);
    return index === -1 ? COLOR_ORDER.length : index;
  };
  return [...products].sort((a, b) => rank(a) - rank(b));
}

type Mixable = { id: string; isNew: boolean; brand: { name: string }; variants: { colors: string[] }[] };

/** Numbers that look random but are always the same for the same seed (mulberry32). */
function seededRandom(seed: number) {
  let state = seed >>> 0;
  return () => {
    state = (state + 0x6d2b79f5) >>> 0;
    let t = state;
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

const mainColour = (product: Mixable) => product.variants[0]?.colors[0];

/** Spreads one group of shoes out so the same brand and the same colour rarely sit side by side. */
function spread<T extends Mixable>(items: readonly T[], random: () => number, before?: T): T[] {
  // Start from the id order, so the database's own order never matters, then shuffle with the seed.
  const shuffled = [...items].sort((a, b) => a.id.localeCompare(b.id));
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }

  // Each brand is spaced evenly down the list: a brand with 4 shoes lands about every quarter.
  const byBrand = new Map<string, T[]>();
  for (const item of shuffled) byBrand.set(item.brand.name, [...(byBrand.get(item.brand.name) ?? []), item]);
  const planned = [...byBrand.values()]
    .flatMap((group) => {
      const offset = random();
      return group.map((item, k) => ({ item, at: (k + offset) / group.length }));
    })
    .sort((a, b) => a.at - b.at)
    .map(({ item }) => item);

  // Then lay the shoes down one by one, following the plan but skipping a shoe that matches the one
  // before it. A pick is only made if the shoes left can still avoid two of a brand side by side.
  const result: T[] = [];
  let previous = before;
  while (planned.length) {
    const differs = (item: T) => !previous || item.brand.name !== previous.brand.name;
    const newColour = (item: T) => !previous || mainColour(item) !== mainColour(previous);
    const leavesRoom = (index: number) => canSeparateBrands(planned.filter((_, j) => j !== index), planned[index]);

    let pick = planned.findIndex((item, i) => differs(item) && newColour(item) && leavesRoom(i));
    if (pick === -1) pick = planned.findIndex((item, i) => differs(item) && leavesRoom(i));
    if (pick === -1) pick = planned.findIndex(differs);
    if (pick === -1) pick = 0;

    previous = planned.splice(pick, 1)[0];
    result.push(previous);
  }
  return result;
}

/** Whether `rest` can follow `after` with no brand twice in a row (no brand may outnumber the others plus one). */
function canSeparateBrands(rest: readonly Mixable[], after: Mixable) {
  const counts = new Map<string, number>();
  for (const item of rest) counts.set(item.brand.name, (counts.get(item.brand.name) ?? 0) + 1);
  for (const [brand, count] of counts) {
    const others = rest.length - count;
    // A brand can fill every other spot; if it also matched `after`, it couldn't take the first one.
    if (count > others + (brand === after.brand.name ? 0 : 1)) return false;
  }
  return true;
}

/**
 * The "Featured" order: new styles first, then the rest, each mixed so neighbours differ in brand and
 * colour. The same shoes and seed always give the same order, so a page doesn't jump between visits.
 * A different seed gives a different mix.
 */
export function mixProducts<T extends Mixable>(products: readonly T[], seed = 1): T[] {
  const random = seededRandom(seed);
  const fresh = spread(products.filter((product) => product.isNew), random);
  const rest = spread(products.filter((product) => !product.isNew), random, fresh.at(-1));
  return [...fresh, ...rest];
}

/** Colour filter: true if any colourway of the product has this colour. */
function hasColor(product: Product, color: ProductColor) {
  return product.variants.some((variant) => variant.colors.includes(color));
}

/**
 * Within a group options are OR-ed (black or white); groups are AND-ed.
 * `mix: false` keeps the order the shoes came in under "Featured" (search results stay best match first).
 */
export function applyFilters(products: readonly Product[], filters: CatalogFilters, { mix = true } = {}) {
  const result = products.filter((product) => {
    if (filters.gender && product.gender !== filters.gender) return false;
    if (filters.category && product.category !== filters.category) return false;
    if (filters.isNew && !product.isNew) return false;
    if (filters.sale && !product.salePrice) return false;
    if (filters.sizes.length && !inStockInSize(product, filters.sizes)) return false;
    if (filters.colors.length && !filters.colors.some((color) => hasColor(product, color))) return false;
    if (filters.brands.length && !filters.brands.includes(product.brand.name)) return false;
    if (filters.prices.length) {
      const price = effectivePrice(product);
      const inRange = PRICE_OPTIONS.some(
        (option) => filters.prices.includes(option.value) && price >= option.min && price < option.max,
      );
      if (!inRange) return false;
    }
    return true;
  });

  if (filters.sort === "price-asc") result.sort((a, b) => effectivePrice(a) - effectivePrice(b));
  if (filters.sort === "price-desc") result.sort((a, b) => effectivePrice(b) - effectivePrice(a));
  if (filters.sort === "featured" && mix) return mixProducts(result);
  return result;
}

/** The filter choices worth showing for this set of products. */
export function facetOptions(products: readonly Product[]) {
  const sizes = [
    ...new Set(
      products.flatMap((product) =>
        product.variants.flatMap((variant) => variant.sizes.map((size) => size.value)),
      ),
    ),
  ].sort((a, b) => a - b);

  const colorSet = new Set(
    products.flatMap((product) => product.variants.flatMap((variant) => variant.colors)),
  );
  const colors = COLOR_ORDER.filter((color) => colorSet.has(color));

  const brands = [...new Set(products.map((product) => product.brand.name))].sort((a, b) =>
    a.localeCompare(b, "en", { sensitivity: "base" }),
  );

  const newCount = products.filter((product) => product.isNew).length;
  const saleCount = products.filter((product) => product.salePrice).length;

  const menCount = products.filter((product) => product.gender === "men").length;
  const womenCount = products.filter((product) => product.gender === "women").length;

  return { sizes, colors, brands, newCount, saleCount, menCount, womenCount };
}
