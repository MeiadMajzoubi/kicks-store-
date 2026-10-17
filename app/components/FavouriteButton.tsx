"use client";

import { Heart } from "lucide-react";
import { toggleWishlist, useIsSaved } from "@/lib/wishlist";

type FavouriteButtonProps = {
  productId: string;
  productName: string;
  variant?: number;
  className?: string;
};

/** A plain heart in the photo corner: tap to save the shoe to the wishlist, tap again to remove it. */
export default function FavouriteButton({ productId, productName, variant = 0, className = "" }: FavouriteButtonProps) {
  const saved = useIsSaved(productId);

  return (
    <button
      type="button"
      onClick={() => toggleWishlist(productId, variant)}
      aria-pressed={saved}
      aria-label={saved ? `Remove ${productName} from wishlist` : `Save ${productName} to wishlist`}
      className={`flex size-10 items-center justify-center rounded-full text-foreground/70 transition-[color,transform] duration-100 hover:text-brand active:scale-90 ${className}`}
    >
      <Heart
        aria-hidden="true"
        strokeWidth={1.75}
        className={`size-5 transition-colors duration-150 ${saved ? "fill-brand text-brand" : ""}`}
      />
    </button>
  );
}
