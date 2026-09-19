import { COPY1 } from "./toolCopy1";
import { COPY2 } from "./toolCopy2";
import { COPY3 } from "./toolCopy3";
import { COPY4 } from "./toolCopy4";
import { COPY5 } from "./toolCopy5";
import { COPY6A } from "./toolCopy6a";
import { COPY6B } from "./toolCopy6b";

export interface ToolCopy { h2: string; paras: string[] }

/** ~180–210 words of unique on-page content per tool slug. */
export const TOOL_COPY: Record<string, ToolCopy> = {
  ...COPY1,
  ...COPY2,
  ...COPY3,
  ...COPY4,
  ...COPY5,
  ...COPY6A,
  ...COPY6B,
};
