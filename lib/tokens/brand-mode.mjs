/**
 * Modo de marca: aplicar uma spec (Palette + Brand) a um doc, e validar a spec.
 *
 * Modulo puro: roda no scripts/apply-brand-mode.mjs e no browser (preview do
 * Estudio). A spec tem o mesmo formato de SPEC em scripts/figma-brand-mode.js:
 *   { Palette: { 'palette/brand/50': '#rrggbb', ... }, Brand: { 'brand/id': 'acme', ... } }
 * cobrindo EXATAMENTE todas as variaveis das colecoes de marca.
 *
 * O doc devolvido sai no formato exato do figma-dump.js (chaves type, values,
 * scopes, description; `values` na ordem dos modos), para que um dump do Figma
 * depois bata byte a byte com o snapshot.
 */
import { aliasTarget, BRAND_COLLECTIONS, isAlias } from './emit.mjs';

const KNOWN = ['type', 'value', 'values', 'scopes', 'description'];
const SLUG = /^[a-z][a-z0-9-]*$/;
const HEX = /^#[0-9a-f]{6}([0-9a-f]{2})?$/;

/**
 * Problemas de uma spec contra o doc. Lista vazia = pode aplicar.
 * @param {object} doc
 * @param {Record<string, Record<string, unknown>>} spec
 * @param {{ mode?: string, fonts?: string[] }} [opts]  `mode`: o modo que a spec vai ocupar
 *   (o brand/id pode repetir o dele mesmo); `fonts`: familias aceitas (lib/fonts/catalog.ts).
 */
export function validateBrandSpec(doc, spec, { mode, fonts } = {}) {
  const problems = [];
  const all = new Map();
  for (const c of Object.values(doc.collections)) for (const [n, def] of Object.entries(c.variables)) all.set(n, def);

  for (const collectionName of BRAND_COLLECTIONS) {
    const c = doc.collections[collectionName];
    const values = spec?.[collectionName];
    if (!c) {
      problems.push(`colecao ${collectionName} nao existe no doc`);
      continue;
    }
    if (!values || typeof values !== 'object') {
      problems.push(`spec sem a colecao ${collectionName}`);
      continue;
    }
    for (const name of Object.keys(c.variables)) if (!(name in values)) problems.push(`${collectionName}: spec nao cobre ${name}`);
    for (const [name, value] of Object.entries(values)) {
      const def = c.variables[name];
      if (!def) {
        problems.push(`${collectionName}: ${name} nao existe no doc`);
        continue;
      }
      if (isAlias(value)) {
        const target = all.get(aliasTarget(value));
        if (!target) problems.push(`${name}: alias para variavel inexistente ${value}`);
        else if (target.type !== def.type) problems.push(`${name}: alias ${value} e ${target.type}, esperado ${def.type}`);
      } else if (def.type === 'COLOR') {
        if (typeof value !== 'string' || !HEX.test(value)) problems.push(`${name}: cor invalida ${JSON.stringify(value)} (use #rrggbb minusculo)`);
      } else if (def.type === 'FLOAT') {
        if (typeof value !== 'number' || !Number.isFinite(value)) problems.push(`${name}: numero invalido ${JSON.stringify(value)}`);
      } else if (typeof value !== 'string' || value.trim() === '') {
        problems.push(`${name}: texto invalido ${JSON.stringify(value)}`);
      }
    }
  }

  const id = spec?.Brand?.['brand/id'];
  if (typeof id === 'string') {
    if (!SLUG.test(id)) problems.push(`brand/id "${id}" precisa ser slug (a-z, 0-9, -)`);
    const brand = doc.collections.Brand;
    const idDef = brand?.variables['brand/id'];
    if (idDef) {
      const taken = Object.entries(idDef.values ?? { [brand.defaultMode]: idDef.value }).filter(([m, v]) => m !== mode && v === id);
      if (taken.length) problems.push(`brand/id "${id}" ja e da marca ${taken[0][0]}`);
    }
  }
  if (fonts) {
    for (const [name, value] of Object.entries(spec?.Brand ?? {})) {
      if (name.startsWith('brand/family/') && !isAlias(value) && !fonts.includes(value)) {
        problems.push(`${name}: familia "${value}" fora do catalogo de fontes`);
      }
    }
  }
  return problems;
}

/**
 * Aplica a spec como o modo `mode` (cria o modo se faltar). Nao muta o doc.
 * @returns {{ doc: object, changes: string[] }}  changes: o que mudou, legivel.
 */
export function applyBrandMode(doc, mode, spec, descriptions = {}, { fonts } = {}) {
  const problems = validateBrandSpec(doc, spec, { mode, fonts });
  if (problems.length) throw new Error(`Spec de marca invalida:\n  ${problems.join('\n  ')}`);

  const next = structuredClone(doc);
  const changes = [];
  for (const collectionName of BRAND_COLLECTIONS) {
    const c = next.collections[collectionName];
    const values = spec[collectionName];
    if (!c.modes.includes(mode)) {
      c.modes = [...c.modes, mode];
      changes.push(`${collectionName}: modo ${mode} criado (${c.modes.join('/')})`);
    }
    for (const [name, def] of Object.entries(c.variables)) {
      const before = def.values ?? { [c.defaultMode]: def.value };
      const merged = { ...before, [mode]: values[name] };
      const ordered = Object.fromEntries(c.modes.map((m) => [m, merged[m]]));
      const { type, scopes, description } = def;
      const rest = Object.fromEntries(Object.entries(def).filter(([k]) => !KNOWN.includes(k)));
      const nextDescription = name in descriptions ? descriptions[name] : description;
      const out = { type, values: ordered };
      if (scopes) out.scopes = scopes;
      if (nextDescription) out.description = nextDescription;
      Object.assign(out, rest);
      if (before[mode] !== values[name]) changes.push(`${name} [${mode}]: ${before[mode] ?? '(novo)'} -> ${values[name]}`);
      if (nextDescription !== description) {
        changes.push(`${name} (description): ${JSON.stringify(description)} -> ${JSON.stringify(nextDescription)}`);
      }
      c.variables[name] = out;
    }
  }
  return { doc: next, changes };
}

/** Atalho: so o doc com o modo aplicado. */
export const withBrandMode = (doc, mode, spec, descriptions = {}, opts = {}) =>
  applyBrandMode(doc, mode, spec, descriptions, opts).doc;

/** A spec de um modo que ja existe no doc (para partir dele, ex.: duplicar a VTSD). */
export function specOfMode(doc, mode) {
  return Object.fromEntries(
    BRAND_COLLECTIONS.filter((c) => doc.collections[c]).map((cn) => {
      const c = doc.collections[cn];
      return [
        cn,
        Object.fromEntries(
          Object.entries(c.variables).map(([n, def]) => {
            const values = def.values ?? { [c.defaultMode]: def.value };
            return [n, values[mode] ?? values[c.defaultMode]];
          }),
        ),
      ];
    }),
  );
}
