"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { ArrowRight } from "lucide-react";

const categories = [
  {
    name: "Running",
    image: "/brands/running.webp",
    href: "/categories/running",
  },
  {
    name: "Training",
    image: "/brands/train.png",
    href: "/categories/training",
  },
  {
    name: "Lifestyle",
    image: "/brands/lifestyle.png",
    href: "/categories/lifestyle",
  },
  {
    name: "Outdoor",
    image: "/brands/outdoor.webp",
    href: "/categories/outdoor",
  },
  {
    name: "Sandals",
    image: "/brands/sandals.png",
    href: "/categories/sandals",
  },
];

export default function ShopByCategory() {
  const [active, setActive] = useState(0);
  const slides = [...categories, categories[0]];

  return (
    <section
      aria-labelledby="shop-category-title"
      className="mx-auto max-w-[1920px] px-4 py-12 text-black sm:px-8"
    >
      <h2
        id="shop-category-title"
        className="mb-8 text-center text-2xl font-bold sm:text-3xl"
      >
        Shop by Category
      </h2>

      <div className="grid gap-6 lg:grid-cols-[34%_66%] lg:gap-0">
        <div className="flex flex-wrap gap-x-5 gap-y-3 lg:flex-col lg:items-start lg:justify-between lg:gap-0 lg:py-3 lg:pr-6">
          {categories.map((category, index) => (
            <Link
              key={category.name}
              href={category.href}
              onMouseEnter={() => setActive(index)}
              onFocus={() => setActive(index)}
              className={`group inline-flex items-center gap-2 font-bold leading-tight transition-colors duration-300 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-red-600 lg:text-[clamp(2rem,3.2vw,3.5rem)] ${
                active === index
                  ? "text-red-600"
                  : "text-black hover:text-red-600"
              }`}
            >
              <span>{category.name}</span>
              <ArrowRight
                aria-hidden="true"
                className={`size-5 transition-opacity duration-300 lg:size-10 ${
                  active === index
                    ? "opacity-100"
                    : "opacity-0 group-hover:opacity-100 group-focus-visible:opacity-100"
                }`}
              />
            </Link>
          ))}
        </div>

        <div className="relative aspect-[4/3] overflow-hidden sm:aspect-[2/1]">
          {slides.map((category, index) => {
            const isActive = index === active;
            const isNext = index === active + 1;
            const isPrev = index < active;
            const isFront = isActive || isPrev; // کاغذ جلو (فعال یا رفته به چپ)
            const isVisible = isActive || isNext;

            return (
              <Link
                key={`${category.name}-${index}`}
                href={category.href}
                tabIndex={isVisible ? 0 : -1}
                aria-hidden={isVisible ? undefined : true}
                className="absolute overflow-hidden bg-neutral-100 transition-[left,width,top,bottom,opacity,box-shadow] duration-700 ease-[cubic-bezier(0.22,1,0.36,1)] motion-reduce:transition-none"
                style={{
                  left: isActive
                    ? "0%"
                    : isNext
                      ? "42%"
                      : isPrev
                        ? "-80%"
                        : "100%",
                  width: isFront ? "72%" : "58%",
                  // کاغذ جلو پایین‌تره، کاغذ پشت بالاتر
                  top: isFront ? "8%" : "0%",
                  bottom: isFront ? "0%" : "12%",
                  opacity: isVisible ? 1 : 0,
                  zIndex: isActive ? 30 : isNext ? 20 : 10,
                  boxShadow: isActive ? "0 10px 40px rgba(0,0,0,0.3)" : "none",
                  pointerEvents: isVisible ? "auto" : "none",
                }}
              >
                <Image
                  src={category.image}
                  alt={`${category.name} footwear`}
                  fill
                  quality={100}
                  priority={index === 0}
                  sizes="(min-width: 1024px) 50vw, 80vw"
                  className="object-cover"
                />
              </Link>
            );
          })}
        </div>
      </div>
    </section>
  );
}
