import { useTwoGisMap } from "./hooks/useTwoGisMap";
import { useUzbekistanMask } from "./hooks/useUzbekistanMask";
import { useCadastralLayers } from "./hooks/useCadastralLayers";
import { BuildingDrawer } from "./components/BuildingDrawer";

/**
 * To'liq ekranli 2GIS xaritasi + O'zbekiston chegara niqobi (mask)
 * + kadastr qatlamlari (yer chegarasi va bino poligonlari).
 */
export default function TwoGisMap() {
  const { containerRef, mapRef, ready } = useTwoGisMap();
  useUzbekistanMask(mapRef, ready);
  const { selected, clearSelected } = useCadastralLayers(mapRef, ready);

  return (
    <>
      <div ref={containerRef} className="h-full w-full" />
      <BuildingDrawer building={selected} onClose={clearSelected} />
    </>
  );
}
