import type { NextConfig } from "next";

const isDev = process.argv.includes("dev");
const isBuild = process.argv.includes("build");

if (!process.env.VELITE_STARTED && (isDev || isBuild)) {
  process.env.VELITE_STARTED = "1";
  void import("velite").then((module) =>
    module.build({ watch: isDev, clean: !isDev }),
  );
}

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "www.gravatar.com",
      },
    ],
  },
};

export default nextConfig;
