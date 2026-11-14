import type { Metadata } from "next";
import { connection } from "next/server";
import { getProducts } from "@/lib/products";
import CheckoutView from "../components/checkout/CheckoutView";

export const metadata: Metadata = {
  title: "Checkout",
  description: "Check out your Red Kicks order.",
};

export default async function CheckoutPage() {
  // Built on every visit, so prices and sizes in stock are always current.
  await connection();
  const products = await getProducts();

  return (
    <main id="main-content" tabIndex={-1} className="content-shell flex-1 pt-8 pb-20 outline-none sm:pt-10">
      <CheckoutView products={products} />
    </main>
  );
}
