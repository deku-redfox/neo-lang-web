import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {hostname: "flagcdn.com", protocol: "https"},
      {hostname: "api.iconify.design", protocol: "https"},
      {hostname: "neo-lang.freelancejob.shop", protocol: "https"}
    ],
  },
};

export default nextConfig;
