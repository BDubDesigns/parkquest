import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { db } from "@/db";
import { familyMembers } from "@/db/private";
import { eq } from "drizzle-orm";
import SignOutButton from "@/components/auth/SignOutButton";
import SectionHeader from "@/components/ui/SectionHeader";
import { createFamilyGroup } from "./actions";
import {
  actionPrimary,
  mutedText,
  sectionTitle,
  surfacePrimary,
} from "@/components/ui/styles";

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
      <SectionHeader
        as="h1"
        title="Account"
        description="Your profile and private family group."
      />

      <section className={`mt-7 ${surfacePrimary}`}>
        <h2 className={sectionTitle}>Profile</h2>
        <dl className="mt-4 divide-y divide-forest-ink/10 text-sm">
          <div className="flex flex-col gap-1 py-3 first:pt-0 sm:flex-row sm:justify-between">
            <dt className={mutedText}>Name</dt>
            <dd className="font-semibold text-forest-ink">
              {session.user.name}
            </dd>
          </div>
          <div className="flex flex-col gap-1 py-3 last:pb-0 sm:flex-row sm:justify-between">
            <dt className={mutedText}>Email</dt>
            <dd className="break-all font-semibold text-forest-ink">
              {session.user.email}
            </dd>
          </div>
        </dl>
      </section>

      {member ? (
        <section className={`mt-4 ${surfacePrimary}`}>
          <h2 className={sectionTitle}>Family group</h2>
          <dl className="mt-4 divide-y divide-forest-ink/10 text-sm">
            <div className="flex flex-col gap-1 py-3 first:pt-0 sm:flex-row sm:justify-between">
              <dt className={mutedText}>Name</dt>
              <dd className="font-semibold text-forest-ink">
                {member.familyGroup.name ?? "(unnamed)"}
              </dd>
            </div>
            <div className="flex flex-col gap-1 py-3 last:pb-0 sm:flex-row sm:justify-between">
              <dt className={mutedText}>Role</dt>
              <dd className="font-semibold capitalize text-forest-ink">
                {member.role}
              </dd>
            </div>
          </dl>
        </section>
      ) : (
        <section className="mt-4 rounded-surface bg-white p-6 ring-1 ring-danger/25">
          <p className="text-sm leading-6 text-graphite/80">
            No family group found. This shouldn&apos;t happen &mdash; a group is
            normally created when you sign up.
          </p>
          <form action={createFamilyGroup} className="mt-3">
            <button type="submit" className={actionPrimary}>
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
