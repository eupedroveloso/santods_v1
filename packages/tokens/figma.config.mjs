/**
 * Mapa entre a árvore de tokens e a estrutura do arquivo Figma.
 *
 * Cada raiz de token cai em exatamente uma coleção do Figma. É esse mapa que
 * decide o que vira Variable, o que vira Text Style e o que vira Effect Style —
 * e é ele que os scripts de push/pull/check consultam. Alterar aqui muda os
 * dois ambientes de uma vez; é esse o ponto.
 *
 * Sobre MODOS: no Figma, "modo" é usado para duas coisas diferentes no Santo.
 *   - Em `Palette` e `Brand`, cada modo é uma MARCA (Santo, Produto A, ...).
 *   - Em `Color`, cada modo é um TEMA (Light, Dark).
 * Um frame herda os dois. Trocar a marca no painel de um frame re-tematiza tudo,
 * porque a camada semântica só faz alias para `palette/*`, nunca para hex.
 *
 * Limite de plano do Figma: Starter permite 1 modo por coleção, Professional 4 e
 * Organization/Enterprise 40. Com mais de 4 marcas em Professional, divida as
 * marcas em arquivos de biblioteca separados em vez de modos.
 */

/** @typedef {{ name: string, modesFrom: 'brand' | 'theme' | 'none', roots: string[], description: string }} FigmaCollection */

/** @type {FigmaCollection[]} */
export const COLLECTIONS = [
  {
    name: 'Palette',
    modesFrom: 'brand',
    roots: ['palette'],
    description: 'Rampas cromáticas cruas. Um modo por marca. Nunca usar direto em um layer.',
  },
  {
    name: 'Brand',
    modesFrom: 'brand',
    roots: ['brand'],
    description: 'Tipografia e forma da marca. Um modo por marca.',
  },
  {
    name: 'Primitives',
    modesFrom: 'none',
    roots: ['dimension', 'type', 'motion', 'layer'],
    description: 'Escalas invariantes. Iguais em toda marca e em todo tema.',
  },
  {
    name: 'Color',
    modesFrom: 'theme',
    roots: ['color'],
    description: 'Cor semântica. Modos Light e Dark. É esta a coleção que os layers consomem.',
  },
  {
    name: 'Semantic',
    modesFrom: 'none',
    roots: ['space', 'radius', 'border', 'focus'],
    description:
      'Espaçamento, raio e borda semânticos. É esta a coleção que o Auto Layout consome.',
  },
];

/** Raízes que viram Text Styles em vez de Variables (o Figma não tem variável composta de texto). */
export const TEXT_STYLE_ROOTS = ['typography'];

/** Raízes que viram Effect Styles. */
export const EFFECT_STYLE_ROOTS = ['elevation'];

/** Temas da coleção `Color`, na ordem em que aparecem no Figma. */
export const THEMES = ['light', 'dark'];

/** Rótulo exibido no Figma para cada tema. */
export const THEME_LABELS = { light: 'Light', dark: 'Dark' };

/** @param {string} root */
export function collectionForRoot(root) {
  return COLLECTIONS.find((collection) => collection.roots.includes(root)) ?? null;
}

/** @param {string} root */
export function isStyleRoot(root) {
  return TEXT_STYLE_ROOTS.includes(root) || EFFECT_STYLE_ROOTS.includes(root);
}
