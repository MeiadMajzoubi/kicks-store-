import "dotenv/config";

import { prisma } from "@/lib/prisma";
import { brands } from "@/data/brands";
import { mockProducts } from "@/data/mockProducts";

async function main() {
  await prisma.product.deleteMany();
  await prisma.brand.deleteMany();

  for (const brand of brands) {
    await prisma.brand.create({
      data: { name: brand.name, slug: brand.slug, logo: brand.logo },
    });
  }

  console.log(`seeded ${brands.length} brands`);
}

main()
  .then(() => prisma.$disconnect())
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });
