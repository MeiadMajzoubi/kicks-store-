import Link from "next/link";

/** The slim footer on the checkout: only the two pages a shopper might need while paying. */
export default function CheckoutFooter() {
  return (
    <footer className="mt-12 border-t border-border">
      <nav aria-label="Help" className="content-shell flex flex-wrap items-center gap-x-6 py-3 text-sm">
        <Link href="/delivery" className="inline-flex min-h-11 items-center text-muted-foreground hover:text-foreground hover:underline hover:underline-offset-4">
          Delivery
        </Link>
        <Link href="/support" className="inline-flex min-h-11 items-center text-muted-foreground hover:text-foreground hover:underline hover:underline-offset-4">
          Support
        </Link>
      </nav>
    </footer>
  );
}
