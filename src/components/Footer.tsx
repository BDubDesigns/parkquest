import Link from "next/link";

export default function Footer() {
  return (
    <footer className="border-t border-emerald-800 bg-emerald-950 px-4 py-6 text-center text-sm text-emerald-400">
      <p className="mb-1">
        ParkQuest &middot; Turn every park into an adventure.
      </p>
      <p>
        <Link
          href="/privacy"
          className="underline underline-offset-2 hover:text-emerald-200"
        >
          Privacy &amp; Beta
        </Link>
      </p>
    </footer>
  );
}
