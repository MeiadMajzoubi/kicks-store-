import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { mockProducts } from "@/data/mockProducts";
import { categoryLabel } from "@/lib/catalog";
import Price from "../../components/Price";
import Ribbon from "../../components/Ribbon";
import ProductGallery from "../../components/product/ProductGallery";
import ProductPurchase from "../../components/product/ProductPurchase";

const findProduct = (id: string) => mockProducts.find((product) => product.id === id);

const saveFormat = new Intl.NumberFormat("en-US", {
  style: "currency",
  currency: "USD",
  maximumFractionDigits: 0,
});

export function generateStaticParams() {
  return mockProducts.map((product) => ({ id: product.id }));
}

// Only products in the catalogue have a page; anything else is a 404.
export const dynamicParams = false;

export async function generateMetadata({ params }: PageProps<"/products/[id]">): Promise<Metadata> {
  const product = findProduct((await params).id);
  if (!product) return {};
  return {
    title: product.name,
    description: `${product.name}: ${categoryLabel(product.gender, product.category)} at Red Kicks.`,
  };
}

export default async function ProductPage({ params }: PageProps<"/products/[id]">) {
  const product = findProduct((await params).id);
  if (!product) notFound();

  const variant = product.variants[0];
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
      {/* Capped widths keep the photo at a product-page size (about 620px) instead of
          filling the screen, with the buying panel close beside it. */}
      <div className="mx-auto grid max-w-[1120px] gap-8 lg:grid-cols-[minmax(0,620px)_minmax(0,400px)] lg:justify-center lg:gap-12 xl:gap-16">
        <div className="lg:sticky lg:top-6 lg:self-start">
          <ProductGallery images={variant.images} name={product.name} badge={badge} />
        </div>

        <div>
          <h1 className="text-2xl font-semibold leading-tight tracking-[-0.02em] sm:text-[28px]">{product.name}</h1>
          <p className="mt-1 text-base text-foreground/75">{categoryLabel(product.gender, product.category)}</p>
          <Price product={product} className="mt-4 text-lg font-semibold" />

          <div className="mt-8">
            <ProductPurchase productId={product.id} variant={0} sizes={variant.sizes} />
          </div>
        </div>
      </div>
    </main>
  );
}
