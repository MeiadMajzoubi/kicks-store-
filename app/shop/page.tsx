import type { Metadata } from "next";
import { getProducts } from "@/lib/products";
import { applyFilters, categoryLabel, categoryNoun, facetOptions, parseFilters } from "@/lib/catalog";
import ProductListing from "../components/listing/ProductListing";

export const metadata: Metadata = {
  title: "All Shoes",
  description: "Shop every men's and women's shoe at Red Kicks.",
};

export default async function ShopPage({ searchParams }: PageProps<"/shop">) {
  const products = await getProducts();
  const filters = parseFilters(await searchParams);
  const results = applyFilters(products, filters);

  // "All Shoes", "Running Shoes", "Women's Running Shoes".
  const title = filters.gender
    ? categoryLabel(filters.gender, filters.category)
    : filters.category
      ? categoryNoun(filters.category)
      : "All Shoes";

  return (
    <ProductListing title={title} basePath="/shop" filters={filters} results={results} facets={facetOptions(products)} />
  );
}
