"use client";

import type { ReactNode } from "react";
import { usePathname } from "next/navigation";
import CheckoutFooter from "./CheckoutFooter";
import CheckoutHeader from "./CheckoutHeader";

/**
 * The header and footer around every page. On the checkout they are swapped for slim ones (logo and a
 * way back; two help links), the way Nike and Foot Locker do, so nothing pulls the shopper away mid-order.
 * The full ones come from the server layout and are passed in.
 */
export default function SiteChrome({ header, footer, children }: { header: ReactNode; footer: ReactNode; children: ReactNode }) {
  const pathname = usePathname();
  const checkout = pathname === "/checkout" || pathname.startsWith("/checkout/");

  return (
    <>
      {checkout ? <CheckoutHeader /> : header}
      {children}
      {checkout ? <CheckoutFooter /> : footer}
    </>
  );
}
