import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  experimental: {
    serverActions: {
      // Quote requests can carry up to 5 compressed photos. Vercel rejects bodies above 4.5 MB.
      bodySizeLimit: '4mb',
    },
  },
};

export default nextConfig;
