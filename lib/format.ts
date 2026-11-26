/** Prices as dollars and cents: $120.00. */
export const currency = new Intl.NumberFormat("en-US", { style: "currency", currency: "USD" });

/** Whole dollars, for savings: $25. */
export const wholeDollars = new Intl.NumberFormat("en-US", {
  style: "currency",
  currency: "USD",
  maximumFractionDigits: 0,
});
