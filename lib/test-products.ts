import { brands } from "@/data/brands";
import { productData } from "@/prisma/seed-data/products";
import type { Product } from "@/lib/products";

/*
 * Shoes for the tests, in the same shape Postgres returns, built from the seed data.
 * Tests use this instead of the real database, so they run fast and need no Docker.
 * Like the seed: an available size has stock, a sold-out size has stock 0.
 */
export const testProducts: Product[] = productData.map((product) => {
  const brand = brands.find((candidate) => candidate.name === product.brand)!;

  return {
    id: product.id,
    name: product.name,
    slug: product.slug,
    gender: product.gender,
    category: product.category,
    price: product.price,
    salePrice: product.salePrice ?? null,
    isNew: product.isNew,
    isFeatured: product.isFeatured,
    isTrending: product.isTrending ?? false,
    brandId: brand.slug,
    brand: { id: brand.slug, ...brand },
    variants: product.variants.map((variant, position) => {
      const variantId = `${product.id}-${position}`;
      return {
        id: variantId,
        position,
        colors: variant.colors,
        image: variant.image,
        images: variant.images,
        productId: product.id,
        sizes: [
          ...variant.sizes.available.map((value) => ({ value, stock: 5 })),
          ...variant.sizes.soldOut.map((value) => ({ value, stock: 0 })),
        ]
          .sort((a, b) => a.value - b.value)
          .map((size) => ({ id: `${variantId}-${size.value}`, variantId, ...size })),
      };
    }),
  };
});
