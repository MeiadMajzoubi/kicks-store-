import type { ReactNode } from "react";
import { Check, ChevronDown } from "lucide-react";
import { COLOR_SWATCHES, PRICE_OPTIONS, type CatalogFilters, type Facets } from "@/lib/catalog";
import { toggle } from "./toggle";

type FilterPanelProps = {
  filters: CatalogFilters;
  facets: Facets;
  onChange: (next: Partial<CatalogFilters>) => void;
  /** Men/Women rows, for pages that mix both. */
  showGender: boolean;
  showNewAndSale: boolean;
};

export default function FilterPanel({ filters, facets, onChange, showGender, showNewAndSale }: FilterPanelProps) {
  return (
    <div>
      {showGender &&
        (["men", "women"] as const).map((option) => (
          <div key={option} className="border-b border-border">
            <Checkbox
              label={option === "men" ? "Men" : "Women"}
              count={option === "men" ? facets.menCount : facets.womenCount}
              checked={filters.gender === option}
              onChange={() => onChange({ gender: filters.gender === option ? undefined : option })}
              prominent
            />
          </div>
        ))}

      {/* Quick filters: top-level rows, no group to open. One or the other: a shoe is
          never both new and on sale. */}
      {showNewAndSale && (
        <>
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
        </>
      )}

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

      {facets.brands.length > 1 && (
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
      )}
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
