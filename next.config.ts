import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  experimental: {
    serverActions: {
      bodySizeLimit: '10mb',
    },
  },
  // Allow other devices in the same WiFi to access hot reload
  allowedDevOrigins: ['http://192.168.1.121:3000', '192.168.1.121'],
};

export default nextConfig;
