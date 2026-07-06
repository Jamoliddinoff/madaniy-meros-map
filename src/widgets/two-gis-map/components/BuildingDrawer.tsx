import { Drawer } from "@/shared/ui/Drawer";
import type { SelectedBuilding } from "../types";

interface BuildingDrawerProps {
  building: SelectedBuilding | null;
  onClose: () => void;
}

function InfoRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-lg border border-line bg-neutral-50 p-3">
      <span className="block text-xs font-medium text-neutral-400">
        {label}
      </span>
      <span className="mt-1 block break-all font-mono text-sm text-neutral-900">
        {value}
      </span>
    </div>
  );
}

/** Bino poligoni bosilganda ochiladigan ma'lumot deviderı. */
export function BuildingDrawer({ building, onClose }: BuildingDrawerProps) {
  return (
    <Drawer open={!!building} onClose={onClose} title="Obyekt ma'lumoti">
      {building && (
        <div className="flex flex-col gap-3">
          <InfoRow
            label="Yer kadastr raqami"
            value={building.landCadastralNumber}
          />
          <InfoRow label="Bino kadastr raqami" value={building.cadastralNumber} />
        </div>
      )}
    </Drawer>
  );
}
