import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [new URL("https://object.iihus.com/**")],
  },
};

export default nextConfig;
