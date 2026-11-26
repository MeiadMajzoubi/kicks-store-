"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import {
  Heart,
  ShoppingBag,
  User,
} from "lucide-react";
import { getTopBrandsByGender } from "@/data/brands";
import { useCartCount } from "@/lib/cart";
import type { Gender } from "@/lib/product-types";
import { useWishlist } from "@/lib/wishlist";
import type { SearchProduct } from "@/lib/products";
import SearchBar from "./SearchBar";
import CountBadge from "./CountBadge";
import { BrandsPanel, GenderPanel } from "./NavbarPanels";

type Panel = Gender | "brands";

const PANEL_LABELS: Record<Panel, string> = {
  women: "Women",
  men: "Men",
  brands: "Brands",
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
            <GenderPanel gender={shownPanel} brands={brandsByGender[shownPanel]} onNavigate={closePanel} />
          )}

          {shownPanel === "brands" && <BrandsPanel onNavigate={closePanel} />}
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
