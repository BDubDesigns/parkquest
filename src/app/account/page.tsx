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
      <h1 className="text-2xl font-bold tracking-tight text-slate-900">
        Account
      </h1>

      <section className="mt-6 rounded-lg border border-slate-200 bg-white p-6 shadow-sm">
        <h2 className="text-sm font-semibold uppercase tracking-wide text-slate-400">
          Profile
        </h2>
        <dl className="mt-3 space-y-2 text-sm">
          <div className="flex justify-between">
            <dt className="text-slate-500">Name</dt>
            <dd className="font-medium text-slate-900">{session.user.name}</dd>
          </div>
          <div className="flex justify-between">
            <dt className="text-slate-500">Email</dt>
            <dd className="font-medium text-slate-900">{session.user.email}</dd>
          </div>
        </dl>
      </section>

      {member ? (
        <section className="mt-4 rounded-lg border border-slate-200 bg-white p-6 shadow-sm">
          <h2 className="text-sm font-semibold uppercase tracking-wide text-slate-400">
            Family Group
          </h2>
          <dl className="mt-3 space-y-2 text-sm">
            <div className="flex justify-between">
              <dt className="text-slate-500">Name</dt>
              <dd className="font-medium text-slate-900">
                {member.familyGroup.name ?? "(unnamed)"}
              </dd>
            </div>
            <div className="flex justify-between">
              <dt className="text-slate-500">Role</dt>
              <dd className="font-medium text-slate-900">{member.role}</dd>
            </div>
          </dl>
        </section>
      ) : (
        <section className="mt-4 rounded-lg border border-amber-200 bg-amber-50 p-6">
          <p className="text-sm text-amber-800">
            No family group found. This shouldn&apos;t happen &mdash; a group is
            normally created when you sign up.
          </p>
          <form action={createFamilyGroup} className="mt-3">
            <button
              type="submit"
              className="rounded-md bg-amber-600 px-3 py-1.5 text-sm font-medium text-white hover:bg-amber-700"
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
