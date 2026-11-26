import Link from "next/link";
import type { Gender } from "@/lib/product-types";
import type { CatalogFilters, Facets } from "@/lib/catalog";

const OTHER_GENDER: Record<Gender, Gender> = { men: "women", women: "men" };
const GENDER_WORD: Record<Gender, string> = { men: "men", women: "women" };

/**
 * Empty grid. When the cause is a brand this gender doesn't carry (UGG for men),
 * say so plainly and point to where that brand is sold; otherwise suggest removing filters.
 */
export default function EmptyResults({
  gender,
  basePath,
  filters,
  facets,
  otherGenderBrands,
  onClear,
}: {
  gender?: Gender;
  basePath: string;
  filters: CatalogFilters;
  facets: Facets;
  otherGenderBrands: string[];
  onClear: () => void;
}) {
  const unavailable = filters.brands.filter((brand) => !facets.brands.includes(brand));
  const brandIsTheCause = unavailable.length > 0 && unavailable.length === filters.brands.length;

  if (gender && brandIsTheCause) {
    return (
      <UnavailableBrands
        gender={gender}
        basePath={basePath}
        unavailable={unavailable}
        otherGenderBrands={otherGenderBrands}
      />
    );
  }

  return (
    <div className="rounded-lg bg-surface px-6 py-20 text-center">
      <p className="text-xl font-semibold tracking-[-0.01em]">No shoes match these filters</p>
      <p className="mt-2 text-[15px] text-muted-foreground">Remove a filter to see more styles.</p>
      <div className="mt-8 flex justify-center">
        <button type="button" onClick={onClear} className={PRIMARY_BUTTON}>
          Clear filters
        </button>
      </div>
    </div>
  );
}

const PRIMARY_BUTTON =
  "inline-flex min-h-12 items-center rounded-full bg-foreground px-6 text-[15px] font-medium text-background transition-opacity hover:opacity-85";
const SECONDARY_BUTTON =
  "inline-flex min-h-12 items-center rounded-full border border-border bg-background px-6 text-[15px] font-medium transition-colors hover:border-foreground";

function UnavailableBrands({
  gender,
  basePath,
  unavailable,
  otherGenderBrands,
}: {
  gender: Gender;
  basePath: string;
  unavailable: string[];
  otherGenderBrands: string[];
}) {
  const other = OTHER_GENDER[gender];
  const elsewhere = unavailable.filter((brand) => otherGenderBrands.includes(brand));

  const names = new Intl.ListFormat("en", { type: "conjunction" }).format(unavailable);
  return (
    <div className="rounded-lg bg-surface px-6 py-20 text-center">
      <p className="text-xl font-semibold tracking-[-0.01em]">
        {names} {unavailable.length === 1 ? "isn’t" : "aren’t"} available for {GENDER_WORD[gender]} right now
      </p>
      <p className="mx-auto mt-2 max-w-md text-[15px] text-muted-foreground">
        {elsewhere.length > 0
          ? `You can shop ${new Intl.ListFormat("en", { type: "conjunction" }).format(elsewhere)} in our ${GENDER_WORD[other]}'s range, or browse every ${GENDER_WORD[gender]}'s shoe.`
          : `Browse every ${GENDER_WORD[gender]}'s shoe instead.`}
      </p>
      <div className="mt-8 flex flex-wrap justify-center gap-3">
        {elsewhere.map((brand) => (
          <Link key={brand} href={`/${other}?brand=${encodeURIComponent(brand)}`} className={PRIMARY_BUTTON}>
            Shop {brand} for {GENDER_WORD[other]}
          </Link>
        ))}
        <Link href={basePath} className={elsewhere.length > 0 ? SECONDARY_BUTTON : PRIMARY_BUTTON}>
          Shop all {GENDER_WORD[gender]}&rsquo;s shoes
        </Link>
      </div>
    </div>
  );
}
