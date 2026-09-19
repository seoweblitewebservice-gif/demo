"use client";
import { useEffect, useRef } from "react";
import * as maplibregl from "maplibre-gl";
import "maplibre-gl/dist/maplibre-gl.css";

type MLMap = maplibregl.Map;

/** Use the official OpenFreeMap style directly first; fall back to our same-origin proxy if the browser blocks the upstream style. */
export const PRIMARY_STYLE = "https://tiles.openfreemap.org/styles/positron";
export const DIRECT_STYLE = "/api/ofm-style";
export const ATTRIBUTION = "© OpenStreetMap contributors · OpenFreeMap";

/**
 * Thin MapLibre wrapper. Delivers the live map instance via onReady so tool
 * components can add markers/sources. SSR-safe (only imported via
 * next/dynamic ssr:false). Includes a resilient style fallback: if the
 * proxied style cannot load, it retries against OpenFreeMap directly.
 */
export default function MapShell({
  center = { lat: 25, lng: 10 },
  zoom = 1.6,
  minZoom,
  maxZoom,
  className = "",
  onReady,
  onMoveEnd,
  showNav = true,
  preserveDrawingBuffer = true,
}: {
  center?: { lat: number; lng: number };
  zoom?: number;
  minZoom?: number;
  maxZoom?: number;
  className?: string;
  onReady?: (map: MLMap, lib: typeof maplibregl) => void;
  onMoveEnd?: (map: MLMap) => void;
  showNav?: boolean;
  preserveDrawingBuffer?: boolean;
}) {
  const el = useRef<HTMLDivElement>(null);
  const mapRef = useRef<MLMap | null>(null);
  const readyRef = useRef(onReady);
  readyRef.current = onReady;
  const moveRef = useRef(onMoveEnd);
  moveRef.current = onMoveEnd;

  useEffect(() => {
    if (!el.current || mapRef.current) return;
    maplibregl.setWorkerUrl("/maplibre/maplibre-gl-worker.mjs");

    const map = new maplibregl.Map({
      container: el.current,
      style: PRIMARY_STYLE,
      center: [center.lng, center.lat],
      zoom,
      minZoom: minZoom ?? 0,
      maxZoom: maxZoom ?? 20,
      attributionControl: false,
      canvasContextAttributes: { preserveDrawingBuffer },
    });
    map.addControl(new maplibregl.AttributionControl({ compact: true }), "bottom-right");
    if (showNav) map.addControl(new maplibregl.NavigationControl({ visualizePitch: false }), "top-right");
    map.addControl(new maplibregl.ScaleControl({ maxWidth: 110 }), "bottom-left");

    let styleLoaded = false;
    let switched = false;
    map.on("style.load", () => { styleLoaded = true; });
    map.on("error", (e: unknown) => {
      // Only react to failures that happen before the first style has loaded
      // (i.e. the style/proxy itself is unreachable), then fall back once.
      if (!styleLoaded && !switched) {
        switched = true;
        try { map.setStyle(DIRECT_STYLE); } catch { /* give up quietly */ }
      }
      void e;
    });

    map.on("moveend", () => moveRef.current?.(map));
    map.on("load", () => readyRef.current?.(map, maplibregl));
    mapRef.current = map;
    return () => { map.remove(); mapRef.current = null; };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return <div ref={el} className={`map-shell ${className}`} aria-label="Interactive map" />;
}
