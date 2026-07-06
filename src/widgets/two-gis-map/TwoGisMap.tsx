import { useTwoGisMap } from "./hooks/useTwoGisMap";
import { useUzbekistanMask } from "./hooks/useUzbekistanMask";
import { useCadastralLayers } from "./hooks/useCadastralLayers";
import { useCadastralData } from "./hooks/useCadastralData";
import { CadastralModal } from "./components/CadastralModal";
import { saveCadastral, type CadastralRecord } from "@/shared/api/sheetApi";

/**
 * To'liq ekranli 2GIS xaritasi + O'zbekiston chegara niqobi (mask)
 * + kadastr qatlamlari (yer chegarasi, bino poligonlari, saqlanganlar oranj)
 * + saqlash modal oynasi.
 */
export default function TwoGisMap() {
  const { containerRef, mapRef, ready } = useTwoGisMap();
  useUzbekistanMask(mapRef, ready);

  const { cadastralSet, refetch } = useCadastralData();
  const { selected, clearSelected } = useCadastralLayers(
    mapRef,
    ready,
    cadastralSet,
  );

  const handleSave = async (record: CadastralRecord) => {
    await saveCadastral(record);
    await refetch();
    clearSelected();
  };

  return (
    <>
      <div ref={containerRef} className="h-full w-full" />
      <CadastralModal
        key={selected?.cadastralNumber ?? "none"}
        building={selected}
        onClose={clearSelected}
        onSave={handleSave}
      />
    </>
  );
}
