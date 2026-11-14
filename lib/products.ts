import { cache } from "react";
import { prisma } from "@/lib/prisma";

// What to load with each shoe: its brand, its colourways in order, and their sizes.
const productInclude = {
  brand: true,
  variants: {
    orderBy: { position: "asc" }, // Default colourway first.
    include: { sizes: { orderBy: { value: "asc" } } }, // Sizes from small to large.
  },
} as const;

// The one place that asks Postgres for shoes. Server pages import from here.
// cache(): if two parts of one page ask for the shoes, Postgres is only asked once.
export const getProducts = cache(() => prisma.product.findMany({ include: productInclude }));

// One shoe by its id, or null if there is no such shoe.
export const getProduct = cache((id: string) =>
  prisma.product.findUnique({ where: { id }, include: productInclude }),
);

// The type of one shoe, exactly as the database returns it.
export type Product = Awaited<ReturnType<typeof getProducts>>[number];

// A lighter list for the search bar, which runs in the browser on every page:
// only the fields search needs, so no sizes or stock are sent.
export const getSearchProducts = cache(() =>
  prisma.product.findMany({
    select: {
      id: true,
      name: true,
      gender: true,
      category: true,
      price: true,
      salePrice: true,
      brand: { select: { name: true } },
      variants: {
        orderBy: { position: "asc" },
        select: { colors: true, image: true },
      },
    },
  }),
);

export type SearchProduct = Awaited<ReturnType<typeof getSearchProducts>>[number];
