import type { Metadata } from "next";
import Link from "next/link";
import { buttonVariants } from "@/components/ui/button";

export const metadata: Metadata = {
  title: "Page not found",
};

/** Shown for any URL the store doesn't have, and for shoes or brands that don't exist. */
export default function NotFound() {
  return (
    <main
      id="main-content"
      tabIndex={-1}
      className="content-shell flex flex-1 flex-col items-center justify-center py-20 text-center outline-none sm:py-28"
    >
      {/* The condensed hero face, so the error still looks like Red Kicks. */}
      <p aria-hidden="true" className="font-display text-[clamp(6rem,22vw,13rem)] leading-[0.8] text-brand">
        404
      </p>
      <h1 className="section-title mt-6">We can’t find that page</h1>
      <p className="mt-3 max-w-[40ch] text-base text-foreground/75 sm:text-lg">
        The link may be broken, or the page may have moved.
      </p>

      <Link href="/" className={buttonVariants({ variant: "solid", size: "pill-lg", className: "mt-8" })}>
        Go to the home page
      </Link>
    </main>
  );
}
