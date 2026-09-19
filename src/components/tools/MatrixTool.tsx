"use client";
import { useMemo, useState } from "react";
import { distanceKm, fmt, type LatLng } from "@/lib/geo";
import { downloadText, toCsv } from "@/lib/formats";
import { PlaceField, type PlaceValue } from "./shared";

export default function MatrixTool() {
  const [places, setPlaces] = useState<(PlaceValue | null)[]>([null, null]);

  const valid = useMemo(() => places.filter(Boolean) as PlaceValue[], [places]);
  const matrix = useMemo(() => valid.map((a) => valid.map((b) => distanceKm(a, b))), [valid]);

  const name = (p: PlaceValue, i: number) => p.label || `Point ${i + 1}`;

  const exportCsv = () => {
    const rows = [["", ...valid.map((p, i) => name(p, i))],
      ...valid.map((p, i) => [name(p, i), ...matrix[i].map((d) => d.toFixed(3))])];
    downloadText("mapforge-distance-matrix.csv", toCsv(rows[0], rows.slice(1) as any), "text/csv");
  };

  return (
    <div className="space-y-4">
      <div className="card space-y-3 p-4">
        <div className="grid gap-3 sm:grid-cols-2">
          {places.map((p, i) => (
            <div key={i} className="flex items-start gap-2">
              <div className="flex-1">
                <PlaceField label={`Place ${i + 1}`} value={p} onChange={(v) => setPlaces((ps) => ps.map((x, j) => (j === i ? v : x)))} />
              </div>
              {places.length > 2 && (
                <button type="button" className="btn btn-ghost btn-sm mt-5" aria-label={`Remove place ${i + 1}`} onClick={() => setPlaces((ps) => ps.filter((_, j) => j !== i))}>✕</button>
              )}
            </div>
          ))}
        </div>
        {places.length < 8 && (
          <button type="button" className="btn btn-ghost btn-sm" onClick={() => setPlaces((ps) => [...ps, null])}>+ Add place (max 8)</button>
        )}
      </div>

      {valid.length >= 2 ? (
        <div className="card p-4">
          <div className="mb-2 flex items-center justify-between">
            <span className="label !mb-0">Distance matrix (km, straight-line)</span>
            <button type="button" className="btn btn-ghost btn-sm" onClick={exportCsv}>Download CSV</button>
          </div>
          <div className="overflow-x-auto">
            <table className="tbl min-w-[480px]">
              <thead>
                <tr><th></th>{valid.map((p, i) => <th key={i}>{name(p, i)}</th>)}</tr>
              </thead>
              <tbody>
                {valid.map((p, i) => (
                  <tr key={i}>
                    <td className="font-semibold">{name(p, i)}</td>
                    {valid.map((_, j) => (
                      <td key={j} className={i === j ? "text-mute" : "font-medium"}>{i === j ? "—" : fmt(matrix[i][j])}</td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <p className="mt-2 text-xs text-mute">Great-circle (haversine) distances — the shortest surface path between each pair.</p>
        </div>
      ) : (
        <p className="text-sm text-mute">Add at least two places to build the matrix.</p>
      )}
    </div>
  );
}
