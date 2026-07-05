import { config } from "dotenv";

config({ quiet: true });

const LOCAL_DATABASE_URL =
  "postgresql://parkquest:changeme@localhost:5432/parkquest";

export type DatabaseUrlSummary = {
  host: string;
  database: string;
  hasSslmodeRequire: boolean;
};

export function getDatabaseUrl(): string {
  return process.env.DATABASE_URL?.trim() || LOCAL_DATABASE_URL;
}

export function summarizeDatabaseUrl(
  url = getDatabaseUrl(),
): DatabaseUrlSummary {
  const parsed = new URL(url);
  return {
    host: parsed.hostname,
    database: parsed.pathname.replace(/^\//, "") || "(none)",
    hasSslmodeRequire: parsed.searchParams.get("sslmode") === "require",
  };
}

export function printDatabaseUrlSummary(
  url = getDatabaseUrl(),
): DatabaseUrlSummary {
  const summary = summarizeDatabaseUrl(url);
  console.log(`Database host: ${summary.host}`);
  console.log(`Database name: ${summary.database}`);
  console.log(`sslmode=require: ${summary.hasSslmodeRequire ? "yes" : "no"}`);
  return summary;
}

function looksProductionLike(value: string): boolean {
  return /(^|[-_.])prod(uction)?($|[-_.])|coolify|parkquest\.club/i.test(value);
}

function looksClearlyNonProduction(summary: DatabaseUrlSummary): boolean {
  const host = summary.host.toLowerCase();
  const database = summary.database.toLowerCase();

  if ([host, database].some(looksProductionLike)) return false;

  return (
    host === "localhost" ||
    host === "127.0.0.1" ||
    host === "postgres" ||
    host.includes("neon.tech") ||
    /(^|[-_.])(test|dev|development|local|staging|stage|nonprod)($|[-_.])/.test(
      host,
    ) ||
    /(^|[-_.])(test|dev|development|local|staging|stage|nonprod)($|[-_.])/.test(
      database,
    )
  );
}

export function assertSafeDatabaseUrl(
  url = getDatabaseUrl(),
): DatabaseUrlSummary {
  const summary = printDatabaseUrlSummary(url);

  if (!looksClearlyNonProduction(summary)) {
    throw new Error(
      "Refusing to run against a database that is not clearly local, test, dev, staging, non-production, or Neon.",
    );
  }

  return summary;
}
