import {
  pageContainerWide,
  pageShell,
  skeleton,
} from "@/components/ui/styles";

export default function MapLoading() {
  return (
    <div className={pageShell}>
      <div className={`${pageContainerWide} py-8`}>
        <div className={`h-5 w-32 ${skeleton}`} />
        <div className={`mt-3 h-9 w-64 ${skeleton}`} />
        <div className={`mt-7 h-[600px] rounded-surface ${skeleton}`} />
      </div>
    </div>
  );
}
