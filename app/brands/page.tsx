import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { brandGroups } from "@/data/brands";

export const metadata: Metadata = {
  title: "Brands",
  description: "Explore all footwear brands at Red Kicks.",
};

export default function BrandsPage() {
  const totalBrands = brandGroups.reduce(
    (total, group) => total + group.brands.length,
    0,
  );

  return (
    <main
      id="main-content"
      tabIndex={-1}
      className="content-shell section-space flex-1 outline-none"
    >
      <header className="mb-10 flex items-end justify-between gap-6 border-b border-border pb-7 sm:mb-12">
        <h1 className="page-title">
          Brands<span className="title-mark">.</span>
        </h1>

        <span className="shrink-0 pb-1 text-sm text-muted-foreground">
          {totalBrands} brands / A–Z
        </span>
      </header>

      <div className="grid items-start gap-x-8 gap-y-10 md:grid-cols-2 xl:grid-cols-3 xl:gap-x-10">
        {brandGroups.map(({ letter, brands }) => (
          <section
            key={letter}
            aria-labelledby={`brand-letter-${letter}`}
            className="min-w-0"
          >
            <div className="mb-4 flex items-center gap-3">
              <h2
                id={`brand-letter-${letter}`}
                className="text-sm font-semibold text-muted-foreground"
              >
                {letter}
              </h2>

              <span
                aria-hidden="true"
                className="h-px flex-1 bg-border"
              />
            </div>

            <ul className="space-y-3">
              {brands.map((brand) => (
                <li key={brand.slug}>
                  <Link
                    href={`/brands/${brand.slug}`}
                    prefetch={false}
                    className="group flex min-h-24 items-center gap-5 rounded-2xl border border-transparent bg-surface px-5 py-4 transition-colors duration-200 hover:border-border hover:bg-background motion-reduce:transition-none"
                  >
                    <div className="flex h-12 w-20 shrink-0 items-center justify-center">
                      <Image
                        src={brand.logo}
                        alt=""
                        width={100}
                        height={48}
                        className="h-11 w-full object-contain brightness-0"
                      />
                    </div>

                    <span className="flex-1 text-[15px] font-medium tracking-tight">
                      {brand.name}
                    </span>

                    <ArrowRight
                      aria-hidden="true"
                      strokeWidth={1.5}
                      className="size-5 shrink-0 text-muted-foreground transition-colors duration-200 group-hover:text-brand group-focus-visible:text-brand motion-reduce:transition-none"
                    />
                  </Link>
                </li>
              ))}
            </ul>
          </section>
        ))}
      </div>
    </main>
  );
}