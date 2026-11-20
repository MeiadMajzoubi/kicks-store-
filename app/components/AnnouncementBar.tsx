"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { ChevronLeft, ChevronRight, Heart, Pause, Play, User } from "lucide-react";
import { DELIVERY_DAYS, FREE_DELIVERY_FROM } from "@/lib/checkout";
import { useReducedMotion } from "@/lib/use-reduced-motion";
import { useWishlist } from "@/lib/wishlist";
import CountBadge from "./CountBadge";

/*
 * The black strip above the menu: a few short store promises that change on their own, with previous,
 * next and pause buttons. It stops while the pointer or keyboard is on it, and never moves by itself
 * with reduced motion. On large screens the shopper's own links (help, wishlist, account) sit on the right.
 */
const MESSAGES = [
  { text: `Express delivery in ${DELIVERY_DAYS} days`, href: "/delivery" },
  { text: `Free delivery over $${FREE_DELIVERY_FROM}`, href: "/delivery" },
  { text: "Up to 70% off sale styles", href: "/sale" },
];

const HOLD_MS = 5000;

const controlClass =
  "flex size-11 shrink-0 items-center justify-center rounded-full text-background/80 transition-colors duration-150 hover:text-background focus-visible:outline-white";

export default function AnnouncementBar() {
  const [index, setIndex] = useState(0);
  const [paused, setPaused] = useState(false);
  // True while the pointer or the keyboard is on the messages.
  const [held, setHeld] = useState(false);
  const reducedMotion = useReducedMotion();
  const savedCount = useWishlist().length;

  const go = (step: number) => setIndex((value) => (value + step + MESSAGES.length) % MESSAGES.length);
  const playing = !paused && !held && !reducedMotion;

  useEffect(() => {
    if (!playing) return;
    const timer = window.setInterval(() => setIndex((value) => (value + 1) % MESSAGES.length), HOLD_MS);
    return () => window.clearInterval(timer);
  }, [playing, index]);

  return (
    <div
      role="region"
      aria-roledescription="carousel"
      aria-label="Store announcements"
      className="bg-foreground text-background"
    >
      <div className="content-shell grid min-h-11 items-center lg:grid-cols-[1fr_auto_1fr]">
        <span aria-hidden="true" className="hidden lg:block" />

        <div
          className="flex items-center justify-center"
          onPointerEnter={(event) => {
            if (event.pointerType === "mouse") setHeld(true);
          }}
          onPointerLeave={() => setHeld(false)}
          onFocus={() => setHeld(true)}
          onBlur={(event) => {
            if (!event.currentTarget.contains(event.relatedTarget as Node | null)) setHeld(false);
          }}
        >
          <button type="button" aria-label="Previous announcement" onClick={() => go(-1)} className={controlClass}>
            <ChevronLeft aria-hidden="true" className="size-4" strokeWidth={2} />
          </button>

          {/* All messages share one spot; the shown one fades in and rises, the old one fades out quicker. */}
          <div aria-live={playing ? "off" : "polite"} className="grid min-w-0 flex-1 justify-items-center sm:w-72 sm:flex-none">
            {MESSAGES.map((message, position) => {
              const active = position === index;
              return (
                <Link
                  key={message.text}
                  href={message.href}
                  inert={!active}
                  aria-hidden={!active}
                  className={`col-start-1 row-start-1 px-2 text-center text-sm font-medium text-pretty transition-[opacity,translate] motion-reduce:delay-0 hover:underline hover:underline-offset-4 focus-visible:outline-white ${
                    active
                      ? "translate-y-0 opacity-100 delay-100 duration-500 ease-(--ease-spring)"
                      : "pointer-events-none translate-y-1 opacity-0 duration-200 ease-out"
                  }`}
                >
                  {message.text}
                </Link>
              );
            })}
          </div>

          <button type="button" aria-label="Next announcement" onClick={() => go(1)} className={controlClass}>
            <ChevronRight aria-hidden="true" className="size-4" strokeWidth={2} />
          </button>
          <button
            type="button"
            aria-label={paused ? "Play announcements" : "Pause announcements"}
            aria-pressed={paused}
            onClick={() => setPaused((value) => !value)}
            className={controlClass}
          >
            {paused ? (
              <Play aria-hidden="true" className="size-4" strokeWidth={2} />
            ) : (
              <Pause aria-hidden="true" className="size-4" strokeWidth={2} />
            )}
          </button>
        </div>

        <div className="hidden items-center justify-end gap-1 lg:flex">
          <Link
            href="/support"
            className="flex min-h-11 items-center px-3 text-sm font-medium hover:underline hover:underline-offset-4 focus-visible:outline-white"
          >
            Help
          </Link>
          <Link
            href="/wishlist"
            aria-label={savedCount ? `Wishlist, ${savedCount} saved` : "Wishlist"}
            className={`relative ${controlClass}`}
          >
            <Heart aria-hidden="true" className="size-5" strokeWidth={1.75} />
            {savedCount > 0 && <CountBadge count={savedCount} />}
          </Link>
          <button type="button" aria-label="Account" className={controlClass}>
            <User aria-hidden="true" className="size-5" strokeWidth={1.75} />
          </button>
        </div>
      </div>
    </div>
  );
}
