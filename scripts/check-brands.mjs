#!/usr/bin/env node
/**
 * Integridade das marcas derivadas.
 *
 *   node scripts/check-brands.mjs
 *
 * Verifica, para cada brands/<id>.json:
 *  - nenhuma marca sobrescreve a fundacao (Primitives): produto derivado muda
 *    para onde o apelido semantico aponta, nao a escala em si;
 *  - todo token sobrescrito ainda existe na base (pega token removido no Figma);
 *  - todo alias aponta para um alvo que existe, sem ciclo;
 *  - applyBrand -> diffToOverrides devolve os mesmos overrides (round-trip),
 *    que e o invariante do botao Salvar do Studio;
 *  - marca sem override produz um doc identico a base.
 *
 * Sai com codigo 1 se algo estiver quebrado.
 */
import { readFileSync, readdirSync, existsSync } from 'node:fs';
import { resolve, dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { applyBrand, diffToOverrides, countOverrides } from '../lib/tokens/brand.mjs';
import { buildIndex, isAlias, resolveValue } from '../lib/tokens/emit.mjs';

/** Colecoes que sao fundacao — ver lib/tokens/layers.ts. */
const FOUNDATION = new Set(['Primitives']);

const root = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const base = JSON.parse(readFileSync(resolve(root, 'tokens/santods.figma.json'), 'utf8'));
const brandsDir = resolve(root, 'brands');

const problems = [];
const notes = [];

const allBaseTokens = new Set();
for (const c of Object.values(base.collections)) {
  for (const name of Object.keys(c.variables)) allBaseTokens.add(name);
}

const norm = (o) =>
  JSON.stringify({
    variables: Object.fromEntries(Object.entries(o.variables ?? {}).sort()),
    textStyles: Object.fromEntries(Object.entries(o.textStyles ?? {}).sort()),
    effectStyles: Object.fromEntries(Object.entries(o.effectStyles ?? {}).sort()),
  });

const stripMeta = (d) =>
  JSON.stringify({ collections: d.collections, textStyles: d.textStyles, effectStyles: d.effectStyles });

// Invariante global: marca vazia == base.
const empty = applyBrand(base, { id: '_', name: '_', overrides: { variables: {}, textStyles: {}, effectStyles: {} } });
if (stripMeta(empty) !== stripMeta(base)) {
  problems.push('applyBrand com overrides vazios nao reproduz a base — heranca quebrada.');
}

const files = existsSync(brandsDir) ? readdirSync(brandsDir).filter((f) => f.endsWith('.json')) : [];

for (const file of files) {
  const brand = JSON.parse(readFileSync(join(brandsDir, file), 'utf8'));
  const label = `brands/${file}`;
  const before = problems.length;

  for (const name of Object.keys(brand.overrides?.variables ?? {})) {
    const patch = brand.overrides.variables[name];

    // Fundacao e intocavel: e o que mantem os produtos derivados compativeis.
    const collection = Object.entries(base.collections).find(
      ([, c]) => name in c.variables,
    )?.[0];
    if (collection && FOUNDATION.has(collection)) {
      problems.push(
        `${label}: sobrescreve "${name}", que e fundacao (${collection}). ` +
          `Um produto derivado muda para onde o apelido semantico aponta, nao a escala em si. ` +
          `Ajuste o token de Semantic/Brand correspondente.`,
      );
      continue;
    }

    if (!allBaseTokens.has(name) && !patch.collection) {
      problems.push(
        `${label}: sobrescreve "${name}", que nao existe mais na base. ` +
          `Ou o token foi removido/renomeado no Figma, ou falta declarar "collection" para criar um token novo.`,
      );
    }
  }
  for (const name of Object.keys(brand.overrides?.textStyles ?? {})) {
    if (!(name in base.textStyles)) notes.push(`${label}: text style novo "${name}" (nao existe na base).`);
  }
  for (const name of Object.keys(brand.overrides?.effectStyles ?? {})) {
    if (!(name in base.effectStyles)) notes.push(`${label}: effect style novo "${name}" (nao existe na base).`);
  }

  let doc;
  try {
    doc = applyBrand(base, brand);
  } catch (error) {
    problems.push(`${label}: applyBrand falhou — ${error.message}`);
    continue;
  }

  // Aliases resolvem em todos os modos?
  const index = buildIndex(doc);
  for (const entry of index.values()) {
    for (const [mode, value] of Object.entries(entry.values)) {
      if (!isAlias(value)) continue;
      try {
        resolveValue(index, value, mode);
      } catch (error) {
        problems.push(`${label}: ${entry.name} [${mode}] -> ${error.message}`);
      }
    }
  }

  // Text styles ainda apontam para variaveis existentes?
  for (const [styleName, s] of Object.entries(doc.textStyles)) {
    for (const [prop, target] of Object.entries(s.boundVariables ?? {})) {
      if (!index.get(target)) {
        problems.push(`${label}: text style "${styleName}" liga ${prop} a variavel inexistente ${target}`);
      }
    }
  }

  const round = diffToOverrides(base, doc);
  if (norm(brand.overrides ?? {}) !== norm(round)) {
    const original = brand.overrides?.variables ?? {};
    const roundTripped = round.variables ?? {};
    const drifted = [...new Set([...Object.keys(original), ...Object.keys(roundTripped)])]
      .filter((k) => JSON.stringify(original[k]) !== JSON.stringify(roundTripped[k]))
      .slice(0, 5);
    problems.push(
      `${label}: round-trip nao fecha — applyBrand seguido de diffToOverrides mudou os overrides. ` +
        `Salvar no Studio vai corromper a marca. Divergem: ${drifted.join(', ')}` +
        (drifted.length === 5 ? ' (…)' : ''),
    );
  }

  if (problems.length === before) {
    notes.push(`${label}: ok — ${countOverrides(brand.overrides)} override(s), ${index.size} tokens resolvidos.`);
  } else {
    notes.push(`${label}: ${problems.length - before} problema(s) — ver abaixo.`);
  }
}

for (const n of notes) console.log('  ' + n);

if (problems.length) {
  console.error(`\n${problems.length} problema(s):`);
  problems.forEach((p) => console.error('  ' + p));
  process.exit(1);
}

console.log(`\nOK — ${files.length} marca(s) integras sobre uma base de ${allBaseTokens.size} tokens.`);
