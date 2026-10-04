"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import {
  Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious, type CarouselApi,
} from "@/components/ui/carousel";
import { useCarouselState } from "@/lib/use-carousel-state";
import { useReducedMotion } from "@/lib/use-reduced-motion";

const brands = [
  { name: "Nike", image: "/brands/Nike.jpeg", href: "/brands/nike" },
  { name: "Adidas", image: "/brands/Adidas.jpeg", href: "/brands/adidas" },
  { name: "ASICS", image: "/brands/Asics.jpeg", href: "/brands/asics" },
  { name: "On", image: "/brands/On.jpeg", href: "/brands/on" },
  { name: "New Balance", image: "/brands/NB.jpeg", href: "/brands/new-balance" },
  { name: "Birkenstock", image: "/brands/Birkenstock.jpeg", href: "/brands/Birkenstock" },
];

export default function ShopByBrands() {
  const [api, setApi] = useState<CarouselApi>();
  const { current, count } = useCarouselState(api);
  const reducedMotion = useReducedMotion();

  return (
    <section id="shop-brands" aria-labelledby="shop-brands-title" className="content-shell section-space">
      <div className="mb-8 sm:mb-10">
        <p className="eyebrow mb-3">The names you know</p>
        <h2 id="shop-brands-title" className="section-title">Shop top brands</h2>
      </div>
      <Carousel setApi={setApi} opts={{ align: "start", duration: reducedMotion ? 0 : 30 }} aria-label="Shop top brands" className="w-full">
        <CarouselContent className="-ml-4 sm:-ml-5">
          {brands.map((brand) => (
            <CarouselItem key={brand.name} className="basis-[82%] pl-4 sm:basis-1/2 sm:pl-5 md:basis-1/3 lg:basis-1/4">
              <Link href={brand.href} className="block rounded-2xl">
                <div className="relative aspect-[4/5] overflow-hidden rounded-2xl bg-surface">
                  <Image
                    src={brand.image}
                    alt={`${brand.name} collection`}
                    fill
                    sizes="(min-width: 1664px) 385px, (min-width: 1024px) 25vw, (min-width: 768px) 33vw, (min-width: 640px) 50vw, 82vw"
                    className="object-cover"
                  />
                </div>
                <p className="mt-4 text-base font-semibold tracking-tight underline decoration-foreground/40 underline-offset-4 sm:text-lg">{brand.name}</p>
              </Link>
            </CarouselItem>
          ))}
        </CarouselContent>
        <CarouselPrevious className="left-3 z-10 size-11 border-0 bg-white text-foreground shadow-md hover:bg-white hover:text-foreground disabled:opacity-0 [&_svg]:size-5!" />
        <CarouselNext className="right-3 z-10 size-11 border-0 bg-white text-foreground shadow-md hover:bg-white hover:text-foreground disabled:opacity-0 [&_svg]:size-5!" />
      </Carousel>

      {count > 1 && (
        <div className="mt-5 flex justify-center" role="group" aria-label="Brand carousel pages">
          {Array.from({ length: count }, (_, index) => (
            <button
              key={index}
              type="button"
              aria-label={`Go to brand page ${index + 1}`}
              aria-current={current === index ? "true" : undefined}
              onClick={() => api?.scrollTo(index, reducedMotion)}
              className="flex size-11 items-center justify-center rounded-full"
            >
              <span aria-hidden="true" className={`size-2 rounded-full transition-colors ${current === index ? "bg-foreground" : "bg-foreground/20"}`} />
            </button>
          ))}
        </div>
      )}
    </section>
  );
}
