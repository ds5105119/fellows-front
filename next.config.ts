import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [new URL("https://object.iihus.com/**")],
    unoptimized: true,
  },
  turbopack: {
    resolveAlias: {
      html2canvas: "html2canvas-pro",
    },
  },
};

export default nextConfig;
