"use client";

import { useEffect, useRef, useState, useTransition, type ReactNode } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Check, ChevronDown, SlidersHorizontal, X } from "lucide-react";
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
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import ListingCard from "./ListingCard";

type Facets = {
  sizes: number[];
  colors: CatalogFilters["colors"];
  brands: string[];
  newCount: number;
  saleCount: number;
};

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
    update({ sizes: [], colors: [], brands: [], prices: [], isNew: false, sale: false });

  const panel = <FilterPanel filters={filters} facets={facets} onChange={update} />;

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
                      href={`${basePath}${filtersToQuery({ ...filters, category: option.value })}`}
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
      <div className="sticky top-0 z-30 bg-background/80 backdrop-blur-xl backdrop-saturate-150">
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
            className="sticky top-16 hidden max-h-[calc(100dvh-5rem)] w-60 shrink-0 self-start overflow-y-auto pr-3 [scrollbar-width:thin] lg:block"
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
              className={`grid grid-cols-2 gap-x-3 gap-y-10 transition-opacity duration-200 sm:gap-x-4 lg:grid-cols-3 ${
                showFilters ? "" : "xl:grid-cols-4"
              } ${isPending ? "opacity-50" : ""}`}
            >
              {results.map((product, index) => (
                <li key={product.id}>
                  <ListingCard product={product} priority={index < 3} />
                </li>
              ))}
            </ul>
          ) : (
            <div className="rounded-lg bg-surface px-6 py-20 text-center">
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
          {panel}
        </FilterSheet>
      )}
    </main>
  );
}

/** Opens from its trigger (transform-origin follows the button), quick and without bounce. */
function SortMenu({ value, onChange }: { value: SortKey; onChange: (value: SortKey) => void }) {
  const current = SORT_OPTIONS.find((option) => option.value === value)?.label;

  return (
    <DropdownMenu>
      <DropdownMenuTrigger className="group/sort inline-flex min-h-11 items-center gap-1.5 text-[15px] font-medium">
        <span className="hidden text-muted-foreground sm:inline">Sort by</span>
        <span>{current}</span>
        <ChevronDown
          aria-hidden="true"
          className="size-4 transition-transform duration-200 group-data-[popup-open]/sort:rotate-180 motion-reduce:transition-none"
          strokeWidth={1.75}
        />
      </DropdownMenuTrigger>
      <DropdownMenuContent
        align="end"
        sideOffset={6}
        className="w-60 rounded-xl p-1.5 shadow-[0_18px_40px_-12px_rgba(0,0,0,0.22)] ring-border duration-150"
      >
        <DropdownMenuRadioGroup value={value} onValueChange={(next) => onChange(next as SortKey)}>
          {SORT_OPTIONS.map((option) => (
            <DropdownMenuRadioItem
              key={option.value}
              value={option.value}
              closeOnClick
              className="min-h-11 rounded-lg px-3 text-[15px] focus:bg-surface data-checked:font-semibold"
            >
              {option.label}
            </DropdownMenuRadioItem>
          ))}
        </DropdownMenuRadioGroup>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

/** One removable chip per active filter, plus Clear All. */
function ActiveFilters({
  filters,
  onChange,
  onClear,
}: {
  filters: CatalogFilters;
  onChange: (next: Partial<CatalogFilters>) => void;
  onClear: () => void;
}) {
  const chips: { key: string; label: string; remove: () => void }[] = [
    ...(filters.isNew ? [{ key: "new", label: "New Arrivals", remove: () => onChange({ isNew: false }) }] : []),
    ...(filters.sale ? [{ key: "sale", label: "Sale", remove: () => onChange({ sale: false }) }] : []),
    ...filters.sizes.map((size) => ({
      key: `size-${size}`,
      label: `UK ${size}`,
      remove: () => onChange({ sizes: toggle(filters.sizes, size) }),
    })),
    ...filters.colors.map((color) => ({
      key: `color-${color}`,
      label: color[0].toUpperCase() + color.slice(1),
      remove: () => onChange({ colors: toggle(filters.colors, color) }),
    })),
    ...filters.prices.map((price) => ({
      key: `price-${price}`,
      label: PRICE_OPTIONS.find((option) => option.value === price)?.label ?? price,
      remove: () => onChange({ prices: toggle(filters.prices, price) }),
    })),
    ...filters.brands.map((brand) => ({
      key: `brand-${brand}`,
      label: brand,
      remove: () => onChange({ brands: toggle(filters.brands, brand) }),
    })),
  ];

  return (
    <div className="mb-5 flex flex-wrap items-center gap-2">
      <ul aria-label="Active filters" className="contents">
        {chips.map((chip) => (
          <li key={chip.key}>
            <button
              type="button"
              onClick={chip.remove}
              aria-label={`Remove filter: ${chip.label}`}
              className="inline-flex min-h-10 items-center gap-2 rounded-[4px] border border-border px-3 text-sm font-medium transition-colors duration-150 hover:border-foreground"
            >
              {chip.label}
              <X aria-hidden="true" className="size-4" strokeWidth={1.75} />
            </button>
          </li>
        ))}
      </ul>
      <button
        type="button"
        onClick={onClear}
        className="ml-2 inline-flex min-h-10 items-center text-sm font-medium underline underline-offset-4 hover:text-brand"
      >
        Clear All
      </button>
    </div>
  );
}

type FilterPanelProps = {
  filters: CatalogFilters;
  facets: Facets;
  onChange: (next: Partial<CatalogFilters>) => void;
};

function FilterPanel({ filters, facets, onChange }: FilterPanelProps) {
  return (
    <div>

      {/* Quick filters: top-level rows, no group to open. One or the other: a shoe is
          never both new and on sale. */}
      <div className="border-b border-border">
        <Checkbox
          label="New Arrivals"
          count={facets.newCount}
          checked={filters.isNew}
          onChange={() => onChange({ isNew: !filters.isNew, sale: false })}
          prominent
        />
      </div>
      <div className="border-b border-border">
        <Checkbox
          label="Sale"
          count={facets.saleCount}
          checked={filters.sale}
          onChange={() => onChange({ sale: !filters.sale, isNew: false })}
          prominent
        />
      </div>

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

type CheckboxProps = {
  label: string;
  checked: boolean;
  onChange: () => void;
  count?: number;
  /** Larger row used for the quick filters at the top. */
  prominent?: boolean;
};

function Checkbox({ label, checked, onChange, count, prominent = false }: CheckboxProps) {
  const empty = count === 0 && !checked;

  return (
    <label
      className={`flex cursor-pointer items-center gap-3 text-[15px] ${
        prominent ? "min-h-14" : "min-h-10"
      } ${empty ? "cursor-not-allowed text-muted-foreground" : ""}`}
    >
      <span className="relative flex shrink-0">
        <input
          type="checkbox"
          checked={checked}
          onChange={onChange}
          disabled={empty}
          className={`peer appearance-none rounded-[4px] border border-foreground/35 bg-background transition-colors duration-150 checked:border-foreground checked:bg-foreground hover:border-foreground disabled:border-border ${
            prominent ? "size-6" : "size-5"
          }`}
        />
        <Check
          aria-hidden="true"
          strokeWidth={2.5}
          className="pointer-events-none absolute inset-0 m-auto hidden size-3.5 text-background peer-checked:block"
        />
      </span>
      <span className={prominent ? "font-semibold" : ""}>
        {label}
        {count !== undefined && (
          <span className="ml-1 font-normal text-muted-foreground tabular-nums">({count})</span>
        )}
      </span>
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
