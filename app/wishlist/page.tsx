import type { Metadata } from "next";
import WishlistView from "../components/wishlist/WishlistView";

export const metadata: Metadata = {
  title: "Wishlist",
  description: "Shoes you saved at Red Kicks.",
};

export default function WishlistPage() {
  return (
    <main id="main-content" tabIndex={-1} className="content-shell flex-1 pt-8 pb-20 outline-none sm:pt-10">
      <WishlistView />
    </main>
  );
}
