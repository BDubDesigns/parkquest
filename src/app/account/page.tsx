import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { db } from "@/db";
import { familyMembers } from "@/db/private";
import { eq } from "drizzle-orm";
import SignOutButton from "@/components/auth/SignOutButton";
import { createFamilyGroup } from "./actions";
import { card, ctaPrimary, eyebrow, mutedText } from "@/components/ui/styles";

export default async function AccountPage() {
  const session = await auth.api.getSession({ headers: await headers() });

  if (!session) {
    return null;
  }

  const member = await db.query.familyMembers.findFirst({
    where: eq(familyMembers.userId, session.user.id),
    with: { familyGroup: true },
  });

  return (
    <div>
      <h1 className="text-2xl font-bold tracking-tight text-white">Account</h1>

      <section className={`mt-6 ${card}`}>
        <h2 className={eyebrow}>Profile</h2>
        <dl className="mt-3 space-y-2 text-sm">
          <div className="flex flex-col gap-1 sm:flex-row sm:justify-between">
            <dt className={mutedText}>Name</dt>
            <dd className="font-medium text-white">{session.user.name}</dd>
          </div>
          <div className="flex flex-col gap-1 sm:flex-row sm:justify-between">
            <dt className={mutedText}>Email</dt>
            <dd className="break-all font-medium text-white">
              {session.user.email}
            </dd>
          </div>
        </dl>
      </section>

      {member ? (
        <section className={`mt-4 ${card}`}>
          <h2 className={eyebrow}>Family Group</h2>
          <dl className="mt-3 space-y-2 text-sm">
            <div className="flex flex-col gap-1 sm:flex-row sm:justify-between">
              <dt className={mutedText}>Name</dt>
              <dd className="font-medium text-white">
                {member.familyGroup.name ?? "(unnamed)"}
              </dd>
            </div>
            <div className="flex flex-col gap-1 sm:flex-row sm:justify-between">
              <dt className={mutedText}>Role</dt>
              <dd className="font-medium text-white">{member.role}</dd>
            </div>
          </dl>
        </section>
      ) : (
        <section className="mt-4 rounded-2xl border border-amber-700/60 bg-amber-900/30 p-6 text-amber-200">
          <p className="text-sm">
            No family group found. This shouldn&apos;t happen &mdash; a group is
            normally created when you sign up.
          </p>
          <form action={createFamilyGroup} className="mt-3">
            <button type="submit" className={`min-h-11 ${ctaPrimary}`}>
              Repair: Create Family Group
            </button>
          </form>
        </section>
      )}

      <div className="mt-6">
        <SignOutButton />
      </div>
    </div>
  );
}
