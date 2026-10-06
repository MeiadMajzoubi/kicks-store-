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
  { name: "adidas", slug: "adidas", logo: "/brand-logos/adidas.svg" },
  { name: "ASICS", slug: "asics", logo: "/brand-logos/asics.svg" },
  { name: "On", slug: "on", logo: "/brand-logos/on.svg" },
  { name: "Salomon", slug: "salomon", logo: "/brand-logos/salomon.svg" },
  { name: "UGG", slug: "ugg", logo: "/brand-logos/ugg.svg" },
  { name: "Birkenstock", slug: "birkenstock", logo: "/brand-logos/birkenstock.svg" },
  { name: "Puma", slug: "puma", logo: "/brand-logos/puma.svg" },
  { name: "Vans", slug: "vans", logo: "/brand-logos/vans.svg" },
  { name: "Merrell", slug: "merrell", logo: "/brand-logos/merrell.svg" },
  { name: "Mizuno", slug: "mizuno", logo: "/brand-logos/mizuno.svg" },
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
