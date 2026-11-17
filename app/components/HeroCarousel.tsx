"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import Autoplay from "embla-carousel-autoplay";
import { ArrowRight, ChevronLeft, ChevronRight, Pause, Play } from "lucide-react";
import { Carousel, CarouselContent, CarouselItem, type CarouselApi } from "@/components/ui/carousel";
import { useCarouselState } from "@/lib/use-carousel-state";
import { useReducedMotion } from "@/lib/use-reduced-motion";

/** Each slide takes one calm colour from its photo for its big slogan. The button is always white. */
type ThemeName = "silver" | "tan" | "sage" | "rust" | "volt";

type Slide = {
  src: string;
  alt: string;
  theme: ThemeName;
  /** The slogan: big, short, set in uppercase. */
  title: string;
  /** One short line about the shoe. */
  copy: string;
  /** Where the one button goes: the shoe itself (a search), or its category. */
  href: string;
  /** Where the text sits from tablets up: in the empty part of this photo. Phones always centre it low. */
  place: { x: "left" | "center" | "right"; y: "top" | "center" | "lower" | "bottom" };
  /** Width of the text column. Narrower on tablets where the photo is crowded; defaults to max-w-xl. */
  box?: string;
  /** Slogan size, when a slide needs a smaller one than the default. */
  titleSize?: string;
  /** Photos that are already at their pixel limit get 100, so the optimizer adds no loss. Default 90. */
  quality?: 90 | 100;
  /** Photo width / height. The banner crops with object-cover, so a photo wider than the banner is
   *  drawn wider than the screen. `heroSizes` uses this to tell the browser how many pixels it needs. */
  ratio: number;
  /** Keeps the subject in frame when a wide photo is cropped: object-position classes per breakpoint. */
  focus?: string;
};

// The banner's shape at each breakpoint (matches the aspect classes on the slide below).
const BOX = { phone: 4 / 5, tablet: 16 / 9, laptop: 22 / 9 };

/** `sizes` for a photo of this ratio. A photo wider than its box is scaled up to fill the height, so it
 *  is drawn wider than the screen; asking for just `100vw` makes the browser fetch a file that is too
 *  small and stretch it. From laptop width up we ask for the largest file outright. */
function heroSizes(ratio: number) {
  const over = (box: number) => Math.max(1, ratio / box);
  return [
    `(min-width: 1024px) ${Math.round(1920 * over(BOX.laptop))}px`,
    `(min-width: 640px) ${Math.round(100 * over(BOX.tablet))}vw`,
    `${Math.round(100 * over(BOX.phone))}vw`,
  ].join(", ");
}

const slides: Slide[] = [
  {
    src: "/hero/race-track.webp",
    ratio: 1920 / 785,
    alt: "Runner resting on a floodlit track at night",
    theme: "silver",
    title: "Ten minutes to the gun",
    copy: "Breathe. Check your laces. On Cloud keeps the rest quiet.",
    href: "/search?q=on+cloud",
    place: { x: "left", y: "center" },
    box: "max-w-xl sm:max-w-56 md:max-w-xs lg:max-w-xl",
  },
  {
    src: "/hero/speedcat-suede.webp",
    ratio: 3000 / 1227,
    alt: "Pair of brown suede Puma Speedcat sneakers on a brown backdrop",
    theme: "tan",
    title: "Unlock every style",
    copy: "With Speedcats and Dropset 4, win the inner war.",
    href: "/search?q=speedcat",
    place: { x: "left", y: "lower" },
    box: "max-w-xl sm:max-w-72 md:max-w-md lg:max-w-lg xl:max-w-xl",
    quality: 100,
  },
  {
    src: "/hero/trail-moor.jpg",
    ratio: 3840 / 1066,
    // Phones show only the middle third of this wide photo, laptops about two thirds of it.
    focus: "object-[42%_50%] sm:object-[30%_50%] lg:object-[10%_50%]",
    alt: "Trail runner in a black jacket striding across misty moorland",
    theme: "sage",
    title: "Leave the road",
    copy: "Outdoor shoes with the grip for mud, rock and mist.",
    href: "/shop?category=outdoor",
    // The empty misty slope at the top left; the grass below is too busy for words. One line, smaller
    // than the others, so the whole block stays above the grass.
    place: { x: "left", y: "top" },
    box: "max-w-2xl",
    titleSize: "text-5xl sm:text-4xl md:text-5xl lg:text-6xl xl:text-7xl",
  },
  {
    src: "/hero/dropset-4.webp",
    ratio: 2640 / 1080,
    // Phones show only the middle third of this wide canvas: slide it over to the shoe.
    focus: "object-[32%_50%] sm:object-[50%_50%]",
    alt: "Black and orange adidas Dropset 4 training shoe floating in grey smoke",
    theme: "rust",
    title: "Do the work",
    copy: "Dropset 4 keeps heels planted for the lift, jump and sprint.",
    href: "/search?q=dropset",
    place: { x: "right", y: "lower" },
    box: "max-w-xl sm:max-w-60 md:max-w-sm lg:max-w-md xl:max-w-xl",
  },
  {
    src: "/hero/vaporfly.webp",
    ratio: 2640 / 1080,
    // Phones show only the middle third of this wide canvas: slide it over to the shoe.
    focus: "object-[66%_50%] sm:object-[50%_50%]",
    alt: "Red and volt Nike ZoomX Vaporfly racing shoe lit by streaks of colour on black",
    theme: "volt",
    title: "Fast enough?",
    copy: "Carbon plate. ZoomX foam. Nothing between you and the line.",
    href: "/search?q=vaporfly",
    place: { x: "left", y: "top" },
    quality: 100,
  },
];

// Tailwind needs whole class names in the source, so each position maps to fixed classes.
// `scrim` is a soft gradient behind the text on the side it sits, so it reads without darkening the photo.
const PLACE_X = {
  left: {
    row: "sm:justify-start sm:text-left",
    column: "sm:items-start",
    scrim: "sm:bg-[linear-gradient(to_right,rgba(0,0,0,0.3),transparent_60%)]",
  },
  center: { row: "", column: "", scrim: "" },
  right: {
    row: "sm:justify-end sm:text-right",
    column: "sm:items-end",
    scrim: "sm:bg-[linear-gradient(to_left,rgba(0,0,0,0.3),transparent_60%)]",
  },
};
const PLACE_Y = {
  // Tablets have a small banner, so they sit closer to the top edge than laptops do.
  top: "sm:items-start sm:pt-8 sm:pb-0 lg:pt-16",
  center: "sm:items-center sm:pb-0",
  // Centred on tablets; on laptops nudged down about 48px, where the quiet space sits just below the middle.
  lower: "sm:items-center sm:pb-0 lg:pt-24",
  bottom: "",
};

/** The slogan's default size. Anton is condensed, so it can be big; it steps down on small laptops and tablets. */
const TITLE_SIZE = "text-6xl sm:text-5xl md:text-6xl lg:text-7xl xl:text-8xl";

/** One solid colour per slide, taken from its photo and kept calm (nothing neon). Only the slogan wears
 *  it; the button is plain white on every slide. Flat on purpose: no gradient, transparency or glow. */
const THEMES: Record<ThemeName, string> = {
  silver: "#e4eaf1", // black-and-white track
  tan: "#d8b48f", // brown suede: a light brown, not gold
  sage: "#c9e0a8", // misty hillside
  rust: "#d4663a", // the Dropset's sole, deeper than the sole itself
  volt: "#b8ff2c", // the Vaporfly's neon
};

/** The home page's top banner. Runs in the browser because it autoplays and reacts to its controls. */
export default function HeroCarousel() {
  const [api, setApi] = useState<CarouselApi>();
  const [paused, setPaused] = useState(false);
  const reducedMotion = useReducedMotion();
  const { current } = useCarouselState(api);
  const [autoplay] = useState(() =>
    Autoplay({
      delay: 6000,
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
      className="relative mx-auto max-w-[1920px] overflow-hidden bg-foreground"
    >
      <CarouselContent className="ml-0">
        {slides.map((slide, index) => (
          <CarouselItem key={slide.src} className="relative basis-full pl-0" aria-label={`${index + 1} of ${slides.length}`}>
            <div className="relative aspect-[4/5] w-full sm:aspect-[16/9] lg:aspect-[22/9]">
              {/* `sizes` comes from the photo's shape (see heroSizes), so the browser fetches enough pixels
                  for the cropped, scaled-up picture. Quality 90, not the default 75: 75 re-compresses an
                  already-compressed photo, which shows as mush in flat areas like a studio backdrop. */}
              <Image src={slide.src} alt={slide.alt} fill sizes={heroSizes(slide.ratio)} quality={slide.quality ?? 90} preload={index === 0} className={`object-cover ${slide.focus ?? ""}`} />
            </div>
            {/* Phones: centred low, above the dots. Tablets up: in the empty part of the photo, lined up
                with the logo. Same layout on every slide: big slogan, one short line, one button. Only
                the colour changes. A soft gradient behind the text keeps it readable. */}
            <div className={`hero-text absolute inset-0 flex items-end pb-16 text-white sm:pb-20 ${PLACE_Y[slide.place.y]}`}>
              <div
                aria-hidden="true"
                className={`pointer-events-none absolute inset-0 max-sm:bg-linear-to-t max-sm:from-black/50 max-sm:via-black/15 max-sm:to-transparent ${PLACE_X[slide.place.x].scrim}`}
              />
              <div className={`content-shell relative flex justify-center text-center ${PLACE_X[slide.place.x].row}`}>
                <div className={`flex ${slide.box ?? "max-w-xl"} min-w-0 flex-col items-center gap-5 ${PLACE_X[slide.place.x].column}`}>
                  <div className={`flex flex-col items-center gap-3 ${PLACE_X[slide.place.x].column}`}>
                    <p
                      className={`font-display leading-[0.9] tracking-tight text-balance uppercase ${slide.titleSize ?? TITLE_SIZE}`}
                      style={{ color: THEMES[slide.theme] }}
                    >
                      {slide.title}
                    </p>
                    <p className="max-w-md text-base font-medium text-balance sm:text-sm md:text-base lg:text-lg">{slide.copy}</p>
                  </div>
                  <Link
                    href={slide.href}
                    aria-label={`Shop now: ${slide.title}`}
                    className="group inline-flex h-12 items-center justify-center gap-2 rounded-full bg-background px-6 text-base font-medium text-foreground shadow-sm transition-[background-color,transform] duration-150 ease-out hover:bg-surface-hover focus-visible:outline-white active:scale-[0.97]"
                  >
                    Shop now
                    <ArrowRight aria-hidden="true" className="size-4 transition-transform duration-150 ease-out group-hover:translate-x-0.5" />
                  </Link>
                </div>
              </div>
            </div>
          </CarouselItem>
        ))}
      </CarouselContent>

      {/* Dots: one per slide, centred at the bottom. Each has a full 44px-tall tap area. */}
      <div className="absolute inset-x-0 bottom-2 z-10 flex justify-center sm:bottom-4">
        {slides.map((slide, index) => (
          <button
            key={slide.src}
            type="button"
            onClick={() => api?.scrollTo(index, reducedMotion)}
            aria-label={`Go to slide ${index + 1}: ${slide.title}`}
            aria-current={index === current ? "true" : undefined}
            className="group flex h-11 w-6 items-center justify-center focus-visible:outline-white"
          >
            <span
              className={`size-2 rounded-full transition-colors duration-150 ${
                index === current ? "bg-white" : "bg-white/50 group-hover:bg-white/80"
              }`}
            />
          </button>
        ))}
      </div>

      {/* Pause and arrows in the corner, clear of the text. Phones swipe, so arrows start at tablet size. */}
      <div className="absolute right-2 bottom-2 z-10 flex text-white sm:right-6 sm:bottom-4">
        <button
          type="button"
          onClick={() => api?.scrollPrev(reducedMotion)}
          aria-label="Previous slide"
          className="hidden size-11 items-center justify-center rounded-full transition-colors duration-150 hover:bg-white/20 focus-visible:outline-white sm:flex"
        >
          <ChevronLeft className="size-5" strokeWidth={1.5} aria-hidden="true" />
        </button>
        <button
          type="button"
          onClick={() => api?.scrollNext(reducedMotion)}
          aria-label="Next slide"
          className="hidden size-11 items-center justify-center rounded-full transition-colors duration-150 hover:bg-white/20 focus-visible:outline-white sm:flex"
        >
          <ChevronRight className="size-5" strokeWidth={1.5} aria-hidden="true" />
        </button>
        <button
          type="button"
          onClick={() => setPaused((value) => !value)}
          aria-label={paused ? "Play automatic slides" : "Pause automatic slides"}
          className="flex size-11 items-center justify-center rounded-full transition-colors duration-150 hover:bg-white/20 focus-visible:outline-white"
        >
          {paused ? <Play className="size-4" aria-hidden="true" /> : <Pause className="size-4" aria-hidden="true" />}
        </button>
      </div>
    </Carousel>
  );
}
