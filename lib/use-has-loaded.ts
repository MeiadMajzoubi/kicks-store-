import { useSyncExternalStore } from "react";

const noop = () => () => {};

/**
 * False while the page is rendered on the server and during the browser's first paint, then true.
 * Pages that read the bag, wishlist or recent searches (stored in this browser) wait for it, so the
 * server's HTML and the browser's first render match.
 */
export const useHasLoaded = () => useSyncExternalStore(noop, () => true, () => false);
