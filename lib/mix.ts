/* The order shoes are shown in: the shop pages' "Featured" mix, the daily Trending pick and the
   colour ramp. Pure functions with fixed seeds, so the same input always gives the same order. */

type Mixable = {
  id: string;
  isNew: boolean;
  category: string;
  brand: { name: string };
  variants: { colors: string[] }[];
};

/** Numbers that look random but are always the same for the same seed (mulberry32). */
function seededRandom(seed: number) {
  let state = seed >>> 0;
  return () => {
    state = (state + 0x6d2b79f5) >>> 0;
    let t = state;
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

const mainColour = (product: Mixable) => product.variants[0]?.colors[0];

/** Spreads one group of shoes out so the same brand and the same colour rarely sit side by side. */
function spread<T extends Mixable>(items: readonly T[], random: () => number, before?: T): T[] {
  // Start from the id order, so the database's own order never matters, then shuffle with the seed.
  const shuffled = [...items].sort((a, b) => a.id.localeCompare(b.id));
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }

  // Each brand and each colour is spaced evenly down the list: a brand with 4 shoes lands about every
  // quarter. A shoe's planned spot is halfway between where its brand and its colour want it.
  const evenSpots = (key: (item: T) => string | undefined) => {
    const groups = new Map<string | undefined, T[]>();
    for (const item of shuffled) groups.set(key(item), [...(groups.get(key(item)) ?? []), item]);
    const spots = new Map<T, number>();
    for (const group of groups.values()) {
      const offset = random();
      group.forEach((item, k) => spots.set(item, (k + offset) / group.length));
    }
    return spots;
  };
  const brandSpot = evenSpots((item) => item.brand.name);
  const colourSpot = evenSpots(mainColour);
  const planned = [...shuffled].sort(
    (a, b) => brandSpot.get(a)! + colourSpot.get(a)! - (brandSpot.get(b)! + colourSpot.get(b)!),
  );

  // Then lay the shoes down one by one, following the plan but skipping a shoe that matches the one
  // before it: a different brand always, and where possible a different colour and type too (colour
  // counts more). A pick is only made if the shoes left can still avoid two of a brand side by side.
  const result: T[] = [];
  let previous = before;
  while (planned.length) {
    const differs = (item: T) => !previous || item.brand.name !== previous.brand.name;
    const variety = (item: T) =>
      !previous ? 0 : (mainColour(item) !== mainColour(previous) ? 2 : 0) + (item.category !== previous.category ? 1 : 0);
    const leavesRoom = (index: number, key: (item: Mixable) => string | undefined) =>
      canSeparate(planned.filter((_, j) => j !== index), planned[index], key);
    // Best: the colours left can still be kept apart too. Then a new colour, then a new type.
    const score = (index: number) => (leavesRoom(index, mainColour) ? 4 : 0) + variety(planned[index]);

    // Only the next few shoes in the plan are considered, so the varied ones aren't all used up early.
    let pick = -1;
    let considered = 0;
    for (let i = 0; i < planned.length && considered < 4; i++) {
      if (!differs(planned[i]) || !leavesRoom(i, (item) => item.brand.name)) continue;
      considered++;
      if (pick === -1 || score(i) > score(pick)) pick = i;
    }
    if (pick === -1) pick = planned.findIndex(differs);
    if (pick === -1) pick = 0;

    previous = planned.splice(pick, 1)[0];
    result.push(previous);
  }
  return result;
}

/**
 * Whether `rest` can follow `after` with no brand (or colour, by `key`) twice in a row: no value may
 * outnumber all the others plus one.
 */
function canSeparate(rest: readonly Mixable[], after: Mixable, key: (item: Mixable) => string | undefined) {
  const counts = new Map<string | undefined, number>();
  for (const item of rest) counts.set(key(item), (counts.get(key(item)) ?? 0) + 1);
  for (const [value, count] of counts) {
    const others = rest.length - count;
    // A value can fill every other spot; if it also matched `after`, it couldn't take the first one.
    if (count > others + (value === key(after) ? 0 : 1)) return false;
  }
  return true;
}

/**
 * The "Featured" order: new styles first, then the rest, each mixed so neighbours differ in brand,
 * colour and type. The same shoes and seed always give the same order, so a page doesn't jump between
 * visits. A different seed (Trending now uses the day) gives a different mix. `newFirst: false` mixes
 * new styles in with the rest.
 */
export function mixProducts<T extends Mixable>(products: readonly T[], seed = 1, { newFirst = true } = {}): T[] {
  const random = seededRandom(seed);
  if (!newFirst) return spread(products, random);
  const fresh = spread(products.filter((product) => product.isNew), random);
  const rest = spread(products.filter((product) => !product.isNew), random, fresh.at(-1));
  return [...fresh, ...rest];
}

/** Which 24-hour period a time (in milliseconds) falls in. It goes up by one every 24 hours. */
export const dayNumber = (time: number) => Math.floor(time / 86_400_000);

/** How many shoes each Trending tab shows. The pool is bigger, so the rest take a day off. */
export const TRENDING_PER_TAB = 20;

/** Phones show only the first few of each tab, as a short row you swipe. */
export const TRENDING_PER_TAB_PHONE = 8;

/** How far the day's window moves along the circle: about a third of the shoes are new each day. */
const TRENDING_STEP = 7;

/**
 * Picks `count` shoes from the pool for one day, as a rotation so every shoe gets the same turns:
 * the pool is laid out once in a fixed, well-mixed circle, and each day shows a window of `count`
 * shoes that moves on by TRENDING_STEP places. Because the circle is mixed by brand, any window keeps
 * each brand's share, so the day's shoes can still be ordered with no brand twice in a row.
 */
function pickForDay<T extends Mixable>(pool: readonly T[], count: number, day: number): T[] {
  if (pool.length <= count) return [...pool];
  const circle = mixProducts(pool, 1, { newFirst: false });
  const first = (((day * TRENDING_STEP) % circle.length) + circle.length) % circle.length;

  // Walk the circle from today's start. A brand never takes more than its share of the tab, rounded up
  // (12 Nike in 30 shoes: at most 4 of 8), so the day's shoes can always be ordered with no brand twice
  // in a row. A shoe skipped for that reason gets its turn on a later day.
  const brandTotal = new Map<string, number>();
  for (const item of pool) brandTotal.set(item.brand.name, (brandTotal.get(item.brand.name) ?? 0) + 1);
  const taken = new Map<string, number>();
  const picked: T[] = [];
  for (let k = 0; k < circle.length && picked.length < count; k++) {
    const item = circle[(first + k) % circle.length];
    const brand = item.brand.name;
    const cap = Math.ceil((brandTotal.get(brand)! * count) / pool.length);
    if ((taken.get(brand) ?? 0) >= cap) continue;
    taken.set(brand, (taken.get(brand) ?? 0) + 1);
    picked.push(item);
  }
  return picked;
}

/**
 * Trending now: for each tab (men, women), a different 20 of its trending shoes every 24 hours, mixed
 * so neighbours differ. The 24-hour period is the seed, so everyone sees the same shoes in the same
 * order for 24 hours, then both change. New styles are mixed in, not put first.
 */
export function trendingOrder<T extends Mixable & { gender: string }>(
  products: readonly T[],
  time: number,
  perTab = TRENDING_PER_TAB,
): T[] {
  const day = dayNumber(time);
  return (["men", "women"] as const).flatMap((gender) => {
    const today = pickForDay(
      products.filter((product) => product.gender === gender),
      perTab,
      day,
    );
    return mixProducts(today, day, { newFirst: false });
  });
}

/** The order colours run in on a wide Trending grid, so it reads like a palette: light neutrals, dark, warm, then cool. */
const COLOUR_RAMP = ["white", "cream", "silver", "grey", "black", "brown", "red", "orange", "yellow", "green", "blue", "purple", "pink", "multi"];

/**
 * Lays shoes out along the colour ramp (a wide screen reads left to right, row by row), so each stretch of
 * the grid is one colour family. Within that, a brand never sits next to itself, and where possible not
 * right above itself in the grid (`columns` is the grid's width). Shoes keep their given order inside a colour.
 */
export function colourRamp<T extends Mixable>(products: readonly T[], columns = 5): T[] {
  const rank = (product: T) => {
    const index = COLOUR_RAMP.indexOf(mainColour(product) ?? "");
    return index === -1 ? COLOUR_RAMP.length : index;
  };
  const brandOf = (item: Mixable) => item.brand.name;
  const rest = [...products].sort((a, b) => rank(a) - rank(b));
  const result: T[] = [];
  while (rest.length) {
    const previous = result.at(-1);
    const above = result.at(-columns);
    // The next few shoes along the ramp that fit: a different brand from the last, and the rest can still be separated.
    const fits: number[] = [];
    for (let i = 0; i < rest.length && fits.length < 4; i++) {
      if (previous && brandOf(rest[i]) === brandOf(previous)) continue;
      if (!canSeparate(rest.filter((_, j) => j !== i), rest[i], brandOf)) continue;
      fits.push(i);
    }
    const pick = fits.find((i) => !above || brandOf(rest[i]) !== brandOf(above)) ?? fits[0] ?? 0;
    result.push(...rest.splice(pick, 1));
  }
  return result;
}
