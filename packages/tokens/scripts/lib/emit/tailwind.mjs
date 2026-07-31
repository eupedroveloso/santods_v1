/**
 * Emissor da camada Tailwind 4.
 *
 * ─── O problema que este arquivo resolve ────────────────────────────────────
 *
 * O Tailwind 4 tem UM namespace de cor, `--color-*`, e dele saem `bg-`, `text-`,
 * `border-`, `fill-`, `ring-` e companhia. O Santo, como qualquer design system
 * sério, separa cor por papel: `color.bg.*`, `color.text.*`, `color.border.*`,
 * `color.icon.*`, `color.surface.*`. Os dois modelos não casam 1 para 1.
 *
 * Copiar o caminho inteiro produziria `bg-bg-brand-solid-default`. Descartar a
 * categoria produziria colisão real — `color.bg.disabled`, `color.text.disabled`,
 * `color.border.disabled` e `color.icon.disabled` viram todos `disabled`, com
 * valores diferentes, e o último a ser emitido venceria em silêncio.
 *
 * ─── A convenção adotada ────────────────────────────────────────────────────
 *
 * Uma tabela de renomeação de categoria, aplicada mecanicamente:
 *
 *   color.bg.*       →  (elidida)   bg-brand-solid-default
 *   color.surface.*  →  surface     bg-surface-page
 *   color.text.*     →  fg          text-fg-primary
 *   color.icon.*     →  icon        text-icon-brand, fill-icon-brand
 *   color.border.*   →  line        border-line-subtle
 *
 * `bg` é elidida porque o prefixo do utilitário Tailwind já a recompõe; as
 * outras são mantidas com nome curto para não gerar `border-border-subtle`.
 *
 * ─── Por que isso é seguro ──────────────────────────────────────────────────
 *
 * Como `bg` é a única família sem prefixo, ela é a única que poderia colidir com
 * outra — e só colidiria se alguém criasse `color.bg.fg.*` ou `color.bg.line.*`.
 * Em vez de confiar que ninguém vai fazer isso, `assertUnique` quebra o build no
 * instante em que duas chaves do Tailwind coincidirem. A convenção é uma escolha;
 * a ausência de colisão é verificada.
 *
 * ─── Por que `@theme inline` e não `@theme` ─────────────────────────────────
 *
 * Os valores aqui são `var(--santo-*)`, e essas variáveis MUDAM em tempo de
 * execução quando o tema troca. Com `@theme`, o Tailwind congelaria o valor no
 * momento do build e o modo escuro pararia de funcionar nos utilitários. Com
 * `@theme inline`, ele emite a referência à variável. A palavra `inline` é o que
 * mantém a troca de tema viva.
 */

import { isColor, isTypography, valueOf } from '../dictionary.mjs';
import { toCssVarName, toCssVarRef } from '../naming.mjs';

/**
 * Renomeação de categoria de cor. `null` significa "elidir o segmento";
 * `undefined` (categoria ausente da tabela) é o que faz `colorEntries` quebrar
 * o build em vez de inventar um nome para uma família de cor que ninguém
 * decidiu como expor.
 *
 * @type {Record<string, string | null | undefined>}
 */
const COLOR_CATEGORIES = {
  bg: null,
  surface: 'surface',
  text: 'fg',
  icon: 'icon',
  border: 'line',
};

/**
 * Namespaces não-cromáticos: de qual raiz de token saem e sob qual namespace do
 * Tailwind entram. A ordem é a ordem de saída no arquivo.
 *
 * @type {Array<{ namespace: string, from: string[], label: string }>}
 */
const NAMESPACES = [
  { namespace: 'spacing', from: ['space'], label: 'Espaçamento — p-md, gap-lg, m-xl' },
  { namespace: 'radius', from: ['radius'], label: 'Raio — rounded-md' },
  { namespace: 'shadow', from: ['elevation'], label: 'Elevação — shadow-md' },
  { namespace: 'font', from: ['brand', 'family'], label: 'Famílias — font-sans, font-display' },
  { namespace: 'font-weight', from: ['type', 'weight'], label: 'Pesos — font-medium' },
  { namespace: 'leading', from: ['type', 'leading'], label: 'Entrelinha — leading-24' },
  { namespace: 'tracking', from: ['type', 'tracking'], label: 'Tracking — tracking-tight' },
  { namespace: 'container', from: ['dimension', 'container'], label: 'Larguras — max-w-lg' },
  { namespace: 'duration', from: ['motion', 'duration'], label: 'Duração — duration-fast' },
  { namespace: 'ease', from: ['motion', 'easing'], label: 'Curvas — ease-standard' },
];

/**
 * Sub-propriedades de tipografia que o Tailwind aceita como modificadores de um
 * `--text-*`. `fontFamily` fica de fora porque o namespace `--text-*` não a
 * carrega — para o estilo completo existe a classe utilitária do CSS base.
 */
const TEXT_MODIFIERS = {
  fontSize: '',
  lineHeight: '--line-height',
  letterSpacing: '--letter-spacing',
  fontWeight: '--font-weight',
};

/**
 * Quebra o build se duas entradas quiserem a mesma chave.
 * @param {Array<{ key: string, source: string }>} entries
 */
function assertUnique(entries) {
  const seen = new Map();
  const clashes = [];

  for (const entry of entries) {
    const previous = seen.get(entry.key);
    if (previous) clashes.push(`  ${entry.key}\n    ← ${previous}\n    ← ${entry.source}`);
    else seen.set(entry.key, entry.source);
  }

  if (clashes.length) {
    throw new Error(
      `Colisão de nomes na camada Tailwind — dois tokens disputam a mesma chave:\n\n${clashes.join(
        '\n\n',
      )}\n\n` +
        `Renomeie um dos tokens ou ajuste COLOR_CATEGORIES em scripts/lib/emit/tailwind.mjs.`,
    );
  }
}

/** @param {import('../dictionary.mjs').Build} build */
function colorEntries(build) {
  const entries = [];

  for (const token of build.tokens.filter(isColor)) {
    const [, category, ...rest] = token.path;
    const renamed = COLOR_CATEGORIES[category];

    if (renamed === undefined) {
      throw new Error(
        `Categoria de cor desconhecida "${category}" em "${token.path.join('.')}".\n` +
          `Adicione-a a COLOR_CATEGORIES em scripts/lib/emit/tailwind.mjs para decidir ` +
          `como ela aparece nos utilitários do Tailwind.`,
      );
    }

    const segments = renamed === null ? rest : [renamed, ...rest];

    entries.push({
      key: `--color-${segments.join('-')}`,
      value: toCssVarRef(token.path),
      source: token.path.join('.'),
    });
  }

  return entries;
}

/** @param {import('../dictionary.mjs').Build} build */
function typographyEntries(build) {
  const entries = [];

  for (const token of build.tokens.filter(isTypography)) {
    const name = token.path.slice(1).join('-');
    const resolved = valueOf(token);

    for (const [property, suffix] of Object.entries(TEXT_MODIFIERS)) {
      if (!(property in resolved)) continue;

      const kebab = property.replace(/([a-z0-9])([A-Z])/g, '$1-$2').toLowerCase();
      entries.push({
        key: `--text-${name}${suffix}`,
        value: `var(${toCssVarName([...token.path, kebab])})`,
        source: `${token.path.join('.')}.${property}`,
      });
    }
  }

  return entries;
}

/**
 * @param {import('../dictionary.mjs').Build} build
 * @param {{ namespace: string, from: string[] }} spec
 */
function namespaceEntries(build, { namespace, from }) {
  return build.tokens
    .filter((token) => from.every((segment, index) => token.path[index] === segment))
    .map((token) => ({
      key: `--${namespace}-${token.path.slice(from.length).join('-')}`,
      value: toCssVarRef(token.path),
      source: token.path.join('.'),
    }));
}

/** @param {Array<{ key: string, value: string }>} entries */
const declare = (entries) => entries.map((entry) => `  ${entry.key}: ${entry.value};`);

/**
 * @param {object} input
 * @param {string} input.brand
 * @param {import('../dictionary.mjs').Build} input.light
 * @param {string} input.header
 * @returns {string}
 */
export function emitTailwind({ brand, light, header }) {
  const groups = [
    { label: 'Cor semântica — muda com o tema em tempo de execução', entries: colorEntries(light) },
    ...NAMESPACES.map((spec) => ({
      label: spec.label,
      entries: namespaceEntries(light, spec),
    })),
    {
      label: 'Tipografia — text-body-md carrega tamanho, entrelinha, tracking e peso',
      entries: typographyEntries(light),
    },
  ].filter((group) => group.entries.length > 0);

  assertUnique(groups.flatMap((group) => group.entries));

  const body = groups
    .map((group) => [`  /* ${group.label} */`, ...declare(group.entries)].join('\n'))
    .join('\n\n');

  return [header, '', `@import '../css/${brand}.css';`, '', '@theme inline {', body, '}', ''].join(
    '\n',
  );
}
