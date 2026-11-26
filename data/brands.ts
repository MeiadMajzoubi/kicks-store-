import type { Gender } from "@/lib/product-types";

export type StoreBrand = {
  name: string;
  slug: string;
  logo: string;
};

// The uncrossed brands from your reference, plus Merrell and Mizuno.
// Display order here is for the hover panel, not the alphabetical directory.
export const brands: StoreBrand[] = [
  { name: "Nike", slug: "nike", logo: "/brand-logos/nike.svg" },
  { name: "New Balance", slug: "new-balance", logo: "/brand-logos/new-balance.svg" },
  { name: "Jordan", slug: "jordan", logo: "/brand-logos/jordan.svg" },
  { name: "Adidas", slug: "adidas", logo: "/brand-logos/adidas.svg" },
  { name: "ASICS", slug: "asics", logo: "/brand-logos/asics.svg" },
  { name: "On", slug: "on", logo: "/brand-logos/on.svg" },
  { name: "Salomon", slug: "salomon", logo: "/brand-logos/salomon.svg" },
  { name: "UGG", slug: "ugg", logo: "/brand-logos/ugg.svg" },
  { name: "Birkenstock", slug: "birkenstock", logo: "/brand-logos/birkenstock.svg" },
  { name: "Puma", slug: "puma", logo: "/brand-logos/puma.svg" },
  { name: "Vans", slug: "vans", logo: "/brand-logos/vans.svg" },
  { name: "Merrell", slug: "merrell", logo: "/brand-logos/merrell.svg" },
  { name: "Mizuno", slug: "mizuno", logo: "/brand-logos/mizuno.svg" },
  { name: "Saucony", slug: "saucony", logo: "/brand-logos/saucony.svg" },
];

export const alphabeticalBrands = [...brands].sort((a, b) =>
  a.name.localeCompare(b.name, "en", { sensitivity: "base" }),
);

export const brandGroups = alphabeticalBrands.reduce<
  { letter: string; brands: StoreBrand[] }[]
>((groups, brand) => {
  const letter = brand.name[0].toUpperCase();
  const last = groups[groups.length - 1];
  if (last?.letter === letter) last.brands.push(brand);
  else groups.push({ letter, brands: [brand] });
  return groups;
}, []);

/**
 * Brands that actually have shoes for each gender, A–Z. Worked out from the products,
 * so a brand appears under Men or Women as soon as it has a shoe there.
 */
export function getBrandsByGender(products: readonly { gender: Gender; brand: { name: string } }[]) {
  return Object.fromEntries(
    (["men", "women"] as const).map((gender) => {
      const names = new Set(
        products.filter((product) => product.gender === gender).map((product) => product.brand.name),
      );
      return [gender, alphabeticalBrands.filter((brand) => names.has(brand.name))];
    }),
  ) as Record<Gender, StoreBrand[]>;
}

/**
 * The few brands the Men and Women menus list: the same ones in both, so the two menus match. They are the
 * brands that sell both men's and women's shoes (a link must never open an empty page), taken by most shoes
 * in total (at most `limit`, 5 by default), shown A–Z. The full list is on the Brands page.
 */
export function getTopBrandsByGender(products: readonly { gender: Gender; brand: { name: string } }[], limit = 5) {
  const all = getBrandsByGender(products);
  const counts = new Map<string, number>();
  for (const product of products) counts.set(product.brand.name, (counts.get(product.brand.name) ?? 0) + 1);
  const top = new Set(
    all.men
      .filter((brand) => all.women.some((other) => other.name === brand.name))
      .sort((a, b) => counts.get(b.name)! - counts.get(a.name)! || a.name.localeCompare(b.name))
      .slice(0, limit)
      .map((brand) => brand.name),
  );
  return {
    men: all.men.filter((brand) => top.has(brand.name)),
    women: all.women.filter((brand) => top.has(brand.name)),
  } as Record<Gender, StoreBrand[]>;
}
