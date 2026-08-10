import { useEffect } from "react";
import { useMap } from "react-leaflet";

/** Xarita konteyneri o'lchami o'zgarsa (panel toggle va h.k.) — Leaflet'ni qayta hisoblatadi. */
export function MapResizeWatcher() {
  const map = useMap();

  useEffect(() => {
    const container = map.getContainer();
    let rafId = 0;
    const ro = new ResizeObserver(() => {
      cancelAnimationFrame(rafId);
      rafId = requestAnimationFrame(() => map.invalidateSize());
    });
    ro.observe(container);
    return () => {
      ro.disconnect();
      cancelAnimationFrame(rafId);
    };
  }, [map]);

  return null;
}
