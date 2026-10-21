import type { RawValue, TokenDoc } from "./types";

/** Mesmo formato de SPEC em scripts/figma-brand-mode.js: cobre TODAS as variaveis de Palette e Brand. */
export type BrandSpec = { Palette: Record<string, RawValue>; Brand: Record<string, RawValue> };
export type BrandModeOptions = { mode?: string; fonts?: string[] };

export declare function validateBrandSpec(doc: TokenDoc, spec: BrandSpec, opts?: BrandModeOptions): string[];
export declare function applyBrandMode(
  doc: TokenDoc,
  mode: string,
  spec: BrandSpec,
  descriptions?: Record<string, string>,
  opts?: { fonts?: string[] },
): { doc: TokenDoc; changes: string[] };
export declare function withBrandMode(
  doc: TokenDoc,
  mode: string,
  spec: BrandSpec,
  descriptions?: Record<string, string>,
  opts?: { fonts?: string[] },
): TokenDoc;
export declare function specOfMode(doc: TokenDoc, mode: string): BrandSpec;
