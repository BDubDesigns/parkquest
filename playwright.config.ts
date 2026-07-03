import { config } from "dotenv";
config();
import { defineConfig, devices } from "@playwright/test";

export default defineConfig({
  testDir: "./e2e",

  // 4 workers balances speed against the risk of test isolation failures.
  // Most spec files use describe.serial so they share a browser context;
  // running more workers in parallel increases contention on the shared
  // Next.js dev server and the single Postgres database, which can cause
  // false-negative flake (auth cookie conflicts, DB unique-constraint
  // races, server overload timeouts).
  //
  // The canonical command `npm run test:e2e` uses this committed config.
  // CI should not override workers without evaluating flake risk.
  workers: 4,

  reporter: "html",
  use: {
    baseURL: "http://localhost:3000",
    trace: "on-first-retry",
  },
  projects: [
    {
      name: "mobile-chrome",
      use: { ...devices["Pixel 5"] },
    },
  ],
  webServer: {
    command: "npm run dev",
    url: "http://localhost:3000",
    reuseExistingServer: !process.env.CI,
    timeout: 120_000,
  },
});
