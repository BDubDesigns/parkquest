import { defineConfig } from "drizzle-kit";
import { assertSafeDatabaseUrl, getDatabaseUrl } from "./src/db/connection-url";

assertSafeDatabaseUrl();

export default defineConfig({
  out: "./drizzle",
  schema: "./src/db/schema.ts",
  dialect: "postgresql",
  dbCredentials: {
    url: getDatabaseUrl(),
  },
});
