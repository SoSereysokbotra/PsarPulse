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
  serverExternalPackages: ["mjml", "mjml-core"],
  experimental: {
    optimizePackageImports: ["lucide-react"],
  },
};

export default nextConfig;
