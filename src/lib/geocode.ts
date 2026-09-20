// Geocoding provider abstraction: Photon (forward) + Nominatim (reverse).
// Both are free OpenStreetMap-based services; we debounce and show friendly errors.

import type { LatLng } from "./geo";

export interface GeocodeHit {
  label: string;
  lat: number;
  lng: number;
  kind?: string; // city, street, country…
  country?: string;
}

export async function photonSearch(query: string, limit = 5): Promise<{ ok: true; results: GeocodeHit[] } | { ok: false; message: string }> {
  if (!query.trim()) return { ok: true, results: [] };
  try {
    const url = `https://photon.komoot.io/api/?q=${encodeURIComponent(query)}&limit=${limit}`;
    const res = await fetch(url);
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    const data = await res.json();
    const results: GeocodeHit[] = (data.features || [])
      .filter((f: any) => f.geometry?.coordinates)
      .map((f: any) => {
        const p = f.properties || {};
        const parts = [p.name, p.street && p.housenumber ? `${p.street} ${p.housenumber}` : p.street, p.city || p.town || p.village, p.state, p.country].filter(Boolean);
        return {
          label: [...new Set(parts)].join(", ") || p.name || "Unnamed place",
          lat: f.geometry.coordinates[1],
          lng: f.geometry.coordinates[0],
          kind: p.osm_value,
          country: p.country,
        };
      });
    return { ok: true, results };
  } catch {
    return { ok: false, message: "Location search is temporarily unavailable. Check your connection and try again." };
  }
}

export interface ReverseResult {
  displayName: string;
  address: Record<string, string>;
  lat: number;
  lng: number;
}

export async function nominatimReverse(lat: number, lng: number, zoom = 16): Promise<{ ok: true; result: ReverseResult } | { ok: false; message: string }> {
  try {
    const url = `https://nominatim.openstreetmap.org/reverse?format=jsonv2&lat=${lat}&lon=${lng}&zoom=${zoom}&addressdetails=1&accept-language=en`;
    const res = await fetch(url, { headers: { Accept: "application/json" } });
    if (res.status === 429) return { ok: false, message: "The reverse geocoding service is rate-limited right now. Wait a few seconds and try again." };
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    const data = await res.json();
    if (data.error) return { ok: false, message: "No address was found at these coordinates. Try coordinates on land." };
    return { ok: true, result: { displayName: data.display_name || "Unknown location", address: data.address || {}, lat, lng } };
  } catch {
    return { ok: false, message: "Reverse geocoding is temporarily unavailable. Please try again shortly." };
  }
}

/** Extract friendly fields from a Nominatim address object. */
export function addressBreakdown(address: Record<string, string>) {
  const city = address.city || address.town || address.village || address.hamlet || address.municipality || address.county || "";
  return {
    place: city,
    city,
    county: address.county || "",
    state: address.state || address.region || "",
    postcode: address.postcode || "",
    country: address.country || "",
    countryCode: (address.country_code || "").toUpperCase(),
    road: address.road || "",
    houseNumber: address.house_number || "",
    suburb: address.suburb || address.neighbourhood || address.quarter || "",
  };
}

export interface GeolocationDetails extends LatLng {
  accuracy: number;
  altitude?: number | null;
  heading?: number | null;
  speed?: number | null;
  timestamp: number;
}

function geolocationOnce(options: PositionOptions): Promise<GeolocationDetails> {
  return new Promise((resolve, reject) => {
    if (typeof navigator === "undefined" || !navigator.geolocation) {
      reject(new Error("This browser does not support geolocation."));
      return;
    }
    navigator.geolocation.getCurrentPosition(
      (pos) =>
        resolve({
          lat: pos.coords.latitude,
          lng: pos.coords.longitude,
          accuracy: pos.coords.accuracy,
          altitude: pos.coords.altitude,
          heading: pos.coords.heading,
          speed: pos.coords.speed,
          timestamp: pos.timestamp,
        }),
      (err) => {
        const msg =
          err.code === 1
            ? "Location permission was denied. Allow location for this site in your browser settings, or turn off VPN location blocking, then try again."
            : err.code === 2
              ? "Your position could not be determined. If a VPN is on, try turning it off or disable location-blocking in the VPN app, then retry."
              : "Getting your position timed out. Try again outdoors, or with VPN off if location is blocked.";
        reject(new Error(msg));
      },
      options,
    );
  });
}

/**
 * Prefer precise GPS; if that fails (common with VPN / indoors), fall back to
 * network-based location. Browser geolocation uses the device sensors — not
 * the VPN IP — but many VPN apps block or delay location APIs.
 */
export async function geolocationDetails(): Promise<GeolocationDetails> {
  try {
    return await geolocationOnce({
      enableHighAccuracy: true,
      timeout: 10000,
      maximumAge: 60000,
    });
  } catch (first) {
    try {
      return await geolocationOnce({
        enableHighAccuracy: false,
        timeout: 15000,
        maximumAge: 120000,
      });
    } catch {
      throw first instanceof Error ? first : new Error("Could not determine your location.");
    }
  }
}

export function geolocation(): Promise<LatLng> {
  return geolocationDetails().then(({ lat, lng }) => ({ lat, lng }));
}

/** IP-based approximate location (affected by VPN exit node). */
export async function ipGeolocation(): Promise<{
  lat: number;
  lng: number;
  ip: string;
  city?: string;
  region?: string;
  country?: string;
  org?: string;
} | null> {
  const tryIpwho = async () => {
    const res = await fetch("https://ipwho.is/");
    const data = await res.json();
    if (data?.success && Number.isFinite(data.latitude) && Number.isFinite(data.longitude)) {
      return {
        lat: Number(data.latitude),
        lng: Number(data.longitude),
        ip: String(data.ip ?? ""),
        city: data.city,
        region: data.region,
        country: data.country,
        org: data.connection?.org,
      };
    }
    return null;
  };
  const tryIpapi = async () => {
    const res = await fetch("https://ipapi.co/json/");
    const data = await res.json();
    if (Number.isFinite(data?.latitude) && Number.isFinite(data?.longitude)) {
      return {
        lat: Number(data.latitude),
        lng: Number(data.longitude),
        ip: String(data.ip ?? ""),
        city: data.city,
        region: data.region,
        country: data.country_name,
        org: data.org,
      };
    }
    return null;
  };
  try {
    return (await tryIpwho()) ?? (await tryIpapi());
  } catch {
    try {
      return await tryIpapi();
    } catch {
      return null;
    }
  }
}
