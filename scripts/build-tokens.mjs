#!/usr/bin/env node
/**
 * Gera os artefatos da lib a partir de tokens/santods.figma.json.
 *
 *   node scripts/build-tokens.mjs
 *
 * A logica de emissao vive em lib/tokens/emit.mjs, que e um modulo puro e roda
 * igual no Node e no browser.
 *
 * Saidas (todas geradas — nao editar a mao):
 *   lib/tokens/tokens.css          variaveis --santo-* (Light + Dark)
 *   lib/tokens/typography.css      as 68 classes de text style
 *   lib/tokens/theme.css           mapeamento @theme inline para Tailwind v4
 *   lib/tokens/index.ts            tokens tipados
 */
import { readFileSync, writeFileSync, mkdirSync } from 'node:fs';
import { dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import { emitTokensCss, emitTypographyCss, emitThemeCss, emitIndexTs } from '../lib/tokens/emit.mjs';

const root = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const doc = JSON.parse(readFileSync(resolve(root, 'tokens/santods.figma.json'), 'utf8'));

const written = [];
function write(path, contents) {
  const full = resolve(root, path);
  mkdirSync(dirname(full), { recursive: true });
  writeFileSync(full, contents);
  written.push(`  ${path}  ${contents.split('\n').length} linhas`);
}

write('lib/tokens/tokens.css', emitTokensCss(doc));
write('lib/tokens/typography.css', emitTypographyCss(doc));
write('lib/tokens/theme.css', emitThemeCss(doc));
write('lib/tokens/index.ts', emitIndexTs(doc));

console.log(written.join('\n'));
console.log(
  `\nOK — ${Object.values(doc.collections).reduce((a, c) => a + Object.keys(c.variables).length, 0)} variaveis, ` +
    `${Object.keys(doc.textStyles).length} text styles, ${Object.keys(doc.effectStyles).length} effect styles.`,
);
