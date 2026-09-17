import { defineConfig } from "vitest/config";

export default defineConfig({
  test: {
    fsModuleCache: true,
    sharedViteServer: true,
    environment: "node",
    include: [
      "packages/*/test/**/*.{test,spec}.ts",
      "packages/*/src/**/*.{test,spec}.ts",
      "apps/*/test/**/*.{test,spec}.ts",
      "apps/*/src/**/*.{test,spec}.ts"
    ],
    coverage: {
      provider: "v8",
      reporter: ["text", "lcov"],
    },
  },
});
