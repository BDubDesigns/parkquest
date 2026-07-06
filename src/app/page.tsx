import Link from "next/link";
import { tagline } from "@/lib/tagline";
import { actionPrimary, actionSecondary } from "@/components/ui/styles";

const steps = [
  {
    title: "Find a park",
    description: "Browse Bellingham parks or pick your next stop from the map.",
  },
  {
    title: "Visit and stamp it",
    description: "Add each family outing to your private Park Passport.",
  },
  {
    title: "Keep the adventure going",
    description: "Earn Adventure Points, stickers, and Daily Quest rewards.",
  },
];

export default function Home() {
  return (
    <main className="min-h-screen bg-atlas-paper text-graphite">
      <div className="mx-auto flex min-h-screen max-w-6xl flex-col px-5 sm:px-8">
        <header className="flex items-center justify-between border-b border-forest-ink/12 py-5 sm:py-6">
          <Link
            href="/"
            className="font-display text-xl font-semibold tracking-[-0.02em] text-forest-ink focus-visible:rounded-sm focus-visible:outline-3 focus-visible:outline-offset-3 focus-visible:outline-lake-blue"
          >
            ParkQuest
          </Link>
          <nav
            aria-label="Main navigation"
            className="flex items-center gap-1 text-sm font-semibold"
          >
            <Link
              href="/parks"
              className="inline-flex min-h-11 items-center rounded-control px-3 text-forest-ink transition-colors hover:bg-mist focus-visible:outline-3 focus-visible:outline-offset-2 focus-visible:outline-lake-blue"
            >
              Parks
            </Link>
            <Link
              href="/map"
              className="inline-flex min-h-11 items-center rounded-control px-3 text-forest-ink transition-colors hover:bg-mist focus-visible:outline-3 focus-visible:outline-offset-2 focus-visible:outline-lake-blue"
            >
              Map
            </Link>
          </nav>
        </header>

        <section className="grid flex-1 items-center gap-12 py-14 sm:py-20 lg:grid-cols-[1.15fr_0.85fr] lg:py-24">
          <div>
            <p className="mb-4 max-w-max rounded-full bg-mist px-3 py-1.5 text-sm font-semibold text-canopy">
              A family park passport for Bellingham
            </p>
            <h1 className="max-w-3xl font-display text-5xl font-semibold leading-[1.02] tracking-[-0.03em] text-balance text-forest-ink sm:text-6xl lg:text-7xl">
              Every park can become part of your family story.
            </h1>
            <p className="mt-5 max-w-2xl text-xl font-semibold tracking-[-0.015em] text-canopy sm:text-2xl">
              {tagline}
            </p>
            <p className="mt-5 max-w-[62ch] text-base leading-7 text-pretty text-graphite/78 sm:text-lg">
              Discover Bellingham parks together, stamp every family visit, and
              turn days outside into a collection of Adventure Points, stickers,
              and Daily Quests.
            </p>

            <div className="mt-9 flex flex-col gap-3 sm:flex-row sm:flex-wrap">
              <Link href="/parks" className={actionPrimary}>
                Explore Parks
              </Link>
              <Link href="/map" className={actionSecondary}>
                Open Map
              </Link>
              <Link
                href="/passport"
                className="inline-flex min-h-12 items-center justify-center rounded-control px-4 py-3 text-sm font-semibold text-forest-ink underline decoration-canopy/45 underline-offset-4 transition-colors hover:text-canopy focus-visible:outline-3 focus-visible:outline-offset-2 focus-visible:outline-lake-blue"
              >
                View Family Passport
              </Link>
            </div>
          </div>

          <aside className="rounded-collectible bg-forest-ink p-6 text-white sm:p-8">
            <div className="flex items-center justify-between gap-4 border-b border-white/18 pb-5">
              <div>
                <p className="text-sm font-semibold text-white/72">
                  Your next outing can be
                </p>
                <p className="mt-1 font-display text-2xl font-semibold tracking-[-0.015em]">
                  A park-sized adventure
                </p>
              </div>
              <span className="text-4xl" aria-hidden="true">
                🌲
              </span>
            </div>
            <ul className="mt-5 space-y-4 text-sm leading-6 text-white/82">
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
          className="border-t border-forest-ink/12 py-14 sm:py-18"
        >
          <h2
            id="how-it-works"
            className="max-w-xl font-display text-3xl font-semibold tracking-[-0.02em] text-balance text-forest-ink sm:text-4xl"
          >
            Make memories, one park at a time.
          </h2>
          <ol className="mt-9 divide-y divide-forest-ink/14 border-y border-forest-ink/14 md:grid md:grid-cols-3 md:divide-x md:divide-y-0">
            {steps.map((step) => (
              <li key={step.title} className="py-6 md:px-6 md:first:pl-0">
                <h3 className="text-lg font-bold text-forest-ink">
                  {step.title}
                </h3>
                <p className="mt-2 text-sm leading-6 text-graphite/72">
                  {step.description}
                </p>
              </li>
            ))}
          </ol>
        </section>

        <section className="border-t border-forest-ink/12 py-12 text-center sm:py-16">
          <h2 className="font-display text-2xl font-semibold text-forest-ink">
            Built for Bellingham families
          </h2>
          <p className="mx-auto mt-3 max-w-2xl text-lg leading-8 text-graphite/74">
            Start close to home. Find a familiar favorite or discover a park
            your family has never explored.
          </p>
        </section>
      </div>
    </main>
  );
}
