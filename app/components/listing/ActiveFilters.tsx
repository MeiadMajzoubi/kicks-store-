import { X } from "lucide-react";
import { PRICE_OPTIONS, type CatalogFilters } from "@/lib/catalog";
import { toggle } from "./toggle";

/** One removable chip per active filter, plus Clear All. */
export default function ActiveFilters({
  filters,
  onChange,
  onClear,
}: {
  filters: CatalogFilters;
  onChange: (next: Partial<CatalogFilters>) => void;
  onClear: () => void;
}) {
  const chips: { key: string; label: string; remove: () => void }[] = [
    ...(filters.gender
      ? [{ key: "gender", label: filters.gender === "men" ? "Men" : "Women", remove: () => onChange({ gender: undefined }) }]
      : []),
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
