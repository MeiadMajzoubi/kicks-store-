import type { Metadata } from "next";
import CheckoutView from "../components/checkout/CheckoutView";

export const metadata: Metadata = {
  title: "Checkout",
  description: "Check out your Red Kicks order.",
};

export default function CheckoutPage() {
  return (
    <main id="main-content" tabIndex={-1} className="content-shell flex-1 pt-8 pb-20 outline-none sm:pt-10">
      <CheckoutView />
    </main>
  );
}
