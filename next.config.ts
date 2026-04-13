import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "cdn.sanity.io",
      },
    ],
  },
  async headers() {
    return [
      {
        source: "/eats/:slug*",
        headers: [
          {
            key: "Content-Security-Policy",
            value: "frame-src 'self' https://www.tiktok.com;",
          },
        ],
      },
    ];
  },
};

export default nextConfig;
