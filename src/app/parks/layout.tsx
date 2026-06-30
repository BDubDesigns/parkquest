import Link from "next/link";

export default function ParksLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="mx-auto max-w-2xl px-4 py-8">
      <header className="mb-8">
        <Link
          href="/"
          className="text-sm text-neutral-500 underline underline-offset-2 hover:text-neutral-800"
        >
          Home
        </Link>
        <h1 className="mt-2 text-3xl font-bold tracking-tight text-neutral-900">
          Parks
        </h1>
      </header>
      {children}
    </div>
  );
}
