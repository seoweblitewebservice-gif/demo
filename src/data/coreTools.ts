import { CORE_B1 } from "./coreToolsB1";
import { CORE_B2 } from "./coreToolsB2";
import { CORE_B3 } from "./coreToolsB3";

/** Full core tool set restored from stable commit. */
export const CORE_TOOLS = [...CORE_B1, ...CORE_B2, ...CORE_B3] as const;
