"use client";
import dynamic from "next/dynamic";
import { useState } from "react";
import type { LatLng } from "@/lib/geo";
import LocationSearch from "@/components/LocationSearch";

// MapLibre must never render on the server.
export const DynamicMap = dynamic(() => import("@/components/MapShell"), {
  ssr: false,
  loading: () => <div className="map-shell animate-pulse bg-well" aria-hidden />,
});

export interface PlaceValue extends LatLng { label?: string }

/** Search-or-paste place picker used across distance/routing tools. */
export function PlaceField({ label, value, onChange, placeholder }: {
  label: string;
  value: PlaceValue | null;
  onChange: (v: PlaceValue | null) => void;
  placeholder?: string;
}) {
  const [manual, setManual] = useState("");
  return (
    <div>
      <span className="label">{label}</span>
      <div className="flex gap-2">
        <div className="flex-1">
          <LocationSearch
            placeholder={placeholder ?? "Search a place…"}
            initialValue={value?.label ?? ""}
            onSelect={(h) => onChange({ lat: h.lat, lng: h.lng, label: h.label })}
          />
        </div>
      </div>
      <div className="mt-1.5 flex items-center gap-2">
        <input
          className="input flex-1 !py-1.5 text-xs"
          placeholder="…or paste lat, lng"
          aria-label={`${label} coordinates`}
          value={value && !manual ? `${value.lat.toFixed(5)}, ${value.lng.toFixed(5)}` : manual}
          onChange={(e) => {
            setManual(e.target.value);
            const m = e.target.value.match(/^\s*(-?\d+(?:\.\d+)?)\s*[, ]\s*(-?\d+(?:\.\d+)?)\s*$/);
            if (m) {
              const lat = parseFloat(m[1]), lng = parseFloat(m[2]);
              if (Math.abs(lat) <= 90 && Math.abs(lng) <= 180) onChange({ lat, lng });
            }
          }}
        />
        {value && (
          <button type="button" className="btn btn-ghost btn-sm" onClick={() => { setManual(""); onChange(null); }} aria-label={`Clear ${label}`}>✕</button>
        )}
      </div>
    </div>
  );
}

/** Colored SVG pin as a DOM element for maplibre Markers. */
export function pinElement(color: string, glyph?: string): HTMLDivElement {
  const el = document.createElement("div");
  el.style.width = "30px";
  el.style.height = "40px";
  el.innerHTML = `<svg viewBox="0 0 30 40" width="30" height="40" xmlns="http://www.w3.org/2000/svg">
    <path d="M15 1C7.8 1 2 6.8 2 14c0 9.6 10.6 21.6 12.2 23.4a1 1 0 0 0 1.6 0C17.4 35.6 28 23.6 28 14 28 6.8 22.2 1 15 1Z" fill="${color}" stroke="rgba(0,0,0,.28)" stroke-width="1"/>
    <circle cx="15" cy="14" r="5.2" fill="#fff"/>
    ${glyph ? `<text x="15" y="18.5" font-family="sans-serif" font-size="10" font-weight="700" text-anchor="middle" fill="${color}">${glyph}</text>` : ""}
  </svg>`;
  el.style.cursor = "pointer";
  return el;
}

export const PALETTE = ["#1d6e63", "#d95d32", "#8a4f9e", "#b45309", "#0e7490", "#9d174d", "#4d7c0f", "#334155"];

export function SectionTitle({ children }: { children: React.ReactNode }) {
  return <h2 className="font-display text-lg font-bold tracking-tight">{children}</h2>;
}
