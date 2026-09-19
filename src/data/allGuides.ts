import { GUIDES, type Guide } from "./guides";
import { GUIDES2 } from "./guides2";
import { GUIDES3 } from "./guides3";

export const ALL_GUIDES: Guide[] = [...GUIDES, ...GUIDES2, ...GUIDES3];
export const allGuideBySlug = new Map(ALL_GUIDES.map((g) => [g.slug, g]));
