// Central tool registry — metadata for every tool page.
import { TOOLS_A } from "./registry-tools-a";
import { TOOLS_B } from "./registry-tools-b";

export type CategoryId =
  | "location" | "distance" | "radius" | "routing" | "coordinates"
  | "files" | "creation" | "earth" | "sun" | "lines" | "population" | "network";

export interface CategoryDef {
  id: CategoryId; label: string; short: string; tone: string;
}

export const CATEGORIES: CategoryDef[] = [
  { id: "location", label: "Location", short: "Find out where you are — county, city, state, ZIP, country and addresses.", tone: "#1d6e63" },
  { id: "distance", label: "Distance & Bearing", short: "Measure distances, bearings and midpoints between any two places on Earth.", tone: "#b45309" },
  { id: "routing", label: "Routing & Travel Time", short: "Real road routes, travel times, multi-stop planning and drive-time areas.", tone: "#9d174d" },
  { id: "radius", label: "Radius & Area", short: "Draw radii, rings and polygons; measure areas in any unit.", tone: "#4d7c0f" },
  { id: "coordinates", label: "Coordinates", short: "Find, convert and validate GPS coordinates in every common format.", tone: "#0e7490" },
  { id: "files", label: "Map Files", short: "View, validate and convert KML, GeoJSON, GPX and CSV — right in the browser.", tone: "#6d28d9" },
  { id: "creation", label: "Map Creation", short: "Drop pins, label places and export your own custom maps.", tone: "#c2410c" },
  { id: "earth", label: "Earth Science", short: "Elevation, horizon distance, antipodes and other planetary calculators.", tone: "#155e75" },
  { id: "sun", label: "Sun & Moon", short: "Sunrise, sunset, day length and lunar phases for any place and date.", tone: "#a16207" },
  { id: "lines", label: "Geographic Lines", short: "Explore the Equator, meridians, tropics and polar circles on a live map.", tone: "#334155" },
  { id: "population", label: "Places & Population", short: "Find cities and ZIP codes inside a radius and estimate population.", tone: "#7c2d12" },
  { id: "network", label: "IP & Network", short: "Look up public IP addresses, geolocation, ISP, ASN and network details.", tone: "#475569" },
];

export interface ToolDef {
  slug: string;
  name: string;
  short: string;
  intro: string;
  category: CategoryId;
  scope: "Worldwide" | "US focused" | "Major cities" | "Major airports";
  component: string;
  props?: Record<string, unknown>;
  keywords: string[];
  popular?: boolean;
  faq: [string, string][];
  howTo: string[];
  related: string[];
  method?: string;
}

export const TOOLS: ToolDef[] = [...TOOLS_A, ...TOOLS_B] as ToolDef[];

export const toolBySlug = new Map(TOOLS.map((t) => [t.slug, t]));
export const popularTools = TOOLS.filter((t) => t.popular);
export const toolsByCategory = (id: CategoryId) => TOOLS.filter((t) => t.category === id);

export const STATIC_LINKS = [
  { href: "/", name: "Home", keywords: ["home", "start"] },
  { href: "/tools", name: "All Tools", keywords: ["directory", "all tools", "list"] },
  { href: "/about", name: "About", keywords: ["about"] },
  { href: "/methodology", name: "Methodology", keywords: ["accuracy", "methods", "formulas"] },
  { href: "/data-sources", name: "Data Sources", keywords: ["data", "attribution", "sources"] },
  { href: "/privacy", name: "Privacy", keywords: ["privacy"] },
  { href: "/contact", name: "Contact", keywords: ["contact"] },
];
