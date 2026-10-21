#!/usr/bin/env node
/**
 * Gera o pacote "Contexto para download" em public/contexto/: o necessario para
 * alguem replicar a arquitetura do SantoDS (tokens, variaveis, componentes, Figma).
 *
 *   npm run contexto        (tambem roda sozinho antes de `npm run build` e `npm run dev`)
 *
 * GERADOS por este script (ignorados pelo git, refeitos a cada build):
 *   02-tokens.md        colecoes, modos, cada variavel (tipo, valor por modo, alias
 *                       resolvido, scopes, description), text/effect styles, convencoes
 *                       de nome (--santo-*, utilitarios Tailwind, classes .santo-*),
 *                       como o emissor funciona e a ordem das camadas
 *   03-componentes.md   inventario de lib/ui/*.meta.ts: slug, nome, tier, categoria,
 *                       frase, props (extraidas pelo TypeScript), par no Figma, arquivos
 *   05-regras-e-rubricas.md  AGENTS.md, skills e manuais dos agentes, integrais, com
 *                       cabecalho de origem (skill/agente novo entra sozinho)
 *   06-figma.md         arquivo, colecoes, fluxo de paridade, estado atual, icones, dividas
 *   santods-contexto-completo.txt   todos os public/contexto/*.md concatenados
 *   indice.json         [{ arquivo, titulo, tamanho, descricao }] para a UI de download
 *
 * ESCRITOS A MAO por outros papeis, no mesmo diretorio (versionados): 00-leia-me,
 * 01-arquitetura, 04-site-de-documentacao. Convencao para todo
 * .md daqui: a 1a linha e `# Titulo`; o blockquote (`> ...`) logo abaixo e o resumo que
 * vai para a descricao do indice.json (sem blockquote, vale o 1o paragrafo de prosa).
 *
 * Por que prebuild/predev e nao scripts/check.mjs: o check.mjs e QA sem efeito
 * colateral; isto ESCREVE arquivos que o site serve, entao tem de existir antes do
 * `next build`/`next dev` — exatamente o que os hooks prebuild/predev do npm garantem.
 *
 * SEGURANCA: nunca le .env* nem segredo. Antes de gravar, recusa saida com caminho
 * absoluto de maquina ou cara de token.
 */
import { existsSync, mkdirSync, readFileSync, readdirSync, writeFileSync } from 'node:fs';
import { dirname, join, relative, resolve } from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';
import ts from 'typescript';
import { CATEGORIES, TIERS } from '../lib/ui/registry.config.ts';
import {
  BRAND_COLLECTIONS,
  brandModes,
  buildIndex,
  isAlias,
  aliasTarget,
  shadowCss,
  shadowVarOf,
  textRoleOf,
  textStyleClass,
  toCss,
  utilityClassOf,
  varNameOf,
} from '../lib/tokens/emit.mjs';
import { variableLine, textStyleLine, effectStyleLine, hashLines } from './parity-hash.mjs';

const root = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const OUT = resolve(root, 'public/contexto');
const rel = (p) => relative(root, p).split('\\').join('/');
const read = (p) => readFileSync(resolve(root, p), 'utf8');

const doc = JSON.parse(read('tokens/santods.figma.json'));
const prefix = doc.meta.cssPrefix;
const index = buildIndex(doc);
const brands = brandModes(doc);
const all = [...index.values()];

/* ------------------------------------------------------------- utilitarios */

const cell = (v) => String(v ?? '').replace(/\|/g, '\\|').replace(/\n/g, ' ');
const code = (v) => (v === '' || v == null ? '' : `\`${String(v).replace(/`/g, "'")}\``);
const table = (head, rows) =>
  [`| ${head.join(' | ')} |`, `|${head.map(() => '---').join('|')}|`, ...rows.map((r) => `| ${r.map(cell).join(' | ')} |`)].join('\n');

/** Trecho de um .md do repo, do cabecalho que casa ate o proximo do mesmo nivel ou acima. */
function section(file, heading) {
  if (!existsSync(resolve(root, file))) return '';
  const lines = read(file).split('\n');
  const start = lines.findIndex((l) => heading.test(l));
  if (start === -1) return '';
  const level = lines[start].match(/^#+/)[0].length;
  const end = lines.findIndex((l, i) => i > start && /^#+\s/.test(l) && l.match(/^#+/)[0].length <= level);
  return lines.slice(start + 1, end === -1 ? undefined : end).join('\n').trim();
}

/**
 * Valor concreto de uma variavel numa combinacao tema x marca. A colecao Color usa o
 * modo de tema; Palette/Brand, o modo de marca; as demais, o modo padrao.
 */
function resolveIn(name, theme, brand) {
  let entry = index.get(name);
  let value = entry.values[theme] ?? entry.values[brand] ?? entry.values[entry.defaultMode];
  const seen = new Set([name]);
  while (isAlias(value)) {
    const target = aliasTarget(value);
    if (seen.has(target)) return '(ciclo)';
    seen.add(target);
    entry = index.get(target);
    if (!entry) return `(alias quebrado: ${target})`;
    value = entry.values[theme] ?? entry.values[brand] ?? entry.values[entry.defaultMode];
  }
  return toCss(name, index.get(name).type, value, prefix);
}

/** Colecoes para onde os aliases de cada colecao apontam. */
function aliasGraph() {
  const edges = new Map();
  for (const v of all) {
    for (const raw of Object.values(v.values)) {
      if (!isAlias(raw)) continue;
      const to = index.get(aliasTarget(raw))?.collection;
      if (!to || to === v.collection) continue;
      if (!edges.has(v.collection)) edges.set(v.collection, new Set());
      edges.get(v.collection).add(to);
    }
  }
  return edges;
}

/* ============================================================ 02-tokens.md */

function tokensMd() {
  const collections = Object.entries(doc.collections);
  const graph = aliasGraph();
  const out = [];

  out.push(`# Tokens e variáveis

Todas as variáveis do SantoDS, coleção por coleção, com o valor em cada modo, o alias resolvido, os scopes e a description, além dos text styles, dos effect styles, das convenções de nome no CSS e no Tailwind e de como o emissor transforma tudo em código. Gerado de \`tokens/santods.figma.json\` por \`scripts/build-contexto.mjs\`.

## Visão geral

- Fonte da verdade no repo: \`tokens/santods.figma.json\`, espelho das Variables e Styles do Figma **${doc.meta.fileName}**. Não se edita à mão; o caminho normal é Figma → dump → snapshot (veja 06-figma.md).
- ${all.length} variáveis em ${collections.length} coleções, ${Object.keys(doc.textStyles).length} text styles, ${Object.keys(doc.effectStyles).length} effect styles.
- Prefixo CSS: \`--${prefix}-\`.
- Marcas (modos de Palette e Brand): ${brands.map((b) => `**${b.name}** (modo \`${b.mode}\`, \`data-brand="${b.id}"\`${b.isDefault ? ', padrão' : ''})`).join('; ')}.

${table(
  ['coleção', 'variáveis', 'modos', 'modo padrão', 'aponta para'],
  collections.map(([name, c]) => [
    name,
    Object.keys(c.variables).length,
    c.modes.join(' / '),
    c.defaultMode,
    [...(graph.get(name) ?? [])].join(', ') || '(valores crus)',
  ]),
)}

## Ordem das camadas

As coleções formam duas cadeias de alias, e nenhuma aponta para trás:

1. **Primitives**: a escala crua (espaço, raio, borda, tamanho, container, ícone, tipo, movimento, camadas). Só valores, nenhum alias para fora da coleção; um degrau pode apontar para outro (\`dimension/radius/8 → dimension/space/8\`).
2. **Brand**: a identidade por marca (id, nome, famílias tipográficas, raio-base). Tem um modo por marca e aponta para Primitives.
3. **Semantic**: os nomes de uso (\`space/md\`, \`radius/md\`, \`border/thin\`, \`focus/width\`). Aponta para Primitives e para Brand (\`radius/md → brand/shape/radius-base\`).
4. **Palette**: as rampas de cor cruas (brand, accent, neutral, success, warning, danger, info). Tem um modo por marca.
5. **Color**: as cores semânticas (\`color/bg/*\`, \`color/text/*\`, \`color/border/*\`, \`color/icon/*\`, \`color/surface/*\`), com os modos **Light/Dark**. Aponta só para Palette.

Resumo: **Primitives → Brand → Semantic** e **Palette → Color**. Trocar de marca troca Palette e Brand; trocar de tema troca Color. A interface só usa Semantic, Color, os text styles e as sombras.

Exemplo de cadeia: \`radius/md → brand/shape/radius-base → dimension/radius/8 → dimension/space/8 → 8px\`.

## Convenções de nome

- **Variável CSS**: \`--${prefix}-\` + caminho do Figma com \`/\` virando \`-\`. Exemplo: \`color/bg/brand/solid/default\` → \`--${prefix}-color-bg-brand-solid-default\`. Vem do \`codeSyntax.WEB\` de cada variável no Figma.
- **Alias** vira \`var(--${prefix}-alvo)\`, preservando a cadeia do Figma.
- **Unidades** derivadas do caminho: \`dimension/*\`, \`type/size/*\` e \`type/leading/*\` em px; \`type/tracking/*\` em em (valor/100); \`motion/duration/*\` em ms; \`type/weight/*\` e \`layer/*\` sem unidade; \`motion/easing/*\` cru.
- **Utilitários Tailwind v4** (\`lib/tokens/theme.css\`, \`@theme inline\`): \`color/bg/*\` perde o segmento \`bg\` (\`bg-brand-solid-default\`); as outras famílias mantêm o prefixo (\`text-text-primary\`, \`border-border-subtle\`, \`bg-surface-page\`). \`space/*\` vira \`p-md\`, \`gap-lg\` etc.; \`radius/*\` vira \`rounded-md\`; também entram pesos, tracking, leading, easing, sombras (\`shadow-md\`) e papéis de texto (\`text-heading-1\`).
- **De propósito fora do Tailwind**: a escala numérica (\`p-4\` = 1rem) fica intacta; \`dimension/space/N\` não vira \`--spacing-N\`; \`dimension/container/*\` não entra no \`@theme\` (use \`var(--${prefix}-dimension-container-lg)\`).
- **Classes de texto**: uma por text style, \`.${prefix}-<papel>-<peso>\` (\`.${prefix}-heading-1-semibold\`), em \`lib/tokens/typography.css\`.
- **Tema e marca no HTML**: \`data-theme="light|dark"\` no \`:root\` (sem ele, segue o sistema); \`data-brand="<id>"\` em qualquer elemento (sem ele, vale a marca padrão).

## Como o emissor funciona

\`lib/tokens/emit.mjs\` é o único caminho de renderização. É um módulo puro (sem disco, sem Node), roda igual no build (\`scripts/build-tokens.mjs\`, \`npm run tokens\`) e no browser. Gera:

${table(
  ['arquivo', 'conteúdo'],
  [
    ['`lib/tokens/tokens.css`', `variáveis \`--${prefix}-*\`: as coleções sem modo no \`:root\`, Color Light no \`:root\`, Color Dark em \`@media (prefers-color-scheme: dark)\` com guarda \`:root:not([data-theme='light'])\` e em \`:root[data-theme='dark']\`; um bloco \`[data-brand='<id>']\` por marca, que redeclara Palette, Brand e tudo que depende delas (porque \`var()\` é resolvido onde a custom property é declarada), com as mesmas variantes de tema escuro`],
    ['`lib/tokens/typography.css`', `uma classe \`.${prefix}-*\` por text style, ligada às variáveis de tipo`],
    ['`lib/tokens/theme.css`', '`@theme inline` do Tailwind v4 apontando para as variáveis, o que deixa a troca de tema e marca em runtime funcionar'],
    ['`lib/tokens/index.ts`', 'tokens tipados: `token` (var()), `resolved`, `colorLight`/`colorDark`, `textStyles`, `shadows`, `collections` e `brands` (quando há mais de uma marca)'],
  ],
)}

Regras: nada em \`lib/tokens/\` é editado à mão, exceto \`emit.mjs\`, \`types.ts\` e os \`.d.ts\`. Valor errado no CSS significa snapshot desatualizado ou emissor com bug. Depois de mexer em token, rode \`npm run tokens && npm run tokens:check\`.`);

  for (const [name, c] of collections) {
    const vars = all.filter((v) => v.collection === name);
    const isColor = name === 'Color';
    const isBrandish = BRAND_COLLECTIONS.includes(name);
    out.push(`## Coleção ${name}\n\n${vars.length} variáveis. Modos: ${c.modes.map((m) => `\`${m}\``).join(', ')} (padrão \`${c.defaultMode}\`).`);

    let head;
    let rows;
    if (isColor) {
      const combos = brands.flatMap((b) => c.modes.map((m) => [b, m]));
      head = ['variável', 'tipo', ...c.modes.map((m) => `${m} (alias)`), ...combos.map(([b, m]) => `${b.id} ${m}`), 'CSS', 'Tailwind', 'scopes', 'description'];
      rows = vars.map((v) => [
        code(v.name),
        v.type,
        ...c.modes.map((m) => code(v.values[m])),
        ...combos.map(([b, m]) => code(resolveIn(v.name, m, b.mode))),
        code(varNameOf(v.name, prefix)),
        code(utilityClassOf(v) ?? ''),
        v.scopes.join(', '),
        v.description,
      ]);
    } else {
      const brandCols = isBrandish ? c.modes : [c.defaultMode];
      head = [
        'variável',
        'tipo',
        ...brandCols.map((m) => (isBrandish ? `${m} (valor)` : 'valor')),
        ...brandCols.map((m) => (isBrandish ? `${m} (resolvido)` : 'resolvido')),
        'CSS',
        'Tailwind',
        'scopes',
        'description',
      ];
      rows = vars.map((v) => [
        code(v.name),
        v.type,
        ...brandCols.map((m) => code(v.values[m] ?? v.values[v.defaultMode])),
        // Sem tema (so a Color tem): resolve no modo de marca da coluna.
        ...brandCols.map((m) => code(resolveIn(v.name, null, m))),
        code(varNameOf(v.name, prefix)),
        code(utilityClassOf(v) ?? ''),
        v.scopes.join(', '),
        v.description,
      ]);
    }
    out.push(table(head, rows));
  }

  out.push(`## Text styles\n\n${Object.keys(doc.textStyles).length} estilos. Classe CSS: \`.${prefix}-<papel>-<peso>\`; utilitário de papel: \`text-<papel>\`.`);
  out.push(
    table(
      ['style (Figma)', 'classe', 'família', 'estilo', 'tamanho', 'entrelinha', 'tracking', 'caixa', 'variáveis ligadas'],
      Object.entries(doc.textStyles).map(([n, s]) => [
        code(n),
        code(`.${textStyleClass(n, prefix)}`),
        s.fontFamily,
        s.fontStyle,
        `${s.fontSize}px`,
        s.lineHeight.unit === 'AUTO' ? 'auto' : `${s.lineHeight.value}${s.lineHeight.unit === 'PIXELS' ? 'px' : '%'}`,
        `${s.letterSpacing.value}${s.letterSpacing.unit === 'PERCENT' ? '%' : 'px'}`,
        s.textCase,
        Object.entries(s.boundVariables ?? {}).map(([k, t]) => `${k}: ${t}`).join('; '),
      ]),
    ),
  );
  out.push(`Papéis: ${[...new Set(Object.keys(doc.textStyles).map(textRoleOf))].map(code).join(', ')}.`);

  out.push(`## Effect styles\n\n${Object.keys(doc.effectStyles).length} sombras. Variável: \`--${prefix}-shadow-<nome>\`; utilitário: \`shadow-<nome>\`.`);
  out.push(
    table(
      ['nome', 'variável', 'box-shadow', 'camadas (tipo x y blur spread cor)'],
      Object.entries(doc.effectStyles).map(([n, s]) => [
        code(n),
        code(shadowVarOf(n, prefix)),
        code(shadowCss(s.effects)),
        s.effects.map((e) => `${e.type} ${e.x} ${e.y} ${e.blur} ${e.spread} ${e.color}`).join(' / ') || '(nenhuma)',
      ]),
    ),
  );
  return out.join('\n\n') + '\n';
}

/* ======================================================= 03-componentes.md */

async function loadMetas() {
  const ui = resolve(root, 'lib/ui');
  const metas = [];
  for (const file of readdirSync(ui).filter((f) => f.endsWith('.meta.ts')).sort()) {
    const mod = await import(pathToFileURL(join(ui, file)).href);
    for (const list of Object.values(mod)) {
      if (Array.isArray(list)) for (const m of list) metas.push({ ...m, metaFile: file });
    }
  }
  return metas;
}

/** Inventário do README agrupado pelo tier dos metas, preservando notas de uso. */
function syncUiReadme(metas) {
  const file = resolve(root, 'lib/ui/README.md');
  const before = readFileSync(file, 'utf8');
  const descriptions = new Map();
  for (const row of before.matchAll(/^\| (.*?) \| (.*) \|$/gm)) {
    for (const name of row[1].matchAll(/`([\w.]+)`/g)) {
      if (!descriptions.has(name[1])) descriptions.set(name[1], row[2]);
    }
  }
  const inventory = TIERS.map((tier) => {
    const entries = metas.filter((meta) => meta.tier === tier.id).sort((a, b) => a.name.localeCompare(b.name, 'pt-BR'));
    const rows = entries.map((meta) => `| ${code(meta.name)} | ${descriptions.get(meta.name) ?? cell(meta.description)} |`);
    return `## ${tier.label}\n\n${entries.length} componentes.\n\n| Componente | Quando usar |\n|---|---|\n${rows.join('\n')}`;
  }).join('\n\n');
  const after = before.replace(/<!-- ui-inventory:start -->[\s\S]*?<!-- ui-inventory:end -->/, `<!-- ui-inventory:start -->\n\n${inventory}\n\n<!-- ui-inventory:end -->`);
  if (before !== after) writeFileSync(file, after);
}

/** Props declaradas no proprio repo para o componente exportado `name` em `source`. */
function propsExtractor() {
  const configPath = ts.findConfigFile(root, ts.sys.fileExists, 'tsconfig.json');
  const parsed = ts.parseJsonConfigFileContent(ts.readConfigFile(configPath, ts.sys.readFile).config, ts.sys, root);
  const files = readdirSync(resolve(root, 'lib/ui'))
    .filter((f) => /\.tsx?$/.test(f) && !f.endsWith('.d.ts'))
    .map((f) => resolve(root, 'lib/ui', f));
  const program = ts.createProgram(files, { ...parsed.options, noEmit: true });
  const checker = program.getTypeChecker();
  const fromRepo = (d) => !d.getSourceFile().fileName.includes('node_modules');

  return (source, name) => {
    const sf = program.getSourceFile(resolve(root, 'lib/ui', source));
    if (!sf) return null;
    const symbol = checker.getExportsOfModule(checker.getSymbolAtLocation(sf)).find((s) => s.name === name);
    if (!symbol) return null;
    const target = symbol.flags & ts.SymbolFlags.Alias ? checker.getAliasedSymbol(symbol) : symbol;
    const type = checker.getTypeOfSymbolAtLocation(target, sf);
    const sig = type.getCallSignatures()[0];
    const param = sig?.getParameters()[0];
    if (!param) return { own: [], native: 0 };
    const propsType = checker.getTypeOfSymbolAtLocation(param, sf);
    const own = [];
    let native = 0;
    for (const p of propsType.getProperties()) {
      const decls = p.getDeclarations() ?? [];
      if (!decls.some(fromRepo)) {
        native++;
        continue;
      }
      const optional = (p.flags & ts.SymbolFlags.Optional) !== 0;
      const pt = checker.getTypeOfSymbolAtLocation(p, sf);
      // Uniao so de literais (variantes) sai expandida: `"primary" | "secondary"`, nao `ButtonVariant`.
      const parts = (pt.isUnion() ? pt.types : [pt]).filter((x) => !(x.flags & ts.TypeFlags.Undefined));
      const literal = (x) => x.isStringLiteral() || x.isNumberLiteral() || (x.flags & ts.TypeFlags.BooleanLiteral) !== 0;
      let t;
      if (parts.length > 1 && parts.every(literal)) {
        const bools = parts.filter((x) => x.flags & ts.TypeFlags.BooleanLiteral);
        t = [
          ...parts.filter((x) => !(x.flags & ts.TypeFlags.BooleanLiteral)).map((x) => JSON.stringify(x.value)),
          ...(bools.length === 2 ? ['boolean'] : bools.map((x) => checker.typeToString(x))),
        ].join(' | ');
      } else {
        t = checker.typeToString(pt, sf, ts.TypeFormatFlags.NoTruncation);
        if (optional) t = t.replace(/ \| undefined$/, '');
      }
      // O TS qualifica tipos de outro arquivo com import("<caminho absoluto>"): fica so o nome.
      t = t.replace(/import\("[^"]*"\)\./g, '');
      own.push(`${p.name}${optional ? '?' : ''}: ${t.length > 140 ? `${t.slice(0, 137)}...` : t}`);
    }
    return { own, native };
  };
}

async function componentesMd() {
  const metas = await loadMetas();
  syncUiReadme(metas);
  const inventory = JSON.parse(read('tokens/santods.components.json'));
  const pairBySlug = new Map(inventory.components.filter((c) => c.code).map((c) => [c.code.slug, c]));
  const pagePair = new Map(inventory.pagePairs.map((p) => [p.slug, p]));
  const registry = read('lib/ui/registry.ts');
  const label = Object.fromEntries(CATEGORIES.map((c) => [c.id, c.label]));
  const propsOf = propsExtractor();
  const exists = (p) => existsSync(resolve(root, p));

  const order = (m) => [TIERS.findIndex((tier) => tier.id === m.tier), CATEGORIES.findIndex((c) => c.id === m.category)];
  const sorted = [...metas].sort((a, b) => {
    const [x, y] = [order(a), order(b)];
    return x[0] - y[0] || x[1] - y[1] || a.name.localeCompare(b.name, 'pt-BR');
  });
  const notInRegistry = metas.filter((m) => !registry.includes(`./${m.metaFile.replace(/\.ts$/, '')}`));

  const figmaOf = (m) => {
    const pair = pairBySlug.get(m.slug);
    if (pair) return `**${pair.name}** (\`${pair.nodeId}\`, ${pair.type === 'COMPONENT_SET' ? `${pair.variantCount} variantes` : 'componente'})`;
    if (pagePair.has(m.slug)) return `página **${pagePair.get(m.slug).page}** do Figma (inventário em \`${pagePair.get(m.slug).inventory}\`)`;
    return '**codeOnly** (sem par no Figma ainda)';
  };

  const out = [];
  const tierCount = (t) => metas.filter((m) => m.tier === t).length;
  out.push(`# Componentes

Inventário completo de \`lib/ui\`: ${metas.length} componentes (${TIERS.map((tier) => `${tierCount(tier.id)} ${tier.label.toLocaleLowerCase('pt-BR')}`).join(', ')}), cada um com nome, camada (\`tier\`), categoria, quando usar, props, par no Figma e arquivos. Gerado de \`lib/ui/*.meta.ts\`, do TypeScript dos \`.tsx\` e de \`tokens/santods.components.json\` por \`scripts/build-contexto.mjs\`.

## Como um componente é montado

- \`lib/ui/<modulo>.tsx\`: o componente. Usa só tokens (classes Tailwind do \`@theme\`, \`.${prefix}-*\` e \`var(--${prefix}-*)\`), sem nenhum valor solto.
- \`lib/ui/<modulo>.meta.ts\`: dado puro, do tipo \`ComponentMeta\` (\`name\`, \`slug\`, \`category\`, \`tier\`, \`description\` = quando usar, \`source\`, \`related\`, \`figma\`). É importado em \`lib/ui/registry.ts\`, que alimenta o índice \`/componentes\`, a sidebar, a busca e o check de par.
- \`lib/ui/<modulo>.demo.tsx\`: as demos vivas (e o playground), registradas em \`lib/ui/demos.ts\`.
- \`lib/thumbs/<slug>.thumb.tsx\`: a miniatura em esqueleto do índice.
- \`lib/ui/index.ts\`: o barrel \`@/lib/ui\`.
- Página: \`/componentes/<slug>\`.

**Camada (tier).** PRIMITIVO é um bloco atômico e genérico, sem significado de produto, que não importa outro componente de \`lib/ui\` além de Icon (conteúdo de fora entra por slot). SEMÂNTICO carrega um papel de produto ou aplicação. MARKETING tem uso principal em landing, materiais e apresentações comerciais. Cada meta declara uma única camada, usada pela sidebar, índice, README e este contexto. \`npm run tier:check\` valida as camadas e a restrição de composição dos primitivos.

**Par no Figma.** \`figma: { name }\` no meta declara o par. Sem ele, o componente é **codeOnly**, uma divergência a resolver (princípio: Figma e repositório caminham juntos). Hoje: ${inventory.meta.summary.figmaComponents} componentes no Figma, ${inventory.meta.summary.paired} com par; só no Figma: ${inventory.meta.summary.figmaOnly.join(', ') || 'nenhum'}; ${inventory.meta.summary.codeOnly.length} codeOnly.

**Props.** As props listadas abaixo são as declaradas no próprio repo, extraídas pelo TypeScript. Quando o componente também aceita atributos nativos do HTML (\`ButtonHTMLAttributes\` etc.), aparece "+ N atributos nativos".

## Resumo

${table(
  ['slug', 'nome', 'tier', 'categoria', 'Figma'],
  sorted.map((m) => [code(m.slug), m.name, m.tier, label[m.category] ?? m.category, pairBySlug.has(m.slug) || pagePair.has(m.slug) ? 'par' : 'codeOnly']),
)}`);

  for (const tier of TIERS) {
    out.push(`## ${tier.label}`);
    for (const m of sorted.filter((x) => x.tier === tier.id)) {
      const mod = m.metaFile.replace(/\.meta\.ts$/, '');
      const props = propsOf(m.source, m.name);
      const files = [
        `lib/ui/${m.source}`,
        `lib/ui/${m.metaFile}`,
        exists(`lib/ui/${mod}.demo.tsx`) ? `lib/ui/${mod}.demo.tsx` : null,
        exists(`lib/thumbs/${m.slug}.thumb.tsx`) ? `lib/thumbs/${m.slug}.thumb.tsx` : null,
      ].filter(Boolean);
      const propLines = !props
        ? `- Props: não se aplica. \`${m.source}\` não exporta um componente \`${m.name}\` (é módulo de utilitários ou conjunto); veja o fonte.`
        : props.own.length || props.native
          ? `- Props:\n${props.own.map((p) => `  - \`${p}\``).join('\n')}${props.native ? `\n  - + ${props.native} atributos nativos do elemento HTML` : ''}`
          : '- Props: nenhuma.';
      out.push(`### ${m.name} \`${m.slug}\`

${m.description}

- Tier: ${m.tier}. Categoria: ${label[m.category] ?? m.category}.
- Figma: ${figmaOf(m)}.
${m.related?.length ? `- Anda junto com: ${m.related.map(code).join(', ')}.\n` : ''}- Arquivos: ${files.map(code).join(', ')}. Página: \`/componentes/${m.slug}\`.
${propLines}`);
    }
  }
  if (notInRegistry.length) {
    out.push(`## Atenção: metas fora do registry\n\n${notInRegistry.map((m) => `- \`${m.metaFile}\` (${m.slug})`).join('\n')}`);
  }
  return out.join('\n\n') + '\n';
}

/* ============================================================= 06-figma.md */

function figmaMd() {
  const fp = Object.entries(doc.collections).map(([name, c]) => {
    const lines = Object.entries(c.variables).map(([n, d]) => variableLine(n, d.type, d.scopes ?? [], c.modes, d.values ?? { [c.defaultMode]: d.value }, d.description));
    return [name, hashLines(lines), lines.length, c.modes.join('/')];
  });
  fp.push(['textStyles', hashLines(Object.entries(doc.textStyles).map(([n, s]) => textStyleLine(n, s))), Object.keys(doc.textStyles).length, '']);
  fp.push(['effectStyles', hashLines(Object.entries(doc.effectStyles).map(([n, s]) => effectStyleLine(n, s))), Object.keys(doc.effectStyles).length, '']);
  const inventory = JSON.parse(read('tokens/santods.components.json'));
  const manifest = JSON.parse(read('lib/icons/manifest.json'));
  const needed = read('lib/icons/needed.txt').split('\n').map((l) => l.replace(/#.*/, '').trim()).filter(Boolean);
  const ahead = doc.meta.aheadOfFigma;
  const parity = '.claude/agents/figma-parity.md';
  const stylesDivergence = section(parity, /^## Divergencia conhecida: styles/);
  const reconcile = section(parity, /^## Reconciliacao: snapshot a frente do Figma/);
  const debts = section('tokens/README.md', /^## Dívidas conhecidas/);

  return `# Figma e paridade

Como o Figma **${doc.meta.fileName}** e este repositório se mantêm iguais: o arquivo, as coleções, os scripts de leitura e escrita, o fluxo de paridade, o estado atual (o que está à frente de qual lado), os ícones e as dívidas conhecidas. Gerado por \`scripts/build-contexto.mjs\`.

## O arquivo

- fileKey: \`${doc.meta.fileKey}\` (https://www.figma.com/design/${doc.meta.fileKey}).
- ${Object.values(doc.collections).reduce((a, c) => a + Object.keys(c.variables).length, 0)} variáveis em ${Object.keys(doc.collections).length} coleções, ${Object.keys(doc.textStyles).length} text styles, ${Object.keys(doc.effectStyles).length} effect styles. Nenhum paint style nem grid style.
- Páginas de componente: ${inventory.meta.pages.filter((p) => p.components).map((p) => p.name).join(', ')}. A página \`Icones\` (biblioteca Font Awesome colada, milhares de nós) não entra na paridade de tokens: é a fonte única de ícones.
- Todas as variáveis têm \`codeSyntax.WEB\` = \`var(--${prefix}-...)\`. Variável nova sem codeSyntax quebra o padrão.

${table(['coleção', 'variáveis', 'modos'], Object.entries(doc.collections).map(([n, c]) => [n, Object.keys(c.variables).length, c.modes.join(' / ')]))}

## Scripts

${table(
  ['script', 'onde roda', 'o que faz'],
  [
    ['`scripts/figma-fingerprint.js`', 'MCP `use_figma` (só leitura)', 'um hash por coleção/grupo de styles, para comparar com `npm run tokens:fingerprint`'],
    ['`scripts/figma-dump.js`', 'MCP `use_figma` (só leitura)', 'dump completo, no formato exato do snapshot'],
    ['`scripts/parity-hash.mjs`', 'Node', 'serialização canônica + FNV-1a (a mesma do fingerprint do Figma)'],
    ['`scripts/check-parity.mjs`', 'Node', '`npm run tokens:check` (consistência), `<dump>` (diff), `<dump> --write` (adota o Figma), `--fingerprint`'],
    ['`scripts/build-tokens.mjs`', 'Node', '`npm run tokens`: snapshot → `lib/tokens/*` via `emit.mjs`'],
    ['`scripts/figma-brand-mode.js`', 'MCP `use_figma` (ESCRITA)', 'cria/atualiza um modo de marca em Palette e Brand a partir da spec (MODE, SPEC, DESCRIPTIONS), com `DRY_RUN` por padrão'],
    ['`scripts/apply-brand-mode.mjs`', 'Node (exceção)', 'aplica a mesma spec ao snapshot sem Figma e deixa `meta.aheadOfFigma`'],
    ['`scripts/brand-ramp.mjs`', 'Node', 'gera as rampas brand/neutral de uma marca nova casando a luminância da marca padrão'],
    ['`scripts/figma-icons.js` / `figma-icons.mjs`', 'MCP + Node', 'inventário da página Icones, `plan` (nodeIds) e `build` (componentes React)'],
    ['`scripts/figma-icons-rest.mjs`', 'Node + API REST', 'baixa os SVGs por `GET /v1/images` (alternativa ao MCP)'],
    ['`scripts/figma-components.js` / `figma-components-rest.mjs` / `figma-components.mjs`', 'MCP ou REST + Node', 'inventário de componentes do Figma × `lib/ui` → `tokens/santods.components.json`'],
  ],
)}

Acesso: o MCP do Figma (OAuth) lê e escreve tudo. A API REST, com um token pessoal guardado fora do git e lido do ambiente, cobre imagens, styles, componentes e nós. **Variables pela REST é exclusivo do Enterprise**: num plano Pro, ler e escrever variáveis exige o MCP.

## Fluxo de paridade

**Checagem (barata).** Cole \`figma-fingerprint.js\` no \`use_figma\` e compare, hash por hash, com \`npm run tokens:fingerprint\`. Se todos baterem (inclusive contagens e modos), a paridade está 100% e não há mais nada a fazer.

**Sincronização Figma → código.**

1. \`figma-dump.js\` no \`use_figma\`; grave a saída num arquivo temporário.
2. \`node scripts/check-parity.mjs <dump.json>\` lista cada divergência (\`novo\`, \`removido\`, \`alterado\`).
3. Mostre a lista a quem decide antes de gravar: token removido ou renomeado quebra consumidor.
4. \`node scripts/check-parity.mjs <dump.json> --write && npm run tokens\`, depois \`tsc\` e build.
5. Rode o fingerprint de novo e atualize a tabela de hashes de referência.

**Código → Figma.** Só quando pedirem explicitamente, em passos pequenos, e depois rodando a checagem.

**Marca nova.** Gere as rampas (\`brand-ramp.mjs\`), escreva a spec em \`figma-brand-mode.js\`, rode-o no Figma com \`DRY_RUN = true\` e depois \`false\`, e sincronize. Só se o Figma estiver inacessível, e com autorização: \`apply-brand-mode.mjs\` no snapshot, com reconciliação depois.

## Estado atual

Hashes do snapshot agora (\`npm run tokens:fingerprint\`):

${table(['grupo', 'hash', 'qtd', 'modos'], fp.map(([n, h, q, m]) => [n, code(h), q, m]))}

${
  ahead
    ? [
        `**Snapshot à frente do Figma** em ${ahead.collections.join(' e ')}: o modo \`${ahead.mode}\` foi aplicado ao snapshot em ${ahead.since} por \`${ahead.by}\` (${ahead.why}). \`tokens:check\` avisa enquanto isso valer.`,
        // Outras aplicacoes por script ficam em meta.aheadOfFigma.also, uma por tag (ex.: nivel-b do Estudio).
        ...(ahead.also ?? []).map(
          (a) =>
            `**Snapshot à frente do Figma (\`meta.aheadOfFigma.also\`, tag \`${a.tag}\`)** em ${a.collections.join(' e ')} e ${a.styles}: aplicado em ${a.since} por \`${a.by}\` (${a.why}) Reconciliar: ${a.reconcile}.`,
        ),
      ].join('\n\n')
    : 'Snapshot e Figma alinhados nas variáveis (sem `meta.aheadOfFigma`).'
}

${stylesDivergence ? `### Figma à frente do snapshot (styles)\n\n${stylesDivergence}` : ''}

${reconcile ? `### Reconciliação do snapshot à frente do Figma\n\n${reconcile}` : ''}

## Ícones

- Fonte única: a página \`Icones\` do Figma. Só os ícones em uso vão para o git: \`lib/icons/\` (um componente React por ícone, \`svg/\`, \`index.ts\`, \`manifest.json\`), gerado a partir de \`lib/icons/needed.txt\`, o único arquivo editado à mão ali.
- Hoje: ${needed.length} variantes pedidas, ${Object.keys(manifest.icons).length} ícones exportados. Pesos: ${(manifest.weights ?? []).join(', ')}.
- Ícone novo: adicione o slug em \`needed.txt\` (\`slug\` ou \`slug:solid|light|duotone\`, com apelidos pt-BR depois de \`|\`). \`node scripts/figma-icons.mjs plan\` mostra o nodeId (o inventário da página fica em cache local fora do git). Baixe o SVG pelo MCP (\`download_assets\`) ou pela REST (\`scripts/figma-icons-rest.mjs <dir> --build\`) e rode \`node scripts/figma-icons.mjs build <dir>\`.
- Componente React: PascalCase do slug + \`Icon\` (\`magnifying-glass\` → \`MagnifyingGlassIcon\`), tamanho por token, cor por \`currentColor\`.

## Componentes no Figma

${table(
  ['Figma', 'nodeId', 'tipo', 'variantes', 'par no código'],
  inventory.components.map((c) => [c.name, code(c.nodeId), c.type, c.variantCount, c.code ? code(c.code.slug) : '(sem par)']),
)}

${inventory.meta.summary.codeOnly.length} componentes só no código (codeOnly), listados em 03-componentes.md.

${debts ? `## Dívidas conhecidas\n\n${debts.replace(/^### /gm, '### ')}` : ''}
`.replace(/\n{3,}/g, '\n\n');
}

/* ================================================= 05-regras-e-rubricas.md */

/**
 * Os textos normativos, integrais, com cabecalho de origem: AGENTS.md, as skills do
 * projeto e os manuais dos agentes. Os conhecidos saem na ordem abaixo; skill ou
 * agente novo entra sozinho no fim, para o arquivo nunca envelhecer.
 */
const NORMATIVOS = [
  ['AGENTS.md', 'regras inegociáveis do repo'],
  ['.claude/skills/santo-ui-craft/SKILL.md', 'craft de interface, regra ANTI-GENÉRICO e a rubrica de aprovação'],
  ['.claude/skills/santo-vitrine/SKILL.md', 'gramática das miniaturas de componente'],
  ['.claude/skills/santo-maestro/SKILL.md', 'o maestro, o time, o roteamento e a delegação'],
  ['.claude/agents/figma-parity.md', 'manual de paridade com o Figma'],
  ['.claude/agents/santo-design.md', 'manual de quem desenha e revisa interface'],
];

function regrasMd() {
  const listDir = (dir, pick) => (existsSync(resolve(root, dir)) ? readdirSync(resolve(root, dir)).sort().map(pick).filter(Boolean) : []);
  const discovered = [
    ...listDir('.claude/skills', (d) => (existsSync(resolve(root, '.claude/skills', d, 'SKILL.md')) ? `.claude/skills/${d}/SKILL.md` : null)),
    ...listDir('.claude/agents', (f) => (f.endsWith('.md') ? `.claude/agents/${f}` : null)),
  ];
  const known = new Map(NORMATIVOS);
  const sources = [
    ...NORMATIVOS.map(([p]) => p).filter((p) => existsSync(resolve(root, p))),
    ...discovered.filter((p) => !known.has(p)),
  ];
  /** Rotulo de um arquivo novo: a 1a frase da `description` do frontmatter. */
  const labelOf = (p) => {
    if (known.has(p)) return known.get(p);
    const desc = read(p).match(/^description:\s*(.+)$/m)?.[1] ?? '';
    return desc.split(/(?<=\.)\s/)[0] || 'texto normativo';
  };

  const head = `# SantoDS — regras e rubricas

> Os textos normativos do SantoDS, **integrais**, copiados dos arquivos de origem no
> repositório a cada build (gerado por \`scripts/build-contexto.mjs\`). Cada seção abre com o
> caminho do original. Em caso de divergência, vale o original. Os frontmatters YAML das
> skills e dos agentes estão preservados.

Conteúdo:

${sources.map((p, i) => `${i + 1}. \`${p}\`: ${labelOf(p)}`).join('\n')}
`;
  const body = sources.map(
    (p, i) => `
---

## ${i + 1}. Origem: \`${p}\`

<!-- início de ${p} -->

${read(p).trim()}

<!-- fim de ${p} -->
`,
  );
  return `${head}${body.join('')}`;
}

/* ===================================================== indice + completo */

function describe(md) {
  const lines = md.split('\n');
  const t = lines.findIndex((l) => /^# /.test(l));
  const titulo = t === -1 ? '' : lines[t].replace(/^# /, '').trim();
  // Blockquote logo depois do titulo e o resumo do documento (convencao do time).
  const body = lines.slice(t + 1);
  const first = body.findIndex((l) => l.trim());
  if (first !== -1 && /^> /.test(body[first])) {
    const quote = [];
    for (const l of body.slice(first)) {
      if (!/^>/.test(l)) break;
      quote.push(l.replace(/^>\s?/, '').trim());
    }
    const q = quote.join(' ').replace(/`/g, '').replace(/\*\*(.+?)\*\*/g, '$1').trim();
    return { titulo, descricao: q.length > 240 ? `${q.slice(0, 237)}...` : q };
  }
  // Sem resumo: 1o paragrafo de prosa, pulando blocos de codigo, tabelas, listas e citacoes.
  const para = [];
  let fence = false;
  for (const l of lines.slice(t + 1)) {
    if (/^\s*```/.test(l)) {
      if (para.length) break;
      fence = !fence;
      continue;
    }
    if (fence) continue;
    if (!l.trim()) {
      if (para.length) break;
      continue;
    }
    if (/^(#|\||- |\* |\d+\. |> |<)/.test(l)) {
      if (para.length) break;
      continue;
    }
    para.push(l.trim());
  }
  const descricao = para.join(' ').replace(/`/g, '').replace(/\*\*(.+?)\*\*/g, '$1');
  return { titulo, descricao: descricao.length > 240 ? `${descricao.slice(0, 237)}...` : descricao };
}

/** Recusa saida com caminho absoluto de maquina ou cara de segredo. */
function guard(name, text) {
  const bad = [
    [/\/(Users|home|private|var\/folders)\/[^\s`'")]+/, 'caminho absoluto da maquina'],
    [/[A-Za-z]:\\[^\s]+/, 'caminho absoluto (Windows)'],
    [/figd_[A-Za-z0-9_-]{10,}/, 'token do Figma'],
    [/FIGMA_TOKEN\s*=\s*\S/, 'atribuicao de FIGMA_TOKEN'],
    [/(postgres(ql)?|mysql|mongodb):\/\/[^\s]+:[^\s]+@/, 'URL de banco com senha'],
  ];
  for (const [re, what] of bad) {
    const m = text.match(re);
    if (m) {
      console.error(`build-contexto: ${name} contem ${what} — nada foi gravado.`);
      process.exit(1);
    }
  }
}

const generated = {
  '02-tokens.md': tokensMd(),
  '03-componentes.md': await componentesMd(),
  '05-regras-e-rubricas.md': regrasMd(),
  '06-figma.md': figmaMd(),
};
for (const [name, text] of Object.entries(generated)) guard(name, text);

mkdirSync(OUT, { recursive: true });
for (const [name, text] of Object.entries(generated)) writeFileSync(join(OUT, name), text);

const mds = readdirSync(OUT).filter((f) => f.endsWith('.md')).sort();
const docs = mds.map((f) => ({ arquivo: f, texto: readFileSync(join(OUT, f), 'utf8') }));
for (const d of docs) guard(d.arquivo, d.texto);

const COMPLETO = 'santods-contexto-completo.txt';
const completo =
  `SantoDS — contexto completo para replicar a arquitetura\n` +
  `${docs.length} documentos, na ordem: ${docs.map((d) => d.arquivo).join(', ')}\n\n` +
  docs.map((d) => `${'='.repeat(78)}\n${d.arquivo}\n${'='.repeat(78)}\n\n${d.texto.trimEnd()}\n`).join('\n');
guard(COMPLETO, completo);
writeFileSync(join(OUT, COMPLETO), completo);

const bytes = (s) => Buffer.byteLength(s, 'utf8');
const indice = [
  ...docs.map((d) => ({ arquivo: d.arquivo, ...describe(d.texto), tamanho: bytes(d.texto), gerado: d.arquivo in generated })),
  {
    arquivo: COMPLETO,
    titulo: 'Contexto completo',
    descricao: `Todos os ${docs.length} documentos acima num único .txt, para colar inteiro numa conversa ou guardar como referência.`,
    tamanho: bytes(completo),
    gerado: true,
  },
];
writeFileSync(join(OUT, 'indice.json'), JSON.stringify(indice, null, 2) + '\n');

console.log(`${rel(OUT)}/ — ${docs.length} .md (${Object.keys(generated).join(', ')} gerados), ${COMPLETO} e indice.json`);
for (const i of indice) console.log(`  ${i.arquivo.padEnd(32)} ${String(i.tamanho).padStart(8)} bytes  ${i.titulo}`);
