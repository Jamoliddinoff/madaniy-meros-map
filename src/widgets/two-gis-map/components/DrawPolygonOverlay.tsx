import type { DrawMode, DrawPhase } from "../hooks/useDrawPolygon";
import { MIN_POINTS } from "../hooks/useDrawPolygon";
import { DrawModeDropdown } from "./DrawModeDropdown";

interface DrawPolygonOverlayProps {
  phase: DrawPhase;
  mode: DrawMode;
  pointCount: number;
  onModeChange: (mode: DrawMode) => void;
  onSave: () => void;
  onCancel: () => void;
}

function getGuideText(mode: DrawMode, pointCount: number): string {
  if (mode === "circle") {
    return pointCount === 0
      ? "Doira markazini xaritada bosib belgilang."
      : "Radiusni belgilash uchun xohlagan joyni bosing.";
  }
  const canSave = pointCount >= MIN_POINTS;
  return canSave
    ? `${pointCount} ta nuqta belgilandi. Yakunlash uchun "Saqlash", Enter yoki ikki marta bosing.`
    : `Poligon nuqtalarini xaritada (xohlagan joyda) bosib belgilang. Kamida ${MIN_POINTS} ta nuqta kerak (${pointCount}/${MIN_POINTS}).`;
}

/** Xarita o'ng yuqorisidagi poligon/doira chizish jarayoni paneli
 * (rejim tanlash + guide + Saqlash/Bekor qilish). */
export function DrawPolygonOverlay({
  phase,
  mode,
  pointCount,
  onModeChange,
  onSave,
  onCancel,
}: DrawPolygonOverlayProps) {
  if (phase !== "drawing") return null;

  const canSave = mode === "polygon" && pointCount >= MIN_POINTS;

  return (
      <div>
        <div className="absolute right-[50%] translate-x-[50%] top-4 z-sticky flex flex-col items-end gap-2">
          <p className="max-w-lg rounded-lg bg-neutral-0/95 px-3 py-2 text-center text-sm text-neutral-900 shadow-header backdrop-blur">
            {getGuideText(mode, pointCount)}
          </p>
        </div>
        <div className="absolute right-4 top-4 z-sticky flex flex-col items-end gap-2">
          <DrawModeDropdown mode={mode} onChange={onModeChange} />
          <div className="flex gap-2">
            {mode === "polygon" && (
              <button
                type="button"
                onClick={onSave}
                disabled={!canSave}
                className="rounded-lg bg-primary-600 px-4 py-2 text-sm font-medium text-neutral-0 shadow-header transition-colors hover:bg-primary-700 disabled:cursor-not-allowed disabled:opacity-50"
              >
                Saqlash
              </button>
            )}
            <button
              type="button"
              onClick={onCancel}
              className="rounded-lg border border-line bg-neutral-0/95 px-4 py-2 text-sm font-medium text-neutral-900 shadow-header backdrop-blur transition-colors hover:bg-neutral-100"
            >
              Bekor qilish
            </button>
          </div>
        </div>
      </div>
  );
}
