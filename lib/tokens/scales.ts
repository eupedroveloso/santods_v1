/**
 * Uma base, o resto acompanha.
 *
 * Toda escala do SantoDS tem uma proporção interna: `space/lg` é 1,5× o
 * `space/md`; `heading-1` é 4,5× o corpo. Essas proporções são o que faz a
 * escala parecer uma escala. O que muda de produto para produto é **onde a base
 * está**, não a relação entre os degraus.
 *
 * Por isso o controle é um só: mova a base e todos os apelidos se re-apontam
 * para o degrau da fundação mais próximo do alvo proporcional. O resultado
 * sempre cai num degrau que o Santo já define — a escala continua sendo a
 * escala, sintonizada em outro ponto.
 */

/**
 * Valor derivado da base. Livre, não encaixado num degrau.
 *
 * Encaixar na fundação parecia mais puro, mas colapsa: com base 18 o Título 1 e
 * o Título 2 caem os dois em 72, porque no topo da escala os degraus são
 * esparsos (48, 60, 72, 96). Valor livre mantém a proporção intacta em qualquer
 * base — e continua sendo override na camada semântica, não na fundação.
 */
export function derive(base: number, ratio: number): number {
  return Math.max(0, Math.round(base * ratio));
}

/* ---------------------------------------------------------------- espaço */

/** Proporção de cada apelido em relação a `space/md`. */
export const SPACE_RATIOS: Record<string, number> = {
  none: 0,
  "3xs": 0.125,
  "2xs": 0.25,
  xs: 0.5,
  sm: 0.75,
  md: 1,
  lg: 1.5,
  xl: 2,
  "2xl": 2.5,
  "3xl": 3,
  "4xl": 4,
  "5xl": 5,
  "6xl": 6,
  "7xl": 8,
  "8xl": 12,
};

export const SPACE_BASE_DEFAULT = 16;

/* ------------------------------------------------------------------ raio */

/** Proporção em relação ao raio base. `md` é o próprio base. */
export const RADIUS_RATIOS: Record<string, number> = {
  none: 0,
  xs: 0.5,
  sm: 1,
  lg: 1.5,
  xl: 2,
  "2xl": 3,
  "3xl": 4,
};

export const RADIUS_BASE_DEFAULT = 8;

/* --------------------------------------------------------------- bordas */

/** Proporção em relação a `border/thin`. */
export const BORDER_RATIOS: Record<string, number> = {
  thin: 1,
  thick: 2,
  heavy: 4,
};

export const BORDER_BASE_DEFAULT = 1;

/* ----------------------------------------------------------- tipografia */

/**
 * Proporção de cada papel em relação ao corpo, e a folga de entrelinha própria.
 *
 * A entrelinha não escala junto com o tamanho: título grande precisa de menos
 * folga proporcional que legenda. Por isso cada papel carrega sua própria razão,
 * tirada da escala do Santo.
 */
export const TYPE_RATIOS: Record<string, { size: number; leading: number }> = {
  "heading-1": { size: 4.5, leading: 1.11 },
  "heading-2": { size: 3.75, leading: 1.2 },
  "heading-3": { size: 3, leading: 1.17 },
  "heading-4": { size: 2.25, leading: 1.22 },
  "heading-5": { size: 1.875, leading: 1.27 },
  "heading-6": { size: 1.5, leading: 1.33 },
  "body-large": { size: 1.125, leading: 1.56 },
  body: { size: 1, leading: 1.5 },
  "body-small": { size: 0.875, leading: 1.43 },
  caption: { size: 0.75, leading: 1.33 },
  "caption-small": { size: 0.625, leading: 1.6 },
  code: { size: 0.875, leading: 1.43 },
};

export const TYPE_BASE_DEFAULT = 16;

/** Tamanho e entrelinha de cada papel para uma base. */
export function typeScaleFor(base: number): Record<string, { size: number; leading: number }> {
  const out: Record<string, { size: number; leading: number }> = {};
  for (const [role, r] of Object.entries(TYPE_RATIOS)) {
    const size = derive(base, r.size);
    // A entrelinha sai do tamanho final, para a folga acompanhar o que se vê.
    out[role] = { size, leading: derive(size, r.leading) };
  }
  return out;
}

/** Entrelinha proporcional de um papel, para quando só o tamanho muda. */
export function leadingFor(role: string, size: number): number {
  return derive(size, TYPE_RATIOS[role]?.leading ?? 1.5);
}

/** Apelido -> valor, para uma base e uma tabela de proporções. */
export function scaleFor(base: number, ratios: Record<string, number>): Record<string, number> {
  return Object.fromEntries(
    Object.entries(ratios).map(([name, ratio]) => [name, derive(base, ratio)]),
  );
}
