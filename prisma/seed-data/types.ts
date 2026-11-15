import type { Gender, ProductCategory, ProductColor } from "@/lib/product-types";

/* The shape of one shoe in products.ts, the seed data that prisma/seed.ts writes to Postgres. */

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

