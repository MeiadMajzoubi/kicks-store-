"use client";

import { useState, type ReactNode } from "react";
import Image from "next/image";
import { ChevronLeft, ChevronRight } from "lucide-react";

type ProductGalleryProps = {
  images: string[];
  name: string;
  /** Ribbon or other badge laid over the main photo. */
  badge?: ReactNode;
};

export default function ProductGallery({ images, name, badge }: ProductGalleryProps) {
  const [active, setActive] = useState(0);
  const count = images.length;
  const go = (step: number) => setActive((index) => (index + step + count) % count);

  return (
    <div className="flex flex-col-reverse gap-3 lg:flex-row lg:gap-4">
      {count > 1 && (
        <ul
          aria-label="Product photos"
          className="flex gap-2 overflow-x-auto lg:max-h-[620px] lg:w-16 lg:shrink-0 lg:flex-col lg:overflow-y-auto"
        >
          {images.map((src, index) => (
            <li key={src} className="shrink-0">
              <button
                type="button"
                aria-label={`Show photo ${index + 1} of ${count}`}
                aria-current={index === active ? "true" : undefined}
                onMouseEnter={() => setActive(index)}
                onClick={() => setActive(index)}
                className={`relative block size-16 overflow-hidden rounded-md bg-surface transition-opacity duration-150 ${
                  index === active ? "opacity-100 ring-1 ring-foreground" : "opacity-70 hover:opacity-100"
                }`}
              >
                <Image src={src} alt="" fill sizes="64px" quality={100} className="object-contain p-1" />
              </button>
            </li>
          ))}
        </ul>
      )}

      <div className="relative aspect-square min-w-0 flex-1 overflow-hidden rounded-lg bg-surface">
        {badge}
        <Image
          key={images[active]}
          src={images[active]}
          alt={count > 1 ? `${name}, photo ${active + 1} of ${count}` : name}
          fill
          preload
          quality={100}
          sizes="(min-width: 1024px) 560px, 100vw"
          className="object-contain p-[6%]"
        />

        {count > 1 && (
          <div className="absolute right-4 bottom-4 flex gap-2">
            <button
              type="button"
              onClick={() => go(-1)}
              aria-label="Previous photo"
              className="flex size-11 items-center justify-center rounded-full bg-background shadow-sm transition-colors hover:bg-surface"
            >
              <ChevronLeft aria-hidden="true" className="size-5" strokeWidth={1.75} />
            </button>
            <button
              type="button"
              onClick={() => go(1)}
              aria-label="Next photo"
              className="flex size-11 items-center justify-center rounded-full bg-background shadow-sm transition-colors hover:bg-surface"
            >
              <ChevronRight aria-hidden="true" className="size-5" strokeWidth={1.75} />
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
