import { alphabeticalBrands } from "@/data/brands";
import { mockProducts, type Gender, type Product, type ProductCategory } from "@/data/mockProducts";
import { categoryLabel, categoryNoun } from "@/lib/catalog";

/*
 * Product search used by the search overlay and the /search page.
 * - Shopper words become filters: "mens running" = men + running.
 * - Synonyms: "slides" = sandals, "hiking" = outdoor.
 * - Small typos are forgiven: "addidas" finds Adidas, "nkie" finds Nike.
 * - Results are ranked: a match in the name beats a match in the colour.
 */

const GENDER_WORDS: Record<string, Gender> = {
  men: "men",
  mens: "men",
  man: "men",
  male: "men",
  women: "women",
  womens: "women",
  woman: "women",
  ladies: "women",
  female: "women",
};

const CATEGORY_WORDS: Record<string, ProductCategory> = {
  running: "running",
  run: "running",
  runner: "running",
  runners: "running",
  training: "training",
  train: "training",
  gym: "training",
  workout: "training",
  lifestyle: "lifestyle",
  casual: "lifestyle",
  outdoor: "outdoor",
  hiking: "outdoor",
  hike: "outdoor",
  trail: "outdoor",
  boots: "outdoor",
  boot: "outdoor",
  sandals: "sandals",
  sandal: "sandals",
  slides: "sandals",
  slide: "sandals",
  sliders: "sandals",
  flipflops: "sandals",
};

/** Words that just mean "shoes" and narrow nothing. */
const FILLER_WORDS = new Set(["shoe", "shoes", "sneaker", "sneakers", "trainers", "kicks", "pair", "for", "the", "and"]);

export type SearchResult = {
  products: Product[];
  /** Typos we corrected, e.g. { addidas: "Adidas" }, for a "Showing results for" note. */
  corrections: Record<string, string>;
};

function normalise(text: string) {
  return text
    .toLowerCase()
    .replace(/['’]s\b/g, "s") // men's → mens
    .replace(/[^a-z0-9.%\s-]/g, " ")
    .replace(/-/g, " ");
}

function words(text: string) {
  return normalise(text).split(/\s+/).filter(Boolean);
}

/** Edit distance with swaps counted as one edit (nkie → nike = 1). */
function distance(a: string, b: string) {
  const d = Array.from({ length: a.length + 1 }, (_, i) => [i, ...Array(b.length).fill(0)]);
  for (let j = 1; j <= b.length; j++) d[0][j] = j;
  for (let i = 1; i <= a.length; i++) {
    for (let j = 1; j <= b.length; j++) {
      const cost = a[i - 1] === b[j - 1] ? 0 : 1;
      d[i][j] = Math.min(d[i - 1][j] + 1, d[i][j - 1] + 1, d[i - 1][j - 1] + cost);
      if (i > 1 && j > 1 && a[i - 1] === b[j - 2] && a[i - 2] === b[j - 1]) {
        d[i][j] = Math.min(d[i][j], d[i - 2][j - 2] + 1);
      }
    }
  }
  return d[a.length][b.length];
}

/** How many typos a word of this length may contain. Short words must be exact. */
const allowedTypos = (term: string) => (term.length >= 7 ? 2 : term.length >= 4 ? 1 : 0);

type Field = { words: string[]; weight: number };

function fieldsOf(product: Product): Field[] {
  return [
    { words: words(product.name), weight: 3 },
    { words: words(product.brand), weight: 3 },
    { words: product.variants.flatMap((variant) => variant.colors), weight: 1 },
  ];
}

/** Best score for one search term against a product, and the word it matched. */
function scoreTerm(term: string, fields: Field[]) {
  let best = { score: 0, word: "" };
  for (const field of fields) {
    for (const word of field.words) {
      let score = 0;
      if (word === term) score = field.weight * 3;
      else if (word.startsWith(term) && term.length >= 2) score = field.weight * 2;
      else if (allowedTypos(term) && distance(term, word) <= allowedTypos(term)) score = field.weight;
      if (score > best.score) best = { score, word };
    }
  }
  return best;
}

export function searchProducts(products: readonly Product[], query: string): SearchResult {
  let gender: Gender | undefined;
  let category: ProductCategory | undefined;
  const terms: string[] = [];

  for (const word of words(query)) {
    if (GENDER_WORDS[word]) gender = GENDER_WORDS[word];
    else if (CATEGORY_WORDS[word]) category = CATEGORY_WORDS[word];
    else if (!FILLER_WORDS.has(word)) terms.push(word);
  }

  // An empty query finds nothing; one made only of filler words ("shoes") finds everything.
  if (!words(query).length) return { products: [], corrections: {} };

  const corrections: Record<string, string> = {};
  const scored: { product: Product; score: number }[] = [];

  for (const product of products) {
    if (gender && product.gender !== gender) continue;
    if (category && product.category !== category) continue;

    const fields = fieldsOf(product);
    const fixed: Record<string, string> = {};
    let total = 0;
    let matchedAll = true;
    for (const term of terms) {
      const { score, word } = scoreTerm(term, fields);
      if (!score) {
        matchedAll = false;
        break;
      }
      total += score;
      if (word !== term && !word.startsWith(term)) fixed[term] = word;
    }
    if (matchedAll) {
      scored.push({ product, score: total });
      Object.assign(corrections, fixed);
    }
  }

  scored.sort((a, b) => b.score - a.score);
  return { products: scored.map((entry) => entry.product), corrections };
}

export type Suggestion = { label: string; href: string; kind: "brand" | "style" };

/** Like the word maps above, but also accepts the start of a word ("run", "wom"). */
function lookup<T>(map: Record<string, T>, word: string): T | undefined {
  if (map[word]) return map[word];
  if (word.length < 3) return undefined;
  const key = Object.keys(map).find((candidate) => candidate.startsWith(word));
  return key ? map[key] : undefined;
}

/**
 * Shortcuts shown above the results while typing: brands and styles the words point to.
 * "nik" → Nike, "run" → Running Shoes, "mens run" → Men's Running Shoes.
 */
export function suggest(query: string, limit = 4): Suggestion[] {
  let gender: Gender | undefined;
  let category: ProductCategory | undefined;
  const terms: string[] = [];

  for (const word of words(query)) {
    const asGender = lookup(GENDER_WORDS, word);
    const asCategory = lookup(CATEGORY_WORDS, word);
    if (asGender && !gender) gender = asGender;
    else if (asCategory && !category) category = asCategory;
    else if (!FILLER_WORDS.has(word)) terms.push(word);
  }

  // Only brands that actually have shoes for the gender and style asked for.
  const stocked = new Set(
    mockProducts
      .filter((product) => (!gender || product.gender === gender) && (!category || product.category === category))
      .map((product) => product.brand),
  );
  const brands = alphabeticalBrands.filter((brand) =>
    stocked.has(brand.name) &&
    terms.some((term) =>
      words(brand.name).some(
        (word) =>
          (term.length >= 2 && word.startsWith(term)) ||
          (allowedTypos(term) > 0 && distance(term, word) <= allowedTypos(term)),
      ),
    ),
  );

  const params = (extra: Record<string, string | undefined>) => {
    const query = new URLSearchParams(
      Object.entries(extra).filter((entry): entry is [string, string] => Boolean(entry[1])),
    ).toString();
    return query ? `?${query}` : "";
  };
  const noun = gender ? categoryLabel(gender, category) : categoryNoun(category);
  const suggestions: Suggestion[] = brands.map((brand) => ({
    kind: "brand",
    label: gender || category ? `${brand.name} ${noun}` : brand.name,
    href: `/brands/${brand.slug}${params({ gender, category })}`,
  }));

  // Style shortcut only when no brand narrows it further.
  if (!brands.length && (gender || category)) {
    suggestions.push({
      kind: "style",
      label: noun === "Shoes" ? "All Shoes" : noun,
      href: gender ? `/${gender}${params({ category })}` : `/shop${params({ category })}`,
    });
  }

  return suggestions.slice(0, limit);
}
