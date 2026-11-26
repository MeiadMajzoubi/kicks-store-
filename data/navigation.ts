import type { Gender } from "@/lib/product-types";

/** Shoe types listed in the Men and Women menus. */
export const SHOE_CATEGORIES = [
  { name: "Running", slug: "running" },
  { name: "Training", slug: "training" },
  { name: "Lifestyle", slug: "lifestyle" },
  { name: "Outdoor", slug: "outdoor" },
  { name: "Sandals", slug: "sandals" },
];

// Reference size filters, not verified stock or a confirmed UK/US size system.
// Replace each department's values with its real catalogue sizes when available.
const REFERENCE_SIZES = [
  "6",
  "6.5",
  "7",
  "7.5",
  "8",
  "8.5",
  "9",
  "9.5",
  "10",
  "10.5",
  "11",
  "11.5",
  "12",
  "12.5",
  "13",
];

export const SHOE_SIZES: Record<Gender, readonly string[]> = {
  women: REFERENCE_SIZES,
  men: REFERENCE_SIZES,
};

