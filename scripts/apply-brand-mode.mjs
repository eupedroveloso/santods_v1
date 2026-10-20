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

const root = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const SNAPSHOT = resolve(root, 'tokens/santods.figma.json');
const FIGMA_SCRIPT = resolve(root, 'scripts/figma-brand-mode.js');
const checkOnly = process.argv.includes('--check');

/* ------------------------------------- spec lida do script do Figma */

const source = readFileSync(FIGMA_SCRIPT, 'utf8');
/** Le `const NOME = <literal>;` do script do Figma. So aceita literal puro. */
function literal(name) {
  const start = source.indexOf(`const ${name} = `);
  if (start === -1) throw new Error(`${name} nao encontrado em scripts/figma-brand-mode.js`);
  const from = start + `const ${name} = `.length;
  const end = source.indexOf(';\n', from);
  const text = source.slice(from, end);
  if (/[`$()]|=>/.test(text.replace(/"(?:[^"\\]|\\.)*"|'(?:[^'\\]|\\.)*'/g, ''))) {
    throw new Error(`${name} em scripts/figma-brand-mode.js precisa ser literal puro`);
  }
  return new Function(`return (${text});`)();
}
const MODE = literal('MODE');
const SPEC = literal('SPEC');
const DESCRIPTIONS = literal('DESCRIPTIONS');

/* ------------------------------------------------------------ aplicacao */

const raw = readFileSync(SNAPSHOT, 'utf8');
const doc = JSON.parse(raw);
const problems = [];
const changes = [];

for (const [collectionName, values] of Object.entries(SPEC)) {
  const c = doc.collections[collectionName];
  if (!c) {
    problems.push(`colecao ${collectionName} nao existe no snapshot`);
    continue;
  }
  for (const name of Object.keys(c.variables)) if (!(name in values)) problems.push(`${collectionName}: spec nao cobre ${name}`);
  for (const name of Object.keys(values)) if (!(name in c.variables)) problems.push(`${collectionName}: ${name} nao existe no snapshot`);
  if (problems.length) continue;

  if (!c.modes.includes(MODE)) {
    c.modes = [...c.modes, MODE];
    changes.push(`${collectionName}: modo ${MODE} criado (${c.modes.join('/')})`);
  }
  for (const [name, def] of Object.entries(c.variables)) {
    const before = def.values ?? { [c.defaultMode]: def.value };
    const merged = { ...before, [MODE]: values[name] };
    // Formato do figma-dump.js: `values` na ordem dos modos; chaves type, values, scopes, description.
    const ordered = Object.fromEntries(c.modes.map((m) => [m, merged[m]]));
    const { type, scopes, description } = def;
    const KNOWN = ['type', 'value', 'values', 'scopes', 'description'];
    const rest = Object.fromEntries(Object.entries(def).filter(([k]) => !KNOWN.includes(k)));
    const nextDescription = name in DESCRIPTIONS ? DESCRIPTIONS[name] : description;
    const next = { type, values: ordered };
    if (scopes) next.scopes = scopes;
    if (nextDescription) next.description = nextDescription;
    Object.assign(next, rest);
    if (before[MODE] !== values[name]) changes.push(`${name} [${MODE}]: ${before[MODE] ?? '(novo)'} -> ${values[name]}`);
    if (nextDescription !== description) changes.push(`${name} (description): ${JSON.stringify(description)} -> ${JSON.stringify(nextDescription)}`);
    c.variables[name] = next;
  }
}

if (problems.length) {
  console.error('Spec e snapshot nao batem — nada foi gravado:');
  problems.forEach((p) => console.error('  ' + p));
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
  };
}

const out = JSON.stringify(doc, null, 2) + '\n';
console.log(changes.length ? `${changes.length} mudanca(s):\n  ${changes.join('\n  ')}` : 'Nada a mudar: o snapshot ja tem o modo da spec.');
if (checkOnly || out === raw) process.exit(0);
writeFileSync(SNAPSHOT, out);
console.log('\nSnapshot gravado (A FRENTE do Figma). Rode agora: npm run tokens && npm run tokens:check');
