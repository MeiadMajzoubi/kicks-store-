import { productData } from "@/prisma/seed-data/products";

export type Gender = "men" | "women";

export type ProductCategory =
  | "running"
  | "training"
  | "lifestyle"
  | "outdoor"
  | "sandals"
  | "uncategorized";

export type ProductColor =
  | "white"
  | "cream"
  | "grey"
  | "silver"
  | "black"
  | "brown"
  | "red"
  | "orange"
  | "yellow"
  | "green"
  | "blue"
  | "purple"
  | "pink"
  | "multi";

/** UK sizes. A size is in exactly one list. Both empty = sizes not entered yet. */
export type VariantSizes = {
  available: number[];
  soldOut: number[];
};

/**
 * One colourway of a product, with its own photos and its own stock.
 * colors: the colours you can see on this colourway. The FIRST one is the main
 * colour (swatch and sorting); the shoe is also found under every other colour in
 * the list. "multi" = three or more vivid colours, e.g. ["black", "multi"].
 */
export type ProductVariant = {
  colors: ProductColor[];
  /** Primary photo, also included in images. Preserve path casing. */
  image: string;
  images: string[];
  sizes: VariantSizes;
};

/**
 * A shoe is either a new arrival or on sale, never both: new arrivals are full price.
 * Writing `isNew: true` together with a `salePrice` is a type error.
 */
type NewOrSale =
  | { isNew: true; salePrice?: never }
  | {
      isNew: false;
      /** Omit when no discount is confirmed; do not use 0 as a placeholder. */
      salePrice?: number;
    };

/** What you write in the data below. */
export type ProductData = NewOrSale & {
  id: string;
  name: string;
  /** Stored explicitly: keep published slugs stable when names change. */
  slug: string;
  brand: string;
  gender: Gender;
  category: ProductCategory;

  /** Existing prices are in USD. */
  price: number;

  /** The first variant is the default one shown on cards. */
  variants: ProductVariant[];

  isFeatured: boolean;
  /** Shown in the "Trending now" section on the home page. Omit = not trending. */
  isTrending?: boolean;
};

/** What the rest of the app reads: ProductData plus fields derived from variants. */
export type Product = ProductData & {
  /** Main colour of each variant, default first (swatches, sorting). */
  colors: ProductColor[];
  /** Every colour of every variant, no duplicates: use this for the colour filter. */
  filterColors: ProductColor[];
  /** Photos of the default variant. */
  image: string;
  images: string[];
};

/** @deprecated Use Product for new code. Kept for existing component imports. */
export type MockProduct = Product;

export const COLOR_ORDER: ProductColor[] = [
  "white",
  "cream",
  "grey",
  "silver",
  "black",
  "brown",
  "red",
  "orange",
  "yellow",
  "green",
  "blue",
  "purple",
  "pink",
  "multi",
];

function primaryColorRank(product: Product): number {
  const primaryColor = product.colors[0]?.trim().toLowerCase();
  const rank = COLOR_ORDER.findIndex((color) => color === primaryColor);
  return rank === -1 ? COLOR_ORDER.length : rank;
}

/** Sort by primary color without mutating the input; unknown colors go last. */
export function sortByColor<T extends Product>(products: readonly T[]): T[] {
  return [...products].sort(
    (a, b) => primaryColorRank(a) - primaryColorRank(b),
  );
}

/** Colour filter: true if any colourway of the product has this colour. */
export function hasColor(product: Product, color: ProductColor): boolean {
  return product.filterColors.includes(color);
}

export function withDefaults(product: ProductData): Product {
  const defaultVariant = product.variants[0];
  return {
    ...product,
    colors: product.variants.map((variant) => variant.colors[0]),
    filterColors: [
      ...new Set(product.variants.flatMap((variant) => variant.colors)),
    ],
    image: defaultVariant.image,
    images: defaultVariant.images,
  };
}

export const mockProducts: Product[] = productData.map(withDefaults);
