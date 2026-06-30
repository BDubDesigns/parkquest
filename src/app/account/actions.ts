"use server";

import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { revalidatePath } from "next/cache";
import { db } from "@/db";
import { familyGroups, familyMembers } from "@/db/private";
import { eq } from "drizzle-orm";

export async function createFamilyGroup() {
  const session = await auth.api.getSession({ headers: await headers() });
  if (!session) throw new Error("Not authenticated");

  const existing = await db.query.familyMembers.findFirst({
    where: eq(familyMembers.userId, session.user.id),
  });

  if (existing) {
    revalidatePath("/account");
    return;
  }

  const [group] = await db
    .insert(familyGroups)
    .values({ name: `${session.user.name}'s Family` })
    .returning();

  await db.insert(familyMembers).values({
    familyGroupId: group.id,
    userId: session.user.id,
    role: "owner",
  });

  revalidatePath("/account");
}
