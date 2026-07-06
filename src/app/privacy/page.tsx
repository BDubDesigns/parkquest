import type { Metadata } from "next";
import { linkTextDaylight, mutedTextDaylight } from "@/components/ui/styles";
import SectionHeader from "@/components/ui/SectionHeader";

export const metadata: Metadata = {
  title: "Privacy & Beta — ParkQuest",
};

export default function PrivacyPage() {
  return (
    <main className="mx-auto max-w-2xl px-4 py-10 sm:px-6 sm:py-14">
      <SectionHeader
        as="h1"
        title="Privacy & Beta"
        description="How ParkQuest protects your family’s information during beta."
      />

      <div className="mt-9 divide-y divide-forest-ink/12 rounded-surface bg-white px-5 ring-1 ring-forest-ink/10 sm:px-7">
        <section className="py-7 first:pt-6">
          <h2 className="mb-3 text-xl font-bold text-forest-ink">
            Beta status
          </h2>
          <p className={`leading-7 ${mutedTextDaylight}`}>
            ParkQuest is in early beta. Features, data, and availability may
            change. If you have questions or run into issues, open a GitHub
            issue on the project repository.
          </p>
        </section>

        <section className="py-7">
          <h2 className="mb-3 text-xl font-bold text-forest-ink">
            Your privacy
          </h2>
          <ul
            className={`list-disc space-y-3 pl-5 leading-7 ${mutedTextDaylight}`}
          >
            <li>
              <strong>Family progress is private.</strong> Stamps, Adventure
              Points, stickers, and nicknames are only visible to members of
              your family group. No other family can see them.
            </li>
            <li>
              <strong>Notes and memories are private.</strong> Any text you
              enter during a stamp is stored per-visit and only returned to your
              family.
            </li>
            <li>
              <strong>No location tracking.</strong> ParkQuest uses
              OpenStreetMap tiles to display parks but never requests your
              device&apos;s GPS location.
            </li>
            <li>
              <strong>No social features.</strong> There are no public profiles,
              friend feeds, leaderboards, or child accounts.
            </li>
            <li>
              <strong>Email is used only for authentication.</strong> We do not
              send marketing or newsletter emails.
            </li>
          </ul>
        </section>

        <section className="py-7">
          <h2 className="mb-3 text-xl font-bold text-forest-ink">
            Data you provide
          </h2>
          <p className={`leading-7 ${mutedTextDaylight}`}>
            When you sign up, we store your name, email address, and a hashed
            password (via Better Auth). When you stamp a park, we store the park
            ID, visit date, optional rating, safety answer, and optional memory
            note. We do not sell or share this data with third parties.
          </p>
        </section>

        <section className="py-7 last:pb-6">
          <h2 className="mb-3 text-xl font-bold text-forest-ink">Contact</h2>
          <p className={`leading-7 ${mutedTextDaylight}`}>
            For account deletion or privacy requests, email{" "}
            <a
              href="mailto:privacy@parkquest.club"
              className={linkTextDaylight}
            >
              privacy@parkquest.club
            </a>
            . During beta, deletion requests are handled manually.
          </p>
        </section>
      </div>
    </main>
  );
}
