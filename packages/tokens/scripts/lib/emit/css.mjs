/**
 * Emissor de CSS — o artefato que a maioria dos consumidores vai importar.
 *
 * A ORDEM DOS BLOCOS NÃO É ARBITRÁRIA. Custom properties de cor competem entre
 * si por cascata, e a regra que o sistema promete é: a escolha explícita do
 * usuário ganha da preferência do sistema operacional. Isso exige exatamente
 * esta sequência:
 *
 *   1. `:root`                          base invariante (primitivas, marca, espaço)
 *   2. `:root, [data-theme='light']`    tema claro — o padrão
 *   3. `@media (prefers-color-scheme: dark) :root:not([data-theme='light'])`
 *   4. `[data-theme='dark']`            opt-in explícito
 *
 * O bloco 3 tem especificidade 0,2,0 e o 4 tem 0,1,0 — o 4 nunca "ganha" do 3
 * por especificidade, mas também nunca precisa: quando os dois casam, os valores
 * são idênticos. O que importa é o par (2, 4), que empata em 0,1,0 e se resolve
 * por ordem de origem. Trocar 2 e 4 de lugar quebraria o modo escuro explícito
 * em máquinas configuradas no claro — e quebraria em silêncio.
 *
 * O `:not([data-theme='light'])` do bloco 3 é o que permite forçar o tema claro
 * num sistema escuro. Sem ele, `data-theme="light"` seria ignorado à noite.
 */

import { isBase, isColor, isTypography, originalValueOf, valueOf } from '../dictionary.mjs';
import { referencedPath, toCssVarName, toCssVarRef, fromTokenPath } from '../naming.mjs';

/**
 * Larguras de comentário-régua, só para o arquivo ficar legível.
 * @param {string} label
 */
const rule = (label) =>
  `/* ${'─'.repeat(2)} ${label} ${'─'.repeat(Math.max(2, 68 - label.length))} */`;

/**
 * camelCase → kebab-case. `fontFamily` → `font-family`.
 * @param {string} name
 */
const kebab = (name) => name.replace(/([a-z0-9])([A-Z])/g, '$1-$2').toLowerCase();

/**
 * Um sub-valor de tipografia vira `var(--santo-...)` quando é referência e o
 * literal transformado quando não é. Sem isto, `font-size` sairia com o px
 * resolvido e trocar a escala tipográfica da marca não surtiria efeito.
 *
 * @param {unknown} original valor antes da resolução
 * @param {unknown} resolved valor depois da resolução e dos transforms
 */
function subValue(original, resolved) {
  const reference = referencedPath(original);
  return reference ? toCssVarRef(fromTokenPath(reference)) : String(resolved);
}

/**
 * Tipografia composta → duas coisas.
 *
 * Primeiro um grupo de custom properties por sub-propriedade, porque o Figma
 * expõe cada eixo de um Text Style separadamente e um `font:` shorthand não
 * conseguiria carregar `letter-spacing` — o token sumiria na tradução.
 *
 * Depois uma classe utilitária por estilo, para o consumo do dia a dia. As duas
 * grafias derivam do mesmo caminho de token, então não há como divergirem.
 *
 * @param {import('../dictionary.mjs').Build} build
 */
function typographyBlocks(build) {
  const styles = build.tokens.filter(isTypography);

  const declarations = [];
  const classes = [];

  for (const token of styles) {
    const original = originalValueOf(token) ?? {};
    const resolved = valueOf(token);
    const properties = Object.keys(resolved);

    const varNames = properties.map((property) => ({
      property: kebab(property),
      name: toCssVarName([...token.path, kebab(property)]),
      value: subValue(original[property], resolved[property]),
    }));

    for (const entry of varNames) {
      declarations.push(`  ${entry.name}: ${entry.value};`);
    }

    const selector = `.${token.name}`;
    const body = varNames.map((entry) => `  ${entry.property}: var(${entry.name});`).join('\n');
    classes.push(`${selector} {\n${body}\n}`);
  }

  return { declarations, classes };
}

/** @param {import('../dictionary.mjs').Build} build */
const baseDeclarations = (build) =>
  build.tokens.filter(isBase).map((token) => build.declaration(token));

/** @param {import('../dictionary.mjs').Build} build */
const colorDeclarations = (build) =>
  build.tokens.filter(isColor).map((token) => build.declaration(token));

/**
 * Monta o CSS completo de uma marca.
 *
 * @param {object} input
 * @param {import('../dictionary.mjs').Build} input.light build (marca, 'light')
 * @param {import('../dictionary.mjs').Build} input.dark build (marca, 'dark')
 * @param {string} input.header cabeçalho já formatado como comentário
 * @returns {string}
 */
export function emitCss({ light, dark, header }) {
  const typography = typographyBlocks(light);

  const sections = [
    header,
    '',
    rule('Base · primitivas, marca, espaço, elevação'),
    [
      ':root {',
      '  color-scheme: light dark;',
      ...baseDeclarations(light),
      '',
      '  /* Tipografia composta — um eixo por custom property. */',
      ...typography.declarations,
      '}',
    ].join('\n'),
    '',
    rule('Cor · tema claro (padrão)'),
    [
      ":root,\n[data-theme='light'] {",
      '  color-scheme: light;',
      ...colorDeclarations(light),
      '}',
    ].join('\n'),
    '',
    rule('Cor · tema escuro (preferência do sistema)'),
    [
      '@media (prefers-color-scheme: dark) {',
      "  :root:not([data-theme='light']) {",
      '    color-scheme: dark;',
      ...colorDeclarations(dark).map((line) => `  ${line}`),
      '  }',
      '}',
    ].join('\n'),
    '',
    rule('Cor · tema escuro (escolha explícita)'),
    ["[data-theme='dark'] {", '  color-scheme: dark;', ...colorDeclarations(dark), '}'].join('\n'),
    '',
    rule('Classes utilitárias de tipografia'),
    typography.classes.join('\n\n'),
    '',
  ];

  return `${sections.join('\n')}\n`;
}
