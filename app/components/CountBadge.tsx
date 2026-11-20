/** Small red count on the wishlist and bag icons. Place it inside a `relative` icon box. */
export default function CountBadge({ count }: { count: number }) {
  return (
    <span
      aria-hidden="true"
      className="absolute top-2 right-1.5 flex h-3.5 min-w-3.5 items-center justify-center rounded-full bg-brand px-[3px] text-[9px] leading-none font-semibold text-white tabular-nums"
    >
      {count > 9 ? "9+" : count}
    </span>
  );
}
