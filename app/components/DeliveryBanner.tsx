"use client";

import { useState } from "react";
import { Rocket } from "lucide-react";

export default function DeliveryBanner() {
  const [paused, setPaused] = useState(false);

  return (
    <div
      role="region"
      aria-label="Delivery information"
      className="overflow-hidden border-b border-border bg-surface"
    >
      <button
        type="button"
        onClick={() => setPaused((value) => !value)}
        aria-label={paused ? "Play delivery announcement" : "Pause delivery announcement"}
        className="delivery-banner block min-h-11 w-full overflow-hidden py-2 text-center focus-visible:outline-offset-[-3px]"
        data-paused={paused}
      >
        <span className="delivery-track">
          {[0, 1].map((copy) => (
            <span key={copy} aria-hidden="true" className="delivery-message flex items-center justify-center gap-2 px-4">
              <Rocket aria-hidden="true" className="size-4 shrink-0 text-brand" strokeWidth={1.75} />
              <span className="whitespace-nowrap text-[11px] font-medium leading-relaxed sm:text-xs">
                <span className="font-semibold text-brand">Express delivery</span>
                <span className="mx-1.5 text-muted-foreground">/</span>
                Arrives within 3 days
              </span>
            </span>
          ))}
        </span>
      </button>
    </div>
  );
}
