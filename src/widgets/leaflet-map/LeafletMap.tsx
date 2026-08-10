import { useRef, useState } from "react";
import { MapContainer, TileLayer, ZoomControl } from "react-leaflet";
import type L from "leaflet";
import "leaflet/dist/leaflet.css";
import { TILE_ATTRIBUTION, TILE_URL_LIGHT, UZ_CENTER, UZ_ZOOM } from "@/shared/lib/leaflet";
import { MapRefCapture } from "./components/MapRefCapture";
import { MapResizeWatcher } from "./components/MapResizeWatcher";
import { UzbekistanMask } from "./components/UzbekistanMask";
import { useCadastralLayers } from "./hooks/useCadastralLayers";
import { useCadastralData } from "./hooks/useCadastralData";
import { useCadastralSearch } from "./hooks/useCadastralSearch";
import { useFilteredCadastralNumbers } from "./hooks/useFilteredCadastralNumbers";
import { useLandFilterCounts } from "./hooks/useLandFilterCounts";
import { useDrawPolygon } from "./hooks/useDrawPolygon";
import { useLandsData } from "./hooks/useLandsData";
import { useSaveCadastralMutation } from "./hooks/useSaveCadastralMutation";
import { CadastralModal } from "./components/CadastralModal";
import { CadastralSearch } from "./components/CadastralSearch";
import { SavedFilterTabs } from "./components/SavedFilterTabs";
import { CadastralNumberList } from "./components/CadastralNumberList";
import { DrawPolygonOverlay } from "./components/DrawPolygonOverlay";
import { DrawConfirmModal } from "./components/DrawConfirmModal";
import { MapLoadingIndicator } from "./components/MapLoadingIndicator";
import type { SavedFilterMode } from "./types";

/**
 * To'liq ekranli Leaflet xaritasi + O'zbekiston chegara niqobi (mask)
 * + kadastr qatlamlari (yer chegarasi, bino poligonlari, saqlanganlar oranj)
 * + saqlash modal oynasi + landga qo'lda poligon chizib biriktirish.
 */
export default function LeafletMap() {
  const mapRef = useRef<L.Map | null>(null);
  const [ready, setReady] = useState(false);

  const { data, cadastralSet, fetching: cadastralFetching } = useCadastralData();
  const { lands, fetching: landsFetching } = useLandsData();
  const saveMutation = useSaveCadastralMutation();
  const draw = useDrawPolygon(mapRef, ready);
  const isSyncing = landsFetching || cadastralFetching || saveMutation.isPending;
  const [savedFilter, setSavedFilter] = useState<SavedFilterMode>("all");
  const { selected, clearSelected } = useCadastralLayers(
    mapRef,
    ready,
    cadastralSet,
    data,
    lands,
    draw.isActiveRef,
    savedFilter,
  );
  const { search } = useCadastralSearch(mapRef, lands);
  const filteredNumbers = useFilteredCadastralNumbers(data, savedFilter, lands);
  const filterCounts = useLandFilterCounts(data, lands);

  const handleSave = async (record: {
    landCadastralNumber: string;
    cadastralNumbers: string[];
  }) => {
    await Promise.all(
      record.cadastralNumbers.map((cadastralNumber) =>
        saveMutation.mutateAsync({
          landCadastralNumber: record.landCadastralNumber,
          cadastralNumber,
        }),
      ),
    );
    clearSelected();
  };

  const handleAddPolygon = (landCadastralNumber: string) => {
    draw.start(landCadastralNumber);
    clearSelected();
  };

  return (
    <>
      <MapContainer
        center={UZ_CENTER}
        zoom={UZ_ZOOM}
        className="h-full w-full"
        scrollWheelZoom
        zoomControl={false}
        attributionControl={false}
      >
        <TileLayer url={TILE_URL_LIGHT} attribution={TILE_ATTRIBUTION} />
        <ZoomControl position="bottomright" />
        <MapRefCapture mapRef={mapRef} onReady={() => setReady(true)} />
        <MapResizeWatcher />
        <UzbekistanMask />
      </MapContainer>
      <MapLoadingIndicator active={isSyncing} />
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
