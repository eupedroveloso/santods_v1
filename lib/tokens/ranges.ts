/**
 * Faixa util de cada familia de token numerico.
 *
 * Serve para o editor oferecer um slider com amplitude que faz sentido: o
 * espacamento vai a 512, mas a espessura de borda passar de 8 nunca e o que
 * alguem quis. O campo numerico continua aceitando valores fora da faixa —
 * o slider so cobre a parte usavel.
 */

export type Range = { min: number; max: number; step: number };

const RANGES: { match: (name: string) => boolean; range: Range }[] = [
  { match: (n) => n.startsWith("dimension/space/"), range: { min: 0, max: 512, step: 2 } },
  { match: (n) => n.startsWith("dimension/radius/"), range: { min: 0, max: 64, step: 1 } },
  { match: (n) => n.startsWith("dimension/border/"), range: { min: 0, max: 8, step: 1 } },
  { match: (n) => n.startsWith("dimension/size/"), range: { min: 0, max: 96, step: 2 } },
  { match: (n) => n.startsWith("dimension/icon/"), range: { min: 8, max: 64, step: 2 } },
  { match: (n) => n.startsWith("dimension/container/"), range: { min: 320, max: 1920, step: 16 } },
  { match: (n) => n.startsWith("type/size/"), range: { min: 8, max: 128, step: 1 } },
  { match: (n) => n.startsWith("type/leading/"), range: { min: 8, max: 160, step: 1 } },
  { match: (n) => n.startsWith("type/weight/"), range: { min: 100, max: 900, step: 100 } },
  { match: (n) => n.startsWith("type/tracking/"), range: { min: -10, max: 10, step: 0.5 } },
  { match: (n) => n.startsWith("motion/duration/"), range: { min: 0, max: 1000, step: 10 } },
  { match: (n) => n.startsWith("layer/"), range: { min: 0, max: 2000, step: 10 } },
  { match: (n) => n.startsWith("brand/shape/"), range: { min: 0, max: 64, step: 1 } },
  { match: (n) => n.startsWith("space/"), range: { min: 0, max: 512, step: 2 } },
  { match: (n) => n.startsWith("radius/"), range: { min: 0, max: 64, step: 1 } },
  { match: (n) => n.startsWith("border/") || n.startsWith("focus/"), range: { min: 0, max: 8, step: 1 } },
];

const FALLBACK: Range = { min: 0, max: 100, step: 1 };

/**
 * Faixa do slider para um token. `value` alarga o teto quando o valor atual ja
 * passa dele — e o caso de `dimension/radius/full`, que vale 9999 de proposito.
 */
export function rangeFor(name: string, value?: number): Range {
  const found = RANGES.find((r) => r.match(name))?.range ?? FALLBACK;
  if (value === undefined || !Number.isFinite(value)) return found;
  if (value <= found.max && value >= found.min) return found;
  return {
    min: Math.min(found.min, value),
    max: Math.max(found.max, value),
    step: found.step,
  };
}
