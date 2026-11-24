import Image from "next/image";
import { PLACEMENTS } from "@/lib/product-images";

/** Where the shoe lands in a square box, as shares of the box. Measured on the store's cut-out photos. */
const TARGET = { width: 0.87, sole: 0.69 };

const pct = (value: number) => `${(value * 100).toFixed(3)}%`;

type ProductPhotoProps = {
  src: string;
  alt: string;
  sizes: string;
  /** Room kept round a cut-out inside the box, e.g. "p-[5%]". */
  inset: string;
  preload?: boolean;
  onError?: () => void;
  /** Extra classes for the photo itself (e.g. a hover effect). */
  className?: string;
  /** What the box sits on: the grey card colour (default) or the plain white page. A photo's backdrop is
   *  toned to match, so it never shows as a box. */
  surface?: "card" | "white";
};

/**
 * A product photo in a square box (a card or the product page). Cut-outs fill the box with a little room.
 * Photos that came with a grey studio backdrop are scaled and moved so the shoe is the same size and
 * stands on the same line as in the cut-outs, and their backdrop is toned to the card colour. The photo
 * file itself is never changed. The box must be `relative overflow-hidden` with the card colour behind.
 */
export default function ProductPhoto({ src, alt, sizes, inset, preload, onError, className = "", surface = "card" }: ProductPhotoProps) {
  const placement = PLACEMENTS[src];

  if (!placement) {
    return (
      <Image src={src} alt={alt} fill sizes={sizes} quality={100} preload={preload} onError={onError} className={`object-contain ${inset} ${className}`.trim()} />
    );
  }

  const { w, h, x0, x1, y1, k, kc, darken } = placement;
  // A tinted backdrop needs a different gain per colour channel; an SVG colour filter does that.
  const filterId = `tone-${surface}-${src.replace(/[^a-z0-9]/gi, "")}`;
  // The measured gains land on (244, 244, 242). Raise them to the colour behind the photo, the card
  // (--surface, #f5f5f3) or white, so the toned backdrop matches it exactly and never shows as a box.
  const toSurface = surface === "white" ? [255 / 244, 255 / 244, 255 / 242] : [245 / 244, 245 / 244, 243 / 242];
  const gain = kc ? kc.map((v, i) => +(v * toSurface[i]).toFixed(4)) : null;
  const scale = TARGET.width / (x1 - x0); // photo width as a share of the box
  const height = scale * (h / w); // photo height as a share of the box
  const left = 0.5 - scale * ((x0 + x1) / 2);
  const top = TARGET.sole - height * y1;

  // Studio backdrops are darker at the very top and bottom than in the middle. Fade the photo out there so
  // the card colour shows instead of a grey band. The stops are in card heights, turned into shares of the
  // photo. The shoe and its shadow sit between 0.30 and 0.76, well inside the solid part.
  const at = (cardY: number) => pct((cardY - top) / height);
  const fade = `linear-gradient(to bottom, transparent ${at(0)}, #000 ${at(0.12)}, #000 ${at(0.78)}, transparent ${at(0.98)})`;

  return (
    <>
      {kc && (
        <svg width="0" height="0" aria-hidden="true" focusable="false" className="absolute">
          <filter id={filterId} colorInterpolationFilters="sRGB">
            <feColorMatrix type="matrix" values={`${gain![0]} 0 0 0 0  0 ${gain![1]} 0 0 0  0 0 ${gain![2]} 0 0  0 0 0 1 0`} />
          </filter>
        </svg>
      )}
      <Image
        src={src}
        alt={alt}
        width={w}
        height={h}
        sizes={sizes}
        quality={100}
        preload={preload}
        onError={onError}
        className={`absolute max-w-none ${className}`.trim()}
        style={{
          left: pct(left),
          top: pct(top),
          width: pct(scale),
          height: "auto",
          filter: kc ? `url(#${filterId})` : `brightness(${+(k * toSurface[0] * (darken ? 1.035 : 1)).toFixed(4)})`,
          maskImage: fade,
          WebkitMaskImage: fade,
          mixBlendMode: darken ? "darken" : undefined,
        }}
      />
    </>
  );
}
