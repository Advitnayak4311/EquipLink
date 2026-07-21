import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "http",
        hostname: "localhost",
        port: "8080",
        pathname: "/uploads/**",
      },
      {
        // Unsplash Images
        protocol: "https",
        hostname: "images.unsplash.com",
        pathname: "/**",
      },
      {
        // Render.com backend (production)
        protocol: "https",
        hostname: "*.onrender.com",
        pathname: "/uploads/**",
      },
    ],
  },
};

export default nextConfig;
