"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import {
  Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious, type CarouselApi,
} from "@/components/ui/carousel";
import { useCarouselState } from "@/lib/use-carousel-state";
import { useReducedMotion } from "@/lib/use-reduced-motion";

// Clean photos with no logo in them; every card gets the same logo, in the same corner.
const brands = [
  { name: "Nike", image: "/brands/nike.webp", logo: "/brand-logos/nike.svg", href: "/brands/nike" },
  { name: "Adidas", image: "/brands/adidas.webp", logo: "/brand-logos/adidas.svg", href: "/brands/adidas" },
  { name: "On", image: "/brands/on-run.webp", logo: "/brand-logos/on.svg", href: "/brands/on" },
  { name: "Puma", image: "/brands/puma-street.webp", logo: "/brand-logos/puma.svg", href: "/brands/puma" },
];

export default function ShopByBrands() {
  const [api, setApi] = useState<CarouselApi>();
  const { current, count } = useCarouselState(api);
  const reducedMotion = useReducedMotion();

  return (
    <section id="shop-brands" aria-labelledby="shop-brands-title" className="content-shell section-space">
      <div className="mb-8 flex flex-wrap items-end justify-between gap-4 sm:mb-10">
        <h2 id="shop-brands-title" className="section-title">Shop top brands</h2>
        <Link href="/brands" className="text-link">
          All brands <ArrowRight aria-hidden="true" className="size-4" />
        </Link>
      </div>
      <Carousel setApi={setApi} opts={{ align: "start", duration: reducedMotion ? 0 : 30 }} aria-label="Shop top brands" className="w-full">
        <CarouselContent className="-ml-4 sm:-ml-5">
          {brands.map((brand) => (
            <CarouselItem key={brand.name} className="basis-[82%] pl-4 sm:basis-1/2 sm:pl-5 md:basis-1/3 lg:basis-1/4">
              <Link href={brand.href} aria-label={`Shop ${brand.name}`} className="group block rounded-2xl">
                <div className="relative aspect-[4/5] overflow-hidden rounded-2xl bg-surface">
                  <Image
                    src={brand.image}
                    alt=""
                    fill
                    sizes="(min-width: 1664px) 385px, (min-width: 1024px) 25vw, (min-width: 768px) 33vw, (min-width: 640px) 50vw, 82vw"
                    className="object-cover"
                  />
                  <div aria-hidden="true" className="absolute inset-x-0 bottom-0 h-1/3 bg-linear-to-t from-black/55 to-transparent" />
                  <div className="absolute inset-x-5 bottom-5 flex items-end justify-between gap-3">
                    {/* The black logo files, turned white. */}
                    <Image src={brand.logo} alt="" width={96} height={40} className="h-9 w-auto max-w-24 object-contain object-left brightness-0 invert" />
                    <span className="inline-flex h-10 items-center rounded-full bg-white px-5 text-sm font-semibold text-foreground transition-colors group-hover:bg-white/85">
                      Shop
                    </span>
                  </div>
                </div>
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
