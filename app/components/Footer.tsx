import Link from "next/link";
import Image from "next/image";
import { CircleHelp, Package, RotateCcw, Truck } from "lucide-react";

const quickLinks = [
  { label: "Help & Contact Us", icon: CircleHelp, href: "/support" },
  { label: "Track My Order", icon: Package, href: "/orders/track" },
  { label: "Shipping & Delivery", icon: Truck, href: "/delivery" },
  { label: "Returns & Refunds", icon: RotateCcw, href: "/returns" },
];

const columns = [
  {
    title: "Legal Information",
    links: [
      { label: "Cookie Statement", href: "/legal/cookies" },
      { label: "Privacy Statement", href: "/legal/privacy" },
      { label: "Terms & Conditions", href: "/legal/terms" },
      { label: "Accessibility Statement", href: "/legal/accessibility" },
      { label: "Your Rights", href: "/legal/rights" },
    ],
  },
  {
    title: "About",
    links: [
      { label: "About Red Kicks", href: "/about" },
      { label: "Get Inspired - Blog", href: "/blog" },
      { label: "Press Contacts", href: "/press" },
      { label: "Careers", href: "/careers" },
      { label: "Product Sitemap", href: "/sitemap" },
    ],
  },
  {
    title: "Shop",
    links: [
      { label: "Women", href: "/women" },
      { label: "Men", href: "/men" },
      { label: "Brands", href: "/brands" },
      { label: "Exclusive Offers", href: "/offers" },
      { label: "Digital Gift Cards", href: "/gift-cards" },
      { label: "Sale", href: "/sale", highlight: true },
    ],
  },
];

const actions = [
  {
    title: "Shipping and delivery FAQ.",
    text: "Need answers?",
    button: "Read our FAQ",
    href: "/faq",
  },
  {
    title: "My orders",
    text: "Sign in to see orders you placed.",
    button: "See orders",
    href: "/orders",
  },
  {
    title: "24H Support",
    text: "Our team is here around the clock.",
    button: "Contact support",
    href: "/support",
  },
];

export default function Footer() {
  return (
    <footer className="mt-6 bg-foreground text-white sm:mt-10">
      <div className="content-shell">
        <div className="flex flex-col justify-between gap-4 border-b border-white/15 py-10 sm:flex-row sm:items-center sm:py-12">
          <Link href="/" aria-label="Red Kicks home" className="w-fit rounded-sm">
            <Image src="/text_kicks_white.svg" alt="Red Kicks" width={152} height={36} className="h-9 w-auto" />
          </Link>
          <p className="text-sm text-white/65">Your next pair starts here.</p>
        </div>
        {/* Quick links */}
        <ul className="grid grid-cols-2 gap-x-6 gap-y-2 border-b border-white/15 py-6 lg:grid-cols-4">
          {quickLinks.map(({ label, icon: Icon, href }) => (
            <li key={label}>
              <Link
                href={href}
                className="flex min-h-16 items-center gap-3 rounded-sm text-xs font-medium text-white/80 transition-colors duration-200 hover:text-white sm:text-sm"
              >
                <Icon aria-hidden="true" strokeWidth={1.5} className="size-5 shrink-0" />
                {label}
              </Link>
            </li>
          ))}
        </ul>

        {/* Link columns */}
        <div className="grid grid-cols-2 gap-x-6 gap-y-10 py-10 sm:py-14 lg:grid-cols-4 lg:gap-10">
          {columns.map((column) => (
            <nav key={column.title} aria-label={column.title}>
              <h2 className="mb-5 text-[11px] font-semibold uppercase tracking-[0.12em] text-white/90">
                {column.title}
              </h2>
              <ul className="space-y-1">
                {column.links.map((link) => (
                  <li key={link.label}>
                    <Link
                      href={link.href}
                      className={`inline-flex min-h-9 items-center rounded-sm text-sm transition-colors hover:text-white hover:underline hover:underline-offset-4 ${
                        link.highlight
                          ? "font-semibold text-red-300"
                          : "text-white/65"
                      }`}
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </nav>
          ))}

          {/* Action column */}
          <div className="col-span-2 space-y-6 sm:col-span-1">
            {actions.map((action) => (
              <div key={action.title}>
                <h2 className="text-sm font-semibold">{action.title}</h2>
                <p className="mb-3 mt-1 text-xs text-white/65">{action.text}</p>
                <Link
                  href={action.href}
                  className="inline-flex min-h-10 items-center justify-center rounded-full border border-white/25 px-5 text-xs font-medium transition-colors duration-200 hover:bg-white hover:text-foreground"
                >
                  {action.button}
                </Link>
              </div>
            ))}
          </div>
        </div>

        {/* Logo + copyright */}
        <div className="flex flex-col items-start justify-between gap-3 border-t border-white/15 py-6 sm:flex-row sm:items-center">
          <p className="text-xs text-white/60">
            © {new Date().getFullYear()} Red Kicks. All rights reserved.
          </p>
          <span className="text-xs text-white/60">Everyday favourites. Performance essentials.</span>
        </div>
      </div>

      {/* Disclaimer bar */}
      <div className="border-t border-white/15">
        <p className="content-shell py-4 text-[11px] text-white/60">
          Prices subject to change without notice. Products shown may not be
          available.
        </p>
      </div>
    </footer>
  );
}
