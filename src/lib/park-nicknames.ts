import { and, eq } from "drizzle-orm";
import { db } from "@/db";
import { familyParkPreferences } from "@/db/private";

export interface ParkNicknamesMap {
  [parkId: string]: string | null;
}

export async function getFamilyParkNickname(
  familyGroupId: string,
  parkId: string,
): Promise<string | null> {
  const row = await db.query.familyParkPreferences.findFirst({
    columns: { nickname: true },
    where: and(
      eq(familyParkPreferences.familyGroupId, familyGroupId),
      eq(familyParkPreferences.parkId, parkId),
    ),
  });

  return row?.nickname ?? null;
}

export async function getFamilyParkNicknames(
  familyGroupId: string,
  parkIds: string[],
): Promise<ParkNicknamesMap> {
  if (parkIds.length === 0) return {};

  const rows = await db.query.familyParkPreferences.findMany({
    columns: { parkId: true, nickname: true },
    where: and(
      eq(familyParkPreferences.familyGroupId, familyGroupId),
      ...parkIds.map((id) => eq(familyParkPreferences.parkId, id)),
    ),
  });

  const map: ParkNicknamesMap = {};
  for (const row of rows) {
    map[row.parkId] = row.nickname;
  }
  return map;
}

export async function setFamilyParkNickname(
  familyGroupId: string,
  parkId: string,
  nickname: string | null,
): Promise<void> {
  const trimmed = nickname?.trim() ?? null;

  if (!trimmed) {
    await db
      .delete(familyParkPreferences)
      .where(
        and(
          eq(familyParkPreferences.familyGroupId, familyGroupId),
          eq(familyParkPreferences.parkId, parkId),
        ),
      );
    return;
  }

  await db
    .insert(familyParkPreferences)
    .values({
      familyGroupId,
      parkId,
      nickname: trimmed,
    })
    .onConflictDoUpdate({
      target: [
        familyParkPreferences.familyGroupId,
        familyParkPreferences.parkId,
      ],
      set: { nickname: trimmed, updatedAt: new Date() },
    });
}
