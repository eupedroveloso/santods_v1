#!/usr/bin/env node
/**
 * Auditoria lib-first: tela compoe a partir de lib/ui, nunca refaz nem remenda.
 *
 *   node scripts/check-lib-first.mjs [arquivos...]
 *
 * Regra do Pedro (2026-10-19): toda UI nasce da lib. Existe em lib/ui -> use.
 * Nao existe -> crie e documente na lib primeiro. Precisa de um ajuste -> vira
 * VARIANTE na lib, nunca className solto na tela. Este script varre app/ atras
 * dos dois sinais de que isso nao aconteceu:
 *
 *   A. markup que replica componente existente: <button>, <input>, <select>,
 *      <textarea>, <table>, <hr>, <kbd>, <pre> crus; <a>/<Link> com cara de
 *      botao (fundo solido + altura/padding) sem buttonClass; div/span com
 *      cara de cartao (borda + raio + superficie); pilula com cara de Tag;
 *      item de navegacao feito a mao (link com hover:bg + raio + padding).
 *   B. className com aparencia passada a componente da lib (cor, raio, sombra,
 *      borda, tipografia): o componente precisa de uma variante.
 *   C. grade montada inline (`grid` + `grid-cols-*`/`gridTemplateColumns`): toda
 *      fileira de cartoes ou pecas irmas e CardGrid, que alinha ao topo e nao
 *      deixa margem morta (principio 4 do Pedro).
 *   D. composicao inline em tela de exemplo (regra dura do Pedro, Fase C): em
 *      app/exemplos, fora da moldura da pagina, a tela SO compoe blocos — os
 *      componentes da categoria `blocos` de lib/ui (StatCard, ChatCard…),
 *      alimentados por dado, mais o que ja e uma superficie inteira
 *      (EXAMPLE_ALLOW). Card, CardHeader, Stat, KeyValue, ListRow, Field…
 *      soltos na tela = cartao montado inline; markup cru alem de div e
 *      texto inline (strong, em) tambem. Falta um bloco? Crie em lib/ui.
 *
 * Excecao declarada: comentario `lib-first-ok: <motivo>` na linha da tag ou na
 * de cima. Sem motivo nao vale. As excecoes aparecem na saida — isencao que
 * ninguem ve vira habito.
 */
import { readFileSync, readdirSync, statSync } from 'node:fs';
import { join, relative, resolve, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const ROOTS = ['app'];

/** Componentes exportados por lib/ui/index.ts (so valores com inicial maiuscula). */
const indexTs = readFileSync(resolve(root, 'lib/ui/index.ts'), 'utf8');
const LIB = new Set();
for (const m of indexTs.matchAll(/export \{([^}]+)\} from/g)) {
  for (const name of m[1].split(',').map((s) => s.trim())) if (/^[A-Z]/.test(name)) LIB.add(name);
}

/** Categoria de cada componente, lida dos metas (regra D). */
const CATEGORY = new Map();
for (const f of readdirSync(resolve(root, 'lib/ui')).filter((f) => f.endsWith('.meta.ts'))) {
  const src = readFileSync(resolve(root, 'lib/ui', f), 'utf8');
  for (const m of src.matchAll(/name:\s*"([^"]+)"[\s\S]*?category:\s*"([^"]+)"/g)) CATEGORY.set(m[1], m[2]);
}

/** Regra D: telas de exemplo (conteudo), fora a moldura da pagina. */
const EXAMPLE_ROOT = 'app/exemplos/';
const EXAMPLE_CHROME = new Set(['app/exemplos/page.tsx', 'app/exemplos/views-nav.tsx', 'app/exemplos/_block.tsx']);
/** Fora da categoria blocos, so o que ja e superficie inteira ou layout de grade. */
const EXAMPLE_ALLOW = new Set(['CardGrid', 'EmptyState', 'Ticker']);
/** Markup cru permitido na tela de exemplo: layout e enfase de texto dentro de dado. */
const EXAMPLE_RAW_OK = new Set(['div', 'strong', 'em', 'br']);

function auditExample({ name }) {
  if (LIB.has(name)) {
    const cat = CATEGORY.get(name);
    if (cat !== 'blocos' && !EXAMPLE_ALLOW.has(name)) {
      return [['D', `<${name}> na tela de exemplo — cartao montado inline; use um bloco de lib/ui (categoria blocos) ou crie um`]];
    }
  } else if (/^[a-z]/.test(name) && !EXAMPLE_RAW_OK.has(name)) {
    return [['D', `<${name}> cru na tela de exemplo — so div de layout e texto inline; o resto vem de um bloco de lib/ui`]];
  }
  return [];
}

/** Elemento HTML cru -> componente da lib que ja faz o papel. */
const RAW = {
  button: 'Button / IconButton (ou buttonClass num <Link>)',
  input: 'Input / SearchInput / Checkbox / Radio / Switch',
  select: 'Select',
  textarea: 'Textarea',
  table: 'Table',
  hr: 'Divider',
  kbd: 'Kbd',
  pre: 'CodeBlock',
};

/** Utilitario de aparencia: o que um componente da lib ja decide sozinho. */
const APPEARANCE = [
  [/^bg-/, 'cor de fundo'],
  [/^text-(?!left$|center$|right$|justify$|start$|end$|balance$|pretty$|nowrap$|wrap$|ellipsis$|clip$)/, 'cor/tamanho de texto'],
  [/^santo-(heading|body|caption|code)-/, 'tipografia'],
  [/^(font|tracking|leading)-/, 'tipografia'],
  [/^rounded(-|$)/, 'raio'],
  [/^shadow(-|$)/, 'sombra'],
  [/^border(-|$)/, 'borda'],
  [/^(opacity|ring)(-|$)/, 'opacidade/anel'],
];
const appearanceOf = (cls) => APPEARANCE.find(([re]) => re.test(cls))?.[1] ?? null;

/* ------------------------------------------------------------- leitura */

/** Troca comentario por espaco, guardando o texto dos `lib-first-ok` por linha. */
function stripComments(src, okLines) {
  const mark = (text, offset) => {
    const m = text.match(/lib-first-ok:\s*(\S.*?)\s*(\*\/|$)/m);
    if (m) okLines.set(src.slice(0, offset).split('\n').length, m[1].replace(/\s*\*\/?\s*}?$/, ''));
  };
  return src
    .replace(/\/\*[\s\S]*?\*\//g, (c, off) => (mark(c, off), c.replace(/[^\n]/g, ' ')))
    .replace(/(^|[^:\\])\/\/.*$/gm, (c, lead, off) => (mark(c, off), lead + ' '.repeat(c.length - lead.length)));
}

/**
 * Tags JSX de abertura: nome, atributos crus e linha. Anda caractere a
 * caractere contando chaves e aspas, porque `>` aparece em `=>` e em `a > b`
 * dentro de expressao.
 */
function* jsxTags(src) {
  const re = /<([A-Za-z][\w.]*)(?=[\s/>])/g;
  let m;
  while ((m = re.exec(src))) {
    // `a<b` em expressao TS: exige que a tag venha depois de algo que abre JSX.
    const before = src.slice(Math.max(0, m.index - 1), m.index);
    if (/[\w)\]]/.test(before)) continue;
    let i = re.lastIndex;
    let depth = 0;
    let quote = null;
    for (; i < src.length; i++) {
      const c = src[i];
      if (quote) {
        if (c === quote && src[i - 1] !== '\\') quote = null;
        continue;
      }
      if (c === '"' || c === "'" || c === '`') quote = c;
      else if (c === '{') depth++;
      else if (c === '}') depth--;
      else if (c === '>' && depth === 0) break;
    }
    yield { name: m[1], attrs: src.slice(re.lastIndex, i), index: m.index };
    re.lastIndex = i;
  }
}

/** Classes estaticas de className (literal, template ou expressao com strings), sem variantes. */
function classesOf(attrs) {
  const m = attrs.match(/\bclassName=(\{[\s\S]*\}|"[^"]*"|'[^']*')/);
  if (!m) return [];
  const raw = m[1];
  // Corta no fim do valor: o primeiro atributo seguinte em profundidade 0.
  let depth = 0;
  let end = raw.length;
  for (let i = 0; i < raw.length; i++) {
    if (raw[i] === '{') depth++;
    else if (raw[i] === '}' && --depth === 0) {
      end = i + 1;
      break;
    }
  }
  const value = raw.startsWith('{') ? raw.slice(0, end) : raw;
  const out = [];
  for (const s of value.matchAll(/"([^"]*)"|'([^']*)'|`([^`]*)`/g)) {
    // A interpolacao vira espaco: `${on ? "bg-x" : ""}` tambem e checado.
    const body = (s[1] ?? s[2] ?? s[3]).replace(/\$\{|[}"']/g, ' ');
    for (const t of body.split(/\s+/)) if (t) out.push(t.replace(/^(?:[^:[\]]+:|\[[^\]]*\]:)+/, '').replace(/^!/, ''));
  }
  return out;
}

/* ------------------------------------------------------------- regras */

const has = (classes, re) => classes.some((c) => re.test(c));

function auditTag({ name, attrs }) {
  const classes = classesOf(attrs);
  const found = [];

  if (RAW[name]) {
    const hidden = name === 'input' && /type=["'](hidden|file)["']/.test(attrs);
    if (!hidden) found.push(['A', `<${name}> cru — use ${RAW[name]}`]);
    return found;
  }

  const isLink = name === 'a' || name === 'Link';
  if (isLink && !/buttonClass\(/.test(attrs)) {
    if (has(classes, /^bg-(brand|danger|neutral)-solid/) && has(classes, /^(h-|px-|py-)/)) {
      found.push(['A', `<${name}> com cara de botao — use className={buttonClass(...)}`]);
    } else if (has(classes, /^hover:?bg-|^bg-neutral-subtle/) || (attrs.includes('hover:bg-') && has(classes, /^rounded-/) && has(classes, /^px-/))) {
      if (attrs.includes('hover:bg-') && has(classes, /^rounded-/) && has(classes, /^px-/)) {
        found.push(['A', `<${name}> com cara de item de navegacao — use NavItem href / SidebarNav`]);
      }
    }
  }

  if (name === 'div' || name === 'section' || name === 'article' || name === 'li' || name === 'span') {
    const border = has(classes, /^border(-thin|-thick)?$|^border-(thin|thick)$/);
    // Qualquer raio conta (rounded, rounded-xs, rounded-t-lg…): com o raio aninhado
    // os blocos inset desceram para xs, e restringir a md+ os deixava passar.
    // rounded-none/full nao sao moldura (canto reto, pilula).
    const radius = has(classes, /^rounded(-(?:t|r|b|l|s|e|tl|tr|br|bl|ss|se|es|ee))?(-(?!none$|full$)[\w-]+)?$/);
    const surface = has(classes, /^bg-surface-|^shadow-(xs|sm|md|lg|xl|2xl)$/);
    const padded = has(classes, /^p-(?!0$)/);
    if (border && radius && surface) {
      found.push(['A', `<${name}> com cara de cartao (borda + raio + superficie) — use Card, ou crie a variante que falta`]);
    } else if (border && radius && padded) {
      found.push(['A', `<${name}> com cara de painel (borda + raio + padding) — use Card (variante contornada/inset que falta)`]);
    } else if (name === 'span' && has(classes, /^rounded-full$/) && has(classes, /^px-/) && has(classes, /^bg-\w+-subtle/) && has(classes, /^santo-caption/)) {
      found.push(['A', `<span> com cara de Tag — use Tag / Chip`]);
    }
  }

  if (/^[a-z]/.test(name) && classes.includes('grid') && (has(classes, /^grid-cols-/) || /gridTemplateColumns/.test(attrs))) {
    found.push(['C', `<${name}> monta grade inline — use CardGrid (alinha ao topo, sem margem morta)`]);
  }

  if (LIB.has(name)) {
    const overrides = classes.map((c) => [c, appearanceOf(c)]).filter(([, kind]) => kind);
    if (overrides.length) {
      const list = overrides.map(([c, kind]) => `${c} (${kind})`).join(', ');
      found.push(['B', `<${name} className> sobrescreve aparencia: ${list} — falta variante em lib/ui`]);
    }
    if (/\bstyle=\{\{[^}]*(color|background|border|radius|shadow|font)/i.test(attrs)) {
      found.push(['B', `<${name} style> sobrescreve aparencia — falta variante em lib/ui`]);
    }
  }
  return found;
}

/* ------------------------------------------------------------- varredura */

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
for (const file of files) {
  const rel = relative(root, file);
  const okLines = new Map();
  const src = stripComments(readFileSync(file, 'utf8'), okLines);
  const example = rel.startsWith(EXAMPLE_ROOT) && !EXAMPLE_CHROME.has(rel);
  for (const tag of jsxTags(src)) {
    const line = src.slice(0, tag.index).split('\n').length;
    for (const [rule, msg] of [...auditTag(tag), ...(example ? auditExample(tag) : [])]) {
      const why = okLines.get(line) ?? okLines.get(line - 1);
      (why ? exempted : problems).push(`${rel}:${line}  [${rule}] ${msg}${why ? `  (isento: ${why})` : ''}`);
    }
  }
}

console.log(`Varridos ${files.length} arquivos em ${(targets.length ? targets : ROOTS).join(', ')} contra ${LIB.size} componentes de lib/ui.`);
if (exempted.length) {
  console.log(`\n${exempted.length} isencao(oes) declarada(s) com lib-first-ok:`);
  exempted.forEach((e) => console.log('  ' + e));
}
if (problems.length) {
  const a = problems.filter((p) => p.includes('[A]')).length;
  const c = problems.filter((p) => p.includes('[C]')).length;
  const d = problems.filter((p) => p.includes('[D]')).length;
  console.error(
    `\n${problems.length} achado(s) lib-first — ${a} de markup que replica a lib [A], ${problems.length - a - c - d} de aparencia sobrescrita [B], ${c} de grade inline [C], ${d} de composicao inline em exemplo [D]:`,
  );
  problems.forEach((p) => console.error('  ' + p));
  process.exit(1);
}
console.log('\nOK — toda tela compoe a partir de lib/ui, sem markup replicado, aparencia sobrescrita, grade inline nem cartao montado em exemplo.');
