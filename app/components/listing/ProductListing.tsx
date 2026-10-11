"use client";

import { useEffect, useRef, useState, useTransition, type ReactNode } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { ChevronDown, SlidersHorizontal, X } from "lucide-react";
import type { Gender, Product } from "@/data/mockProducts";
import {
  CATEGORY_OPTIONS,
  COLOR_SWATCHES,
  PRICE_OPTIONS,
  SORT_OPTIONS,
  categoryLabel,
  countActiveFilters,
  filtersToQuery,
  type CatalogFilters,
  type SortKey,
} from "@/lib/catalog";
import ListingCard from "./ListingCard";

type Facets = { sizes: number[]; colors: CatalogFilters["colors"]; brands: string[] };

type ProductListingProps = {
  gender: Gender;
  basePath: string;
  filters: CatalogFilters;
  results: Product[];
  facets: Facets;
};

/** Adds the value if missing, removes it if present. */
function toggle<T>(values: T[], value: T) {
  return values.includes(value) ? values.filter((item) => item !== value) : [...values, value];
}

export default function ProductListing({ gender, basePath, filters, results, facets }: ProductListingProps) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [showFilters, setShowFilters] = useState(true);
  const [sheetOpen, setSheetOpen] = useState(false);

  const title = categoryLabel(gender, filters.category);
  const activeCount = countActiveFilters(filters);

  const update = (next: Partial<CatalogFilters>) => {
    startTransition(() => {
      router.push(`${basePath}${filtersToQuery({ ...filters, ...next })}`, { scroll: false });
    });
  };

  const clearFilters = () =>
    update({ sizes: [], colors: [], brands: [], prices: [], sale: false });

  const panel = (
    <FilterPanel
      basePath={basePath}
      filters={filters}
      facets={facets}
      onChange={update}
    />
  );

  return (
    <main id="main-content" tabIndex={-1} className="flex-1 outline-none">
      {/* Toolbar: stays visible while the grid scrolls. */}
      <div className="sticky top-0 z-30 border-b border-border bg-background">
        <div className="content-shell flex min-h-16 items-center justify-between gap-4 py-3">
          <h1 className="text-xl font-semibold tracking-[-0.03em] sm:text-2xl">
            {title}{" "}
            <span className="font-normal text-muted-foreground tabular-nums">({results.length})</span>
          </h1>

          <div className="flex items-center gap-1 sm:gap-4">
            <button
              type="button"
              onClick={() => setShowFilters((value) => !value)}
              aria-expanded={showFilters}
              aria-controls="listing-filters"
              className="hidden min-h-11 items-center gap-2 text-[15px] font-medium transition-colors duration-150 hover:text-brand lg:inline-flex"
            >
              {showFilters ? "Hide Filters" : "Show Filters"}
              <SlidersHorizontal aria-hidden="true" className="size-5" strokeWidth={1.75} />
            </button>

            <button
              type="button"
              onClick={() => setSheetOpen(true)}
              aria-haspopup="dialog"
              className="inline-flex min-h-11 items-center gap-2 rounded-full border border-border px-4 text-sm font-medium lg:hidden"
            >
              Filter
              {activeCount > 0 && <span className="tabular-nums text-muted-foreground">({activeCount})</span>}
              <SlidersHorizontal aria-hidden="true" className="size-4" strokeWidth={1.75} />
            </button>

            <SortSelect value={filters.sort} onChange={(sort) => update({ sort })} />
          </div>
        </div>
      </div>

      <div className="content-shell flex gap-10 pt-6 pb-16">
        {showFilters && (
          <aside
            id="listing-filters"
            aria-label="Filters"
            className="sticky top-24 hidden max-h-[calc(100dvh-7rem)] w-60 shrink-0 self-start overflow-y-auto pr-3 [scrollbar-width:thin] lg:block"
          >
            {panel}
            {activeCount > 0 && (
              <button type="button" onClick={clearFilters} className="text-link mt-4">
                Clear filters ({activeCount})
              </button>
            )}
          </aside>
        )}

        <section aria-label="Products" aria-busy={isPending} className="min-w-0 flex-1">
          {results.length > 0 ? (
            <ul
              className={`grid grid-cols-2 gap-x-2 gap-y-2 transition-opacity duration-200 sm:gap-x-4 lg:grid-cols-3 ${
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
            <div className="rounded-2xl bg-surface px-6 py-16 text-center">
              <p className="text-lg font-semibold">No shoes match these filters</p>
              <p className="mt-1 text-sm text-muted-foreground">Remove a filter to see more styles.</p>
              {activeCount > 0 && (
                <button
                  type="button"
                  onClick={clearFilters}
                  className="mt-6 inline-flex min-h-11 items-center rounded-full bg-foreground px-6 text-sm font-medium text-background"
                >
                  Clear filters
                </button>
              )}
            </div>
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
          <div className="mb-6 border-b border-border pb-6">
            <h2 className="panel-title">Sort By</h2>
            <div className="space-y-1">
              {SORT_OPTIONS.map((option) => (
                <label key={option.value} className="flex min-h-11 cursor-pointer items-center gap-3 text-[15px]">
                  <input
                    type="radio"
                    name="sort-mobile"
                    checked={filters.sort === option.value}
                    onChange={() => update({ sort: option.value })}
                    className="size-4 accent-foreground"
                  />
                  {option.label}
                </label>
              ))}
            </div>
          </div>
          {panel}
        </FilterSheet>
      )}
    </main>
  );
}

function SortSelect({ value, onChange }: { value: SortKey; onChange: (value: SortKey) => void }) {
  return (
    <label className="relative hidden min-h-11 items-center gap-1 text-[15px] font-medium sm:inline-flex">
      <span className="text-muted-foreground">Sort By</span>
      <select
        value={value}
        onChange={(event) => onChange(event.target.value as SortKey)}
        className="cursor-pointer appearance-none bg-transparent py-2 pr-6 pl-1 font-medium outline-none"
      >
        {SORT_OPTIONS.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
      <ChevronDown aria-hidden="true" className="pointer-events-none absolute right-0 size-4" strokeWidth={1.75} />
    </label>
  );
}

type FilterPanelProps = {
  basePath: string;
  filters: CatalogFilters;
  facets: Facets;
  onChange: (next: Partial<CatalogFilters>) => void;
};

function FilterPanel({ basePath, filters, facets, onChange }: FilterPanelProps) {
  return (
    <div>
      <nav aria-label="Categories" className="border-b border-border pb-5">
        <ul>
          {[{ value: undefined, label: "All Shoes" }, ...CATEGORY_OPTIONS].map((option) => {
            const isActive = filters.category === option.value;
            return (
              <li key={option.label}>
                <Link
                  href={`${basePath}${filtersToQuery({ ...filters, category: option.value })}`}
                  scroll={false}
                  aria-current={isActive ? "page" : undefined}
                  className={`inline-flex min-h-10 items-center text-[15px] transition-colors duration-150 hover:text-brand ${
                    isActive ? "font-semibold text-foreground" : "font-medium"
                  }`}
                >
                  {option.label}
                </Link>
              </li>
            );
          })}
        </ul>
      </nav>

      <FilterGroup title="Sale & Offers" count={filters.sale ? 1 : 0}>
        <Checkbox label="Sale" checked={filters.sale} onChange={() => onChange({ sale: !filters.sale })} />
      </FilterGroup>

      <FilterGroup title="Size (UK)" count={filters.sizes.length}>
        <ul className="grid grid-cols-3 gap-2">
          {facets.sizes.map((size) => {
            const selected = filters.sizes.includes(size);
            return (
              <li key={size}>
                <button
                  type="button"
                  aria-pressed={selected}
                  aria-label={`UK ${size}`}
                  onClick={() => onChange({ sizes: toggle(filters.sizes, size) })}
                  className={`flex min-h-11 w-full items-center justify-center rounded-lg border text-sm font-medium tabular-nums transition-colors duration-150 ${
                    selected
                      ? "border-foreground bg-foreground text-background"
                      : "border-border hover:border-foreground"
                  }`}
                >
                  {size}
                </button>
              </li>
            );
          })}
        </ul>
      </FilterGroup>

      <FilterGroup title="Colour" count={filters.colors.length}>
        <ul className="grid grid-cols-3 gap-x-2 gap-y-4">
          {facets.colors.map((color) => {
            const selected = filters.colors.includes(color);
            return (
              <li key={color}>
                <button
                  type="button"
                  aria-pressed={selected}
                  onClick={() => onChange({ colors: toggle(filters.colors, color) })}
                  className="group/swatch flex w-full flex-col items-center gap-1.5 text-xs capitalize"
                >
                  <span
                    aria-hidden="true"
                    style={{ background: COLOR_SWATCHES[color] }}
                    className={`size-7 rounded-full border border-black/15 ring-offset-2 transition-shadow duration-150 group-hover/swatch:ring-1 group-hover/swatch:ring-muted-foreground ${
                      selected ? "ring-2! ring-foreground!" : ""
                    }`}
                  />
                  <span className={selected ? "font-semibold" : ""}>{color}</span>
                </button>
              </li>
            );
          })}
        </ul>
      </FilterGroup>

      <FilterGroup title="Shop by Price" count={filters.prices.length}>
        {PRICE_OPTIONS.map((option) => (
          <Checkbox
            key={option.value}
            label={option.label}
            checked={filters.prices.includes(option.value)}
            onChange={() => onChange({ prices: toggle(filters.prices, option.value) })}
          />
        ))}
      </FilterGroup>

      <FilterGroup title="Brand" count={filters.brands.length}>
        {facets.brands.map((brand) => (
          <Checkbox
            key={brand}
            label={brand}
            checked={filters.brands.includes(brand)}
            onChange={() => onChange({ brands: toggle(filters.brands, brand) })}
          />
        ))}
      </FilterGroup>
    </div>
  );
}

function FilterGroup({ title, count, children }: { title: string; count: number; children: ReactNode }) {
  return (
    <details open className="group/filter border-b border-border">
      <summary className="flex min-h-14 cursor-pointer list-none items-center justify-between gap-3 text-[15px] font-medium [&::-webkit-details-marker]:hidden">
        <span>
          {title}
          {count > 0 && <span className="ml-1 text-muted-foreground tabular-nums">({count})</span>}
        </span>
        <ChevronDown
          aria-hidden="true"
          className="size-5 transition-transform duration-200 group-open/filter:rotate-180 motion-reduce:transition-none"
          strokeWidth={1.5}
        />
      </summary>
      <div className="pb-5">{children}</div>
    </details>
  );
}

function Checkbox({ label, checked, onChange }: { label: string; checked: boolean; onChange: () => void }) {
  return (
    <label className="flex min-h-10 cursor-pointer items-center gap-3 text-[15px]">
      <input type="checkbox" checked={checked} onChange={onChange} className="size-4 shrink-0 accent-foreground" />
      {label}
    </label>
  );
}

type FilterSheetProps = {
  resultCount: number;
  activeCount: number;
  onClear: () => void;
  onClose: () => void;
  children: ReactNode;
};

/** Full-screen filter panel for phones and tablets. */
function FilterSheet({ resultCount, activeCount, onClear, onClose, children }: FilterSheetProps) {
  const dialogRef = useRef<HTMLDivElement>(null);
  const closeRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    const opener = document.activeElement as HTMLElement | null;
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    closeRef.current?.focus();

    return () => {
      document.body.style.overflow = previousOverflow;
      opener?.focus();
    };
  }, []);

  const handleKeyDown = (event: React.KeyboardEvent<HTMLDivElement>) => {
    if (event.key === "Escape") {
      event.preventDefault();
      onClose();
      return;
    }
    if (event.key !== "Tab" || !dialogRef.current) return;

    const focusable = dialogRef.current.querySelectorAll<HTMLElement>(
      'a[href], button:not([disabled]), input:not([disabled]), summary',
    );
    const first = focusable[0];
    const last = focusable[focusable.length - 1];
    if (event.shiftKey && document.activeElement === first) {
      event.preventDefault();
      last.focus();
    } else if (!event.shiftKey && document.activeElement === last) {
      event.preventDefault();
      first.focus();
    }
  };

  return (
    <div
      ref={dialogRef}
      role="dialog"
      aria-modal="true"
      aria-labelledby="filter-sheet-title"
      onKeyDown={handleKeyDown}
      className="fixed inset-0 z-[100] flex flex-col bg-background animate-in fade-in slide-in-from-bottom-4 duration-200 motion-reduce:animate-none lg:hidden"
    >
      <div className="flex min-h-16 items-center justify-between border-b border-border px-4">
        <h2 id="filter-sheet-title" className="text-lg font-semibold">Filter</h2>
        <button
          ref={closeRef}
          type="button"
          onClick={onClose}
          aria-label="Close filters"
          className="flex size-11 items-center justify-center rounded-full bg-surface"
        >
          <X aria-hidden="true" className="size-5" strokeWidth={1.75} />
        </button>
      </div>

      <div className="flex-1 overflow-y-auto px-4 py-5">{children}</div>

      <div className="grid grid-cols-2 gap-3 border-t border-border p-4">
        <button
          type="button"
          onClick={onClear}
          disabled={activeCount === 0}
          className="min-h-12 rounded-full border border-border text-[15px] font-medium disabled:text-muted-foreground"
        >
          Clear{activeCount > 0 ? ` (${activeCount})` : ""}
        </button>
        <button
          type="button"
          onClick={onClose}
          className="min-h-12 rounded-full bg-foreground text-[15px] font-medium text-background"
        >
          Show {resultCount} {resultCount === 1 ? "result" : "results"}
        </button>
      </div>
    </div>
  );
}
