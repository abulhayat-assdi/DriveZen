import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: "standalone",
  images: {
    // Seed placeholder art is SVG; Next serves it as-is (no raster optimization),
    // real product photos are pre-compressed to WebP at upload time.
    dangerouslyAllowSVG: true,
    contentDispositionType: "attachment",
    contentSecurityPolicy: "default-src 'self'; script-src 'none'; sandbox;",
    formats: ["image/webp"],
    qualities: [75, 80, 85],
  },
};

export default nextConfig;
