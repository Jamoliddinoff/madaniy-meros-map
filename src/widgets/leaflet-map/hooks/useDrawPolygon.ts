import { useCallback, useEffect, useRef, useState } from "react";
import L from "leaflet";
import { destroyLeafletLayer } from "@/shared/lib/leaflet";
import { useSaveCadastralMutation } from "./useSaveCadastralMutation";
import { useToast } from "@/shared/ui/toast/toast-context";
import { circleToPolygon, distanceMeters } from "../lib/geo";
import type { MapRef } from "../types";

export type DrawPhase = "idle" | "drawing" | "confirming";
export type DrawMode = "polygon" | "circle";

const DRAFT_FILL = "#9b51e0";
const DRAFT_STROKE = "#9b51e0";
export const MIN_POINTS = 3;
const CIRCLE_SEGMENTS = 64;

/** Ichki nuqta ro'yxati ([lng,lat]) — Leaflet uchun ([lat,lng]) ga aylantiradi. */
function toLatLngs(points: [number, number][]): [number, number][] {
  return points.map(([lng, lat]) => [lat, lng]);
}

/**
 * Landga qo'lda yangi poligon (bino) biriktirish jarayoni:
 * chizish (click bilan nuqta qo'shish; Saqlash tugmasi, Enter yoki double-click
 * bilan yakunlash) → tasdiqlash (modal) → saqlash (cadastralNumber: "DRAWED", poligon: JSON).
 *
 * Nuqta va chiziq/hover eventlari Leaflet'ning object-level click'lari (bino/land
 * poligonlari) bilan aralashmasligi uchun to'g'ridan-to'g'ri xarita konteyneri
 * (DOM) ustida tinglanadi — shu sababli mavjud poligonlar ustida ham chizish mumkin.
 */
export function useDrawPolygon(mapRef: MapRef, enabled: boolean) {
  const [phase, setPhase] = useState<DrawPhase>("idle");
  const [mode, setModeState] = useState<DrawMode>("polygon");
  const [landCadastralNumber, setLandCadastralNumber] = useState<
    string | null
  >(null);
  const [pointCount, setPointCount] = useState(0);
  const saveMutation = useSaveCadastralMutation();
  const { showToast } = useToast();

  const pointsRef = useRef<[number, number][]>([]);
  const ringRef = useRef<[number, number][] | null>(null);
  const circleCenterRef = useRef<[number, number] | null>(null);
  const previewLineRef = useRef<L.Polyline | null>(null);
  const previewFillRef = useRef<L.Polygon | null>(null);
  const finalPolygonRef = useRef<L.Polygon | null>(null);
  const isActiveRef = useRef(false);

  const clearLine = useCallback(() => {
    destroyLeafletLayer(previewLineRef.current);
    previewLineRef.current = null;
  }, []);

  const clearFill = useCallback(() => {
    destroyLeafletLayer(previewFillRef.current);
    previewFillRef.current = null;
  }, []);

  const clearFinal = useCallback(() => {
    destroyLeafletLayer(finalPolygonRef.current);
    finalPolygonRef.current = null;
  }, []);

  /** Faqat qo'yilgan nuqtalar asosida ichi bo'yalgan preview — click'da (kam-kam) qayta chiziladi. */
  const redrawFill = useCallback(() => {
    const map = mapRef.current;
    clearFill();
    const points = pointsRef.current;
    if (!map || points.length < MIN_POINTS) return;
    previewFillRef.current = L.polygon(toLatLngs([...points, points[0]]), {
      fillColor: DRAFT_FILL,
      fillOpacity: 0.35,
      weight: 0,
    }).addTo(map);
  }, [mapRef, clearFill]);

  /** Dashed border, kursorni kuzatib turadi — mousemove'da (rAF bilan) qayta chiziladi (yengil). */
  const redrawLine = useCallback(
    (cursor?: [number, number]) => {
      const map = mapRef.current;
      clearLine();
      const points = pointsRef.current;
      if (!map || points.length === 0) return;
      const open = cursor ? [...points, cursor] : [...points];
      const ring = open.length >= 2 ? [...open, points[0]] : open;
      previewLineRef.current = L.polyline(toLatLngs(ring), {
        color: DRAFT_STROKE,
        weight: 2,
        dashArray: "8 6",
      }).addTo(map);
    },
    [mapRef, clearLine],
  );

  const start = useCallback((land: string) => {
    pointsRef.current = [];
    ringRef.current = null;
    circleCenterRef.current = null;
    setPointCount(0);
    setModeState("polygon");
    setLandCadastralNumber(land);
    setPhase("drawing");
  }, []);

  const cancel = useCallback(() => {
    clearLine();
    clearFill();
    clearFinal();
    pointsRef.current = [];
    ringRef.current = null;
    circleCenterRef.current = null;
    setPointCount(0);
    setLandCadastralNumber(null);
    setPhase("idle");
  }, [clearLine, clearFill, clearFinal]);

  /** Chizish rejimini almashtiradi (poligon/doira) — joriy jarayondagi nuqtalarni tozalaydi. */
  const setMode = useCallback(
    (next: DrawMode) => {
      setModeState((prev) => {
        if (prev === next) return prev;
        clearLine();
        clearFill();
        pointsRef.current = [];
        circleCenterRef.current = null;
        setPointCount(0);
        return next;
      });
    },
    [clearLine, clearFill],
  );

  /** Chizishni yakunlaydi va tasdiqlash oynasini ochadi (Saqlash tugmasi/Enter/double-click). */
  const finish = useCallback(() => {
    const map = mapRef.current;
    if (!map) return;
    const points = pointsRef.current;
    if (points.length < MIN_POINTS) {
      showToast(
        `Poligon uchun kamida ${MIN_POINTS} ta nuqta belgilang`,
        "error",
      );
      return;
    }
    clearLine();
    clearFill();
    const ring = [...points, points[0]];
    ringRef.current = ring;
    finalPolygonRef.current = L.polygon(toLatLngs(ring), {
      fillColor: DRAFT_FILL,
      fillOpacity: 0.35,
      color: DRAFT_STROKE,
      weight: 2,
    }).addTo(map);
    setPhase("confirming");
  }, [mapRef, clearLine, clearFill, showToast]);

  /** Tasdiqlashda "Yo'q": chizishga qaytadi. Poligonda nuqtalar saqlanadi,
   * doirada markazni qaytadan belgilash kerak bo'ladi. */
  const declineConfirm = useCallback(() => {
    clearFinal();
    setPhase("drawing");
    if (mode === "circle") {
      pointsRef.current = [];
      circleCenterRef.current = null;
      setPointCount(0);
    } else {
      redrawFill();
    }
  }, [clearFinal, redrawFill, mode]);

  // Chizish rejimi: xarita konteynerida native DOM eventlar (mavjud poligonlar
  // ustida ham ishlashi uchun) — click (nuqta), mousemove (rAF throttling),
  // dblclick/Enter (yakunlash).
  useEffect(() => {
    isActiveRef.current = phase !== "idle";
    if (phase !== "drawing" || !enabled || !mapRef.current) return;
    const map = mapRef.current;
    const container: HTMLElement = map.getContainer();
    if (!container) return;

    // Leaflet'ning o'z dblclick-zoom xatti-harakati chizish jarayoniga xalaqit bermasin.
    map.doubleClickZoom.disable();

    let rafId: number | null = null;
    let cursor: [number, number] | null = null;

    const toLngLat = (e: MouseEvent): [number, number] => {
      const rect = container.getBoundingClientRect();
      const point = L.point(e.clientX - rect.left, e.clientY - rect.top);
      const latlng = map.containerPointToLatLng(point);
      return [latlng.lng, latlng.lat];
    };

    const handlePolygonClick = (e: MouseEvent) => {
      const point = toLngLat(e);
      pointsRef.current = [...pointsRef.current, point];
      setPointCount(pointsRef.current.length);
      cursor = point;
      if (rafId !== null) {
        cancelAnimationFrame(rafId);
        rafId = null;
      }
      redrawLine(point);
      redrawFill();
    };

    // Doira: 1-click markazni belgilaydi, 2-click radiusni yakunlab chizishni tugatadi.
    const handleCircleClick = (e: MouseEvent) => {
      const point = toLngLat(e);
      if (!circleCenterRef.current) {
        circleCenterRef.current = point;
        setPointCount(1);
        return;
      }
      const radius = distanceMeters(circleCenterRef.current, point);
      if (radius <= 0) return;
      pointsRef.current = circleToPolygon(
        circleCenterRef.current,
        radius,
        CIRCLE_SEGMENTS,
      );
      setPointCount(pointsRef.current.length);
      finish();
    };

    const handleMouseMove = (e: MouseEvent) => {
      if (mode === "circle") {
        if (!circleCenterRef.current) return;
        cursor = toLngLat(e);
        if (rafId !== null) return;
        rafId = requestAnimationFrame(() => {
          rafId = null;
          if (!cursor || !circleCenterRef.current) return;
          const radius = distanceMeters(circleCenterRef.current, cursor);
          pointsRef.current = circleToPolygon(
            circleCenterRef.current,
            radius,
            CIRCLE_SEGMENTS,
          );
          redrawFill();
          redrawLine();
        });
        return;
      }
      if (pointsRef.current.length === 0) return;
      cursor = toLngLat(e);
      if (rafId !== null) return;
      rafId = requestAnimationFrame(() => {
        rafId = null;
        if (cursor) redrawLine(cursor);
      });
    };

    const handleDoubleClick = (e: MouseEvent) => {
      if (mode === "circle") return;
      // Capture bosqichida to'xtatamiz — xaritaning o'z double-click-zoom
      // xatti-harakati ishga tushmasin.
      e.preventDefault();
      e.stopPropagation();
      // dblclick ikkinchi click'dan keyin keladi — o'sha (dublikat) nuqtani olib tashlaymiz.
      if (pointsRef.current.length >= 2) {
        pointsRef.current = pointsRef.current.slice(0, -1);
        setPointCount(pointsRef.current.length);
      }
      finish();
    };

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Enter" && mode === "polygon") finish();
    };

    const handleClick = mode === "circle" ? handleCircleClick : handlePolygonClick;

    // capture:true — mavjud poligonlar/xaritaning o'z ichki handler'laridan oldin ishlaydi.
    container.addEventListener("click", handleClick, true);
    container.addEventListener("mousemove", handleMouseMove, true);
    container.addEventListener("dblclick", handleDoubleClick, true);
    window.addEventListener("keydown", handleKeyDown);

    return () => {
      if (rafId !== null) cancelAnimationFrame(rafId);
      map.doubleClickZoom.enable();
      container.removeEventListener("click", handleClick, true);
      container.removeEventListener("mousemove", handleMouseMove, true);
      container.removeEventListener("dblclick", handleDoubleClick, true);
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [mapRef, enabled, phase, mode, redrawLine, redrawFill, finish]);

  const confirmSave = useCallback(async () => {
    const ring = ringRef.current;
    if (!landCadastralNumber || !ring) return;
    try {
      await saveMutation.mutateAsync({
        landCadastralNumber,
        cadastralNumber: "DRAWED",
        poligon: JSON.stringify([ring]),
      });
      showToast("Poligon muvaffaqiyatli biriktirildi", "success");
      cancel();
    } catch {
      showToast("Saqlashda xatolik yuz berdi", "error");
    }
  }, [landCadastralNumber, saveMutation, showToast, cancel]);

  return {
    phase,
    mode,
    setMode,
    landCadastralNumber,
    pointCount,
    saving: saveMutation.isPending,
    isActiveRef,
    start,
    cancel,
    finish,
    confirmSave,
    declineConfirm,
  };
}
