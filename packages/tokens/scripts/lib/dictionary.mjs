/**
 * Construção do dicionário — a camada que fala com o Style Dictionary.
 *
 * Duas decisões aqui merecem explicação, porque ambas contrariam o padrão da
 * ferramenta e ambas existem pela mesma razão: paridade com o Figma.
 *
 * 1. NÃO convertemos px para rem (`size/rem` está fora da lista de transforms).
 *    O Figma trabalha em px absolutos. Se o CSS saísse em rem, um `16` no Figma
 *    e um `1rem` no código seriam o mesmo valor só enquanto ninguém mexesse no
 *    font-size da raiz — e no dia em que alguém mexesse, os dois ambientes
 *    divergiriam silenciosamente. px nos dois lados torna a divergência
 *    impossível em vez de improvável.
 *
 * 2. NÃO convertemos ms para segundos (`time/seconds` está fora). Mesmo motivo:
 *    o painel de Smart Animate do Figma mostra ms.
 *
 * O preço é que o consumidor perde o redimensionamento automático por
 * preferência de fonte do sistema. Quem precisar disso escala via `zoom` ou
 * container query no app, que é uma decisão de produto — não do sistema.
 */

import StyleDictionary from 'style-dictionary';
import { createPropertyFormatter } from 'style-dictionary/utils';

import { CSS_PREFIX } from './naming.mjs';
import { TEXT_STYLE_ROOTS, EFFECT_STYLE_ROOTS } from '../../figma.config.mjs';
import { sourceFilesFor } from './sources.mjs';

/** Nome da plataforma única. Todo emissor parte do mesmo dicionário transformado. */
const PLATFORM = 'css';

/**
 * Transforms, na ordem. É a lista `css` embutida menos `size/rem`, `time/seconds`
 * e `html/icon` (não temos ícones como token), e menos os shorthands compostos
 * de tipografia — `typography` é emitida por um formatador próprio, porque o
 * shorthand `font:` do CSS não carrega `letter-spacing` e perderia o token.
 */
const TRANSFORMS = [
  'attribute/cti',
  'name/kebab',
  'color/css',
  'fontFamily/css',
  'cubicBezier/css',
  'strokeStyle/css/shorthand',
  'border/css/shorthand',
  'shadow/css/shorthand',
];

/** Raízes que viram Text Styles, não custom properties comuns. */
const TYPOGRAPHY_ROOTS = new Set(TEXT_STYLE_ROOTS);

/** Raízes que viram Effect Styles. Em CSS continuam sendo custom properties. */
export const ELEVATION_ROOTS = new Set(EFFECT_STYLE_ROOTS);

/** A raiz da camada semântica de cor — a única que muda entre temas. */
export const COLOR_ROOT = 'color';

/**
 * Metadados da marca que existem para o build e para o Figma, mas que não fazem
 * sentido como CSS custom property. `brand.name` é uma string humana, não um valor.
 */
const CSS_EXCLUDED = new Set(['brand.id', 'brand.name']);

/** @param {import('style-dictionary/types').TransformedToken} token */
export const rootOf = (token) => token.path[0];

/** @param {import('style-dictionary/types').TransformedToken} token */
export const isTypography = (token) => TYPOGRAPHY_ROOTS.has(rootOf(token));

/** @param {import('style-dictionary/types').TransformedToken} token */
export const isColor = (token) => rootOf(token) === COLOR_ROOT;

/**
 * Tokens que vão para o bloco base do CSS: tudo que não é cor semântica nem
 * tipografia composta, menos os metadados de marca.
 *
 * @param {import('style-dictionary/types').TransformedToken} token
 */
export const isBase = (token) =>
  !isColor(token) && !isTypography(token) && !CSS_EXCLUDED.has(token.path.join('.'));

/**
 * O valor JÁ RESOLVIDO e transformado de um token.
 *
 * Os tokens são DTCG, então o valor mora em `$value`. Existe também `value`
 * (formato legado do Style Dictionary) e ele fica `undefined` num arquivo DTCG —
 * ler o campo errado não dá erro, só produz `undefined` silencioso CSS afora.
 * Todo consumidor passa por aqui para que esse erro seja impossível de cometer.
 *
 * @param {import('style-dictionary/types').TransformedToken} token
 */
export function valueOf(token) {
  const value = token.$value ?? token.value;
  if (value === undefined) {
    throw new Error(`Token "${token.path.join('.')}" resolveu para undefined.`);
  }
  return value;
}

/**
 * O valor ORIGINAL, antes da resolução de referências.
 * É `'{palette.brand.600}'` onde o resolvido seria `'#6a2fe3'`. O emissor do
 * Figma depende disso para criar alias entre variáveis em vez de duplicar hex.
 *
 * @param {import('style-dictionary/types').TransformedToken} token
 */
export const originalValueOf = (token) => token.original?.$value ?? token.original?.value;

/** @param {import('style-dictionary/types').TransformedToken} token */
export const typeOf = (token) => token.$type ?? token.type;

/** @param {import('style-dictionary/types').TransformedToken} token */
export const descriptionOf = (token) => token.$description ?? token.description ?? '';

/**
 * @typedef {object} Build
 * @property {string} brand
 * @property {string} theme
 * @property {import('style-dictionary/types').TransformedToken[]} tokens todos os tokens, já transformados
 * @property {(token: import('style-dictionary/types').TransformedToken) => string} declaration `  --nome: valor;`
 */

/**
 * Carrega a matriz inteira (marca × tema).
 *
 * Todo script do pacote precisa da matriz completa, e não de um build solto:
 * mesmo o que só olha uma marca precisa comparar temas. Centralizar o laço aqui
 * garante que todos vejam exatamente o mesmo conjunto — um script que montasse a
 * sua própria matriz poderia, por exemplo, esquecer um tema e aprovar o que os
 * outros reprovam.
 *
 * @param {string[]} brands
 * @param {readonly string[]} themes
 * @returns {Promise<Map<string, Build>>}
 */
export async function loadMatrix(brands, themes) {
  /** @type {Map<string, Build>} */
  const builds = new Map();

  for (const brand of brands) {
    for (const theme of themes) {
      builds.set(buildKey(brand, theme), await loadBuild({ brand, theme }));
    }
  }

  return builds;
}

/**
 * O rótulo humano de cada marca, lido do próprio token `brand.name`.
 *
 * O rótulo não vem do nome da pasta porque a pasta é um identificador (`santo`)
 * e o rótulo é conteúdo editorial (`Santo`) — no Figma ele vira o nome do modo,
 * que os designers leem.
 *
 * @param {Map<string, Build>} builds
 * @param {string[]} brands
 * @param {readonly string[]} themes
 * @returns {Record<string, string>}
 */
export function brandLabelsOf(builds, brands, themes) {
  return Object.fromEntries(
    brands.map((brand) => {
      const build = buildFor(builds, brand, themes[0]);
      const token = build.tokens.find((candidate) => candidate.path.join('.') === 'brand.name');
      return [brand, token ? String(valueOf(token)) : brand];
    }),
  );
}

/**
 * A chave de um build dentro da matriz (marca × tema).
 * Existe como função para que a forma da chave seja escrita uma vez só — quem
 * monta a matriz e quem a consulta não podem discordar sobre o separador.
 *
 * @param {string} brand
 * @param {string} theme
 */
export const buildKey = (brand, theme) => `${brand}:${theme}`;

/**
 * Busca um build na matriz, ou explode.
 *
 * A matriz é sempre preenchida por um laço completo sobre marcas × temas, então
 * chave ausente nunca é dado faltando: é erro de programação. O `undefined` que
 * o `Map` devolveria não pararia nada — viajaria calado até virar `undefined`
 * escrito no CSS, que é onde ninguém procura a causa.
 *
 * @param {Map<string, Build>} builds
 * @param {string} brand
 * @param {string} theme
 * @returns {Build}
 */
export function buildFor(builds, brand, theme) {
  const build = builds.get(buildKey(brand, theme));
  if (!build) {
    throw new Error(
      `Build ausente para a marca "${brand}" no tema "${theme}".\n` +
        `Chaves disponíveis: ${[...builds.keys()].join(', ') || '(nenhuma)'}`,
    );
  }
  return build;
}

/**
 * Monta e resolve um build (marca, tema).
 *
 * `outputReferences` fica ligado: é o que faz a camada semântica sair como
 * `var(--santo-palette-brand-600)` em vez do hex resolvido. Sem isso, trocar de
 * tema exigiria reescrever todos os tokens de cor em vez de reapontar a paleta,
 * e a promessa de re-tematização por troca de marca deixaria de existir.
 *
 * @param {{ brand: string, theme: string }} target
 * @returns {Promise<Build>}
 */
export async function loadBuild({ brand, theme }) {
  const source = await sourceFilesFor({ brand, theme });

  const sd = new StyleDictionary(
    {
      source,
      // O build compõe os arquivos por conta própria; o Style Dictionary aqui é
      // só o resolvedor de referências e o aplicador de transforms.
      platforms: {
        [PLATFORM]: { transforms: TRANSFORMS, prefix: CSS_PREFIX, files: [] },
      },
      log: { verbosity: 'silent', warnings: 'disabled' },
    },
    { verbosity: 'silent', warnings: 'disabled' },
  );

  await sd.hasInitialized;
  const dictionary = await sd.getPlatformTokens(PLATFORM);

  const format = createPropertyFormatter({
    dictionary,
    outputReferences: true,
    format: 'css',
    // Sem isto o formatador procura `token.value` (formato legado) num token
    // DTCG e escreve `undefined` em toda declaração, sem reclamar.
    usesDtcg: sd.usesDtcg,
    formatting: { indentation: '  ' },
  });

  return {
    brand,
    theme,
    tokens: dictionary.allTokens,
    declaration: (token) => format(token),
  };
}
