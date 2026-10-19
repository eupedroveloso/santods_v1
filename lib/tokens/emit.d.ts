import type { Declaration, TokenDoc, ShadowLayer, TextStyleDef, VariableType, RawValue } from "./types";

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
export declare function shadowCss(effects: ShadowLayer[] | undefined): string;
export declare function fontStacks(prefix: string): { sans: string; mono: string };
export declare function trackingByPercent(index: Map<string, IndexEntry>): Map<RawValue, string>;
export declare function textStyleClass(figmaName: string, prefix: string): string;
export declare function declarations(doc: TokenDoc, mode?: string): Declaration[];
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
export declare function themeKeyOf(entry: Pick<IndexEntry, "name" | "collection">): string | null;
export declare function utilityClassOf(entry: Pick<IndexEntry, "name" | "collection">): string | null;
export declare function emitTokensCss(doc: TokenDoc, opts?: { banner?: string; selector?: string }): string;
export declare function emitTypographyCss(doc: TokenDoc, opts?: { banner?: string }): string;
export declare function emitThemeCss(doc: TokenDoc, opts?: { banner?: string }): string;
export declare function emitIndexTs(doc: TokenDoc): string;
