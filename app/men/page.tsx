import type { Metadata } from "next";
import { mockProducts } from "@/data/mockProducts";
import { applyFilters, facetOptions, parseFilters } from "@/lib/catalog";
import ProductListing from "../components/listing/ProductListing";

export const metadata: Metadata = {
  title: "Men's Shoes",
  description: "Shop men's running, training, lifestyle and outdoor shoes and sandals at Red Kicks.",
};

const menProducts = mockProducts.filter((product) => product.gender === "men");
const facets = facetOptions(menProducts);

export default async function MenPage({ searchParams }: PageProps<"/men">) {
  const filters = parseFilters(await searchParams);
  const results = applyFilters(menProducts, filters);

  return (
    <ProductListing
      gender="men"
      basePath="/men"
      filters={filters}
      results={results}
      facets={facets}
    />
  );
}
