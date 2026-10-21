#!/usr/bin/env node
/**
 * Raio aninhado + recuo igual nos quatro lados, no codigo-fonte.
 *
 *   node scripts/check-nest.mjs [arquivos ou pastas...]
 *
 * Regra do Pedro (2026-10-21): o raio interno nasce do externo menos o recuo,
 * o externo e sempre maior, e numa moldura com painel aninhado o recuo e
 * IGUAL nos quatro lados. Quem garante isso e o MECANISMO de aninhamento:
 *
 *   agrupador  <Nest> / useNest (lib/ui/nest.tsx), classe `santo-nest` ou
 *              --santo-inner-radius gravado no style: UM recuo (--santo-nest-inset)
 *              nos quatro lados e o raio interno pronto para os filhos;
 *   filho      consome — classe `santo-nested`, `rounded-(--santo-inner-radius)`,
 *              `var(--santo-inner-radius` no style ou useNestRadius().
 *
 * Este script cobra tres coisas (todas ERRO):
 *
 *   [M] agrupador conhecido (Card, CommandPalette, painel do Select, DemoCard,
 *       EditorFrame, ThumbFrame, Segmented, Modal quando existir) cujo arquivo
 *       nao usa o mecanismo (Nest/useNest/santo-nest/--santo-inner-radius) nem
 *       delega a um <Card> ou <Nest>;
 *   [P] moldura com recuo assimetrico: um agrupador (marcado, ou <Card>/<ThumbFrame>/...
 *       no JSX) com p-/px-/py-/pt-/pr-/pb-/pl- que deixam os lados diferentes;
 *   [R] filho direto de um agrupador com raio manual: elemento HTML com
 *       rounded-* (fora rounded-none, rounded-full e o raio do mecanismo) ou
 *       borderRadius solto no style.
 *
 * A medida no navegador (recuos reais, Δ do raio) fica com scripts/probe-nest.mjs
 * (npm run nest:probe), fora do check padrao.
 *
 * Excecao declarada: entrada em NEST_EXEMPT ('arquivo:linha': motivo). Entrada
 * que nao corresponde a nenhum achado e erro — isencao orfa vira habito.
 */
import { existsSync, readFileSync, readdirSync, statSync } from 'node:fs';
import { createRequire } from 'node:module';
import { dirname, join, relative, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const ts = createRequire(import.meta.url)('typescript');
const ROOTS = ['lib/ui', 'app'];

/** Agrupadores conhecidos -> arquivo. `optional`: o componente ainda nao existe. */
const KNOWN = {
  Card: { file: 'lib/ui/card.tsx' },
  CommandPalette: { file: 'lib/ui/command-palette.tsx' },
  Select: { file: 'lib/ui/listbox.tsx', what: 'painel do Select (Listbox)' },
  DemoCard: { file: 'app/_docs/demo-card.tsx' },
  EditorFrame: { file: 'lib/ui/editor-frame.tsx' },
  ThumbFrame: { file: 'lib/ui/thumb-frame.tsx' },
  Segmented: { file: 'lib/ui/segmented.tsx' },
  Modal: { file: 'lib/ui/modal.tsx', optional: true },
};

/** Isencoes: 'arquivo:linha' -> motivo. */
const NEST_EXEMPT = {};

/* ------------------------------------------------------------- mecanismo */

const VAR = '--santo-inner-radius';
const SETS_VAR = new RegExp(`["']?${VAR}["']?(\\s+as\\s+\\w+)?\\s*(\\]|:)`);
const PROVIDES = new RegExp(`(^|[\\s"'\`])santo-nest(?![\\w-])|\\buseNest\\(|${SETS_VAR.source}`);
const DELEGATES = /<(Card|Nest)[\s>]/;
const CONSUMES_CLASS = new RegExp(`^(santo-nested|rounded-\\(${VAR}\\))$`);
/** Componentes que sao moldura quando aparecem no JSX. */
const GROUP_TAGS = new Set([...Object.keys(KNOWN), 'Nest']);

/* ------------------------------------------------------------- leitura */

const targets = process.argv.slice(2);
const files = [];
for (const dir of targets.length ? targets : ROOTS) {
  const walk = (p) => {
    if (!statSync(p).isDirectory()) return void (/\.tsx$/.test(p) && files.push(p));
    for (const entry of readdirSync(p)) walk(join(p, entry));
  };
  walk(resolve(root, dir));
}

const problems = [];
const exempted = [];
const hits = new Set();
const report = (rel, line, rule, msg) => {
  const key = `${rel}:${line}`;
  const why = NEST_EXEMPT[key];
  if (why) { hits.add(key); exempted.push(`${key}  [${rule}] ${msg}  (isento: ${why})`); }
  else problems.push(`${key}  [${rule}] ${msg}`);
};

/** Texto estatico de className: literais, templates (interpolacao vira espaco) e strings em expressoes. */
function classText(attr) {
  if (!attr?.initializer) return '';
  const init = attr.initializer;
  if (ts.isStringLiteral(init)) return init.text;
  let out = '';
  const visit = (n) => {
    if (ts.isStringLiteral(n) || ts.isNoSubstitutionTemplateLiteral(n)) out += ' ' + n.text;
    else if (ts.isTemplateExpression(n)) { out += ' ' + n.head.text; n.templateSpans.forEach((s) => { visit(s.expression); out += ' ' + s.literal.text; }); }
    else ts.forEachChild(n, visit);
  };
  visit(init);
  return out;
}
const attrOf = (el, name) => el.attributes.properties.find((p) => ts.isJsxAttribute(p) && p.name.getText() === name);
const tagName = (el) => el.tagName.getText();

/** Lados do padding por prefixo de variante ('' = base). `base`: padding que o componente ja aplica (prop). */
function paddingSides(classes, base0 = null) {
  const RANK = { p: 0, px: 1, py: 1, pt: 2, pr: 2, pb: 2, pl: 2, ps: 2, pe: 2 };
  const groups = new Map();
  for (const raw of classes) {
    const m = raw.match(/^((?:[\w-]+:)*)(p|px|py|pt|pr|pb|pl|ps|pe)-(.+)$/);
    if (!m) continue;
    const [, prefix, kind, val] = m;
    if (!groups.has(prefix)) groups.set(prefix, { t: [-1, null], r: [-1, null], b: [-1, null], l: [-1, null] });
    const g = groups.get(prefix);
    const sides = { p: 'trbl', px: 'rl', py: 'tb', pt: 't', pr: 'r', pb: 'b', pl: 'l', ps: 'l', pe: 'r' }[kind];
    for (const s of sides) if (RANK[kind] >= g[s][0]) g[s] = [RANK[kind], val];
  }
  const out = [];
  for (const [prefix, g] of groups) {
    const vals = ['t', 'r', 'b', 'l'].map((s) => g[s][1]);
    if (vals.every((v) => v === null)) continue;
    // So o grupo base precisa dos quatro; variante herda o resto da base.
    const base = groups.get('') ?? { t: [0, null], r: [0, null], b: [0, null], l: [0, null] };
    const full = ['t', 'r', 'b', 'l'].map((s) => g[s][1] ?? base[s][1] ?? base0 ?? '0');
    if (new Set(full).size > 1) out.push(`${prefix || ''}t=${full[0]} r=${full[1]} b=${full[2]} l=${full[3]}`);
  }
  return out;
}

const MANUAL_RADIUS = (c) => /^rounded(-|$)/.test(c) && !/^rounded-(none|full)$/.test(c) && !CONSUMES_CLASS.test(c);

for (const file of files) {
  const rel = relative(root, file);
  const src = readFileSync(file, 'utf8');
  const sf = ts.createSourceFile(file, src, ts.ScriptTarget.Latest, true, ts.ScriptKind.TSX);
  const lineOf = (n) => sf.getLineAndCharacterOfPosition(n.getStart(sf)).line + 1;

  const isGroup = (open) => {
    const name = tagName(open);
    if (GROUP_TAGS.has(name)) return true;
    const cls = classText(attrOf(open, 'className'));
    const style = attrOf(open, 'style')?.getText(sf) ?? '';
    return /(^|\s)santo-nest(\s|$)/.test(cls) || SETS_VAR.test(style);
  };

  const visit = (node) => {
    if (ts.isJsxElement(node) && isGroup(node.openingElement)) {
      const open = node.openingElement;
      const name = tagName(open);
      const classes = classText(attrOf(open, 'className')).split(/\s+/).filter(Boolean).map((c) => c.replace(/^!/, ''));
      // <Card> ja tem padding pela prop (lg no raised, md nas demais; padded={false} = 0).
      let base0 = null;
      if (name === 'Card') {
        const pad = attrOf(open, 'padding')?.initializer;
        const padded = attrOf(open, 'padded')?.initializer?.getText(sf);
        const variant = attrOf(open, 'variant')?.initializer;
        base0 = padded === '{false}' ? '0' : pad && ts.isStringLiteral(pad) ? pad.text : !variant || (ts.isStringLiteral(variant) && variant.text === 'raised') ? 'lg (padrao)' : 'md (padrao)';
      } else if (name === 'Nest') {
        // <Nest> aplica o recuo da prop `inset` (padrao xs) nos quatro lados.
        const inset = attrOf(open, 'inset')?.initializer;
        base0 = inset && ts.isStringLiteral(inset) ? inset.text : 'xs (padrao)';
      }
      for (const asym of paddingSides(classes, base0)) report(rel, lineOf(open), 'P', `<${name}> moldura com recuo assimetrico (${asym}) — recuo de painel aninhado e um token so nos quatro lados`);
      for (const child of node.children) {
        const el = ts.isJsxElement(child) ? child.openingElement : ts.isJsxSelfClosingElement(child) ? child : null;
        if (!el || /^[A-Z]/.test(tagName(el))) continue; // componente da lib decide o proprio raio
        const cls = classText(attrOf(el, 'className')).split(/\s+/).filter(Boolean);
        const manual = cls.filter(MANUAL_RADIUS);
        const style = attrOf(el, 'style')?.getText(sf) ?? '';
        const looseStyle = /borderRadius\s*:/.test(style) && !new RegExp(VAR).test(style);
        if (manual.length || looseStyle) {
          report(rel, lineOf(el), 'R', `<${tagName(el)}> filho direto de <${name}> com raio manual (${manual.join(' ') || 'borderRadius no style'}) — use santo-nested / rounded-(--santo-inner-radius)`);
        }
      }
    }
    ts.forEachChild(node, visit);
  };
  visit(sf);
}

/* [M] agrupador conhecido sem o mecanismo */
const notes = [];
for (const [name, { file, optional, what }] of Object.entries(KNOWN)) {
  const abs = resolve(root, file);
  if (!existsSync(abs)) {
    if (optional) notes.push(`${name}: ${file} nao existe (ainda) — sem o que cobrar`);
    else problems.push(`scripts/check-nest.mjs  agrupador ${name} aponta para ${file}, que nao existe — corrija KNOWN`);
    continue;
  }
  const src = readFileSync(abs, 'utf8');
  const delegates = name !== 'Card' && DELEGATES.test(src);
  if (!PROVIDES.test(src) && !delegates) {
    const line = src.split('\n').findIndex((l) => new RegExp(`export (default )?function ${name}\\b`).test(l)) + 1 || 1;
    report(file, line, 'M', `${what ?? name} e agrupador e nao usa o mecanismo (Nest / useNest / santo-nest / --santo-inner-radius) nem delega a um <Card> ou <Nest>`);
  }
}

for (const key of Object.keys(NEST_EXEMPT)) {
  if (!hits.has(key)) problems.push(`scripts/check-nest.mjs  isencao orfa ${key} — nenhum achado nessa linha; remova a entrada de NEST_EXEMPT`);
}

console.log(`Varridos ${files.length} arquivos em ${(targets.length ? targets : ROOTS).join(', ')}; ${Object.keys(KNOWN).length} agrupadores conhecidos.`);
notes.forEach((n) => console.log('  nota: ' + n));
if (exempted.length) {
  console.log(`\n${exempted.length} isencao(oes) declarada(s) em NEST_EXEMPT:`);
  exempted.forEach((e) => console.log('  ' + e));
}
if (problems.length) {
  const by = (r) => problems.filter((p) => p.includes(`[${r}]`)).length;
  console.error(`\n${problems.length} achado(s) de aninhamento — ${by('M')} agrupador sem mecanismo [M], ${by('P')} recuo assimetrico [P], ${by('R')} raio manual em filho [R]:`);
  problems.forEach((p) => console.error('  ' + p));
  process.exit(1);
}
console.log('\nOK — agrupadores expoem o raio interno, molduras com recuo igual e filhos sem raio manual.');
