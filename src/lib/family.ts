import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { db } from "@/db";
import { familyMembers } from "@/db/private";
import { eq } from "drizzle-orm";

export interface FamilyContext {
  userId: string;
  familyGroupId: string;
  familyGroupName: string | null;
  role: "owner" | "member";
}

export async function getCurrentFamilyContext(): Promise<FamilyContext | null> {
  const session = await auth.api.getSession({ headers: await headers() });

  if (!session) return null;

  const member = await db.query.familyMembers.findFirst({
    where: eq(familyMembers.userId, session.user.id),
    with: { familyGroup: true },
  });

  if (!member) return null;

  return {
    userId: session.user.id,
    familyGroupId: member.familyGroup.id,
    familyGroupName: member.familyGroup.name,
    role: member.role,
  };
}
