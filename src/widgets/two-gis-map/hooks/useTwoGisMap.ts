import { useEffect, useRef, useState } from "react";
import {
  destroyMapGLObject,
  loadMapGlScript,
  MAPGL_API_KEY,
  UZ_CENTER,
  UZ_ZOOM,
} from "@/shared/lib/mapgl";

/**
 * Mustaqil 2GIS (MapGL) map instance'ini yaratadi va hayot siklini boshqaradi.
 * Container ko'rinishga kirganda init qiladi, resize'ni kuzatadi, unmount'da tozalaydi.
 */
export function useTwoGisMap() {
  const containerRef = useRef<HTMLDivElement | null>(null);
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const mapRef = useRef<any>(null);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    if (!containerRef.current) return;
    let destroyed = false;
    let rafResize = 0;

    const createMap = () => {
      if (destroyed || mapRef.current || !containerRef.current || !window.mapgl)
        return;
      const { offsetWidth, offsetHeight } = containerRef.current;
      if (offsetWidth === 0 || offsetHeight === 0) return;

      const map = new window.mapgl.Map(containerRef.current, {
        center: UZ_CENTER,
        zoom: UZ_ZOOM,
        pitch: 0,
        rotation: 0,
        key: MAPGL_API_KEY,
        zoomControl: "bottomRight",
      });
      mapRef.current = map;
      setReady(true);

      // Brauzer layout/paint'ni tugatgach resize chaqiramiz
      requestAnimationFrame(() =>
        requestAnimationFrame(() => {
          try {
            map.resize?.();
          } catch {
            /* noop */
          }
        }),
      );
    };

    loadMapGlScript()
      .then(createMap)
      .catch((err) => console.error("2GIS load error:", err));

    const io = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) {
          loadMapGlScript()
            .then(createMap)
            .catch(() => {
              /* noop */
            });
        }
      },
      { threshold: 0.1 },
    );
    io.observe(containerRef.current);

    const ro = new ResizeObserver(() => {
      cancelAnimationFrame(rafResize);
      rafResize = requestAnimationFrame(() => {
        try {
          mapRef.current?.resize?.();
        } catch {
          /* noop */
        }
      });
    });
    ro.observe(containerRef.current);

    return () => {
      destroyed = true;
      io.disconnect();
      ro.disconnect();
      cancelAnimationFrame(rafResize);
      destroyMapGLObject(mapRef.current);
      mapRef.current = null;
      setReady(false);
    };
  }, []);

  return { containerRef, mapRef, ready };
}
