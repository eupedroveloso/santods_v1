#!/usr/bin/env node
/**
 * Gera as rampas palette/brand e palette/neutral de uma marca nova a partir da
 * cor oficial, copiando a curva de luminancia da marca padrao do snapshot.
 *
 *   node scripts/brand-ramp.mjs '#00a99d'
 *   node scripts/brand-ramp.mjs '#00a99d' --anchor 600 --neutral-hue 0 --neutral-chroma 0
 *
 * Metodo (documentado em tokens/VTSD.proposal.md):
 *   brand   — para cada degrau, a luminancia relativa WCAG (Y) e a MESMA do degrau
 *             da marca padrao; o matiz e o da cor oficial; o croma e o do degrau
 *             padrao vezes C(oficial)/C(padrao no degrau ancora), cortado no sRGB.
 *             A cor oficial entra exata no degrau ancora.
 *   neutral — mesma Y por degrau, com matiz/croma pedidos (padrao: cinza puro).
 *
 * Como Y casa degrau a degrau, todo contraste que a colecao Color garante na
 * marca padrao vale para a nova (so o degrau ancora difere, pela cor oficial).
 * Nao escreve nada: imprime JSON para a spec e para scripts/figma-brand-mode.js.
 */
import { readFileSync } from 'node:fs';
import { dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const args = process.argv.slice(2);
const flag = (name, fallback) => (args.includes(name) ? args[args.indexOf(name) + 1] : fallback);
const official = (args.find((a) => /^#[0-9a-f]{6}$/i.test(a)) ?? '').toLowerCase();
if (!official) {
  console.error("Uso: node scripts/brand-ramp.mjs '#rrggbb' [--anchor 600] [--neutral-hue 0] [--neutral-chroma 0]");
  process.exit(1);
}
const anchor = flag('--anchor', '600');
const neutralHue = Number(flag('--neutral-hue', 0));
const neutralChroma = Number(flag('--neutral-chroma', 0));

/* ---------------------------------------------- sRGB <-> OKLCH, WCAG */

const hexToRgb = (h) => [1, 3, 5].map((i) => parseInt(h.slice(i, i + 2), 16) / 255);
const rgbToHex = (c) => '#' + c.map((x) => Math.round(Math.min(1, Math.max(0, x)) * 255).toString(16).padStart(2, '0')).join('');
const lin = (x) => (x <= 0.04045 ? x / 12.92 : ((x + 0.055) / 1.055) ** 2.4);
const gam = (x) => (x <= 0.0031308 ? 12.92 * x : 1.055 * x ** (1 / 2.4) - 0.055);
const lum = (h) => {
  const [r, g, b] = hexToRgb(h).map(lin);
  return 0.2126 * r + 0.7152 * g + 0.0722 * b;
};
const contrast = (a, b) => {
  const [x, y] = [lum(a), lum(b)].sort((p, q) => q - p);
  return (x + 0.05) / (y + 0.05);
};
function toOklch(h) {
  const [r, g, b] = hexToRgb(h).map(lin);
  const l = Math.cbrt(0.4122214708 * r + 0.5363325363 * g + 0.0514459929 * b);
  const m = Math.cbrt(0.2119034982 * r + 0.6806995451 * g + 0.1073969566 * b);
  const s = Math.cbrt(0.0883024619 * r + 0.2817188376 * g + 0.6299787005 * b);
  const A = 1.9779984951 * l - 2.428592205 * m + 0.4505937099 * s;
  const B = 0.0259040371 * l + 0.7827717662 * m - 0.808675766 * s;
  return [0.2104542553 * l + 0.793617785 * m - 0.0040720468 * s, Math.hypot(A, B), ((Math.atan2(B, A) * 180) / Math.PI + 360) % 360];
}
function fromOklch([L, C, H]) {
  const a = C * Math.cos((H * Math.PI) / 180);
  const b = C * Math.sin((H * Math.PI) / 180);
  const l = (L + 0.3963377774 * a + 0.2158037573 * b) ** 3;
  const m = (L - 0.1055613458 * a - 0.0638541728 * b) ** 3;
  const s = (L - 0.0894841775 * a - 1.291485548 * b) ** 3;
  return [
    4.0767416621 * l - 3.3077115913 * m + 0.2309699292 * s,
    -1.2684380046 * l + 2.6097574011 * m - 0.3413193965 * s,
    -0.0041960863 * l - 0.7034186147 * m + 1.707614701 * s,
  ].map(gam);
}
const inGamut = (c) => c.every((x) => x >= -1e-4 && x <= 1 + 1e-4);
/** Maior croma <= C que cabe no sRGB, mantendo L e H. */
function fit([L, C, H]) {
  let lo = 0;
  let hi = C;
  if (inGamut(fromOklch([L, C, H]))) lo = C;
  else {
    for (let i = 0; i < 40; i++) {
      const mid = (lo + hi) / 2;
      if (inGamut(fromOklch([L, mid, H]))) lo = mid;
      else hi = mid;
    }
  }
  return rgbToHex(fromOklch([L, lo, H]));
}
/** Cor de matiz H e croma C cuja luminancia WCAG e Y (busca binaria em L). */
function matchY(Y, C, H) {
  let lo = 0;
  let hi = 1;
  for (let i = 0; i < 50; i++) {
    const mid = (lo + hi) / 2;
    if (lum(fit([mid, C, H])) < Y) lo = mid;
    else hi = mid;
  }
  return fit([(lo + hi) / 2, C, H]);
}

/** Cinza puro (#vvvvvv) de luminancia mais proxima de Y — sem ruido de croma. */
function grayOfY(Y) {
  let best = '#000000';
  for (let v = 0; v < 256; v++) {
    const hex = '#' + v.toString(16).padStart(2, '0').repeat(3);
    if (Math.abs(lum(hex) - Y) < Math.abs(lum(best) - Y)) best = hex;
  }
  return best;
}

/* ------------------------------------------------------------- rampas */

const doc = JSON.parse(readFileSync(resolve(root, 'tokens/santods.figma.json'), 'utf8'));
const palette = doc.collections.Palette;
const valueOf = (def) => (def.values ?? { [palette.defaultMode]: def.value })[palette.defaultMode];
const ramp = (family) =>
  Object.entries(palette.variables)
    .filter(([n]) => n.startsWith(`palette/${family}/`))
    .map(([n, def]) => [n, valueOf(def)]);

const [, officialC, officialH] = toOklch(official);
const anchorBase = valueOf(palette.variables[`palette/brand/${anchor}`]);
const k = officialC / toOklch(anchorBase)[1];

const out = {};
for (const [name, base] of ramp('brand')) {
  out[name] = name.endsWith(`/${anchor}`) ? official : matchY(lum(base), toOklch(base)[1] * k, officialH);
}
for (const [name, base] of ramp('neutral')) {
  if (name.endsWith('/0')) out[name] = '#ffffff';
  else out[name] = neutralChroma === 0 ? grayOfY(lum(base)) : matchY(lum(base), neutralChroma, neutralHue);
}

const rows = Object.entries(out).map(([name, hex]) => {
  const base = valueOf(palette.variables[name]);
  return { name, hex, base, Y: +lum(hex).toFixed(4), baseY: +lum(base).toFixed(4), vsWhite: +contrast(hex, '#ffffff').toFixed(2) };
});
console.log(
  JSON.stringify(
    { official, anchor: `palette/brand/${anchor}`, chromaFactor: +k.toFixed(4), hue: +officialH.toFixed(1), values: out, audit: rows },
    null,
    2,
  ),
);
