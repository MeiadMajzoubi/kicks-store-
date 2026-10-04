export type Gender = "men" | "women";

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

export interface MockProduct {
  id: string;
  name: string;
  brand: string;
  gender: Gender;
  image: string;
  price: number; // USD
  color: ProductColor;
}

// Display order. Put related colors next to each other.
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

export function sortByColor(products: MockProduct[]) {
  return [...products].sort(
    (a, b) => COLOR_ORDER.indexOf(a.color) - COLOR_ORDER.indexOf(b.color),
  );
}

// Prices are in USD. Men's prices were converted from EUR/GBP
// (1 EUR = 1.134 USD, 1 GBP = 1.32 USD, ~Sep 30 2026) and rounded to whole dollars.
export const mockProducts: MockProduct[] = [
  // ---------- Men (m1–m20) ----------
  { id: "m1", name: "Jordan Spizike Low", brand: "Jordan", gender: "men", image: "/Products/m1.webp", price: 125, color: "white" },
  { id: "m2", name: 'Jordan Retro 11 "University Blue"', brand: "Jordan", gender: "men", image: "/Products/m2.webp", price: 187, color: "white" },
  { id: "m3", name: "Jordan Triangle", brand: "Jordan", gender: "men", image: "/Products/m3.webp", price: 159, color: "white" },
  { id: "m4", name: "Nike Air Max Tuned 1", brand: "Nike", gender: "men", image: "/Products/m4.webp", price: 159, color: "white" },
  { id: "m5", name: "adidas Adizero Evo SL Exo", brand: "adidas", gender: "men", image: "/Products/m5.webp", price: 170, color: "white" },
  { id: "m6", name: "Nike ReactX Rejuven8", brand: "Nike", gender: "men", image: "/Products/m6.webp", price: 68, color: "white" },
  { id: "m7", name: "Birkenstock Boston", brand: "Birkenstock", gender: "men", image: "/Products/m7.webp", price: 221, color: "white" },
  { id: "m8", name: "Vans Old Skool", brand: "Vans", gender: "men", image: "/Products/m8.webp", price: 62, color: "white" },
  { id: "m9", name: "Puma Caven 2.0", brand: "Puma", gender: "men", image: "/Products/m9.webp", price: 51, color: "white" },
  { id: "m10", name: "On Cloudgeo WP", brand: "On", gender: "men", image: "/Products/m10.webp", price: 215, color: "white" },
  { id: "m11", name: "Nike Air Max DN8", brand: "Nike", gender: "men", image: "/Products/m11.webp", price: 215, color: "white" },
  // TODO: no price screenshot and unknown model (cream/silver Asics) - placeholder price, fill in
  { id: "m12", name: "Asics (unknown model)", brand: "Asics", gender: "men", image: "/Products/m12.webp", price: 136, color: "white" },
  { id: "m13", name: "Nike Air Max Tuned 7", brand: "Nike", gender: "men", image: "/Products/m13.webp", price: 215, color: "white" },
  { id: "m14", name: "Nike Air Max Dn Roam", brand: "Nike", gender: "men", image: "/Products/m14.webp", price: 204, color: "white" },
  { id: "m15", name: "Asics GEL-Kayano 14", brand: "Asics", gender: "men", image: "/Products/m15.webp", price: 136, color: "white" },
  { id: "m16", name: "New Balance 740", brand: "New Balance", gender: "men", image: "/Products/m16.webp", price: 96, color: "white" },
  { id: "m17", name: "Nike P-6000", brand: "Nike", gender: "men", image: "/Products/m17.webp", price: 96, color: "white" },
  { id: "m18", name: "Salomon XT-6", brand: "Salomon", gender: "men", image: "/Products/m18.webp", price: 159, color: "white" },
  { id: "m19", name: "Nike Liquid Max", brand: "Nike", gender: "men", image: "/Products/m19.webp", price: 264, color: "white" },
  { id: "m20", name: "Nike Zoom Vomero Plus", brand: "Nike", gender: "men", image: "/Products/m20.webp", price: 142, color: "white" },

  // ---------- Women (w1–w20) ----------
  { id: "w1", name: "Nike Air Max DN Premium", brand: "Nike", gender: "women", image: "/Products/w1.avif", price: 180, color: "white" },
  { id: "w2", name: "Birkenstock Boston Shearling", brand: "Birkenstock", gender: "women", image: "/Products/w2.avif", price: 180, color: "white" },
  { id: "w3", name: "Mizuno Wave Sky 9 Wide", brand: "Mizuno", gender: "women", image: "/Products/w3.avif", price: 180, color: "white" },
  { id: "w4", name: "Nike Vomero Plus", brand: "Nike", gender: "women", image: "/Products/w4.avif", price: 180, color: "white" },
  { id: "w5", name: "Air Jordan Retro 1 Hi RMST", brand: "Jordan", gender: "women", image: "/Products/w5.avif", price: 185, color: "white" },
  { id: "w6", name: "Nike Air Max 95", brand: "Nike", gender: "women", image: "/Products/w6.avif", price: 190, color: "white" },
  { id: "w7", name: "Nike Air Max DN8", brand: "Nike", gender: "women", image: "/Products/w7.avif", price: 200, color: "white" },
  { id: "w8", name: "Nike Air Max SNDR GTX", brand: "Nike", gender: "women", image: "/Products/w8.avif", price: 220, color: "white" },
  { id: "w9", name: "Nike Pegasus Premium", brand: "Nike", gender: "women", image: "/Products/w9.avif", price: 220, color: "white" },
  { id: "w10", name: "UGG Adirondack Boot XXV", brand: "UGG", gender: "women", image: "/Products/w10.avif", price: 250, color: "white" },
  { id: "w11", name: "Nike Air VaporMax Plus", brand: "Nike", gender: "women", image: "/Products/w11.avif", price: 220, color: "white" },
  { id: "w12", name: "Mizuno Prophecy 14", brand: "Mizuno", gender: "women", image: "/Products/w12.avif", price: 250, color: "white" },
  { id: "w13", name: "Mizuno Wave Prophecy 15", brand: "Mizuno", gender: "women", image: "/Products/w13.avif", price: 250, color: "white" },
  { id: "w14", name: "Nike ZoomX Vaporfly Next% 4", brand: "Nike", gender: "women", image: "/Products/w14.avif", price: 270, color: "white" },
  { id: "w15", name: "UGG Sunburst Tall", brand: "UGG", gender: "women", image: "/Products/w15.avif", price: 295, color: "white" },
  { id: "w16", name: "Nike Court Legacy Low", brand: "Nike", gender: "women", image: "/Products/w16.avif", price: 75, color: "white" },
  { id: "w17", name: "adidas Originals Handball Spezial", brand: "adidas", gender: "women", image: "/Products/w17.avif", price: 70, color: "white" },
  { id: "w18", name: "Merrell Promorph Opulent", brand: "Merrell", gender: "women", image: "/Products/w18.avif", price: 170, color: "white" },
  { id: "w19", name: "Nike Zoom Vomero 5", brand: "Nike", gender: "women", image: "/Products/w19.avif", price: 170, color: "white" },
  { id: "w20", name: "Puma Speedcat OG", brand: "Puma", gender: "women", image: "/Products/w20.avif", price: 100, color: "white" },
];
