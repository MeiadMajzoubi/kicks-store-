"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { ArrowRight } from "lucide-react";

const categories = [
  {
    name: "Running",
    image: "/category/running.webp",
    width: 1400,
    height: 933,
    href: "/categories/running",
  },
  {
    name: "Training",
    image: "/category/train.png",
    width: 1920,
    height: 1066,
    href: "/categories/training",
  },
  {
    name: "Lifestyle",
    image: "/category/lifestyle.png",
    width: 1824,
    height: 900,
    href: "/categories/lifestyle",
  },
  {
    name: "Outdoor",
    image: "/category/outdoor.webp",
    width: 2540,
    height: 1693,
    href: "/categories/outdoor",
  },
  {
    name: "Sandals",
    image: "/category/sandals.png",
    width: 1367,
    height: 476,
    href: "/categories/sandals",
  },
];

const slides = [...categories, categories[0]];

// Calculated once: enough space for every photo without cropping.
const galleryHeight = Math.max(
  ...categories.map(({ width, height }) => (0.72 * height) / (width * 0.92)),
);

export default function ShopByCategory() {
  const [active, setActive] = useState(0);

  return (
    <section
      id="shop-categories"
      aria-labelledby="shop-category-title"
      className="content-shell section-space border-t border-border"
    >
      <div className="mb-8 sm:mb-10">
        <p className="eyebrow mb-3">Made for your move</p>

        <h2 id="shop-category-title" className="section-title">
          Shop by category
        </h2>

        <p className="mt-3 max-w-lg text-sm text-muted-foreground sm:text-base">
          From city streets to the trail. Find your fit.
        </p>
      </div>

      <div className="grid gap-6 lg:grid-cols-[34%_66%] lg:gap-0">
        <div className="flex flex-wrap gap-2 lg:flex-col lg:items-start lg:justify-center lg:gap-5 lg:pr-8">
          {categories.map((category, index) => (
            <div key={category.name}>
              <button
                type="button"
                onClick={() => setActive(index)}
                aria-pressed={active === index}
                aria-controls="category-images"
                className={`inline-flex min-h-11 items-center rounded-full border px-4 text-sm font-semibold lg:hidden ${
                  active === index
                    ? "border-foreground bg-foreground text-white"
                    : "border-border bg-background"
                }`}
              >
                {category.name}
              </button>

              <Link
                href={category.href}
                onMouseEnter={() => setActive(index)}
                onFocus={() => setActive(index)}
                className={`hidden items-center gap-3 rounded-sm font-semibold leading-tight tracking-[-0.04em] transition-colors duration-300 lg:inline-flex lg:text-[clamp(2rem,3.2vw,3.5rem)] ${
                  active === index
                    ? "text-brand"
                    : "text-foreground hover:text-brand"
                }`}
              >
                <span>{category.name}</span>

                <ArrowRight
                  aria-hidden="true"
                  strokeWidth={1.5}
                  className={`size-8 shrink-0 transition-opacity duration-300 xl:size-10 ${
                    active === index ? "opacity-100" : "opacity-0"
                  }`}
                />
              </Link>
            </div>
          ))}
        </div>

        <div
          id="category-images"
          className="relative min-w-0 overflow-hidden rounded-2xl"
          style={{ paddingTop: `${galleryHeight * 100}%` }}
        >
          {slides.map((category, index) => {
            const isActive = index === active;
            const isNext = index === active + 1;
            const isPrevious = index < active;
            const isFront = isActive || isPrevious;
            const isVisible = isActive || isNext;

            return (
              <Link
                key={`${category.name}-${index}`}
                href={category.href}
                tabIndex={isVisible ? 0 : -1}
                aria-hidden={isVisible ? undefined : true}
                className="absolute overflow-hidden rounded-2xl bg-surface transition-[left,width,top,opacity,box-shadow] duration-1000 ease-[cubic-bezier(0.22,1,0.36,1)] motion-reduce:transition-none focus-visible:outline-offset-[-6px]"
                style={{
                  left: isActive
                    ? "0%"
                    : isNext
                      ? "42%"
                      : isPrevious
                        ? "-80%"
                        : "100%",
                  width: isFront ? "72%" : "58%",
                  top: isFront ? "8%" : "0%",
                  opacity: isVisible ? 1 : 0,
                  zIndex: isActive ? 30 : isNext ? 20 : 10,
                  boxShadow: isActive
                    ? "8px 8px 32px rgba(0,0,0,0.16)"
                    : "none",
                  pointerEvents: isVisible ? "auto" : "none",
                }}
              >
                <Image
                  src={category.image}
                  width={category.width}
                  height={category.height}
                  alt={`${category.name} footwear in action`}
                  sizes="(min-width: 1664px) 760px, (min-width: 1024px) 50vw, 80vw"
                  className="block h-auto w-full"
                />
              </Link>
            );
          })}
        </div>
      </div>

      <div className="mt-4 flex items-center justify-end gap-5">
        <span className="text-xs tabular-nums text-muted-foreground">
          0{active + 1} / 0{categories.length}
        </span>

        <Link href={categories[active].href} className="text-link">
          Shop {categories[active].name.toLowerCase()}
          <ArrowRight aria-hidden="true" className="size-4" />
        </Link>
      </div>
    </section>
  );
}
