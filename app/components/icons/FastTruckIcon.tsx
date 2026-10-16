// A delivery truck with speed lines: the store's sign for express delivery.
const line = {
  fill: "none",
  stroke: "currentColor",
  strokeWidth: 5,
  strokeLinejoin: "miter" as const,
  strokeLinecap: "butt" as const,
};

export default function FastTruckIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 120 100" aria-hidden="true" className={className}>
      {/* speed lines */}
      <path d="M6 30H18M2 40H18M10 50H18" {...line} />
      {/* cargo box + cab */}
      <path d="M22 66V18H76V66M76 32H96L108 46V66" {...line} />
      {/* bottom line with gaps for wheels */}
      <path d="M22 66H33M51 66H79M97 66H108" {...line} />
      {/* wheels */}
      <circle cx="42" cy="66" r="9" {...line} />
      <circle cx="88" cy="66" r="9" {...line} />
      {/* window */}
      <path d="M82 37H94L102 46H82Z" fill="currentColor" />
    </svg>
  );
}
