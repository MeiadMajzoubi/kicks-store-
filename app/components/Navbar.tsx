"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { ArrowRight, Heart, Search, ShoppingBag, User } from "lucide-react";
import { brands } from "@/data/brands";

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
  const [brandsOpen, setBrandsOpen] = useState(false);
  const headerRef = useRef<HTMLElement>(null);
  const brandsLinkRef = useRef<HTMLAnchorElement>(null);
  const panelRef = useRef<HTMLElement>(null);

  useEffect(() => {
    if (!brandsOpen) return;

    const closeOutside = (event: PointerEvent) => {
      if (!headerRef.current?.contains(event.target as Node)) {
        setBrandsOpen(false);
      }
    };

    document.addEventListener("pointerdown", closeOutside);

    return () => {
      document.removeEventListener("pointerdown", closeOutside);
    };
  }, [brandsOpen]);

  return (
    <header
      ref={headerRef}
      className="relative z-50 w-full border-b border-border bg-background"
      onMouseLeave={() => setBrandsOpen(false)}
      onBlur={(event) => {
        if (!event.currentTarget.contains(event.relatedTarget as Node | null)) {
          setBrandsOpen(false);
        }
      }}
      onKeyDown={(event) => {
        if (event.key === "Escape" && brandsOpen) {
          event.preventDefault();
          brandsLinkRef.current?.focus();
          setBrandsOpen(false);
        }
      }}
    >
      <div className="content-shell grid grid-cols-[auto_1fr] items-center gap-x-2 pt-5 lg:min-h-24 lg:grid-cols-[1fr_auto_1fr] lg:gap-x-6 lg:py-5">
        <nav
          aria-label="Main navigation"
          className="col-span-2 row-start-2 mt-2 w-full lg:col-span-1 lg:col-start-1 lg:row-start-1 lg:mt-0"
        >
          <ul className="flex items-center justify-center gap-7 text-sm font-semibold lg:justify-start lg:gap-8">
            {NAV_LINKS.map(({ label, href }) => (
              <li key={href} className="flex items-center">
                <Link
                  ref={label === "Brands" ? brandsLinkRef : undefined}
                  href={href}
                  aria-expanded={label === "Brands" ? brandsOpen : undefined}
                  aria-controls={
                    label === "Brands" ? "navbar-brands-panel" : undefined
                  }
                  onMouseEnter={() => setBrandsOpen(label === "Brands")}
                  onFocus={() => setBrandsOpen(label === "Brands")}
                  onClick={() => setBrandsOpen(false)}
                  onKeyDown={(event) => {
                    if (label === "Brands" && event.key === "ArrowDown") {
                      event.preventDefault();
                      setBrandsOpen(true);

                      requestAnimationFrame(() => {
                        panelRef.current
                          ?.querySelector<HTMLAnchorElement>("a")
                          ?.focus();
                      });
                    }
                  }}
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
          onClick={() => setBrandsOpen(false)}
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
              onClick={() => setBrandsOpen(false)}
              className="flex size-11 items-center justify-center rounded-full transition-colors duration-200 hover:text-brand"
            >
              <Icon aria-hidden="true" className="size-5" strokeWidth={1.75} />
            </button>
          ))}
        </div>
      </div>

      <nav
        ref={panelRef}
        id="navbar-brands-panel"
        aria-label="Shop by brand"
        hidden={!brandsOpen}
        className="absolute inset-x-0 top-full max-h-[calc(100dvh-7rem)] overflow-y-auto border-b border-border bg-white text-black shadow-[0_14px_24px_-16px_rgba(0,0,0,0.3)]"
      >
        <ul className="content-shell grid grid-cols-2 gap-2 py-5 sm:grid-cols-3 sm:gap-3 sm:py-7 lg:grid-cols-4 xl:grid-cols-6">
          {brands.map((brand) => (
            <li key={brand.slug}>
              <Link
                href={`/brands/${brand.slug}`}
                prefetch={false}
                aria-label={`Shop ${brand.name}`}
                onClick={() => setBrandsOpen(false)}
                className="flex h-24 items-center justify-center rounded-sm border border-neutral-200 bg-white px-5 focus-visible:outline-offset-[-3px] sm:h-28 sm:px-7"
              >
                <Image
                  src={brand.logo}
                  alt={brand.name}
                  width={220}
                  height={80}
                  className="h-16 w-full object-contain brightness-0"
                />
              </Link>
            </li>
          ))}

          <li>
            <Link
              href="/brands"
              onClick={() => setBrandsOpen(false)}
              className="flex h-24 items-center justify-center gap-2 rounded-sm border border-neutral-200 bg-white px-4 text-center text-sm font-semibold focus-visible:outline-offset-[-3px] sm:h-28"
            >
              See all brands
              <ArrowRight aria-hidden="true" className="size-4 shrink-0" />
            </Link>
          </li>
        </ul>
      </nav>
    </header>
  );
}
