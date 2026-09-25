"use client";
import { useMemo, useState } from "react";
import tzlookup from "tz-lookup";
import { Field, Stat, ErrorBox } from "@/components/ui";
import { PlaceField, type PlaceValue } from "./shared";

const R_KM = 6371.0088;
const toRad = (d: number) => d * Math.PI / 180;
const toDeg = (r: number) => r * 180 / Math.PI;

function haversine(a: PlaceValue, b: PlaceValue) {
  const p1 = toRad(a.lat), p2 = toRad(b.lat), dp = toRad(b.lat - a.lat), dl = toRad(b.lng - a.lng);
  const h = Math.sin(dp / 2) ** 2 + Math.cos(p1) * Math.cos(p2) * Math.sin(dl / 2) ** 2;
  return 2 * R_KM * Math.asin(Math.sqrt(h));
}

function offsetMs(tz: string, date: Date) {
  const parts = new Intl.DateTimeFormat("en-US", { timeZone: tz, year: "numeric", month: "2-digit", day: "2-digit", hour: "2-digit", minute: "2-digit", second: "2-digit", hourCycle: "h23" }).formatToParts(date);
  const v: Record<string, string> = {};
  for (const p of parts) if (p.type !== "literal") v[p.type] = p.value;
  const asUtc = Date.UTC(+v.year, +v.month - 1, +v.day, +v.hour, +v.minute, +v.second);
  return asUtc - date.getTime();
}

function wallTimeToUtc(value: string, tz: string) {
  const [d, t] = value.split("T");
  if (!d || !t) return null;
  const [y, m, day] = d.split("-").map(Number); const [hh, mm] = t.split(":").map(Number);
  let guess = new Date(Date.UTC(y, m - 1, day, hh, mm));
  for (let i = 0; i < 2; i++) guess = new Date(Date.UTC(y, m - 1, day, hh, mm) - offsetMs(tz, guess));
  return guess;
}

export function TimeZoneConverterTool() {
  const [from, setFrom] = useState<PlaceValue | null>(null), [to, setTo] = useState<PlaceValue | null>(null);
  const [when, setWhen] = useState(() => new Date().toISOString().slice(0, 16));
  const result = useMemo(() => {
    if (!from || !to) return null;
    try {
      const a = tzlookup(from.lat, from.lng), b = tzlookup(to.lat, to.lng), utc = wallTimeToUtc(when, a);
      if (!utc) return null;
      const fmt = (tz: string) => new Intl.DateTimeFormat("en-US", { timeZone: tz, dateStyle: "medium", timeStyle: "short" }).format(utc);
      return { a, b, source: fmt(a), target: fmt(b), utc: utc.toISOString().replace("T", " ").slice(0, 16) + " UTC" };
    } catch { return null; }
  }, [from, to, when]);
  return <div className="space-y-4"><div className="card grid gap-3 p-4 md:grid-cols-3"><PlaceField label="From city / place" value={from} onChange={setFrom}/><Field label="Local date & time"><input className="input" type="datetime-local" value={when} onChange={e=>setWhen(e.target.value)}/></Field><PlaceField label="To city / place" value={to} onChange={setTo}/></div>{result&&<div className="grid gap-2 md:grid-cols-3"><Stat label={result.a} value={result.source}/><Stat label={result.b} value={result.target}/><Stat label="Same instant" value={result.utc}/></div>}<p className="text-xs text-mute">Uses IANA time-zone rules through the browser, including daylight-saving changes for the selected date.</p></div>;
}

export function FlightDistanceTool() {
  const [a,setA]=useState<PlaceValue|null>(null),[b,setB]=useState<PlaceValue|null>(null);
  const km = a&&b ? haversine(a,b) : null;
  return <div className="space-y-4"><div className="card grid gap-3 p-4 sm:grid-cols-2"><PlaceField label="Airport / city A" value={a} onChange={setA}/><PlaceField label="Airport / city B" value={b} onChange={setB}/></div>{km!==null&&<div className="grid gap-2 sm:grid-cols-3"><Stat label="Great-circle distance" value={`${km.toFixed(0)} km`} sub={`${(km*0.621371).toFixed(0)} mi`}/><Stat label="Approx. air time" value={`${Math.max(.5,km/850).toFixed(1)} h`} sub="at ~850 km/h cruise"/><Stat label="Planning estimate" value={`${(km*1.03).toFixed(0)} km`} sub="small routing allowance"/></div>}</div>;
}

export function MeetingPointTool() {
  const [places,setPlaces]=useState<PlaceValue[]>([null as any,null as any]);
  const valid=places.filter(Boolean) as PlaceValue[];
  const point=useMemo(()=>{if(valid.length<2)return null;let x=0,y=0,z=0;for(const p of valid){const lat=toRad(p.lat),lng=toRad(p.lng);x+=Math.cos(lat)*Math.cos(lng);y+=Math.cos(lat)*Math.sin(lng);z+=Math.sin(lat);}x/=valid.length;y/=valid.length;z/=valid.length;const lng=Math.atan2(y,x),hyp=Math.sqrt(x*x+y*y),lat=Math.atan2(z,hyp);return{lat:toDeg(lat),lng:toDeg(lng)};},[places]);
  return <div className="space-y-4"><div className="card space-y-3 p-4">{places.map((p,i)=><div key={i} className="flex gap-2"><div className="flex-1"><PlaceField label={`Location ${i+1}`} value={p} onChange={v=>setPlaces(ps=>ps.map((x,j)=>j===i?v:x) as PlaceValue[])}/></div>{places.length>2&&<button className="btn btn-ghost btn-sm mt-5" onClick={()=>setPlaces(ps=>ps.filter((_,j)=>j!==i))}>✕</button>}</div>)}{places.length<6&&<button className="btn btn-ghost btn-sm" onClick={()=>setPlaces(ps=>[...ps,null as any])}>+ Add location</button>}</div>{point&&<div className="grid gap-2 sm:grid-cols-2"><Stat label="Geographic meeting point" value={`${point.lat.toFixed(5)}, ${point.lng.toFixed(5)}`}/><Stat label="Method" value="Spherical centroid" sub="equal weight per location"/></div>}<p className="text-xs text-mute">This is a geographic centre, not a travel-time optimum. Roads, borders and flight networks can shift the practical meeting place.</p></div>;
}

export function MapScaleTool(){const[scale,setScale]=useState(50000),[cm,setCm]=useState(2);const meters=cm/100*scale;return <div className="space-y-4"><div className="card grid gap-3 p-4 sm:grid-cols-2"><Field label="Scale denominator (1 : n)"><input className="input" type="number" min="1" value={scale} onChange={e=>setScale(+e.target.value||1)}/></Field><Field label="Distance on map (cm)"><input className="input" type="number" min="0" step="0.1" value={cm} onChange={e=>setCm(+e.target.value||0)}/></Field></div><div className="grid gap-2 sm:grid-cols-3"><Stat label="Ground distance" value={`${meters.toFixed(1)} m`}/><Stat label="Kilometres" value={`${(meters/1000).toFixed(3)} km`}/><Stat label="Miles" value={`${(meters/1609.344).toFixed(3)} mi`}/></div></div>}

export function BoundingBoxTool(){const[p,setP]=useState<PlaceValue|null>(null),[r,setR]=useState(10);const b=useMemo(()=>{if(!p)return null;const dlat=r/111.32,dlng=r/(111.32*Math.max(.01,Math.cos(toRad(p.lat))));return{n:Math.min(90,p.lat+dlat),s:Math.max(-90,p.lat-dlat),e:((p.lng+dlng+540)%360)-180,w:((p.lng-dlng+540)%360)-180};},[p,r]);return <div className="space-y-4"><div className="card grid gap-3 p-4 sm:grid-cols-2"><PlaceField label="Centre" value={p} onChange={setP}/><Field label="Radius (km)"><input className="input" type="number" min="0.01" value={r} onChange={e=>setR(+e.target.value||0.01)}/></Field></div>{b&&<div className="grid gap-2 sm:grid-cols-2"><Stat label="North / South" value={`${b.n.toFixed(5)} / ${b.s.toFixed(5)}`}/><Stat label="East / West" value={`${b.e.toFixed(5)} / ${b.w.toFixed(5)}`}/></div>}</div>}

export function SlopeGradientTool(){const[rise,setRise]=useState(10),[run,setRun]=useState(100);const grade=run?rise/run*100:0,deg=Math.atan2(rise,run)*180/Math.PI;return <div className="space-y-4"><div className="card grid gap-3 p-4 sm:grid-cols-2"><Field label="Vertical rise"><input className="input" type="number" value={rise} onChange={e=>setRise(+e.target.value||0)}/></Field><Field label="Horizontal run"><input className="input" type="number" value={run} onChange={e=>setRun(+e.target.value||0)}/></Field></div><div className="grid gap-2 sm:grid-cols-3"><Stat label="Grade" value={`${grade.toFixed(2)}%`}/><Stat label="Angle" value={`${deg.toFixed(2)}°`}/><Stat label="Ratio" value={rise?`1 : ${(run/rise).toFixed(2)}`:"—"}/></div></div>}

export function EarthCurvatureTool(){const[d,setD]=useState(10);const m=d*1000,drop=R_KM*1000-Math.sqrt((R_KM*1000)**2-m**2);return <div className="space-y-4"><div className="card p-4"><Field label="Surface distance (km)"><input className="input" type="number" min="0" max="6000" value={d} onChange={e=>setD(+e.target.value||0)}/></Field></div><div className="grid gap-2 sm:grid-cols-2"><Stat label="Geometric curvature drop" value={`${drop.toFixed(2)} m`}/><Stat label="In feet" value={`${(drop*3.28084).toFixed(2)} ft`}/></div><p className="text-xs text-mute">Simple spherical-Earth geometry. Atmospheric refraction can reduce the apparent curvature in real line-of-sight observations.</p></div>}

export function RadioLosTool(){const[h1,setH1]=useState(2),[h2,setH2]=useState(20);const geom=3.57*(Math.sqrt(Math.max(0,h1))+Math.sqrt(Math.max(0,h2))),refr=4.12*(Math.sqrt(Math.max(0,h1))+Math.sqrt(Math.max(0,h2)));return <div className="space-y-4"><div className="card grid gap-3 p-4 sm:grid-cols-2"><Field label="Antenna 1 height (m)"><input className="input" type="number" min="0" value={h1} onChange={e=>setH1(+e.target.value||0)}/></Field><Field label="Antenna 2 height (m)"><input className="input" type="number" min="0" value={h2} onChange={e=>setH2(+e.target.value||0)}/></Field></div><div className="grid gap-2 sm:grid-cols-2"><Stat label="Geometric horizon LOS" value={`${geom.toFixed(1)} km`}/><Stat label="4/3-Earth radio estimate" value={`${refr.toFixed(1)} km`}/></div><p className="text-xs text-mute">Screening estimate only. Real RF links also depend on terrain, Fresnel clearance, frequency, antenna gain and atmospheric conditions.</p></div>}

export function GeoJsonValidatorTool(){const[text,setText]=useState('{\n  "type": "FeatureCollection",\n  "features": []\n}');const result=useMemo(()=>{try{const o=JSON.parse(text);const allowed=["FeatureCollection","Feature","Point","MultiPoint","LineString","MultiLineString","Polygon","MultiPolygon","GeometryCollection"];if(!o||!allowed.includes(o.type))return{ok:false,msg:"JSON is valid, but the top-level GeoJSON type is missing or unsupported."};if(o.type==="FeatureCollection"&&!Array.isArray(o.features))return{ok:false,msg:"FeatureCollection.features must be an array."};return{ok:true,msg:`Valid GeoJSON structure: ${o.type}.`};}catch(e){return{ok:false,msg:e instanceof Error?e.message:"Invalid JSON"};}},[text]);return <div className="space-y-3"><Field label="Paste GeoJSON"><textarea className="input min-h-64 font-mono text-xs" value={text} onChange={e=>setText(e.target.value)}/></Field>{result.ok?<div className="rounded-lg border border-brand/40 bg-brand-soft p-3 text-sm font-semibold text-brand-strong">✓ {result.msg}</div>:<ErrorBox>{result.msg}</ErrorBox>}<p className="text-xs text-mute">Checks JSON syntax and core GeoJSON container structure locally in your browser; it does not upload the geometry.</p></div>}

function readGpx(file: File) { return file.text().then(t=>new DOMParser().parseFromString(t,"application/xml")); }
export function GpxToCsvTool(){const[rows,setRows]=useState<string|null>(null),[error,setError]=useState<string|null>(null);const load=async(f?:File)=>{if(!f)return;setError(null);const doc=await readGpx(f);if(doc.querySelector("parsererror")){setError("Invalid GPX/XML file.");return;}const pts=[...doc.querySelectorAll("trkpt, rtept, wpt")];const out=["latitude,longitude,elevation,time,name",...pts.map(p=>[p.getAttribute("lat")||"",p.getAttribute("lon")||"",p.querySelector("ele")?.textContent||"",p.querySelector("time")?.textContent||"",JSON.stringify(p.querySelector("name")?.textContent||"")].join(","))].join("\n");setRows(out);};return <div className="space-y-3"><Field label="GPX file"><input className="input" type="file" accept=".gpx,application/gpx+xml,application/xml,text/xml" onChange={e=>load(e.target.files?.[0])}/></Field>{error&&<ErrorBox>{error}</ErrorBox>}{rows&&<><Stat label="CSV rows" value={String(Math.max(0,rows.split("\n").length-1))}/><button className="btn btn-primary" onClick={()=>{const a=document.createElement("a");a.href=URL.createObjectURL(new Blob([rows],{type:"text/csv"}));a.download="mapbench-gpx.csv";a.click();URL.revokeObjectURL(a.href);}}>Download CSV</button></>}</div>}

export function GpxMergerTool(){const[files,setFiles]=useState<File[]>([]),[error,setError]=useState<string|null>(null);const merge=async()=>{if(files.length<2){setError("Choose at least two GPX files.");return;}setError(null);const docs=await Promise.all(files.map(readGpx));if(docs.some(d=>d.querySelector("parsererror"))){setError("One of the files is invalid GPX/XML.");return;}const parts=docs.flatMap(d=>[...d.querySelectorAll("trk, rte, wpt")].map(n=>new XMLSerializer().serializeToString(n)));const xml=`<?xml version="1.0" encoding="UTF-8"?><gpx version="1.1" creator="MapBench" xmlns="http://www.topografix.com/GPX/1/1">${parts.join("")}</gpx>`;const a=document.createElement("a");a.href=URL.createObjectURL(new Blob([xml],{type:"application/gpx+xml"}));a.download="mapbench-merged.gpx";a.click();URL.revokeObjectURL(a.href);};return <div className="space-y-3"><Field label="GPX files"><input className="input" type="file" multiple accept=".gpx,application/gpx+xml,application/xml,text/xml" onChange={e=>setFiles([...e.target.files||[]])}/></Field>{files.length>0&&<Stat label="Selected files" value={String(files.length)}/>}<button className="btn btn-primary" onClick={merge}>Merge and download GPX</button>{error&&<ErrorBox>{error}</ErrorBox>}<p className="text-xs text-mute">Merging happens locally in your browser. Original track, route and waypoint elements are preserved as separate GPX elements.</p></div>}
