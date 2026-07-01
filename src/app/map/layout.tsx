import Link from "next/link";
import UserMenu from "@/components/auth/UserMenu";

export default function MapLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-slate-50">
      <div className="mx-auto max-w-5xl px-3 py-4 sm:px-4 md:py-8">
        <header className="mb-4 md:mb-6">
          <nav className="hidden items-center gap-3 text-sm text-slate-500 md:flex">
            <Link
              href="/"
              className="underline underline-offset-2 hover:text-slate-800"
            >
              Home
            </Link>
            <span aria-hidden="true">&middot;</span>
            <Link
              href="/parks"
              className="underline underline-offset-2 hover:text-slate-800"
            >
              Parks
            </Link>
            <span aria-hidden="true">&middot;</span>
            <UserMenu />
          </nav>
          <h1 className="text-2xl font-bold tracking-tight text-slate-900 md:mt-2 md:text-3xl">
            Map
          </h1>
        </header>
        {children}
      </div>
    </div>
  );
}
