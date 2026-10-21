#!/usr/bin/env node
/**
 * EXCECAO AUTORIZADA (Pedro via Chefe, 2026-10-19): aplica um modo de marca ao
 * snapshot tokens/santods.figma.json SEM passar pelo Figma, porque o OAuth do MCP
 * estava indisponivel. Nao e o fluxo normal — o normal e Figma -> dump -> snapshot.
 *
 *   node scripts/apply-brand-mode.mjs            aplica e grava
 *   node scripts/apply-brand-mode.mjs --check    so mostra o que mudaria
 *
 * A spec NAO vive aqui: MODE, SPEC e DESCRIPTIONS sao lidos de
 * scripts/figma-brand-mode.js, o mesmo script que escreve no Figma. Os dois caminhos
 * partem dos mesmos literais, e este grava no formato exato do figma-dump.js
 * (chaves type, values, scopes, description; modos na ordem da colecao; JSON com 2
 * espacos + quebra final), para o dump do Figma depois bater byte a byte.
 *
 * Deixa rastro em meta.aheadOfFigma: o snapshot esta A FRENTE do Figma ate a
 * reconciliacao descrita em .claude/agents/figma-parity.md. O check-parity avisa
 * enquanto a marca existir e a remove quando o dump do Figma bater.
 */
import { readFileSync, writeFileSync } from 'node:fs';
import { dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import { applyBrandMode } from '../lib/tokens/brand-mode.mjs';

const root = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const SNAPSHOT = resolve(root, 'tokens/santods.figma.json');
const FIGMA_SCRIPT = resolve(root, 'scripts/figma-brand-mode.js');
const checkOnly = process.argv.includes('--check');

/* ------------------------------------- spec lida do script do Figma */

/** Le `const NOME = <literal>;` de um script do Figma. So aceita literal puro. */
function literalFrom(source, name) {
  const start = source.indexOf(`const ${name} = `);
  if (start === -1) throw new Error(`${name} nao encontrado no script do Figma`);
  const from = start + `const ${name} = `.length;
  const end = source.indexOf(';\n', from);
  const text = source.slice(from, end);
  if (/[`$()]|=>/.test(text.replace(/"(?:[^"\\]|\\.)*"|'(?:[^'\\]|\\.)*'/g, ''))) {
    throw new Error(`${name} no script do Figma precisa ser literal puro`);
  }
  return new Function(`return (${text});`)();
}
const source = readFileSync(FIGMA_SCRIPT, 'utf8');
const literal = (name) => literalFrom(source, name);
const MODE = literal('MODE');
const SPEC = literal('SPEC');

// As variaveis do nivel B do Estudio trazem o proprio valor por marca em
// scripts/figma-nivel-b.js (que roda DEPOIS deste no Figma). Completa a spec com elas.
const NIVEL_B_SCRIPT = resolve(root, 'scripts/figma-nivel-b.js');
const nivelB = literalFrom(readFileSync(NIVEL_B_SCRIPT, 'utf8'), 'NIVEL_B');
for (const [name, def] of Object.entries(nivelB.Brand)) {
  if (!(name in SPEC.Brand) && MODE in def.values) SPEC.Brand[name] = def.values[MODE];
}
// O nivel B tambem reescreve descriptions (ex.: brand/family/sans); a dele vale.
const DESCRIPTIONS = { ...literal('DESCRIPTIONS'), ...nivelB.descriptions };

/* ------------------------------------------------------------ aplicacao */

// A aplicacao e a validacao vivem em lib/tokens/brand-mode.mjs (modulo puro, o
// mesmo que o Estudio usa no browser).
const raw = readFileSync(SNAPSHOT, 'utf8');
let doc;
let changes;
try {
  ({ doc, changes } = applyBrandMode(JSON.parse(raw), MODE, SPEC, DESCRIPTIONS));
} catch (err) {
  console.error('Spec e snapshot nao batem — nada foi gravado:');
  console.error(err.message.replace(/^Spec de marca invalida:\n/, ''));
  process.exit(1);
}

if (changes.length) {
  doc.meta.aheadOfFigma = {
    collections: Object.keys(SPEC),
    mode: MODE,
    since: doc.meta.aheadOfFigma?.since ?? new Date().toLocaleDateString('sv-SE'), // AAAA-MM-DD no fuso local
    by: 'scripts/apply-brand-mode.mjs',
    why: 'OAuth do MCP do Figma indisponivel; excecao autorizada pelo Pedro, uma vez.',
    reconcile: '.claude/agents/figma-parity.md, secao "Reconciliacao: snapshot a frente do Figma"',
    // Rastros de outras aplicacoes por script (ex.: nivel B, scripts/figma-nivel-b-apply.mjs) ficam.
    ...(doc.meta.aheadOfFigma?.also ? { also: doc.meta.aheadOfFigma.also } : {}),
  };
}

const out = JSON.stringify(doc, null, 2) + '\n';
console.log(changes.length ? `${changes.length} mudanca(s):\n  ${changes.join('\n  ')}` : 'Nada a mudar: o snapshot ja tem o modo da spec.');
if (checkOnly || out === raw) process.exit(0);
writeFileSync(SNAPSHOT, out);
console.log('\nSnapshot gravado (A FRENTE do Figma). Rode agora: npm run tokens && npm run tokens:check');
