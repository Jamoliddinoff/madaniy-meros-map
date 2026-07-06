import { useTwoGisMap } from "./hooks/useTwoGisMap";
import { useUzbekistanMask } from "./hooks/useUzbekistanMask";

/**
 * To'liq ekranli 2GIS xaritasi + O'zbekiston chegara niqobi (mask) qatlami.
 */
export default function TwoGisMap() {
  const { containerRef, mapRef, ready } = useTwoGisMap();
  useUzbekistanMask(mapRef, ready);

  return <div ref={containerRef} className="h-full w-full" />;
}
