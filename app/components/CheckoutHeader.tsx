import Image from "next/image";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";

/** The slim header on the checkout: just the logo and the way back, so nothing pulls the shopper away. */
export default function CheckoutHeader() {
  return (
    <header className="border-b border-border bg-background">
      <div className="content-shell flex min-h-16 items-center justify-between gap-4">
        <Link href="/" aria-label="Red Kicks home" className="rounded-sm">
          <Image src="/text_kicks_black.svg" alt="Red Kicks" width={152} height={36} className="h-7 w-auto" preload />
        </Link>
        <Link href="/cart" className="text-link">
          <ArrowLeft aria-hidden="true" className="size-4" />
          Back to bag
        </Link>
      </div>
    </header>
  );
}
