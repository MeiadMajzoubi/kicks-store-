"use client";

import { useEffect, useLayoutEffect, useRef, useState } from "react";
import FastTruckIcon from "./icons/FastTruckIcon";

/*
 * Top bar with the store's one promise, animated like the "clip" headline on redkicks.ir:
 * each message holds (1.5s; 2.5s the first time), wipes shut (600ms) and the next one
 * wipes open in its place. Clicking pauses it; with reduced motion it stays still.
 */
const HOLD_FIRST = 2500;
const HOLD = 1500;
const WIPE = 600;

const MESSAGES = [
  <span key="express" className="inline-flex items-center gap-2.5 text-brand-bright">
    <FastTruckIcon className="h-5 w-7 shrink-0" />
    Express delivery
  </span>,
  <span key="arrives">Arrives in just 3 days</span>,
];

type Phase = "shown" | "hiding" | "showing";

export default function DeliveryBanner() {
  const measureRefs = useRef<(HTMLSpanElement | null)[]>([]);
  const [widths, setWidths] = useState<number[] | null>(null);
  const [index, setIndex] = useState(0);
  const [phase, setPhase] = useState<Phase>("shown");
  const [first, setFirst] = useState(true);
  const [paused, setPaused] = useState(false);

  // Measure every message once, so each wipe opens to exactly its text width.
  useLayoutEffect(() => {
    const measured = measureRefs.current.map((el) => el?.offsetWidth ?? 0);
    if (measured.every(Boolean)) setWidths(measured);
  }, []);

  // Hold the message, then wipe it shut.
  useEffect(() => {
    if (phase !== "shown" || paused || widths === null) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const timer = window.setTimeout(() => {
      setFirst(false);
      setPhase("hiding");
    }, first ? HOLD_FIRST : HOLD);
    return () => window.clearTimeout(timer);
  }, [phase, paused, first, widths]);

  const onWipeEnd = (event: React.TransitionEvent) => {
    if (event.propertyName !== "width") return;
    if (phase === "hiding") {
      // Swap the text while the window is closed, then open onto the next message.
      setIndex((value) => (value + 1) % MESSAGES.length);
      setPhase("showing");
    } else if (phase === "showing") setPhase("shown");
  };

  const width = widths === null ? undefined : phase === "hiding" ? 0 : widths[index];

  return (
    // Same black as the footer, so the page opens and closes on the same colour.
    <div role="region" aria-label="Delivery information" className="relative overflow-hidden bg-foreground text-white">
      {/* Invisible copies used only to measure each message's width. */}
      <span aria-hidden="true" className="invisible absolute top-0 left-0 text-sm leading-6 font-semibold whitespace-nowrap">
        {MESSAGES.map((message, i) => (
          <span key={i} ref={(el) => { measureRefs.current[i] = el; }} className="inline-flex">
            {message}
          </span>
        ))}
      </span>
      <button
        type="button"
        onClick={() => setPaused((value) => !value)}
        aria-label={
          paused
            ? "Express delivery, arrives in just 3 days. Play animation"
            : "Express delivery, arrives in just 3 days. Pause animation"
        }
        className="flex min-h-11 w-full items-center justify-center py-2.5 focus-visible:outline-white focus-visible:outline-offset-[-3px]"
      >
        <span
          aria-hidden="true"
          onTransitionEnd={onWipeEnd}
          style={{ width, transitionDuration: `${WIPE}ms` }}
          className="inline-block overflow-hidden whitespace-nowrap transition-[width] ease-[cubic-bezier(0.37,0,0.63,1)] motion-reduce:transition-none"
        >
          <span className="inline-flex text-sm leading-6 font-semibold">{MESSAGES[index]}</span>
        </span>
      </button>
    </div>
  );
}
