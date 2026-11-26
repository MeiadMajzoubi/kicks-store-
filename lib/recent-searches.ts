/*
 * Recent searches in the search overlay. Like the bag and wishlist they live only in this
 * browser's storage; storage can be blocked (private mode), so every access is guarded.
 */

const STORAGE_KEY = "red-kicks:recent-searches";
const MAX_RECENT = 5;

export function readRecentSearches(): string[] {
  if (typeof window === "undefined") return [];
  try {
    const saved = JSON.parse(window.localStorage.getItem(STORAGE_KEY) ?? "[]");
    return Array.isArray(saved) ? saved.filter((item) => typeof item === "string").slice(0, MAX_RECENT) : [];
  } catch {
    return [];
  }
}

export function saveRecentSearches(terms: string[]) {
  try {
    if (terms.length) window.localStorage.setItem(STORAGE_KEY, JSON.stringify(terms));
    else window.localStorage.removeItem(STORAGE_KEY);
  } catch {
    // Storage unavailable (private mode, blocked): recent searches just aren't kept.
  }
}

/** Adds a search to the list: newest first, no duplicates (ignoring case), at most five. */
export function addRecentSearch(terms: readonly string[], term: string) {
  return [term, ...terms.filter((item) => item.toLowerCase() !== term.toLowerCase())].slice(0, MAX_RECENT);
}
