/**
 * Descoberta das fontes de token.
 *
 * Uma marca é uma PASTA em `src/brands/`. Não há registro central de marcas em
 * lugar nenhum: criar a pasta é o que cria a marca. Isso é deliberado — o dia em
 * que um produto novo entrar no sistema, a única coisa a fazer é copiar
 * `src/brands/santo/` para `src/brands/<produto>/` e reescrever os dois arquivos
 * de dentro. Nenhum build, config ou componente é tocado.
 *
 * A composição de cada build é sempre a mesma soma de quatro camadas:
 *
 *   primitivas  (invariantes)  +  marca  +  semântica compartilhada  +  cor do tema
 *
 * As três primeiras não mudam entre temas; só a última troca. É por isso que um
 * build é identificado pelo par (marca, tema).
 */

import { readdir } from 'node:fs/promises';
import { fileURLToPath } from 'node:url';
import path from 'node:path';

const HERE = path.dirname(fileURLToPath(import.meta.url));

/** Raiz do pacote `@santo/tokens`. */
export const PACKAGE_ROOT = path.resolve(HERE, '../..');

/** Onde vivem os tokens de origem. */
export const SRC_DIR = path.join(PACKAGE_ROOT, 'src');

/** Onde o build escreve. Apagado inteiro a cada build. */
export const DIST_DIR = path.join(PACKAGE_ROOT, 'dist');

/** A marca padrão — a que os subpaths `./css` e `./tailwind` do package.json expõem. */
export const DEFAULT_BRAND = 'santo';

/** @param {string} name */
const isJson = (name) => name.endsWith('.json');

/** @param {string} dir */
async function jsonFilesIn(dir) {
  const entries = await readdir(dir, { withFileTypes: true });
  return entries
    .filter((entry) => entry.isFile() && isJson(entry.name))
    .map((entry) => path.join(dir, entry.name))
    .sort();
}

/**
 * As marcas existentes, em ordem alfabética com a padrão sempre em primeiro.
 * A ordem importa: no Figma ela vira a ordem dos modos das coleções `Palette` e
 * `Brand`, e o primeiro modo é o que o Figma usa como padrão de um frame novo.
 *
 * @returns {Promise<string[]>}
 */
export async function listBrands() {
  const entries = await readdir(path.join(SRC_DIR, 'brands'), { withFileTypes: true });
  const brands = entries.filter((entry) => entry.isDirectory()).map((entry) => entry.name);

  if (!brands.includes(DEFAULT_BRAND)) {
    throw new Error(
      `A marca padrão "${DEFAULT_BRAND}" não existe em src/brands/.\n` +
        `Encontradas: ${brands.join(', ') || '(nenhuma)'}`,
    );
  }

  return [DEFAULT_BRAND, ...brands.filter((brand) => brand !== DEFAULT_BRAND).sort()];
}

/** Arquivos de primitivas — idênticos em toda marca e todo tema. */
export const primitiveFiles = () => jsonFilesIn(path.join(SRC_DIR, 'primitives'));

/**
 * Arquivos de uma marca: paleta e identidade.
 * @param {string} brand
 */
export const brandFiles = (brand) => jsonFilesIn(path.join(SRC_DIR, 'brands', brand));

/** Semântica que não depende de tema: espaço, raio, borda, foco, elevação, tipografia. */
export async function sharedSemanticFiles() {
  const files = await jsonFilesIn(path.join(SRC_DIR, 'semantic'));
  return files.filter((file) => !path.basename(file).startsWith('color.'));
}

/**
 * O arquivo de cor semântica de um tema.
 * @param {string} theme
 */
export const themeColorFile = (theme) => path.join(SRC_DIR, 'semantic', `color.${theme}.json`);

/**
 * A lista completa de arquivos de um build (marca, tema), na ordem em que o
 * Style Dictionary deve lê-los.
 *
 * @param {{ brand: string, theme: string }} target
 * @returns {Promise<string[]>}
 */
export async function sourceFilesFor({ brand, theme }) {
  const [primitives, brandOwn, shared] = await Promise.all([
    primitiveFiles(),
    brandFiles(brand),
    sharedSemanticFiles(),
  ]);

  return [...primitives, ...brandOwn, ...shared, themeColorFile(theme)];
}
