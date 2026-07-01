import Link from "next/link";
import { tagline } from "@/lib/tagline";

const steps = [
  {
    number: "01",
    title: "Find a park",
    description: "Browse Bellingham parks or pick your next stop from the map.",
  },
  {
    number: "02",
    title: "Visit and stamp it",
    description: "Add each family outing to your private Park Passport.",
  },
  {
    number: "03",
    title: "Keep the adventure going",
    description:
      "Earn Adventure Points, stickers, and Passport Challenge rewards.",
  },
];

export default function Home() {
  return (
    <main className="min-h-screen bg-emerald-950 text-white">
      <div className="mx-auto flex min-h-screen max-w-6xl flex-col px-5 sm:px-8">
        <header className="flex items-center justify-between py-5 sm:py-7">
          <Link
            href="/"
            className="text-lg font-bold tracking-tight text-emerald-50"
          >
            ParkQuest
          </Link>
          <nav aria-label="Main navigation" className="flex gap-4 text-sm">
            <Link
              href="/parks"
              className="text-emerald-100 transition-colors hover:text-white"
            >
              Parks
            </Link>
            <Link
              href="/map"
              className="text-emerald-100 transition-colors hover:text-white"
            >
              Map
            </Link>
          </nav>
        </header>

        <section className="grid flex-1 items-center gap-12 py-16 sm:py-24 lg:grid-cols-[1.2fr_0.8fr] lg:py-28">
          <div>
            <p className="mb-4 text-sm font-semibold uppercase tracking-[0.24em] text-emerald-300">
              Family Park Passport
            </p>
            <h1 className="max-w-3xl text-5xl font-bold tracking-tight text-balance sm:text-6xl lg:text-7xl">
              ParkQuest
            </h1>
            <p className="mt-4 max-w-2xl text-2xl font-medium tracking-tight text-emerald-100 sm:text-3xl">
              {tagline}
            </p>
            <p className="mt-6 max-w-xl text-base leading-7 text-emerald-100/80 sm:text-lg">
              Discover Bellingham parks together, stamp every family visit, and
              turn days outside into a collection of Adventure Points, stickers,
              and daily Passport Challenges.
            </p>

            <div className="mt-9 flex flex-col gap-3 sm:flex-row sm:flex-wrap">
              <Link
                href="/parks"
                className="inline-flex min-h-12 items-center justify-center rounded-full bg-amber-300 px-6 py-3 text-sm font-bold text-emerald-950 transition-colors hover:bg-amber-200"
              >
                Explore Parks
              </Link>
              <Link
                href="/map"
                className="inline-flex min-h-12 items-center justify-center rounded-full border border-emerald-400/60 px-6 py-3 text-sm font-bold text-white transition-colors hover:bg-emerald-900"
              >
                Open Map
              </Link>
              <Link
                href="/passport"
                className="inline-flex min-h-12 items-center justify-center rounded-full px-6 py-3 text-sm font-bold text-emerald-100 underline decoration-emerald-500 underline-offset-4 transition-colors hover:text-white"
              >
                View Family Passport
              </Link>
            </div>
          </div>

          <aside className="rounded-3xl border border-emerald-700/70 bg-emerald-900/70 p-6 shadow-2xl shadow-emerald-950/40 sm:p-8">
            <div className="flex items-center justify-between gap-4 border-b border-emerald-700/70 pb-5">
              <div>
                <p className="text-xs font-semibold uppercase tracking-widest text-emerald-300">
                  Your next outing
                </p>
                <p className="mt-1 text-xl font-bold">A park-sized adventure</p>
              </div>
              <span className="text-4xl" aria-hidden="true">
                🌲
              </span>
            </div>
            <ul className="mt-5 space-y-4 text-sm text-emerald-100">
              <li className="flex items-center gap-3">
                <span aria-hidden="true">📍</span>
                Explore parks across Bellingham
              </li>
              <li className="flex items-center gap-3">
                <span aria-hidden="true">✓</span>
                Stamp each park in your family passport
              </li>
              <li className="flex items-center gap-3">
                <span aria-hidden="true">★</span>
                Collect points, stickers, and rewards
              </li>
            </ul>
          </aside>
        </section>

        <section
          aria-labelledby="how-it-works"
          className="border-t border-emerald-800 py-16 sm:py-20"
        >
          <p className="text-sm font-semibold uppercase tracking-[0.2em] text-emerald-300">
            How it works
          </p>
          <h2
            id="how-it-works"
            className="mt-2 max-w-xl text-3xl font-bold tracking-tight sm:text-4xl"
          >
            Make memories, one park at a time.
          </h2>
          <ol className="mt-9 grid gap-4 md:grid-cols-3">
            {steps.map((step) => (
              <li
                key={step.number}
                className="rounded-2xl bg-emerald-900/60 p-6 ring-1 ring-emerald-800"
              >
                <span className="text-xs font-bold tracking-widest text-amber-300">
                  {step.number}
                </span>
                <h3 className="mt-3 text-lg font-bold">{step.title}</h3>
                <p className="mt-2 text-sm leading-6 text-emerald-100/75">
                  {step.description}
                </p>
              </li>
            ))}
          </ol>
        </section>

        <section className="border-t border-emerald-800 py-12 text-center sm:py-16">
          <p className="text-sm font-semibold uppercase tracking-[0.2em] text-emerald-300">
            Built for Bellingham families
          </p>
          <p className="mx-auto mt-3 max-w-2xl text-lg leading-8 text-emerald-100/80">
            Start close to home. Find a familiar favorite or discover a park
            your family has never explored.
          </p>
        </section>

        <footer className="border-t border-emerald-800 py-6 text-center text-xs text-emerald-200/60">
          ParkQuest · Turn every park into an adventure.
        </footer>
      </div>
    </main>
  );
}
