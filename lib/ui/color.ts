/**
 * Conversoes de cor do SantoDS.
 *
 * O formato canonico e o mesmo do Figma: hex de 6 ou 8 digitos, minusculo, com
 * o alfa nos dois ultimos. Tudo aqui entra e sai nesse formato para o editor
 * nunca precisar adivinhar em que espaco um valor esta.
 */

export type Rgb = { r: number; g: number; b: number };
export type Hsv = { h: number; s: number; v: number };
export type Hsl = { h: number; s: number; l: number };

const clamp = (n: number, min: number, max: number) => Math.min(max, Math.max(min, n));
const hex2 = (n: number) => clamp(Math.round(n), 0, 255).toString(16).padStart(2, "0");

export const isHex = (v: string) => /^#[0-9a-fA-F]{6}([0-9a-fA-F]{2})?$/.test(v);

export function hexToRgb(hex: string): Rgb {
  if (!isHex(hex)) return { r: 0, g: 0, b: 0 };
  return {
    r: parseInt(hex.slice(1, 3), 16),
    g: parseInt(hex.slice(3, 5), 16),
    b: parseInt(hex.slice(5, 7), 16),
  };
}

/** Alfa de 0 a 1. Hex de 6 digitos e opaco. */
export function hexToAlpha(hex: string): number {
  return hex.length === 9 ? parseInt(hex.slice(7, 9), 16) / 255 : 1;
}

export function rgbToHex({ r, g, b }: Rgb, alpha = 1): string {
  const base = `#${hex2(r)}${hex2(g)}${hex2(b)}`;
  return alpha >= 1 ? base : base + hex2(alpha * 255);
}

export function rgbToHsv({ r, g, b }: Rgb): Hsv {
  const rn = r / 255;
  const gn = g / 255;
  const bn = b / 255;
  const max = Math.max(rn, gn, bn);
  const min = Math.min(rn, gn, bn);
  const d = max - min;

  let h = 0;
  if (d !== 0) {
    if (max === rn) h = ((gn - bn) / d) % 6;
    else if (max === gn) h = (bn - rn) / d + 2;
    else h = (rn - gn) / d + 4;
    h *= 60;
    if (h < 0) h += 360;
  }
  return { h, s: max === 0 ? 0 : d / max, v: max };
}

export function hsvToRgb({ h, s, v }: Hsv): Rgb {
  const c = v * s;
  const x = c * (1 - Math.abs(((h / 60) % 2) - 1));
  const m = v - c;
  const seg = Math.floor(h / 60) % 6;
  const [r1, g1, b1] = [
    [c, x, 0],
    [x, c, 0],
    [0, c, x],
    [0, x, c],
    [x, 0, c],
    [c, 0, x],
  ][seg < 0 ? 0 : seg];
  return { r: (r1 + m) * 255, g: (g1 + m) * 255, b: (b1 + m) * 255 };
}

export function rgbToHsl({ r, g, b }: Rgb): Hsl {
  const { h, s: sv, v } = rgbToHsv({ r, g, b });
  const l = v * (1 - sv / 2);
  const s = l === 0 || l === 1 ? 0 : (v - l) / Math.min(l, 1 - l);
  return { h, s, l };
}

export function hslToRgb({ h, s, l }: Hsl): Rgb {
  const v = l + s * Math.min(l, 1 - l);
  const sv = v === 0 ? 0 : 2 * (1 - l / v);
  return hsvToRgb({ h, s: sv, v });
}

/** Luminancia relativa (WCAG 2). Usada para decidir texto claro ou escuro. */
export function luminance({ r, g, b }: Rgb): number {
  const ch = (c: number) => {
    const s = c / 255;
    return s <= 0.03928 ? s / 12.92 : ((s + 0.055) / 1.055) ** 2.4;
  };
  return 0.2126 * ch(r) + 0.7152 * ch(g) + 0.0722 * ch(b);
}

/** Razao de contraste WCAG entre dois hex. 4.5 e o minimo para texto normal. */
export function contrastRatio(a: string, b: string): number {
  const la = luminance(hexToRgb(a));
  const lb = luminance(hexToRgb(b));
  const [hi, lo] = la > lb ? [la, lb] : [lb, la];
  return (hi + 0.05) / (lo + 0.05);
}

/** Formata um numero de 0..1 como porcentagem inteira. */
export const pct = (n: number) => `${Math.round(n * 100)}%`;
