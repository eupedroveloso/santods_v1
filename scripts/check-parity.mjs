#!/usr/bin/env node
/**
 * Compara um dump fresco do Figma com o snapshot versionado.
 *
 *   node scripts/check-parity.mjs <dump.json> [--write]
 *
 * O dump vem de scripts/figma-dump.js rodado via MCP use_figma.
 * Sai com codigo 1 se houver qualquer divergencia; --write grava o dump
 * como novo snapshot (o build ainda precisa ser rodado depois).
 *
 * Sem argumento, valida apenas a consistencia interna do snapshot atual
 * (aliases apontando para variaveis existentes, sem ciclos).
 */
import { readFileSync, writeFileSync } from 'node:fs';
import { variableLine, textStyleLine, effectStyleLine, hashLines } from './parity-hash.mjs';
import { resolve, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const SNAPSHOT = resolve(root, 'tokens/santods.figma.json');

const args = process.argv.slice(2);
const write = args.includes('--write');
const fingerprint = args.includes('--fingerprint');
const dumpPath = args.find((a) => !a.startsWith('--'));

const snapshot = JSON.parse(readFileSync(SNAPSHOT, 'utf8'));

/** Marca deixada por scripts/apply-brand-mode.mjs: o snapshot esta a frente do Figma. */
const ahead = snapshot.meta.aheadOfFigma;
const aheadNotice = ahead
  ? `AVISO: snapshot A FRENTE do Figma em ${ahead.collections.join(', ')} (modo ${ahead.mode}, desde ${ahead.since}, por ${ahead.by}). ` +
    `Reconciliar: ${ahead.reconcile}.`
  : '';

/* ------------------------------------------------- consistencia interna */

function flatten(doc) {
  const out = new Map();
  for (const [collectionName, c] of Object.entries(doc.collections)) {
    for (const [name, def] of Object.entries(c.variables)) {
      out.set(name, {
        collection: collectionName,
        modes: c.modes,
        type: def.type,
        values: def.values ?? { [c.defaultMode]: def.value },
        scopes: def.scopes ?? [],
        description: def.description ?? '',
      });
    }
  }
  return out;
}

function validate(doc, label) {
  const flat = flatten(doc);
  const problems = [];
  const isAlias = (v) => typeof v === 'string' && v.startsWith('{') && v.endsWith('}');
  /**
   * Segue a cadeia de alias. Quando a colecao do alvo nao tem o modo corrente
   * (Color Light -> Palette Santo/VTSD), segue em TODOS os modos do alvo, para
   * que cada marca seja validada e nao so a primeira.
   */
  const walk = (name, mode, value, chain) => {
    if (!isAlias(value)) return;
    const target = value.slice(1, -1);
    if (chain.has(target)) {
      problems.push(`${label}: ciclo de alias em ${name} [${mode}] -> ${target}`);
      return;
    }
    const next = flat.get(target);
    if (!next) {
      problems.push(`${label}: ${name} [${mode}] aponta para variavel inexistente {${target}}`);
      return;
    }
    const branch = new Set([...chain, target]);
    if (mode in next.values) walk(name, mode, next.values[mode], branch);
    else for (const [m, val] of Object.entries(next.values)) walk(name, m, val, branch);
  };
  for (const [name, v] of flat) {
    for (const [mode, value] of Object.entries(v.values)) walk(name, mode, value, new Set([name]));
    const missing = v.modes.filter((m) => !(m in v.values));
    if (v.modes.length > 1 && missing.length) problems.push(`${label}: ${name} sem valor no(s) modo(s) ${missing.join(', ')}`);
  }

  // Marcas: Palette e Brand andam juntas, um modo por marca, com brand/id unico.
  const palette = doc.collections.Palette;
  const brand = doc.collections.Brand;
  if (palette && brand) {
    if (!eq(palette.modes, brand.modes)) {
      problems.push(`${label}: modos de Palette (${palette.modes.join('/')}) e Brand (${brand.modes.join('/')}) precisam ser os mesmos`);
    }
    const idDef = brand.variables['brand/id'];
    const ids = brand.modes.map((m) => (idDef?.values ?? { [brand.defaultMode]: idDef?.value })[m]);
    ids.forEach((id, i) => {
      if (typeof id !== 'string' || !/^[a-z0-9-]+$/.test(id)) {
        problems.push(`${label}: brand/id do modo ${brand.modes[i]} precisa ser slug [a-z0-9-] (vale ${JSON.stringify(id)})`);
      }
    });
    const dup = ids.filter((id, i) => ids.indexOf(id) !== i);
    if (dup.length) problems.push(`${label}: brand/id repetido entre modos: ${[...new Set(dup)].join(', ')}`);
  }
  for (const [styleName, s] of Object.entries(doc.textStyles)) {
    for (const [prop, target] of Object.entries(s.boundVariables ?? {})) {
      if (!flat.get(target)) problems.push(`${label}: text style "${styleName}" liga ${prop} a variavel inexistente ${target}`);
    }
  }
  return problems;
}

/* ------------------------------------------------------------- diffing */

const eq = (a, b) => JSON.stringify(a) === JSON.stringify(b);
const norm = (def, collection) => ({
  type: def.type,
  values: def.values ?? { [collection.defaultMode]: def.value },
  scopes: [...(def.scopes ?? [])].sort(),
  description: def.description ?? '',
});

function diffMaps(kind, before, after, cmp, describe) {
  const rows = [];
  for (const key of Object.keys(before)) {
    if (!(key in after)) rows.push({ kind, change: 'removido', key, detail: '' });
  }
  for (const key of Object.keys(after)) {
    if (!(key in before)) {
      rows.push({ kind, change: 'novo', key, detail: describe ? describe(after[key]) : '' });
    } else if (!cmp(before[key], after[key])) {
      rows.push({
        kind,
        change: 'alterado',
        key,
        detail: `${describe ? describe(before[key]) : ''}  ->  ${describe ? describe(after[key]) : ''}`,
      });
    }
  }
  return rows;
}

function diff(before, after) {
  const rows = [];

  const collectionsBefore = Object.keys(before.collections);
  const collectionsAfter = Object.keys(after.collections);
  for (const name of collectionsBefore) {
    if (!collectionsAfter.includes(name)) rows.push({ kind: 'colecao', change: 'removido', key: name, detail: '' });
  }
  for (const name of collectionsAfter) {
    if (!collectionsBefore.includes(name)) {
      rows.push({ kind: 'colecao', change: 'novo', key: name, detail: '' });
      continue;
    }
    const b = before.collections[name];
    const a = after.collections[name];
    if (!eq(b.modes, a.modes) || b.defaultMode !== a.defaultMode) {
      rows.push({
        kind: 'colecao',
        change: 'alterado',
        key: `${name} (modos)`,
        detail: `${b.modes.join('/')} default=${b.defaultMode}  ->  ${a.modes.join('/')} default=${a.defaultMode}`,
      });
    }
    rows.push(
      ...diffMaps(
        'variavel',
        Object.fromEntries(Object.entries(b.variables).map(([k, v]) => [k, norm(v, b)])),
        Object.fromEntries(Object.entries(a.variables).map(([k, v]) => [k, norm(v, a)])),
        eq,
        (v) => Object.entries(v.values).map(([m, val]) => `${m}=${val}`).join(' '),
      ),
    );
  }

  rows.push(
    ...diffMaps('text style', before.textStyles, after.textStyles, eq, (s) =>
      `${s.fontFamily} ${s.fontStyle} ${s.fontSize}/${s.lineHeight.value ?? 'auto'} ls=${s.letterSpacing.value}${s.letterSpacing.unit === 'PERCENT' ? '%' : 'px'}`),
    ...diffMaps('effect style', before.effectStyles, after.effectStyles, eq, (s) =>
      s.effects.length ? s.effects.map((e) => `${e.x} ${e.y} ${e.blur} ${e.spread} ${e.color}`).join(' | ') : 'none'),
  );

  // paintStyles/gridStyles so existem no dump; sinaliza se o Figma passar a ter algum.
  for (const extra of ['paintStyles', 'gridStyles']) {
    const found = Object.keys(after[extra] ?? {});
    if (found.length) rows.push({ kind: extra, change: 'novo no Figma', key: found.join(', '), detail: 'ainda nao representado no snapshot' });
  }

  return rows;
}

/* -------------------------------------------------------------- saida */

const internal = validate(snapshot, 'snapshot');
if (internal.length) {
  console.error('Snapshot inconsistente:');
  internal.forEach((p) => console.error('  ' + p));
  process.exit(1);
}

if (fingerprint) {
  const out = { collections: {} };
  for (const [name, c] of Object.entries(snapshot.collections)) {
    const lines = Object.entries(c.variables).map(([varName, def]) => {
      const values = def.values ?? { [c.defaultMode]: def.value };
      return variableLine(varName, def.type, def.scopes ?? [], c.modes, values, def.description);
    });
    out.collections[name] = { hash: hashLines(lines), count: lines.length, modes: c.modes.join('/') };
  }
  out.textStyles = {
    hash: hashLines(Object.entries(snapshot.textStyles).map(([n, st]) => textStyleLine(n, st))),
    count: Object.keys(snapshot.textStyles).length,
  };
  out.effectStyles = {
    hash: hashLines(Object.entries(snapshot.effectStyles).map(([n, st]) => effectStyleLine(n, st))),
    count: Object.keys(snapshot.effectStyles).length,
  };
  out.paintStyles = 0;
  out.gridStyles = 0;
  console.log(JSON.stringify(out, null, 2));
  if (ahead) console.error(aheadNotice);
  process.exit(0);
}

if (!dumpPath) {
  const flat = flatten(snapshot);
  console.log(
    `Snapshot consistente: ${flat.size} variaveis, ` +
      `${Object.keys(snapshot.textStyles).length} text styles, ` +
      `${Object.keys(snapshot.effectStyles).length} effect styles.`,
  );
  if (ahead) console.log(aheadNotice);
  console.log('Passe um dump do Figma para comparar: node scripts/check-parity.mjs <dump.json>');
  process.exit(0);
}

const dump = JSON.parse(readFileSync(resolve(process.cwd(), dumpPath), 'utf8'));
const dumpProblems = validate(dump, 'dump');
if (dumpProblems.length) {
  console.error('Dump do Figma inconsistente:');
  dumpProblems.forEach((p) => console.error('  ' + p));
}

const rows = diff(snapshot, dump);
/** Snapshot vindo do dump, sem a marca de "a frente do Figma" (o Figma passa a ser a verdade). */
const fromDump = () => {
  const meta = { ...snapshot.meta, ...dump.meta };
  delete meta.aheadOfFigma;
  return JSON.stringify({ ...dump, meta }, null, 2) + '\n';
};

if (rows.length === 0) {
  console.log('PARIDADE OK — codigo e Figma batem em 100% dos tokens e styles.');
  if (ahead) {
    // Reconciliacao: o Figma alcancou o snapshot. Com --write, grava o dump e tira a marca.
    if (!write) {
      console.log(`${aheadNotice}\nO Figma ja alcancou o snapshot. Para reconciliar: node scripts/check-parity.mjs ${dumpPath} --write`);
      process.exit(1);
    }
    const before = readFileSync(SNAPSHOT, 'utf8');
    const metaBefore = { ...snapshot.meta };
    delete metaBefore.aheadOfFigma;
    const expected = JSON.stringify({ ...snapshot, meta: metaBefore }, null, 2) + '\n';
    const next = fromDump();
    writeFileSync(SNAPSHOT, next);
    console.log(
      `RECONCILIADO — meta.aheadOfFigma removido. Bytes do dump ${next === expected ? 'IDENTICOS' : 'DIFERENTES (so ordem/formato; valores batem)'} ao snapshot aplicado por script` +
        (before === next ? '.' : '.\nRode agora: npm run tokens && npm run tokens:fingerprint e atualize a tabela de hashes.'),
    );
  }
  process.exit(dumpProblems.length ? 1 : 0);
}

if (ahead) console.log(`${aheadNotice}\nDivergencia em ${ahead.collections.join('/')} pode ser so o Figma ainda sem o modo ${ahead.mode}.\n`);

console.log(`DIVERGENCIAS: ${rows.length}\n`);
const width = Math.max(...rows.map((r) => r.key.length), 10);
for (const r of rows) {
  console.log(`  [${r.change.padEnd(13)}] ${r.kind.padEnd(12)} ${r.key.padEnd(width)}  ${r.detail}`);
}

if (write) {
  writeFileSync(SNAPSHOT, fromDump());
  console.log(`\nSnapshot atualizado. Rode agora: node scripts/build-tokens.mjs`);
  process.exit(0);
}

console.log('\nPara adotar o Figma como verdade: node scripts/check-parity.mjs ' + dumpPath + ' --write && node scripts/build-tokens.mjs');
process.exit(1);
