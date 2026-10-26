import { arrivalDate, currency, type bagTotals } from "@/lib/checkout";

/**
 * The money block for the bag and checkout, laid out the way Apple does it: quiet rows,
 * one hairline, then a large total so the price is the thing you read.
 */
export default function OrderTotals({ totals }: { totals: ReturnType<typeof bagTotals> }) {
  return (
    <div>
      <dl className="grid gap-3 text-[15px]">
        <div className="flex justify-between gap-4">
          <dt>Subtotal</dt>
          <dd className="tabular-nums">{currency.format(totals.fullPrice)}</dd>
        </div>
        {totals.saving > 0 && (
          <div className="flex justify-between gap-4 text-brand">
            <dt>Sale savings</dt>
            <dd className="tabular-nums">−{currency.format(totals.saving)}</dd>
          </div>
        )}
        <div className="flex justify-between gap-4">
          <dt>
            Express delivery
            <span className="block text-sm text-muted-foreground">Arrives by {arrivalDate()}</span>
          </dt>
          <dd className="tabular-nums">{totals.delivery ? currency.format(totals.delivery) : "Free"}</dd>
        </div>
      </dl>

      {totals.toFreeDelivery > 0 && (
        <p className="mt-3 text-sm text-muted-foreground">
          Add <span className="font-semibold text-foreground tabular-nums">{currency.format(totals.toFreeDelivery)}</span> more
          for free delivery.
        </p>
      )}

      <div className="mt-5 flex items-baseline justify-between gap-4 border-t border-border pt-5">
        <span className="text-xl font-semibold tracking-[-0.02em]">Total</span>
        <span className="text-[28px] leading-none font-semibold tracking-[-0.03em] tabular-nums">
          {currency.format(totals.total)}
        </span>
      </div>
    </div>
  );
}
