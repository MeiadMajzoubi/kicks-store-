import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
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
      className="mx-auto w-full max-w-[1320px] flex-1 px-5 py-10 outline-none sm:px-8 lg:py-16"
    >
      <header className="mb-10 flex items-end justify-between gap-6 border-b border-neutral-200 pb-7 sm:mb-12">
        <h1 className="text-5xl font-semibold leading-none tracking-[-0.06em] text-neutral-950 sm:text-6xl lg:text-7xl">
          Brands<span className="text-red-600">.</span>
        </h1>

        <span className="shrink-0 pb-1 text-sm text-neutral-500">
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
                className="text-sm font-semibold text-neutral-500"
              >
                {letter}
              </h2>

              <span
                aria-hidden="true"
                className="h-px flex-1 bg-neutral-200"
              />
            </div>

            <ul className="space-y-3">
              {brands.map((brand) => (
                <li key={brand.slug}>
                  <Link
                    href={`/brands/${brand.slug}`}
                    prefetch={false}
                    className="group flex min-h-24 items-center gap-5 rounded-2xl border border-neutral-200/70 bg-neutral-50 px-5 py-4 transition-colors duration-200 hover:border-neutral-300 hover:bg-white focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-red-600 motion-reduce:transition-none"
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

                    <span className="flex-1 text-[15px] font-medium tracking-tight text-neutral-900">
                      {brand.name}
                    </span>

                    <ArrowUpRight
                      aria-hidden="true"
                      strokeWidth={1.5}
                      className="size-5 shrink-0 text-neutral-400 transition-colors duration-200 group-hover:text-red-600 group-focus-visible:text-red-600 motion-reduce:transition-none"
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