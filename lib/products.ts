import { prisma } from "@/lib/prisma";
import {
  withDefaults,
  type Product,
  type ProductData,
} from "@/data/mockProducts";

// ProductData: Defines the basic information a product needs.
// Product: Includes everything in ProductData plus 4 calculated properties.
// withDefaults: Takes ProductData, adds those 4 properties, and returns a complete Product.


// 1. Define which related data we want from the database.
const productInclude = {
  brand: true,

  variants: {
    orderBy: { position: "asc" }, // Sort variants by position: 1, 2, 3...
    include: {
      sizes: {
        orderBy: { value: "asc" }, // Sort sizes by value: 40, 41, 42.5...
      },
    },
  },
} as const; // Preserves exact values and types for Prisma's query.

// 2. Retrieve all products, including their related data.
const findRows = () =>
  prisma.product.findMany({ include: productInclude });


type ProductRow = Awaited<ReturnType<typeof findRows>>[number]; // Gets the type of one product returned by the database query, so TypeScript knows the structure of row inside toProduct().


// 4. Convert one database product into the frontend Product structure.
function toProduct(row: ProductRow): Product {
  return withDefaults({
    id: row.id,
    name: row.name,
    slug: row.slug,
    brand: row.brand.name,
    gender: row.gender,
    category: row.category,
    price: row.price,

    salePrice: row.salePrice ?? undefined, // If salePrice is null, use undefined instead.

    isNew: row.isNew,
    isFeatured: row.isFeatured,
    isTrending: row.isTrending,

    variants: row.variants.map((v) => ({
      colors: v.colors,
      image: v.image,
      images: v.images,

      sizes: {
        available: v.sizes
          .filter((s) => s.stock > 0)
          .map((s) => s.value),

        soldOut: v.sizes
          .filter((s) => s.stock === 0)
          .map((s) => s.value),
      },
    })),
  } as ProductData); // Tells TypeScript to treat this object as ProductData.
}


// 5. Fetch all products, convert each one, and return them.
export async function getProducts(): Promise<Product[]> {
  const rows = await findRows(); // Wait for the database query to finish.
  return rows.map(toProduct);    // Convert every database product into a frontend Product.
}