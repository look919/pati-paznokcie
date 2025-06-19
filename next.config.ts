import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  images: {
    // Default quality setting for all images
    // Lower value = smaller file sizes but lower quality
    // 75 is a good balance between quality and file size
    deviceSizes: [640, 750, 828, 1080, 1200, 1920, 2048],
    formats: ["image/webp", "image/avif"],
    minimumCacheTTL: 60 * 60 * 24 * 30, // 30 days
  },
};

export default nextConfig;
