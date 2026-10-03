import Link from "next/link";
import { ArrowRight } from "lucide-react";

type IconProps = { className?: string };

const line = {
  fill: "none",
  stroke: "currentColor",
  strokeWidth: 5,
  strokeLinejoin: "miter" as const,
  strokeLinecap: "butt" as const,
};

function TruckIcon({ className }: IconProps) {
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

const advantages = [
  { title: "Fast Delivery", icon: TruckIcon, href: "/delivery" },
  { title: "Great Variety", icon: BoxesIcon, href: "/products" },
  { title: "Big Sales & Clearance", icon: SaleTagIcon, href: "/sale" },
  { title: "24H Support", icon: SupportIcon, href: "/support" },
];

export default function Advantages() {
  return (
    <section
      aria-labelledby="advantages-title"
      className="mx-auto max-w-[1920px] px-4 py-12 text-black sm:px-8"
    >
      <h2
        id="advantages-title"
        className="mb-8 text-center text-2xl font-bold sm:text-3xl"
      >
        Why Choose Us
      </h2>

      <ul className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
        {advantages.map(({ title, icon: Icon, href }) => (
          <li key={title}>
            <Link
              href={href}
              className="group block focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-red-600"
            >
              <div className="flex aspect-[6/5] flex-col items-center justify-center gap-8 bg-neutral-100 px-6 transition-colors duration-300 group-hover:bg-neutral-200">
                <Icon className="size-24 sm:size-28" />
                <h3 className="text-center text-xl font-extrabold uppercase leading-tight tracking-tight sm:text-2xl">
                  {title}
                </h3>
              </div>
            </Link>
          </li>
        ))}
      </ul>
    </section>
  );
}
