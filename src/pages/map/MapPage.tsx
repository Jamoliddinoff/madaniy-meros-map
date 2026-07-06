import { lazy, Suspense } from "react";
import { useAuth } from "@/features/auth/model/auth-context";

const TwoGisMap = lazy(() => import("@/widgets/two-gis-map/TwoGisMap"));

export default function MapPage() {
  const { logout } = useAuth();

  return (
    <div className="relative h-full w-full">
      <button
        type="button"
        onClick={logout}
        aria-label="Chiqish"
        className="absolute right-4 top-4 z-sticky rounded-lg bg-neutral-0/90 px-4 py-2 text-sm font-medium text-neutral-900 shadow-header backdrop-blur transition-colors hover:bg-neutral-0"
      >
        Chiqish
      </button>

      <Suspense
        fallback={
          <div className="flex h-full w-full items-center justify-center text-neutral-500">
            Xarita yuklanmoqda...
          </div>
        }
      >
        <TwoGisMap />
      </Suspense>
    </div>
  );
}
