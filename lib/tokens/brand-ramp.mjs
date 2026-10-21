/**
 * Rampas palette/brand e palette/neutral de uma marca nova, a partir da cor
 * oficial, copiando a curva de luminancia da marca padrao do doc.
 *
 * Modulo puro: recebe o doc (formato de tokens/santods.figma.json), nao le disco.
 * CLI: scripts/brand-ramp.mjs. Metodo documentado em tokens/VTSD.proposal.md:
 *
 *   brand   — em cada degrau, a luminancia relativa WCAG (Y) e a MESMA do degrau
 *             da marca padrao; o matiz e o da cor oficial; o croma e o do degrau
 *             padrao vezes C(oficial)/C(padrao no degrau ancora), cortado no sRGB.
 *             A cor oficial entra exata no degrau ancora.
 *   neutral — mesma Y por degrau. `neutralChroma` 0 da cinza puro (#vvvvvv);
 *             um numero fixa o croma; 'santo' usa o croma de cada degrau da marca
 *             padrao (o tingido sutil do Santo), no matiz `neutralHue`.
 *             neutral/0 e sempre #ffffff.
 *
 * Como Y casa degrau a degrau, todo contraste que a colecao Color garante na
 * marca padrao vale para a nova (so o degrau ancora difere, pela cor oficial).
 */
import { contrast, grayOfLuminance, hexToOklch, luminance, matchLuminance } from './color.mjs';

/** Valores da marca padrao para uma familia da Palette: [[nome, hex], ...] na ordem do doc. */
export function baseRamp(doc, family) {
  const palette = doc.collections.Palette;
  return Object.entries(palette.variables)
    .filter(([n]) => n.startsWith(`palette/${family}/`))
    .map(([n, def]) => [n, (def.values ?? { [palette.defaultMode]: def.value })[palette.defaultMode]]);
}

/**
 * @param {object} doc
 * @param {string} official  `#rrggbb`
 * @param {{ anchor?: string, neutralHue?: number, neutralChroma?: number | 'santo' }} [opts]
 * @returns {{ official, anchor, chromaFactor, hue, values: Record<string,string>, audit: object[] }}
 */
export function brandRamps(doc, official, { anchor = '600', neutralHue = 0, neutralChroma = 0 } = {}) {
  const hex = official.toLowerCase();
  if (!/^#[0-9a-f]{6}$/.test(hex)) throw new Error(`Cor oficial invalida: ${official} (use #rrggbb)`);
  const brand = baseRamp(doc, 'brand');
  const neutral = baseRamp(doc, 'neutral');
  const base = new Map([...brand, ...neutral]);
  const anchorBase = base.get(`palette/brand/${anchor}`);
  if (!anchorBase) throw new Error(`Degrau ancora inexistente: palette/brand/${anchor}`);

  const [, officialC, officialH] = hexToOklch(hex);
  const k = officialC / hexToOklch(anchorBase)[1];

  const values = {};
  for (const [name, b] of brand) {
    values[name] = name.endsWith(`/${anchor}`) ? hex : matchLuminance(luminance(b), hexToOklch(b)[1] * k, officialH);
  }
  for (const [name, b] of neutral) {
    if (name.endsWith('/0')) values[name] = '#ffffff';
    else if (neutralChroma === 0) values[name] = grayOfLuminance(luminance(b));
    else {
      const c = neutralChroma === 'santo' ? hexToOklch(b)[1] : neutralChroma;
      values[name] = matchLuminance(luminance(b), c, neutralHue);
    }
  }

  const audit = Object.entries(values).map(([name, v]) => {
    const b = base.get(name);
    return {
      name,
      hex: v,
      base: b,
      Y: +luminance(v).toFixed(4),
      baseY: +luminance(b).toFixed(4),
      vsWhite: +contrast(v, '#ffffff').toFixed(2),
    };
  });
  return {
    official: hex,
    anchor: `palette/brand/${anchor}`,
    chromaFactor: +k.toFixed(4),
    hue: +officialH.toFixed(1),
    values,
    audit,
  };
}
