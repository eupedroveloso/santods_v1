/** Tipos do catalogo de documentacao — o contrato de lib/docs/catalog.ts. */

import type { RawValue, ShadowLayer, VariableType } from "../tokens/types";

export type { RawValue, ShadowLayer, VariableType };

/** Uma colecao de variaveis do Figma (Palette, Color, Primitives, Brand, Semantic). */
export type CollectionSummary = {
  /** Nome exato no Figma. */
  name: string;
  /** kebab-case, para a URL: /tokens/[slug]. */
  slug: string;
  route: string;
  modes: string[];
  defaultMode: string;
  count: number;
};

/** O valor de uma variavel num modo. */
export type ModeValue = {
  mode: string;
  /** Valor como esta no snapshot: literal ou alias `{caminho}`. */
  raw: RawValue;
  /** Variavel para a qual o alias aponta diretamente, ou null se o valor e literal. */
  alias: string | null;
  /** Cadeia completa de aliases ate o literal (vazia se literal). */
  aliasChain: string[];
  /** Literal final, depois de seguir todos os aliases. */
  resolved: RawValue;
  /** `resolved` convertido em CSS (`#7c4def`, `8px`, `-0.04em`, `200ms`). */
  css: string;
  /** O que tokens.css declara de fato: `var(--santo-…)` se for alias, senao igual a `css`. */
  declared: string;
};

export type CatalogVariable = {
  /** Nome exato no Figma: `color/bg/brand/solid/default`. */
  name: string;
  /** Ancora na pagina da colecao: `color-bg-brand-solid-default`. */
  slug: string;
  collection: string;
  /** Grupo para exibicao (ver groupOf em catalog.ts): `bg/brand/solid`. */
  group: string;
  /** Ultimo segmento: `default`. */
  leaf: string;
  type: VariableType;
  description: string;
  scopes: string[];
  /** Custom property gerada pelo emit.mjs: `--santo-color-bg-brand-solid-default`. */
  cssVar: string;
  /** Classe Tailwind exposta pelo theme.css, ou null se a variavel nao vira utilitario. */
  tailwind: string | null;
  /** Unidade legivel para o valor numerico (`px`, `ms`, `%`) ou "". */
  unit: string;
  /** Um item por modo da colecao, na ordem do Figma. */
  values: ModeValue[];
};

export type VariableGroup = { name: string; variables: CatalogVariable[] };

export type CollectionDetail = CollectionSummary & { groups: VariableGroup[] };

export type TextStyleEntry = {
  /** Nome exato no Figma: `Albert Sans/heading-1/light`. */
  name: string;
  /** `heading-1-light`. */
  slug: string;
  /** Classe gerada em typography.css: `santo-heading-1-light`. */
  className: string;
  /** Utilitario de tamanho do papel no Tailwind: `text-heading-1`. */
  tailwindRole: string;
  /** `heading-1`. */
  role: string;
  family: string;
  /** Estilo do Figma: `Light`, `Semi Bold`... */
  fontStyle: string;
  fontWeight: number;
  /** px */
  fontSize: number;
  /** px */
  lineHeight: number;
  /** % do tamanho, como no Figma (-4 = -0.04em). */
  letterSpacing: number;
  /** Tokens de origem (nomes do Figma). letterSpacing e null quando o valor nao bate com nenhum type/tracking/*. */
  tokens: {
    fontFamily: string;
    fontSize: string;
    lineHeight: string;
    fontWeight: string;
    letterSpacing: string | null;
  };
  /** Propriedades exatamente como typography.css as escreve. */
  css: {
    fontFamily: string;
    fontSize: string;
    lineHeight: string;
    letterSpacing: string;
    fontWeight: string;
  };
};

export type EffectStyleEntry = {
  /** Nome exato no Figma: `md`. */
  name: string;
  slug: string;
  /** `--santo-shadow-md`. */
  cssVar: string;
  /** `shadow-md`. */
  tailwind: string;
  /** Valor de box-shadow (`none` quando nao ha camadas). */
  css: string;
  layers: ShadowLayer[];
};

export type SearchKind = "token" | "text-style" | "effect-style";

export type SearchEntry = {
  kind: SearchKind;
  /** Nome exato no Figma. */
  name: string;
  slug: string;
  /** Rota com ancora: /tokens/color#color-bg-brand-solid-default. */
  route: string;
  /** Texto auxiliar para a busca: var CSS, classe, colecao. */
  hint: string;
};

/** Uma identidade de marca: um modo da colecao Brand (hoje so `Santo`). */
export type IdentityEntry = {
  /** Valor de brand/id: `santo`. */
  id: string;
  /** Valor de brand/name: `Santo`. */
  name: string;
  /** Nome do modo no Figma. */
  mode: string;
  slug: string;
  families: { sans: string; mono: string };
  /** brand/shape/radius-base resolvido. */
  radiusBase: { token: string; cssVar: string; css: string };
  /**
   * Um degrau por familia da Palette: o que color/bg/<familia>/solid/default usa no modo
   * padrao (brand -> 600 hoje); 500 se a familia nao tiver fundo solido.
   */
  palette: { family: string; step: string; token: string; cssVar: string; tailwind: string | null; value: string }[];
  shadows: { name: string; cssVar: string; tailwind: string }[];
};

/** Uma duracao de movimento (motion/duration/*). */
export type MotionDuration = {
  /** Nome exato no Figma: `motion/duration/fast`. */
  name: string;
  /** Ultimo segmento: `fast`. */
  slug: string;
  /** Milissegundos, ja resolvidos. */
  ms: number;
  /** `--santo-motion-duration-fast`. */
  cssVar: string;
  /** `120ms`. */
  css: string;
  /** Classe Tailwind: `duration-(--santo-motion-duration-fast)`. */
  tailwind: string;
  /** Nome do alias de origem, se a duracao for semantica. */
  alias: string | null;
  description: string;
};

/** Uma curva de movimento (motion/easing/*). */
export type MotionEasing = {
  /** Nome exato no Figma: `motion/easing/standard`. */
  name: string;
  slug: string;
  /** `cubic-bezier(0.2, 0, 0, 1)`, ja resolvido. */
  css: string;
  /** Os 4 pontos de controle, para desenhar a curva; null se nao for cubic-bezier. */
  bezier: [number, number, number, number] | null;
  /** `--santo-motion-easing-standard`. */
  cssVar: string;
  /** Classe Tailwind exposta pelo theme.css: `ease-standard`. */
  tailwind: string | null;
  alias: string | null;
  description: string;
};

export type MotionCatalog = {
  durations: MotionDuration[];
  easings: MotionEasing[];
  /** Rota da pagina: /estilos/movimento. */
  route: string;
};
