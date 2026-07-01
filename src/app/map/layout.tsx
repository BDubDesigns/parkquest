import Link from "next/link";
import UserMenu from "@/components/auth/UserMenu";

export default function MapLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-emerald-950">
      <div className="mx-auto max-w-5xl px-3 py-4 sm:px-4 md:py-8">
        <header className="mb-4 md:mb-6">
          <nav className="hidden items-center gap-3 text-sm text-emerald-200/70 md:flex">
            <Link
              href="/"
              className="underline underline-offset-4 decoration-emerald-500 hover:text-white"
            >
              Home
            </Link>
            <span aria-hidden="true" className="text-emerald-500">
              &middot;
            </span>
            <Link
              href="/parks"
              className="underline underline-offset-4 decoration-emerald-500 hover:text-white"
            >
              Parks
            </Link>
            <span aria-hidden="true" className="text-emerald-500">
              &middot;
            </span>
            <UserMenu />
          </nav>
          <h1 className="text-2xl font-bold tracking-tight text-white md:mt-2 md:text-3xl">
            Map
          </h1>
        </header>
        {children}
      </div>
    </div>
  );
}
