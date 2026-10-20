#!/usr/bin/env node
/**
 * Gera os artefatos da lib a partir de tokens/santods.figma.json.
 *
 *   node scripts/build-tokens.mjs
 *   node scripts/build-tokens.mjs <snapshot.json> --out <dir>   (ensaio fora do repo)
 *
 * A logica de emissao vive em lib/tokens/emit.mjs, que e um modulo puro e roda
 * igual no Node e no browser.
 *
 * Saidas (todas geradas — nao editar a mao):
 *   lib/tokens/tokens.css          variaveis --santo-* (Light + Dark, e um bloco
 *                                  [data-brand] por marca quando ha mais de uma)
 *   lib/tokens/typography.css      as 68 classes de text style
 *   lib/tokens/theme.css           mapeamento @theme inline para Tailwind v4
 *   lib/tokens/index.ts            tokens tipados
 */
import { readFileSync, writeFileSync, mkdirSync } from 'node:fs';
import { dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import { emitTokensCss, emitTypographyCss, emitThemeCss, emitIndexTs, brandModes } from '../lib/tokens/emit.mjs';

const root = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const args = process.argv.slice(2);
const outFlag = args.indexOf('--out');
const outDir = outFlag === -1 ? resolve(root, 'lib/tokens') : resolve(process.cwd(), args[outFlag + 1]);
const docPath = args.find((a, i) => !a.startsWith('--') && i !== outFlag + 1);
const doc = JSON.parse(
  readFileSync(docPath ? resolve(process.cwd(), docPath) : resolve(root, 'tokens/santods.figma.json'), 'utf8'),
);

const written = [];
function write(file, contents) {
  const full = resolve(outDir, file);
  mkdirSync(dirname(full), { recursive: true });
  writeFileSync(full, contents);
  written.push(`  ${full.startsWith(root) ? full.slice(root.length + 1) : full}  ${contents.split('\n').length} linhas`);
}

write('tokens.css', emitTokensCss(doc));
write('typography.css', emitTypographyCss(doc));
write('theme.css', emitThemeCss(doc));
write('index.ts', emitIndexTs(doc));

const brands = brandModes(doc);
console.log(written.join('\n'));
console.log(
  `\nOK — ${Object.values(doc.collections).reduce((a, c) => a + Object.keys(c.variables).length, 0)} variaveis, ` +
    `${Object.keys(doc.textStyles).length} text styles, ${Object.keys(doc.effectStyles).length} effect styles.`,
);
if (brands.length > 1) {
  console.log(`Marcas: ${brands.map((b) => `${b.mode} [data-brand='${b.id}']${b.isDefault ? ' (padrao)' : ''}`).join(', ')}`);
}
