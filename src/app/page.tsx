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

        <section className="grid flex-1 items-start gap-10 py-10 sm:gap-12 sm:py-14 lg:grid-cols-[1.15fr_0.85fr] lg:py-20">
          <div>
            <p className="mb-4 max-w-max rounded-full bg-mist px-3 py-1.5 text-sm font-semibold text-canopy">
              A family park passport for Bellingham
            </p>
            <h1 className="max-w-3xl font-display text-4xl font-semibold leading-[1.05] tracking-[-0.03em] text-balance text-forest-ink sm:text-5xl lg:text-6xl">
              Every park can become part of your family story.
            </h1>
            <p className="mt-4 max-w-2xl text-xl font-semibold tracking-[-0.015em] text-canopy sm:mt-5 sm:text-2xl">
              {tagline}
            </p>
            <p className="mt-4 max-w-[62ch] text-base leading-7 text-pretty text-graphite/78 sm:mt-5 sm:text-lg">
              Discover Bellingham parks together, stamp every family visit, and
              turn days outside into a collection of Adventure Points, stickers,
              and Daily Quests.
            </p>

            <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:flex-wrap">
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

          <Link
            href="/passport"
            className="group block rounded-collectible bg-white p-5 ring-1 ring-forest-ink/12 transition-shadow hover:shadow-[0_4px_8px_rgba(18,55,42,0.14)] focus-visible:outline-3 focus-visible:outline-offset-3 focus-visible:outline-lake-blue sm:p-6"
          >
            <div className="flex items-center gap-2">
              <svg
                aria-hidden="true"
                viewBox="0 0 20 20"
                className="size-4 shrink-0 fill-none stroke-forest-ink stroke-[1.5] [stroke-linecap:round] [stroke-linejoin:round]"
              >
                <rect x="3" y="1" width="14" height="18" rx="2" />
                <path d="M7 5h6M7 9h6M7 13h4" />
              </svg>
              <p className="text-xs font-semibold text-graphite/55">
                Family Passport Preview
              </p>
            </div>

            <div className="mt-4 flex items-start justify-between gap-3 border-b border-forest-ink/10 pb-3">
              <div>
                <p className="text-sm font-bold text-forest-ink">
                  Whatcom Falls Park
                </p>
                <p className="mt-0.5 text-xs text-graphite/50">
                  Bellingham, WA
                </p>
              </div>
              <span className="inline-flex shrink-0 items-center rounded-md bg-stamp-red px-2 py-1 text-[0.625rem] font-bold leading-none tracking-wide text-white">
                STAMPED
              </span>
            </div>

            <div className="space-y-2 border-b border-forest-ink/10 py-3 text-sm">
              <div className="flex items-center justify-between">
                <span className="flex items-center gap-2">
                  <svg
                    aria-hidden="true"
                    viewBox="0 0 12 12"
                    className="size-3 shrink-0"
                  >
                    <circle cx="6" cy="6" r="5" className="fill-canopy" />
                    <path
                      d="M4 6.5 5.5 8 8 4.5"
                      fill="none"
                      stroke="white"
                      strokeWidth="1"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                  <span className="text-graphite/72">Park Scout</span>
                </span>
                <span className="text-xs font-semibold text-forest-ink">
                  +25 AP
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="flex items-center gap-2">
                  <svg
                    aria-hidden="true"
                    viewBox="0 0 12 12"
                    className="size-3 shrink-0"
                  >
                    <circle cx="6" cy="6" r="5" className="fill-trail-gold" />
                  </svg>
                  <span className="text-graphite/72">First Stamp sticker</span>
                </span>
                <span className="text-xs font-semibold text-canopy">
                  Earned
                </span>
              </div>
            </div>

            <div className="pt-3">
              <div className="h-2 w-full overflow-hidden rounded-full bg-mist">
                <div
                  className="h-2 rounded-full bg-canopy transition-[width]"
                  style={{ width: "17%" }}
                />
              </div>
              <p className="mt-1.5 text-xs text-graphite/50">
                8 of 46 Bellingham parks
              </p>
            </div>
          </Link>
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
      </div>
    </main>
  );
}
