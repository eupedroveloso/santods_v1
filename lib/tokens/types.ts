/** Tipos do documento de tokens — o formato de tokens/santods.figma.json. */

export type VariableType = "COLOR" | "FLOAT" | "STRING";
export type ModeName = string;

/** Valor cru: hex (`#rrggbb[aa]`), numero, string, ou alias `{caminho/do/token}`. */
export type RawValue = string | number;

export type VariableDef = {
  type: VariableType;
  /** Colecoes de um modo so usam `value`; as de varios modos usam `values`. */
  value?: RawValue;
  values?: Record<ModeName, RawValue>;
  scopes?: string[];
  description?: string;
};

export type CollectionDef = {
  modes: ModeName[];
  defaultMode: ModeName;
  variables: Record<string, VariableDef>;
};

export type TextStyleDef = {
  fontFamily: string;
  fontStyle: string;
  fontSize: number;
  lineHeight: { unit: "PIXELS" | "PERCENT" | "AUTO"; value?: number };
  letterSpacing: { unit: "PIXELS" | "PERCENT"; value: number };
  textCase: string;
  textDecoration: string;
  paragraphSpacing: number;
  paragraphIndent: number;
  boundVariables: {
    fontFamily: string;
    fontSize: string;
    lineHeight: string;
    fontWeight: string;
    letterSpacing?: string;
  };
};

export type ShadowLayer = {
  type: "DROP_SHADOW" | "INNER_SHADOW";
  x: number;
  y: number;
  blur: number;
  spread: number;
  /** Hex de 8 digitos: os dois ultimos sao o alfa. */
  color: string;
  visible: boolean;
  blendMode: string;
};

export type EffectStyleDef = { effects: ShadowLayer[] };

export type TokenDoc = {
  meta: {
    fileKey: string;
    fileName: string;
    cssPrefix: string;
    libraryKey?: string;
    note?: string;
    brandId?: string;
    brandName?: string;
  };
  collections: Record<string, CollectionDef>;
  textStyles: Record<string, TextStyleDef>;
  effectStyles: Record<string, EffectStyleDef>;
};

export type BrandOverrides = {
  variables: Record<string, Partial<VariableDef> & { collection?: string }>;
  textStyles: Record<string, Partial<TextStyleDef>>;
  effectStyles: Record<string, EffectStyleDef>;
};

export type Brand = {
  id: string;
  name: string;
  description?: string;
  overrides: BrandOverrides;
};

export type Declaration = { name: string; varName: string; value: string };
