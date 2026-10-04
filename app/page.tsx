"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import Autoplay from "embla-carousel-autoplay";
import TrendingProducts from "./components/TrendingProducts";
import ShopByBrands from "./components/ShopByBrands";
import ShopByCategory from "./components/ShopByCategory";
import Advantages from "./components/Advantages";
import { Pause, Play } from "lucide-react";
import {
  Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious, type CarouselApi,
} from "@/components/ui/carousel";
import { useCarouselState } from "@/lib/use-carousel-state";
import { useReducedMotion } from "@/lib/use-reduced-motion";

const slides = [
  { src: "/Adious.avif", alt: "adidas Adizero performance collection" },
  { src: "/Bunny.webp", alt: "adidas Bad Bunny collection" },
  { src: "/LIQUID.webp", alt: "Nike Liquid Max collection" },
  { src: "/Puma.webp", alt: "Puma sneaker collection" },
];

export default function Home() {
  const [api, setApi] = useState<CarouselApi>();
  const [paused, setPaused] = useState(false);
  const reducedMotion = useReducedMotion();
  const { current } = useCarouselState(api);
  const [autoplay] = useState(() =>
    Autoplay({
      delay: 5000,
      playOnInit: false,
      stopOnInteraction: true,
      stopOnMouseEnter: false,
      stopOnFocusIn: false,
    }),
  );

  // Keep the original autoplay plugin; the Pause/Play button owns playback.
  useEffect(() => {
    if (!api) return;
    const syncPlayback = () => {
      if (paused) autoplay.stop();
      else autoplay.play(reducedMotion);
    };
    const resetTimer = () => {
      if (!paused) autoplay.reset();
    };

    syncPlayback();
    api.on("pointerUp", syncPlayback);
    api.on("reInit", syncPlayback);
    api.on("select", resetTimer);
    return () => {
      autoplay.stop();
      api.off("pointerUp", syncPlayback);
      api.off("reInit", syncPlayback);
      api.off("select", resetTimer);
    };
  }, [api, autoplay, paused, reducedMotion]);

  return (
    <main id="main-content" tabIndex={-1} className="min-h-screen outline-none">
      <section aria-label="Featured collections">
        <Carousel
          setApi={setApi}
          plugins={[autoplay]}
          opts={{ loop: true, duration: reducedMotion ? 0 : 35 }}
          aria-label="Featured collection images"
          className="relative mx-auto max-w-[1920px] overflow-hidden bg-surface"
        >
          <CarouselContent className="ml-0">
            {slides.map((slide, index) => (
              <CarouselItem key={slide.src} className="basis-full pl-0" aria-label={`${index + 1} of ${slides.length}`}>
                <div className="relative aspect-[22/9] w-full">
                  <Image src={slide.src} alt={slide.alt} fill sizes="(min-width: 1920px) 1920px, 100vw" preload={index === 0} className="object-cover" />
                </div>
              </CarouselItem>
            ))}
          </CarouselContent>
          <CarouselPrevious className="left-1 z-10 size-11 border-0 bg-transparent text-white shadow-none drop-shadow-md hover:bg-transparent hover:text-white [&_svg]:size-8! [&_svg]:stroke-[1.5] sm:left-5 sm:size-14 sm:[&_svg]:size-11!" />
          <CarouselNext className="right-1 z-10 size-11 border-0 bg-transparent text-white shadow-none drop-shadow-md hover:bg-transparent hover:text-white [&_svg]:size-8! [&_svg]:stroke-[1.5] sm:right-5 sm:size-14 sm:[&_svg]:size-11!" />
          <div className="absolute bottom-2 right-3 flex items-center gap-3 rounded-full bg-black/60 pl-4 text-white sm:bottom-5 sm:right-8">
            <span className="text-[11px] font-medium tabular-nums">0{current + 1}<span className="mx-2 text-white/60">/</span>0{slides.length}</span>
            <button
              type="button"
              onClick={() => setPaused((value) => !value)}
              aria-label={paused ? "Play automatic slides" : "Pause automatic slides"}
              className="flex size-11 items-center justify-center rounded-full"
            >
              {paused ? <Play className="size-3.5" aria-hidden="true" /> : <Pause className="size-3.5" aria-hidden="true" />}
            </button>
          </div>
        </Carousel>

        <div className="content-shell border-b border-border py-8 sm:py-10 lg:py-12">
          <div>
            <p className="eyebrow mb-3">Red Kicks / Your next rotation</p>
            <h1 className="text-[clamp(2.5rem,5.5vw,5rem)] font-bold leading-[1.02] tracking-[-0.06em]">Find your next <span className="text-brand">pair.</span></h1>
            <p className="mt-4 max-w-md text-sm text-muted-foreground sm:text-base">For the everyday. For the extra mile. Make your next move.</p>
          </div>
        </div>
      </section>
      <div className="pt-6 sm:pt-10 lg:pt-14">
        <TrendingProducts />
      </div>
      <ShopByBrands />
      <ShopByCategory />
      <Advantages />
    </main>
  );
}
