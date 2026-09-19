"use client";
import { useEffect, useMemo, useState } from "react";
import tzlookup from "tz-lookup";
import { sunTimes, hourAngleTimes, fmtDurationHours } from "@/lib/astronomy";
import { readUrlParams, syncUrl, Field, Stat, ErrorBox } from "@/components/ui";
import { PlaceField, type PlaceValue } from "./shared";

function localNow(tz: string): { time: string; offset: string } {
  try {
    const time = new Date().toLocaleTimeString("en-US", { timeZone: tz, hour: "2-digit", minute: "2-digit", hour12: false });
    const parts = new Intl.DateTimeFormat("en-US", { timeZone: tz, timeZoneName: "longOffset" }).formatToParts(new Date());
    const offset = parts.find((p) => p.type === "timeZoneName")?.value?.replace("GMT", "UTC") ?? "";
    return { time, offset };
  } catch {
    return { time: "—", offset: "" };
  }
}

// ---------- Timezone ----------
export function TimezoneTool() {
  const [place, setPlace] = useState<PlaceValue | null>(() => {
    const p = readUrlParams();
    const lat = parseFloat(p.get("lat") ?? ""), lng = parseFloat(p.get("lng") ?? "");
    return Number.isFinite(lat) && Number.isFinite(lng) ? { lat, lng } : null;
  });
  const [tick, setTick] = useState(0);
  useEffect(() => { const t = setInterval(() => setTick((x) => x + 1), 30000); return () => clearInterval(t); }, []);
  useEffect(() => { syncUrl({ lat: place?.lat.toFixed(5) ?? null, lng: place?.lng.toFixed(5) ?? null }); }, [place]);

  const tz = useMemo(() => {
    if (!place) return null;
    try { return tzlookup(place.lat, place.lng); } catch { return null; }
  }, [place]);
  void tick;
  const now = tz ? localNow(tz) : null;

  return (
    <div className="mx-auto max-w-2xl space-y-4">
      <div className="card p-4"><PlaceField label="Any place on Earth" value={place} onChange={setPlace} placeholder="Search a city or paste lat, lng…" /></div>
      {tz && now && (
        <div className="grid gap-2 sm:grid-cols-3">
          <Stat label="Time zone (IANA)" value={<span className="text-base">{tz}</span>} />
          <Stat label="Local time now" value={now.time} sub="updates live" />
          <Stat label="UTC offset" value={now.offset || "—"} />
        </div>
      )}
      {place && !tz && <ErrorBox>No timezone record exists for this point (open ocean or polar areas).</ErrorBox>}
      <p className="text-xs text-mute">Boundaries come from the open tz database geometry bundled with this page — the answer is computed locally, with no map and no server round-trip.</p>
    </div>
  );
}

// ---------- Meeting planner ----------
export function MeetingTool() {
  const [cities, setCities] = useState<PlaceValue[]>([]);
  const tzs = useMemo(() => cities.map((c) => {
    try { return { ...c, tz: tzlookup(c.lat, c.lng) }; } catch { return { ...c, tz: "UTC" }; }
  }), [cities]);

  const grid = useMemo(() => {
    const hours = Array.from({ length: 24 }, (_, h) => h);
    const rows = tzs.map((c) => {
      const local = hours.map((h) => {
        const d = new Date();
        d.setUTCMinutes(0, 0, 0); d.setUTCHours(h);
        const lh = parseInt(new Intl.DateTimeFormat("en-US", { timeZone: c.tz, hour: "numeric", hourCycle: "h23" }).format(d), 10);
        return lh;
      });
      return { ...c, local };
    });
    const overlap = hours.filter((h) => rows.every((r) => r.local[h] >= 9 && r.local[h] < 17));
    return { rows, overlap };
  }, [tzs]);

  return (
    <div className="space-y-4">
      <div className="card space-y-3 p-4">
        {cities.map((c, i) => (
          <div key={i} className="flex items-start gap-2">
            <div className="flex-1"><PlaceField label={`Participant ${i + 1}`} value={c} onChange={(v) => setCities((cs) => cs.map((x, j) => j === i ? v : x) as PlaceValue[])} /></div>
            <button type="button" className="btn btn-ghost btn-sm mt-5" aria-label="Remove city" onClick={() => setCities((cs) => cs.filter((_, j) => j !== i))}>✕</button>
          </div>
        ))}
        {cities.length < 6 && <button type="button" className="btn btn-ghost btn-sm" onClick={() => setCities((cs) => [...cs, null as any])}>+ Add city / timezone</button>}
      </div>
      {tzs.length > 0 && (
        <>
          <div className="grid gap-2 sm:grid-cols-2 lg:grid-cols-3">
            {tzs.map((c, i) => {
              const now = localNow(c.tz);
              return <Stat key={i} label={c.label || c.tz} value={now.time} sub={`${c.tz} · ${now.offset}`} />;
            })}
          </div>
          {tzs.length > 1 && (
            <div className="card p-4">
              <div className="label">Working-hours overlap (09–17 local for everyone)</div>
              {grid.overlap.length ? (
                <p className="mt-1 font-display text-lg font-bold text-brand-strong">
                  {grid.overlap[0].toString().padStart(2, "0")}:00–{String(grid.overlap[grid.overlap.length - 1] + 1).padStart(2, "0")}:00 UTC
                  <span className="ml-2 text-sm font-normal text-mute">simultaneous business hours for all participants</span>
                </p>
              ) : (
                <p className="mt-1 text-sm text-mute">No single UTC hour falls inside 09:00–17:00 for every participant — rotate the pain or split across days.</p>
              )}
              <div className="mt-3 overflow-x-auto">
                <table className="tbl min-w-[560px]">
                  <thead><tr><th>City</th>{Array.from({ length: 24 }, (_, h) => <th key={h} className="!px-1 text-center">{h}</th>)}</tr></thead>
                  <tbody>
                    {grid.rows.map((r, i) => (
                      <tr key={i}>
                        <td className="max-w-[120px] truncate font-semibold">{r.label || r.tz}</td>
                        {r.local.map((lh, h) => (
                          <td key={h} className={`!px-1 text-center text-[10px] ${lh >= 9 && lh < 17 ? "bg-brand-soft font-bold text-brand-strong" : "text-mute"}`}>
                            {grid.overlap.includes(h) && lh >= 9 && lh < 17 ? "●" : lh}
                          </td>
                        ))}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </>
      )}
    </div>
  );
}

// ---------- Daylight chart ----------
export function DaylightChartTool() {
  const [place, setPlace] = useState<PlaceValue | null>(null);
  const series = useMemo(() => {
    if (!place) return null;
    const pts: { day: number; hours: number | null }[] = [];
    for (let d = 0; d < 365; d += 3) {
      const date = new Date(Date.UTC(2025, 0, 1 + d));
      const r = sunTimes(place.lat, place.lng, 2025, date.getUTCMonth() + 1, date.getUTCDate());
      pts.push({ day: d, hours: r.dayLengthHours });
    }
    const valid = pts.filter((p) => p.hours !== null) as { day: number; hours: number }[];
    const max = valid.reduce((a, b) => (b.hours > a.hours ? b : a), valid[0]);
    const min = valid.reduce((a, b) => (b.hours < a.hours ? b : a), valid[0]);
    return { pts, max, min };
  }, [place]);

  const W = 620, H = 180, P = 12;
  const x = (d: number) => P + (d / 365) * (W - 2 * P);
  const y = (h: number) => H - P - (h / 24) * (H - 2 * P);

  return (
    <div className="space-y-4">
      <div className="card p-4"><PlaceField label="Location" value={place} onChange={setPlace} placeholder="Search any place…" /></div>
      {series && (
        <div className="card p-4">
          <div className="label">Daylight through the year (2025 pattern repeats annually)</div>
          <svg viewBox={`0 0 ${W} ${H}`} className="mt-2 w-full" role="img" aria-label="Daylight hours across the year">
            {[0, 6, 12, 18, 24].map((h) => (
              <g key={h}>
                <line x1={P} x2={W - P} y1={y(h)} y2={y(h)} stroke="var(--sf-line)" strokeWidth="1" />
                <text x={2} y={y(h) + 3} fontSize="9" fill="var(--sf-mute)">{h}h</text>
              </g>
            ))}
            <path d={series.pts.filter((p) => p.hours !== null).map((p, i) => `${i ? "L" : "M"}${x(p.day).toFixed(1)},${y(p.hours as number).toFixed(1)}`).join("")} fill="none" stroke="var(--sf-brand)" strokeWidth="2.5" />
          </svg>
          <div className="mt-3 grid grid-cols-2 gap-2">
            <Stat label="Longest day" value={fmtDurationHours(series.max.hours)} sub={`around day ${series.max.day} (${new Date(Date.UTC(2025, 0, 1 + series.max.day)).toLocaleDateString("en-US", { month: "short", day: "numeric", timeZone: "UTC" })})`} />
            <Stat label="Shortest day" value={fmtDurationHours(series.min.hours)} sub={`around ${new Date(Date.UTC(2025, 0, 1 + series.min.day)).toLocaleDateString("en-US", { month: "short", day: "numeric", timeZone: "UTC" })}`} />
          </div>
        </div>
      )}
    </div>
  );
}

// ---------- Golden hour ----------
export function GoldenHourTool() {
  const [place, setPlace] = useState<PlaceValue | null>(null);
  const [dateStr, setDateStr] = useState(() => new Date().toISOString().slice(0, 10));
  const res = useMemo(() => {
    if (!place) return null;
    const [Y, M, D] = dateStr.split("-").map(Number);
    if (!Y || !M || !D) return null;
    const low = hourAngleTimes(place.lat, place.lng, Y, M, D, 96);   // sun at −4°
    const high = hourAngleTimes(place.lat, place.lng, Y, M, D, 84); // sun at +6°
    const fmtT = (h: number | null) => {
      if (h === null) return "—";
      const t = ((h % 24) + 24) % 24;
      return `${String(Math.floor(t)).padStart(2, "0")}:${String(Math.round((t % 1) * 60)).padStart(2, "0")} UTC`;
    };
    return { low, high, fmtT };
  }, [place, dateStr]);

  return (
    <div className="space-y-4">
      <div className="card grid gap-3 p-4 sm:grid-cols-2">
        <PlaceField label="Location" value={place} onChange={setPlace} />
        <Field label="Date"><input type="date" className="input" value={dateStr} onChange={(e) => setDateStr(e.target.value)} /></Field>
      </div>
      {res && (
        <div className="grid gap-2 sm:grid-cols-2">
          <Stat label="Morning golden hour" value={`${res.fmtT(res.low.rise)} → ${res.fmtT(res.high.rise)}`} sub="sun climbs from −4° to +6° (UTC)" />
          <Stat label="Evening golden hour" value={`${res.fmtT(res.high.set)} → ${res.fmtT(res.low.set)}`} sub="sun sinks from +6° to −4° (UTC)" />
        </div>
      )}
      <p className="text-xs text-mute">
        Photographers' golden hour is defined here as sun altitude between −4° and +6°: warm, directional light with long shadows.
        Times are UTC — convert with the timezone tool for the location's wall clock. Polar day/night cases report no crossings honestly.
      </p>
    </div>
  );
}
