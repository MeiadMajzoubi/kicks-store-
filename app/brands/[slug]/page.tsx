import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { brands } from "@/data/brands";
import { mockProducts } from "@/data/mockProducts";
import { applyFilters, categoryLabel, categoryNoun, facetOptions, parseFilters } from "@/lib/catalog";
import ProductListing from "../../components/listing/ProductListing";

const findBrand = (slug: string) => brands.find((brand) => brand.slug === slug);

export function generateStaticParams() {
  return brands.map((brand) => ({ slug: brand.slug }));
}

// Only brands in the store have a page; anything else is a 404.
export const dynamicParams = false;

export async function generateMetadata({ params }: PageProps<"/brands/[slug]">): Promise<Metadata> {
  const brand = findBrand((await params).slug);
  if (!brand) return {};
  return {
    title: `${brand.name} Shoes`,
    description: `Shop ${brand.name} shoes for men and women at Red Kicks.`,
  };
}

export default async function BrandPage({ params, searchParams }: PageProps<"/brands/[slug]">) {
  const brand = findBrand((await params).slug);
  if (!brand) notFound();

  const brandProducts = mockProducts.filter((product) => product.brand === brand.name);
  // The page is already one brand, so a brand filter in the URL is ignored.
  const filters = { ...parseFilters(await searchParams), brands: [] };
  const results = applyFilters(brandProducts, filters);

  // "adidas Shoes", "adidas Running Shoes", "adidas Women's Running Shoes".
  const title = `${brand.name} ${
    filters.gender ? categoryLabel(filters.gender, filters.category) : categoryNoun(filters.category)
  }`;

  return (
    <ProductListing
      title={title}
      basePath={`/brands/${brand.slug}`}
      filters={filters}
      results={results}
      facets={facetOptions(brandProducts)}
    />
  );
}
