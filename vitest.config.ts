import { defineConfig } from "vitest/config";
import react from "@vitejs/plugin-react";
import path from "node:path";

export default defineConfig({
  plugins: [react()],
  test: {
    environment: "jsdom",
    exclude: ["**/node_modules/**", "**/e2e/**"],
    // Integration tests use the real database. Running them in parallel
    // with other test files can cause contention on the shared Postgres.
    // fileParallelism: false keeps the suite predictable.
    fileParallelism: false,
    setupFiles: ["./vitest.setup.ts"],
    coverage: {
      provider: "v8",
      reporter: ["text", "html"],
      include: ["src/**/*.{ts,tsx}"],
      exclude: [
        "**/.next/**",
        "**/node_modules/**",
        "**/test-results/**",
        "**/playwright-report/**",
        "**/e2e/**",
        "**/*.{test,spec}.{js,jsx,ts,tsx}",
      ],
    },
  },
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
});
