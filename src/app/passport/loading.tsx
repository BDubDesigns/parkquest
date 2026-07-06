import {
  pageContainer,
  pageShell,
  skeleton,
} from "@/components/ui/styles";

export default function PassportLoading() {
  return (
    <div className={pageShell}>
      <div className={`${pageContainer} py-8`}>
        <div className="mb-8 flex gap-3">
          <div className={`h-4 w-10 ${skeleton}`} />
          <div className={`h-4 w-10 ${skeleton}`} />
          <div className={`h-4 w-10 ${skeleton}`} />
        </div>
        <div className={`mb-5 h-9 w-64 ${skeleton}`} />
        <div className={`mb-2 h-5 w-full ${skeleton}`} />
        <div className={`mb-8 h-4 w-48 ${skeleton}`} />
        <div className={`mb-4 h-6 w-36 ${skeleton}`} />
        <div className="space-y-2">
          <div className={`h-4 w-full ${skeleton}`} />
          <div className={`h-4 w-3/4 ${skeleton}`} />
          <div className={`h-4 w-5/6 ${skeleton}`} />
        </div>
      </div>
    </div>
  );
}
