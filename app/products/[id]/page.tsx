import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { connection } from "next/server";
import { getProduct } from "@/lib/products";
import { categoryLabel } from "@/lib/catalog";
import Price from "../../components/Price";
import Ribbon from "../../components/Ribbon";
import ProductDetail from "../../components/product/ProductDetail";

const saveFormat = new Intl.NumberFormat("en-US", {
  style: "currency",
  currency: "USD",
  maximumFractionDigits: 0,
});

export async function generateMetadata({ params }: PageProps<"/products/[id]">): Promise<Metadata> {
  const product = await getProduct((await params).id);
  if (!product) return {};
  return {
    title: product.name,
    description: `${product.name}: ${categoryLabel(product.gender, product.category)} at Red Kicks.`,
  };
}

export default async function ProductPage({ params, searchParams }: PageProps<"/products/[id]">) {
  // Built on every visit, not once at build time, so the sizes in stock are always current.
  await connection();
  // Only shoes in the database have a page; anything else is a 404.
  const product = await getProduct((await params).id);
  if (!product) notFound();

  // `?colour=1` opens the second colourway; anything that isn't a real colourway opens the first.
  const requested = Number((await searchParams).colour);
  const initialVariant = Number.isInteger(requested) && requested >= 0 && requested < product.variants.length ? requested : 0;
  const saving = product.salePrice ? product.price - product.salePrice : 0;

  const badge =
    saving > 0 ? (
      <Ribbon className="bg-brand" edge="#ff9ca0">
        Save {saveFormat.format(saving)}
      </Ribbon>
    ) : product.isNew ? (
      <Ribbon className="bg-foreground" edge="#cfcfcf">
        New
      </Ribbon>
    ) : null;

  return (
    <main id="main-content" tabIndex={-1} className="content-shell flex-1 pt-6 pb-20 outline-none sm:pt-10">
      {/* Capped widths (inside ProductDetail) keep the photo at a product-page size, about 620px,
          instead of filling the screen, with the buying panel close beside it. */}
      <ProductDetail
        productId={product.id}
        name={product.name}
        variants={product.variants}
        initialVariant={initialVariant}
        badge={badge}
        heading={
          <>
            <h1 className="text-2xl font-semibold leading-tight tracking-[-0.02em] sm:text-[28px]">{product.name}</h1>
            <p className="mt-1 text-base text-foreground/75">{categoryLabel(product.gender, product.category)}</p>
            <Price product={product} className="mt-4 text-lg font-semibold" />
          </>
        }
      />
    </main>
  );
}
