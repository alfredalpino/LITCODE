import path from "node:path";
import { fileURLToPath } from "node:url";
import { defineConfig } from "vitest/config";

const root = path.dirname(fileURLToPath(import.meta.url));

export default defineConfig({
  resolve: {
    alias: {
      "@": path.resolve(root, "./src"),
    },
  },
  test: {
    environment: "node",
    include: ["tests/**/*.{test,spec}.ts", "src/**/*.{test,spec}.ts"],
    exclude: ["**/node_modules/**", "**/.next/**", "**/*-laboratory/**"],
    coverage: {
      provider: "v8",
      reporter: ["text", "json-summary"],
      include: ["src/lib/**/*.ts", "app/api/**/*.ts"],
    },
  },
});
