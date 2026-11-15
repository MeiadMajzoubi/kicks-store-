/** The words the store uses to describe a shoe. They match the enums in prisma/schema.prisma. */

export type Gender = "men" | "women";

export type ProductCategory =
  | "running"
  | "training"
  | "lifestyle"
  | "outdoor"
  | "sandals"
  | "uncategorized";

export type ProductColor =
  | "white"
  | "cream"
  | "grey"
  | "silver"
  | "black"
  | "brown"
  | "red"
  | "orange"
  | "yellow"
  | "green"
  | "blue"
  | "purple"
  | "pink"
  | "multi";

/** The order colours are listed and sorted in: light to dark, then the bright ones. */
export const COLOR_ORDER: ProductColor[] = [
  "white",
  "cream",
  "grey",
  "silver",
  "black",
  "brown",
  "red",
  "orange",
  "yellow",
  "green",
  "blue",
  "purple",
  "pink",
  "multi",
];
