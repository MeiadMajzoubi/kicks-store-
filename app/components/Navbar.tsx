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
    <header className="w-full border-b border-neutral-300 bg-white text-black">
      <div className="grid grid-cols-[1fr_auto_1fr] items-center gap-4 px-4 pt-5 pb-1 lg:px-12 lg:pt-7 lg:pb-1">
        <nav
          aria-label="Main navigation"
          className="col-span-3 row-start-2 justify-self-center lg:col-span-1 lg:col-start-1 lg:row-start-1 lg:justify-self-start"
        >
          <ul className="flex items-center gap-6 text-sm font-semibold lg:gap-8">
            {NAV_LINKS.map(({ label, href }) => (
              <li key={href}>
                <Link
                  href={href}
                  className={`relative inline-block py-3 after:absolute after:bottom-0 after:left-0 after:h-[2px] after:w-full after:origin-left after:scale-x-0 after:bg-current after:transition-transform after:duration-200 hover:after:scale-x-100 focus-visible:after:scale-x-100 motion-reduce:after:transition-none ${
                    label === "Sale" ? "text-red-600" : "text-black"
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
          className="col-start-1 row-start-1 justify-self-center -translate-y-4 lg:col-start-2"
        >
          <Image
            src="/text_kicks_black.svg"
            alt="Red Kicks"
            width={180}
            height={48}
            className="h-9 w-auto lg:h-9"
            priority
          />
        </Link>

        <div className="col-span-2 col-start-2 row-start-1 flex items-center justify-end gap-1 sm:gap-3 lg:col-span-1 lg:col-start-3 lg:gap-2">
          {ACTIONS.map(({ label, icon: Icon }) => (
            <button
              key={label}
              type="button"
              aria-label={label}
              className="flex size-10 items-center hover:text-red-600 justify-center rounded-full transition-colors  focus-visible:outline-2 focus-visible:outline-red-600"
            >
              <Icon aria-hidden="true" className="size-5" strokeWidth={2} />
            </button>
          ))}
        </div>
      </div>
    </header>
  );
}
