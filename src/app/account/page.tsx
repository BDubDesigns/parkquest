import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { db } from "@/db";
import { familyMembers } from "@/db/private";
import { eq } from "drizzle-orm";
import SignOutButton from "@/components/auth/SignOutButton";
import { createFamilyGroup } from "./actions";

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

      <section className="mt-6 rounded-2xl border border-emerald-700/70 bg-emerald-900/70 p-4 shadow-2xl shadow-emerald-950/40 sm:p-6">
        <h2 className="text-sm font-semibold uppercase tracking-[0.2em] text-emerald-300">
          Profile
        </h2>
        <dl className="mt-3 space-y-2 text-sm">
          <div className="flex flex-col gap-1 sm:flex-row sm:justify-between">
            <dt className="text-emerald-200/70">Name</dt>
            <dd className="font-medium text-white">{session.user.name}</dd>
          </div>
          <div className="flex flex-col gap-1 sm:flex-row sm:justify-between">
            <dt className="text-emerald-200/70">Email</dt>
            <dd className="break-all font-medium text-white">
              {session.user.email}
            </dd>
          </div>
        </dl>
      </section>

      {member ? (
        <section className="mt-4 rounded-2xl border border-emerald-700/70 bg-emerald-900/70 p-4 shadow-2xl shadow-emerald-950/40 sm:p-6">
          <h2 className="text-sm font-semibold uppercase tracking-[0.2em] text-emerald-300">
            Family Group
          </h2>
          <dl className="mt-3 space-y-2 text-sm">
            <div className="flex flex-col gap-1 sm:flex-row sm:justify-between">
              <dt className="text-emerald-200/70">Name</dt>
              <dd className="font-medium text-white">
                {member.familyGroup.name ?? "(unnamed)"}
              </dd>
            </div>
            <div className="flex flex-col gap-1 sm:flex-row sm:justify-between">
              <dt className="text-emerald-200/70">Role</dt>
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
            <button
              type="submit"
              className="min-h-11 rounded-full bg-amber-300 px-6 py-2 text-sm font-bold text-emerald-950 transition-colors hover:bg-amber-200"
            >
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
