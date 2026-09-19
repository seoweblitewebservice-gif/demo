"use client";
import { useEffect, useState } from "react";
import { sunTimes, fmtDurationHours, moonPhase } from "@/lib/astronomy";
import { readUrlParams, syncUrl, Field, Stat, ErrorBox } from "@/components/ui";
import { PlaceField, type PlaceValue } from "./shared";

function fmtUtc(hours: number | null): string {
  if (hours === null || !Number.isFinite(hours)) return "—";
  const h = ((hours % 24) + 24) % 24;
  const hh = Math.floor(h), mm = Math.round((h - hh) * 60);
  return `${String(hh).padStart(2, "0")}:${String(mm).padStart(2, "0")} UTC`;
}

function utcToLocalLabel(hours: number | null): string {
  if (hours === null || !Number.isFinite(hours)) return "";
  const d = new Date();
  const local = new Date(Date.UTC(d.getUTCFullYear(), d.getUTCMonth(), d.getUTCDate()) + hours * 3600000);
  return `${local.toLocaleTimeString("en-US", { hour: "2-digit", minute: "2-digit" })} (your device time)`;
}

export function SunTool({ params }: { params?: Record<string, unknown> }) {
  const [place, setPlace] = useState<PlaceValue | null>(() => {
    const p = readUrlParams();
    const lat = parseFloat(p.get("lat") ?? ""), lng = parseFloat(p.get("lng") ?? "");
    return Number.isFinite(lat) && Number.isFinite(lng) ? { lat, lng } : null;
  });
  const [dateStr, setDateStr] = useState(() => readUrlParams().get("date") ?? new Date().toISOString().slice(0, 10));

  useEffect(() => { syncUrl({ lat: place?.lat.toFixed(5) ?? null, lng: place?.lng.toFixed(5) ?? null, date: dateStr }); }, [place, dateStr]);

  const res = (() => {
    if (!place) return null;
    const [y, m, d] = dateStr.split("-").map(Number);
    if (!y || !m || !d) return null;
    return sunTimes(place.lat, place.lng, y, m, d);
  })();

  return (
    <div className="space-y-4">
      <div className="card grid gap-4 p-4 sm:grid-cols-2 lg:grid-cols-4">
        <div className="sm:col-span-2"><PlaceField label="Location" value={place} onChange={setPlace} placeholder="Search a place or click below…" /></div>
        <Field label="Date">
          <input type="date" className="input" value={dateStr} max="2100-12-31" min="1900-01-01" onChange={(e) => setDateStr(e.target.value)} />
        </Field>
        <div className="flex items-end">
          <span className="chip">{place ? `${place.lat.toFixed(3)}, ${place.lng.toFixed(3)}` : "no location yet"}</span>
        </div>
      </div>

      {res && (
        <div className="grid gap-2 sm:grid-cols-2 lg:grid-cols-4">
          <Stat label="Sunrise" value={res.polar === "night" ? "Polar night" : fmtUtc(res.sunriseUTC)} sub={res.sunriseUTC !== null ? utcToLocalLabel(res.sunriseUTC) : res.polar === "day" ? "Sun never sets today" : undefined} />
          <Stat label="Sunset" value={res.polar === "day" ? "Polar day" : fmtUtc(res.sunsetUTC)} sub={res.sunsetUTC !== null ? utcToLocalLabel(res.sunsetUTC) : undefined} />
          <Stat label="Solar noon" value={fmtUtc(res.solarNoonUTC)} sub={utcToLocalLabel(res.solarNoonUTC)} />
          <Stat label="Day length" value={res.dayLengthHours !== null ? fmtDurationHours(res.dayLengthHours) : "—"} sub={res.polar ? (res.polar === "day" ? "24 h of daylight" : "0 h of daylight") : "civil definition (90.833° zenith)"} />
        </div>
      )}
      {res?.polar && (
        <ErrorBox>
          {res.polar === "day"
            ? "This location is inside the polar circles in summer — the Sun stays above the horizon all day (midnight sun)."
            : "This location is inside the polar circles in winter — the Sun stays below the horizon all day (polar night)."}
        </ErrorBox>
      )}
      {place && res && (
        <p className="text-xs text-mute">
          NOAA solar algorithm · solar declination today: {res.declination.toFixed(2)}°. Times are astronomical (UTC) — the wall-clock time at the location
          depends on its political time zone, which can differ strongly from solar time (e.g. western China, Spain).
        </p>
      )}
      {!place && <p className="text-sm text-mute">Search a place above — results appear instantly (all math runs locally).</p>}
    </div>
  );
}

export function MoonTool() {
  const [dateStr, setDateStr] = useState(() => readUrlParams().get("date") ?? new Date().toISOString().slice(0, 10));
  useEffect(() => { syncUrl({ date: dateStr }); }, [dateStr]);

  const info = (() => {
    const [y, m, d] = dateStr.split("-").map(Number);
    if (!y || !m || !d) return null;
    return moonPhase(new Date(Date.UTC(y, m - 1, d, 12)));
  })();

  return (
    <div className="grid gap-4 lg:grid-cols-2">
      <div className="card space-y-4 p-4">
        <Field label="Date">
          <input type="date" className="input" value={dateStr} onChange={(e) => setDateStr(e.target.value)} />
        </Field>
        {info && (
          <>
            <div className="flex items-center gap-4 rounded-xl bg-well px-5 py-4">
              <span className="text-5xl" aria-hidden>{info.emoji}</span>
              <div>
                <div className="font-display text-xl font-bold">{info.phase}</div>
                <div className="text-sm text-mute">{(info.illumination * 100).toFixed(1)}% illuminated · day {info.age.toFixed(1)} of the 29.53-day cycle</div>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-2">
              <Stat label="Next full moon" value={info.nextFullMoon.toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })} />
              <Stat label="Next new moon" value={info.nextNewMoon.toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })} />
            </div>
          </>
        )}
      </div>
      <div className="card p-6">
        <h3 className="font-display text-base font-bold">The lunar cycle at a glance</h3>
        <ol className="mt-3 space-y-2 text-sm text-mute">
          <li><strong className="text-ink">New Moon</strong> — Moon between Earth and Sun; rises and sets with the Sun.</li>
          <li><strong className="text-ink">First Quarter</strong> — half lit, visible in the afternoon and evening.</li>
          <li><strong className="text-ink">Full Moon</strong> — opposite the Sun; rises at sunset, sets at sunrise.</li>
          <li><strong className="text-ink">Last Quarter</strong> — half lit, visible late night and morning.</li>
        </ol>
        <p className="mt-3 text-xs text-mute">Phase is a global geometric property — the same everywhere on Earth at a given moment (orientation flips between hemispheres).</p>
      </div>
    </div>
  );
}
