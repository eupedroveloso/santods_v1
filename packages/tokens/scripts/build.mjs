#!/usr/bin/env node
/**
 * O build dos tokens.
 *
 * Um build é a matriz (marca × tema) resolvida uma vez e emitida em quatro
 * formatos. Todos os quatro saem do MESMO dicionário — é por isso que o nome de
 * um token no CSS, no TypeScript e no Figma não pode divergir: não existe
 * caminho de código em que um seja escrito sem o outro.
 *
 *   dist/css/<marca>.css        custom properties + classes de tipografia
 *   dist/tailwind/<marca>.css   camada @theme inline do Tailwind 4
 *   dist/ts/index.js|.d.ts      o tipo TokenPath e os valores resolvidos
 *   dist/figma/*.json           o documento que o push envia ao Figma
 *
 * Uso:
 *   node scripts/build.mjs            build único
 *   node scripts/build.mjs --watch    reconstrói a cada alteração em src/
 */

import { mkdir, rm, writeFile } from 'node:fs/promises';
import path from 'node:path';
import process from 'node:process';

import { THEMES } from '../figma.config.mjs';
import { messageOf, run } from './lib/cli.mjs';
import { brandLabelsOf, buildFor, loadMatrix } from './lib/dictionary.mjs';
import { DEFAULT_BRAND, DIST_DIR, SRC_DIR, listBrands } from './lib/sources.mjs';
import { emitCss } from './lib/emit/css.mjs';
import { emitTailwind } from './lib/emit/tailwind.mjs';
import { emitTs } from './lib/emit/ts.mjs';
import {
  assertEveryRootMapped,
  emitCollections,
  emitEffectStyles,
  emitTextStyles,
} from './lib/emit/figma.mjs';

/**
 * Cabeçalho de arquivo gerado.
 *
 * Sem timestamp de propósito: o `dist/` é comparado em CI para detectar build
 * desatualizado, e uma data mudaria o conteúdo a cada execução, tornando todo
 * diff ruído e o próprio check inútil.
 */
const header = (extra = '') =>
  [
    '/**',
    ' * ARQUIVO GERADO — não edite à mão.',
    ' *',
    ' * Fonte: packages/tokens/src/',
    ' * Regenerar: pnpm --filter @santo/tokens build',
    extra ? ` *\n * ${extra}` : null,
    ' */',
  ]
    .filter(Boolean)
    .join('\n');

/** @param {string} file @param {string} contents */
async function write(file, contents) {
  await mkdir(path.dirname(file), { recursive: true });
  await writeFile(file, contents, 'utf8');
  return file;
}

/** @param {unknown} value */
const json = (value) => `${JSON.stringify(value, null, 2)}\n`;

async function build() {
  const started = process.hrtime.bigint();
  const brands = await listBrands();

  await rm(DIST_DIR, { recursive: true, force: true });

  const builds = await loadMatrix(brands, THEMES);

  const primary = buildFor(builds, DEFAULT_BRAND, THEMES[0]);
  assertEveryRootMapped(primary);

  const brandLabels = brandLabelsOf(builds, brands, THEMES);

  const written = [];

  // ── CSS e Tailwind, um par por marca ──────────────────────────────────────
  for (const brand of brands) {
    const light = buildFor(builds, brand, 'light');
    const dark = buildFor(builds, brand, 'dark');

    written.push(
      await write(
        path.join(DIST_DIR, 'css', `${brand}.css`),
        emitCss({
          light,
          dark,
          header: header(`Marca: ${brandLabels[brand]} · temas: ${THEMES.join(', ')}`),
        }),
      ),
    );

    written.push(
      await write(
        path.join(DIST_DIR, 'tailwind', `${brand}.css`),
        emitTailwind({
          brand,
          light,
          header: header(`Camada Tailwind 4 · marca ${brandLabels[brand]}`),
        }),
      ),
    );
  }

  // ── TypeScript ────────────────────────────────────────────────────────────
  const { js, dts } = emitTs({
    brands,
    themes: THEMES,
    builds,
    defaultBrand: DEFAULT_BRAND,
    header: header(),
  });

  written.push(await write(path.join(DIST_DIR, 'ts', 'index.js'), js));
  written.push(await write(path.join(DIST_DIR, 'ts', 'index.d.ts'), dts));
  written.push(
    await write(
      path.join(DIST_DIR, 'ts', 'brands.json'),
      json({
        default: DEFAULT_BRAND,
        brands: brands.map((brand) => ({ id: brand, name: brandLabels[brand] })),
        themes: THEMES,
      }),
    ),
  );

  // ── Figma ─────────────────────────────────────────────────────────────────
  const { collections, unsupported } = emitCollections({
    builds,
    brands,
    themes: THEMES,
    brandLabels,
    defaultBrand: DEFAULT_BRAND,
  });

  for (const collection of collections) {
    written.push(
      await write(
        path.join(DIST_DIR, 'figma', `${collection.name.toLowerCase()}.json`),
        json(collection),
      ),
    );
  }

  written.push(
    await write(path.join(DIST_DIR, 'figma', 'text-styles.json'), json(emitTextStyles(primary))),
  );
  written.push(
    await write(
      path.join(DIST_DIR, 'figma', 'effect-styles.json'),
      json(emitEffectStyles(primary)),
    ),
  );
  written.push(
    await write(
      path.join(DIST_DIR, 'figma', 'manifest.json'),
      json({
        defaultBrand: DEFAULT_BRAND,
        brands,
        themes: THEMES,
        collections: collections.map((collection) => ({
          name: collection.name,
          file: `${collection.name.toLowerCase()}.json`,
          modes: collection.modes,
          variables: collection.variables.length,
        })),
        textStyles: 'text-styles.json',
        effectStyles: 'effect-styles.json',
        unsupported,
      }),
    ),
  );

  const ms = Number(process.hrtime.bigint() - started) / 1e6;

  console.log(
    `✓ tokens · ${primary.tokens.length} tokens · ${brands.length} marca(s) × ${THEMES.length} tema(s) · ` +
      `${written.length} arquivos · ${ms.toFixed(0)}ms`,
  );

  if (unsupported.length) {
    console.log(
      `  ${unsupported.length} token(s) sem equivalente no Figma (ver dist/figma/manifest.json):`,
    );
    for (const item of unsupported) console.log(`    · ${item.token} — ${item.reason}`);
  }

  return written;
}

async function main() {
  if (!process.argv.includes('--watch')) {
    await build();
    return;
  }

  const { watch } = await import('chokidar');

  await build();
  console.log(`  observando ${path.relative(process.cwd(), SRC_DIR)}/ …`);

  let running = false;
  let queued = false;

  const rebuild = async () => {
    if (running) {
      queued = true;
      return;
    }
    running = true;
    try {
      await build();
    } catch (error) {
      // Em modo watch um build quebrado não derruba o processo: quem está
      // editando token quer ver o erro e salvar de novo, não reiniciar o watch.
      console.error(`✗ ${messageOf(error)}`);
    } finally {
      running = false;
      if (queued) {
        queued = false;
        await rebuild();
      }
    }
  };

  watch(SRC_DIR, { ignoreInitial: true }).on('all', rebuild);
}

await run('build dos tokens falhou', main);
