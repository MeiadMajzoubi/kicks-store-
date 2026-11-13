import { prisma } from "@/lib/prisma";

// The one place that asks Postgres for shoes. Pages import getProducts() from here.
export function getProducts() {
  return prisma.product.findMany({
    include: {
      brand: true, // Also load the brand of each shoe.
      variants: {
        orderBy: { position: "asc" }, // Default colourway first.
        include: { sizes: { orderBy: { value: "asc" } } }, // Sizes from small to large.
      },
    },
  });
}

// The type of one shoe, exactly as the database returns it.
export type Product = Awaited<ReturnType<typeof getProducts>>[number];
