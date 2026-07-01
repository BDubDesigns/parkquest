import Link from "next/link";

export default function ParkNotFound() {
  return (
    <div className="flex flex-col items-center gap-4 rounded-2xl border border-emerald-700/70 bg-emerald-900/70 px-6 py-16 text-center shadow-2xl shadow-emerald-950/40">
      <h2 className="text-xl font-bold tracking-tight text-white">
        Park not found
      </h2>
      <p className="text-emerald-200/80">
        The park you are looking for does not exist or may have been removed.
      </p>
      <Link
        href="/parks"
        className="text-sm font-medium text-emerald-200 underline decoration-emerald-500 underline-offset-4 hover:text-white"
      >
        Back to parks
      </Link>
    </div>
  );
}
