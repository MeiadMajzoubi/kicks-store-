"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { createPortal } from "react-dom";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { ArrowRight, ArrowUpRight, Clock, Search, X } from "lucide-react";
import { mockProducts } from "@/data/mockProducts";
import { searchProducts, suggest } from "@/lib/search";
import Price from "./Price";

type SearchBarProps = {
  // Lets the navbar close any open mega panel when search opens.
  onOpen?: () => void;
};

// Shown before the user types. Only brands and categories that exist in the catalogue.
const POPULAR_SEARCHES = [
  "Jordan",
  "Nike",
  "New Balance",
  "adidas",
  "Running",
  "Sandals",
];

const MAX_RESULTS = 6;

// Recent searches live only on this device; storage can be blocked, so every access is guarded.
const RECENT_KEY = "red-kicks:recent-searches";
const MAX_RECENT = 5;

function readRecent(): string[] {
  if (typeof window === "undefined") return [];
  try {
    const saved = JSON.parse(window.localStorage.getItem(RECENT_KEY) ?? "[]");
    return Array.isArray(saved) ? saved.filter((item) => typeof item === "string").slice(0, MAX_RECENT) : [];
  } catch {
    return [];
  }
}

function writeRecent(terms: string[]) {
  try {
    if (terms.length) window.localStorage.setItem(RECENT_KEY, JSON.stringify(terms));
    else window.localStorage.removeItem(RECENT_KEY);
  } catch {
    // Storage unavailable (private mode, blocked): recent searches just aren't kept.
  }
}

export default function SearchBar({ onOpen }: SearchBarProps) {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");
  // Only shown inside the overlay, which never renders on the server, so no hydration mismatch.
  const [recent, setRecent] = useState<string[]>(readRecent);

  const triggerRef = useRef<HTMLButtonElement>(null);
  const dialogRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const trimmed = query.trim();
  const matches = useMemo(() => searchProducts(mockProducts, trimmed).products, [trimmed]);
  const results = matches.slice(0, MAX_RESULTS);
  const suggestions = useMemo(() => suggest(trimmed), [trimmed]);
  const searchHref = `/search?q=${encodeURIComponent(trimmed)}`;

  // Newest first, no duplicates (ignoring case), at most five.
  const remember = (term: string) => {
    const next = [term, ...recent.filter((item) => item.toLowerCase() !== term.toLowerCase())].slice(0, MAX_RECENT);
    setRecent(next);
    writeRecent(next);
  };

  const clearRecent = () => {
    setRecent([]);
    writeRecent([]);
    inputRef.current?.focus();
  };

  const openSearch = () => {
    onOpen?.();
    setOpen(true);
  };

  const closeSearch = () => {
    setOpen(false);
    setQuery("");
    triggerRef.current?.focus();
  };

  // Lock page scroll and focus the input while the overlay is open.
  useEffect(() => {
    if (!open) return;

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    inputRef.current?.focus();

    return () => {
      document.body.style.overflow = previousOverflow;
    };
  }, [open]);

  const handleKeyDown = (event: React.KeyboardEvent<HTMLDivElement>) => {
    if (event.key === "Escape") {
      event.preventDefault();
      closeSearch();
      return;
    }

    // Keep Tab focus inside the overlay.
    if (event.key !== "Tab" || !dialogRef.current) return;

    const focusable = dialogRef.current.querySelectorAll<HTMLElement>(
      'a[href], button:not([disabled]), input:not([disabled])',
    );
    const first = focusable[0];
    const last = focusable[focusable.length - 1];

    if (event.shiftKey && document.activeElement === first) {
      event.preventDefault();
      last.focus();
    } else if (!event.shiftKey && document.activeElement === last) {
      event.preventDefault();
      first.focus();
    }
  };

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();
    if (!trimmed) return;

    remember(trimmed);
    setOpen(false);
    setQuery("");
    router.push(searchHref);
  };

  // Links inside the overlay navigate, so close without stealing focus back.
  const closeAfterNavigate = () => {
    setOpen(false);
    setQuery("");
  };

  return (
    <>
      <button
        ref={triggerRef}
        type="button"
        aria-label="Search"
        aria-haspopup="dialog"
        aria-expanded={open}
        onClick={openSearch}
        className="flex size-11 items-center justify-center rounded-full transition-colors duration-200 hover:text-brand"
      >
        <Search aria-hidden="true" className="size-5" strokeWidth={1.75} />
      </button>

      {open &&
        createPortal(
          <div
            className="fixed inset-0 z-[100]"
            onKeyDown={handleKeyDown}
          >
            {/* Backdrop: visible on desktop, where the panel doesn't fill the screen. */}
            <div
              aria-hidden="true"
              onClick={closeSearch}
              className="absolute inset-0 bg-foreground/40 animate-in fade-in duration-200 motion-reduce:animate-none"
            />

            <div
              ref={dialogRef}
              role="dialog"
              aria-modal="true"
              aria-label="Search"
              className="relative flex h-dvh flex-col bg-background text-foreground animate-in fade-in slide-in-from-top-4 duration-200 motion-reduce:animate-none lg:h-auto lg:max-h-[85dvh]"
            >
              {/* Top bar: mirrors the header grid so the logo stays in place. */}
              <div className="content-shell grid grid-cols-[1fr_auto] items-center gap-x-3 py-4 lg:min-h-24 lg:grid-cols-[1fr_minmax(0,640px)_1fr] lg:gap-x-6 lg:py-5">
                <Link
                  href="/"
                  aria-label="Red Kicks home"
                  onClick={closeAfterNavigate}
                  className="hidden w-fit rounded-sm lg:block"
                >
                  <Image
                    src="/text_kicks_black.svg"
                    alt="Red Kicks"
                    width={152}
                    height={36}
                    className="h-9 w-auto"
                  />
                </Link>

                <form role="search" onSubmit={handleSubmit} className="min-w-0">
                  <div className="flex h-12 items-center rounded-full bg-surface transition-colors duration-150 hover:bg-surface-hover focus-within:bg-surface-hover motion-reduce:transition-none">
                    <Search
                      aria-hidden="true"
                      className="ml-4 size-5 shrink-0 text-foreground"
                      strokeWidth={1.75}
                    />

                    <input
                      ref={inputRef}
                      type="text"
                      inputMode="search"
                      enterKeyHint="search"
                      name="q"
                      value={query}
                      onChange={(event) => setQuery(event.target.value)}
                      placeholder="Search sneakers, brands, styles"
                      aria-label="Search sneakers, brands, styles"
                      autoComplete="off"
                      className="h-full min-w-0 flex-1 bg-transparent px-3 text-base font-medium outline-none placeholder:font-normal placeholder:text-muted-foreground"
                    />

                    {query && (
                      <button
                        type="button"
                        aria-label="Clear search"
                        onClick={() => {
                          setQuery("");
                          inputRef.current?.focus();
                        }}
                        className="mr-1 flex size-10 shrink-0 items-center justify-center rounded-full text-muted-foreground transition-colors duration-150 hover:bg-surface-hover hover:text-foreground"
                      >
                        <X aria-hidden="true" className="size-4" strokeWidth={2} />
                      </button>
                    )}
                  </div>
                </form>

                <button
                  type="button"
                  onClick={closeSearch}
                  className="inline-flex min-h-11 items-center justify-self-end text-sm font-semibold transition-colors duration-150 hover:text-brand"
                >
                  Cancel
                </button>
              </div>

              {/* Body */}
              <div className="flex-1 overflow-y-auto border-t border-border">
                <div className="content-shell py-7 lg:py-9">
                  <div className="mx-auto max-w-[640px] lg:max-w-[1040px]">
                    {!trimmed && recent.length > 0 && (
                      <section aria-labelledby="search-recent" className="mb-8">
                        <div className="mb-4 flex items-center justify-between gap-4">
                          <h2 id="search-recent" className="text-sm font-medium text-muted-foreground">
                            Recent Searches
                          </h2>
                          <button
                            type="button"
                            onClick={clearRecent}
                            className="inline-flex min-h-11 items-center text-sm font-medium underline underline-offset-4 hover:text-brand"
                          >
                            Clear
                          </button>
                        </div>

                        <ul className="flex flex-wrap gap-3">
                          {recent.map((term) => (
                            <li key={term}>
                              <button
                                type="button"
                                onClick={() => {
                                  setQuery(term);
                                  inputRef.current?.focus();
                                }}
                                className="flex min-h-11 items-center gap-2 rounded-full border border-border px-5 text-base font-medium transition-colors duration-150 hover:border-foreground motion-reduce:transition-none"
                              >
                                <Clock aria-hidden="true" className="size-4 text-muted-foreground" strokeWidth={1.75} />
                                {term}
                              </button>
                            </li>
                          ))}
                        </ul>
                      </section>
                    )}

                    {!trimmed && (
                      <section aria-labelledby="search-popular">
                        <h2
                          id="search-popular"
                          className="mb-4 text-sm font-medium text-muted-foreground"
                        >
                          Popular Searches
                        </h2>

                        <ul className="flex flex-wrap gap-3">
                          {POPULAR_SEARCHES.map((term) => (
                            <li key={term}>
                              <button
                                type="button"
                                onClick={() => {
                                  setQuery(term);
                                  inputRef.current?.focus();
                                }}
                                className="flex min-h-11 items-center rounded-full bg-surface px-5 text-base font-medium transition-colors duration-150 hover:bg-surface-hover focus-visible:bg-surface-hover motion-reduce:transition-none"
                              >
                                {term}
                              </button>
                            </li>
                          ))}
                        </ul>
                      </section>
                    )}

                    {trimmed && suggestions.length > 0 && (
                      <section aria-labelledby="search-suggestions" className="mb-8">
                        <h2 id="search-suggestions" className="sr-only">
                          Suggestions
                        </h2>
                        <ul className="divide-y divide-border border-y border-border">
                          {suggestions.map((suggestion) => (
                            <li key={suggestion.href}>
                              <Link
                                href={suggestion.href}
                                onClick={() => {
                                  remember(trimmed);
                                  closeAfterNavigate();
                                }}
                                className="group flex min-h-14 items-center justify-between gap-4 text-base font-medium transition-colors duration-150 hover:text-brand"
                              >
                                <span>
                                  {suggestion.label}
                                  <span className="ml-2 text-sm font-normal text-muted-foreground">
                                    {suggestion.kind === "brand" ? "Brand" : "Style"}
                                  </span>
                                </span>
                                <ArrowUpRight
                                  aria-hidden="true"
                                  className="size-5 shrink-0 text-muted-foreground group-hover:text-brand"
                                  strokeWidth={1.5}
                                />
                              </Link>
                            </li>
                          ))}
                        </ul>
                      </section>
                    )}

                    {trimmed && results.length > 0 && (
                      <section aria-labelledby="search-results">
                        <div className="mb-5 flex items-center justify-between gap-4">
                          <h2
                            id="search-results"
                            className="text-sm font-semibold text-muted-foreground"
                          >
                            {matches.length} {matches.length === 1 ? "result" : "results"}
                          </h2>

                          <Link
                            href={searchHref}
                            onClick={() => {
                              remember(trimmed);
                              closeAfterNavigate();
                            }}
                            className="text-link"
                          >
                            View all
                            <ArrowRight aria-hidden="true" className="size-4" />
                          </Link>
                        </div>

                        <ul className="grid grid-cols-2 gap-x-4 gap-y-7 sm:grid-cols-3 lg:grid-cols-6">
                          {results.map((product) => (
                            <li key={product.id}>
                              <Link
                                href={`/products/${product.id}`}
                                prefetch={false}
                                onClick={closeAfterNavigate}
                                className="group block"
                              >
                                <div className="relative aspect-square overflow-hidden rounded-2xl bg-surface">
                                  <Image
                                    src={product.image}
                                    alt=""
                                    fill
                                    sizes="(min-width: 1024px) 160px, (min-width: 640px) 30vw, 45vw"
                                    className="object-contain p-2 transition-transform duration-300 group-hover:scale-105 motion-reduce:transition-none"
                                  />
                                </div>

                                <p className="mt-3 text-xs font-medium text-muted-foreground">
                                  {product.brand}
                                </p>
                                <p className="mt-0.5 line-clamp-2 text-sm font-semibold leading-snug group-hover:text-brand">
                                  {product.name}
                                </p>
                                <Price product={product} className="mt-1 text-sm font-medium" />
                              </Link>
                            </li>
                          ))}
                        </ul>
                      </section>
                    )}

                    {trimmed && results.length === 0 && suggestions.length === 0 && (
                      <p className="text-base">
                        No results for{" "}
                        <span className="font-semibold">&ldquo;{trimmed}&rdquo;</span>.
                        <span className="mt-1 block text-sm text-muted-foreground">
                          Check the spelling or try a brand name.
                        </span>
                      </p>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>,
          document.body,
        )}
    </>
  );
}