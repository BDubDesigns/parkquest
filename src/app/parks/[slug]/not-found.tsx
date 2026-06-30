import Link from "next/link";

export default function ParkNotFound() {
  return (
    <div className="flex flex-col items-center gap-4 py-16 text-center">
      <h2 className="text-xl font-semibold text-neutral-900">Park not found</h2>
      <p className="text-neutral-500">
        The park you are looking for does not exist or may have been removed.
      </p>
      <Link
        href="/parks"
        className="text-sm text-neutral-900 underline underline-offset-2 hover:text-neutral-600"
      >
        Back to parks
      </Link>
    </div>
  );
}
