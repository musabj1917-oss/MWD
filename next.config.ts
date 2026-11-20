import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  experimental: {
    serverActions: {
      // Quote requests can carry up to 5 compressed photos.
      bodySizeLimit: '4mb',
    },
  },
};

export default nextConfig;
