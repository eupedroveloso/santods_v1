#!/usr/bin/env node
/**
 * Tier objetivo: primitivo nao compoe.
 *
 *   node scripts/check-tier.mjs
 *
 * Decisao do maestro (2026-10-19):
 *   PRIMITIVO = generico, sem papel de produto, e nao importa outro componente
 *               de lib/ui alem de Icon (lib/ui/icons, lib/icons).
 *   SEMANTICO = papel de produto/app; pode ou nao compor.
 *   MARKETING = landing, materiais e apresentações comerciais.
 *
 * Regras:
 *   1. todo item de lib/ui/*.meta.ts tem `tier` válido no registry;
 *   2. o arquivo-fonte (`source`) de um item primitivo nao importa, em runtime,
 *      outro modulo de componente de lib/ui (qualquer `source` de outro meta),
 *      nem de @/lib/ui. `import type` nao compoe e passa; helper que nao e
 *      componente (button-class, use-modal, registry.types) tambem passa.
 *
 * O check e por arquivo: se o arquivo importa um componente, todo item
 * primitivo que mora nele acusa — dois componentes no mesmo arquivo dividem
 * os imports.
 */
import { readFileSync, readdirSync } from 'node:fs';
import { resolve, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';
import { TIERS } from '../lib/ui/registry.config.ts';

const root = resolve(dirname(fileURLToPath(import.meta.url)), '..');
/** Pasta dos componentes; um argumento troca (fixture de teste). */
const UI = resolve(root, process.argv[2] ?? 'lib/ui');
const ICONS = new Set(['icons', 'index-icons']);

/** Itens de meta: nome, slug, tier, source — e a linha, para apontar o erro. */
const items = [];
for (const file of readdirSync(UI).filter((f) => f.endsWith('.meta.ts'))) {
  const src = readFileSync(resolve(UI, file), 'utf8');
  for (const m of src.matchAll(/\{\s*name:\s*"([^"]+)"[\s\S]*?\n\s{2}\}/g)) {
    const body = m[0];
    items.push({
      meta: `lib/ui/${file}:${src.slice(0, m.index).split('\n').length}`,
      name: m[1],
      tier: body.match(/\btier:\s*"(\w+)"/)?.[1] ?? null,
      source: body.match(/\bsource:\s*"([^"]+)"/)?.[1] ?? null,
    });
  }
}

/** Modulos que sao componente: o `source` de algum meta, sem extensao. Icons ficam fora. */
const componentModules = new Set(items.map((i) => i.source?.replace(/\.tsx?$/, '')).filter((s) => s && !ICONS.has(s)));

/** Imports de runtime de um arquivo de lib/ui que apontam para outro componente. */
function componentImports(source) {
  const own = source.replace(/\.tsx?$/, '');
  const src = readFileSync(resolve(UI, source), 'utf8');
  const out = [];
  for (const m of src.matchAll(/^import\s+(type\s+)?([\s\S]*?)\s+from\s+["']([^"']+)["'];?/gm)) {
    if (m[1]) continue; // import type nao compoe
    const spec = m[3];
    const line = src.slice(0, m.index).split('\n').length;
    const local = spec.match(/^\.\/([\w-]+)$/)?.[1];
    if (local && local !== own && componentModules.has(local)) out.push({ line, spec, what: m[2].replace(/\s+/g, ' ') });
    if (/^@\/lib\/ui(\/|$)/.test(spec) && !/\/icons$/.test(spec)) out.push({ line, spec, what: m[2].replace(/\s+/g, ' ') });
  }
  return out;
}

const problems = [];
for (const item of items) {
  if (!item.tier) problems.push(`${item.meta}  ${item.name} sem tier — todo componente deve declarar sua camada`);
  else if (!TIERS.some((tier) => tier.id === item.tier)) problems.push(`${item.meta}  ${item.name} com tier "${item.tier}" invalido`);
  if (item.tier !== 'primitivo' || !item.source) continue;
  for (const imp of componentImports(item.source)) {
    problems.push(
      `lib/ui/${item.source}:${imp.line}  ${item.name} e primitivo mas importa ${imp.what} de "${imp.spec}" — ` +
        `tire a composicao ou reclassifique como semantico`,
    );
  }
}

/*
 * Vitrine: todo slug do registry tem ilustracao em lib/thumbs/<slug>.thumb.tsx,
 * registrada em lib/thumbs/index.ts; e nada sobra la sem slug. So na pasta
 * real (o argumento de fixture troca so os metas).
 */
const THUMBS = resolve(root, 'lib/thumbs');
let thumbCount = 0;
if (!process.argv[2]) {
  const slugs = new Set();
  for (const file of readdirSync(UI).filter((f) => f.endsWith('.meta.ts'))) {
    for (const m of readFileSync(resolve(UI, file), 'utf8').matchAll(/\bslug:\s*"([^"]+)"/g)) slugs.add(m[1]);
  }
  const files = new Set(readdirSync(THUMBS).filter((f) => f.endsWith('.thumb.tsx')).map((f) => f.replace('.thumb.tsx', '')));
  const index = readFileSync(resolve(THUMBS, 'index.ts'), 'utf8');
  const keys = new Set([...index.matchAll(/^\s*"?([a-z0-9-]+)"?\s*:\s*\w+Thumb\b/gm)].map((m) => m[1]));
  thumbCount = files.size;
  for (const slug of slugs) {
    if (!files.has(slug)) problems.push(`lib/thumbs/${slug}.thumb.tsx  falta a ilustracao do slug "${slug}" (skill santo-vitrine)`);
    else if (!keys.has(slug)) problems.push(`lib/thumbs/index.ts  "${slug}" tem arquivo mas nao esta registrado no mapa de thumbs`);
  }
  for (const file of files) if (!slugs.has(file)) problems.push(`lib/thumbs/${file}.thumb.tsx  thumb orfa: nenhum meta tem o slug "${file}"`);
  for (const key of keys) if (!files.has(key)) problems.push(`lib/thumbs/index.ts  chave "${key}" sem arquivo lib/thumbs/${key}.thumb.tsx`);
}

const counts = TIERS.map((tier) => `${items.filter((item) => item.tier === tier.id).length} ${tier.label.toLocaleLowerCase('pt-BR')}`);
console.log(`Lidos ${items.length} componentes de lib/ui/*.meta.ts (${counts.join(', ')})${thumbCount ? ` e ${thumbCount} thumbs` : ''}.`);
if (problems.length) {
  console.error(`\n${problems.length} problema(s) de tier:`);
  problems.forEach((p) => console.error('  ' + p));
  process.exit(1);
}
console.log('\nOK — todo componente tem tier e nenhum primitivo compoe outro componente.');
