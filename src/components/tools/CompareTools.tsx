"use client";
import { useMemo, useState } from "react";
import { distanceKm, fmt } from "@/lib/geo";
import { COMPARE_CITIES } from "@/data/compare";
import { Field, Stat } from "@/components/ui";

function CitySelect({ value, onChange, label }: { value: string; onChange: (v: string) => void; label: string }) {
  return (
    <Field label={label}>
      <select className="select" value={value} onChange={(e) => onChange(e.target.value)}>
        {COMPARE_CITIES.map((c) => <option key={c.name} value={c.name}>{c.name}, {c.country}</option>)}
      </select>
    </Field>
  );
}

const get = (n: string) => COMPARE_CITIES.find((c) => c.name === n)!;

// ---------- City comparison ----------
export function CityCompareTool() {
  const [a, setA] = useState("New York");
  const [b, setB] = useState("London");
  const ca = get(a), cb = get(b);
  const km = distanceKm(ca, cb);
  return (
    <div className="space-y-4">
      <div className="card grid grid-cols-2 gap-3 p-4">
        <CitySelect label="City A" value={a} onChange={setA} />
        <CitySelect label="City B" value={b} onChange={setB} />
      </div>
      <div className="overflow-x-auto">
        <table className="tbl min-w-[480px]">
          <thead><tr><th>Metric</th><th>{ca.name}</th><th>{cb.name}</th></tr></thead>
          <tbody>
            <tr><td className="text-mute">Metro population</td><td className="font-semibold">{ca.popM} M</td><td className="font-semibold">{cb.popM} M</td></tr>
            <tr><td className="text-mute">Urban density (per km²)</td><td className="font-semibold">{ca.density.toLocaleString()}</td><td className="font-semibold">{cb.density.toLocaleString()}</td></tr>
            <tr><td className="text-mute">Cost-of-living index (NYC = 100)</td><td className="font-semibold">{ca.col}</td><td className="font-semibold">{cb.col}</td></tr>
            <tr><td className="text-mute">Distance between them</td><td colSpan={2} className="font-semibold">{fmt(km, 0)} km · {fmt(km * 0.621371, 0)} mi</td></tr>
          </tbody>
        </table>
      </div>
      <p className="text-xs text-mute">Snapshot dataset (≈2023 vintage, metro definitions vary) — intended for quick comparisons, not research citation. Cost index uses New York = 100 with rent included.</p>
    </div>
  );
}

// ---------- Cost of living ----------
export function ColTool() {
  const [home, setHome] = useState("New York");
  const [target, setTarget] = useState("Bengaluru");
  const [salary, setSalary] = useState(100000);
  const ch = get(home), ct = get(target);
  const equiv = salary * (ct.col / ch.col);
  return (
    <div className="grid gap-4 lg:grid-cols-2">
      <div className="card space-y-4 p-4">
        <CitySelect label="Current city (baseline)" value={home} onChange={setHome} />
        <CitySelect label="Comparing to" value={target} onChange={setTarget} />
        <Field label={`Your salary in ${home} (any currency)`}>
          <input type="number" step="1000" min={0} className="input" value={salary} onChange={(e) => setSalary(Math.max(0, parseFloat(e.target.value) || 0))} />
        </Field>
        <p className="text-xs text-mute">Indexes are approximate, rent-inclusive, New York = 100. Currency-neutral: the ratio is the point, not the unit.</p>
      </div>
      <div className="grid content-start grid-cols-2 gap-2">
        <Stat label={`Equivalent in ${target}`} value={fmt(equiv, 0)} sub="to match purchasing power" />
        <Stat label="Index ratio" value={`×${fmt(ct.col / ch.col, 2)}`} sub={`${ch.col} → ${ct.col}`} />
        <Stat label="Difference" value={`${ct.col > ch.col ? "+" : "−"}${Math.abs(Math.round(((ct.col - ch.col) / ch.col) * 100))}%`} sub="cost level vs current city" />
        <Stat label="Cheaper of the two" value={ch.col <= ct.col ? ch.name : ct.name} />
      </div>
    </div>
  );
}

// ---------- Density comparison ----------
export function DensityTool() {
  const [a, setA] = useState("Mumbai");
  const [b, setB] = useState("Los Angeles");
  const ca = get(a), cb = get(b);
  const ratio = ca.density / cb.density;
  const max = Math.max(ca.density, cb.density);
  return (
    <div className="space-y-4">
      <div className="card grid grid-cols-2 gap-3 p-4">
        <CitySelect label="City A" value={a} onChange={setA} />
        <CitySelect label="City B" value={b} onChange={setB} />
      </div>
      <div className="card space-y-4 p-4">
        {[ca, cb].map((c) => (
          <div key={c.name}>
            <div className="flex justify-between text-sm"><span className="font-bold">{c.name}</span><span className="text-mute">{c.density.toLocaleString()} people / km²</span></div>
            <div className="mt-1 h-3 rounded-full bg-well"><div className="h-3 rounded-full bg-brand" style={{ width: `${(c.density / max) * 100}%` }} /></div>
          </div>
        ))}
        <div className="rounded-lg bg-brand-soft px-4 py-3 text-sm">
          <strong className="text-brand-strong">{ratio >= 1 ? ca.name : cb.name}</strong> is about <strong className="text-brand-strong">{fmt(Math.max(ratio, 1 / ratio), 1)}×</strong> denser than {ratio >= 1 ? cb.name : ca.name}.
        </div>
        <p className="text-xs text-mute">Density uses metro population over approximate built-up area — consistent across the dataset, rough in absolute terms.</p>
      </div>
    </div>
  );
}
