import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    // Allowed `quality` values for next/image. 90 is the sharp-but-reasonable setting the
    // category and hero photos use; anything not listed here is rejected with a 400.
    qualities: [75, 90, 100],
  },
};

export default nextConfig;
