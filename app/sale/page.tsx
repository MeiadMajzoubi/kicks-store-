import type { Metadata } from "next";
import { mockProducts } from "@/data/mockProducts";
import { applyFilters, categoryLabel, categoryNoun, facetOptions, parseFilters } from "@/lib/catalog";
import ProductListing from "../components/listing/ProductListing";

export const metadata: Metadata = {
  title: "Sale",
  description: "Shop men's and women's shoes on sale at Red Kicks.",
};

const saleProducts = mockProducts.filter((product) => product.salePrice);
const facets = facetOptions(saleProducts);

export default async function SalePage({ searchParams }: PageProps<"/sale">) {
  // Everything here is on sale (and so never new), so those filters are fixed.
  const filters = { ...parseFilters(await searchParams), sale: false, isNew: false };
  const results = applyFilters(saleProducts, filters);

  // "Shoes on Sale", "Women's Shoes on Sale", "Men's Running Shoes on Sale".
  const base = filters.gender ? categoryLabel(filters.gender, filters.category) : categoryNoun(filters.category);

  return (
    <ProductListing
      title={`${base} on Sale`}
      saleOnly
      basePath="/sale"
      filters={filters}
      results={results}
      facets={facets}
    />
  );
}
