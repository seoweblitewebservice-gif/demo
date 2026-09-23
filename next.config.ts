import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  async redirects() {
    return [
      // Broken / legacy tool slugs → live tools (fixes GSC 404s)
      {
        source: "/tools/multiple-radius-tool",
        destination: "/tools/multi-radius-map",
        permanent: true,
      },
      {
        source: "/tools/great-circle-calculator",
        destination: "/tools/crow-flies-distance",
        permanent: true,
      },
      {
        source: "/tools/gps-coordinate-lookup",
        destination: "/tools/latitude-longitude-finder",
        permanent: true,
      },
      {
        source: "/tools/map-radius-tool",
        destination: "/tools/map-radius",
        permanent: true,
      },
    ];
  },
};

export default nextConfig;
