import { useState } from "react";
import { useTwoGisMap } from "./hooks/useTwoGisMap";
import { useUzbekistanMask } from "./hooks/useUzbekistanMask";
import { useCadastralLayers } from "./hooks/useCadastralLayers";
import { useCadastralData } from "./hooks/useCadastralData";
import { useCadastralSearch } from "./hooks/useCadastralSearch";
import { useFilteredCadastralNumbers } from "./hooks/useFilteredCadastralNumbers";
import { useLandFilterCounts } from "./hooks/useLandFilterCounts";
import { useDrawPolygon } from "./hooks/useDrawPolygon";
import { CadastralModal } from "./components/CadastralModal";
import { CadastralSearch } from "./components/CadastralSearch";
import { SavedFilterTabs } from "./components/SavedFilterTabs";
import { CadastralNumberList } from "./components/CadastralNumberList";
import { DrawPolygonOverlay } from "./components/DrawPolygonOverlay";
import { DrawConfirmModal } from "./components/DrawConfirmModal";
import { saveCadastral } from "@/shared/api/sheetApi";
import type { SavedFilterMode } from "./types";

/**
 * To'liq ekranli 2GIS xaritasi + O'zbekiston chegara niqobi (mask)
 * + kadastr qatlamlari (yer chegarasi, bino poligonlari, saqlanganlar oranj)
 * + saqlash modal oynasi + landga qo'lda poligon chizib biriktirish.
 */
export default function TwoGisMap() {
  const { containerRef, mapRef, ready } = useTwoGisMap();
  useUzbekistanMask(mapRef, ready);

  const { data, cadastralSet, refetch } = useCadastralData();
  const draw = useDrawPolygon(mapRef, ready, refetch);
  const [savedFilter, setSavedFilter] = useState<SavedFilterMode>("all");
  const { selected, clearSelected } = useCadastralLayers(
    mapRef,
    ready,
    cadastralSet,
    data,
    draw.isActiveRef,
    savedFilter,
  );
  const { search } = useCadastralSearch(mapRef);
  const filteredNumbers = useFilteredCadastralNumbers(data, savedFilter);
  const filterCounts = useLandFilterCounts(data);

  const handleSave = async (record: {
    landCadastralNumber: string;
    cadastralNumbers: string[];
  }) => {
    await Promise.all(
      record.cadastralNumbers.map((cadastralNumber) =>
        saveCadastral({
          landCadastralNumber: record.landCadastralNumber,
          cadastralNumber,
        }),
      ),
    );
    await refetch();
    clearSelected();
  };

  const handleAddPolygon = (landCadastralNumber: string) => {
    draw.start(landCadastralNumber);
    clearSelected();
  };

  return (
    <>
      <div ref={containerRef} className="h-full w-full" />
      <CadastralSearch onSearch={search} />
      <SavedFilterTabs
        value={savedFilter}
        onChange={setSavedFilter}
        counts={filterCounts}
      />
      <CadastralNumberList numbers={filteredNumbers} onSelect={search} />

      <CadastralModal
        key={
          selected
            ? `${selected.landCadastralNumber}|${selected.cadastralNumbers.length}|${selected.cadastralNumbers[0] ?? ""}`
            : "none"
        }
        selection={selected}
        onClose={clearSelected}
        onSave={handleSave}
        onAddPolygon={handleAddPolygon}
      />
      <DrawPolygonOverlay
        phase={draw.phase}
        mode={draw.mode}
        pointCount={draw.pointCount}
        onModeChange={draw.setMode}
        onSave={draw.finish}
        onCancel={draw.cancel}
      />
      <DrawConfirmModal
        open={draw.phase === "confirming"}
        landCadastralNumber={draw.landCadastralNumber}
        saving={draw.saving}
        onConfirm={draw.confirmSave}
        onDecline={draw.declineConfirm}
      />
    </>
  );
}
