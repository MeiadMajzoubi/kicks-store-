"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import {
  Heart,
  ShoppingBag,
  User,
} from "lucide-react";
import { alphabeticalBrands, getTopBrandsByGender } from "@/data/brands";
import { useCartCount } from "@/lib/cart";
import { useWishlist } from "@/lib/wishlist";
import type { SearchProduct } from "@/lib/products";
import SearchBar from "./SearchBar";
import CountBadge from "./CountBadge";

type Gender = "women" | "men";
type Panel = Gender | "brands";

const PANEL_LABELS: Record<Panel, string> = {
  women: "Women",
  men: "Men",
  brands: "Brands",
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
  "6",
  "6.5",
  "7",
  "7.5",
  "8",
  "8.5",
  "9",
  "9.5",
  "10",
  "10.5",
  "11",
  "11.5",
  "12",
  "12.5",
  "13",
];

const SHOE_SIZES: Record<Gender, readonly string[]> = {
  women: REFERENCE_SIZES,
  men: REFERENCE_SIZES,
};



export default function Navbar({ searchProducts }: { searchProducts: SearchProduct[] }) {
  const [activePanel, setActivePanel] = useState<Panel | null>(null);
  // The panel last opened: its content stays in place while the panel slides shut.
  const [lastPanel, setLastPanel] = useState<Panel>("women");
  const shownPanel = activePanel ?? lastPanel;
  // The 5 brands with the most shoes for men / for women, worked out from the shoes in the database.
  const brandsByGender = getTopBrandsByGender(searchProducts);
  const isPanelOpen = activePanel !== null;
  const bagCount = useCartCount();
  const savedCount = useWishlist().length;

  const headerRef = useRef<HTMLElement>(null);
  const panelRef = useRef<HTMLElement>(null);
  const womenTriggerRef = useRef<HTMLButtonElement>(null);
  const menTriggerRef = useRef<HTMLButtonElement>(null);
  const brandsTriggerRef = useRef<HTMLButtonElement>(null);

  const triggerRefs = {
    women: womenTriggerRef,
    men: menTriggerRef,
    brands: brandsTriggerRef,
  };

  const openPanel = (panel: Panel) => {
    setActivePanel(panel);
    setLastPanel(panel);
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
    <>
      <header
        ref={headerRef}
        className="relative z-50 w-full border-b border-border/60 shadow-sm lg:sticky lg:top-0"
        onPointerLeave={(event) => {
          if (event.pointerType === "mouse") closePanel();
        }}
        onBlur={(event) => {
          if (!event.currentTarget.contains(event.relatedTarget as Node | null)) {
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
        {/* The bar is glass: the page shows through, blurred. It is its own layer (not the header itself),
            so the menu panel below can blur the page behind it too. */}
        <div aria-hidden="true" className="pointer-events-none absolute inset-0 -z-10 bg-background lg:bg-background/75 lg:backdrop-blur-xl lg:backdrop-saturate-150" />
        {/* Phones and tablets: logo and icons, then a full-width search field, then the menu as pills.
            Large screens: logo, menu in the middle, search and bag on the right. */}
        <div className="content-shell flex flex-wrap items-center gap-y-3 pt-4 pb-3 lg:grid lg:min-h-24 lg:grid-cols-[1fr_auto_1fr] lg:gap-x-6 lg:py-5">
          <nav
            aria-label="Main navigation"
            className="order-4 -mx-4 w-[calc(100%+2rem)] overflow-x-auto px-4 [scrollbar-width:none] sm:-mx-8 sm:w-[calc(100%+4rem)] sm:px-8 lg:order-none lg:col-start-2 lg:row-start-1 lg:mx-0 lg:w-full lg:overflow-visible lg:px-0"
          >
            <ul className="flex items-center gap-2 text-[15px] font-semibold lg:justify-center lg:gap-8">
              {(["women", "men", "brands"] as const).map((panel) => {
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
                          openPanel(panel);
                        }
                      }}
                      onFocus={(event) => {
                        if (event.currentTarget.matches(":focus-visible")) {
                          openPanel(panel);
                        }
                      }}
                      onClick={() => {
                        if (isOpen) closePanel();
                        else openPanel(panel);
                      }}
                      onKeyDown={(event) => {
                        if (event.key !== "ArrowDown") return;

                        event.preventDefault();
                        openPanel(panel);

                        requestAnimationFrame(() => {
                          panelRef.current
                            ?.querySelector<HTMLAnchorElement>("a")
                            ?.focus();
                        });
                      }}
                      className={`relative inline-flex h-10 shrink-0 items-center rounded-full border px-5 text-sm transition-colors duration-150 after:absolute after:bottom-1.5 after:left-0 after:hidden after:h-0.5 after:w-full after:bg-foreground after:opacity-0 hover:after:opacity-100 lg:h-auto lg:min-h-11 lg:rounded-sm lg:border-0 lg:px-0 lg:text-[15px] lg:after:block ${
                        isOpen ? "border-foreground bg-foreground text-background lg:bg-transparent lg:text-foreground" : "border-border"
                      }`}
                    >
                      {PANEL_LABELS[panel]}
                    </button>
                  </li>
                );
              })}
              {/* Few shoes are on sale, so Sale is a plain link to one page with its own filters. */}
              <li>
                <Link
                  href="/sale"
                  onClick={closePanel}
                  onPointerEnter={(event) => {
                    if (event.pointerType === "mouse") closePanel();
                  }}
                  className="relative inline-flex h-10 shrink-0 items-center rounded-full border border-border px-5 text-sm text-brand after:absolute after:bottom-1.5 after:left-0 after:hidden after:h-0.5 after:w-full after:bg-brand after:opacity-0 hover:after:opacity-100 lg:h-auto lg:min-h-11 lg:rounded-sm lg:border-0 lg:px-0 lg:text-[15px] lg:after:block"
                >
                  Sale
                </Link>
              </li>
            </ul>
          </nav>

          <Link
            href="/"
            aria-label="Red Kicks home"
            onClick={closePanel}
            className="order-1 w-fit rounded-sm lg:order-none lg:col-start-1 lg:row-start-1 lg:justify-self-start"
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

          <div className="contents lg:col-start-3 lg:row-start-1 lg:flex lg:items-center lg:justify-end lg:gap-1">
            <div className="order-3 w-full lg:order-none lg:w-auto">
              <SearchBar products={searchProducts} onOpen={closePanel} />
            </div>
            <Link
              href="/wishlist"
              onClick={closePanel}
              aria-label={savedCount ? `Wishlist, ${savedCount} saved` : "Wishlist"}
              className="relative order-2 ml-auto flex size-11 items-center justify-center rounded-full transition-colors duration-200 hover:text-brand lg:hidden"
            >
              <Heart aria-hidden="true" className="size-5" strokeWidth={1.75} />
              {savedCount > 0 && <CountBadge count={savedCount} />}
            </Link>
            <button
              type="button"
              aria-label="Account"
              onClick={closePanel}
              className="order-2 flex size-11 items-center justify-center rounded-full transition-colors duration-200 hover:text-brand lg:hidden"
            >
              <User aria-hidden="true" className="size-5" strokeWidth={1.75} />
            </button>
            <Link
              href="/cart"
              onClick={closePanel}
              aria-label={bagCount ? `Bag, ${bagCount} ${bagCount === 1 ? "item" : "items"}` : "Bag"}
              className="relative order-2 flex size-11 items-center justify-center rounded-full transition-colors duration-200 hover:text-brand lg:order-none"
            >
              <ShoppingBag aria-hidden="true" className="size-5" strokeWidth={1.75} />
              {bagCount > 0 && <CountBadge count={bagCount} />}
            </Link>
          </div>
        </div>

        <nav
          ref={panelRef}
          id="navbar-mega-panel"
          aria-labelledby={
            activePanel ? `navbar-${activePanel}-trigger` : undefined
          }
          inert={!isPanelOpen}
          aria-hidden={!isPanelOpen}
          className={`absolute inset-x-0 top-full overflow-hidden text-foreground transition-[max-height,visibility] duration-250 ease-out motion-reduce:transition-none ${
            isPanelOpen ? "visible max-h-[calc(100dvh-8rem)]" : "invisible max-h-0 delay-[0ms,250ms]"
          }`}
        >
          <div aria-hidden="true" className="pointer-events-none absolute inset-0 -z-10 bg-background lg:bg-background/80 lg:backdrop-blur-xl lg:backdrop-saturate-150" />
          {/* Links slide in after the panel opens (Nike's 200ms pause), keyed so switching
              between Women, Men and Brands replays it; on close they vanish quickly. */}
          <div
            key={isPanelOpen ? shownPanel : "closed"}
            className={`max-h-[calc(100dvh-8rem)] overflow-y-auto border-b border-border ${
              isPanelOpen ? "nav-panel-content" : "opacity-0 transition-opacity duration-100"
            }`}
          >
          {(shownPanel === "women" || shownPanel === "men") && (
            <div className="content-shell py-7 sm:py-9">
              <div className="grid gap-x-10 gap-y-7 md:grid-cols-2 lg:grid-cols-[minmax(180px,0.9fr)_220px_minmax(0,1.8fr)] lg:gap-y-9">
                <section aria-labelledby={`navbar-${shownPanel}-shoes`}>
                  <h2
                    id={`navbar-${shownPanel}-shoes`}
                    className="panel-title"
                  >
                    Shoes
                  </h2>

                  <ul className="flex flex-wrap gap-2 lg:block">
                    <li>
                      <Link
                        href={`/${shownPanel}`}
                        prefetch={false}
                        onClick={closePanel}
                        className="inline-flex h-10 items-center rounded-full border border-foreground px-4 text-sm font-medium transition-colors duration-150 hover:text-brand focus-visible:text-brand motion-reduce:transition-none lg:h-auto lg:min-h-11 lg:rounded-none lg:border-0 lg:px-0 lg:text-[15px]"
                      >
                        All Shoes
                      </Link>
                    </li>
                    {SHOE_CATEGORIES.map((category) => (
                      <li key={category.slug}>
                        <Link
                          href={`/${shownPanel}?category=${category.slug}`}
                          prefetch={false}
                          onClick={closePanel}
                          className="inline-flex h-10 items-center rounded-full border border-border px-4 text-sm leading-snug transition-colors duration-150 hover:text-brand focus-visible:text-brand motion-reduce:transition-none lg:h-auto lg:min-h-11 lg:rounded-none lg:border-0 lg:px-0 lg:text-[15px] lg:text-muted-foreground"
                        >
                          {category.name}
                        </Link>
                      </li>
                    ))}
                  </ul>
                </section>

                <section aria-labelledby={`navbar-${shownPanel}-sizes`}>
                  <h2
                    id={`navbar-${shownPanel}-sizes`}
                    className="panel-title"
                  >
                    Shoes by Size
                  </h2>

                  <ul className="grid w-full grid-cols-5 gap-2 lg:max-w-[220px] lg:grid-cols-3">
                    {SHOE_SIZES[shownPanel].map((size) => (
                      <li key={size}>
                        <Link
                          href={`/${shownPanel}?size=${encodeURIComponent(size)}`}
                          prefetch={false}
                          aria-label={`Browse ${PANEL_LABELS[shownPanel].toLowerCase()}'s shoes in size ${size}`}
                          onClick={closePanel}
                          className="flex min-h-11 items-center justify-center rounded-lg border border-border bg-background px-2 text-sm font-semibold transition-colors duration-150 hover:border-foreground lg:min-h-12 hover:bg-foreground hover:text-white focus-visible:border-foreground focus-visible:bg-foreground focus-visible:text-white motion-reduce:transition-none"
                        >
                          {size}
                        </Link>
                      </li>
                    ))}
                  </ul>
                </section>

                <section
                  aria-labelledby={`navbar-${shownPanel}-brands`}
                  className="md:col-span-2 lg:col-span-1 lg:border-l lg:border-border lg:pl-8"
                >
                  <h2
                    id={`navbar-${shownPanel}-brands`}
                    className="panel-title"
                  >
                    Brands
                  </h2>

                  <ul className="grid grid-cols-2 gap-x-5 sm:gap-x-8">
                    {brandsByGender[shownPanel].map((brand) => (
                      <li key={brand.slug}>
                        <Link
                          href={`/${shownPanel}?brand=${encodeURIComponent(brand.name)}`}
                          prefetch={false}
                          onClick={closePanel}
                          className="group flex min-h-12 items-center gap-3 border-b border-border text-muted-foreground transition-colors duration-150 hover:text-brand focus-visible:text-brand motion-reduce:transition-none"
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
                        className="text-link"
                      >
                        See all brands
                      </Link>
                    </li>
                  </ul>
                </section>
              </div>
            </div>
          )}

          {shownPanel === "brands" && (
            <div className="content-shell py-7 sm:py-9">
              <div>
                <div className="mb-6 flex items-center justify-between gap-5">
                  <h2 className="panel-title mb-0">
                    Brands
                  </h2>
                  <Link
                    href="/brands"
                    onClick={closePanel}
                    className="text-link"
                  >
                    See all brands
                  </Link>
                </div>

                <ul className="grid grid-cols-2 gap-x-7 sm:grid-cols-3 lg:grid-cols-4 lg:gap-x-10">
                  {alphabeticalBrands.map((brand) => (
                    <li key={brand.slug}>
                      <Link
                        href={`/brands/${brand.slug}`}
                        prefetch={false}
                        onClick={closePanel}
                        className="flex min-h-20 items-center gap-4 border-b border-border text-muted-foreground transition-colors duration-150 hover:text-brand focus-visible:text-brand motion-reduce:transition-none"
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
          </div>
        </nav>
      </header>

      {/* Page behind the open menu darkens slowly (800ms) and clears quickly (250ms). */}
      <div
        aria-hidden="true"
        onClick={closePanel}
        className={`fixed inset-0 z-40 bg-[rgb(17_17_17/0.36)] motion-reduce:transition-none ${
          isPanelOpen
            ? "visible opacity-100 transition-opacity duration-800 ease-in-out"
            : "invisible opacity-0 transition-[opacity,visibility] duration-250 delay-[0ms,250ms]"
        }`}
      />
    </>
  );
}
