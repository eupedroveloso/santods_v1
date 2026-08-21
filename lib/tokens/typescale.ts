/**
 * Escala tipográfica da camada semântica.
 *
 * Um text style não guarda "48px": ele **aponta** para `type/size/48`. Mudar o
 * tamanho de um heading é re-apontar para outro degrau da rampa da fundação —
 * nunca inventar um tamanho novo. É o que garante que a escala de um produto
 * derivado continue sendo uma escala, e não uma coleção de números avulsos.
 *
 * Cada papel tem um par (tamanho, entrelinha). A entrelinha anda junto porque
 * texto grande precisa de menos folga proporcional que texto pequeno — trocar
 * só o tamanho produz título espremido ou legenda arejada demais.
 */

/** Degraus disponíveis na fundação. */
export const SIZE_STEPS = [10, 12, 14, 16, 18, 20, 24, 30, 36, 48, 60, 72, 96] as const;
export const LEADING_STEPS = [16, 18, 20, 24, 28, 30, 32, 38, 44, 56, 72, 80, 104] as const;

/** Os papéis de texto, na ordem da escala. */
export const TEXT_ROLES = [
  { key: "heading-1", label: "Título 1", family: "sans" },
  { key: "heading-2", label: "Título 2", family: "sans" },
  { key: "heading-3", label: "Título 3", family: "sans" },
  { key: "heading-4", label: "Título 4", family: "sans" },
  { key: "heading-5", label: "Título 5", family: "sans" },
  { key: "heading-6", label: "Título 6", family: "sans" },
  { key: "body-large", label: "Corpo grande", family: "sans" },
  { key: "body", label: "Corpo", family: "sans" },
  { key: "body-small", label: "Corpo pequeno", family: "sans" },
  { key: "caption", label: "Legenda", family: "sans" },
  { key: "caption-small", label: "Legenda menor", family: "sans" },
  { key: "code", label: "Código", family: "mono" },
] as const;

export type RoleKey = (typeof TEXT_ROLES)[number]["key"];

export type TypeScalePreset = {
  id: string;
  label: string;
  hint: string;
  /** papel -> [degrau de tamanho, degrau de entrelinha] */
  roles: Partial<Record<RoleKey, [number, number]>>;
};

export const TYPE_SCALE_PRESETS: TypeScalePreset[] = [
  {
    id: "compacta",
    label: "Compacta",
    hint: "Ferramenta e painel: mais informação na mesma tela.",
    roles: {
      "heading-1": [48, 56],
      "heading-2": [36, 44],
      "heading-3": [30, 38],
      "heading-4": [24, 32],
      "heading-5": [20, 28],
      "heading-6": [18, 24],
      "body-large": [16, 24],
      body: [14, 20],
      "body-small": [12, 16],
      caption: [12, 16],
      "caption-small": [10, 16],
    },
  },
  {
    id: "padrao",
    label: "Padrão",
    hint: "A escala do Santo.",
    roles: {
      "heading-1": [72, 80],
      "heading-2": [60, 72],
      "heading-3": [48, 56],
      "heading-4": [36, 44],
      "heading-5": [30, 38],
      "heading-6": [24, 32],
      "body-large": [18, 28],
      body: [16, 24],
      "body-small": [14, 20],
      caption: [12, 16],
      "caption-small": [10, 16],
    },
  },
  {
    id: "ampla",
    label: "Ampla",
    hint: "Marketing e leitura: títulos com presença, corpo mais generoso.",
    roles: {
      "heading-1": [96, 104],
      "heading-2": [72, 80],
      "heading-3": [60, 72],
      "heading-4": [48, 56],
      "heading-5": [36, 44],
      "heading-6": [30, 38],
      "body-large": [20, 30],
      body: [18, 28],
      "body-small": [16, 24],
      caption: [14, 20],
      "caption-small": [12, 16],
    },
  },
];

/** Nomes completos dos text styles de um papel, para todos os pesos. */
export function styleNamesOf(role: string, allStyleNames: string[]): string[] {
  return allStyleNames.filter((n) => n.split("/")[1] === role);
}

export type StylePatch = {
  name: string;
  fontSize: number;
  lineHeight: number;
};

/**
 * Mudanças para levar um papel a um par (tamanho, entrelinha).
 * Atinge todos os pesos do papel — a escala é do papel, não do peso.
 */
export function roleChanges(
  role: string,
  size: number,
  leading: number,
  allStyleNames: string[],
): StylePatch[] {
  return styleNamesOf(role, allStyleNames).map((name) => ({
    name,
    fontSize: size,
    lineHeight: leading,
  }));
}

export function presetChanges(
  preset: TypeScalePreset,
  allStyleNames: string[],
): StylePatch[] {
  return Object.entries(preset.roles).flatMap(([role, pair]) =>
    pair ? roleChanges(role, pair[0], pair[1], allStyleNames) : [],
  );
}
