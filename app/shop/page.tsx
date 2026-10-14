import type { Metadata } from "next";
import { mockProducts } from "@/data/mockProducts";
import { applyFilters, categoryLabel, categoryNoun, facetOptions, parseFilters } from "@/lib/catalog";
import ProductListing from "../components/listing/ProductListing";

export const metadata: Metadata = {
  title: "All Shoes",
  description: "Shop every men's and women's shoe at Red Kicks.",
};

const facets = facetOptions(mockProducts);

export default async function ShopPage({ searchParams }: PageProps<"/shop">) {
  const filters = parseFilters(await searchParams);
  const results = applyFilters(mockProducts, filters);

  // "All Shoes", "Running Shoes", "Women's Running Shoes".
  const title = filters.gender
    ? categoryLabel(filters.gender, filters.category)
    : filters.category
      ? categoryNoun(filters.category)
      : "All Shoes";

  return (
    <ProductListing title={title} basePath="/shop" filters={filters} results={results} facets={facets} />
  );
}
