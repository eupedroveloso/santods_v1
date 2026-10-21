/**
 * Emissores de tokens do SantoDS.
 *
 * Modulo puro: sem acesso a disco, sem dependencia de Node. Roda igual no
 * `scripts/build-tokens.mjs` e no browser, o que garante um unico caminho de
 * renderizacao para os tokens.
 *
 * Um "doc" e um objeto no formato de tokens/santods.figma.json:
 *   { meta, collections: { <nome>: { modes, defaultMode, variables } }, textStyles, effectStyles }
 */

export const BANNER = `/* GERADO POR scripts/build-tokens.mjs A PARTIR DE tokens/santods.figma.json.
   Nao edite este arquivo. Rode \`npm run tokens\` depois de sincronizar com o Figma. */`;

/* ---------------------------------------------------------------- basicos */

export const isAlias = (v) => typeof v === 'string' && v.startsWith('{') && v.endsWith('}');
export const aliasTarget = (v) => v.slice(1, -1);
/** Tracking em % do tamanho: primitivas type/tracking/* e o tracking por papel da marca. */
const isTracking = (name) => name.startsWith('type/tracking/') || /^brand\/type\/[^/]+\/tracking$/.test(name);

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
  if (isTracking(name)) return `${value / 100}em`;
  if (name.startsWith('motion/duration/')) return `${value}ms`;
  if (name.startsWith('layer/')) return String(value);
  if (name.endsWith('/enabled') || name.endsWith('/noise')) return String(value); // chave 0/1 e opacidade: sem unidade
  if (name.endsWith('/angle')) return `${value}deg`;
  return `${value}px`;
}

/** Unidade legivel de um token, para rotular controles no editor. */
export function unitOf(name, type) {
  if (type !== 'FLOAT') return '';
  if (name.startsWith('type/weight/') || name.startsWith('layer/') || name.endsWith('/enabled') || name.endsWith('/noise')) return '';
  if (name.endsWith('/angle')) return 'deg';
  if (isTracking(name)) return '%';
  if (name.startsWith('motion/duration/')) return 'ms';
  return 'px';
}

/**
 * `box-shadow` de um effect style. Com `prefix`, a camada cuja cor esta ligada a
 * uma variavel (`boundVariables.color`) sai como var(--<prefix>-...), para a
 * sombra trocar com a marca; sem `prefix`, sai sempre o valor literal.
 */
export function shadowCss(effects, prefix) {
  if (!effects || effects.length === 0) return 'none';
  return effects
    .map((e) => {
      // Campo ligado a variavel (cor, y, blur) sai como var(); sem prefix, sempre o literal.
      const ref = (key, literal) => (prefix && e.boundVariables?.[key] ? `var(${varNameOf(e.boundVariables[key], prefix)})` : literal);
      return `${e.type === 'INNER_SHADOW' ? 'inset ' : ''}${e.x}px ${ref('y', `${e.y}px`)} ${ref('blur', `${e.blur}px`)} ${e.spread}px ${ref('color', e.color)}`;
    })
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
    heading: `var(${varNameOf('brand/family/heading', prefix)}), ui-sans-serif, system-ui, -apple-system, sans-serif`,
  };
}

/** Pilha de fonte de um text style, pela familia a que ele esta ligado. */
export function stackOf(fontFamilyBinding) {
  if (fontFamilyBinding === 'brand/family/mono') return 'mono';
  if (fontFamilyBinding === 'brand/family/heading') return 'heading';
  return 'sans';
}

/** Declaracoes das pilhas de fonte. `heading` so existe quando a familia de titulo existe. */
function fontStackLines(index, prefix, indent) {
  const stacks = fontStacks(prefix);
  const names = index.has('brand/family/heading') ? ['sans', 'mono', 'heading'] : ['sans', 'mono'];
  return names.map((n) => `${indent}--${prefix}-font-${n}: ${stacks[n]};`).join('\n');
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

/** Papel de um text style (`Albert Sans/heading-1/light` -> `heading-1`). */
export const textRoleOf = (figmaName) => figmaName.split('/')[1];

/** Custom property da sombra de um effect style. */
export const shadowVarOf = (name, prefix) => `--${prefix}-shadow-${name}`;

/**
 * Variavel CSS de um effect style. Nome sem "/" (xs..2xl): --<prefix>-shadow-<nome>, como sempre.
 * Nome com grupo (glass/md, blur/sm, glow/brand): --<prefix>-<grupo>-<nome>.
 */
export const effectVarOf = (name, prefix) => (name.includes('/') ? `--${prefix}-${name.replace(/\//g, '-')}` : shadowVarOf(name, prefix));

const BLUR_TYPES = ['BACKGROUND_BLUR', 'LAYER_BLUR'];
/** Effect style de desfoque (fundo ou camada), e nao sombra. */
export const isBlurStyle = (def) => def.effects.length > 0 && def.effects.every((e) => BLUR_TYPES.includes(e.type));

/**
 * Valor CSS de um effect style: box-shadow (sombras) ou blur() (desfoque de fundo/camada).
 * O raio de desfoque do Figma e o DOBRO do blur() do CSS (o Dev Mode exporta radius / 2):
 * os tokens guardam o raio do Figma, o CSS divide por 2.
 */
export function effectCss(def, prefix) {
  if (!isBlurStyle(def)) return shadowCss(def.effects, prefix);
  const e = def.effects[0];
  const bound = prefix && e.boundVariables?.blur;
  return `blur(${bound ? `calc(var(${varNameOf(bound, prefix)}) / 2)` : `${e.blur / 2}px`})`;
}

/** Composicoes derivadas de mais de uma variavel (hoje: o gradiente de marca). */
function compositeLines(index, prefix, indent) {
  if (!index.has('gradient/brand/angle')) return '';
  const v = (n) => `var(${varNameOf(n, prefix)})`;
  return `\n${indent}--${prefix}-gradient-brand: linear-gradient(${v('gradient/brand/angle')}, ${v('gradient/brand/from')}, ${v('gradient/brand/to')});`;
}

const MODELESS = ['Palette', 'Primitives', 'Brand', 'Semantic'];

/* ------------------------------------------------------- modos de marca */

/**
 * Colecoes cujos modos sao marcas (nucleo + N marcas). Os modos de Palette e
 * Brand tem o mesmo nome por marca ("Santo", "VTSD"); Color, Primitives e
 * Semantic sao compartilhadas.
 */
export const BRAND_COLLECTIONS = ['Palette', 'Brand'];

/**
 * Uma entrada por modo da colecao Brand, na ordem do Figma:
 * [{ mode, id, name, isDefault }]. `id` vem de brand/id naquele modo e e o
 * valor do atributo `data-brand` que seleciona a marca.
 */
export function brandModes(doc) {
  const brand = doc.collections.Brand;
  if (!brand) return [];
  const read = (name, mode) => {
    const def = brand.variables[name];
    if (!def) return '';
    const values = def.values ?? { [brand.defaultMode]: def.value };
    return String(values[mode] ?? values[brand.defaultMode] ?? '');
  };
  return brand.modes.map((mode) => ({
    mode,
    id: read('brand/id', mode) || mode.toLowerCase(),
    name: read('brand/name', mode) || mode,
    isDefault: mode === brand.defaultMode,
  }));
}

/**
 * Variaveis fora de Palette/Brand cuja cadeia de alias passa por Palette/Brand
 * em algum modo. Custom property com var() e resolvida no elemento onde foi
 * declarada, e o filho herda o valor ja resolvido: para uma marca valer num
 * conteiner (e nao so no :root), o bloco da marca precisa redeclarar estas.
 */
export function brandDependents(index) {
  const memo = new Map();
  const dependsOnBrand = (name, stack = new Set()) => {
    if (memo.has(name)) return memo.get(name);
    const entry = index.get(name);
    if (!entry || stack.has(name)) return false;
    if (BRAND_COLLECTIONS.includes(entry.collection)) return true;
    stack.add(name);
    const hit = Object.values(entry.values).some((v) => isAlias(v) && dependsOnBrand(aliasTarget(v), stack));
    stack.delete(name);
    memo.set(name, hit);
    return hit;
  };
  return new Set(
    [...index.values()]
      .filter((v) => !BRAND_COLLECTIONS.includes(v.collection) && dependsOnBrand(v.name))
      .map((v) => v.name),
  );
}

/* ----------------------------------------------- declaracoes de variaveis */

/**
 * Todas as declaracoes `--santo-x: y` de um doc, em ordem.
 * `mode` escolhe o modo da colecao Color; `brand` escolhe o modo de marca de
 * Palette/Brand (sem ele, cada colecao usa o seu modo padrao).
 * Retorna [{ name, varName, value }] — util tanto para CSS quanto para o preview.
 */
export function declarations(doc, mode = 'Light', brand) {
  const prefix = doc.meta.cssPrefix;
  const index = buildIndex(doc);
  const out = [];
  for (const v of index.values()) {
    const raw = v.values[mode] ?? (brand === undefined ? undefined : v.values[brand]) ?? v.values[v.defaultMode];
    out.push({ name: v.name, varName: varNameOf(v.name, prefix), value: toCss(v.name, v.type, raw, prefix) });
  }
  for (const [name, def] of Object.entries(doc.effectStyles)) {
    out.push({ name: name.includes('/') ? name : `shadow/${name}`, varName: effectVarOf(name, prefix), value: isBlurStyle(def) ? effectCss(def) : shadowCss(def.effects) });
  }
  const stacks = fontStacks(prefix);
  out.push({ name: 'font/sans', varName: `--${prefix}-font-sans`, value: stacks.sans });
  out.push({ name: 'font/mono', varName: `--${prefix}-font-mono`, value: stacks.mono });
  if (index.has('brand/family/heading')) {
    out.push({ name: 'font/heading', varName: `--${prefix}-font-heading`, value: stacks.heading });
  }
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
    ([name, def]) => `  ${effectVarOf(name, prefix)}: ${effectCss(def, prefix)};`,
  );

  return `${banner}

${selector} {
${sections.join('\n\n')}

  /* Color — modo Light (${light.length}) */
${light.map((d) => line(d, '  ')).join('\n')}

  /* Effect styles (${shadows.length}) */
${shadows.join('\n')}

  /* Pilhas de fonte derivadas de brand/family/* */
${fontStackLines(index, prefix, '  ')}${compositeLines(index, prefix, '  ')}

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
${brandBlocksCss(doc, index, selector)}`;
}

/**
 * Um bloco por modo de marca, selecionado por [data-brand='<id>'] em qualquer
 * elemento. Vazio quando so existe uma marca, para a saida nao mudar.
 *
 * Com data-brand no proprio :root, as regras de tema acima ja resolvem tudo
 * (:root[data-theme='dark'] pesa mais que [data-brand]). Os blocos de Dark
 * abaixo cobrem o conteiner de marca dentro de uma pagina em tema escuro.
 */
function brandBlocksCss(doc, index, selector) {
  const brands = brandModes(doc);
  if (brands.length < 2) return '';
  const dependents = brandDependents(index);
  return brands.map((brand) => brandBlock(doc, index, dependents, brand, selector)).join('');
}

/**
 * O bloco CSS de UMA marca (o mesmo texto que tokens.css traz para ela), para
 * aplicar um modo em runtime — ex.: o rascunho do Estudio num <style>.
 * `scope` padrao: [data-brand='<brand/id do modo>'].
 */
export function brandBlockCss(doc, mode, { selector = ':root', scope } = {}) {
  const brand = brandModes(doc).find((b) => b.mode === mode);
  if (!brand) throw new Error(`Modo de marca inexistente: ${mode}`);
  const index = buildIndex(doc);
  return brandBlock(doc, index, brandDependents(index), brand, selector, scope);
}

function brandBlock(doc, index, dependents, { mode, id, name }, selector, scope = `[data-brand='${id}']`) {
  const prefix = doc.meta.cssPrefix;
  const all = [...index.values()];
  const decl = (v, raw, indent) => `${indent}${varNameOf(v.name, prefix)}: ${toCss(v.name, v.type, raw, prefix)};`;

  const own = BRAND_COLLECTIONS.filter((c) => doc.collections[c]).map((c) => {
    const entries = all.filter((v) => v.collection === c);
    const rows = entries.map((v) => decl(v, v.values[mode] ?? v.values[v.defaultMode], '  '));
    return `  /* ${c} — modo ${mode} (${entries.length}) */\n${rows.join('\n')}`;
  });
  const modeless = all.filter((v) => v.collection !== 'Color' && dependents.has(v.name));
  const color = all.filter((v) => v.collection === 'Color' && dependents.has(v.name));
  const themed = (m, indent) => color.map((v) => decl(v, v.values[m] ?? v.values[v.defaultMode], indent)).join('\n');
  // Sombra com cor ligada a variavel de marca: redeclarada, pelo mesmo motivo dos dependentes.
  const brandBound = (n) => BRAND_COLLECTIONS.includes(index.get(n)?.collection) || dependents.has(n);
  const shadows = Object.entries(doc.effectStyles).filter(([, def]) =>
    def.effects.some((e) => Object.values(e.boundVariables ?? {}).some(brandBound)),
  );
  const shadowRows = shadows.length
    ? `\n\n  /* Effect styles com cor ligada a variavel de marca (${shadows.length}) */\n${shadows
        .map(([n, def]) => `  ${effectVarOf(n, prefix)}: ${effectCss(def, prefix)};`)
        .join('\n')}`
    : '';

  return `
/* Marca ${name} — modo ${mode}. Vale no elemento com data-brand='${id}' e em tudo dentro dele. */
${scope} {
${own.join('\n\n')}

  /* Dependentes de Palette/Brand, redeclarados para o escopo valer fora do ${selector} (${modeless.length}) */
${modeless.map((v) => decl(v, v.values[v.defaultMode], '  ')).join('\n')}

  /* Color — modo Light (${color.length}) */
${themed('Light', '  ')}${shadowRows}

  /* Pilhas de fonte derivadas de brand/family/* */
${fontStackLines(index, prefix, '  ')}${compositeLines(index, prefix, '  ')}
}

/* Marca ${name} — Color modo Dark, seguindo o sistema. */
@media (prefers-color-scheme: dark) {
  ${selector}:not([data-theme='light']) ${scope} {
${themed('Dark', '    ')}
  }
}

/* Marca ${name} — Color modo Dark fixado. */
${selector}[data-theme='dark'] ${scope} {
${themed('Dark', '  ')}
}
`;
}

/* --------------------------------------------------------- typography.css */

/**
 * Propriedades CSS de um text style, exatamente como typography.css as escreve.
 * `index` e `tracking` vem de buildIndex e trackingByPercent.
 */
export function textStyleCss(s, index, tracking, prefix) {
  /**
   * Prefere a variavel da fundacao; cai no valor literal quando o tamanho
   * escolhido nao existe como degrau. E o que permite edicao livre sem inventar
   * um `var(--santo-type-size-81)` que ninguem definiu.
   */
  const ref = (token, literal) =>
    index.get(token) ? `var(${varNameOf(token, prefix)})` : `${literal}px`;
  const stack = stackOf(s.boundVariables.fontFamily);
  // letterSpacing ligado a variavel (tracking por papel da marca) vence o casamento por valor.
  const token = s.boundVariables.letterSpacing ?? tracking.get(s.letterSpacing.value);
  return {
    fontFamily: `var(--${prefix}-font-${stack})`,
    fontSize: ref(s.boundVariables.fontSize, s.fontSize),
    lineHeight: ref(s.boundVariables.lineHeight, s.lineHeight.value ?? s.fontSize),
    letterSpacing: token ? `var(${varNameOf(token, prefix)})` : `${s.letterSpacing.value / 100}em`,
    fontWeight: `var(${varNameOf(s.boundVariables.fontWeight, prefix)})`,
  };
}

export function emitTypographyCss(doc, { banner = BANNER } = {}) {
  const prefix = doc.meta.cssPrefix;
  const index = buildIndex(doc);
  const tracking = trackingByPercent(index);

  const rules = Object.entries(doc.textStyles).map(([figmaName, s]) => {
    const css = textStyleCss(s, index, tracking, prefix);
    return `/* ${figmaName} */
.${textStyleClass(figmaName, prefix)} {
  font-family: ${css.fontFamily};
  font-size: ${css.fontSize};
  line-height: ${css.lineHeight};
  letter-spacing: ${css.letterSpacing};
  font-weight: ${css.fontWeight};
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

/**
 * Chave do `@theme` que uma variavel vira em theme.css, ou null se ela nao vira
 * utilitario do Tailwind. Recebe uma entrada de buildIndex (usa name e collection).
 */
export function themeKeyOf({ name, collection }) {
  const leaf = (i) => name.split('/')[i];
  if (collection === 'Color') return `--color-${colorUtility(name).replace(/\//g, '-')}`;
  if (collection === 'Palette') return `--color-${name.replace(/\//g, '-')}`;
  if (collection === 'Semantic') {
    if (name.startsWith('space/')) return `--spacing-${leaf(1)}`;
    if (name.startsWith('radius/')) return `--radius-${leaf(1)}`;
    return null;
  }
  if (name.startsWith('type/weight/')) return `--font-weight-${leaf(2)}`;
  if (name.startsWith('type/tracking/')) return `--tracking-${leaf(2)}`;
  if (name.startsWith('type/leading/')) return `--leading-${leaf(2)}`;
  if (name.startsWith('motion/easing/')) return `--ease-${leaf(2)}`;
  return null;
}

/** Namespace do @theme -> utilitario canonico do Tailwind v4. */
const UTILITY_BY_NAMESPACE = [
  ['--spacing-', 'p-'],
  ['--radius-', 'rounded-'],
  ['--font-weight-', 'font-'],
  ['--tracking-', 'tracking-'],
  ['--leading-', 'leading-'],
  ['--ease-', 'ease-'],
];

/**
 * Classe Tailwind de exemplo para uma variavel, ou null se ela nao esta no @theme.
 * Cores escolhem o utilitario pela familia: text/icon -> text-*, border -> border-*,
 * o resto -> bg-*. Espacamento usa p-* (vale tambem m-*, gap-*...).
 */
export function utilityClassOf(entry) {
  const key = themeKeyOf(entry);
  if (!key) return null;
  if (key.startsWith('--color-')) {
    const family = entry.name.split('/')[1];
    const utility = family === 'text' || family === 'icon' ? 'text' : family === 'border' ? 'border' : 'bg';
    return `${utility}-${key.slice('--color-'.length)}`;
  }
  const hit = UTILITY_BY_NAMESPACE.find(([ns]) => key.startsWith(ns));
  return hit ? hit[1] + key.slice(hit[0].length) : null;
}

export function emitThemeCss(doc, { banner = BANNER } = {}) {
  const prefix = doc.meta.cssPrefix;
  const index = buildIndex(doc);
  const tracking = trackingByPercent(index);
  const v = (name) => `var(${varNameOf(name, prefix)})`;
  const all = [...index.values()];
  const inCollection = (c) => all.filter((x) => x.collection === c);
  const startsWith = (p) => all.filter((x) => x.name.startsWith(p));
  const row = (x) => `  ${themeKeyOf(x)}: ${v(x.name)};`;

  const colors = [...inCollection('Color').map(row), ...inCollection('Palette').map(row)];
  const semantic = (p) => inCollection('Semantic').filter((x) => x.name.startsWith(`${p}/`));
  const spacing = semantic('space').map(row);
  const radius = semantic('radius').map(row);
  const weights = startsWith('type/weight/').map(row);
  const trackingRows = startsWith('type/tracking/').map(row);
  const leading = startsWith('type/leading/').map(row);
  const easing = startsWith('motion/easing/').map(row);
  // Sombras (e glow) viram --shadow-*; desfoques de fundo usam --blur-effect-* (backdrop-blur-effect-md).
  const shadows = Object.entries(doc.effectStyles)
    .filter(([, def]) => !isBlurStyle(def))
    .map(([n]) => `  --shadow-${n.replace(/\//g, '-')}: var(${effectVarOf(n, prefix)});`);
  const blurs = inCollection('Semantic')
    .filter((x) => x.name.startsWith('effect/blur/'))
    .map((x) => `  --blur-effect-${x.name.split('/')[2]}: calc(${v(x.name)} / 2);`); // raio do Figma -> blur() do CSS

  const seen = new Set();
  const text = [];
  for (const [figmaName, s] of Object.entries(doc.textStyles)) {
    const role = textRoleOf(figmaName);
    if (seen.has(role)) continue;
    seen.add(role);
    const token = s.boundVariables.letterSpacing ?? tracking.get(s.letterSpacing.value);
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
  --font-mono: var(--${prefix}-font-mono);${index.has('brand/family/heading') ? `\n  --font-heading: var(--${prefix}-font-heading);` : ''}

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
${blurs.length ? `\n  /* Desfoque de fundo: backdrop-blur-effect-md. */\n${blurs.join('\n')}\n` : ''}
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
    const stack = stackOf(s.boundVariables.fontFamily);
    const token = s.boundVariables.letterSpacing ?? tracking.get(s.letterSpacing.value);
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

  const shadowPairs = Object.entries(doc.effectStyles)
    .filter(([, def]) => !isBlurStyle(def))
    .map(([n, def]) => [n, shadowCss(def.effects)]);

  // So existe com mais de uma marca, para a saida de marca unica nao mudar.
  const brands = brandModes(doc);
  const brandsTs =
    brands.length < 2
      ? ''
      : `
/** Marcas (modos de Palette/Brand). \`id\` e o valor de \`data-brand\`; sem o atributo vale a padrao. */
export const brands = ${JSON.stringify(
          Object.fromEntries(
            brands.map(({ mode, id, name, isDefault }) => [
              id,
              {
                mode,
                name,
                isDefault,
                resolved: Object.fromEntries(
                  all
                    .filter((x) => BRAND_COLLECTIONS.includes(x.collection))
                    .map((x) => [x.name, toCss(x.name, x.type, resolveValue(index, x.values[mode] ?? x.values[x.defaultMode], mode), prefix)]),
                ),
              },
            ]),
          ),
          null,
          2,
        )} as const;

export type BrandId = keyof typeof brands;
`;

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
${brandsTs}`;
}
