import {
  COLOR_ORDER,
  hasColor,
  type Gender,
  type Product,
  type ProductCategory,
  type ProductColor,
} from "@/data/mockProducts";

/* Filters live in the URL (/men?category=running&size=9&color=black) so every
   result can be shared, bookmarked, and linked from the navbar. */

export type SortKey = "featured" | "price-asc" | "price-desc";
export type PriceRange = "under-100" | "100-150" | "150-200" | "over-200";

export type CatalogFilters = {
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

/** "Men's Running Shoes": the card subtitle and the page title. */
export function categoryLabel(gender: Gender, category?: ProductCategory) {
  return `${GENDER_LABEL[gender]} ${CATEGORY_NOUN[category ?? "uncategorized"]}`;
}

export function effectivePrice(product: Product) {
  return product.salePrice ?? product.price;
}

const list = (value: string | string[] | undefined) =>
  (Array.isArray(value) ? value : value ? [value] : []).filter(Boolean);

export function parseFilters(params: SearchParams): CatalogFilters {
  const category = CATEGORY_OPTIONS.find((option) => option.value === params.category)?.value;
  const sort = SORT_OPTIONS.find((option) => option.value === params.sort)?.value ?? "featured";

  return {
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
    (filters.isNew ? 1 : 0) +
    (filters.sale ? 1 : 0)
  );
}

function inStockInSize(product: Product, sizes: number[]) {
  return product.variants.some((variant) =>
    sizes.some((size) => variant.sizes.available.includes(size)),
  );
}

/** Within a group options are OR-ed (black or white); groups are AND-ed. */
export function applyFilters(products: readonly Product[], filters: CatalogFilters) {
  const result = products.filter((product) => {
    if (filters.category && product.category !== filters.category) return false;
    if (filters.isNew && !product.isNew) return false;
    if (filters.sale && !product.salePrice) return false;
    if (filters.sizes.length && !inStockInSize(product, filters.sizes)) return false;
    if (filters.colors.length && !filters.colors.some((color) => hasColor(product, color))) return false;
    if (filters.brands.length && !filters.brands.includes(product.brand)) return false;
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
  return result;
}

/** The filter choices worth showing for this set of products. */
export function facetOptions(products: readonly Product[]) {
  const sizes = [
    ...new Set(
      products.flatMap((product) =>
        product.variants.flatMap((variant) => [...variant.sizes.available, ...variant.sizes.soldOut]),
      ),
    ),
  ].sort((a, b) => a - b);

  const colorSet = new Set(products.flatMap((product) => product.filterColors));
  const colors = COLOR_ORDER.filter((color) => colorSet.has(color));

  const brands = [...new Set(products.map((product) => product.brand))].sort((a, b) =>
    a.localeCompare(b, "en", { sensitivity: "base" }),
  );

  const newCount = products.filter((product) => product.isNew).length;
  const saleCount = products.filter((product) => product.salePrice).length;

  return { sizes, colors, brands, newCount, saleCount };
}
