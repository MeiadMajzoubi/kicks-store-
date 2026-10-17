import Link from "next/link";
import Image from "next/image";

type FooterLink = { label: string; href: string; highlight?: boolean };

// Three short groups instead of quick links, columns and action cards that repeated each other.
const COLUMNS: { title: string; links: FooterLink[] }[] = [
  {
    title: "Help",
    links: [
      { label: "Help & Contact", href: "/support" },
      { label: "Track My Order", href: "/orders/track" },
      { label: "Shipping & Delivery", href: "/delivery" },
      { label: "Returns & Refunds", href: "/returns" },
      { label: "FAQ", href: "/faq" },
    ],
  },
  {
    title: "Shop",
    links: [
      { label: "Women", href: "/women" },
      { label: "Men", href: "/men" },
      { label: "Brands", href: "/brands" },
      { label: "Sale", href: "/sale", highlight: true },
      { label: "Gift Cards", href: "/gift-cards" },
    ],
  },
  {
    title: "Company",
    links: [
      { label: "About Red Kicks", href: "/about" },
      { label: "Blog", href: "/blog" },
      { label: "Press", href: "/press" },
      { label: "Careers", href: "/careers" },
    ],
  },
];

const LEGAL: FooterLink[] = [
  { label: "Privacy", href: "/legal/privacy" },
  { label: "Terms", href: "/legal/terms" },
  { label: "Cookies", href: "/legal/cookies" },
  { label: "Accessibility", href: "/legal/accessibility" },
];

export default function Footer() {
  return (
    <footer className="mt-6 bg-foreground text-white sm:mt-10">
      <div className="content-shell grid gap-12 pt-14 pb-12 sm:pt-16 lg:grid-cols-[1fr_auto] lg:gap-24">
        <Link href="/" aria-label="Red Kicks home" className="w-fit self-start rounded-sm">
          <Image src="/text_kicks_white.svg" alt="Red Kicks" width={152} height={36} className="h-8 w-auto" />
        </Link>

        <div className="grid grid-cols-2 gap-x-10 gap-y-10 sm:grid-cols-3 lg:gap-x-20">
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
      </div>

      <div className="content-shell flex flex-col gap-3 border-t border-white/10 py-6 text-xs text-white/50 sm:flex-row sm:items-center sm:justify-between">
        <p>© {new Date().getFullYear()} Red Kicks</p>
        <nav aria-label="Legal">
          <ul className="flex flex-wrap gap-x-6 gap-y-1">
            {LEGAL.map((link) => (
              <li key={link.label}>
                <Link
                  href={link.href}
                  className="inline-flex min-h-8 items-center rounded-sm transition-colors duration-150 hover:text-white"
                >
                  {link.label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>
      </div>
    </footer>
  );
}
