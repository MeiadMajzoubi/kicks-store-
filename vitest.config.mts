import { defineConfig } from "vitest/config";

export default defineConfig({
  resolve: { tsconfigPaths: true }, // understands @/lib/... imports
  test: {
    environment: "jsdom", // fake browser, for localStorage
  },
});
