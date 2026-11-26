import { describe, expect, test } from "vitest";
import { addRecentSearch } from "@/lib/recent-searches";

describe("addRecentSearch", () => {
  test("puts the newest search first", () => {
    expect(addRecentSearch(["Nike", "Vans"], "Puma")).toEqual(["Puma", "Nike", "Vans"]);
  });

  test("moves a repeated search to the front instead of adding it twice, ignoring case", () => {
    expect(addRecentSearch(["Nike", "vans", "Puma"], "Vans")).toEqual(["Vans", "Nike", "Puma"]);
  });

  test("keeps at most five", () => {
    expect(addRecentSearch(["a", "b", "c", "d", "e"], "f")).toEqual(["f", "a", "b", "c", "d"]);
  });
});
