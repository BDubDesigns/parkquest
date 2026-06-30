import Link from "next/link";

export default function MapLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-slate-50">
      <div className="mx-auto max-w-5xl px-4 py-8">
        <header className="mb-6">
          <nav className="flex gap-3 text-sm text-slate-500">
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
          </nav>
          <h1 className="mt-2 text-3xl font-bold tracking-tight text-slate-900">
            Map
          </h1>
        </header>
        {children}
      </div>
    </div>
  );
}
