import type { Metadata } from "next";
import { mockProducts } from "@/data/mockProducts";
import { applyFilters, categoryLabel, facetOptions, parseFilters } from "@/lib/catalog";
import ProductListing from "../components/listing/ProductListing";

export const metadata: Metadata = {
  title: "Women's Shoes",
  description: "Shop women's running, training, lifestyle and outdoor shoes and sandals at Red Kicks.",
};

const womenProducts = mockProducts.filter((product) => product.gender === "women");
const facets = facetOptions(womenProducts);

export default async function WomenPage({ searchParams }: PageProps<"/women">) {
  // This page is already one gender, so a gender filter in the URL is ignored.
  const filters = { ...parseFilters(await searchParams), gender: undefined };
  const results = applyFilters(womenProducts, filters);

  return (
    <ProductListing
      gender="women"
      title={categoryLabel("women", filters.category)}
      basePath="/women"
      filters={filters}
      results={results}
      facets={facets}
    />
  );
}
