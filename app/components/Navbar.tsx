"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import {
  ArrowRight,
  ArrowUpRight,
  Heart,
  Search,
  ShoppingBag,
  User,
} from "lucide-react";
import { alphabeticalBrands } from "@/data/brands";

type Gender = "women" | "men";
type Panel = Gender | "brands" | "sale";

const PANEL_LABELS: Record<Panel, string> = {
  women: "Women",
  men: "Men",
  brands: "Brands",
  sale: "Sale",
};

const SHOE_CATEGORIES = [
  { name: "Running", slug: "running" },
  { name: "Training", slug: "training" },
  { name: "Lifestyle", slug: "lifestyle" },
  { name: "Outdoor", slug: "outdoor" },
  { name: "Sandals", slug: "sandals" },
];

// Reference size filters, not verified stock or a confirmed UK/US size system.
// Replace each department's values with its real catalogue sizes when available.
const REFERENCE_SIZES = [
  "6", "6.5", "7", "7.5", "8", "8.5", "9", "9.5",
  "10", "10.5", "11", "11.5", "12", "12.5", "13",
];

const SHOE_SIZES: Record<Gender, readonly string[]> = {
  women: REFERENCE_SIZES,
  men: REFERENCE_SIZES,
};

const ACTIONS = [
  { label: "Search", icon: Search },
  { label: "Wishlist", icon: Heart },
  { label: "Cart", icon: ShoppingBag },
  { label: "Account", icon: User },
];

const SALE_COLLECTIONS = [
  { name: "Men", href: "/sale?gender=men" },
  { name: "Women", href: "/sale?gender=women" },
];

export default function Navbar() {
  const [activePanel, setActivePanel] = useState<Panel | null>(null);

  const headerRef = useRef<HTMLElement>(null);
  const panelRef = useRef<HTMLElement>(null);
  const womenTriggerRef = useRef<HTMLButtonElement>(null);
  const menTriggerRef = useRef<HTMLButtonElement>(null);
  const brandsTriggerRef = useRef<HTMLButtonElement>(null);
  const saleTriggerRef = useRef<HTMLButtonElement>(null);

  const triggerRefs = {
    women: womenTriggerRef,
    men: menTriggerRef,
    brands: brandsTriggerRef,
    sale: saleTriggerRef,
  };

  const closePanel = () => setActivePanel(null);

  useEffect(() => {
    if (!activePanel) return;

    const handleOutsideClick = (event: PointerEvent) => {
      if (!headerRef.current?.contains(event.target as Node)) {
        setActivePanel(null);
      }
    };

    document.addEventListener("pointerdown", handleOutsideClick);

    return () => {
      document.removeEventListener("pointerdown", handleOutsideClick);
    };
  }, [activePanel]);

  return (
    <header
      ref={headerRef}
      className="relative z-50 w-full border-b border-border bg-background"
      onPointerLeave={(event) => {
        if (event.pointerType === "mouse") closePanel();
      }}
      onBlur={(event) => {
        if (
          !event.currentTarget.contains(event.relatedTarget as Node | null)
        ) {
          closePanel();
        }
      }}
      onKeyDown={(event) => {
        if (event.key !== "Escape" || !activePanel) return;

        event.preventDefault();

        triggerRefs[activePanel].current?.focus();
        closePanel();
      }}
    >
      <div className="content-shell grid grid-cols-[auto_1fr] items-center gap-x-2 pt-5 lg:min-h-24 lg:grid-cols-[1fr_auto_1fr] lg:gap-x-6 lg:py-5">
        <nav
          aria-label="Main navigation"
          className="col-span-2 row-start-2 mt-2 w-full lg:col-span-1 lg:col-start-1 lg:row-start-1 lg:mt-0"
        >
          <ul className="flex items-center justify-center gap-7 text-sm font-semibold lg:justify-start lg:gap-8">
            {(["women", "men", "brands", "sale"] as const).map((panel) => {
              const isOpen = activePanel === panel;

              return (
                <li key={panel}>
                  <button
                    ref={triggerRefs[panel]}
                    id={`navbar-${panel}-trigger`}
                    type="button"
                    aria-expanded={isOpen}
                    aria-controls="navbar-mega-panel"
                    onPointerEnter={(event) => {
                      if (event.pointerType === "mouse") {
                        setActivePanel(panel);
                      }
                    }}
                    onFocus={(event) => {
                      if (event.currentTarget.matches(":focus-visible")) {
                        setActivePanel(panel);
                      }
                    }}
                    onClick={() => {
                      setActivePanel((current) =>
                        current === panel ? null : panel,
                      );
                    }}
                    onKeyDown={(event) => {
                      if (event.key !== "ArrowDown") return;

                      event.preventDefault();
                      setActivePanel(panel);

                      requestAnimationFrame(() => {
                        panelRef.current
                          ?.querySelector<HTMLAnchorElement>("a")
                          ?.focus();
                      });
                    }}
                    className={`relative inline-flex min-h-11 items-center rounded-sm transition-colors duration-200 after:absolute after:bottom-1 after:left-0 after:h-0.5 after:w-full after:origin-left after:bg-red-600 after:transition-transform after:duration-200 motion-reduce:transition-none ${
                      isOpen
                        ? "text-red-600 after:scale-x-100"
                        : "after:scale-x-0 hover:text-red-600 hover:after:scale-x-100"
                    } ${panel === "sale" ? "text-red-600" : ""}`}
                  >
                    {PANEL_LABELS[panel]}
                  </button>
                </li>
              );
            })}
          </ul>
        </nav>

        <Link
          href="/"
          aria-label="Red Kicks home"
          onClick={closePanel}
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
              onClick={closePanel}
              className="flex size-11 items-center justify-center rounded-full transition-colors duration-200 hover:text-red-600"
            >
              <Icon
                aria-hidden="true"
                className="size-5"
                strokeWidth={1.75}
              />
            </button>
          ))}
        </div>
      </div>

      <nav
        ref={panelRef}
        id="navbar-mega-panel"
        aria-labelledby={
          activePanel ? `navbar-${activePanel}-trigger` : undefined
        }
        hidden={!activePanel}
        className={`absolute top-full max-h-[calc(100dvh-8rem)] overflow-y-auto border-b border-neutral-200 bg-white text-neutral-950 shadow-[0_20px_40px_-24px_rgba(0,0,0,0.25)] ${
          activePanel === "women" || activePanel === "men"
            ? "left-1/2 w-[calc(100%_-_2rem)] max-w-[1320px] -translate-x-1/2 border-x"
            : "inset-x-0"
        }`}
      >
        {(activePanel === "women" || activePanel === "men") && (
          <div className="px-6 py-7 sm:px-10 sm:py-9">
            <div className="mx-auto grid max-w-[1200px] gap-x-10 gap-y-9 md:grid-cols-2 lg:grid-cols-[minmax(180px,0.9fr)_220px_minmax(0,1.8fr)]">
              <section aria-labelledby={`navbar-${activePanel}-shoes`}>
                <h2
                  id={`navbar-${activePanel}-shoes`}
                  className="mb-5 text-xl font-semibold leading-7 tracking-tight"
                >
                  Shoes
                </h2>

                <ul>
                  <li>
                    <Link
                      href={`/${activePanel}`}
                      prefetch={false}
                      onClick={closePanel}
                      className="inline-flex min-h-12 items-center rounded-sm text-[17px] font-medium text-neutral-950 underline-offset-4 hover:underline"
                    >
                      All Shoes
                    </Link>
                  </li>
                  {SHOE_CATEGORIES.map((category) => (
                    <li key={category.slug}>
                      <Link
                        href={`/categories/${category.slug}?gender=${activePanel}`}
                        prefetch={false}
                        onClick={closePanel}
                        className="inline-flex min-h-12 items-center rounded-sm text-[17px] leading-snug text-neutral-600 transition-colors duration-150 hover:text-red-600 focus-visible:text-red-600 motion-reduce:transition-none"
                      >
                        {category.name}
                      </Link>
                    </li>
                  ))}
                </ul>
              </section>

              <section aria-labelledby={`navbar-${activePanel}-sizes`}>
                <h2
                  id={`navbar-${activePanel}-sizes`}
                  className="mb-5 text-xl font-semibold leading-7 tracking-tight"
                >
                  Shoes by Size
                </h2>

                <ul className="grid w-full max-w-[220px] grid-cols-3 gap-2.5">
                  {SHOE_SIZES[activePanel].map((size) => (
                    <li key={size}>
                      <Link
                        href={`/${activePanel}?size=${encodeURIComponent(size)}`}
                        prefetch={false}
                        aria-label={`Browse ${PANEL_LABELS[activePanel].toLowerCase()}'s shoes in size ${size}`}
                        onClick={closePanel}
                        className="flex min-h-[60px] items-center justify-center border border-neutral-200 bg-white px-2 text-sm font-semibold transition-colors duration-150 hover:border-neutral-950 hover:bg-neutral-950 hover:text-white focus-visible:border-neutral-950 focus-visible:bg-neutral-950 focus-visible:text-white motion-reduce:transition-none"
                      >
                        {size}
                      </Link>
                    </li>
                  ))}
                </ul>
              </section>

              <section
                aria-labelledby={`navbar-${activePanel}-brands`}
                className="md:col-span-2 lg:col-span-1 lg:border-l lg:border-neutral-200 lg:pl-8"
              >
                <h2
                  id={`navbar-${activePanel}-brands`}
                  className="mb-5 text-xl font-semibold leading-7 tracking-tight"
                >
                  Brands
                </h2>

                <ul className="grid grid-cols-2 gap-x-5 sm:gap-x-8">
                  {alphabeticalBrands.map((brand) => (
                    <li key={brand.slug}>
                      <Link
                        href={`/brands/${brand.slug}?gender=${activePanel}`}
                        prefetch={false}
                        onClick={closePanel}
                        className="group flex min-h-12 items-center gap-3 border-b border-neutral-200/70 text-neutral-700 transition-colors duration-150 hover:text-red-600 focus-visible:text-red-600 motion-reduce:transition-none"
                      >
                        <Image
                          src={brand.logo}
                          alt=""
                          width={56}
                          height={28}
                          className="h-7 w-14 shrink-0 object-contain brightness-0"
                        />
                        <span className="text-[13px] font-medium leading-snug sm:text-sm">
                          {brand.name}
                        </span>
                      </Link>
                    </li>
                  ))}

                  <li>
                    <Link
                      href="/brands"
                      onClick={closePanel}
                      className="inline-flex min-h-12 items-center gap-3 text-[15px] font-semibold text-red-600 transition-colors duration-150 hover:text-red-700 motion-reduce:transition-none"
                    >
                      <span className="underline underline-offset-4">
                        See all brands
                      </span>
                      <ArrowUpRight aria-hidden="true" className="size-4 shrink-0" strokeWidth={1.75} />
                    </Link>
                  </li>
                </ul>
              </section>
            </div>
          </div>
        )}

        {activePanel === "brands" && (
          <div className="content-shell py-7 sm:py-9">
            <div className="mx-auto max-w-[1320px]">
              <div className="mb-6 flex items-center justify-between gap-5">
                <h2 className="text-2xl font-semibold tracking-tight">
                  Brands
                </h2>
                <Link
                  href="/brands"
                  onClick={closePanel}
                  className="inline-flex min-h-11 items-center gap-3 text-[15px] font-semibold text-red-600 transition-colors duration-150 hover:text-red-700 motion-reduce:transition-none"
                >
                  <span className="underline underline-offset-4">
                    See all brands
                  </span>
                  <ArrowUpRight aria-hidden="true" className="size-4 shrink-0" strokeWidth={1.75} />
                </Link>
              </div>

              <ul className="grid grid-cols-2 gap-x-7 sm:grid-cols-3 lg:grid-cols-4 lg:gap-x-10">
                {alphabeticalBrands.map((brand) => (
                  <li key={brand.slug}>
                    <Link
                      href={`/brands/${brand.slug}`}
                      prefetch={false}
                      onClick={closePanel}
                      className="flex min-h-20 items-center gap-4 border-b border-neutral-200 text-neutral-700 transition-colors duration-150 hover:text-red-600 focus-visible:text-red-600 motion-reduce:transition-none"
                    >
                      <Image
                        src={brand.logo}
                        alt=""
                        width={88}
                        height={40}
                        className="h-10 w-16 shrink-0 object-contain brightness-0 sm:w-[88px]"
                      />
                      <span className="text-sm font-medium leading-snug">
                        {brand.name}
                      </span>
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        )}

        {activePanel === "sale" && (
          <div className="content-shell py-7 sm:py-9">
            <div className="mx-auto max-w-[1320px]">
              <div className="grid grid-cols-2 gap-x-8 gap-y-8 lg:grid-cols-[160px_160px_minmax(0,1fr)] lg:gap-x-12">
                {SALE_COLLECTIONS.map((collection) => (
                  <section
                    key={collection.name}
                    aria-labelledby={`sale-${collection.name.toLowerCase()}`}
                  >
                    <h2
                      id={`sale-${collection.name.toLowerCase()}`}
                      className="mb-3 text-lg font-semibold tracking-tight text-neutral-950"
                    >
                      {collection.name}
                    </h2>

                    <Link
                      href={collection.href}
                      prefetch={false}
                      onClick={closePanel}
                      className="inline-flex min-h-11 items-center rounded-sm text-[15px] text-neutral-600 decoration-red-600 underline-offset-4 transition-colors duration-150 hover:text-neutral-950 hover:underline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-red-600 motion-reduce:transition-none"
                    >
                      Shoes
                    </Link>
                  </section>
                ))}

                <section
                  aria-labelledby="sale-brands-heading"
                  className="col-span-2 border-t border-neutral-200 pt-6 lg:col-span-1 lg:border-l lg:border-t-0 lg:pl-10 lg:pt-0"
                >
                  <h2
                    id="sale-brands-heading"
                    className="mb-3 text-lg font-semibold tracking-tight text-neutral-950"
                  >
                    Brands
                  </h2>

                  <ul className="grid grid-cols-2 gap-x-6 sm:grid-cols-3 sm:gap-x-10">
                    {alphabeticalBrands.map((brand) => (
                      <li key={brand.slug}>
                        <Link
                          href={`/sale?brand=${encodeURIComponent(brand.slug)}`}
                          prefetch={false}
                          onClick={closePanel}
                          className="inline-flex min-h-11 items-center rounded-sm py-2 text-[15px] leading-snug text-neutral-600 decoration-red-600 underline-offset-4 transition-colors duration-150 hover:text-neutral-950 hover:underline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-red-600 motion-reduce:transition-none"
                        >
                          {brand.name}
                        </Link>
                      </li>
                    ))}
                  </ul>
                </section>
              </div>

              <div className="mt-7 border-t border-neutral-200 pt-3">
                <Link
                  href="/sale"
                  onClick={closePanel}
                  className="inline-flex min-h-11 items-center gap-2 rounded-sm text-sm font-medium text-red-600 underline-offset-4 hover:underline"
                >
                  View all sale
                  <ArrowRight
                    aria-hidden="true"
                    className="size-4"
                    strokeWidth={1.5}
                  />
                </Link>
              </div>
            </div>
          </div>
        )}
      </nav>
    </header>
  );
}
