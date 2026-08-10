import { Spinner } from "@/shared/ui/Spinner";

interface MapLoadingIndicatorProps {
  active: boolean;
}

/** Xarita ma'lumotlari (lands/cultural-heritage) yuklanayotganda yuqori markazda ko'rinadigan spinner. */
export function MapLoadingIndicator({ active }: MapLoadingIndicatorProps) {
  if (!active) return null;

  return (
    <div
      role="status"
      aria-label="Yuklanmoqda"
      className="pointer-events-none absolute left-1/2 top-4 z-map-overlay -translate-x-1/2 rounded-full bg-transparent border border-primary-600 px-2 py-1 shadow-header backdrop-blur flex items-center gap-2"
    >
      <Spinner className="h-5 w-5 text-primary-600" /> Yuklanmoqda...
    </div>
  );
}
