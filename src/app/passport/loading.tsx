import {
  pageContainerDaylight,
  pageShellDaylight,
  skeletonDaylight,
} from "@/components/ui/styles";

export default function PassportLoading() {
  return (
    <div className={pageShellDaylight}>
      <div className={`${pageContainerDaylight} py-8`}>
        <div className="mb-8 flex gap-3">
          <div className={`h-4 w-10 ${skeletonDaylight}`} />
          <div className={`h-4 w-10 ${skeletonDaylight}`} />
          <div className={`h-4 w-10 ${skeletonDaylight}`} />
        </div>
        <div className={`mb-5 h-9 w-64 ${skeletonDaylight}`} />
        <div className={`mb-2 h-5 w-full ${skeletonDaylight}`} />
        <div className={`mb-8 h-4 w-48 ${skeletonDaylight}`} />
        <div className={`mb-4 h-6 w-36 ${skeletonDaylight}`} />
        <div className="space-y-2">
          <div className={`h-4 w-full ${skeletonDaylight}`} />
          <div className={`h-4 w-3/4 ${skeletonDaylight}`} />
          <div className={`h-4 w-5/6 ${skeletonDaylight}`} />
        </div>
      </div>
    </div>
  );
}
