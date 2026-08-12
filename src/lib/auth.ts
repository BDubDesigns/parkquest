import { betterAuth } from "better-auth";
import { drizzleAdapter } from "@better-auth/drizzle-adapter";
import { db } from "@/db";
import { familyGroups, familyMembers } from "@/db/private";
import * as authSchema from "@/db/auth";

export const auth = betterAuth({
  baseURL: {
    allowedHosts: ["parkquest.club", "*.parkquest.club", "localhost:*"],
    protocol: process.env.NODE_ENV === "production" ? "https" : "auto",
  },
  database: drizzleAdapter(db, {
    provider: "pg",
    schema: authSchema,
  }),
  emailAndPassword: {
    enabled: true,
  },
  databaseHooks: {
    user: {
      create: {
        after: async (user) => {
          const [group] = await db
            .insert(familyGroups)
            .values({ name: `${user.name}'s Family` })
            .returning();

          await db.insert(familyMembers).values({
            familyGroupId: group.id,
            userId: user.id,
            role: "owner",
          });
        },
      },
    },
  },
});
