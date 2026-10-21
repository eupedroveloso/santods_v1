#!/usr/bin/env node
/**
 * Gera as rampas palette/brand e palette/neutral de uma marca nova a partir da
 * cor oficial, copiando a curva de luminancia da marca padrao do snapshot.
 *
 *   node scripts/brand-ramp.mjs '#00a99d'
 *   node scripts/brand-ramp.mjs '#00a99d' --anchor 600 --neutral-hue 0 --neutral-chroma 0
 *   node scripts/brand-ramp.mjs '#00a99d' --neutral-hue 186 --neutral-chroma santo
 *
 * O metodo vive em lib/tokens/brand-ramp.mjs (modulo puro, o mesmo que o Estudio
 * usa no browser) e esta documentado em tokens/VTSD.proposal.md. Este arquivo so
 * le o snapshot e imprime. Nao escreve nada: o JSON serve para a spec e para
 * scripts/figma-brand-mode.js.
 */
import { readFileSync } from 'node:fs';
import { dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import { brandRamps } from '../lib/tokens/brand-ramp.mjs';

const root = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const args = process.argv.slice(2);
const flag = (name, fallback) => (args.includes(name) ? args[args.indexOf(name) + 1] : fallback);
const official = args.find((a) => /^#[0-9a-f]{6}$/i.test(a));
if (!official) {
  console.error("Uso: node scripts/brand-ramp.mjs '#rrggbb' [--anchor 600] [--neutral-hue 0] [--neutral-chroma 0|santo]");
  process.exit(1);
}
const chroma = flag('--neutral-chroma', '0');

const doc = JSON.parse(readFileSync(resolve(root, 'tokens/santods.figma.json'), 'utf8'));
const out = brandRamps(doc, official, {
  anchor: flag('--anchor', '600'),
  neutralHue: Number(flag('--neutral-hue', 0)),
  neutralChroma: chroma === 'santo' ? 'santo' : Number(chroma),
});
console.log(JSON.stringify(out, null, 2));
