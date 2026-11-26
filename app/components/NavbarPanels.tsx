import Image from "next/image";
import Link from "next/link";
import { alphabeticalBrands, type StoreBrand } from "@/data/brands";
import { SHOE_CATEGORIES, SHOE_SIZES } from "@/data/navigation";
import type { Gender } from "@/lib/product-types";

/* What the navbar's dropdown shows. The dropdown itself (opening, closing, sliding) stays in Navbar. */

type GenderPanelProps = {
  gender: Gender;
  /** The few brands the menu lists for this gender. */
  brands: StoreBrand[];
  /** Closes the dropdown when a link is picked. */
  onNavigate: () => void;
};

/** Women or Men: shoe types, sizes and the top brands. */
export function GenderPanel({ gender, brands, onNavigate }: GenderPanelProps) {
  return (
    <div className="content-shell py-7 sm:py-9">
      <div className="grid gap-x-10 gap-y-7 md:grid-cols-2 lg:grid-cols-[minmax(180px,0.9fr)_220px_minmax(0,1.8fr)] lg:gap-y-9">
        <section aria-labelledby={`navbar-${gender}-shoes`}>
          <h2
            id={`navbar-${gender}-shoes`}
            className="panel-title"
          >
            Shoes
          </h2>

          <ul className="flex flex-wrap gap-2 lg:block">
            <li>
              <Link
                href={`/${gender}`}
                prefetch={false}
                onClick={onNavigate}
                className="inline-flex h-10 items-center rounded-full border border-foreground px-4 text-sm font-medium transition-colors duration-150 hover:text-brand focus-visible:text-brand motion-reduce:transition-none lg:h-auto lg:min-h-11 lg:rounded-none lg:border-0 lg:px-0 lg:text-[15px]"
              >
                All Shoes
              </Link>
            </li>
            {SHOE_CATEGORIES.map((category) => (
              <li key={category.slug}>
                <Link
                  href={`/${gender}?category=${category.slug}`}
                  prefetch={false}
                  onClick={onNavigate}
                  className="inline-flex h-10 items-center rounded-full border border-border px-4 text-sm leading-snug transition-colors duration-150 hover:text-brand focus-visible:text-brand motion-reduce:transition-none lg:h-auto lg:min-h-11 lg:rounded-none lg:border-0 lg:px-0 lg:text-[15px] lg:text-muted-foreground"
                >
                  {category.name}
                </Link>
              </li>
            ))}
          </ul>
        </section>

        <section aria-labelledby={`navbar-${gender}-sizes`}>
          <h2
            id={`navbar-${gender}-sizes`}
            className="panel-title"
          >
            Shoes by Size
          </h2>

          <ul className="grid w-full grid-cols-5 gap-2 lg:max-w-[220px] lg:grid-cols-3">
            {SHOE_SIZES[gender].map((size) => (
              <li key={size}>
                <Link
                  href={`/${gender}?size=${encodeURIComponent(size)}`}
                  prefetch={false}
                  aria-label={`Browse ${gender}'s shoes in size ${size}`}
                  onClick={onNavigate}
                  className="flex min-h-11 items-center justify-center rounded-lg border border-border bg-background px-2 text-sm font-semibold transition-colors duration-150 hover:border-foreground lg:min-h-12 hover:bg-foreground hover:text-white focus-visible:border-foreground focus-visible:bg-foreground focus-visible:text-white motion-reduce:transition-none"
                >
                  {size}
                </Link>
              </li>
            ))}
          </ul>
        </section>

        <section
          aria-labelledby={`navbar-${gender}-brands`}
          className="md:col-span-2 lg:col-span-1 lg:border-l lg:border-border lg:pl-8"
        >
          <h2
            id={`navbar-${gender}-brands`}
            className="panel-title"
          >
            Brands
          </h2>

          <ul className="grid grid-cols-2 gap-x-5 sm:gap-x-8">
            {brands.map((brand) => (
              <li key={brand.slug}>
                <Link
                  href={`/${gender}?brand=${encodeURIComponent(brand.name)}`}
                  prefetch={false}
                  onClick={onNavigate}
                  className="group flex min-h-12 items-center gap-3 border-b border-border text-muted-foreground transition-colors duration-150 hover:text-brand focus-visible:text-brand motion-reduce:transition-none"
                >
                  <Image
                    src={brand.logo}
                    alt=""
                    width={56}
                    height={28}
                    className="h-7 w-14 shrink-0 object-contain brightness-0"
                  />
                  <span className="text-[13px] font-medium leading-snug sm:text-sm">
                    {brand.name}
                  </span>
                </Link>
              </li>
            ))}

            <li>
              <Link
                href="/brands"
                onClick={onNavigate}
                className="text-link"
              >
                See all brands
              </Link>
            </li>
          </ul>
        </section>
      </div>
    </div>
  );
}

/** Every brand, A–Z, with a link to the Brands page. */
export function BrandsPanel({ onNavigate }: { onNavigate: () => void }) {
  return (
    <div className="content-shell py-7 sm:py-9">
      <div>
        <div className="mb-6 flex items-center justify-between gap-5">
          <h2 className="panel-title mb-0">
            Brands
          </h2>
          <Link
            href="/brands"
            onClick={onNavigate}
            className="text-link"
          >
            See all brands
          </Link>
        </div>

        <ul className="grid grid-cols-2 gap-x-7 sm:grid-cols-3 lg:grid-cols-4 lg:gap-x-10">
          {alphabeticalBrands.map((brand) => (
            <li key={brand.slug}>
              <Link
                href={`/brands/${brand.slug}`}
                prefetch={false}
                onClick={onNavigate}
                className="flex min-h-20 items-center gap-4 border-b border-border text-muted-foreground transition-colors duration-150 hover:text-brand focus-visible:text-brand motion-reduce:transition-none"
              >
                <Image
                  src={brand.logo}
                  alt=""
                  width={88}
                  height={40}
                  className="h-10 w-16 shrink-0 object-contain brightness-0 sm:w-[88px]"
                />
                <span className="text-sm font-medium leading-snug">
                  {brand.name}
                </span>
              </Link>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
