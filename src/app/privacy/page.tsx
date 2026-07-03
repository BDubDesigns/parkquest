import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Privacy & Beta — ParkQuest",
};

export default function PrivacyPage() {
  return (
    <main className="mx-auto max-w-2xl px-4 py-12">
      <h1 className="mb-2 text-3xl font-bold">Privacy & Beta</h1>
      <p className="mb-8 text-emerald-300">ParkQuest beta</p>

      <section className="mb-8">
        <h2 className="mb-3 text-xl font-semibold">Beta status</h2>
        <p className="leading-relaxed text-emerald-100">
          ParkQuest is in early beta. Features, data, and availability may
          change. If you have questions or run into issues, open a GitHub issue
          on the project repository.
        </p>
      </section>

      <section className="mb-8">
        <h2 className="mb-3 text-xl font-semibold">Your privacy</h2>
        <ul className="list-disc space-y-2 pl-5 text-emerald-100">
          <li>
            <strong>Family progress is private.</strong> Stamps, Adventure
            Points, stickers, and nicknames are only visible to members of your
            family group. No other family can see them.
          </li>
          <li>
            <strong>Notes and memories are private.</strong> Any text you enter
            during a stamp is stored per-visit and only returned to your family.
          </li>
          <li>
            <strong>No location tracking.</strong> ParkQuest uses OpenStreetMap
            tiles to display parks but never requests your device&apos;s GPS
            location.
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

      <section className="mb-8">
        <h2 className="mb-3 text-xl font-semibold">Data you provide</h2>
        <p className="leading-relaxed text-emerald-100">
          When you sign up, we store your name, email address, and a hashed
          password (via Better Auth). When you stamp a park, we store the park
          ID, visit date, optional rating, safety answer, and optional memory
          note. We do not sell or share this data with third parties.
        </p>
      </section>

      <section>
        <h2 className="mb-3 text-xl font-semibold">Contact</h2>
        <p className="leading-relaxed text-emerald-100">
          For privacy questions, data access requests, or account deletion,
          email{" "}
          <a
            href="mailto:privacy@parkquest.club"
            className="underline underline-offset-2 hover:text-emerald-200"
          >
            privacy@parkquest.club
          </a>
          .
        </p>
      </section>
    </main>
  );
}
