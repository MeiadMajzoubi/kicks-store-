import "dotenv/config";

import { prisma } from "@/lib/prisma";
import { brands } from "@/data/brands";
import { mockProducts } from "@/data/mockProducts";

const randomStock = () => Math.floor(Math.random() * 10) + 1;

async function main() {
  await prisma.product.deleteMany();
  await prisma.brand.deleteMany();

  for (const brand of brands) {
    await prisma.brand.create({
      data: { name: brand.name, slug: brand.slug, logo: brand.logo },
    });
  }
  console.log(`seeded ${brands.length} brands`);

  for (const p of mockProducts) {
    if (p.isNew && p.salePrice) {
      throw new Error(`${p.id} is new and on sale`);
    }

    await prisma.product.create({
      data: {
        id: p.id,
        name: p.name,
        slug: p.slug,
        gender: p.gender,
        category: p.category,
        price: p.price,
        salePrice: p.salePrice,
        isNew: p.isNew,
        isFeatured: p.isFeatured,
        isTrending: p.isTrending ?? false,
        brand: { connect: { name: p.brand } },

        variants: {
          create: p.variants.map((v, i) => ({
            position: i,
            colors: v.colors,
            image: v.image,
            images: v.images,

            sizes: {
              create: [
                ...v.sizes.available.map((value) => ({
                  value,
                  stock: randomStock(),
                })),
                ...v.sizes.soldOut.map((value) => ({ value, stock: 0 })),
              ],
            },
          })),
        },
      },
    });
  }
  console.log(`seeded ${mockProducts.length} products`);
}

main()
  .then(() => prisma.$disconnect())
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });
