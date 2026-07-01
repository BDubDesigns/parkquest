import Link from "next/link";
import { card, linkText, mutedText } from "@/components/ui/styles";

export default function ParkNotFound() {
  return (
    <div
      className={`flex flex-col items-center gap-4 px-6 py-16 text-center ${card}`}
    >
      <h2 className="text-xl font-bold tracking-tight text-white">
        Park not found
      </h2>
      <p className={mutedText}>
        The park you are looking for does not exist or may have been removed.
      </p>
      <Link href="/parks" className={`text-sm font-medium ${linkText}`}>
        Back to parks
      </Link>
    </div>
  );
}
