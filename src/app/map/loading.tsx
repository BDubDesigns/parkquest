import {
  pageContainerWideDaylight,
  pageShellDaylight,
  skeletonDaylight,
} from "@/components/ui/styles";

export default function MapLoading() {
  return (
    <div className={pageShellDaylight}>
      <div className={`${pageContainerWideDaylight} py-8`}>
        <div className={`h-5 w-32 ${skeletonDaylight}`} />
        <div className={`mt-3 h-9 w-64 ${skeletonDaylight}`} />
        <div className={`mt-7 h-[600px] rounded-surface ${skeletonDaylight}`} />
      </div>
    </div>
  );
}
