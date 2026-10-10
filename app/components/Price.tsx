import type { Product } from "@/data/mockProducts";

const currency = new Intl.NumberFormat("en-US", {
  style: "currency",
  currency: "USD",
});

type PriceProps = {
  product: Pick<Product, "price" | "salePrice">;
  className?: string;
};

export default function Price({ product, className = "" }: PriceProps) {
  const { price, salePrice } = product;

  return (
    <p className={`text-sm font-medium tabular-nums ${className}`}>
      {salePrice ? (
        <>
          <span className="text-brand">{currency.format(salePrice)}</span>{" "}
          <s className="text-muted-foreground">
            <span className="sr-only">was </span>
            {currency.format(price)}
          </s>
        </>
      ) : (
        currency.format(price)
      )}
    </p>
  );
}
