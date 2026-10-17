import type { NextConfig } from "next";

const nextConfig: NextConfig = {
    // Disable aggressive caching experiments for database-driven routes
    experimental: {
    },
};

export default nextConfig;
