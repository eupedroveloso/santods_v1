/**
 * Auditoria de contraste WCAG 2.x da colecao Color numa combinacao marca x tema.
 *
 * Modulo puro (scripts/ e browser). Resolve a cadeia de alias com o tema na Color
 * e a marca em Palette/Brand — o mesmo que o CSS faz com data-theme + data-brand.
 *
 * Os 49 pares da auditoria em tokens/VTSD.proposal.md, mais 18 do estilo Superficies (67), por regra:
 *   texto >= 4,5  — 12 textos de conteudo sobre surface/page; primary/secondary/
 *                   tertiary sobre surface/raised; on-<familia> sobre os 3 estados
 *                   de bg/<familia>/solid (7 familias); inverse sobre surface/inverse.
 *   UI    >= 3    — 8 bordas e 4 icones sobre surface/page.
 *   superficies   — primary/secondary/tertiary sobre sunken, well, panel e frame/surface;
 *                   border/strong sobre raised, sunken, well e panel; border/default sobre raised e sunken.
 * `knownDebt` marca o que ja esta registrado como divida (tokens/README.md, D1, e a
 * excecao aceita de border/default): aparece no relatorio, mas nao como surpresa.
 */
import { contrast } from './color.mjs';
import { aliasTarget, buildIndex, isAlias } from './emit.mjs';

const FAMILIES = ['brand', 'neutral', 'accent', 'success', 'warning', 'danger', 'info'];
const STATES = ['default', 'hover', 'active'];
const c = (p) => `color/${p}`;

export const AUDIT_PAIRS = [
  ...['primary', 'secondary', 'tertiary', 'brand', 'accent', 'success', 'warning', 'danger', 'info', 'link/default', 'link/hover', 'link/visited'].map(
    (t) => ({ fg: c(`text/${t}`), bg: c('surface/page'), min: 4.5, kind: 'text' }),
  ),
  ...['primary', 'secondary', 'tertiary'].map((t) => ({ fg: c(`text/${t}`), bg: c('surface/raised'), min: 4.5, kind: 'text' })),
  ...FAMILIES.flatMap((f) => STATES.map((s) => ({ fg: c(`text/on-${f}`), bg: c(`bg/${f}/solid/${s}`), min: 4.5, kind: 'text' }))),
  { fg: c('text/inverse'), bg: c('surface/inverse'), min: 4.5, kind: 'text' },
  ...['strong', 'brand', 'focus', 'default', 'success', 'warning', 'danger', 'info'].map((b) => ({
    fg: c(`border/${b}`),
    bg: c('surface/page'),
    min: 3,
    kind: 'ui',
  })),
  ...['primary', 'secondary', 'tertiary', 'brand'].map((i) => ({ fg: c(`icon/${i}`), bg: c('surface/page'), min: 3, kind: 'ui' })),
  // Estilo Superficies (Estudio): texto sobre cada superficie com tom e a borda forte sobre elas.
  ...['surface/sunken', 'surface/well', 'surface/panel', 'frame/surface'].flatMap((s) =>
    ['primary', 'secondary', 'tertiary'].map((t) => ({ fg: c(`text/${t}`), bg: s.startsWith('frame/') ? s : c(s), min: 4.5, kind: 'text' })),
  ),
  ...['surface/raised', 'surface/sunken', 'surface/well', 'surface/panel'].map((s) => ({ fg: c('border/strong'), bg: c(s), min: 3, kind: 'ui' })),
  ...['surface/raised', 'surface/sunken'].map((s) => ({ fg: c('border/default'), bg: c(s), min: 3, kind: 'ui' })),
];

/** Dividas registradas (tokens/README.md). Chave: `fg|bg`. */
const KNOWN_DEBT = new Set([
  ...STATES.map((s) => `color/text/on-brand|color/bg/brand/solid/${s}`),
  'color/border/brand|color/surface/page',
  'color/border/default|color/surface/page',
  // Excecao aceita pelo Pedro: border/default e contorno decorativo (o input usa border/strong).
  'color/border/default|color/surface/raised',
  'color/border/default|color/surface/sunken',
]);

/** Valor concreto de uma variavel: tema na Color, marca em Palette/Brand. */
export function resolveColor(index, name, { theme = 'Light', brand } = {}, seen = new Set()) {
  if (seen.has(name)) throw new Error(`Ciclo de alias em ${name}`);
  seen.add(name);
  const entry = index.get(name);
  if (!entry) throw new Error(`Variavel inexistente: ${name}`);
  const raw = entry.values[theme] ?? (brand === undefined ? undefined : entry.values[brand]) ?? entry.values[entry.defaultMode];
  return isAlias(raw) ? resolveColor(index, aliasTarget(raw), { theme, brand }, seen) : raw;
}

/**
 * @param {object} doc
 * @param {string} [brand]  modo de Palette/Brand (padrao: o modo padrao)
 * @param {'Light'|'Dark'} [theme]
 * @returns {{ fg, bg, fgHex, bgHex, ratio, min, kind, pass, knownDebt }[]}
 */
export function auditContrast(doc, brand, theme = 'Light') {
  const index = buildIndex(doc);
  return AUDIT_PAIRS.filter((p) => index.has(p.fg) && index.has(p.bg)).map((p) => {
    const fgHex = resolveColor(index, p.fg, { theme, brand });
    const bgHex = resolveColor(index, p.bg, { theme, brand });
    const ratio = +contrast(fgHex, bgHex).toFixed(2);
    return { ...p, fgHex, bgHex, ratio, pass: ratio >= p.min, knownDebt: KNOWN_DEBT.has(`${p.fg}|${p.bg}`) };
  });
}
