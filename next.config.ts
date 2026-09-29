import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  reactStrictMode: true,
  // Monaco + Pyodide load from CDN / client only
  transpilePackages: ["@monaco-editor/react"],
};

export default nextConfig;
