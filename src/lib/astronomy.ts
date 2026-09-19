// Astronomical calculations: NOAA solar position algorithm + lunar phase.
// All times are computed for a specific calendar date at the given coordinates.

export interface SunResult {
  sunriseUTC: number | null; // hours UTC
  sunsetUTC: number | null;
  solarNoonUTC: number;
  dayLengthHours: number | null; // null = polar day/night
  polar: "day" | "night" | null;
  declination: number;
}

function julianDay(date: Date): number {
  return date.getTime() / 86400000 + 2440587.5;
}

/** NOAA solar calculator for a UTC date (date interpreted at 00:00 UTC). */
export function sunTimes(lat: number, lng: number, year: number, month: number, day: number): SunResult {
  const jd = julianDay(new Date(Date.UTC(year, month - 1, day)));
  const T = (jd - 2451545) / 36525;
  const L0 = (280.46646 + T * (36000.76983 + T * 0.0003032)) % 360;
  const M = 357.52911 + T * (35999.05029 - 0.0001537 * T);
  const e = 0.016708634 - T * (0.000042037 + 0.0000001267 * T);
  const Mrad = (M * Math.PI) / 180;
  const C = Math.sin(Mrad) * (1.914602 - T * (0.004817 + 0.000014 * T))
    + Math.sin(2 * Mrad) * (0.019993 - 0.000101 * T) + Math.sin(3 * Mrad) * 0.000289;
  const trueLong = L0 + C;
  const omega = 125.04 - 1934.136 * T;
  const lambda = trueLong - 0.00569 - 0.00478 * Math.sin((omega * Math.PI) / 180);
  const eps0 = 23 + (26 + (21.448 - T * (46.815 + T * (0.00059 - T * 0.001813))) / 60) / 60;
  const eps = eps0 + 0.00256 * Math.cos((omega * Math.PI) / 180);
  const epsRad = (eps * Math.PI) / 180;
  const decl = Math.asin(Math.sin(epsRad) * Math.sin((lambda * Math.PI) / 180));
  const y = Math.tan(epsRad / 2) ** 2;
  const L0rad = (L0 * Math.PI) / 180;
  const eqTime = 4 * ((y * Math.sin(2 * L0rad) - 2 * e * Math.sin(Mrad)
    + 4 * e * y * Math.sin(Mrad) * Math.cos(2 * L0rad) - 0.5 * y * y * Math.sin(4 * L0rad)
    - 1.25 * e * e * Math.sin(2 * Mrad)) * 180) / Math.PI; // minutes

  const latRad = (lat * Math.PI) / 180;
  const cosHA = (Math.cos((90.833 * Math.PI) / 180) / (Math.cos(latRad) * Math.cos(decl))) - Math.tan(latRad) * Math.tan(decl);

  const solarNoonUTC = (720 - 4 * lng - eqTime) / 60;
  let sunriseUTC: number | null = null, sunsetUTC: number | null = null;
  let dayLengthHours: number | null = null;
  let polar: SunResult["polar"] = null;

  if (cosHA > 1) polar = "night";
  else if (cosHA < -1) polar = "day";
  else {
    const HA = (Math.acos(cosHA) * 180) / Math.PI;
    sunriseUTC = (720 - 4 * (lng + HA) - eqTime) / 60;
    sunsetUTC = (720 - 4 * (lng - HA) - eqTime) / 60;
    dayLengthHours = (8 * HA) / 60;
  }
  if (polar === "day") dayLengthHours = 24;
  if (polar === "night") dayLengthHours = 0;

  return { sunriseUTC, sunsetUTC, solarNoonUTC, dayLengthHours, polar, declination: (decl * 180) / Math.PI };
}

/** Rise/set UTC hours for an arbitrary solar zenith angle (degrees).
 *  90.833 = official sunrise, 96 = civil twilight / −4°, 84 = sun at +6°. */
export function hourAngleTimes(
  lat: number, lng: number, year: number, month: number, day: number, zenith: number,
): { rise: number | null; set: number | null; polar: "day" | "night" | null } {
  const jd = new Date(Date.UTC(year, month - 1, day)).getTime() / 86400000 + 2440587.5;
  const T = (jd - 2451545) / 36525;
  const L0 = (280.46646 + T * (36000.76983 + T * 0.0003032)) % 360;
  const M = 357.52911 + T * (35999.05029 - 0.0001537 * T);
  const e = 0.016708634 - T * (0.000042037 + 0.0000001267 * T);
  const Mrad = (M * Math.PI) / 180;
  const C = Math.sin(Mrad) * (1.914602 - T * (0.004817 + 0.000014 * T))
    + Math.sin(2 * Mrad) * (0.019993 - 0.000101 * T) + Math.sin(3 * Mrad) * 0.000289;
  const trueLong = L0 + C;
  const omega = 125.04 - 1934.136 * T;
  const lambda = trueLong - 0.00569 - 0.00478 * Math.sin((omega * Math.PI) / 180);
  const eps0 = 23 + (26 + (21.448 - T * (46.815 + T * (0.00059 - T * 0.001813))) / 60) / 60;
  const eps = eps0 + 0.00256 * Math.cos((omega * Math.PI) / 180);
  const decl = Math.asin(Math.sin((eps * Math.PI) / 180) * Math.sin((lambda * Math.PI) / 180));
  const y = Math.tan((eps * Math.PI) / 360) ** 2;
  const L0rad = (L0 * Math.PI) / 180;
  const eqTime = 4 * ((y * Math.sin(2 * L0rad) - 2 * e * Math.sin(Mrad)
    + 4 * e * y * Math.sin(Mrad) * Math.cos(2 * L0rad) - 0.5 * y * y * Math.sin(4 * L0rad)
    - 1.25 * e * e * Math.sin(2 * Mrad)) * 180) / Math.PI;
  const latRad = (lat * Math.PI) / 180;
  const cosHA = (Math.cos((zenith * Math.PI) / 180) / (Math.cos(latRad) * Math.cos(decl))) - Math.tan(latRad) * Math.tan(decl);
  if (cosHA > 1) return { rise: null, set: null, polar: "night" };
  if (cosHA < -1) return { rise: null, set: null, polar: "day" };
  const HA = (Math.acos(cosHA) * 180) / Math.PI;
  return {
    rise: (720 - 4 * (lng + HA) - eqTime) / 60,
    set: (720 - 4 * (lng - HA) - eqTime) / 60,
    polar: null,
  };
}

export function utcHoursToLocal(utcHours: number, date: Date): Date {
  const base = Date.UTC(date.getUTCFullYear(), date.getUTCMonth(), date.getUTCDate());
  return new Date(base + utcHours * 3600000);
}

export function fmtHours(h: number | null): string {
  if (h === null || !Number.isFinite(h)) return "—";
  const local = new Date(Date.UTC(2000, 0, 1) + h * 3600000);
  return local.toLocaleTimeString("en-US", { hour: "2-digit", minute: "2-digit", timeZone: "UTC" }) + " UTC";
}

export function fmtDurationHours(h: number | null): string {
  if (h === null) return "—";
  const hh = Math.floor(h), mm = Math.round((h - hh) * 60);
  return `${hh}h ${String(mm).padStart(2, "0")}m`;
}

// ---------- Moon ----------
export interface MoonInfo {
  age: number; // days since new moon
  phase: string;
  illumination: number; // 0..1
  emoji: string;
  nextFullMoon: Date;
  nextNewMoon: Date;
}

const SYNODIC = 29.530588853;
const KNOWN_NEW_MOON = Date.UTC(2000, 0, 6, 18, 14); // 2000-01-06 18:14 UTC

export function moonPhase(date: Date): MoonInfo {
  const since = (date.getTime() - KNOWN_NEW_MOON) / 86400000;
  const age = ((since % SYNODIC) + SYNODIC) % SYNODIC;
  const illumination = (1 - Math.cos((2 * Math.PI * age) / SYNODIC)) / 2;
  const frac = age / SYNODIC;
  let phase = "New Moon", emoji = "🌑";
  if (frac < 0.033 || frac > 0.967) { phase = "New Moon"; emoji = "🌑"; }
  else if (frac < 0.216) { phase = "Waxing Crescent"; emoji = "🌒"; }
  else if (frac < 0.284) { phase = "First Quarter"; emoji = "🌓"; }
  else if (frac < 0.467) { phase = "Waxing Gibbous"; emoji = "🌔"; }
  else if (frac < 0.533) { phase = "Full Moon"; emoji = "🌕"; }
  else if (frac < 0.716) { phase = "Waning Gibbous"; emoji = "🌖"; }
  else if (frac < 0.784) { phase = "Last Quarter"; emoji = "🌗"; }
  else { phase = "Waning Crescent"; emoji = "🌘"; }
  const cyclesSince = Math.floor(since / SYNODIC);
  const nextNew = new Date(KNOWN_NEW_MOON + (cyclesSince + 1) * SYNODIC * 86400000);
  const nextFull = new Date(KNOWN_NEW_MOON + (cyclesSince + (frac < 0.5 ? 0.5 : 1.5)) * SYNODIC * 86400000);
  return { age, phase, illumination, emoji, nextFullMoon: nextFull, nextNewMoon: nextNew };
}
