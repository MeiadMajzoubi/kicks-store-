"use client";

import { useState, useTransition } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { SlidersHorizontal } from "lucide-react";
import type { Gender } from "@/lib/product-types";
import type { Product } from "@/lib/products";
import { CATEGORY_OPTIONS, countActiveFilters, filtersToQuery, type CatalogFilters, type Facets } from "@/lib/catalog";
import ActiveFilters from "./ActiveFilters";
import EmptyResults from "./EmptyResults";
import FilterPanel from "./FilterPanel";
import FilterSheet from "./FilterSheet";
import ListingCard from "./ListingCard";
import SortMenu from "./SortMenu";


type ProductListingProps = {
  /** Set on the Men and Women pages; left out where both are mixed, like a brand page. */
  gender?: Gender;
  /** Page heading, e.g. "Men's Running Shoes" or "Adidas Shoes". */
  title: string;
  /** The Sale page: every shoe is already on sale, so New Arrivals and Sale rows are hidden. */
  saleOnly?: boolean;
  basePath: string;
  /** Query kept on every link, e.g. "q=nike" on the search page. */
  baseQuery?: string;
  filters: CatalogFilters;
  results: Product[];
  facets: Facets;
  /** Men and Women pages: brands that have shoes for the other gender, for the "try Women" hint. */
  otherGenderBrands?: string[];
};

export default function ProductListing({
  gender,
  title,
  saleOnly = false,
  basePath,
  baseQuery,
  filters,
  results,
  facets,
  otherGenderBrands = [],
}: ProductListingProps) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [showFilters, setShowFilters] = useState(true);
  const [sheetOpen, setSheetOpen] = useState(false);

  const activeCount = countActiveFilters(filters);

  const hrefFor = (next: CatalogFilters) => {
    const query = filtersToQuery(next).slice(1);
    const full = [baseQuery, query].filter(Boolean).join("&");
    return full ? `${basePath}?${full}` : basePath;
  };

  const update = (next: Partial<CatalogFilters>) => {
    startTransition(() => {
      router.push(hrefFor({ ...filters, ...next }), { scroll: false });
    });
  };

  const clearFilters = () =>
    update({ gender: undefined, sizes: [], colors: [], brands: [], prices: [], isNew: false, sale: false });

  const panel = (
    <FilterPanel filters={filters} facets={facets} onChange={update} showGender={!gender} showNewAndSale={!saleOnly} />
  );

  return (
    <main id="main-content" tabIndex={-1} className="flex-1 outline-none">
      <header className="content-shell pt-8 sm:pt-10">
        <h1 className="section-title">
          {title}{" "}
          <span className="font-normal text-muted-foreground tabular-nums">{results.length}</span>
        </h1>

        <div className="mt-4 border-b border-border">
          <nav aria-label="Categories" className="-mb-px min-w-0 overflow-x-auto [scrollbar-width:none]">
            <ul className="flex gap-6 sm:gap-8">
              {[{ value: undefined, label: "All" }, ...CATEGORY_OPTIONS].map((option) => {
                const isActive = filters.category === option.value;
                return (
                  <li key={option.label} className="shrink-0">
                    <Link
                      href={hrefFor({ ...filters, category: option.value })}
                      scroll={false}
                      aria-current={isActive ? "page" : undefined}
                      className={`flex min-h-12 items-center border-b-2 text-[15px] font-medium transition-colors duration-150 ${
                        isActive
                          ? "border-foreground text-foreground"
                          : "border-transparent text-muted-foreground hover:text-foreground"
                      }`}
                    >
                      {option.label}
                    </Link>
                  </li>
                );
              })}
            </ul>
          </nav>
        </div>
      </header>

      {/* Toolbar: a translucent layer the grid scrolls under. */}
      <div className="sticky top-0 z-30 bg-background/80 lg:top-(--header-h) backdrop-blur-xl backdrop-saturate-150">
        <div className="content-shell flex min-h-14 items-center justify-end gap-6">
          <button
            type="button"
            onClick={() => setShowFilters((value) => !value)}
            aria-expanded={showFilters}
            aria-controls="listing-filters"
            className="hidden min-h-11 items-center gap-2 text-[15px] font-medium transition-colors duration-150 hover:text-brand lg:inline-flex"
          >
            <SlidersHorizontal aria-hidden="true" className="size-[18px]" strokeWidth={1.75} />
            {showFilters ? "Hide filters" : "Show filters"}
            {activeCount > 0 && <span className="tabular-nums text-muted-foreground">({activeCount})</span>}
          </button>

          <button
            type="button"
            onClick={() => setSheetOpen(true)}
            aria-haspopup="dialog"
            className="inline-flex min-h-11 items-center gap-2 text-[15px] font-medium lg:hidden"
          >
            <SlidersHorizontal aria-hidden="true" className="size-[18px]" strokeWidth={1.75} />
            Filter
            {activeCount > 0 && <span className="tabular-nums text-muted-foreground">({activeCount})</span>}
          </button>

          <SortMenu value={filters.sort} onChange={(sort) => update({ sort })} />
        </div>
      </div>

      <div className="content-shell flex gap-10 pt-4 pb-20 xl:gap-12">
        {showFilters && (
          <aside
            id="listing-filters"
            aria-label="Filters"
            className="sticky top-(--below-filter-bar) hidden max-h-(--sidebar-max-h) w-60 shrink-0 self-start overflow-y-auto pr-3 [scrollbar-width:thin] lg:block"
          >
            {panel}
          </aside>
        )}

        <section aria-label="Products" aria-busy={isPending} className="grid-reveal min-w-0 flex-1">
          {activeCount > 0 && (
            <ActiveFilters filters={filters} onChange={update} onClear={clearFilters} />
          )}
          {results.length > 0 ? (
            <ul
              // From laptop width: always four cards a row, sharing the full width, so there is no empty
              // strip on the right. The cards get narrower when the filters are open.
              className={`grid w-full grid-cols-2 gap-x-3 gap-y-10 transition-opacity duration-200 sm:gap-x-4 lg:gap-x-8 lg:gap-y-12 lg:grid-cols-4 ${
                isPending ? "opacity-50" : ""
              }`}
            >
              {results.map((product, index) => (
                <li key={product.id}>
                  <ListingCard product={product} priority={index < 3} />
                </li>
              ))}
            </ul>
          ) : (
            <EmptyResults
              gender={gender}
              basePath={basePath}
              filters={filters}
              facets={facets}
              otherGenderBrands={otherGenderBrands}
              onClear={clearFilters}
            />
          )}
        </section>
      </div>

      {sheetOpen && (
        <FilterSheet
          resultCount={results.length}
          activeCount={activeCount}
          onClear={clearFilters}
          onClose={() => setSheetOpen(false)}
        >
          {panel}
        </FilterSheet>
      )}
    </main>
  );
}
