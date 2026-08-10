import { useEffect } from "react";
import { useMap } from "react-leaflet";
import type { MapRef } from "../types";

interface MapRefCaptureProps {
  mapRef: MapRef;
  onReady: () => void;
}

/** MapContainer ichidagi L.Map instance'ini tashqi mapRef'ga yozib, "ready" holatini bildiradi. */
export function MapRefCapture({ mapRef, onReady }: MapRefCaptureProps) {
  const map = useMap();

  useEffect(() => {
    mapRef.current = map;
    onReady();
    return () => {
      mapRef.current = null;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [map]);

  return null;
}
