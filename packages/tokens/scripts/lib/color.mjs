/**
 * Cor: parsing, composição sobre fundo e contraste WCAG.
 *
 * Duas coisas dependem deste arquivo e nenhuma delas pode errar:
 *   1. o emissor do Figma, que precisa dos canais em 0..1;
 *   2. o verificador de contraste, que quebra o build quando um par de tokens
 *      viola a WCAG.
 *
 * Por isso aqui não se usa nenhuma biblioteca de cor: a conversão é curta,
 * exata e sem dependência que possa mudar de comportamento numa minor.
 */

/** @typedef {{ r: number, g: number, b: number, a: number }} Rgba canais em 0..1 */

const HEX = /^#?([0-9a-f]{3,8})$/i;

/**
 * Aceita as quatro formas de hex (#rgb, #rgba, #rrggbb, #rrggbbaa) e as duas
 * funcionais que o `color/css` do Style Dictionary pode produzir (rgb/rgba).
 *
 * @param {string} input
 * @returns {Rgba}
 */
export function parseColor(input) {
  const value = String(input).trim();

  const functional = /^rgba?\(([^)]+)\)$/i.exec(value);
  if (functional) {
    const parts = functional[1].split(/[\s,/]+/).filter(Boolean);
    const [r, g, b, a = '1'] = parts;
    return {
      r: channel(r),
      g: channel(g),
      b: channel(b),
      a: a.endsWith('%') ? Number.parseFloat(a) / 100 : Number.parseFloat(a),
    };
  }

  const match = HEX.exec(value);
  if (!match) throw new Error(`Cor não reconhecida: "${input}"`);

  const digits = match[1];
  /** @param {string} hex */
  const expand = (hex) => (hex.length <= 4 ? [...hex].map((digit) => digit + digit).join('') : hex);
  const full = expand(digits);

  if (full.length !== 6 && full.length !== 8) {
    throw new Error(`Hex com ${digits.length} dígitos não é válido: "${input}"`);
  }

  /** @param {number} offset */
  const byte = (offset) => Number.parseInt(full.slice(offset, offset + 2), 16) / 255;

  return {
    r: byte(0),
    g: byte(2),
    b: byte(4),
    a: full.length === 8 ? byte(6) : 1,
  };
}

/** @param {string} part */
function channel(part) {
  return part.endsWith('%') ? Number.parseFloat(part) / 100 : Number.parseFloat(part) / 255;
}

/**
 * Achata uma cor translúcida contra um fundo opaco.
 * O contraste da WCAG só é definido entre cores opacas; sem esta etapa,
 * qualquer token com alfa (overlay, por exemplo) mediria errado.
 *
 * @param {Rgba} foreground
 * @param {Rgba} background
 * @returns {Rgba}
 */
export function flatten(foreground, background) {
  /** @param {number} a @param {number} b */
  const mix = (a, b) => a * foreground.a + b * (1 - foreground.a);
  return {
    r: mix(foreground.r, background.r),
    g: mix(foreground.g, background.g),
    b: mix(foreground.b, background.b),
    a: 1,
  };
}

/**
 * Luminância relativa — WCAG 2.2, definição 'relative luminance'.
 * @param {Rgba} color
 */
export function luminance({ r, g, b }) {
  /** @param {number} c */
  const linear = (c) => (c <= 0.04045 ? c / 12.92 : ((c + 0.055) / 1.055) ** 2.4);
  return 0.2126 * linear(r) + 0.7152 * linear(g) + 0.0722 * linear(b);
}

/**
 * Razão de contraste entre duas cores, de 1 a 21.
 * Se a cor da frente tiver alfa, ela é achatada sobre a de trás primeiro.
 *
 * @param {string | Rgba} foreground
 * @param {string | Rgba} background
 * @returns {number}
 */
export function contrastRatio(foreground, background) {
  const back = typeof background === 'string' ? parseColor(background) : background;
  const front = typeof foreground === 'string' ? parseColor(foreground) : foreground;
  const solid = front.a < 1 ? flatten(front, back) : front;

  const a = luminance(solid);
  const b = luminance(back);
  const [light, dark] = a > b ? [a, b] : [b, a];

  return (light + 0.05) / (dark + 0.05);
}

/**
 * Arredonda para 2 casas — o suficiente para relatório, sem ruído de ponto flutuante.
 * @param {number} value
 */
export const round2 = (value) => Math.round(value * 100) / 100;

/**
 * Formato de cor que a API de Variables do Figma espera: canais em 0..1.
 * @param {string} input
 */
export function toFigmaColor(input) {
  const { r, g, b, a } = parseColor(input);
  /** @param {number} value */
  const clamp = (value) => Math.round(Math.min(1, Math.max(0, value)) * 1e4) / 1e4;
  return { r: clamp(r), g: clamp(g), b: clamp(b), a: clamp(a) };
}
