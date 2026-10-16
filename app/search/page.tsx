import type { Metadata } from "next";
import Link from "next/link";
import { alphabeticalBrands } from "@/data/brands";
import { mockProducts } from "@/data/mockProducts";
import { CATEGORY_OPTIONS, applyFilters, facetOptions, parseFilters } from "@/lib/catalog";
import { searchProducts } from "@/lib/search";
import ProductListing from "../components/listing/ProductListing";

export async function generateMetadata({ searchParams }: PageProps<"/search">): Promise<Metadata> {
  const q = firstValue((await searchParams).q);
  if (!q) return { title: "Search" };
  const { corrections } = searchProducts(mockProducts, q);
  return { title: `Results for “${correctedQuery(q, corrections)}”` };
}

/**
 * The query as a heading: typos swapped for what we matched, each word capitalised.
 * "nikee air max" → "Nike Air Max".
 */
function correctedQuery(q: string, corrections: Record<string, string>) {
  return q
    .split(/\s+/)
    .map((word) => corrections[word.toLowerCase().replace(/[^a-z0-9]/g, "")] ?? word)
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ");
}

const firstValue = (value: string | string[] | undefined) =>
  (Array.isArray(value) ? value[0] : value)?.trim() ?? "";

// Brands with the most shoes first: the most useful suggestions when nothing matches.
const popularBrands = [...alphabeticalBrands]
  .map((brand) => ({ ...brand, count: mockProducts.filter((product) => product.brand === brand.name).length }))
  .sort((a, b) => b.count - a.count)
  .slice(0, 6);

export default async function SearchPage({ searchParams }: PageProps<"/search">) {
  const params = await searchParams;
  const q = firstValue(params.q);
  const { products: matches, corrections } = searchProducts(mockProducts, q);

  if (!matches.length) return <NoResults query={q} />;

  const filters = parseFilters(params);
  const results = applyFilters(matches, filters);

  return (
    <ProductListing
      title={`Results for “${correctedQuery(q, corrections)}”`}
      basePath="/search"
      baseQuery={`q=${encodeURIComponent(q)}`}
      filters={filters}
      results={results}
      facets={facetOptions(matches)}
    />
  );
}

function NoResults({ query }: { query: string }) {
  const chip =
    "inline-flex min-h-11 items-center rounded-full bg-surface px-5 text-[15px] font-medium transition-colors hover:bg-surface-hover";

  return (
    <main id="main-content" tabIndex={-1} className="content-shell flex-1 pt-10 pb-24 outline-none sm:pt-14">
      <h1 className="section-title">{query ? <>No results for &ldquo;{query}&rdquo;</> : "Search for shoes"}</h1>
      <p className="mt-3 text-[15px] text-muted-foreground">
        {query
          ? "Check the spelling, or try a brand or style below."
          : "Type a brand, model or style in the search bar, or start here."}
      </p>

      <section aria-labelledby="popular-brands" className="mt-10">
        <h2 id="popular-brands" className="panel-title">Popular brands</h2>
        <ul className="flex flex-wrap gap-3">
          {popularBrands.map((brand) => (
            <li key={brand.slug}>
              <Link href={`/brands/${brand.slug}`} className={chip}>
                {brand.name}
              </Link>
            </li>
          ))}
        </ul>
      </section>

      <section aria-labelledby="shop-styles" className="mt-8">
        <h2 id="shop-styles" className="panel-title">Shop by style</h2>
        <ul className="flex flex-wrap gap-3">
          {CATEGORY_OPTIONS.map((category) => (
            <li key={category.value}>
              <Link href={`/shop?category=${category.value}`} className={chip}>
                {category.label}
              </Link>
            </li>
          ))}
          <li>
            <Link href="/shop" className={chip}>
              All shoes
            </Link>
          </li>
        </ul>
      </section>
    </main>
  );
}
