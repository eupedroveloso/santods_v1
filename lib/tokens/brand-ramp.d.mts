import type { TokenDoc } from "./types";

export type RampOptions = {
  /** Degrau onde a cor oficial entra exata. Padrao "600". */
  anchor?: string;
  /** Matiz (graus OKLCH) dos neutros. Padrao 0. */
  neutralHue?: number;
  /** 0 = cinza puro; numero = croma fixo; "santo" = croma de cada degrau da marca padrao. */
  neutralChroma?: number | "santo";
};
export type RampAuditRow = { name: string; hex: string; base: string; Y: number; baseY: number; vsWhite: number };
export type BrandRamps = {
  official: string;
  anchor: string;
  chromaFactor: number;
  hue: number;
  /** palette/brand/* (11) e palette/neutral/* (13). */
  values: Record<string, string>;
  audit: RampAuditRow[];
};
export declare function baseRamp(doc: TokenDoc, family: string): [string, string][];
export declare function brandRamps(doc: TokenDoc, official: string, opts?: RampOptions): BrandRamps;
