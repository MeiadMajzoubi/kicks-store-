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

type Mixable = {
  id: string;
  isNew: boolean;
  category: string;
  brand: { name: string };
  variants: { colors: string[] }[];
};

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

  // Each brand and each colour is spaced evenly down the list: a brand with 4 shoes lands about every
  // quarter. A shoe's planned spot is halfway between where its brand and its colour want it.
  const evenSpots = (key: (item: T) => string | undefined) => {
    const groups = new Map<string | undefined, T[]>();
    for (const item of shuffled) groups.set(key(item), [...(groups.get(key(item)) ?? []), item]);
    const spots = new Map<T, number>();
    for (const group of groups.values()) {
      const offset = random();
      group.forEach((item, k) => spots.set(item, (k + offset) / group.length));
    }
    return spots;
  };
  const brandSpot = evenSpots((item) => item.brand.name);
  const colourSpot = evenSpots(mainColour);
  const planned = [...shuffled].sort(
    (a, b) => brandSpot.get(a)! + colourSpot.get(a)! - (brandSpot.get(b)! + colourSpot.get(b)!),
  );

  // Then lay the shoes down one by one, following the plan but skipping a shoe that matches the one
  // before it: a different brand always, and where possible a different colour and type too (colour
  // counts more). A pick is only made if the shoes left can still avoid two of a brand side by side.
  const result: T[] = [];
  let previous = before;
  while (planned.length) {
    const differs = (item: T) => !previous || item.brand.name !== previous.brand.name;
    const variety = (item: T) =>
      !previous ? 0 : (mainColour(item) !== mainColour(previous) ? 2 : 0) + (item.category !== previous.category ? 1 : 0);
    const leavesRoom = (index: number, key: (item: Mixable) => string | undefined) =>
      canSeparate(planned.filter((_, j) => j !== index), planned[index], key);
    // Best: the colours left can still be kept apart too. Then a new colour, then a new type.
    const score = (index: number) => (leavesRoom(index, mainColour) ? 4 : 0) + variety(planned[index]);

    // Only the next few shoes in the plan are considered, so the varied ones aren't all used up early.
    let pick = -1;
    let considered = 0;
    for (let i = 0; i < planned.length && considered < 4; i++) {
      if (!differs(planned[i]) || !leavesRoom(i, (item) => item.brand.name)) continue;
      considered++;
      if (pick === -1 || score(i) > score(pick)) pick = i;
    }
    if (pick === -1) pick = planned.findIndex(differs);
    if (pick === -1) pick = 0;

    previous = planned.splice(pick, 1)[0];
    result.push(previous);
  }
  return result;
}

/**
 * Whether `rest` can follow `after` with no brand (or colour, by `key`) twice in a row: no value may
 * outnumber all the others plus one.
 */
function canSeparate(rest: readonly Mixable[], after: Mixable, key: (item: Mixable) => string | undefined) {
  const counts = new Map<string | undefined, number>();
  for (const item of rest) counts.set(key(item), (counts.get(key(item)) ?? 0) + 1);
  for (const [value, count] of counts) {
    const others = rest.length - count;
    // A value can fill every other spot; if it also matched `after`, it couldn't take the first one.
    if (count > others + (value === key(after) ? 0 : 1)) return false;
  }
  return true;
}

/**
 * The "Featured" order: new styles first, then the rest, each mixed so neighbours differ in brand,
 * colour and type. The same shoes and seed always give the same order, so a page doesn't jump between
 * visits. A different seed (Trending now uses the day) gives a different mix. `newFirst: false` mixes
 * new styles in with the rest.
 */
export function mixProducts<T extends Mixable>(products: readonly T[], seed = 1, { newFirst = true } = {}): T[] {
  const random = seededRandom(seed);
  if (!newFirst) return spread(products, random);
  const fresh = spread(products.filter((product) => product.isNew), random);
  const rest = spread(products.filter((product) => !product.isNew), random, fresh.at(-1));
  return [...fresh, ...rest];
}

/** Which 24-hour period a time (in milliseconds) falls in. It goes up by one every 24 hours. */
export const dayNumber = (time: number) => Math.floor(time / 86_400_000);

/** How many shoes each Trending tab shows. The pool is bigger, so the rest take a day off. */
export const TRENDING_PER_TAB = 20;

/** Phones show only the first few of each tab, as a short row you swipe. */
export const TRENDING_PER_TAB_PHONE = 8;

/** How far the day's window moves along the circle: about a third of the shoes are new each day. */
const TRENDING_STEP = 7;

/**
 * Picks `count` shoes from the pool for one day, as a rotation so every shoe gets the same turns:
 * the pool is laid out once in a fixed, well-mixed circle, and each day shows a window of `count`
 * shoes that moves on by TRENDING_STEP places. Because the circle is mixed by brand, any window keeps
 * each brand's share, so the day's shoes can still be ordered with no brand twice in a row.
 */
function pickForDay<T extends Mixable>(pool: readonly T[], count: number, day: number): T[] {
  if (pool.length <= count) return [...pool];
  const circle = mixProducts(pool, 1, { newFirst: false });
  const first = (((day * TRENDING_STEP) % circle.length) + circle.length) % circle.length;

  // Walk the circle from today's start. A brand never takes more than its share of the tab, rounded up
  // (12 Nike in 30 shoes: at most 4 of 8), so the day's shoes can always be ordered with no brand twice
  // in a row. A shoe skipped for that reason gets its turn on a later day.
  const brandTotal = new Map<string, number>();
  for (const item of pool) brandTotal.set(item.brand.name, (brandTotal.get(item.brand.name) ?? 0) + 1);
  const taken = new Map<string, number>();
  const picked: T[] = [];
  for (let k = 0; k < circle.length && picked.length < count; k++) {
    const item = circle[(first + k) % circle.length];
    const brand = item.brand.name;
    const cap = Math.ceil((brandTotal.get(brand)! * count) / pool.length);
    if ((taken.get(brand) ?? 0) >= cap) continue;
    taken.set(brand, (taken.get(brand) ?? 0) + 1);
    picked.push(item);
  }
  return picked;
}

/**
 * Trending now: for each tab (men, women), a different 20 of its trending shoes every 24 hours, mixed
 * so neighbours differ. The 24-hour period is the seed, so everyone sees the same shoes in the same
 * order for 24 hours, then both change. New styles are mixed in, not put first.
 */
export function trendingOrder<T extends Mixable & { gender: string }>(
  products: readonly T[],
  time: number,
  perTab = TRENDING_PER_TAB,
): T[] {
  const day = dayNumber(time);
  return (["men", "women"] as const).flatMap((gender) => {
    const today = pickForDay(
      products.filter((product) => product.gender === gender),
      perTab,
      day,
    );
    return mixProducts(today, day, { newFirst: false });
  });
}

/** The order colours run in on a wide Trending grid, so it reads like a palette: light neutrals, dark, warm, then cool. */
const COLOUR_RAMP = ["white", "cream", "silver", "grey", "black", "brown", "red", "orange", "yellow", "green", "blue", "purple", "pink", "multi"];

/**
 * Lays shoes out along the colour ramp (a wide screen reads left to right, row by row), so each stretch of
 * the grid is one colour family. Within that, a brand never sits next to itself, and where possible not
 * right above itself in the grid (`columns` is the grid's width). Shoes keep their given order inside a colour.
 */
export function colourRamp<T extends Mixable>(products: readonly T[], columns = 5): T[] {
  const rank = (product: T) => {
    const index = COLOUR_RAMP.indexOf(mainColour(product) ?? "");
    return index === -1 ? COLOUR_RAMP.length : index;
  };
  const brandOf = (item: Mixable) => item.brand.name;
  const rest = [...products].sort((a, b) => rank(a) - rank(b));
  const result: T[] = [];
  while (rest.length) {
    const previous = result.at(-1);
    const above = result.at(-columns);
    // The next few shoes along the ramp that fit: a different brand from the last, and the rest can still be separated.
    const fits: number[] = [];
    for (let i = 0; i < rest.length && fits.length < 4; i++) {
      if (previous && brandOf(rest[i]) === brandOf(previous)) continue;
      if (!canSeparate(rest.filter((_, j) => j !== i), rest[i], brandOf)) continue;
      fits.push(i);
    }
    const pick = fits.find((i) => !above || brandOf(rest[i]) !== brandOf(above)) ?? fits[0] ?? 0;
    result.push(...rest.splice(pick, 1));
  }
  return result;
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
