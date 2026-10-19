#!/usr/bin/env node
/**
 * Inventario de componentes Figma x lib/ui.
 *
 *   node scripts/figma-components.mjs <dump.json>   grava a partir de um dump novo
 *   node scripts/figma-components.mjs               repareia o inventario atual com lib/ui
 *
 * O dump vem de scripts/figma-components.js rodado via MCP use_figma, uma vez
 * por pagina, no formato { fileKey, dumpedAt, pages: [<saida do script>...] }.
 * Saida: tokens/santods.components.json (gerado — nao editar a mao).
 *
 * O par vem do registro do Ateliê: cada lib/ui/*.meta.ts declara
 * `figma: { name }` quando o componente tem par. Sem declaracao, o script so
 * sugere um par quando o nome do Figma bate com o nome ou slug do codigo
 * (marcado como source: "nome"), e o registro precisa confirmar.
 * Requer Node com suporte a TypeScript nativo (os *.meta.ts so tem `import type`).
 */
import { existsSync, readFileSync, readdirSync, writeFileSync } from 'node:fs';
import { dirname, resolve } from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';

const root = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const OUT = resolve(root, 'tokens/santods.components.json');
const SNAPSHOT = resolve(root, 'tokens/santods.figma.json');
const UI = resolve(root, 'lib/ui');

const dumpPath = process.argv.slice(2).find((a) => !a.startsWith('--'));

/* ---------------------------------------------------------- lado Figma */

let figmaSide;
if (dumpPath) {
  const dump = JSON.parse(readFileSync(resolve(dumpPath), 'utf8'));
  const { meta } = JSON.parse(readFileSync(SNAPSHOT, 'utf8'));
  if (dump.fileKey !== meta.fileKey) {
    console.error(`Dump e de outro arquivo: ${dump.fileKey} (esperado ${meta.fileKey}).`);
    process.exit(1);
  }
  figmaSide = {
    fileKey: dump.fileKey,
    fileName: meta.fileName,
    dumpedAt: dump.dumpedAt,
    pages: dump.pages.map((p) => ({ name: p.page, nodeId: p.pageId, components: p.components.length })),
    components: dump.pages.flatMap((p) => p.components),
  };
} else {
  const { meta, components } = JSON.parse(readFileSync(OUT, 'utf8'));
  figmaSide = {
    fileKey: meta.fileKey,
    fileName: meta.fileName,
    dumpedAt: meta.dumpedAt,
    pages: meta.pages,
    components: components.map((c) => {
      const figmaOnly = { ...c };
      delete figmaOnly.code;
      return figmaOnly;
    }),
  };
}

/* ------------------------------------------------------- lado lib/ui */

const metas = [];
for (const file of readdirSync(UI).filter((f) => f.endsWith('.meta.ts')).sort()) {
  const mod = await import(pathToFileURL(resolve(UI, file)).href);
  for (const list of Object.values(mod)) if (Array.isArray(list)) metas.push(...list);
}

const norm = (s) => s.toLowerCase().replace(/[^a-z0-9]/g, '');

const pairOf = (component) => {
  const declared = metas.find((m) => m.figma?.name === component.name);
  if (declared) return { slug: declared.slug, name: declared.name, source: 'meta', nodeIdInMeta: declared.figma.nodeId ?? null };
  const guess = metas.find((m) => norm(m.name) === norm(component.name) || norm(m.slug) === norm(component.name));
  return guess ? { slug: guess.slug, name: guess.name, source: 'nome', nodeIdInMeta: null } : null;
};

const components = figmaSide.components.map((c) => ({ ...c, code: pairOf(c) }));

/**
 * Par com uma PAGINA inteira (`figma: { name: "Pagina <nome>" }`): hoje so o Icon,
 * cujo par e a pagina Icones (exportados em lib/icons/manifest.json).
 */
const ICONS_MANIFEST = resolve(root, 'lib/icons/manifest.json');
const iconsPage = existsSync(ICONS_MANIFEST) ? JSON.parse(readFileSync(ICONS_MANIFEST, 'utf8')) : null;
const pagePairs = metas
  .filter((m) => iconsPage && m.figma?.name === `Página ${iconsPage.page}`)
  .map((m) => ({ slug: m.slug, name: m.name, page: iconsPage.page, pageId: iconsPage.pageId, inventory: 'lib/icons/manifest.json' }));

const pairedSlugs = new Set([
  ...components.flatMap((c) => (c.code ? [c.code.slug] : [])),
  ...pagePairs.map((p) => p.slug),
]);
const codeOnly = metas
  .filter((m) => !pairedSlugs.has(m.slug))
  .map((m) => ({ slug: m.slug, name: m.name, source: m.source, figmaDeclared: m.figma?.name ?? null }));

const summary = {
  figmaComponents: components.length,
  paired: components.filter((c) => c.code).length,
  pagePairs: pagePairs.map((p) => `${p.slug} -> Página ${p.page}`),
  figmaOnly: components.filter((c) => !c.code).map((c) => c.name),
  codeOnly: codeOnly.map((m) => m.slug),
  /** Metas que declaram um par no Figma que nao existe no dump. */
  brokenDeclarations: codeOnly.filter((m) => m.figmaDeclared).map((m) => `${m.slug} -> ${m.figmaDeclared}`),
};

const out = {
  meta: {
    fileKey: figmaSide.fileKey,
    fileName: figmaSide.fileName,
    dumpedAt: figmaSide.dumpedAt,
    pages: figmaSide.pages,
    generatedBy: 'scripts/figma-components.mjs',
    note: 'GERADO. Nao editar a mao. Dump via scripts/figma-components.js (use_figma, somente leitura, pagina Icones fora).',
    summary,
  },
  components,
  pagePairs,
  codeOnly,
};

writeFileSync(OUT, `${JSON.stringify(out, null, 2)}\n`);
console.log(`tokens/santods.components.json — dump de ${out.meta.dumpedAt}, ${out.meta.fileKey}`);
console.log(`Figma: ${summary.figmaComponents} componentes, ${summary.paired} com par em lib/ui.`);
for (const c of components) {
  console.log(`  ${c.code ? `${c.code.slug.padEnd(12)}` : '(sem par)   '} <- ${c.name} ${c.nodeId} [${c.type}, ${c.variantCount} variantes]${c.code?.source === 'nome' ? ' (sugerido pelo nome)' : ''}`);
}
console.log(`So no Figma: ${summary.figmaOnly.join(', ') || 'nenhum'}`);
console.log(`So no codigo (${summary.codeOnly.length}): ${summary.codeOnly.join(', ') || 'nenhum'}`);
if (summary.brokenDeclarations.length) console.log(`Par declarado que nao existe no Figma: ${summary.brokenDeclarations.join(', ')}`);
