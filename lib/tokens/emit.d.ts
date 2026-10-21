import type { Declaration, TokenDoc, ShadowLayer, TextStyleDef, VariableType, RawValue, EffectStyleDef } from "./types";

export declare const BANNER: string;
export declare function isAlias(v: unknown): v is string;
export declare function aliasTarget(v: string): string;
export declare function varNameOf(path: string, prefix: string): string;

export type IndexEntry = {
  name: string;
  collection: string;
  modes: string[];
  defaultMode: string;
  type: VariableType;
  values: Record<string, RawValue>;
  scopes: string[];
  description: string;
};

export declare function buildIndex(doc: TokenDoc): Map<string, IndexEntry>;
export declare function resolveValue(
  index: Map<string, IndexEntry>,
  value: RawValue,
  mode: string,
  seen?: Set<string>,
): RawValue;
export declare function toCss(name: string, type: VariableType, value: RawValue, prefix: string): string;
export declare function unitOf(name: string, type: VariableType): string;
/** Com `prefix`, camada com cor ligada a variavel sai como var(--<prefix>-...). */
export declare function shadowCss(effects: ShadowLayer[] | undefined, prefix?: string): string;
export declare function fontStacks(prefix: string): { sans: string; mono: string; heading: string };
export declare function stackOf(fontFamilyBinding: string | undefined): "sans" | "mono" | "heading";
export declare function trackingByPercent(index: Map<string, IndexEntry>): Map<RawValue, string>;
export declare function textStyleClass(figmaName: string, prefix: string): string;
export declare const BRAND_COLLECTIONS: readonly string[];
export type BrandMode = { mode: string; id: string; name: string; isDefault: boolean };
export declare function brandModes(doc: TokenDoc): BrandMode[];
export declare function brandDependents(index: Map<string, IndexEntry>): Set<string>;
/** Bloco CSS de uma marca, igual ao que tokens.css traz; `scope` padrao [data-brand='<id>']. */
export declare function brandBlockCss(doc: TokenDoc, mode: string, opts?: { selector?: string; scope?: string }): string;
export declare function declarations(doc: TokenDoc, mode?: string, brand?: string): Declaration[];
export declare function colorDeclarations(doc: TokenDoc, mode: string): Declaration[];
export declare function colorUtility(name: string): string;
export declare function textStyleCss(
  s: TextStyleDef,
  index: Map<string, IndexEntry>,
  tracking: Map<RawValue, string>,
  prefix: string,
): { fontFamily: string; fontSize: string; lineHeight: string; letterSpacing: string; fontWeight: string };
export declare function textRoleOf(figmaName: string): string;
export declare function shadowVarOf(name: string, prefix: string): string;
/** --<prefix>-shadow-<nome> sem grupo; --<prefix>-<grupo>-<nome> com grupo (glass/md, glow/brand). */
export declare function effectVarOf(name: string, prefix: string): string;
export declare function isBlurStyle(def: EffectStyleDef): boolean;
/** box-shadow (sombras) ou blur() (desfoque de fundo/camada). */
export declare function effectCss(def: EffectStyleDef, prefix?: string): string;
export declare function themeKeyOf(entry: Pick<IndexEntry, "name" | "collection">): string | null;
export declare function utilityClassOf(entry: Pick<IndexEntry, "name" | "collection">): string | null;
export declare function emitTokensCss(doc: TokenDoc, opts?: { banner?: string; selector?: string }): string;
export declare function emitTypographyCss(doc: TokenDoc, opts?: { banner?: string }): string;
export declare function emitThemeCss(doc: TokenDoc, opts?: { banner?: string }): string;
export declare function emitIndexTs(doc: TokenDoc): string;
