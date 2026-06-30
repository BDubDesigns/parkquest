import Link from "next/link";

export default function ParkNotFound() {
  return (
    <div className="flex flex-col items-center gap-4 rounded-lg border border-slate-200 bg-white px-6 py-16 text-center shadow-sm">
      <h2 className="text-xl font-semibold text-slate-900">Park not found</h2>
      <p className="text-slate-500">
        The park you are looking for does not exist or may have been removed.
      </p>
      <Link
        href="/parks"
        className="text-sm text-slate-600 underline underline-offset-2 hover:text-slate-900"
      >
        Back to parks
      </Link>
    </div>
  );
}
