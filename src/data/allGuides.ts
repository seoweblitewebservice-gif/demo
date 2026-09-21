import { GUIDES, type Guide } from "./guides";
import { GUIDES2 } from "./guides2";
import { GUIDES3 } from "./guides3";
import { GUIDES4 } from "./guides4";

export const ALL_GUIDES: Guide[] = [...GUIDES, ...GUIDES2, ...GUIDES3, ...GUIDES4];
export const allGuideBySlug = new Map(ALL_GUIDES.map((g) => [g.slug, g]));
