#!/usr/bin/env node
/**
 * Caça valor solto em codigo de interface.
 *
 *   node scripts/check-design.mjs
 *
 * A regra do SantoDS e que cor, espaco, raio, tipo, sombra, duracao e curva saem
 * sempre de um token. Este script varre app/ e lib/ui/ atras de:
 *   1. hex cru;
 *   2. valor arbitrario em classe Tailwind (`max-w-[68ch]`, `minmax(220px,1fr)`):
 *      dentro de colchete so vale var(--santo-*), nunca numero cru;
 *   3. classe de token que nao existe (`border-t-thick`, `bg-brand-solid`): o
 *      Tailwind nao reclama, so deixa de gerar a regra e o estilo some calado.
 *
 * As excecoes abaixo sao declaradas de proposito — uma checagem que da alarme
 * falso e pior que checagem nenhuma, porque ensina a ignorar a saida.
 */
import { existsSync, readFileSync, readdirSync, statSync } from 'node:fs';
import { join, relative, resolve, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';
import { buildIndex, textRoleOf, textStyleClass, themeKeyOf } from '../lib/tokens/emit.mjs';

const root = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const ROOTS = ['app', 'lib/ui', 'lib/thumbs'];

/** Arquivos onde hex cru e legitimo, com o porque. Chave que nao existe em disco e erro. */
const HEX_EXEMPT = {
  'lib/ui/color-picker.tsx':
    'primitivas de espaco de cor: o arco-iris de matiz e vermelho->verde em qualquer marca, e o punho branco precisa ser branco sobre qualquer cor',
  'lib/ui/color.ts': 'modulo de conversao de cor',
};

/**
 * Armadilha do Tailwind v4: `max-w-lg` LE COMO largura de container, mas resolve
 * pela escala de espacamento — porque os apelidos semanticos do Santo (sm, md,
 * lg, xl, 2xl, 4xl...) sao os mesmos nomes que o Tailwind usa para container.
 *
 * Ja custou dois modais: `max-w-4xl` virou 64px e `max-w-lg` virou 24px.
 *
 * Registrar `--container-*` no @theme NAO conserta — testado, o espacamento
 * continua vencendo. A unica defesa e nao usar a forma nomeada: escreva
 * `max-w-(--santo-dimension-container-lg)`, que diz o que quer dizer.
 *
 * `w-`, `h-` e `size-` com nome de camiseta seguem validos: ali a escala de
 * espacamento e exatamente o que se quer.
 */
const CONTAINER_TRAP = /\b(max-w|min-w)-(3xs|2xs|xs|sm|md|lg|xl|2xl|3xl|4xl|5xl|6xl|7xl|8xl)\b/g;

/**
 * Mesma armadilha com `none`: o Santo tem space/none (= 0) no @theme, entao
 * `max-w-none` vira max-width: 0 em vez de "sem limite" — ja zerou uma <img>.
 * Para tirar o limite, use `max-w-full` ou nao ponha classe; para zero, `w-0`.
 */
const NONE_TRAP = /(?<![\w-])-?(max-w|min-w|max-h|min-h|w|h|size)-none\b/g;

/* ------------------------------------------------- mapa classe -> token */

const doc = JSON.parse(readFileSync(resolve(root, 'tokens/santods.figma.json'), 'utf8'));
const prefix = doc.meta.cssPrefix;

/** Sufixos validos por namespace do @theme, lidos pelo mesmo themeKeyOf do build. */
const theme = { color: new Set(), spacing: new Set(), radius: new Set() };
for (const entry of buildIndex(doc).values()) {
  const key = themeKeyOf(entry);
  const ns = key && Object.keys(theme).find((n) => key.startsWith(`--${n}-`));
  if (ns) theme[ns].add(key.slice(ns.length + 3));
}
const shadows = new Set(Object.keys(doc.effectStyles));
const textRoles = new Set(Object.keys(doc.textStyles).map(textRoleOf));
const textStyleClasses = new Set(Object.keys(doc.textStyles).map((n) => textStyleClass(n, prefix)));

/** Classes declaradas a mao em lib/ui/controls.css (`@utility x` e `.x`). */
const controlsCss = readFileSync(resolve(root, 'lib/ui/controls.css'), 'utf8');
const controls = new Set([
  ...[...controlsCss.matchAll(/@utility\s+([a-z0-9-]+)/g)].map((m) => m[1]),
  ...[...controlsCss.matchAll(/(?:^|[\s,}])\.([a-z][a-z0-9-]*)/gm)].map((m) => m[1]),
]);

/** Palavras do proprio Tailwind que nao sao valor de design (sem token por tras). */
const KEYWORD = new Set(['transparent', 'current', 'inherit']);
const SPACE_EXTRA = new Set(['0', 'px', 'auto']);
const RADIUS_EXTRA = new Set(['none', 'full']);
const TEXT_KEYWORD = new Set(['left', 'center', 'right', 'justify', 'start', 'end', 'balance', 'pretty', 'nowrap', 'wrap', 'ellipsis', 'clip']);
const BG_KEYWORD = /^(clip|origin|repeat|no-repeat|blend|cover|contain|auto|center|top|bottom|left|right|fixed|local|scroll|none|linear|radial|conic|gradient)\b/;
const BORDER_KEYWORD = new Set(['solid', 'dashed', 'dotted', 'double', 'hidden', 'none', 'collapse', 'separate', '0']);
const BORDER_SIDE = /^(?:x|y|t|r|b|l|s|e)-/;

const color = (v) => theme.color.has(v) || KEYWORD.has(v);
const space = (v) => theme.spacing.has(v) || SPACE_EXTRA.has(v);

/**
 * Familias de token (brand, text, surface, heading...). So se cobra existencia
 * de `bg-`/`text-`/`border-`/`shadow-`/`santo-` cujo sufixo comeca por uma delas:
 * e o que separa `bg-brand-solid` (token errado) de `"text-style"` (chave de objeto).
 */
const family = (v) => v.split('-')[0];
const colorFamilies = new Set([...theme.color].map(family));
const roleFamilies = new Set([...textRoles].map(family));
const tokenish = (v) => colorFamilies.has(family(v)) || roleFamilies.has(family(v));

/**
 * Classe com prefixo de token: devolve true (existe), false (nao existe) ou
 * null (nao e classe de token — fora do escopo desta checagem).
 */
function tokenClassExists(cls) {
  if (controls.has(cls)) return true;
  if (cls.startsWith(`${prefix}-`)) {
    return roleFamilies.has(family(cls.slice(prefix.length + 1))) ? textStyleClasses.has(cls) : null;
  }
  const colorish = cls.match(/^(?:bg|text|shadow|border(?:-[xytrblse])?)-(.+)$/);
  if (colorish && !/^(thin|thick|heavy)$/.test(colorish[1]) && !tokenish(colorish[1]) && !/^\d/.test(colorish[1])) {
    return null;
  }

  let m;
  if ((m = cls.match(/^-?(?:p|px|py|pt|pr|pb|pl|ps|pe|m|mx|my|mt|mr|mb|ml|ms|me)-(.+)$/))) return space(m[1]);
  if ((m = cls.match(/^gap(?:-x|-y)?-(.+)$/))) return space(m[1]);
  if ((m = cls.match(/^rounded(?:-(?:t|r|b|l|s|e|tl|tr|br|bl|ss|se|es|ee))?(?:-(.+))?$/))) {
    return m[1] === undefined ? false : theme.radius.has(m[1]) || RADIUS_EXTRA.has(m[1]);
  }
  if ((m = cls.match(/^shadow-(.+)$/))) return shadows.has(m[1]) || color(m[1]);
  if ((m = cls.match(/^text-(.+)$/))) return color(m[1]) || textRoles.has(m[1]) || TEXT_KEYWORD.has(m[1]);
  if ((m = cls.match(/^bg-(.+)$/))) return color(m[1]) || BG_KEYWORD.test(m[1]);
  if ((m = cls.match(/^border-(.+)$/))) {
    const rest = m[1];
    if (BORDER_KEYWORD.has(rest) || rest.startsWith('spacing-')) return true;
    const side = rest.replace(BORDER_SIDE, '');
    // Largura so existe como @utility em controls.css; cor vem do @theme.
    if (/^(thin|thick|heavy)$/.test(side)) return false;
    return color(side) || BORDER_KEYWORD.has(side);
  }
  return null;
}

/* --------------------------------------------------------------- varredura */

/**
 * Conteudo de colchete aceito: so var(--santo-*), sem numero cru em volta.
 * Duas excecoes que nao sao valor de design e nunca terao token: fracao de grade
 * (`1fr`) e a extensao inteira (`100%`, `100dvh`) — `calc(100dvh-var(--santo-…))`
 * e `minmax(var(--santo-…),1fr)` sao a forma certa de usar token nesses casos.
 */
const BRACKET_OK = /var\(--santo-[a-z0-9-]+\)|\b\d+fr\b|\b100(?:%|[dsl]?v[hw])/g;
const rawInBracket = (inner) => /\d/.test(inner.replace(BRACKET_OK, ''));

/** Troca comentario por espaco, mantendo as quebras de linha (e com elas a numeracao). */
const blankComments = (src) =>
  src
    .replace(/\/\*[\s\S]*?\*\//g, (c) => c.replace(/[^\n]/g, ' '))
    .replace(/(^|[^:\\])\/\/.*$/gm, (c, lead) => lead + ' '.repeat(c.length - lead.length));

/**
 * Candidatos a classe, com a linha de cada um: o miolo de todo literal de string
 * do arquivo, inclusive template literal que atravessa linhas. A interpolacao
 * vira espaco, entao o que esta dentro de `${cond ? "a" : "b"}` tambem e checado.
 */
function classTokens(src) {
  const out = [];
  for (const m of src.matchAll(/"([^"\n]*)"|'([^'\n]*)'|`([^`]*)`/g)) {
    const body = m[1] ?? m[2] ?? m[3];
    const start = m.index + 1;
    for (const t of body.replace(/\$\{|[}"']/g, (s) => ' '.repeat(s.length)).matchAll(/\S+/g)) {
      out.push({ token: t[0], line: src.slice(0, start + t.index).split('\n').length, literal: m.index });
    }
  }
  return out;
}

/* ------------------------------------------------------------- motion */

/**
 * Duracao e curva tambem sao token (motion/duration/*, motion/easing/*). O
 * Tailwind traz uma escala propria que passa despercebida: `duration-200`,
 * `ease-in-out`, e — o caso comum — `transition-colors` sozinho, que aplica
 * 150ms e um cubic-bezier padrao sem ninguem ter escolhido.
 *
 * Permitido: duration-(--santo-motion-duration-*), delay-(--santo-motion-duration-*),
 * ease-(--santo-motion-easing-*), var(--santo-motion-*) e as @utility
 * santo-transition-* / santo-animate-* declaradas em lib/ui/motion.css.
 * @keyframes so em lib/ui/motion.css.
 */
const MOTION_CSS = 'lib/ui/motion.css';
const MOTION_TOKEN = /^(duration|delay)-\(--santo-motion-duration-[a-z0-9-]+\)$/;
const EASE_TOKEN = /^ease-\(--santo-motion-easing-[a-z0-9-]+\)$/;
const TRANSITION = /^transition(-(all|colors|opacity|shadow|transform|\[[^\]]+\]))?$/;
const motionUtilities = new Set(
  existsSync(resolve(root, MOTION_CSS))
    ? [...readFileSync(resolve(root, MOTION_CSS), 'utf8').matchAll(/@utility\s+([a-z0-9-]+)/g)].map((m) => m[1])
    : [],
);

/** Problemas de motion de UM literal de classes (a transicao e seus tokens andam juntos). */
function motionProblems(classes) {
  const out = [];
  for (const cls of classes) {
    if (/^(duration|delay)-(\d|\[)/.test(cls)) out.push(`${cls} — duracao solta, use ${cls.split('-')[0]}-(--santo-motion-duration-*)`);
    else if (/^(duration|delay)-\(/.test(cls) && !MOTION_TOKEN.test(cls)) out.push(`${cls} — duracao fora de --santo-motion-duration-*`);
    if (/^ease-(in|out|in-out|linear|\[)/.test(cls)) out.push(`${cls} — curva do Tailwind, use ease-(--santo-motion-easing-*)`);
    else if (/^ease-\(/.test(cls) && !EASE_TOKEN.test(cls)) out.push(`${cls} — curva fora de --santo-motion-easing-*`);
    if (/^animate-(?!none$)/.test(cls)) out.push(`${cls} — keyframe e duracao do Tailwind, use santo-animate-* (lib/ui/motion.css)`);
    if (/^santo-(transition|animate)-/.test(cls) && !motionUtilities.has(cls)) out.push(`${cls} — nao existe @utility ${cls} em ${MOTION_CSS}`);
  }
  if (classes.some((c) => TRANSITION.test(c))) {
    const t = classes.find((c) => TRANSITION.test(c));
    if (!classes.some((c) => MOTION_TOKEN.test(c) && c.startsWith('duration-'))) {
      out.push(`${t} sem duration-(--santo-motion-duration-*) — o Tailwind aplica 150ms por padrao`);
    }
    if (!classes.some((c) => EASE_TOKEN.test(c))) {
      out.push(`${t} sem ease-(--santo-motion-easing-*) — o Tailwind aplica um cubic-bezier padrao`);
    }
  }
  return out;
}

/** Valor de tempo cru (`150ms`, `0.2s`, `${i * 150}ms`) fora de var(--santo-motion-*). */
const RAW_TIME = /(?:\d|\})\s*m?s\b/;
const withoutMotionVars = (s) => s.replace(/var\(--santo-motion-[a-z0-9-]+\)/g, '');

/** `md:hover:!bg-x` -> `bg-x`; variantes com colchete (`[&>*]:`) tambem saem. */
const baseOf = (token) => token.replace(/^(?:[^:[\]]+:|\[[^\]]*\]:)+/, '').replace(/^!|!$/g, '');

/** Sem argumento varre ROOTS; com argumentos, so os arquivos/pastas dados. */
const targets = process.argv.slice(2);
const files = [];
const cssFiles = [];
for (const dir of targets.length ? targets : ROOTS) {
  const walk = (p) => {
    if (!statSync(p).isDirectory()) {
      if (/\.(tsx?|mjs)$/.test(p)) files.push(p);
      else if (/\.css$/.test(p)) cssFiles.push(p);
      return;
    }
    for (const entry of readdirSync(p)) walk(join(p, entry));
  };
  walk(resolve(root, dir));
}

const problems = [];
const exempted = [];

for (const file of Object.keys(HEX_EXEMPT)) {
  if (!existsSync(resolve(root, file))) {
    problems.push(`scripts/check-design.mjs  isencao de hex para ${file}, que nao existe — remova a entrada de HEX_EXEMPT`);
  }
}

for (const file of files) {
  const rel = relative(root, file);
  const lines = readFileSync(file, 'utf8').split('\n');

  lines.forEach((line, i) => {
    const at = `${rel}:${i + 1}`;
    const code = line.replace(/\/\*.*?\*\//g, '');
    if (/^\s*(\/\/|\*|\/\*)/.test(code)) return; // comentario

    const hex = code.match(/#[0-9a-fA-F]{3,8}\b/);
    if (hex) {
      if (HEX_EXEMPT[rel]) exempted.push(`${at}  ${hex[0]}`);
      else problems.push(`${at}  hex solto ${hex[0]} — use um token de cor`);
    }

    for (const cls of code.match(NONE_TRAP) ?? []) {
      problems.push(`${at}  ${cls} resolve por space/none (= 0), nao por "sem limite". Use max-w-full, nenhuma classe, ou w-0 se o zero for de proposito.`);
    }

    for (const cls of code.match(CONTAINER_TRAP) ?? []) {
      problems.push(
        `${at}  ${cls} resolve pela escala de espacamento, nao por largura de container. ` +
          `Use max-w-(--santo-dimension-container-<sm|md|lg|xl|2xl>).`,
      );
    }

    if (/cubic-bezier\(/.test(code)) problems.push(`${at}  cubic-bezier( solto — use var(--santo-motion-easing-*)`);

    // style inline: animationDelay: `${i * 150}ms`, transition: "all 200ms".
    for (const m of code.matchAll(/\b(animation|transition)(Delay|Duration|TimingFunction)?\s*:\s*([^,}]*\}?[^,}]*)/g)) {
      if (RAW_TIME.test(withoutMotionVars(m[3]))) problems.push(`${at}  ${m[1]}${m[2] ?? ''} inline com tempo cru — use var(--santo-motion-duration-*)`);
    }
  });

  const literals = new Map();
  for (const { token, line, literal } of classTokens(blankComments(lines.join('\n')))) {
    const at = `${rel}:${line}`;
    const cls = baseOf(token);
    if (!literals.has(literal)) literals.set(literal, { line, classes: [] });
    literals.get(literal).classes.push(cls);

    // Qualquer utilitario com valor em colchete (`max-w-[68ch]`, `grid-cols-[…]`,
    // `scroll-mt-[13px]`) e propriedade arbitraria (`[--x:4px]`). A variante em
    // colchete (`[&>*]:`) ja saiu em baseOf.
    const bracket = cls.match(/^-?[a-z][\w-]*-\[(.+)\]$/) ?? cls.match(/^\[(-{0,2}[a-z][\w-]*:.+)\]$/);
    if (bracket) {
      if (rawInBracket(bracket[1])) problems.push(`${at}  valor arbitrario ${cls} — use var(--santo-*) ou uma classe de token`);
      continue;
    }

    if (!/^-?[a-z][a-z0-9-]*$/.test(cls) || cls.endsWith('-')) continue;
    if (tokenClassExists(cls) === false) problems.push(`${at}  classe ${cls} nao existe no @theme nem em lib/ui/controls.css`);
  }

  for (const { line, classes } of literals.values()) {
    for (const p of motionProblems(classes)) problems.push(`${rel}:${line}  ${p}`);
  }
}

/* CSS de app/ e lib/ui/: curva, keyframe e tempo cru. Tokens (lib/tokens) ficam fora. */
for (const file of cssFiles) {
  const rel = relative(root, file);
  const src = readFileSync(file, 'utf8').replace(/\/\*[\s\S]*?\*\//g, (c) => c.replace(/[^\n]/g, ' '));
  src.split('\n').forEach((line, i) => {
    const at = `${rel}:${i + 1}`;
    if (/cubic-bezier\(/.test(line)) problems.push(`${at}  cubic-bezier( solto — use var(--santo-motion-easing-*)`);
    if (/@keyframes\b/.test(line) && rel !== MOTION_CSS) problems.push(`${at}  @keyframes fora de ${MOTION_CSS}`);
    // Declaracao em qualquer ponto da linha: `.a { transition: opacity 200ms; }` tambem conta.
    for (const decl of line.matchAll(/(?:^|[{;\s])(transition|animation)(-duration|-delay|-timing-function)?\s*:\s*([^;}]+)/g)) {
      const value = withoutMotionVars(decl[3]);
      if (RAW_TIME.test(value)) problems.push(`${at}  ${decl[1]}${decl[2] ?? ''} com tempo cru — use var(--santo-motion-duration-*)`);
      if (/\b(ease|ease-in|ease-out|ease-in-out|linear)\b/.test(value)) {
        problems.push(`${at}  ${decl[1]}${decl[2] ?? ''} com curva nomeada — use var(--santo-motion-easing-*)`);
      }
    }
  });
}

console.log(`Varridos ${files.length} arquivos + ${cssFiles.length} css em ${(targets.length ? targets : ROOTS).join(', ')}.`);

if (exempted.length) {
  console.log(`\n${exempted.length} hex em arquivo isento (declarado em scripts/check-design.mjs):`);
  for (const [file, why] of Object.entries(HEX_EXEMPT)) {
    const hits = exempted.filter((e) => e.startsWith(file)).length;
    if (hits) console.log(`  ${file} — ${hits}x — ${why}`);
  }
}

if (problems.length) {
  console.error(`\n${problems.length} problema(s):`);
  problems.forEach((p) => console.error('  ' + p));
  process.exit(1);
}

console.log('\nOK — nenhum valor solto nem classe de token inexistente fora das isencoes declaradas.');
