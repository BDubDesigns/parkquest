import { headers } from "next/headers";
import { eq } from "drizzle-orm";
import { db } from "@/db";
import { user } from "@/db/auth";
import { auth } from "@/lib/auth";

export async function getCurrentAdminUserId(): Promise<string | null> {
  const session = await auth.api.getSession({ headers: await headers() });
  if (!session) return null;

  const currentUser = await db.query.user.findFirst({
    columns: { id: true, isAdmin: true },
    where: eq(user.id, session.user.id),
  });

  return currentUser?.isAdmin ? currentUser.id : null;
}
