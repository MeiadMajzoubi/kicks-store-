"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import {
  ArrowRight,
  Heart,
  ShoppingBag,
  User,
} from "lucide-react";
import { alphabeticalBrands, brandsByGender } from "@/data/brands";
import { useCartCount } from "@/lib/cart";
import { useWishlist } from "@/lib/wishlist";
import SearchBar from "./SearchBar";

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



export default function Navbar() {
  const [activePanel, setActivePanel] = useState<Panel | null>(null);
  // The panel last opened: its content stays in place while the panel slides shut.
  const [lastPanel, setLastPanel] = useState<Panel>("women");
  const shownPanel = activePanel ?? lastPanel;
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
        className="relative z-50 w-full border-b border-border bg-background"
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
        <div className="content-shell grid grid-cols-[auto_1fr] items-center gap-x-2 pt-5 lg:min-h-24 lg:grid-cols-[1fr_auto_1fr] lg:gap-x-6 lg:py-5">
          <nav
            aria-label="Main navigation"
            className="col-span-2 row-start-2 mt-2 w-full lg:col-span-1 lg:col-start-1 lg:row-start-1 lg:mt-0"
          >
            <ul className="flex items-center justify-center gap-7 text-sm font-semibold lg:justify-start lg:gap-8">
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
                      className={`relative inline-flex min-h-11 items-center rounded-sm after:absolute after:bottom-1.5 after:left-0 after:h-0.5 after:w-full after:bg-foreground after:opacity-0 hover:after:opacity-100`}
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
                  className="relative inline-flex min-h-11 items-center rounded-sm text-brand after:absolute after:bottom-1.5 after:left-0 after:h-0.5 after:w-full after:bg-brand after:opacity-0 hover:after:opacity-100"
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
            <SearchBar onOpen={closePanel} />
            <Link
              href="/wishlist"
              onClick={closePanel}
              aria-label={savedCount ? `Wishlist, ${savedCount} saved` : "Wishlist"}
              className="relative flex size-11 items-center justify-center rounded-full transition-colors duration-200 hover:text-brand"
            >
              <Heart aria-hidden="true" className="size-5" strokeWidth={1.75} />
              {savedCount > 0 && <CountBadge count={savedCount} />}
            </Link>
            <button
              type="button"
              aria-label="Account"
              onClick={closePanel}
              className="flex size-11 items-center justify-center rounded-full transition-colors duration-200 hover:text-brand"
            >
              <User aria-hidden="true" className="size-5" strokeWidth={1.75} />
            </button>
            <Link
              href="/cart"
              onClick={closePanel}
              aria-label={bagCount ? `Bag, ${bagCount} ${bagCount === 1 ? "item" : "items"}` : "Bag"}
              className="relative flex size-11 items-center justify-center rounded-full transition-colors duration-200 hover:text-brand"
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
          className={`absolute inset-x-0 top-full overflow-hidden bg-background text-foreground transition-[max-height,visibility] duration-250 ease-out motion-reduce:transition-none ${
            isPanelOpen ? "visible max-h-[calc(100dvh-8rem)]" : "invisible max-h-0 delay-[0ms,250ms]"
          }`}
        >
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
              <div className="grid gap-x-10 gap-y-9 md:grid-cols-2 lg:grid-cols-[minmax(180px,0.9fr)_220px_minmax(0,1.8fr)]">
                <section aria-labelledby={`navbar-${shownPanel}-shoes`}>
                  <h2
                    id={`navbar-${shownPanel}-shoes`}
                    className="panel-title"
                  >
                    Shoes
                  </h2>

                  <ul>
                    <li>
                      <Link
                        href={`/${shownPanel}`}
                        prefetch={false}
                        onClick={closePanel}
                        className="inline-flex min-h-11 items-center text-[15px] font-medium transition-colors duration-150 hover:text-brand focus-visible:text-brand motion-reduce:transition-none"
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
                          className="inline-flex min-h-11 items-center text-[15px] leading-snug text-muted-foreground transition-colors duration-150 hover:text-brand focus-visible:text-brand motion-reduce:transition-none"
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

                  <ul className="grid w-full max-w-[220px] grid-cols-3 gap-2">
                    {SHOE_SIZES[shownPanel].map((size) => (
                      <li key={size}>
                        <Link
                          href={`/${shownPanel}?size=${encodeURIComponent(size)}`}
                          prefetch={false}
                          aria-label={`Browse ${PANEL_LABELS[shownPanel].toLowerCase()}'s shoes in size ${size}`}
                          onClick={closePanel}
                          className="flex min-h-12 items-center justify-center rounded-lg border border-border bg-background px-2 text-sm font-semibold transition-colors duration-150 hover:border-foreground hover:bg-foreground hover:text-white focus-visible:border-foreground focus-visible:bg-foreground focus-visible:text-white motion-reduce:transition-none"
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
                        <ArrowRight aria-hidden="true" className="size-4" />
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
                        <ArrowRight aria-hidden="true" className="size-4" />
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

/** Small red count on the wishlist and bag icons. */
function CountBadge({ count }: { count: number }) {
  return (
    <span
      aria-hidden="true"
      className="absolute top-2 right-1.5 flex h-3.5 min-w-3.5 items-center justify-center rounded-full bg-brand px-[3px] text-[9px] leading-none font-semibold text-white tabular-nums"
    >
      {count > 9 ? "9+" : count}
    </span>
  );
}
