import type { Metadata } from "next";
import CartView from "../components/cart/CartView";

export const metadata: Metadata = {
  title: "Bag",
  description: "Your Red Kicks shopping bag.",
};

export default function CartPage() {
  return (
    <main id="main-content" tabIndex={-1} className="content-shell flex-1 pt-8 pb-20 outline-none sm:pt-10">
      <div className="mx-auto max-w-[1120px]">
        <CartView />
      </div>
    </main>
  );
}
