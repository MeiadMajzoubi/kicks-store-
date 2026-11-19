/* Most product photos are cut-outs with a transparent background and the shoe at a standard size and
   height. Some are the shop's original studio photo with its grey backdrop; the shoe sits at a different
   size and height in each of those. This table says where the shoe is in each (as shares of the photo), so
   ProductPhoto can scale and move the photo until the shoe lands where the cut-outs have it.

   x0 and x1: left and right edge of the shoe. y1: bottom of the sole. k: brightness that turns the
   photo's backdrop into the card colour. Measured from the files; add a row for each new backdrop photo. */

export type Placement = {
  w: number;
  h: number;
  x0: number;
  x1: number;
  y1: number;
  /** Brightness that turns a grey backdrop into the card colour. */
  k: number;
  /** For a backdrop that is tinted (not neutral grey): a gain per colour channel instead of `k`. */
  kc?: [number, number, number];
  /** Dark or coloured shoe: the backdrop may be brighter than the card behind the shoe (a studio spotlight),
   *  so keep only what is darker than the card. Not for white shoes, which must stay white. */
  darken?: boolean;
};

export const PLACEMENTS: Record<string, Placement> = {
  "/Products/m14-green-o.avif": { w: 1728, h: 2160, x0: 0.0677, x1: 0.9329, y1: 0.725, k: 0.979, darken: true },
  "/Products/m18-2-o.avif": { w: 742, h: 922, x0: 0.0687, x1: 0.9313, y1: 0.6605, k: 0.996, darken: true },
  "/Products/m18-3-o.avif": { w: 742, h: 922, x0: 0.0687, x1: 0.9299, y1: 0.6562, k: 0.996, darken: true },
  "/Products/m20-2-o.avif": { w: 1728, h: 2160, x0: 0.0671, x1: 0.9323, y1: 0.7255, k: 0.976 },
  "/Products/m20-3-o.avif": { w: 1728, h: 2160, x0: 0.0671, x1: 0.9323, y1: 0.7255, k: 0.979 },
  "/Products/m20-4-o.avif": { w: 1728, h: 2160, x0: 0.0671, x1: 0.9323, y1: 0.7255, k: 0.976, darken: true },
  "/Products/m39-o.jpg": { w: 1200, h: 1200, x0: 0.06, x1: 0.9592, y1: 0.8675, k: 1.056, darken: true },
  "/Products/m40-o.webp": { w: 868, h: 980, x0: 0.0323, x1: 0.97, y1: 0.702, k: 1.052, darken: true },
  "/Products/m41-o.avif": { w: 1728, h: 2160, x0: 0.0677, x1: 0.9323, y1: 0.7255, k: 0.979, darken: true },
  "/Products/m7-2-o.jpg": { w: 1200, h: 1200, x0: 0.0325, x1: 0.9767, y1: 0.8825, k: 1.056, darken: true },
  "/Products/m7-3-o.jpg": { w: 1200, h: 1200, x0: 0.0292, x1: 0.9708, y1: 0.8742, k: 1.056, darken: true },
  "/Products/w11-2-o.avif": { w: 1728, h: 2160, x0: 0.0677, x1: 0.9317, y1: 0.7278, k: 0.976, darken: true },
  "/Products/w3-1-o.webp": { w: 868, h: 980, x0: 0.0323, x1: 0.97, y1: 0.702, k: 1.052 },
  "/Products/w3-2-o.webp": { w: 868, h: 980, x0: 0.0323, x1: 0.97, y1: 0.702, k: 1.056 },
  "/Products/w39-o.avif": { w: 1728, h: 2160, x0: 0.0677, x1: 0.9329, y1: 0.725, k: 0.976 },
  "/Products/w40-2-o.jpg": { w: 1200, h: 1200, x0: 0.035, x1: 0.9658, y1: 0.8742, k: 1.056, darken: true },
  "/Products/w9-2-o.avif": { w: 1728, h: 2160, x0: 0.0677, x1: 0.9323, y1: 0.7255, k: 0.976 },
  "/Products/w9-3-o.avif": { w: 1728, h: 2160, x0: 0.0694, x1: 0.9323, y1: 0.7241, k: 0.976, darken: true },
  "/Products/m5-grey-o.avif": { w: 2000, h: 2000, x0: 0.0575, x1: 0.875, y1: 0.671, k: 1.030, kc: [1.043, 1.025, 1.013] },
  "/Products/w38-o.avif": { w: 2000, h: 2000, x0: 0.063, x1: 0.8745, y1: 0.675, k: 1.030, kc: [1.043, 1.025, 1.013] },
  "/Products/w38-2-o.avif": { w: 2000, h: 2000, x0: 0.0575, x1: 0.875, y1: 0.671, k: 1.030, kc: [1.043, 1.025, 1.013] },
};
