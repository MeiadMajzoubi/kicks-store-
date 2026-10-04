import Link from "next/link";
import { Search, User, Heart, ShoppingBag } from "lucide-react";
import Image from "next/image";

const NAV_LINKS = [
  { label: "Women", href: "/women" },
  { label: "Men", href: "/men" },
  { label: "Brands", href: "/brands" },
  { label: "Sale", href: "/sale" },
];

const ACTIONS = [
  { label: "Search", icon: Search },
  { label: "Wishlist", icon: Heart },
  { label: "Cart", icon: ShoppingBag },
  { label: "Account", icon: User },
];

export default function Navbar() {
  return (
    <header className="w-full border-b border-border bg-background">
      <div className="content-shell grid grid-cols-[auto_1fr] items-center gap-x-2 pt-5 lg:min-h-24 lg:grid-cols-[1fr_auto_1fr] lg:gap-x-6 lg:py-5">
        <nav
          aria-label="Main navigation"
          className="col-span-2 row-start-2 mt-2 w-full lg:col-span-1 lg:col-start-1 lg:row-start-1 lg:mt-0"
        >
          <ul className="flex items-center justify-center gap-7 text-sm font-semibold lg:justify-start lg:gap-8">
            {NAV_LINKS.map(({ label, href }) => (
              <li key={href}>
                <Link
                  href={href}
                  className={`relative inline-flex min-h-11 items-center after:absolute after:bottom-1 after:left-0 after:h-px after:w-full after:origin-left after:scale-x-0 after:bg-current after:transition-transform after:duration-300 hover:after:scale-x-100 focus-visible:after:scale-x-100 ${
                    label === "Sale" ? "text-brand" : "text-foreground"
                  }`}
                >
                  {label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>

        <Link
          href="/"
          aria-label="Red Kicks home"
          className="col-start-1 row-start-1 w-fit rounded-sm lg:col-start-2 lg:justify-self-center"
        >
          <Image
            src="/text_kicks_black.svg"
            alt="Red Kicks"
            width={152}
            height={36}
            className="h-6 w-auto min-[360px]:h-7 sm:h-8 lg:h-9"
            preload
          />
        </Link>

        <div className="col-start-2 row-start-1 flex items-center justify-end gap-0 sm:gap-1 lg:col-start-3">
          {ACTIONS.map(({ label, icon: Icon }) => (
            <button
              key={label}
              type="button"
              aria-label={label}
              className="flex size-11 items-center justify-center rounded-full transition-colors duration-200 hover:text-brand"
            >
              <Icon aria-hidden="true" className="size-5" strokeWidth={1.75} />
            </button>
          ))}
        </div>
      </div>
    </header>
  );
}
