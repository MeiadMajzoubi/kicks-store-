import type { Metadata } from "next";
import { getProducts } from "@/lib/products";
import { applyFilters, categoryLabel, facetOptions, parseFilters } from "@/lib/catalog";
import ProductListing from "../components/listing/ProductListing";

export const metadata: Metadata = {
  title: "Men's Shoes",
  description: "Shop men's running, training, lifestyle and outdoor shoes and sandals at Red Kicks.",
};

export default async function MenPage({ searchParams }: PageProps<"/men">) {
  const menProducts = (await getProducts()).filter((product) => product.gender === "men");
  // This page is already one gender, so a gender filter in the URL is ignored.
  const filters = { ...parseFilters(await searchParams), gender: undefined };
  const results = applyFilters(menProducts, filters);

  return (
    <ProductListing
      gender="men"
      title={categoryLabel("men", filters.category)}
      basePath="/men"
      filters={filters}
      results={results}
      facets={facetOptions(menProducts)}
    />
  );
}
