import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { mockProducts } from "@/data/mockProducts";
import FastTruckIcon from "./icons/FastTruckIcon";

type IconProps = { className?: string };

const line = {
  fill: "none",
  stroke: "currentColor",
  strokeWidth: 5,
  strokeLinejoin: "miter" as const,
  strokeLinecap: "butt" as const,
};

function BoxesIcon({ className }: IconProps) {
  return (
    <svg viewBox="0 0 120 100" aria-hidden="true" className={className}>
      {/* top box */}
      <rect x="30" y="6" width="52" height="10" {...line} />
      <rect x="34" y="16" width="44" height="16" {...line} />
      <rect x="46" y="22" width="20" height="4" fill="currentColor" />
      {/* middle box */}
      <rect x="40" y="36" width="52" height="10" {...line} />
      <rect x="44" y="46" width="44" height="16" {...line} />
      <rect x="56" y="52" width="20" height="4" fill="currentColor" />
      {/* bottom box */}
      <rect x="26" y="66" width="52" height="10" {...line} />
      <rect x="30" y="76" width="44" height="16" {...line} />
      <rect x="42" y="82" width="20" height="4" fill="currentColor" />
    </svg>
  );
}

function SaleTagIcon({ className }: IconProps) {
  return (
    <svg viewBox="0 0 110 110" aria-hidden="true" className={className}>
      <g transform="rotate(35 55 55)">
        {/* tag */}
        <path d="M55 8L80 32V98H30V32Z" {...line} />
        {/* hole */}
        <circle cx="55" cy="26" r="5" fill="currentColor" />
        {/* percent sign */}
        <circle cx="45" cy="56" r="5" {...line} strokeWidth={4} />
        <circle cx="65" cy="78" r="5" {...line} strokeWidth={4} />
        <path d="M42 82L68 52" {...line} strokeWidth={4} />
      </g>
    </svg>
  );
}

function SupportIcon({ className }: IconProps) {
  return (
    <svg viewBox="0 0 110 110" aria-hidden="true" className={className}>
      {/* headband */}
      <path d="M20 62V52A35 35 0 0 1 90 52V62" {...line} />
      {/* ear cups */}
      <rect x="12" y="58" width="16" height="30" fill="currentColor" />
      <rect x="82" y="58" width="16" height="30" fill="currentColor" />
      {/* mic */}
      <path d="M90 88V94Q90 102 82 102H62" {...line} />
      <rect x="52" y="97" width="12" height="10" fill="currentColor" />
      {/* 24H */}
      <text
        x="55"
        y="60"
        textAnchor="middle"
        fontSize="22"
        fontWeight="800"
        fill="currentColor"
      >
        24H
      </text>
    </svg>
  );
}

// Like Foot Locker and JD Sports, each benefit states one concrete fact. Counts and the
// biggest discount come from the catalogue, so they stay true as products change.
const styleCount = mockProducts.length;
const brandCount = new Set(mockProducts.map((product) => product.brand)).size;
const biggestDiscount = Math.max(
  0,
  ...mockProducts.map((product) =>
    product.salePrice ? Math.round((1 - product.salePrice / product.price) * 100) : 0,
  ),
);

const advantages = [
  {
    title: "Fast Delivery",
    detail: "Express delivery, arrives within 3 days.",
    icon: FastTruckIcon,
    href: "/delivery",
  },
  {
    title: "Great Variety",
    detail: `${styleCount} styles from ${brandCount} brands.`,
    icon: BoxesIcon,
    href: "/shop",
  },
  {
    title: "Big Sales & Clearance",
    detail: biggestDiscount ? `Up to ${biggestDiscount}% off selected styles.` : "Sale styles added regularly.",
    icon: SaleTagIcon,
    href: "/sale",
  },
  {
    title: "24H Support",
    detail: "Our team is here around the clock.",
    icon: SupportIcon,
    href: "/support",
  },
];

export default function Advantages() {
  return (
    <section
      aria-labelledby="advantages-title"
      className="content-shell section-space border-t border-border"
    >
      <h2 id="advantages-title" className="section-title mb-8 sm:mb-10">Why choose us</h2>

      <ul className="grid grid-cols-2 gap-3 sm:gap-5 lg:grid-cols-4">
        {advantages.map(({ title, detail, icon: Icon, href }) => (
          <li key={title}>
            <Link
              href={href}
              className="group block h-full rounded-2xl"
            >
              <div className="flex h-full min-h-48 flex-col items-start justify-between gap-7 rounded-2xl border border-transparent bg-surface p-5 transition-colors duration-300 group-hover:border-border sm:min-h-56 sm:p-7">
                <Icon className="size-12 sm:size-14" />
                <div className="flex w-full items-end justify-between gap-3">
                  <div>
                    <h3 className="text-sm font-semibold leading-snug tracking-tight sm:text-base">{title}</h3>
                    <p className="mt-1 text-xs leading-relaxed text-muted-foreground sm:text-sm">{detail}</p>
                  </div>
                  <ArrowRight
                    aria-hidden="true"
                    className="mb-0.5 size-4 shrink-0 text-brand transition-transform duration-200 group-hover:translate-x-0.5"
                  />
                </div>
              </div>
            </Link>
          </li>
        ))}
      </ul>
    </section>
  );
}
