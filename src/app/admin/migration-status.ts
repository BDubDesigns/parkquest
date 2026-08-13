export type JournalEntry = { tag: string; when: number };

/**
 * Pure, DB-free accounting of how many journal entries Drizzle would still
 * apply. Mirrors the migrator's applied-tracking check exactly
 * (`!lastDbMigration || Number(created_at) < folderMillis` in
 * pg-core/dialect.cjs): a journal entry is pending when its `when`
 * (folderMillis) is strictly newer than the effective latest applied time.
 */
export function countPending(
  entries: Pick<JournalEntry, "when">[],
  effectiveLatest: number,
): number {
  return entries.filter((entry) => entry.when > effectiveLatest).length;
}