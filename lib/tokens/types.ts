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
  /** Sombras (DROP/INNER) ou desfoque (BACKGROUND_BLUR = vidro, LAYER_BLUR). */
  type: "DROP_SHADOW" | "INNER_SHADOW" | "BACKGROUND_BLUR" | "LAYER_BLUR";
  x: number;
  y: number;
  blur: number;
  spread: number;
  /** Hex de 8 digitos: os dois ultimos sao o alfa. null nos desfoques. */
  color: string | null;
  visible: boolean;
  blendMode: string;
  /** Campos ligados a variavel (nivel B do Estudio): cor, deslocamento vertical e desfoque. */
  boundVariables?: { color?: string; y?: string; blur?: string };
};

export type EffectStyleDef = { effects: ShadowLayer[] };

export type TokenDoc = {
  meta: {
    fileKey: string;
    fileName: string;
    cssPrefix: string;
    libraryKey?: string;
    note?: string;
  };
  collections: Record<string, CollectionDef>;
  textStyles: Record<string, TextStyleDef>;
  effectStyles: Record<string, EffectStyleDef>;
};

export type Declaration = { name: string; varName: string; value: string };
