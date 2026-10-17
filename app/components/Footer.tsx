import Link from "next/link";
import Image from "next/image";

type FooterLink = { label: string; href: string; highlight?: boolean };

// Only pages the store actually has: a small shop, so a small footer.
const COLUMNS: { title: string; links: FooterLink[] }[] = [
  {
    title: "Shop",
    links: [
      { label: "Women", href: "/women" },
      { label: "Men", href: "/men" },
      { label: "Brands", href: "/brands" },
      { label: "Sale", href: "/sale", highlight: true },
      { label: "All Shoes", href: "/shop" },
    ],
  },
  {
    title: "Help",
    links: [
      { label: "Delivery", href: "/delivery" },
      { label: "Support", href: "/support" },
    ],
  },
  {
    title: "Your stuff",
    links: [
      { label: "Bag", href: "/cart" },
      { label: "Wishlist", href: "/wishlist" },
    ],
  },
];

export default function Footer() {
  return (
    <footer className="mt-6 bg-foreground text-white sm:mt-10">
      {/* Same grid as the "Why choose us" cards just above (2 columns, 4 on large screens,
          same gaps), so each footer column starts where a card starts. */}
      <div className="content-shell grid grid-cols-2 gap-x-3 gap-y-10 pt-14 pb-12 sm:gap-x-5 sm:pt-16 lg:grid-cols-4">
        <Link href="/" aria-label="Red Kicks home" className="col-span-2 w-fit self-start rounded-sm lg:col-span-1">
          <Image src="/text_kicks_white.svg" alt="Red Kicks" width={152} height={36} className="h-8 w-auto" />
        </Link>

        {COLUMNS.map((column) => (
          <nav key={column.title} aria-label={column.title}>
            <h2 className="mb-4 text-sm font-semibold">{column.title}</h2>
            <ul className="space-y-1">
              {column.links.map((link) => (
                <li key={link.label}>
                  <Link
                    href={link.href}
                    className={`inline-flex min-h-9 items-center rounded-sm text-sm transition-colors duration-150 hover:text-white ${
                      link.highlight ? "font-medium text-red-300" : "text-white/60"
                    }`}
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>
        ))}
      </div>

      <div className="content-shell border-t border-white/10 py-6 text-xs text-white/50">
        <p>© {new Date().getFullYear()} Red Kicks</p>
      </div>
    </footer>
  );
}
