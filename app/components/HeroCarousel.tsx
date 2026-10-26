"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import Autoplay from "embla-carousel-autoplay";
import { ArrowRight, ChevronLeft, ChevronRight, Pause, Play } from "lucide-react";
import { Carousel, CarouselContent, CarouselItem, type CarouselApi } from "@/components/ui/carousel";
import { useCarouselState } from "@/lib/use-carousel-state";
import { useReducedMotion } from "@/lib/use-reduced-motion";

type Slide = {
  src: string;
  alt: string;
  title: string;
  /** One line on what the shoe is, the way Foot Locker writes it. */
  copy: string;
  href: string;
  // "light" photos get ink text; "dark" ones get white text over a soft shade.
  tone: "light" | "dark";
  // Text sits on the left unless the shoes are there.
  align?: "right";
};

const slides: Slide[] = [
  {
    src: "/Adious.avif",
    alt: "Adidas Adizero racing shoe in pink and black",
    title: "Adizero",
    copy: "Adidas' lightest running shoes, made for race day and fast sessions.",
    href: "/search?q=adizero",
    tone: "light",
  },
  {
    src: "/LIQUID.webp",
    alt: "Nike Air Max shoes on wet ground",
    title: "Air Max",
    copy: "Nike's visible Air cushioning, built for all-day wear.",
    href: "/search?q=air+max",
    tone: "dark",
  },
  {
    src: "/hero/outdoor-trail.webp",
    alt: "Orange trail shoes on a forest path",
    title: "Outdoor",
    copy: "Trail shoes with deep grip for mud, rock and wet paths.",
    href: "/shop?category=outdoor",
    tone: "dark",
    align: "right",
  },
  {
    src: "/Bunny.webp",
    alt: "Bad Bunny with his Adidas Badbo 1.1 shoes",
    title: "Badbo 1.1",
    copy: "Bad Bunny's everyday Adidas shoe, in soft suede and open mesh.",
    href: "/search?q=bad+bunny",
    tone: "dark",
  },
  {
    src: "/hero/training-lift.webp",
    alt: "Athlete lifting a dumbbell in a gym",
    title: "Training",
    copy: "Flat, stable soles for lifting, HIIT and gym classes.",
    href: "/shop?category=training",
    tone: "dark",
  },
];

/** The home page's top banner. Runs in the browser because it autoplays and reacts to its controls. */
export default function HeroCarousel() {
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
                {/* Shade only the side the text sits on, so the photo stays bright. */}
                {dark && (
                  <div
                    aria-hidden="true"
                    className={`absolute inset-0 hidden sm:block ${
                      right
                        ? "bg-[linear-gradient(to_left,rgb(0_0_0/0.55),rgb(0_0_0/0.2)_35%,transparent_60%)]"
                        : "bg-[linear-gradient(to_right,rgb(0_0_0/0.55),rgb(0_0_0/0.2)_35%,transparent_60%)]"
                    }`}
                  />
                )}
              </div>
              {/* Under the photo on phones; over its middle, beside the shoes, from tablets up. */}
              <div className="sm:absolute sm:inset-0 sm:flex sm:items-center">
                <div
                  className={`content-shell pt-5 pb-2 sm:flex sm:flex-col sm:py-0 ${
                    right ? "sm:items-end sm:text-right" : "sm:items-start"
                  } ${dark ? "sm:text-white" : ""}`}
                >
                  <p className="font-display text-[clamp(2.75rem,7vw,7rem)] leading-[0.88] tracking-[0.01em] uppercase">
                    {slide.title}
                  </p>
                  <p className={`mt-2 max-w-[34ch] text-[15px] leading-snug sm:mt-3 sm:text-[clamp(0.9375rem,1.2vw,1.125rem)] ${dark ? "text-muted-foreground sm:text-white/90" : "text-muted-foreground sm:text-foreground/75"}`}>
                    {slide.copy}
                  </p>
                  <Link
                    href={slide.href}
                    className={`group mt-5 inline-flex h-11 items-center gap-2 rounded-full px-6 text-[13px] font-semibold tracking-[0.06em] uppercase transition-colors duration-150 sm:mt-6 ${
                      dark
                        ? "bg-foreground text-white hover:bg-foreground/85 sm:bg-white sm:text-foreground sm:hover:bg-white/85 sm:focus-visible:outline-white"
                        : "bg-foreground text-white hover:bg-foreground/85"
                    }`}
                  >
                    Shop now
                    <ArrowRight aria-hidden="true" strokeWidth={2.25} className="size-4 transition-transform duration-150 group-hover:translate-x-0.5 motion-reduce:transition-none" />
                  </Link>
                </div>
              </div>
            </CarouselItem>
          );
        })}
      </CarouselContent>
      <div className="absolute top-2 right-3 z-10 flex items-center gap-3 rounded-full bg-black/60 pl-4 text-white sm:top-auto sm:bottom-5 sm:right-8">
        <span className="text-[11px] font-medium tabular-nums">0{current + 1}<span className="mx-2 text-white/60">/</span>0{slides.length}</span>
        {/* Previous and next live with the counter, so they never sit on the headline. */}
        <span className="-mr-3 flex">
          <button
            type="button"
            onClick={() => api?.scrollPrev(reducedMotion)}
            aria-label="Previous slide"
            className="flex size-11 items-center justify-center rounded-full"
          >
            <ChevronLeft className="size-4" aria-hidden="true" />
          </button>
          <button
            type="button"
            onClick={() => api?.scrollNext(reducedMotion)}
            aria-label="Next slide"
            className="flex size-11 items-center justify-center rounded-full"
          >
            <ChevronRight className="size-4" aria-hidden="true" />
          </button>
        </span>
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
  );
}
