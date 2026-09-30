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

export const mockProducts: MockProduct[] = [
  // ---------- Men (m1–m20) ----------
  { id: "m1", name: "Jordan Spizike Low", brand: "Jordan", gender: "men", image: "/products/m1.webp", price: 0, color: "white" },
  { id: "m2", name: 'Jordan Retro 11 "University Blue"', brand: "Jordan", gender: "men", image: "/products/m2.webp", price: 0, color: "white" },
  { id: "m3", name: "Jordan Triangle", brand: "Jordan", gender: "men", image: "/products/m3.webp", price: 0, color: "white" },
  { id: "m4", name: "Nike Air Max Tuned 1", brand: "Nike", gender: "men", image: "/products/m4.webp", price: 0, color: "white" },
  { id: "m5", name: "adidas Adizero Evo SL Exo", brand: "adidas", gender: "men", image: "/products/m5.webp", price: 0, color: "white" },
  { id: "m6", name: "Nike ReactX Rejuven8", brand: "Nike", gender: "men", image: "/products/m6.webp", price: 0, color: "white" },
  { id: "m7", name: "Birkenstock Boston", brand: "Birkenstock", gender: "men", image: "/products/m7.webp", price: 0, color: "white" },
  { id: "m8", name: "Vans Old Skool", brand: "Vans", gender: "men", image: "/products/m8.webp", price: 0, color: "white" },
  { id: "m9", name: "Puma Caven 2.0", brand: "Puma", gender: "men", image: "/products/m9.webp", price: 0, color: "white" },
  { id: "m10", name: "On Cloudgeo WP", brand: "On", gender: "men", image: "/products/m10.webp", price: 0, color: "white" },
  { id: "m11", name: "Nike Air Max DN8", brand: "Nike", gender: "men", image: "/products/m11.webp", price: 0, color: "white" },
  // TODO: fill in the model name (cream/silver Asics)
  { id: "m12", name: "Asics (unknown model)", brand: "Asics", gender: "men", image: "/products/m12.webp", price: 0, color: "white" },
  { id: "m13", name: "Nike Air Max Tuned 7", brand: "Nike", gender: "men", image: "/products/m13.webp", price: 0, color: "white" },
  { id: "m14", name: "Nike Air Max Dn Roam", brand: "Nike", gender: "men", image: "/products/m14.webp", price: 0, color: "white" },
  { id: "m15", name: "Asics GEL-Kayano 14", brand: "Asics", gender: "men", image: "/products/m15.webp", price: 0, color: "white" },
  { id: "m16", name: "New Balance 740", brand: "New Balance", gender: "men", image: "/products/m16.webp", price: 0, color: "white" },
  { id: "m17", name: "Nike P-6000", brand: "Nike", gender: "men", image: "/products/m17.webp", price: 0, color: "white" },
  { id: "m18", name: "Salomon XT-6", brand: "Salomon", gender: "men", image: "/products/m18.webp", price: 0, color: "white" },
  { id: "m19", name: "Nike Liquid Max", brand: "Nike", gender: "men", image: "/products/m19.webp", price: 0, color: "white" },
  { id: "m20", name: "Nike Zoom Vomero Plus", brand: "Nike", gender: "men", image: "/products/m20.webp", price: 0, color: "white" },

  // ---------- Women (w1–w20) ----------
  { id: "w1", name: "Nike Air Max DN Premium", brand: "Nike", gender: "women", image: "/products/w1.avif", price: 0, color: "white" },
  { id: "w2", name: "Birkenstock Boston Shearling", brand: "Birkenstock", gender: "women", image: "/products/w2.avif", price: 0, color: "white" },
  { id: "w3", name: "Mizuno Wave Sky 9 Wide", brand: "Mizuno", gender: "women", image: "/products/w3.avif", price: 0, color: "white" },
  { id: "w4", name: "Nike Vomero Plus", brand: "Nike", gender: "women", image: "/products/w4.avif", price: 0, color: "white" },
  { id: "w5", name: "Air Jordan Retro 1 Hi RMST", brand: "Jordan", gender: "women", image: "/products/w5.avif", price: 0, color: "white" },
  { id: "w6", name: "Nike Air Max 95", brand: "Nike", gender: "women", image: "/products/w6.avif", price: 0, color: "white" },
  { id: "w7", name: "Nike Air Max DN8", brand: "Nike", gender: "women", image: "/products/w7.avif", price: 0, color: "white" },
  { id: "w8", name: "Nike Air Max SNDR GTX", brand: "Nike", gender: "women", image: "/products/w8.avif", price: 0, color: "white" },
  { id: "w9", name: "Nike Pegasus Premium", brand: "Nike", gender: "women", image: "/products/w9.avif", price: 0, color: "white" },
  { id: "w10", name: "UGG Adirondack Boot XXV", brand: "UGG", gender: "women", image: "/products/w10.avif", price: 0, color: "white" },
  { id: "w11", name: "Nike Air VaporMax Plus", brand: "Nike", gender: "women", image: "/products/w11.avif", price: 0, color: "white" },
  { id: "w12", name: "Mizuno Prophecy 14", brand: "Mizuno", gender: "women", image: "/products/w12.avif", price: 0, color: "white" },
  { id: "w13", name: "Mizuno Wave Prophecy 15", brand: "Mizuno", gender: "women", image: "/products/w13.avif", price: 0, color: "white" },
  { id: "w14", name: "Nike ZoomX Vaporfly Next% 4", brand: "Nike", gender: "women", image: "/products/w14.avif", price: 0, color: "white" },
  { id: "w15", name: "UGG Sunburst Tall", brand: "UGG", gender: "women", image: "/products/w15.avif", price: 0, color: "white" },
  { id: "w16", name: "Nike Court Legacy Low", brand: "Nike", gender: "women", image: "/products/w16.avif", price: 0, color: "white" },
  { id: "w17", name: "adidas Originals Handball Spezial", brand: "adidas", gender: "women", image: "/products/w17.avif", price: 0, color: "white" },
  { id: "w18", name: "Merrell Promorph Opulent", brand: "Merrell", gender: "women", image: "/products/w18.avif", price: 0, color: "white" },
  { id: "w19", name: "Nike Zoom Vomero 5", brand: "Nike", gender: "women", image: "/products/w19.avif", price: 0, color: "white" },
  { id: "w20", name: "Puma Speedcat OG", brand: "Puma", gender: "women", image: "/products/w20.avif", price: 0, color: "white" },
];