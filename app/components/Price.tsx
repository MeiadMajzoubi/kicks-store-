const currency = new Intl.NumberFormat("en-US", {
  style: "currency",
  currency: "USD",
});

type PriceProps = {
  /** salePrice is missing or null when the shoe isn't on sale. */
  product: { price: number; salePrice?: number | null };
  className?: string;
};

/** className sets size and weight; defaults to small and medium. */
export default function Price({ product, className = "text-sm font-medium" }: PriceProps) {
  const { price, salePrice } = product;

  return (
    <p className={`tabular-nums ${className}`}>
      {salePrice ? (
        <>
          <span className="text-brand">{currency.format(salePrice)}</span>{" "}
          <s className="ml-1 text-[0.85em] font-normal text-muted-foreground">
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
