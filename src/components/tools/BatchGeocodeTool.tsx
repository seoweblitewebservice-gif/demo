"use client";

import { useCallback, useMemo, useState } from "react";
import { photonSearch, nominatimReverse } from "@/lib/geocode";
import { downloadText, toCsv } from "@/lib/formats";
import { fmtCoords } from "@/lib/geo";
import { ErrorBox, Spinner } from "@/components/ui";

type Mode = "forward" | "reverse";

type RowStatus = "pending" | "ok" | "fail" | "skip";

interface ResultRow {
  input: string;
  status: RowStatus;
  label?: string;
  lat?: number;
  lng?: number;
  message?: string;
}

const MAX_ROWS = 50;
const DELAY_MS = 1100; // be polite to free Photon / Nominatim

function parseLines(text: string): string[] {
  return text
    .split(/\r?\n/)
    .map((l) => l.trim())
    .filter(Boolean)
    .slice(0, MAX_ROWS);
}

function parseCoordLine(line: string): { lat: number; lng: number } | null {
  // "lat, lng" or "lat lng" or "lat;lng"
  const m = line.match(/^\s*(-?\d+(?:\.\d+)?)\s*[,;\s]\s*(-?\d+(?:\.\d+)?)\s*$/);
  if (!m) return null;
  const lat = parseFloat(m[1]);
  const lng = parseFloat(m[2]);
  if (!Number.isFinite(lat) || !Number.isFinite(lng)) return null;
  if (Math.abs(lat) > 90 || Math.abs(lng) > 180) return null;
  return { lat, lng };
}

function sleep(ms: number) {
  return new Promise((r) => setTimeout(r, ms));
}

export default function BatchGeocodeTool() {
  const [mode, setMode] = useState<Mode>("forward");
  const [text, setText] = useState("");
  const [rows, setRows] = useState<ResultRow[]>([]);
  const [running, setRunning] = useState(false);
  const [err, setErr] = useState<string | null>(null);
  const [progress, setProgress] = useState(0);

  const lineCount = useMemo(() => parseLines(text).length, [text]);

  const run = useCallback(async () => {
    const lines = parseLines(text);
    if (!lines.length) {
      setErr("Paste at least one address or coordinate pair (one per line).");
      return;
    }
    setErr(null);
    setRunning(true);
    setProgress(0);

    const initial: ResultRow[] = lines.map((input) => ({ input, status: "pending" }));
    setRows(initial);

    const next = [...initial];

    for (let i = 0; i < lines.length; i++) {
      const input = lines[i];

      if (mode === "forward") {
        const res = await photonSearch(input, 1);
        if (!res.ok) {
          next[i] = { input, status: "fail", message: res.message };
        } else if (!res.results.length) {
          next[i] = { input, status: "fail", message: "No match found" };
        } else {
          const h = res.results[0];
          next[i] = {
            input,
            status: "ok",
            label: h.label,
            lat: h.lat,
            lng: h.lng,
          };
        }
      } else {
        const pair = parseCoordLine(input);
        if (!pair) {
          next[i] = {
            input,
            status: "fail",
            message: "Expected lat, lng (e.g. 28.6139, 77.2090)",
          };
        } else {
          const res = await nominatimReverse(pair.lat, pair.lng);
          if (!res.ok) {
            next[i] = { input, status: "fail", message: res.message, lat: pair.lat, lng: pair.lng };
          } else {
            next[i] = {
              input,
              status: "ok",
              label: res.result.displayName,
              lat: pair.lat,
              lng: pair.lng,
            };
          }
        }
      }

      setRows([...next]);
      setProgress(Math.round(((i + 1) / lines.length) * 100));

      // Rate limit between requests (skip delay after last)
      if (i < lines.length - 1) await sleep(DELAY_MS);
    }

    setRunning(false);
  }, [text, mode]);

  const okCount = rows.filter((r) => r.status === "ok").length;
  const failCount = rows.filter((r) => r.status === "fail").length;

  const exportCsv = () => {
    const header = ["input", "status", "matched_label", "latitude", "longitude", "message"];
    const body = rows.map((r) => [
      r.input,
      r.status,
      r.label ?? "",
      r.lat != null ? r.lat.toFixed(6) : "",
      r.lng != null ? r.lng.toFixed(6) : "",
      r.message ?? "",
    ]);
    downloadText("mapbench-batch-geocode.csv", toCsv(header, body as string[][]), "text/csv");
  };

  const sampleForward = () => {
    setMode("forward");
    setText(
      [
        "1600 Amphitheatre Parkway, Mountain View, CA",
        "India Gate, New Delhi",
        "Trafalgar Square, London",
        "Sydney Opera House",
        "Eiffel Tower, Paris",
      ].join("\n"),
    );
    setRows([]);
    setErr(null);
  };

  const sampleReverse = () => {
    setMode("reverse");
    setText(
      ["37.4220, -122.0841", "28.6129, 77.2295", "51.5081, -0.1281", "-33.8568, 151.2153"].join("\n"),
    );
    setRows([]);
    setErr(null);
  };

  return (
    <div className="space-y-4">
      <div className="card space-y-4 p-4">
        <div className="flex flex-wrap gap-2">
          <button
            type="button"
            className={`btn btn-sm ${mode === "forward" ? "btn-primary" : "btn-ghost"}`}
            onClick={() => {
              setMode("forward");
              setRows([]);
            }}
            disabled={running}
          >
            Address → coordinates
          </button>
          <button
            type="button"
            className={`btn btn-sm ${mode === "reverse" ? "btn-primary" : "btn-ghost"}`}
            onClick={() => {
              setMode("reverse");
              setRows([]);
            }}
            disabled={running}
          >
            Coordinates → address
          </button>
          <button type="button" className="btn btn-ghost btn-sm" onClick={sampleForward} disabled={running}>
            Sample addresses
          </button>
          <button type="button" className="btn btn-ghost btn-sm" onClick={sampleReverse} disabled={running}>
            Sample coordinates
          </button>
        </div>

        <div>
          <label className="label" htmlFor="batch-input">
            {mode === "forward"
              ? "One address per line (max 50)"
              : "One coordinate pair per line — lat, lng (max 50)"}
          </label>
          <textarea
            id="batch-input"
            className="input min-h-[160px] font-mono text-sm"
            value={text}
            onChange={(e) => setText(e.target.value)}
            placeholder={
              mode === "forward"
                ? "1600 Amphitheatre Parkway, Mountain View, CA\nIndia Gate, New Delhi"
                : "28.6139, 77.2090\n51.5074, -0.1278"
            }
            disabled={running}
            spellCheck={false}
          />
          <p className="mt-1.5 text-xs text-mute">
            {lineCount} line{lineCount === 1 ? "" : "s"} ready
            {lineCount > MAX_ROWS ? ` (only first ${MAX_ROWS} will run)` : ""}. Free open-data geocoders — we
            space requests (~1s apart) so the service stays available for everyone.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <button type="button" className="btn btn-primary" onClick={run} disabled={running || lineCount === 0}>
            {running ? "Geocoding…" : mode === "forward" ? "Geocode addresses" : "Reverse geocode"}
          </button>
          {rows.length > 0 && !running && (
            <button type="button" className="btn btn-ghost" onClick={exportCsv}>
              Download CSV
            </button>
          )}
          {running && (
            <span className="text-sm text-mute" aria-live="polite">
              {progress}%
            </span>
          )}
        </div>

        {running && <Spinner label="Working through the list — please keep this tab open…" />}
        {err && <ErrorBox>{err}</ErrorBox>}
      </div>

      {rows.length > 0 && (
        <div className="card overflow-x-auto p-0">
          <div className="flex flex-wrap items-center justify-between gap-2 border-b border-line px-4 py-2 text-sm">
            <span className="font-semibold">Results</span>
            <span className="text-mute">
              {okCount} matched · {failCount} failed · {rows.length} total
            </span>
          </div>
          <table className="w-full min-w-[640px] text-left text-sm">
            <thead className="bg-well text-xs uppercase tracking-wide text-mute">
              <tr>
                <th className="px-3 py-2 font-semibold">#</th>
                <th className="px-3 py-2 font-semibold">Input</th>
                <th className="px-3 py-2 font-semibold">Status</th>
                <th className="px-3 py-2 font-semibold">Match / address</th>
                <th className="px-3 py-2 font-semibold">Coordinates</th>
              </tr>
            </thead>
            <tbody>
              {rows.map((r, i) => (
                <tr key={i} className="border-t border-line align-top">
                  <td className="px-3 py-2 text-mute">{i + 1}</td>
                  <td className="px-3 py-2 font-mono text-xs">{r.input}</td>
                  <td className="px-3 py-2">
                    {r.status === "pending" && <span className="text-mute">…</span>}
                    {r.status === "ok" && <span className="font-semibold text-brand-strong">OK</span>}
                    {r.status === "fail" && <span className="font-semibold text-red-700">Fail</span>}
                  </td>
                  <td className="px-3 py-2 text-xs">
                    {r.label ?? r.message ?? "—"}
                  </td>
                  <td className="px-3 py-2 font-mono text-xs">
                    {r.lat != null && r.lng != null ? fmtCoords({ lat: r.lat, lng: r.lng }) : "—"}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      <p className="text-xs text-mute">
        Forward geocoding uses Photon (OpenStreetMap). Reverse uses Nominatim. Results are best-effort open data —
        always verify critical addresses before mailings, routing fleets, or legal filings. Cap of {MAX_ROWS} rows per
        run keeps the free services healthy.
      </p>
    </div>
  );
}
