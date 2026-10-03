import Link from "next/link";
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
    <footer className="mt-16 bg-white text-black">
      <div className="mx-auto max-w-[1920px] px-4 sm:px-8">
        {/* Quick links */}
        <ul className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {quickLinks.map(({ label, icon: Icon, href }) => (
            <li key={label}>
              <Link
                href={href}
                className="flex h-24 flex-col items-center justify-center gap-2 bg-neutral-100 text-sm font-medium transition-colors duration-300 hover:bg-neutral-200 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-red-600"
              >
                <Icon aria-hidden="true" strokeWidth={1.5} className="size-7" />
                {label}
              </Link>
            </li>
          ))}
        </ul>

        {/* Link columns */}
        <div className="grid gap-10 py-14 sm:grid-cols-2 lg:grid-cols-4">
          {columns.map((column) => (
            <nav key={column.title} aria-label={column.title}>
              <h2 className="mb-6 text-sm font-bold uppercase">
                {column.title}
              </h2>
              <ul className="space-y-4">
                {column.links.map((link) => (
                  <li key={link.label}>
                    <Link
                      href={link.href}
                      className={`text-sm transition-colors hover:underline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-red-600 ${
                        link.highlight
                          ? "font-bold text-red-600"
                          : "hover:text-red-600"
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
          <div className="space-y-8">
            {actions.map((action) => (
              <div key={action.title}>
                <h2 className="text-sm font-bold">{action.title}</h2>
                <p className="mb-4 mt-2 text-sm">{action.text}</p>
                <Link
                  href={action.href}
                  className="flex h-12 items-center justify-center border border-black text-sm font-medium uppercase transition-colors duration-300 hover:bg-black hover:text-white focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-red-600"
                >
                  {action.button}
                </Link>
              </div>
            ))}
          </div>
        </div>

        {/* Logo + copyright */}
        <div className="flex flex-col items-start justify-between gap-4 border-t border-neutral-200 py-8 sm:flex-row sm:items-center">
          <Link
            href="/"
            aria-label="Red Kicks home"
            className="text-3xl font-extrabold uppercase leading-none tracking-tight"
          >
            <span className="text-red-600">Red</span> Kicks
          </Link>
          <p className="text-xs text-neutral-500">
            © {new Date().getFullYear()} Red Kicks. All Rights Reserved
          </p>
        </div>
      </div>

      {/* Disclaimer bar */}
      <div className="border-t border-neutral-200">
        <p className="mx-auto max-w-[1920px] px-4 py-5 text-xs text-neutral-500 sm:px-8">
          Prices subject to change without notice. Products shown may not be
          available.
        </p>
      </div>
    </footer>
  );
}
