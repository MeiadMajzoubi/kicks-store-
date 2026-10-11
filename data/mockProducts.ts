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
  | "black"
  | "brown"
  | "red"
  | "orange"
  | "yellow"
  | "green"
  | "blue"
  | "purple"
  | "pink";

/** UK sizes. A size is in exactly one list. Both empty = sizes not entered yet. */
export type VariantSizes = {
  available: number[];
  soldOut: number[];
};

/** One colourway of a product, with its own photos and its own stock. */
export type ProductVariant = {
  color: ProductColor;
  /** Primary photo, also included in images. Preserve path casing. */
  image: string;
  images: string[];
  sizes: VariantSizes;
};

/** What you write in the data below. */
type ProductData = {
  id: string;
  name: string;
  /** Stored explicitly: keep published slugs stable when names change. */
  slug: string;
  brand: string;
  gender: Gender;
  category: ProductCategory;

  /** Existing prices are in USD. */
  price: number;
  /** Omit when no discount is confirmed; do not use 0 as a placeholder. */
  salePrice?: number;

  /** The first variant is the default one shown on cards. */
  variants: ProductVariant[];

  isNew: boolean;
  isFeatured: boolean;
  /** Shown in the "Trending now" section on the home page. Omit = not trending. */
  isTrending?: boolean;
};

/** What the rest of the app reads: ProductData plus fields derived from variants. */
export type Product = ProductData & {
  /** All variant colours, default first. */
  colors: ProductColor[];
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
  "black",
  "brown",
  "red",
  "orange",
  "yellow",
  "green",
  "blue",
  "purple",
  "pink",
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

function withDefaults(product: ProductData): Product {
  const defaultVariant = product.variants[0];
  return {
    ...product,
    colors: product.variants.map((variant) => variant.color),
    image: defaultVariant.image,
    images: defaultVariant.images,
  };
}

// 40 original products retained, now in the variants shape (one variant each).
// ASICS spelling matches data/brands.ts.
// The original source had no confirmed categories, sizes, discounts or extra images.
// Keep category "uncategorized" and empty sizes until verified.
// Original colors are preserved: the old source marks every item "white".
// False merchandising flags are defaults, not claims about release dates.
const productData: ProductData[] = [
  // Men: m1–m20
  {
    id: "m1",
    name: "Jordan Spizike Low",
    slug: "jordan-spizike-low-m1",
    brand: "Jordan",
    gender: "men",
    category: "uncategorized",
    price: 125,
    variants: [
      {
        color: "white",
        image: "/Products/m1.webp",
        images: ["/Products/m1.webp"],
        sizes: { available: [], soldOut: [] },
      },
    ],
    isNew: false,
    isFeatured: false,
    isTrending: true,
  },
  {
    id: "m2",
    name: "Jordan Retro 11 \"University Blue\"",
    slug: "jordan-retro-11-university-blue-m2",
    brand: "Jordan",
    gender: "men",
    category: "uncategorized",
    price: 187,
    variants: [
      {
        color: "white",
        image: "/Products/m2.webp",
        images: ["/Products/m2.webp"],
        sizes: { available: [], soldOut: [] },
      },
    ],
    isNew: false,
    isFeatured: false,
    isTrending: true,
  },
  {
    id: "m3",
    name: "Jordan Triangle",
    slug: "jordan-triangle-m3",
    brand: "Jordan",
    gender: "men",
    category: "uncategorized",
    price: 159,
    variants: [
      {
        color: "white",
        image: "/Products/m3.webp",
        images: ["/Products/m3.webp"],
        sizes: { available: [], soldOut: [] },
      },
    ],
    isNew: false,
    isFeatured: false,
    isTrending: true,
  },
  {
    id: "m4",
    name: "Nike Air Max Tuned 1",
    slug: "nike-air-max-tuned-1-m4",
    brand: "Nike",
    gender: "men",
    category: "uncategorized",
    price: 159,
    variants: [
      {
        color: "white",
        image: "/Products/m4.webp",
        images: ["/Products/m4.webp"],
        sizes: { available: [], soldOut: [] },
      },
    ],
    isNew: false,
    isFeatured: false,
    isTrending: true,
  },
  {
    id: "m5",
    name: "adidas Adizero Evo SL Exo",
    slug: "adidas-adizero-evo-sl-exo-m5",
    brand: "adidas",
    gender: "men",
    category: "uncategorized",
    price: 170,
    variants: [
      {
        color: "white",
        image: "/Products/m5.webp",
        images: ["/Products/m5.webp"],
        sizes: { available: [], soldOut: [] },
      },
    ],
    isNew: false,
    isFeatured: false,
    isTrending: true,
  },
  {
    id: "m6",
    name: "Nike ReactX Rejuven8",
    slug: "nike-reactx-rejuven8-m6",
    brand: "Nike",
    gender: "men",
    category: "uncategorized",
    price: 68,
    variants: [
      {
        color: "white",
        image: "/Products/m6.webp",
        images: ["/Products/m6.webp"],
        sizes: { available: [], soldOut: [] },
      },
    ],
    isNew: false,
    isFeatured: false,
    isTrending: true,
  },
  {
    id: "m7",
    name: "Birkenstock Boston",
    slug: "birkenstock-boston-m7",
    brand: "Birkenstock",
    gender: "men",
    category: "uncategorized",
    price: 221,
    variants: [
      {
        color: "white",
        image: "/Products/m7.webp",
        images: ["/Products/m7.webp"],
        sizes: { available: [], soldOut: [] },
      },
    ],
    isNew: false,
    isFeatured: false,
    isTrending: true,
  },
  {
    id: "m8",
    name: "Vans Old Skool",
    slug: "vans-old-skool-m8",
    brand: "Vans",
    gender: "men",
    category: "uncategorized",
    price: 62,
    variants: [
      {
        color: "white",
        image: "/Products/m8.webp",
        images: ["/Products/m8.webp"],
        sizes: { available: [], soldOut: [] },
      },
    ],
    isNew: false,
    isFeatured: false,
    isTrending: true,
  },
  {
    id: "m9",
    name: "Puma Caven 2.0",
    slug: "puma-caven-2-0-m9",
    brand: "Puma",
    gender: "men",
    category: "uncategorized",
    price: 51,
    variants: [
      {
        color: "white",
        image: "/Products/m9.webp",
        images: ["/Products/m9.webp"],
        sizes: { available: [], soldOut: [] },
      },
    ],
    isNew: false,
    isFeatured: false,
    isTrending: true,
  },
  {
    id: "m10",
    name: "On Cloudgeo WP",
    slug: "on-cloudgeo-wp-m10",
    brand: "On",
    gender: "men",
    category: "uncategorized",
    price: 215,
    variants: [
      {
        color: "white",
        image: "/Products/m10.webp",
        images: ["/Products/m10.webp"],
        sizes: { available: [], soldOut: [] },
      },
    ],
    isNew: false,
    isFeatured: false,
    isTrending: true,
  },
  {
    id: "m11",
    name: "Nike Air Max DN8",
    slug: "nike-air-max-dn8-m11",
    brand: "Nike",
    gender: "men",
    category: "uncategorized",
    price: 215,
    variants: [
      {
        color: "white",
        image: "/Products/m11.webp",
        images: ["/Products/m11.webp"],
        sizes: { available: [], soldOut: [] },
      },
    ],
    isNew: false,
    isFeatured: false,
    isTrending: true,
  },
  // TODO: verify this unknown model and its original placeholder price.
  {
    id: "m12",
    name: "Asics (unknown model)",
    slug: "asics-unknown-model-m12",
    brand: "ASICS",
    gender: "men",
    category: "uncategorized",
    price: 136,
    variants: [
      {
        color: "white",
        image: "/Products/m12.webp",
        images: ["/Products/m12.webp"],
        sizes: { available: [], soldOut: [] },
      },
    ],
    isNew: false,
    isFeatured: false,
    isTrending: true,
  },
  {
    id: "m13",
    name: "Nike Air Max Tuned 7",
    slug: "nike-air-max-tuned-7-m13",
    brand: "Nike",
    gender: "men",
    category: "uncategorized",
    price: 215,
    variants: [
      {
        color: "white",
        image: "/Products/m13.webp",
        images: ["/Products/m13.webp"],
        sizes: { available: [], soldOut: [] },
      },
    ],
    isNew: false,
    isFeatured: false,
    isTrending: true,
  },
  {
    id: "m14",
    name: "Nike Air Max Dn Roam",
    slug: "nike-air-max-dn-roam-m14",
    brand: "Nike",
    gender: "men",
    category: "uncategorized",
    price: 204,
    variants: [
      {
        color: "white",
        image: "/Products/m14.webp",
        images: ["/Products/m14.webp"],
        sizes: { available: [], soldOut: [] },
      },
    ],
    isNew: false,
    isFeatured: false,
    isTrending: true,
  },
  {
    id: "m15",
    name: "Asics GEL-Kayano 14",
    slug: "asics-gel-kayano-14-m15",
    brand: "ASICS",
    gender: "men",
    category: "uncategorized",
    price: 136,
    variants: [
      {
        color: "white",
        image: "/Products/m15.webp",
        images: ["/Products/m15.webp"],
        sizes: { available: [], soldOut: [] },
      },
    ],
    isNew: false,
    isFeatured: false,
    isTrending: true,
  },
  {
    id: "m16",
    name: "New Balance 740",
    slug: "new-balance-740-m16",
    brand: "New Balance",
    gender: "men",
    category: "uncategorized",
    price: 96,
    variants: [
      {
        color: "white",
        image: "/Products/m16.webp",
        images: ["/Products/m16.webp"],
        sizes: { available: [], soldOut: [] },
      },
    ],
    isNew: false,
    isFeatured: false,
    isTrending: true,
  },
  {
    id: "m17",
    name: "Nike P-6000",
    slug: "nike-p-6000-m17",
    brand: "Nike",
    gender: "men",
    category: "uncategorized",
    price: 96,
    variants: [
      {
        color: "white",
        image: "/Products/m17.webp",
        images: ["/Products/m17.webp"],
        sizes: { available: [], soldOut: [] },
      },
    ],
    isNew: false,
    isFeatured: false,
    isTrending: true,
  },
  {
    id: "m18",
    name: "Salomon XT-6",
    slug: "salomon-xt-6-m18",
    brand: "Salomon",
    gender: "men",
    category: "uncategorized",
    price: 159,
    variants: [
      {
        color: "white",
        image: "/Products/m18.webp",
        images: ["/Products/m18.webp"],
        sizes: { available: [], soldOut: [] },
      },
    ],
    isNew: false,
    isFeatured: false,
    isTrending: true,
  },
  {
    id: "m19",
    name: "Nike Liquid Max",
    slug: "nike-liquid-max-m19",
    brand: "Nike",
    gender: "men",
    category: "uncategorized",
    price: 264,
    variants: [
      {
        color: "white",
        image: "/Products/m19.webp",
        images: ["/Products/m19.webp"],
        sizes: { available: [], soldOut: [] },
      },
    ],
    isNew: false,
    isFeatured: false,
    isTrending: true,
  },
  {
    id: "m20",
    name: "Nike Zoom Vomero Plus",
    slug: "nike-zoom-vomero-plus-m20",
    brand: "Nike",
    gender: "men",
    category: "uncategorized",
    price: 142,
    variants: [
      {
        color: "white",
        image: "/Products/m20.webp",
        images: ["/Products/m20.webp"],
        sizes: { available: [], soldOut: [] },
      },
    ],
    isNew: false,
    isFeatured: false,
    isTrending: true,
  },

  // Men from Foot Locker UK: m21–m36. USD = GBP x 1.323054 (10 Oct 2026), rounded to whole dollars.
  // Sizes are UK sizes listed on each page (a '6 (EU 39)' / '6 (EU 40)' pair is kept as one size 6).
  // Stock below is RANDOM DEMO DATA (seeded), not real availability.
  // Save each photo as public/Products/<id>.webp (source URL in the comment above each row).
  // image: https://assets.footlocker.com/is/image/FLDM/314218566504_01?fmt=webp-alpha&bfc=on&wid=500&hei=500
  {
    id: "m21",
    name: "Nike ACG Pegasus Trail",
    slug: "nike-acg-pegasus-trail-m21",
    brand: "Nike",
    gender: "men",
    category: "outdoor",
    price: 205,
    variants: [
      {
        color: "grey",
        image: "/Products/m21.webp",
        images: ["/Products/m21.webp"],
        sizes: { available: [5.5, 6, 6.5, 7, 7.5, 8.5, 9, 9.5, 10, 10.5, 11, 12], soldOut: [8] },
      },
    ],
    isNew: false,
    isFeatured: false,
  },
  // image: https://assets.footlocker.com/is/image/FLDM/314219087104_01?fmt=webp-alpha&bfc=on&wid=500&hei=500
  {
    id: "m22",
    name: "New Balance Fresh Foam X Hierro v9",
    slug: "new-balance-fresh-foam-x-hierro-v9-m22",
    brand: "New Balance",
    gender: "men",
    category: "outdoor",
    price: 185,
    variants: [
      {
        color: "green",
        image: "/Products/m22.webp",
        images: ["/Products/m22.webp"],
        sizes: { available: [6.5, 7, 9, 9.5, 10.5, 11, 11.5, 12, 12.5], soldOut: [7.5, 8, 8.5, 10, 13.5] },
      },
    ],
    isNew: false,
    isFeatured: false,
  },
  // image: https://assets.footlocker.com/is/image/FLDM/314218801604_01?fmt=webp-alpha&bfc=on&wid=500&hei=500
  {
    id: "m23",
    name: "adidas Adizero Evo SL ATR",
    slug: "adidas-adizero-evo-sl-atr-m23",
    brand: "adidas",
    gender: "men",
    category: "outdoor",
    price: 185,
    variants: [
      {
        color: "green",
        image: "/Products/m23.webp",
        images: ["/Products/m23.webp"],
        sizes: { available: [7.5, 8.5, 11], soldOut: [8, 9, 9.5, 10, 10.5] },
      },
    ],
    isNew: false,
    isFeatured: false,
  },
  // image: https://assets.footlocker.com/is/image/FLDM/314219215804_01?fmt=webp-alpha&bfc=on&wid=500&hei=500
  {
    id: "m24",
    name: "Merrell Agility Peak 6",
    slug: "merrell-agility-peak-6-m24",
    brand: "Merrell",
    gender: "men",
    category: "outdoor",
    price: 192,
    variants: [
      {
        color: "black",
        image: "/Products/m24.webp",
        images: ["/Products/m24.webp"],
        sizes: { available: [6, 6.5, 7, 8, 8.5, 9.5, 10, 11, 13], soldOut: [7.5, 9, 10.5, 11.5] },
      },
    ],
    isNew: false,
    isFeatured: false,
  },
  // image: https://assets.footlocker.com/is/image/FLDM/314218665504_01?fmt=webp-alpha&bfc=on&wid=500&hei=500
  // TODO: sizes are a placeholder range; the Foot Locker page only showed 9, 11 and 11.5.
  {
    id: "m25",
    name: "adidas Terrex Agravic Speed 2 Trail",
    slug: "adidas-terrex-agravic-speed-2-trail-m25",
    brand: "adidas",
    gender: "men",
    category: "outdoor",
    price: 185,
    variants: [
      {
        color: "white",
        image: "/Products/m25.webp",
        images: ["/Products/m25.webp"],
        sizes: { available: [7, 7.5, 8, 8.5, 9, 9.5, 10, 10.5, 11, 11.5, 12], soldOut: [6.5] },
      },
    ],
    isNew: false,
    isFeatured: false,
  },
  // image: https://assets.footlocker.com/is/image/FLDM/314219218204_01?fmt=webp-alpha&bfc=on&wid=500&hei=500
  {
    id: "m26",
    name: "Merrell ProMorph",
    slug: "merrell-promorph-m26",
    brand: "Merrell",
    gender: "men",
    category: "outdoor",
    price: 185,
    variants: [
      {
        color: "brown",
        image: "/Products/m26.webp",
        images: ["/Products/m26.webp"],
        sizes: { available: [6, 6.5, 7, 7.5, 8, 8.5, 9, 10, 11, 11.5], soldOut: [9.5, 10.5] },
      },
    ],
    isNew: false,
    isFeatured: false,
  },
  // image: https://assets.footlocker.com/is/image/FLDM/314218669704_01?fmt=webp-alpha&bfc=on&wid=500&hei=500
  // TODO: sizes are a placeholder range; the Foot Locker page only showed 7.5 and 10.5.
  {
    id: "m27",
    name: "adidas Terrex Free Hiker 2.0 Low GORE-TEX",
    slug: "adidas-terrex-free-hiker-2-0-low-gore-tex-m27",
    brand: "adidas",
    gender: "men",
    category: "outdoor",
    price: 218,
    variants: [
      {
        color: "blue",
        image: "/Products/m27.webp",
        images: ["/Products/m27.webp"],
        sizes: { available: [6.5, 8, 8.5, 9, 10, 10.5, 11, 11.5, 12], soldOut: [7, 7.5, 9.5] },
      },
    ],
    isNew: false,
    isFeatured: false,
  },
  // image: https://assets.footlocker.com/is/image/FLDM/314218291004_01?fmt=webp-alpha&bfc=on&wid=500&hei=500
  // TODO: 'Saucony' is not in data/brands.ts yet (brand page + logo needed).
  {
    id: "m28",
    name: "Saucony Endorphin Azura",
    slug: "saucony-endorphin-azura-m28",
    brand: "Saucony",
    gender: "men",
    category: "running",
    price: 185,
    salePrice: 106,
    variants: [
      {
        color: "green",
        image: "/Products/m28.webp",
        images: ["/Products/m28.webp"],
        sizes: { available: [6, 7, 7.5, 8, 8.5, 9, 10, 12], soldOut: [6.5, 9.5, 11] },
      },
    ],
    isNew: false,
    isFeatured: false,
  },
  // image: https://assets.footlocker.com/is/image/FLDM/314218521004_01?fmt=webp-alpha&bfc=on&wid=500&hei=500
  {
    id: "m29",
    name: "adidas Adizero Boston 13",
    slug: "adidas-adizero-boston-13-m29",
    brand: "adidas",
    gender: "men",
    category: "running",
    price: 185,
    variants: [
      {
        color: "white",
        image: "/Products/m29.webp",
        images: ["/Products/m29.webp"],
        sizes: { available: [6, 6.5, 7, 8, 8.5, 9, 9.5, 10, 11, 11.5, 12, 13, 13.5, 14.5], soldOut: [7.5, 10.5, 12.5] },
      },
    ],
    isNew: false,
    isFeatured: false,
  },
  // image: https://assets.footlocker.com/is/image/FLDM/314218988104_01?fmt=webp-alpha&bfc=on&wid=500&hei=500
  {
    id: "m30",
    name: "adidas Supernova Rise 3",
    slug: "adidas-supernova-rise-3-m30",
    brand: "adidas",
    gender: "men",
    category: "running",
    price: 172,
    variants: [
      {
        color: "grey",
        image: "/Products/m30.webp",
        images: ["/Products/m30.webp"],
        sizes: { available: [6.5, 7, 7.5, 8.5, 9, 9.5, 10, 10.5, 11, 11.5, 12, 12.5], soldOut: [8, 13.5] },
      },
    ],
    isNew: false,
    isFeatured: false,
  },
  // image: https://assets.footlocker.com/is/image/FLDM/314219688604_01?fmt=webp-alpha&bfc=on&wid=500&hei=500
  {
    id: "m31",
    name: "Nike Free Metcon 7",
    slug: "nike-free-metcon-7-m31",
    brand: "Nike",
    gender: "men",
    category: "training",
    price: 146,
    variants: [
      {
        color: "white",
        image: "/Products/m31.webp",
        images: ["/Products/m31.webp"],
        sizes: { available: [6.5, 7, 7.5, 8, 8.5, 9.5, 10, 11, 11.5, 12, 13], soldOut: [5.5, 6, 9, 10.5, 14] },
      },
    ],
    isNew: false,
    isFeatured: false,
  },
  // image: https://assets.footlocker.com/is/image/FLDM/314219681104_01?fmt=webp-alpha&bfc=on&wid=500&hei=500
  {
    id: "m32",
    name: "Nike Metcon 10",
    slug: "nike-metcon-10-m32",
    brand: "Nike",
    gender: "men",
    category: "training",
    price: 159,
    variants: [
      {
        color: "white",
        image: "/Products/m32.webp",
        images: ["/Products/m32.webp"],
        sizes: { available: [5.5, 6, 6.5, 7, 7.5, 8, 8.5, 9, 9.5, 10, 11, 11.5, 12, 14], soldOut: [10.5, 13] },
      },
    ],
    isNew: false,
    isFeatured: false,
  },
  // image: https://assets.footlocker.com/is/image/FLDM/314627018204_01?fmt=webp-alpha&bfc=on&wid=500&hei=500
  {
    id: "m33",
    name: "Birkenstock Arizona",
    slug: "birkenstock-arizona-m33",
    brand: "Birkenstock",
    gender: "men",
    category: "sandals",
    price: 119,
    variants: [
      {
        color: "black",
        image: "/Products/m33.webp",
        images: ["/Products/m33.webp"],
        sizes: { available: [8, 9, 9.5, 10.5], soldOut: [7, 7.5, 11.5] },
      },
    ],
    isNew: false,
    isFeatured: false,
  },
  // image: https://assets.footlocker.com/is/image/FLDM/314627140404_01?fmt=webp-alpha&bfc=on&wid=500&hei=500
  {
    id: "m34",
    name: "Nike Marina Slides",
    slug: "nike-marina-slides-m34",
    brand: "Nike",
    gender: "men",
    category: "sandals",
    price: 33,
    variants: [
      {
        color: "black",
        image: "/Products/m34.webp",
        images: ["/Products/m34.webp"],
        sizes: { available: [5.5, 7], soldOut: [6, 8, 9] },
      },
    ],
    isNew: false,
    isFeatured: false,
  },
  // image: https://assets.footlocker.com/is/image/FLDM/314626980404_01?fmt=webp-alpha&bfc=on&wid=500&hei=500
  {
    id: "m35",
    name: "adidas Adilette Aqua",
    slug: "adidas-adilette-aqua-m35",
    brand: "adidas",
    gender: "men",
    category: "sandals",
    price: 26,
    salePrice: 13,
    variants: [
      {
        color: "blue",
        image: "/Products/m35.webp",
        images: ["/Products/m35.webp"],
        sizes: { available: [6.5, 7.5, 8, 10.5, 11, 11.5], soldOut: [8.5, 9.5, 12.5, 13] },
      },
    ],
    isNew: false,
    isFeatured: false,
  },
  // image: https://assets.footlocker.com/is/image/FLDM/314627108104_01?fmt=webp-alpha&bfc=on&wid=500&hei=500
  {
    id: "m36",
    name: "Nike Calm 2.0",
    slug: "nike-calm-2-0-m36",
    brand: "Nike",
    gender: "men",
    category: "sandals",
    price: 57,
    variants: [
      {
        color: "blue",
        image: "/Products/m36.webp",
        images: ["/Products/m36.webp"],
        sizes: { available: [5.5, 7, 8, 9, 10, 11, 12, 14], soldOut: [6, 13] },
      },
    ],
    isNew: false,
    isFeatured: false,
  },

  // Women: w1–w20
  {
    id: "w1",
    name: "Nike Air Max DN Premium",
    slug: "nike-air-max-dn-premium-w1",
    brand: "Nike",
    gender: "women",
    category: "uncategorized",
    price: 180,
    variants: [
      {
        color: "white",
        image: "/Products/w1.avif",
        images: ["/Products/w1.avif"],
        sizes: { available: [], soldOut: [] },
      },
    ],
    isNew: false,
    isFeatured: false,
    isTrending: true,
  },
  {
    id: "w2",
    name: "Birkenstock Boston Shearling",
    slug: "birkenstock-boston-shearling-w2",
    brand: "Birkenstock",
    gender: "women",
    category: "uncategorized",
    price: 180,
    variants: [
      {
        color: "white",
        image: "/Products/w2.avif",
        images: ["/Products/w2.avif"],
        sizes: { available: [], soldOut: [] },
      },
    ],
    isNew: false,
    isFeatured: false,
    isTrending: true,
  },
  {
    id: "w3",
    name: "Mizuno Wave Sky 9 Wide",
    slug: "mizuno-wave-sky-9-wide-w3",
    brand: "Mizuno",
    gender: "women",
    category: "uncategorized",
    price: 180,
    variants: [
      {
        color: "white",
        image: "/Products/w3.avif",
        images: ["/Products/w3.avif"],
        sizes: { available: [], soldOut: [] },
      },
    ],
    isNew: false,
    isFeatured: false,
    isTrending: true,
  },
  {
    id: "w4",
    name: "Nike Vomero Plus",
    slug: "nike-vomero-plus-w4",
    brand: "Nike",
    gender: "women",
    category: "uncategorized",
    price: 180,
    variants: [
      {
        color: "white",
        image: "/Products/w4.avif",
        images: ["/Products/w4.avif"],
        sizes: { available: [], soldOut: [] },
      },
    ],
    isNew: false,
    isFeatured: false,
    isTrending: true,
  },
  {
    id: "w5",
    name: "Air Jordan Retro 1 Hi RMST",
    slug: "air-jordan-retro-1-hi-rmst-w5",
    brand: "Jordan",
    gender: "women",
    category: "uncategorized",
    price: 185,
    variants: [
      {
        color: "white",
        image: "/Products/w5.avif",
        images: ["/Products/w5.avif"],
        sizes: { available: [], soldOut: [] },
      },
    ],
    isNew: false,
    isFeatured: false,
    isTrending: true,
  },
  {
    id: "w6",
    name: "Nike Air Max 95",
    slug: "nike-air-max-95-w6",
    brand: "Nike",
    gender: "women",
    category: "uncategorized",
    price: 190,
    variants: [
      {
        color: "white",
        image: "/Products/w6.avif",
        images: ["/Products/w6.avif"],
        sizes: { available: [], soldOut: [] },
      },
    ],
    isNew: false,
    isFeatured: false,
    isTrending: true,
  },
  {
    id: "w7",
    name: "Nike Air Max DN8",
    slug: "nike-air-max-dn8-w7",
    brand: "Nike",
    gender: "women",
    category: "uncategorized",
    price: 200,
    variants: [
      {
        color: "white",
        image: "/Products/w7.avif",
        images: ["/Products/w7.avif"],
        sizes: { available: [], soldOut: [] },
      },
    ],
    isNew: false,
    isFeatured: false,
    isTrending: true,
  },
  {
    id: "w8",
    name: "Nike Air Max SNDR GTX",
    slug: "nike-air-max-sndr-gtx-w8",
    brand: "Nike",
    gender: "women",
    category: "uncategorized",
    price: 220,
    variants: [
      {
        color: "white",
        image: "/Products/w8.avif",
        images: ["/Products/w8.avif"],
        sizes: { available: [], soldOut: [] },
      },
    ],
    isNew: false,
    isFeatured: false,
    isTrending: true,
  },
  {
    id: "w9",
    name: "Nike Pegasus Premium",
    slug: "nike-pegasus-premium-w9",
    brand: "Nike",
    gender: "women",
    category: "uncategorized",
    price: 220,
    variants: [
      {
        color: "white",
        image: "/Products/w9.avif",
        images: ["/Products/w9.avif"],
        sizes: { available: [], soldOut: [] },
      },
    ],
    isNew: false,
    isFeatured: false,
    isTrending: true,
  },
  {
    id: "w10",
    name: "UGG Adirondack Boot XXV",
    slug: "ugg-adirondack-boot-xxv-w10",
    brand: "UGG",
    gender: "women",
    category: "uncategorized",
    price: 250,
    variants: [
      {
        color: "white",
        image: "/Products/w10.avif",
        images: ["/Products/w10.avif"],
        sizes: { available: [], soldOut: [] },
      },
    ],
    isNew: false,
    isFeatured: false,
    isTrending: true,
  },
  {
    id: "w11",
    name: "Nike Air VaporMax Plus",
    slug: "nike-air-vapormax-plus-w11",
    brand: "Nike",
    gender: "women",
    category: "uncategorized",
    price: 220,
    variants: [
      {
        color: "white",
        image: "/Products/w11.avif",
        images: ["/Products/w11.avif"],
        sizes: { available: [], soldOut: [] },
      },
    ],
    isNew: false,
    isFeatured: false,
    isTrending: true,
  },
  {
    id: "w12",
    name: "Mizuno Prophecy 14",
    slug: "mizuno-prophecy-14-w12",
    brand: "Mizuno",
    gender: "women",
    category: "uncategorized",
    price: 250,
    variants: [
      {
        color: "white",
        image: "/Products/w12.avif",
        images: ["/Products/w12.avif"],
        sizes: { available: [], soldOut: [] },
      },
    ],
    isNew: false,
    isFeatured: false,
    isTrending: true,
  },
  {
    id: "w13",
    name: "Mizuno Wave Prophecy 15",
    slug: "mizuno-wave-prophecy-15-w13",
    brand: "Mizuno",
    gender: "women",
    category: "uncategorized",
    price: 250,
    variants: [
      {
        color: "white",
        image: "/Products/w13.avif",
        images: ["/Products/w13.avif"],
        sizes: { available: [], soldOut: [] },
      },
    ],
    isNew: false,
    isFeatured: false,
    isTrending: true,
  },
  {
    id: "w14",
    name: "Nike ZoomX Vaporfly Next% 4",
    slug: "nike-zoomx-vaporfly-next-4-w14",
    brand: "Nike",
    gender: "women",
    category: "uncategorized",
    price: 270,
    variants: [
      {
        color: "white",
        image: "/Products/w14.avif",
        images: ["/Products/w14.avif"],
        sizes: { available: [], soldOut: [] },
      },
    ],
    isNew: false,
    isFeatured: false,
    isTrending: true,
  },
  {
    id: "w15",
    name: "UGG Sunburst Tall",
    slug: "ugg-sunburst-tall-w15",
    brand: "UGG",
    gender: "women",
    category: "uncategorized",
    price: 295,
    variants: [
      {
        color: "white",
        image: "/Products/w15.avif",
        images: ["/Products/w15.avif"],
        sizes: { available: [], soldOut: [] },
      },
    ],
    isNew: false,
    isFeatured: false,
    isTrending: true,
  },
  {
    id: "w16",
    name: "Nike Court Legacy Low",
    slug: "nike-court-legacy-low-w16",
    brand: "Nike",
    gender: "women",
    category: "uncategorized",
    price: 75,
    variants: [
      {
        color: "white",
        image: "/Products/w16.avif",
        images: ["/Products/w16.avif"],
        sizes: { available: [], soldOut: [] },
      },
    ],
    isNew: false,
    isFeatured: false,
    isTrending: true,
  },
  {
    id: "w17",
    name: "adidas Originals Handball Spezial",
    slug: "adidas-originals-handball-spezial-w17",
    brand: "adidas",
    gender: "women",
    category: "uncategorized",
    price: 70,
    variants: [
      {
        color: "white",
        image: "/Products/w17.avif",
        images: ["/Products/w17.avif"],
        sizes: { available: [], soldOut: [] },
      },
    ],
    isNew: false,
    isFeatured: false,
    isTrending: true,
  },
  {
    id: "w18",
    name: "Merrell Promorph Opulent",
    slug: "merrell-promorph-opulent-w18",
    brand: "Merrell",
    gender: "women",
    category: "uncategorized",
    price: 170,
    variants: [
      {
        color: "white",
        image: "/Products/w18.avif",
        images: ["/Products/w18.avif"],
        sizes: { available: [], soldOut: [] },
      },
    ],
    isNew: false,
    isFeatured: false,
    isTrending: true,
  },
  {
    id: "w19",
    name: "Nike Zoom Vomero 5",
    slug: "nike-zoom-vomero-5-w19",
    brand: "Nike",
    gender: "women",
    category: "uncategorized",
    price: 170,
    variants: [
      {
        color: "white",
        image: "/Products/w19.avif",
        images: ["/Products/w19.avif"],
        sizes: { available: [], soldOut: [] },
      },
    ],
    isNew: false,
    isFeatured: false,
    isTrending: true,
  },
  {
    id: "w20",
    name: "Puma Speedcat OG",
    slug: "puma-speedcat-og-w20",
    brand: "Puma",
    gender: "women",
    category: "uncategorized",
    price: 100,
    variants: [
      {
        color: "white",
        image: "/Products/w20.avif",
        images: ["/Products/w20.avif"],
        sizes: { available: [], soldOut: [] },
      },
    ],
    isNew: false,
    isFeatured: false,
    isTrending: true,
  },

  // Women from Foot Locker UK: w21–w37 (w23 is now the grey colour of w22).
  // USD = GBP x 1.323054 (10 Oct 2026), rounded to whole dollars. Sizes are UK sizes.
  // Stock below is RANDOM DEMO DATA (seeded), not real availability.
  // Save each photo as public/Products/<imageId>.webp (source URL in the comment above each row).
  // image: https://assets.footlocker.com/is/image/FLDM/315217518802_01?fmt=webp-alpha&bfc=on&wid=500&hei=500
  {
    id: "w21",
    name: "New Balance Fresh Foam X Hierro v9",
    slug: "new-balance-fresh-foam-x-hierro-v9-w21",
    brand: "New Balance",
    gender: "women",
    category: "outdoor",
    price: 185,
    variants: [
      {
        color: "cream",
        image: "/Products/w21.webp",
        images: ["/Products/w21.webp"],
        sizes: { available: [3.5, 4, 4.5, 5.5, 6, 6.5, 7, 8], soldOut: [5, 7.5, 9] },
      },
    ],
    isNew: false,
    isFeatured: false,
  },
  // image: https://assets.footlocker.com/is/image/FLDM/315217866102_01?fmt=webp-alpha&bfc=on&wid=500&hei=500  (green)
  // image: https://assets.footlocker.com/is/image/FLDM/315217340702_01?fmt=webp-alpha&bfc=on&wid=500&hei=500  (grey)
  // TODO: green sizes are a placeholder (same range as grey); the Foot Locker page didn't list them clearly.
  {
    id: "w22",
    name: "adidas Adizero Evo SL ATR",
    slug: "adidas-adizero-evo-sl-atr-w22",
    brand: "adidas",
    gender: "women",
    category: "outdoor",
    price: 185,
    variants: [
      {
        color: "green",
        image: "/Products/w22.webp",
        images: ["/Products/w22.webp"],
        sizes: { available: [6, 6.5, 7.5, 8], soldOut: [4.5, 5.5] },
      },
      {
        color: "grey",
        image: "/Products/w23.webp",
        images: ["/Products/w23.webp"],
        sizes: { available: [5.5, 6.5, 7.5, 8], soldOut: [4.5, 6] },
      },
    ],
    isNew: false,
    isFeatured: false,
  },
  // image: https://assets.footlocker.com/is/image/FLDM/315216755702_01?fmt=webp-alpha&bfc=on&wid=500&hei=500
  {
    id: "w24",
    name: "On Cloudswift Amp",
    slug: "on-cloudswift-amp-w24",
    brand: "On",
    gender: "women",
    category: "running",
    price: 225,
    salePrice: 159,
    variants: [
      {
        color: "cream",
        image: "/Products/w24.webp",
        images: ["/Products/w24.webp"],
        sizes: { available: [4, 6.5, 7, 7.5, 8], soldOut: [4.5, 5, 5.5, 6] },
      },
    ],
    isNew: false,
    isFeatured: false,
  },
  // image: https://assets.footlocker.com/is/image/FLDM/315217864602_01?fmt=webp-alpha&bfc=on&wid=500&hei=500
  {
    id: "w25",
    name: "adidas Adizero Boston 13",
    slug: "adidas-adizero-boston-13-w25",
    brand: "adidas",
    gender: "women",
    category: "running",
    price: 185,
    variants: [
      {
        color: "grey",
        image: "/Products/w25.webp",
        images: ["/Products/w25.webp"],
        sizes: { available: [3.5, 4, 5.5, 6, 7, 7.5, 8, 8.5, 9, 9.5], soldOut: [4.5, 5, 6.5] },
      },
    ],
    isNew: false,
    isFeatured: false,
  },
  // image: https://assets.footlocker.com/is/image/FLDM/315217344902_01?fmt=webp-alpha&bfc=on&wid=500&hei=500
  // TODO: sizes are a placeholder range; the Foot Locker page only showed size 8.
  {
    id: "w26",
    name: "adidas Supernova Rise 3",
    slug: "adidas-supernova-rise-3-w26",
    brand: "adidas",
    gender: "women",
    category: "running",
    price: 172,
    variants: [
      {
        color: "white",
        image: "/Products/w26.webp",
        images: ["/Products/w26.webp"],
        sizes: { available: [4, 5, 5.5, 6.5, 7, 8, 8.5], soldOut: [4.5, 6, 7.5] },
      },
    ],
    isNew: false,
    isFeatured: false,
  },
  // image: https://assets.footlocker.com/is/image/FLDM/315217026202_01?fmt=webp-alpha&bfc=on&wid=500&hei=500
  {
    id: "w27",
    name: "On Cloudzone",
    slug: "on-cloudzone-w27",
    brand: "On",
    gender: "women",
    category: "lifestyle",
    price: 172,
    salePrice: 112,
    variants: [
      {
        color: "brown",
        image: "/Products/w27.webp",
        images: ["/Products/w27.webp"],
        sizes: { available: [4, 4.5, 5, 5.5, 7, 7.5, 8], soldOut: [6, 6.5] },
      },
    ],
    isNew: false,
    isFeatured: false,
  },
  // image: https://assets.footlocker.com/is/image/FLDM/315216327502_01?fmt=webp-alpha&bfc=on&wid=500&hei=500
  {
    id: "w28",
    name: "On Cloudtilt",
    slug: "on-cloudtilt-w28",
    brand: "On",
    gender: "women",
    category: "lifestyle",
    price: 198,
    variants: [
      {
        color: "black",
        image: "/Products/w28.webp",
        images: ["/Products/w28.webp"],
        sizes: { available: [3, 3.5, 4.5, 5, 5.5, 7, 7.5, 8, 8.5], soldOut: [4, 6, 6.5] },
      },
    ],
    isNew: false,
    isFeatured: false,
  },
  // image: https://assets.footlocker.com/is/image/FLDM/315216746602_01?fmt=webp-alpha&bfc=on&wid=500&hei=500
  {
    id: "w29",
    name: "On Cloudmonster Void",
    slug: "on-cloudmonster-void-w29",
    brand: "On",
    gender: "women",
    category: "lifestyle",
    price: 212,
    salePrice: 152,
    variants: [
      {
        color: "black",
        image: "/Products/w29.webp",
        images: ["/Products/w29.webp"],
        sizes: { available: [4.5, 5, 6, 6.5, 7, 7.5, 8], soldOut: [4, 5.5] },
      },
    ],
    isNew: false,
    isFeatured: false,
  },
  // image: https://assets.footlocker.com/is/image/FLDM/315217555002_01?fmt=webp-alpha&bfc=on&wid=500&hei=500
  {
    id: "w30",
    name: "On Cloud 6",
    slug: "on-cloud-6-w30",
    brand: "On",
    gender: "women",
    category: "lifestyle",
    price: 185,
    variants: [
      {
        color: "grey",
        image: "/Products/w30.webp",
        images: ["/Products/w30.webp"],
        sizes: { available: [3, 3.5, 4, 4.5, 5.5, 6, 6.5, 8], soldOut: [5, 7, 7.5, 8.5] },
      },
    ],
    isNew: false,
    isFeatured: false,
  },
  // image: https://assets.footlocker.com/is/image/FLDM/315553050402_01?fmt=webp-alpha&bfc=on&wid=500&hei=500
  {
    id: "w31",
    name: "Nike Marina",
    slug: "nike-marina-w31",
    brand: "Nike",
    gender: "women",
    category: "sandals",
    price: 33,
    variants: [
      {
        color: "black",
        image: "/Products/w31.webp",
        images: ["/Products/w31.webp"],
        sizes: { available: [3.5, 5.5, 6.5, 8.5, 9.5], soldOut: [2.5, 4.5, 7.5] },
      },
    ],
    isNew: false,
    isFeatured: false,
  },
  // image: https://assets.footlocker.com/is/image/FLDM/315552917502_01?fmt=webp-alpha&bfc=on&wid=500&hei=500
  {
    id: "w32",
    name: "Birkenstock Naples Suede",
    slug: "birkenstock-naples-suede-w32",
    brand: "Birkenstock",
    gender: "women",
    category: "sandals",
    price: 205,
    variants: [
      {
        color: "brown",
        image: "/Products/w32.webp",
        images: ["/Products/w32.webp"],
        sizes: { available: [5.5, 7, 7.5], soldOut: [3.5, 4.5, 5] },
      },
    ],
    isNew: false,
    isFeatured: false,
  },
  // image: https://assets.footlocker.com/is/image/FLDM/315553060302_01?fmt=webp-alpha&bfc=on&wid=500&hei=500
  {
    id: "w33",
    name: "Nike Calm 2.0",
    slug: "nike-calm-2-0-w33",
    brand: "Nike",
    gender: "women",
    category: "sandals",
    price: 57,
    variants: [
      {
        color: "pink",
        image: "/Products/w33.webp",
        images: ["/Products/w33.webp"],
        sizes: { available: [2.5, 3.5, 5.5, 6.5, 7.5, 8.5], soldOut: [4.5] },
      },
    ],
    isNew: false,
    isFeatured: false,
  },
  // image: https://assets.footlocker.com/is/image/FLDM/315553048802_01?fmt=webp-alpha&bfc=on&wid=500&hei=500
  {
    id: "w34",
    name: "Nike ReactX Rejuven8",
    slug: "nike-reactx-rejuven8-w34",
    brand: "Nike",
    gender: "women",
    category: "sandals",
    price: 69,
    variants: [
      {
        color: "orange",
        image: "/Products/w34.webp",
        images: ["/Products/w34.webp"],
        sizes: { available: [2.5, 4.5, 6.5, 7.5], soldOut: [3.5, 5.5, 8.5, 9.5] },
      },
    ],
    isNew: false,
    isFeatured: false,
  },
  // image: https://assets.footlocker.com/is/image/FLDM/315217873702_01?fmt=webp-alpha&bfc=on&wid=500&hei=500
  // Category 'sandals' as requested, but this is a training shoe.
  {
    id: "w35",
    name: "adidas Dropset Base",
    slug: "adidas-dropset-base-w35",
    brand: "adidas",
    gender: "women",
    category: "sandals",
    price: 73,
    variants: [
      {
        color: "white",
        image: "/Products/w35.webp",
        images: ["/Products/w35.webp"],
        sizes: { available: [4, 4.5, 5, 5.5, 6, 7.5, 10, 10.5], soldOut: [6.5, 7, 8] },
      },
    ],
    isNew: false,
    isFeatured: false,
  },
  // image: https://assets.footlocker.com/is/image/FLDM/315217391002_01?fmt=webp-alpha&bfc=on&wid=500&hei=500
  // Category 'sandals' as requested, but this is a training shoe.
  {
    id: "w36",
    name: "adidas Dropset 4",
    slug: "adidas-dropset-4-w36",
    brand: "adidas",
    gender: "women",
    category: "sandals",
    price: 146,
    variants: [
      {
        color: "white",
        image: "/Products/w36.webp",
        images: ["/Products/w36.webp"],
        sizes: { available: [3.5, 5, 5.5, 6, 8, 8.5, 9.5, 10, 10.5], soldOut: [4, 4.5, 6.5, 7, 7.5, 9] },
      },
    ],
    isNew: false,
    isFeatured: false,
  },
  // image: https://assets.footlocker.com/is/image/FLDM/315350306502_01?fmt=webp-alpha&bfc=on&wid=500&hei=500
  // Category 'sandals' as requested, but this is a training shoe.
  {
    id: "w37",
    name: "Nike Metcon 10",
    slug: "nike-metcon-10-w37",
    brand: "Nike",
    gender: "women",
    category: "sandals",
    price: 159,
    variants: [
      {
        color: "black",
        image: "/Products/w37.webp",
        images: ["/Products/w37.webp"],
        sizes: { available: [2.5, 3.5, 4, 4.5, 5.5, 6, 6.5, 7, 7.5, 8, 9, 10.5], soldOut: [3, 5, 8.5, 9.5] },
      },
    ],
    isNew: false,
    isFeatured: false,
  },
];

export const mockProducts: Product[] = productData.map(withDefaults);