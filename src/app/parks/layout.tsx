import Link from "next/link";

export default function ParksLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-slate-50">
      <div className="mx-auto max-w-2xl px-4 py-8">
        <header className="mb-8">
          <Link
            href="/"
            className="text-sm text-slate-500 underline underline-offset-2 hover:text-slate-800"
          >
            Home
          </Link>
          <h1 className="mt-2 text-3xl font-bold tracking-tight text-slate-900">
            Parks
          </h1>
        </header>
        {children}
      </div>
    </div>
  );
}
