import { skeleton } from "@/components/ui/styles";

export default function ParksLoading() {
  return (
    <div className="divide-y divide-forest-ink/12 border-y border-forest-ink/12">
      {[1, 2, 3].map((i) => (
        <div key={i} className="py-6" aria-hidden="true">
          <div className={`mb-3 h-6 w-48 ${skeleton}`} />
          <div className={`mb-2 h-4 w-32 ${skeleton}`} />
          <div className={`mb-2 h-4 w-full ${skeleton}`} />
          <div className={`h-4 w-3/4 ${skeleton}`} />
        </div>
      ))}
    </div>
  );
}
