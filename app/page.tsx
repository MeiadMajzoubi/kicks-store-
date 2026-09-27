"use client";

import Image from "next/image";
import Autoplay from "embla-carousel-autoplay";
import { useState } from "react";

import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";

const slides = [
  { src: "/ACG.jpg", alt: "ACG collection" },
  { src: "/DN2.avif", alt: "DN collection — second look" },
  { src: "/LIQUID.webp", alt: "Liquid collection" },
  { src: "/MET10.jpeg", alt: "MET10 collection" },
];

export default function Home() {
  const [autoplay] = useState(() =>
    Autoplay({
      delay: 5000,
      stopOnInteraction: false,
      stopOnMouseEnter: true,
    }),
  );

  return (
    <main className="min-h-screen bg-white text-black">
      <Carousel
        plugins={[autoplay]}
        opts={{ loop: true }}
        aria-label="Featured collections"
        className="relative w-full overflow-hidden"
      >
        <CarouselContent className="ml-0">
          {slides.map((slide, index) => (
            <CarouselItem key={slide.src} className="basis-full pl-0">
              <div className="relative aspect-[22/9] w-full bg-neutral-100">
                <Image
                  src={slide.src}
                  alt={slide.alt}
                  fill
                  sizes="100vw"
                  priority={index === 0}
                  className="object-cover"
                />
              </div>
            </CarouselItem>
          ))}
        </CarouselContent>
        <CarouselPrevious className="left-3 z-10 size-14 border-0 bg-transparent text-white shadow-none hover:bg-transparent hover:text-white [&_svg]:size-12! [&_svg]:stroke-[1.3] sm:left-5" />

        <CarouselNext className="right-3 z-10 size-14 border-0 bg-transparent text-white shadow-none hover:bg-transparent hover:text-white [&_svg]:size-12! [&_svg]:stroke-[1.3] sm:right-5" />
      </Carousel>
    </main>
  );
}
