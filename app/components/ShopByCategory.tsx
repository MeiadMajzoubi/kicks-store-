"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { ArrowRight } from "lucide-react";

// One wide crop for every photo (3:2), so the stack never changes size between categories.
const categories = [
  { name: "Running", image: "/categories/running-road.webp", href: "/shop?category=running" },
  { name: "Training", image: "/categories/training-gym.webp", href: "/shop?category=training" },
  { name: "Lifestyle", image: "/categories/lifestyle-street.webp", href: "/shop?category=lifestyle" },
  { name: "Outdoor", image: "/categories/outdoor-mountain.webp", href: "/shop?category=outdoor" },
  { name: "Sandals", image: "/categories/sandals-clogs.webp", href: "/shop?category=sandals" },
];

const slides = [...categories, categories[0]];

export default function ShopByCategory() {
  const [active, setActive] = useState(0);

  return (
    <section
      id="shop-categories"
      aria-labelledby="shop-category-title"
      className="content-shell section-space border-t border-border"
    >
      <div className="mb-8 sm:mb-10">
        <h2 id="shop-category-title" className="section-title">
          Shop by category
        </h2>

        <p className="section-intro">
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
                className={`hidden items-center gap-3 rounded-sm font-semibold leading-tight tracking-[-0.04em] transition-colors duration-300 lg:inline-flex lg:text-[clamp(1.75rem,2.7vw,2.625rem)] ${
                  active === index
                    ? "text-brand"
                    : "text-foreground hover:text-brand"
                }`}
              >
                <span>{category.name}</span>

                <ArrowRight
                  aria-hidden="true"
                  strokeWidth={1.5}
                  className={`size-7 shrink-0 transition-opacity duration-300 xl:size-8 ${
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
          // Front card: 72% wide at 3:2 (48% tall), dropped 8% of the box.
          style={{ paddingTop: "52.2%" }}
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
                <div className="relative aspect-[3/2]">
                  <Image
                    src={category.image}
                    fill
                    alt={`Shop ${category.name}`}
                    sizes="(min-width: 1664px) 760px, (min-width: 1024px) 50vw, 80vw"
                    className="object-cover"
                  />
                </div>
              </Link>
            );
          })}
        </div>
      </div>

    </section>
  );
}
