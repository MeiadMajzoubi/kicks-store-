"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";

import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
  type CarouselApi,
} from "@/components/ui/carousel";

const brands = [
  { name: "Nike", image: "/brands/Nike.jpeg", href: "/brands/nike" },
  { name: "Adidas", image: "/brands/Adidas.jpeg", href: "/brands/adidas" },
  { name: "ASICS", image: "/brands/Asics.jpeg", href: "/brands/asics" },
  { name: "On", image: "/brands/On.jpeg", href: "/brands/on" },
  { name: "New Balance", image: "/brands/NB.jpeg", href: "/brands/new-balance" },
  {
    name: "Birkenstock",
    image: "/brands/Birkenstock.jpeg",
    href: "/brands/Birkenstock",
  },
];

export default function ShopByBrands() {
  const [api, setApi] = useState<CarouselApi>();
  const [current, setCurrent] = useState(0);
  const [count, setCount] = useState(0);

  useEffect(() => {
    if (!api) return;

    const update = () => {
      setCurrent(api.selectedScrollSnap());
      setCount(api.scrollSnapList().length);
    };

    update();
    api.on("select", update);
    api.on("reInit", update);

    return () => {
      api.off("select", update);
      api.off("reInit", update);
    };
  }, [api]);

  return (
    <section
      aria-labelledby="shop-brands-title"
      className="mx-auto max-w-[1920px] px-4 py-12 text-black sm:px-8"
    >
      <h2
        id="shop-brands-title"
        className="mb-7 text-center text-2xl font-bold sm:text-3xl"
      >
        Shop Top Brands
      </h2>

      <Carousel
        setApi={setApi}
        opts={{ align: "start" }}
        aria-label="Shop top brands"
        className="w-full"
      >
        <CarouselContent className="-ml-4">
          {brands.map((brand) => (
            <CarouselItem
              key={brand.name}
              className="basis-[78%] pl-4 sm:basis-1/2 md:basis-1/3 lg:basis-1/4"
            >
              <Link href={brand.href} className="block">
                <div className="relative aspect-[4/5] overflow-hidden rounded-2xl bg-neutral-100">
                  <Image
                    src={brand.image}
                    alt={`${brand.name} collection`}
                    fill
                    sizes="(min-width: 1024px) 25vw, (min-width: 768px) 33vw, (min-width: 640px) 50vw, 78vw"
                    className="object-cover"
                  />
                </div>

                <p className="mt-4 text-lg font-semibold underline underline-offset-4">
                  {brand.name}
                </p>
              </Link>
            </CarouselItem>
          ))}
        </CarouselContent>

        <CarouselPrevious className="left-2 z-10 size-11 border-0 bg-white text-black shadow-lg hover:bg-white hover:text-black disabled:opacity-0 [&_svg]:size-5! sm:left-4" />
        <CarouselNext className="right-2 z-10 size-11 border-0 bg-white text-black shadow-lg hover:bg-white hover:text-black disabled:opacity-0 [&_svg]:size-5! sm:right-4" />
      </Carousel>

      {count > 1 && (
        <div className="mt-7 flex justify-center gap-3">
          {Array.from({ length: count }, (_, index) => (
            <button
              key={index}
              type="button"
              aria-label={`Go to brand slide ${index + 1}`}
              aria-current={current === index ? "true" : undefined}
              onClick={() => api?.scrollTo(index)}
              className={`size-2.5 rounded-full border border-neutral-500 ${
                current === index ? "bg-neutral-900" : "bg-white"
              }`}
            />
          ))}
        </div>
      )}
    </section>
  );
}