/**
 * Emissores de tokens do SantoDS.
 *
 * Modulo puro: sem acesso a disco, sem dependencia de Node. Roda igual no
 * `scripts/build-tokens.mjs` e no browser (o Studio usa isto para o preview ao
 * vivo), o que garante que o que voce ve no editor e exatamente o que vai
 * para o arquivo gerado.
 *
 * Um "doc" e um objeto no formato de tokens/santods.figma.json:
 *   { meta, collections: { <nome>: { modes, defaultMode, variables } }, textStyles, effectStyles }
 */

export const BANNER = `/* GERADO POR scripts/build-tokens.mjs A PARTIR DE tokens/santods.figma.json.
   Nao edite este arquivo. Rode \`npm run tokens\` depois de sincronizar com o Figma. */`;

/* ---------------------------------------------------------------- basicos */

export const isAlias = (v) => typeof v === 'string' && v.startsWith('{') && v.endsWith('}');
export const aliasTarget = (v) => v.slice(1, -1);
export const varNameOf = (path, prefix) => `--${prefix}-${path.replace(/\//g, '-')}`;

/** Indice plano nome -> metadados, na ordem em que aparecem no doc. */
export function buildIndex(doc) {
  const index = new Map();
  for (const [collectionName, collection] of Object.entries(doc.collections)) {
    for (const [name, def] of Object.entries(collection.variables)) {
      index.set(name, {
        name,
        collection: collectionName,
        modes: collection.modes,
        defaultMode: collection.defaultMode,
        type: def.type,
        values: def.values ?? { [collection.defaultMode]: def.value },
        scopes: def.scopes ?? [],
        description: def.description ?? '',
      });
    }
  }
  return index;
}

/** Segue a cadeia de aliases ate o valor concreto, respeitando o modo pedido. */
export function resolveValue(index, value, mode, seen = new Set()) {
  if (!isAlias(value)) return value;
  const target = aliasTarget(value);
  if (seen.has(target)) throw new Error(`Ciclo de alias em ${target}`);
  seen.add(target);
  const entry = index.get(target);
  if (!entry) throw new Error(`Alias aponta para variavel inexistente: ${target}`);
  const next = mode in entry.values ? entry.values[mode] : entry.values[entry.defaultMode];
  return resolveValue(index, next, mode, seen);
}

const quoteFamily = (family) => (/\s/.test(family) ? `"${family}"` : family);

/**
 * Converte o valor cru do Figma na string CSS correspondente.
 * As regras de unidade sao derivadas do caminho do token, nao do tipo.
 */
export function toCss(name, type, value, prefix) {
  if (isAlias(value)) return `var(${varNameOf(aliasTarget(value), prefix)})`;
  if (type === 'COLOR') return value;
  if (type === 'STRING') {
    if (name.startsWith('brand/family/')) return quoteFamily(value);
    if (name === 'brand/id' || name === 'brand/name') return `"${value}"`;
    return value; // curvas de easing
  }
  if (name.startsWith('type/weight/')) return String(value);
  if (name.startsWith('type/tracking/')) return `${value / 100}em`;
  if (name.startsWith('motion/duration/')) return `${value}ms`;
  if (name.startsWith('layer/')) return String(value);
  return `${value}px`;
}

/** Unidade legivel de um token, para rotular controles no editor. */
export function unitOf(name, type) {
  if (type !== 'FLOAT') return '';
  if (name.startsWith('type/weight/') || name.startsWith('layer/')) return '';
  if (name.startsWith('type/tracking/')) return '%';
  if (name.startsWith('motion/duration/')) return 'ms';
  return 'px';
}

export function shadowCss(effects) {
  if (!effects || effects.length === 0) return 'none';
  return effects
    .map((e) => `${e.type === 'INNER_SHADOW' ? 'inset ' : ''}${e.x}px ${e.y}px ${e.blur}px ${e.spread}px ${e.color}`)
    .join(', ');
}

/**
 * Pilha de fonte.
 *
 * A familia vem direto do token `brand/family/*`, pelo nome real. E por isso que
 * a tipografia chega do Google Fonts em vez do `next/font`: o `next/font` gera um
 * nome de familia hasheado, que nunca casaria com o nome guardado no token — e o
 * token viraria decoracao. Assim, uma marca trocar a fonte e so mudar o token.
 */
export function fontStacks(prefix) {
  return {
    sans: `var(${varNameOf('brand/family/sans', prefix)}), ui-sans-serif, system-ui, -apple-system, sans-serif`,
    mono: `var(${varNameOf('brand/family/mono', prefix)}), ui-monospace, SFMono-Regular, Menlo, monospace`,
  };
}

/** Mapa valor-de-tracking -> nome do token, para reusar o token no text style. */
export function trackingByPercent(index) {
  return new Map(
    [...index.values()]
      .filter((v) => v.name.startsWith('type/tracking/'))
      .map((v) => [v.values[v.defaultMode], v.name]),
  );
}

export function textStyleClass(figmaName, prefix) {
  const parts = figmaName.split('/');
  return `${prefix}-${parts[1]}-${parts[2]}`;
}

const MODELESS = ['Palette', 'Primitives', 'Brand', 'Semantic'];

/* ----------------------------------------------- declaracoes de variaveis */

/**
 * Todas as declaracoes `--santo-x: y` de um doc, em ordem.
 * `mode` escolhe o modo da colecao Color; as demais usam o modo padrao.
 * Retorna [{ name, varName, value }] — util tanto para CSS quanto para o preview.
 */
export function declarations(doc, mode = 'Light') {
  const prefix = doc.meta.cssPrefix;
  const index = buildIndex(doc);
  const out = [];
  for (const v of index.values()) {
    const raw = v.values[mode] ?? v.values[v.defaultMode];
    out.push({ name: v.name, varName: varNameOf(v.name, prefix), value: toCss(v.name, v.type, raw, prefix) });
  }
  for (const [name, def] of Object.entries(doc.effectStyles)) {
    out.push({ name: `shadow/${name}`, varName: `--${prefix}-shadow-${name}`, value: shadowCss(def.effects) });
  }
  const stacks = fontStacks(prefix);
  out.push({ name: 'font/sans', varName: `--${prefix}-font-sans`, value: stacks.sans });
  out.push({ name: 'font/mono', varName: `--${prefix}-font-mono`, value: stacks.mono });
  return out;
}

/** So os tokens que mudam entre Light e Dark (a colecao Color). */
export function colorDeclarations(doc, mode) {
  const prefix = doc.meta.cssPrefix;
  const collection = doc.collections.Color;
  if (!collection) return [];
  return Object.entries(collection.variables).map(([name, def]) => {
    const values = def.values ?? { [collection.defaultMode]: def.value };
    return {
      name,
      varName: varNameOf(name, prefix),
      value: toCss(name, def.type, values[mode] ?? values[collection.defaultMode], prefix),
    };
  });
}

/* ------------------------------------------------------------- tokens.css */

export function emitTokensCss(doc, { banner = BANNER, selector = ':root' } = {}) {
  const prefix = doc.meta.cssPrefix;
  const index = buildIndex(doc);
  const line = (d, indent) => `${indent}${d.varName}: ${d.value};`;

  const sections = MODELESS.filter((c) => doc.collections[c]).map((c) => {
    const entries = [...index.values()].filter((v) => v.collection === c);
    const rows = entries.map((v) => {
      const raw = v.values[v.defaultMode];
      return `  ${varNameOf(v.name, prefix)}: ${toCss(v.name, v.type, raw, prefix)};`;
    });
    return `  /* ${c} (${entries.length}) */\n${rows.join('\n')}`;
  });

  const light = colorDeclarations(doc, 'Light');
  const dark = colorDeclarations(doc, 'Dark');
  const shadows = Object.entries(doc.effectStyles).map(
    ([name, def]) => `  --${prefix}-shadow-${name}: ${shadowCss(def.effects)};`,
  );
  const stacks = fontStacks(prefix);

  return `${banner}

${selector} {
${sections.join('\n\n')}

  /* Color — modo Light (${light.length}) */
${light.map((d) => line(d, '  ')).join('\n')}

  /* Effect styles (${shadows.length}) */
${shadows.join('\n')}

  /* Pilhas de fonte derivadas de brand/family/* */
  --${prefix}-font-sans: ${stacks.sans};
  --${prefix}-font-mono: ${stacks.mono};

  color-scheme: light dark;
}

/* Color — modo Dark. Segue o sistema, a menos que o tema claro esteja fixado. */
@media (prefers-color-scheme: dark) {
  ${selector}:not([data-theme='light']) {
${dark.map((d) => line(d, '    ')).join('\n')}
  }
}

/* Color — modo Dark fixado explicitamente. */
${selector}[data-theme='dark'] {
${dark.map((d) => line(d, '  ')).join('\n')}
}
`;
}

/* --------------------------------------------------------- typography.css */

export function emitTypographyCss(doc, { banner = BANNER } = {}) {
  const prefix = doc.meta.cssPrefix;
  const index = buildIndex(doc);
  const tracking = trackingByPercent(index);

  /**
   * Prefere a variavel da fundacao; cai no valor literal quando o tamanho
   * escolhido nao existe como degrau. E o que permite edicao livre sem inventar
   * um `var(--santo-type-size-81)` que ninguem definiu.
   */
  const ref = (token, literal) =>
    index.get(token) ? `var(${varNameOf(token, prefix)})` : `${literal}px`;

  const rules = Object.entries(doc.textStyles).map(([figmaName, s]) => {
    const stack = s.boundVariables.fontFamily === 'brand/family/mono' ? 'mono' : 'sans';
    const token = tracking.get(s.letterSpacing.value);
    const ls = token ? `var(${varNameOf(token, prefix)})` : `${s.letterSpacing.value / 100}em`;
    return `/* ${figmaName} */
.${textStyleClass(figmaName, prefix)} {
  font-family: var(--${prefix}-font-${stack});
  font-size: ${ref(s.boundVariables.fontSize, s.fontSize)};
  line-height: ${ref(s.boundVariables.lineHeight, s.lineHeight.value ?? s.fontSize)};
  letter-spacing: ${ls};
  font-weight: var(${varNameOf(s.boundVariables.fontWeight, prefix)});
}`;
  });

  return `${banner}

/* Uma classe por text style do Figma — ${rules.length} no total. */

${rules.join('\n\n')}
`;
}

/* -------------------------------------------------------------- theme.css */

/** color/bg/* perde o segmento bg; as outras familias mantem o prefixo. */
export function colorUtility(name) {
  const path = name.replace(/^color\//, '');
  return path.startsWith('bg/') ? path.slice(3) : path;
}

export function emitThemeCss(doc, { banner = BANNER } = {}) {
  const prefix = doc.meta.cssPrefix;
  const index = buildIndex(doc);
  const tracking = trackingByPercent(index);
  const v = (name) => `var(${varNameOf(name, prefix)})`;
  const all = [...index.values()];
  const inCollection = (c) => all.filter((x) => x.collection === c);
  const startsWith = (p) => all.filter((x) => x.name.startsWith(p));
  const leaf = (name, i = 2) => name.split('/')[i];

  const colors = [
    ...inCollection('Color').map((x) => `  --color-${colorUtility(x.name).replace(/\//g, '-')}: ${v(x.name)};`),
    ...inCollection('Palette').map((x) => `  --color-${x.name.replace(/\//g, '-')}: ${v(x.name)};`),
  ];
  const semantic = (p) => inCollection('Semantic').filter((x) => x.name.startsWith(`${p}/`));
  const spacing = semantic('space').map((x) => `  --spacing-${leaf(x.name, 1)}: ${v(x.name)};`);
  const radius = semantic('radius').map((x) => `  --radius-${leaf(x.name, 1)}: ${v(x.name)};`);
  const weights = startsWith('type/weight/').map((x) => `  --font-weight-${leaf(x.name)}: ${v(x.name)};`);
  const trackingRows = startsWith('type/tracking/').map((x) => `  --tracking-${leaf(x.name)}: ${v(x.name)};`);
  const leading = startsWith('type/leading/').map((x) => `  --leading-${leaf(x.name)}: ${v(x.name)};`);
  const easing = startsWith('motion/easing/').map((x) => `  --ease-${leaf(x.name)}: ${v(x.name)};`);
  const shadows = Object.keys(doc.effectStyles).map((n) => `  --shadow-${n}: var(--${prefix}-shadow-${n});`);

  const seen = new Set();
  const text = [];
  for (const [figmaName, s] of Object.entries(doc.textStyles)) {
    const role = figmaName.split('/')[1];
    if (seen.has(role)) continue;
    seen.add(role);
    const token = tracking.get(s.letterSpacing.value);
    text.push(
      `  --text-${role}: ${v(s.boundVariables.fontSize)};
  --text-${role}--line-height: ${v(s.boundVariables.lineHeight)};
  --text-${role}--letter-spacing: ${token ? v(token) : `${s.letterSpacing.value / 100}em`};`,
    );
  }

  return `${banner}

/* @theme inline: os utilitarios apontam para as variaveis --${prefix}-*, entao
   trocar de tema em runtime (data-theme / prefers-color-scheme) funciona. */
@theme inline {
  --font-sans: var(--${prefix}-font-sans);
  --font-mono: var(--${prefix}-font-mono);

  /* Cores semanticas — color/bg/* perde o segmento "bg" (bg-brand-solid-default),
     as demais familias mantem o prefixo (text-text-primary, border-border-subtle). */
${colors.join('\n')}

  /* Espacamento semantico: p-md, gap-lg, mt-2xl.
     A escala numerica do Tailwind (p-4 = 1rem) fica intacta de proposito. */
${spacing.join('\n')}

${radius.join('\n')}

${weights.join('\n')}

${trackingRows.join('\n')}

${leading.join('\n')}

${easing.join('\n')}

${shadows.join('\n')}

  /* Papeis de texto: text-heading-1, text-body, text-code-md. */
${text.join('\n')}
}
`;
}

/* --------------------------------------------------------------- index.ts */

export function emitIndexTs(doc) {
  const prefix = doc.meta.cssPrefix;
  const index = buildIndex(doc);
  const tracking = trackingByPercent(index);
  const all = [...index.values()];
  const lit = (x) => JSON.stringify(x);
  const record = (name, pairs, valueType = 'string') =>
    `export const ${name} = {\n${pairs.map(([k, val]) => `  ${lit(k)}: ${lit(val)},`).join('\n')}\n} as const satisfies Record<string, ${valueType}>;`;

  const colorEntries = all.filter((x) => x.collection === 'Color');
  const resolvedCss = (x, mode) => toCss(x.name, x.type, resolveValue(index, x.values[mode] ?? x.values[x.defaultMode], mode), prefix);

  const refPairs = all.map((x) => [x.name, `var(${varNameOf(x.name, prefix)})`]);
  const resolvedPairs = all.filter((x) => x.collection !== 'Color').map((x) => [x.name, resolvedCss(x, x.defaultMode)]);
  const lightPairs = colorEntries.map((x) => [x.name, resolvedCss(x, 'Light')]);
  const darkPairs = colorEntries.map((x) => [x.name, resolvedCss(x, 'Dark')]);

  const textStylePairs = Object.entries(doc.textStyles).map(([figmaName, s]) => {
    const stack = s.boundVariables.fontFamily === 'brand/family/mono' ? 'mono' : 'sans';
    const token = tracking.get(s.letterSpacing.value);
    return [
      figmaName,
      {
        className: textStyleClass(figmaName, prefix),
        fontFamily: `var(--${prefix}-font-${stack})`,
        fontSize: `var(${varNameOf(s.boundVariables.fontSize, prefix)})`,
        lineHeight: `var(${varNameOf(s.boundVariables.lineHeight, prefix)})`,
        letterSpacing: token ? `var(${varNameOf(token, prefix)})` : `${s.letterSpacing.value / 100}em`,
        fontWeight: `var(${varNameOf(s.boundVariables.fontWeight, prefix)})`,
      },
    ];
  });

  const shadowPairs = Object.entries(doc.effectStyles).map(([n, def]) => [n, shadowCss(def.effects)]);

  return `// GERADO POR scripts/build-tokens.mjs A PARTIR DE tokens/santods.figma.json.
// Nao edite este arquivo. Rode \`npm run tokens\` depois de sincronizar com o Figma.

/** Metadados do arquivo Figma que originou estes tokens. */
export const figmaSource = ${JSON.stringify({ fileKey: doc.meta.fileKey, fileName: doc.meta.fileName, cssPrefix: prefix }, null, 2)} as const;

/** Referencia \`var(--${prefix}-*)\` de cada uma das ${index.size} variaveis do Figma. */
${record('token', refPairs)}

export type TokenName = keyof typeof token;

/** Nome da custom property CSS de um token. */
export function cssVarName(name: TokenName): string {
  return \`--${prefix}-\${name.replace(/\\//g, '-')}\`;
}

/** Valores concretos das colecoes sem modo (Palette, Primitives, Brand, Semantic). */
${record('resolved', resolvedPairs)}

/** Colecao Color resolvida no modo Light. */
${record('colorLight', lightPairs)}

/** Colecao Color resolvida no modo Dark. */
${record('colorDark', darkPairs)}

export type ColorToken = keyof typeof colorLight;
export type ThemeMode = 'Light' | 'Dark';

/** Valor concreto de um token de cor no modo pedido. */
export function colorValue(name: ColorToken, mode: ThemeMode = 'Light'): string {
  return mode === 'Dark' ? colorDark[name] : colorLight[name];
}

/** Os ${textStylePairs.length} text styles do Figma, como classe CSS + propriedades inline. */
export const textStyles = ${JSON.stringify(Object.fromEntries(textStylePairs), null, 2)} as const;

export type TextStyleName = keyof typeof textStyles;

/** Sombras dos effect styles, prontas para \`box-shadow\`. */
${record('shadows', shadowPairs)}

export type ShadowName = keyof typeof shadows;

/** Colecoes e modos, espelhando a estrutura do Figma. */
export const collections = ${JSON.stringify(
    Object.fromEntries(
      Object.entries(doc.collections).map(([name, c]) => [
        name,
        { modes: c.modes, defaultMode: c.defaultMode, count: Object.keys(c.variables).length },
      ]),
    ),
    null,
    2,
  )} as const;
`;
}
