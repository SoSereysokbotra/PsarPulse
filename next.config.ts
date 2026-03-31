import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  async headers() {
    return [
      {
        source: "/sw.js",
        headers: [
          { key: "Cache-Control", value: "no-cache, no-store, must-revalidate" },
          { key: "Service-Worker-Allowed", value: "/" },
        ],
      },
    ];
  },
  serverExternalPackages: [],
  experimental: {
    optimizePackageImports: ["lucide-react"],
  },
  // @ts-ignore Next.js 15.x flag for ngrok dev usage
  allowedDevOrigins: ["logogrammatic-bryanna-justifyingly.ngrok-free.dev"],
};

export default nextConfig;
