#!/usr/bin/env node
/**
 * Gera os artefatos da lib a partir de tokens/santods.figma.json e de brands/*.json.
 *
 *   node scripts/build-tokens.mjs
 *
 * A logica de emissao vive em lib/tokens/emit.mjs, que e um modulo puro e roda
 * igual no browser — e o mesmo codigo que o Studio usa no preview ao vivo.
 *
 * Saidas (todas geradas — nao editar a mao):
 *   lib/tokens/tokens.css          variaveis --santo-* da marca base (Light + Dark)
 *   lib/tokens/typography.css      as 68 classes de text style
 *   lib/tokens/theme.css           mapeamento @theme inline para Tailwind v4
 *   lib/tokens/index.ts            tokens tipados
 *   lib/tokens/brands/<id>.css     um bloco [data-brand='<id>'] por marca derivada
 *   lib/tokens/brands/index.ts     catalogo das marcas
 */
import { readFileSync, writeFileSync, mkdirSync, readdirSync, rmSync, existsSync } from 'node:fs';
import { dirname, resolve, join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { emitTokensCss, emitTypographyCss, emitThemeCss, emitIndexTs } from '../lib/tokens/emit.mjs';
import { applyBrand, countOverrides } from '../lib/tokens/brand.mjs';

const root = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const base = JSON.parse(readFileSync(resolve(root, 'tokens/santods.figma.json'), 'utf8'));

const written = [];
function write(path, contents) {
  const full = resolve(root, path);
  mkdirSync(dirname(full), { recursive: true });
  writeFileSync(full, contents);
  written.push(`  ${path}  ${contents.split('\n').length} linhas`);
}

/* ------------------------------------------------------------ marca base */

write('lib/tokens/tokens.css', emitTokensCss(base));
write('lib/tokens/typography.css', emitTypographyCss(base));
write('lib/tokens/theme.css', emitThemeCss(base));
write('lib/tokens/index.ts', emitIndexTs(base));

/* -------------------------------------------------------- marcas derivadas */

const brandsDir = resolve(root, 'brands');
const outDir = resolve(root, 'lib/tokens/brands');
rmSync(outDir, { recursive: true, force: true });
mkdirSync(outDir, { recursive: true });

const brands = existsSync(brandsDir)
  ? readdirSync(brandsDir)
      .filter((f) => f.endsWith('.json'))
      .map((f) => JSON.parse(readFileSync(join(brandsDir, f), 'utf8')))
      .sort((a, b) => (a.id === 'santo' ? -1 : b.id === 'santo' ? 1 : a.id.localeCompare(b.id)))
  : [];

for (const brand of brands) {
  // A marca base ja saiu em tokens.css sob :root; as demais viram um escopo
  // [data-brand='<id>'] que sobrepoe so o que elas mudam.
  if (brand.id === 'santo') continue;
  const doc = applyBrand(base, brand);
  const banner = `/* GERADO POR scripts/build-tokens.mjs A PARTIR DE brands/${brand.id}.json.
   Marca "${brand.name}" — ${countOverrides(brand.overrides)} pontos de override sobre a base Santo.
   Nao edite este arquivo. Edite a marca em /studio ou em brands/${brand.id}.json e rode \`npm run tokens\`. */`;
  write(
    `lib/tokens/brands/${brand.id}.css`,
    emitTokensCss(doc, { banner, selector: `[data-brand='${brand.id}']` }) +
      '\n' +
      emitTypographyCss(doc, { banner: `/* Text styles da marca ${brand.name}. */` }).replace(
        /^\.santo-/gm,
        `[data-brand='${brand.id}'] .santo-`,
      ),
  );
}

const catalog = brands.map((b) => ({
  id: b.id,
  name: b.name,
  description: b.description ?? '',
  overrides: countOverrides(b.overrides),
}));

write(
  'lib/tokens/brands/index.ts',
  `// GERADO POR scripts/build-tokens.mjs A PARTIR DE brands/*.json. Nao edite a mao.

export type BrandSummary = {
  id: string;
  name: string;
  description: string;
  /** Quantos tokens/styles esta marca muda em relacao a base Santo. */
  overrides: number;
};

/** Marcas disponiveis. A base "santo" vive em :root; as demais em [data-brand]. */
export const brands = ${JSON.stringify(catalog, null, 2)} as const satisfies readonly BrandSummary[];

export type BrandId = (typeof brands)[number]['id'];
`,
);

/* --------------------------------------------- css agregador das marcas */

const imports = brands.filter((b) => b.id !== 'santo').map((b) => `@import "./${b.id}.css";`);
write(
  'lib/tokens/brands/all.css',
  `/* GERADO POR scripts/build-tokens.mjs. Importe este arquivo para habilitar
   todas as marcas derivadas via atributo data-brand no elemento raiz. */
${imports.join('\n') || '/* Nenhuma marca derivada ainda. Crie uma em /studio. */'}
`,
);

console.log(written.join('\n'));
console.log(
  `\nOK — base com ${Object.values(base.collections).reduce((a, c) => a + Object.keys(c.variables).length, 0)} variaveis, ` +
    `${Object.keys(base.textStyles).length} text styles, ${Object.keys(base.effectStyles).length} effect styles.` +
    `\n     ${brands.length} marca(s): ${brands.map((b) => `${b.name} (${countOverrides(b.overrides)})`).join(', ')}`,
);
