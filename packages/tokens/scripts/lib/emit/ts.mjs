/**
 * Emissor de TypeScript.
 *
 * O que sai daqui não é "os tokens em JS" — é o TIPO `TokenPath`, uma união
 * literal com todos os caminhos válidos. Esse tipo é o que faz o editor
 * autocompletar `'color.bg.brand.solid.'` e o que faz `tsc` recusar um token que
 * não existe mais depois de um rename. Sem ele, a única forma de descobrir que
 * um token sumiu seria ver a tela quebrada.
 *
 * Os valores resolvidos vêm junto, por marca e por tema, porque há consumidores
 * que não podem passar por CSS: canvas, geração de e-mail, React Native,
 * relatório de contraste. Para tudo que renderiza em DOM, o caminho certo
 * continua sendo a custom property — ela troca de tema sozinha, o literal não.
 */

import { toCssVarName, toFigmaName } from '../naming.mjs';
import { buildFor, descriptionOf, typeOf, valueOf } from '../dictionary.mjs';

/**
 * Escapa uma string para literal JS com aspas simples.
 * @param {unknown} value
 */
const quote = (value) => `'${String(value).replaceAll('\\', '\\\\').replaceAll("'", "\\'")}'`;

/**
 * @param {object} input
 * @param {string[]} input.brands
 * @param {string[]} input.themes
 * @param {Map<string, import('../dictionary.mjs').Build>} input.builds chave `${brand}:${theme}`
 * @param {string} input.defaultBrand
 * @param {string} input.header
 */
export function emitTs({ brands, themes, builds, defaultBrand, header }) {
  const reference = builds.get(`${defaultBrand}:${themes[0]}`);
  if (!reference) throw new Error('Build de referência ausente ao emitir TypeScript.');

  const paths = reference.tokens.map((token) => token.path.join('.')).sort();

  const meta = reference.tokens
    .slice()
    .sort((a, b) => a.path.join('.').localeCompare(b.path.join('.')))
    .map((token) => {
      const path = token.path.join('.');
      /** @type {{ type: string | undefined, cssVar: string, figmaName: string, description?: string }} */
      const entry = {
        type: typeOf(token),
        cssVar: toCssVarName(token.path),
        figmaName: toFigmaName(token.path),
      };
      const description = descriptionOf(token);
      if (description) entry.description = description;
      return `  ${quote(path)}: ${JSON.stringify(entry)},`;
    });

  /** Valores literais resolvidos, por marca e tema. */
  const values = brands
    .map((brand) => {
      const perTheme = themes
        .map((theme) => {
          const build = buildFor(builds, brand, theme);
          const entries = build.tokens
            .slice()
            .sort((a, b) => a.path.join('.').localeCompare(b.path.join('.')))
            .map(
              (token) => `      ${quote(token.path.join('.'))}: ${JSON.stringify(valueOf(token))},`,
            );
          return [`    ${quote(theme)}: {`, ...entries, '    },'].join('\n');
        })
        .join('\n');
      return [`  ${quote(brand)}: {`, perTheme, '  },'].join('\n');
    })
    .join('\n');

  const js = [
    header,
    '',
    `export const DEFAULT_BRAND = ${quote(defaultBrand)};`,
    `export const BRANDS = ${JSON.stringify(brands)};`,
    `export const THEMES = ${JSON.stringify(themes)};`,
    '',
    '/** Todos os caminhos de token, em ordem alfabética. */',
    `export const TOKEN_PATHS = [\n${paths.map((path) => `  ${quote(path)},`).join('\n')}\n];`,
    '',
    '/** Metadados por token: tipo, custom property e nome no Figma. */',
    `export const tokens = {\n${meta.join('\n')}\n};`,
    '',
    '/** Valores resolvidos. Use apenas fora do DOM — no DOM, prefira `ref()`. */',
    `export const values = {\n${values}\n};`,
    '',
    '/** `cssVar("color.text.primary")` → `"--santo-color-text-primary"` */',
    'export function cssVar(path) {',
    '  const token = tokens[path];',
    '  if (!token) throw new Error(`Token inexistente: "${path}"`);',
    '  return token.cssVar;',
    '}',
    '',
    '/** `ref("color.text.primary")` → `"var(--santo-color-text-primary)"` */',
    'export function ref(path) {',
    '  return `var(${cssVar(path)})`;',
    '}',
    '',
    '/** `value("color.text.primary")` → o literal resolvido da marca/tema pedidos. */',
    'export function value(path, { brand = DEFAULT_BRAND, theme = THEMES[0] } = {}) {',
    '  const resolved = values[brand]?.[theme]?.[path];',
    '  if (resolved === undefined) {',
    '    throw new Error(`Sem valor para "${path}" em ${brand}/${theme}.`);',
    '  }',
    '  return resolved;',
    '}',
    '',
  ].join('\n');

  const union = paths.map((path) => `  | ${quote(path)}`).join('\n');

  const dts = [
    header,
    '',
    '/** Todo caminho de token válido do Santo. Renomear um token quebra o build de quem o usa — de propósito. */',
    `export type TokenPath =\n${union};`,
    '',
    `export type Brand = ${brands.map(quote).join(' | ')};`,
    `export type Theme = ${themes.map(quote).join(' | ')};`,
    '',
    '/**',
    ' * Um valor resolvido. Escalares na maioria dos casos, mas tokens compostos',
    ' * (`typography.*`) resolvem para um objeto com um campo por eixo — daí a união.',
    ' */',
    'export type TokenValue = string | number | Readonly<Record<string, string | number>>;',
    '',
    'export interface TokenMeta {',
    '  /** Tipo DTCG do token: color, dimension, shadow, typography, ... */',
    '  readonly type: string;',
    '  /** Nome da CSS custom property, sem o `var()`. */',
    '  readonly cssVar: string;',
    '  /** Nome da Variable correspondente no Figma. */',
    '  readonly figmaName: string;',
    '  readonly description?: string;',
    '}',
    '',
    'export declare const DEFAULT_BRAND: Brand;',
    'export declare const BRANDS: readonly Brand[];',
    'export declare const THEMES: readonly Theme[];',
    'export declare const TOKEN_PATHS: readonly TokenPath[];',
    'export declare const tokens: Readonly<Record<TokenPath, TokenMeta>>;',
    'export declare const values: Readonly<',
    '  Record<Brand, Record<Theme, Readonly<Record<TokenPath, TokenValue>>>>',
    '>;',
    '',
    'export declare function cssVar(path: TokenPath): string;',
    'export declare function ref(path: TokenPath): string;',
    'export declare function value(',
    '  path: TokenPath,',
    '  options?: { brand?: Brand; theme?: Theme },',
    '): TokenValue;',
    '',
  ].join('\n');

  return { js, dts };
}
