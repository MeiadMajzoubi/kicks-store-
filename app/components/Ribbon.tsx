import type { ReactNode } from "react";

/**
 * Corner ribbon: a band wrapped across a corner of the photo. The tile's rounded,
 * overflow-hidden edge cuts both ends, so it reads as wrapped around the card.
 */
export default function Ribbon({
  className,
  edge,
  children,
}: {
  className: string;
  /** Colour of the thin lines along both long edges of the band. */
  edge: string;
  children: ReactNode;
}) {
  return (
    <span
      style={{
        boxShadow: `inset 0 1px 0 ${edge}, inset 0 -1px 0 ${edge}, 0 2px 6px rgba(0, 0, 0, 0.18)`,
      }}
      className={`absolute top-[22px] z-10 w-[180px] py-1.5 text-center text-[13px] leading-none font-semibold text-white tabular-nums -left-[46px] -rotate-45 ${className}`}
    >
      {children}
    </span>
  );
}
