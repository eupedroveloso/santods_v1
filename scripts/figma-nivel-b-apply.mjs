#!/usr/bin/env node
/**
 * EXCECAO AUTORIZADA (maestro, 2026-10-21, andar estudio): aplica o NIVEL B do
 * Estudio ao snapshot tokens/santods.figma.json SEM passar pelo Figma, que segue
 * read-only para o MCP. O normal e Figma -> dump -> snapshot.
 *
 *   node scripts/figma-nivel-b-apply.mjs            aplica e grava
 *   node scripts/figma-nivel-b-apply.mjs --check    so mostra o que mudaria
 *
 * A spec NAO vive aqui: NIVEL_B e lido de scripts/figma-nivel-b.js, o script que
 * escreve o mesmo no Figma. Grava no formato do figma-dump.js (Brand e Semantic
 * com type, values|value, scopes, description; effects com boundVariables), para
 * o dump do Figma depois bater com o snapshot.
 *
 * Nenhum valor renderizado muda: Santo e VTSD recebem os valores de hoje. Deixa
 * rastro em meta.aheadOfFigma.also (o check-parity avisa ate a reconciliacao).
 */
import { readFileSync, writeFileSync } from 'node:fs';
import { dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const SNAPSHOT = resolve(root, 'tokens/santods.figma.json');
const FIGMA_SCRIPT = resolve(root, 'scripts/figma-nivel-b.js');
const checkOnly = process.argv.includes('--check');
const TAG = 'nivel-b';

/** Le `const NOME = <literal>;` do script do Figma (mesma regra de scripts/apply-brand-mode.mjs). */
const source = readFileSync(FIGMA_SCRIPT, 'utf8');
function literal(name) {
  const start = source.indexOf(`const ${name} = `);
  if (start === -1) throw new Error(`${name} nao encontrado em scripts/figma-nivel-b.js`);
  const from = start + `const ${name} = `.length;
  const text = source.slice(from, source.indexOf(';\n', from));
  if (/[`$()]|=>/.test(text.replace(/"(?:[^"\\]|\\.)*"|'(?:[^'\\]|\\.)*'/g, ''))) {
    throw new Error(`${name} em scripts/figma-nivel-b.js precisa ser literal puro`);
  }
  return new Function(`return (${text});`)();
}
const SPEC = literal('NIVEL_B');

const raw = readFileSync(SNAPSHOT, 'utf8');
const doc = JSON.parse(raw);
const changes = [];
const problems = [];

/* ----------------------------------------------------------------- Brand */

const brand = doc.collections.Brand;
for (const [name, def] of Object.entries(SPEC.Brand)) {
  const missing = brand.modes.filter((m) => !(m in def.values));
  if (missing.length) problems.push(`${name}: sem valor no(s) modo(s) ${missing.join(', ')}`);
  const values = Object.fromEntries(brand.modes.map((m) => [m, def.values[m]]));
  const next = { type: def.type, values, scopes: def.scopes };
  if (def.description) next.description = def.description;
  const before = brand.variables[name];
  if (JSON.stringify(before) !== JSON.stringify(next)) {
    changes.push(`${before ? 'Brand: atualiza' : 'Brand: cria'} ${name}`);
    brand.variables[name] = next;
  }
}
for (const [name, description] of Object.entries(SPEC.descriptions)) {
  const def = brand.variables[name];
  if (def && def.description !== description) {
    changes.push(`${name} (description)`);
    def.description = description;
  }
}

/* -------------------------------------------------------------- Semantic */

const semantic = doc.collections.Semantic;
for (const [name, def] of Object.entries(SPEC.Semantic)) {
  const before = semantic.variables[name];
  if (!before && !def.type) {
    problems.push(`Semantic ${name} nao existe e a spec nao diz o tipo`);
    continue;
  }
  const next = before ? { ...before, value: def.value } : { type: def.type, value: def.value, scopes: def.scopes };
  if (!before && def.description) next.description = def.description;
  if (JSON.stringify(before) !== JSON.stringify(next)) {
    changes.push(`Semantic: ${before ? `${name} ${before.value} -> ${def.value}` : `cria ${name} = ${def.value}`}`);
    semantic.variables[name] = next;
  }
}

/* ---------------------------------------------------------- text styles */

for (const [styleName, s] of Object.entries(doc.textStyles)) {
  const binding = SPEC.textStyles[styleName.split('/')[1]];
  if (!binding) continue;
  for (const [field, varName] of Object.entries(binding)) {
    if (!(field in s.boundVariables)) problems.push(`text style ${styleName} nao liga ${field} hoje`);
    else if (s.boundVariables[field] !== varName) {
      changes.push(`text style ${styleName}.${field}: ${s.boundVariables[field]} -> ${varName}`);
      s.boundVariables[field] = varName;
    }
  }
}

/* -------------------------------------------------------- effect styles */

for (const [style, layers] of Object.entries(SPEC.effectStyles)) {
  const s = doc.effectStyles[style];
  if (!s || s.effects.length !== layers.length) {
    problems.push(`effect style ${style}: camadas nao batem com a spec`);
    continue;
  }
  s.effects.forEach((e, i) => {
    const wanted = SPEC.Brand[layers[i]];
    if (Object.values(wanted.values).some((v) => v !== e.color)) {
      problems.push(`${layers[i]} precisa valer ${e.color} em toda marca (cor atual da camada ${i + 1} de ${style})`);
    }
    if (e.boundVariables?.color !== layers[i]) {
      changes.push(`effect style ${style} camada ${i + 1}: cor ligada a ${layers[i]}`);
      e.boundVariables = { color: layers[i] };
    }
  });
}

if (problems.length) {
  console.error('Spec e snapshot nao batem — nada foi gravado:');
  problems.forEach((p) => console.error('  ' + p));
  process.exit(1);
}

/* ------------------------------------------------------------- rastro */

if (changes.length) {
  const ahead = doc.meta.aheadOfFigma ?? {};
  const also = (ahead.also ?? []).filter((x) => x.tag !== TAG);
  const prev = (ahead.also ?? []).find((x) => x.tag === TAG);
  also.push({
    tag: TAG,
    collections: ['Brand', 'Semantic'],
    styles: 'text styles (11 papeis) e effect styles (cor das camadas)',
    since: prev?.since ?? new Date().toLocaleDateString('sv-SE'),
    by: 'scripts/figma-nivel-b-apply.mjs',
    why: 'Nivel B do Estudio aprovado pelo maestro so no andar estudio; Figma read-only para o MCP.',
    reconcile: 'colar scripts/figma-nivel-b.js no use_figma (DRY_RUN, depois real) e seguir .claude/agents/figma-parity.md',
  });
  doc.meta.aheadOfFigma = { ...ahead, also };
}

const out = JSON.stringify(doc, null, 2) + '\n';
console.log(changes.length ? `${changes.length} mudanca(s):\n  ${changes.join('\n  ')}` : 'Nada a mudar: o snapshot ja tem o nivel B.');
if (checkOnly || out === raw) process.exit(0);
writeFileSync(SNAPSHOT, out);
console.log('\nSnapshot gravado (A FRENTE do Figma). Rode agora: npm run tokens && npm run tokens:check');
