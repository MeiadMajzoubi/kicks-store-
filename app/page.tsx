"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
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

type Slide = {
  src: string;
  alt: string;
  title: string;
  copy: string;
  href: string;
  // "light" photos get ink text; "dark" ones get white text over a soft shade.
  tone: "light" | "dark";
  // Text sits bottom-left unless the shoes are there.
  align?: "right";
};

// Like Foot Locker: the name of what's in the photo, then one plain line.
const slides: Slide[] = [
  {
    src: "/Adious.avif",
    alt: "Adidas Adizero racing shoe in pink and black",
    title: "Adidas Adizero",
    copy: "Race-day shoes in new colours.",
    href: "/brands/adidas?category=running",
    tone: "light",
  },
  {
    src: "/LIQUID.webp",
    alt: "Nike Air Max shoes on wet ground",
    title: "Nike Air Max",
    copy: "Fresh pairs for every day.",
    href: "/brands/nike?category=lifestyle",
    tone: "dark",
  },
  {
    src: "/hero/outdoor-trail.webp",
    alt: "Orange Nike trail shoes on a forest path",
    title: "Nike ACG",
    copy: "Trail shoes for wet, rough ground.",
    href: "/shop?category=outdoor",
    tone: "dark",
    align: "right",
  },
  {
    src: "/Bunny.webp",
    alt: "Bad Bunny with his Adidas shoes",
    title: "Adidas x Bad Bunny",
    copy: "His everyday shoe, in store now.",
    href: "/brands/adidas?category=lifestyle",
    tone: "dark",
  },
  {
    src: "/hero/training-lift.webp",
    alt: "Athlete lifting a dumbbell in a gym",
    title: "Nike Training",
    copy: "Gym shoes with grip for every lift.",
    href: "/shop?category=training",
    tone: "dark",
  },
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
          className="relative mx-auto max-w-[1920px] overflow-hidden sm:bg-surface"
        >
          <CarouselContent className="ml-0">
            {slides.map((slide, index) => {
              const dark = slide.tone === "dark";
              const right = slide.align === "right";
              return (
                <CarouselItem key={slide.src} className="relative basis-full pl-0" aria-label={`${index + 1} of ${slides.length}`}>
                  <div className="relative aspect-[22/9] w-full">
                    <Image src={slide.src} alt={slide.alt} fill sizes="(min-width: 1920px) 1920px, 100vw" preload={index === 0} className="object-cover" />
                    {/* Shade only the corner the text sits on, so the photo stays bright. */}
                    {dark && (
                      <div
                        aria-hidden="true"
                        className={`absolute inset-0 hidden sm:block ${
                          right
                            ? "bg-[linear-gradient(to_top_left,rgb(0_0_0/0.6),rgb(0_0_0/0.15)_45%,transparent_70%)]"
                            : "bg-[linear-gradient(to_top_right,rgb(0_0_0/0.6),rgb(0_0_0/0.15)_45%,transparent_70%)]"
                        }`}
                      />
                    )}
                  </div>
                  {/* Under the photo on phones; over its lower-left corner from tablets up. */}
                  <div className="sm:absolute sm:inset-0 sm:flex sm:items-end">
                    <div
                      className={`content-shell pt-5 pb-2 sm:flex sm:flex-col sm:pt-0 sm:pb-[clamp(2rem,5vw,5.5rem)] ${
                        right ? "sm:items-end sm:text-right" : "sm:items-start"
                      } ${dark ? "sm:text-white" : ""}`}
                    >
                      <p className="sm:max-w-[11ch] text-[clamp(1.75rem,4.2vw,4rem)] leading-[1.02] font-bold tracking-[-0.05em] text-balance">
                        {slide.title}
                      </p>
                      <p className={`mt-2 max-w-sm text-[15px] sm:mt-3 sm:text-base ${dark ? "text-muted-foreground sm:text-white/85" : "text-muted-foreground sm:text-foreground/75"}`}>
                        {slide.copy}
                      </p>
                      <Link
                        href={slide.href}
                        className={`mt-4 inline-flex h-12 items-center rounded-full px-7 text-[15px] font-semibold transition-colors duration-150 active:scale-[0.98] sm:mt-6 ${
                          dark
                            ? "bg-foreground text-white hover:bg-foreground/85 sm:bg-white sm:text-foreground sm:hover:bg-white/85"
                            : "bg-foreground text-white hover:bg-foreground/85"
                        }`}
                      >
                        Shop now
                      </Link>
                    </div>
                  </div>
                </CarouselItem>
              );
            })}
          </CarouselContent>
          <CarouselPrevious className="max-sm:hidden left-1 z-10 size-11 border-0 bg-transparent text-white shadow-none drop-shadow-md hover:bg-transparent hover:text-white [&_svg]:size-8! [&_svg]:stroke-[1.5] sm:left-5 sm:size-14 sm:[&_svg]:size-11!" />
          <CarouselNext className="max-sm:hidden right-1 z-10 size-11 border-0 bg-transparent text-white shadow-none drop-shadow-md hover:bg-transparent hover:text-white [&_svg]:size-8! [&_svg]:stroke-[1.5] sm:right-5 sm:size-14 sm:[&_svg]:size-11!" />
          <div className="absolute top-2 right-3 z-10 flex items-center gap-3 rounded-full bg-black/60 pl-4 text-white sm:top-auto sm:bottom-5 sm:right-8">
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
          <h1 className="page-title">Find your next pair<span className="title-mark">.</span></h1>
          <p className="section-intro">For the everyday. For the extra mile. Make your next move.</p>
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
