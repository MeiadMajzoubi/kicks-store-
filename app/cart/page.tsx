import type { Metadata } from "next";
import { connection } from "next/server";
import { getProducts } from "@/lib/products";
import CartView from "../components/cart/CartView";

export const metadata: Metadata = {
  title: "Bag",
  description: "Your Red Kicks shopping bag.",
};

export default async function CartPage() {
  // Built on every visit, so prices and sizes in stock are always current.
  await connection();
  const products = await getProducts();

  return (
    <main id="main-content" tabIndex={-1} className="content-shell flex-1 pt-8 pb-20 outline-none sm:pt-10">
      {/* Full page width, so the bag lines up with the logo and menu like every other page. */}
      <CartView products={products} />
    </main>
  );
}
