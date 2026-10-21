#!/usr/bin/env node
/**
 * Icones do SantoDS — vem UNICA E EXCLUSIVAMENTE da pagina Icones do Figma.
 *
 *   node scripts/figma-icons.mjs inventory <dump-dir>   grava o cache tokens/.cache/santods.icons.json
 *   node scripts/figma-icons.mjs plan                   lista as variantes a exportar (needed.txt)
 *   node scripts/figma-icons.mjs build <svg-dir>        gera lib/icons/ a partir dos SVGs baixados
 *   node scripts/figma-icons.mjs build                  regera lib/icons/ a partir de lib/icons/svg/
 *
 * O QUE VAI PARA O GIT: so os icones em uso — lib/icons/ (componentes, svg/, index.ts,
 * manifest.json) e needed.txt. O inventario da pagina inteira (~5.4k icones, 1 MB) e CACHE
 * LOCAL regeneravel em tokens/.cache/ (ignorado pelo git), nunca versionado.
 *
 * ICONE NOVO:
 *   1. adicione o slug em lib/icons/needed.txt (slug ou slug:solid|light|duotone), com os
 *      apelidos pt-BR da busca depois de "|": `magnifying-glass | lupa, buscar`;
 *   2. se tokens/.cache/santods.icons.json nao existir, rode o inventario (passos 1-2 abaixo, via MCP);
 *   3. `plan` mostra o nodeId; baixe o SVG (MCP download_assets) e rode `build <svg-dir>`.
 * Sem cache, `plan`/`build` ainda resolvem os slugs ja exportados pelo manifest.json; so slug NOVO
 * exige o inventario, e o erro diz isso.
 *
 * Fluxo:
 *   1. scripts/figma-icons.js (use_figma, so leitura) -> <dump-dir>/inventory-<n>.json
 *   2. `inventory` confere o hash de cada bloco e grava o inventario completo (so metadado).
 *   3. lib/icons/needed.txt diz o que exportar; `plan` imprime o nodeId de cada variante.
 *   4. Cada variante e baixada como SVG (MCP download_assets) para <svg-dir>/<nodeId com - no lugar de :>.svg
 *   5. `build` gera um componente React por icone, index.ts e manifest.json.
 * Nada em lib/icons/ e editado a mao, exceto needed.txt.
 *
 * REGRA DE SLUG (nome do Figma -> slug):
 *   - minusculas; qualquer sequencia fora de [a-z0-9] vira "-"; sem "-" nas pontas
 *     ("bluetooth 5" -> "bluetooth-5", "font-awesome 5" -> "font-awesome-5");
 *   - nome repetido entre os sets ganha sufixo pela ordem do documento: o 2o "plus-circle" vira "plus-circle-2";
 *   - icone de marca cujo slug ja exista entre os sets ganha sufixo "-brand".
 * Componente React: PascalCase do slug + "Icon" (magnifying-glass -> MagnifyingGlassIcon;
 * slug que comeca com digito ganha "N": 500px -> N500pxIcon).
 */
import { existsSync, mkdirSync, readFileSync, readdirSync, rmSync, writeFileSync } from 'node:fs';
import { dirname, join, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const INVENTORY = resolve(root, 'tokens/.cache/santods.icons.json');
const MANIFEST = resolve(root, 'lib/icons/manifest.json');
const OUT = resolve(root, 'lib/icons');
const NEEDED = resolve(OUT, 'needed.txt');
const SVG_CACHE = resolve(OUT, 'svg');
const SNAPSHOT = resolve(root, 'tokens/santods.figma.json');

const [cmd, arg] = process.argv.slice(2);
const fail = (msg) => {
  console.error(msg);
  process.exit(1);
};

function fnv1a(str) {
  let h = 0x811c9dc5;
  for (let i = 0; i < str.length; i++) {
    h ^= str.charCodeAt(i);
    h = Math.imul(h, 0x01000193) >>> 0;
  }
  return h.toString(16).padStart(8, '0');
}

export const slugify = (name) =>
  name
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');

const componentName = (slug) => {
  const pascal = slug.replace(/(^|-)([a-z0-9])/g, (_, __, c) => c.toUpperCase());
  return `${/^[0-9]/.test(pascal) ? 'N' : ''}${pascal}Icon`;
};

/** Inverso de encodeIds de figma-icons.js. */
function decodeIds(encoded) {
  const ids = [];
  let prefix;
  let n;
  for (const token of encoded.split(',')) {
    const abs = token.match(/^\[(\d+):(\d+)\]$/);
    if (abs) {
      prefix = abs[1];
      n = Number(abs[2]);
      ids.push(`${prefix}:${n}`);
      continue;
    }
    const [delta, times = '1'] = token.split('*');
    for (let i = 0; i < Number(times); i++) {
      n += parseInt(delta, 36);
      ids.push(`${prefix}:${n}`);
    }
  }
  return ids;
}

/* ------------------------------------------------------------ inventory */

function inventory(dir) {
  if (!dir) fail('Uso: node scripts/figma-icons.mjs inventory <dump-dir>');
  const read = (n) => {
    const file = join(dir, `inventory-${n}.json`);
    if (!existsSync(file)) fail(`Falta ${file}. Rode scripts/figma-icons.js com CHUNK = ${n}.`);
    const { hash, ...payload } = JSON.parse(readFileSync(file, 'utf8'));
    if (fnv1a(JSON.stringify(payload)) !== hash) fail(`Hash nao confere em ${file}: a copia do retorno do MCP esta corrompida.`);
    return payload;
  };
  const meta = read(0);
  if (meta.irregularSets.length) fail(`Sets fora do padrao (variantes/tamanho): ${JSON.stringify(meta.irregularSets)}`);

  const sets = [];
  for (let n = 1; n < meta.chunks; n++) {
    const chunk = read(n);
    const ids = decodeIds(chunk.ids);
    if (ids.length !== chunk.names.length) fail(`Bloco ${n}: ${ids.length} ids para ${chunk.names.length} nomes.`);
    chunk.names.forEach((name, i) => sets.push({ name, id: ids[i] }));
  }
  if (sets.length !== meta.totalSets) fail(`Esperava ${meta.totalSets} sets, montei ${sets.length}.`);
  const brandIds = decodeIds(meta.brands.ids);
  if (brandIds.length !== meta.totalBrands) fail(`Esperava ${meta.totalBrands} marcas, montei ${brandIds.length}.`);

  const icons = {};
  const seen = new Map();
  for (const s of sets) {
    const base = slugify(s.name);
    const count = (seen.get(base) ?? 0) + 1;
    seen.set(base, count);
    const slug = count === 1 ? base : `${base}-${count}`;
    const setNum = Number(s.id.split(':')[1]);
    const prefixId = s.id.split(':')[0];
    icons[slug] = {
      name: s.name,
      kind: 'icon',
      frame: 'ICones',
      nodeId: s.id,
      size: meta.variantSize,
      variants: Object.fromEntries(
        meta.weights.map((w, i) => [w.toLowerCase(), `${prefixId}:${setNum + meta.variantOffsets[i]}`]),
      ),
    };
  }
  meta.brands.names.forEach((name, i) => {
    let slug = slugify(name);
    if (icons[slug]) slug = `${slug}-brand`;
    if (icons[slug]) fail(`Slug duplicado mesmo com sufixo: ${slug}`);
    icons[slug] = { name, kind: 'brand', frame: 'Brand', nodeId: brandIds[i], size: meta.brands.sizes[i] };
  });

  const { meta: figmaMeta } = JSON.parse(readFileSync(SNAPSHOT, 'utf8'));
  const out = {
    meta: {
      fileKey: figmaMeta.fileKey,
      fileName: figmaMeta.fileName,
      page: meta.page,
      pageId: meta.pageId,
      dumpedAt: new Date().toISOString().slice(0, 10),
      generatedBy: 'scripts/figma-icons.mjs inventory',
      note: 'GERADO. Nao editar a mao. Inventario so de metadado; SVG sai sob demanda (lib/icons/needed.txt).',
      weights: meta.weights.map((w) => w.toLowerCase()),
      counts: { sets: sets.length, brands: brandIds.length, total: Object.keys(icons).length },
    },
    icons,
  };
  // Uma linha por icone: ~5.4k entradas, legivel em diff sem inflar o arquivo.
  const rows = Object.entries(icons).map(([slug, icon]) => `  ${JSON.stringify(slug)}: ${JSON.stringify(icon)}`);
  mkdirSync(dirname(INVENTORY), { recursive: true });
  writeFileSync(INVENTORY, `{\n"meta": ${JSON.stringify(out.meta, null, 2)},\n"icons": {\n${rows.join(',\n')}\n}\n}\n`);
  console.log(
    `tokens/.cache/santods.icons.json (cache local, fora do git) — ${out.meta.counts.sets} sets (x${meta.weights.length} pesos) + ${out.meta.counts.brands} marcas = ${out.meta.counts.total} icones.`,
  );
}

/* ----------------------------------------------------------------- needed */

/**
 * Fonte dos metadados: o inventario em cache; sem ele, o manifest versionado (que so conhece os
 * icones ja exportados). Devolve { icons, meta, fromCache }.
 */
function loadSource() {
  if (existsSync(INVENTORY)) return { ...JSON.parse(readFileSync(INVENTORY, 'utf8')), fromCache: true };
  if (!existsSync(MANIFEST)) fail(INVENTORY_HELP);
  const manifest = JSON.parse(readFileSync(MANIFEST, 'utf8'));
  const icons = {};
  for (const [slug, e] of Object.entries(manifest.icons)) {
    icons[slug] = e.figma.kind === 'brand'
      ? { name: e.figma.name, kind: 'brand', nodeId: e.figma.nodeId }
      : { name: e.figma.name, kind: 'icon', nodeId: e.figma.setNodeId, variants: { [e.figma.weight]: e.figma.nodeId } };
  }
  const meta = { fileKey: manifest.fileKey, page: manifest.page, pageId: manifest.pageId, weights: manifest.weights ?? ['light', 'regular', 'solid', 'duotone'] };
  return { icons, meta, fromCache: false };
}

const INVENTORY_HELP = `Falta o inventario da pagina Icones (cache local tokens/.cache/santods.icons.json, fora do git).
Para gera-lo: rode scripts/figma-icons.js via MCP use_figma (so leitura) com CHUNK = 0, 1, 2... ate done,
grave cada retorno como <dir>/inventory-<CHUNK>.json e rode: node scripts/figma-icons.mjs inventory <dir>`;

function loadNeeded() {
  const { icons, meta, fromCache } = loadSource();
  const lines = readFileSync(NEEDED, 'utf8')
    .split('\n')
    .map((l) => l.replace(/#.*/, '').trim())
    .filter(Boolean);
  const missing = [];
  const wanted = [];
  for (const raw of lines) {
    // `slug[:peso] | apelido, apelido` — apelidos pt-BR para a busca da galeria.
    const [line, aliasPart = ''] = raw.split('|').map((x) => x.trim());
    const aliases = aliasPart.split(',').map((a) => a.trim()).filter(Boolean);
    const [slug, weightArg] = line.split(':');
    const icon = icons[slug];
    if (!icon) {
      missing.push(slug);
      continue;
    }
    if (!fromCache && icon.kind === 'icon' && !icon.variants[weightArg ?? 'regular']) {
      missing.push(line);
      continue;
    }
    if (icon.kind === 'brand') {
      if (weightArg) fail(`${slug} e icone de marca: nao tem peso (${line}).`);
      wanted.push({ slug, icon, weight: null, nodeId: icon.nodeId, aliases });
      continue;
    }
    const weight = weightArg ?? 'regular';
    if (!meta.weights.includes(weight)) fail(`Peso invalido em "${line}". Validos: ${meta.weights.join(', ')}.`);
    wanted.push({ slug, icon, weight, nodeId: icon.variants[weight], aliases });
  }
  if (missing.length && !fromCache) {
    fail(`Icone(s) novo(s) em needed.txt, fora do manifest atual: ${missing.join(', ')}\n\n${INVENTORY_HELP}`);
  }
  if (missing.length) {
    const hint = (s) => {
      const near = Object.keys(icons)
        .filter((k) => k.length > 2 && (k.includes(s) || s.includes(k)))
        .slice(0, 5);
      return near.length ? ` (parecidos: ${near.join(', ')})` : '';
    };
    fail(`Slug nao existe na pagina Icones do Figma:\n${missing.map((s) => `  ${s}${hint(s)}`).join('\n')}`);
  }
  const dup = wanted.map((w) => w.slug).filter((s, i, a) => a.indexOf(s) !== i);
  if (dup.length) fail(`Slug repetido em needed.txt: ${[...new Set(dup)].join(', ')}`);
  return { wanted, meta };
}

function plan() {
  const { wanted } = loadNeeded();
  for (const w of wanted) console.log(`${w.nodeId}\t${w.slug}${w.weight ? `:${w.weight}` : ''}`);
  console.error(`${wanted.length} variantes.`);
}

/* ------------------------------------------------------------------ build */

/** Le o SVG exportado pelo Figma e devolve viewBox + caminhos. Falha em qualquer coisa inesperada. */
function parseSvg(svg, where) {
  const viewBox = svg.match(/<svg[^>]*\sviewBox="([^"]+)"/)?.[1];
  if (!viewBox) fail(`${where}: SVG sem viewBox.`);
  // A exportacao do no traz o fundo do canvas (#1E1E1E) e o retangulo do frame
  // pai como <rect>. Icone FA/marca e so <path>, entao <rect> e sempre fundo.
  const body = svg
    .replace(/<\?xml[^>]*>/, '')
    .replace(/<rect\b[^>]*\/>/g, '')
    .replace(/<defs>[\s\S]*?<\/defs>/g, '')
    .replace(/<\/?g[^>]*>/g, '')
    .replace(/<\/?svg[^>]*>/g, '');
  const paths = [];
  const rest = body.replace(/<path\s([^>]*?)\/>/g, (_, attrs) => {
    const get = (k) => attrs.match(new RegExp(`(?:^|\\s)${k}="([^"]*)"`))?.[1];
    const d = get('d');
    if (!d) fail(`${where}: <path> sem d.`);
    if (get('transform')) fail(`${where}: <path> com transform nao e suportado.`);
    const path = { d };
    if (get('opacity')) path.opacity = Number(get('opacity'));
    if (get('fill-rule')) path.fillRule = get('fill-rule');
    if (get('clip-rule')) path.clipRule = get('clip-rule');
    paths.push(path);
    return '';
  });
  if (rest.trim()) fail(`${where}: elemento SVG nao suportado: ${rest.trim().slice(0, 120)}`);
  if (!paths.length) fail(`${where}: SVG sem caminhos.`);
  return { viewBox, paths };
}

function build(svgDir) {
  const { wanted, meta } = loadNeeded();
  // Sem argumento: regera a partir do cache versionado lib/icons/svg/<slug>.svg.
  const sourceOf = (w) =>
    svgDir ? join(svgDir, `${w.nodeId.replace(':', '-')}.svg`) : join(SVG_CACHE, `${w.slug}.svg`);
  const absent = wanted.filter((w) => !existsSync(sourceOf(w)));
  if (absent.length) {
    fail(
      `SVG ausente para ${absent.length} icone(s) — baixe via MCP download_assets e salve como <nodeId>.svg:\n` +
        absent.map((w) => `  ${w.nodeId}\t${w.slug}`).join('\n'),
    );
  }

  // Le tudo antes de limpar: sem argumento, a fonte e o proprio cache lib/icons/svg/.
  const sources = new Map(wanted.map((w) => [w.slug, readFileSync(sourceOf(w), 'utf8')]));

  // Limpa o gerado anterior (preserva needed.txt).
  for (const f of existsSync(OUT) ? readdirSync(OUT) : []) {
    if (f !== 'needed.txt') rmSync(join(OUT, f), { recursive: true, force: true });
  }
  mkdirSync(SVG_CACHE, { recursive: true });

  const BANNER = '// GERADO POR scripts/figma-icons.mjs A PARTIR DA PAGINA ICONES DO FIGMA.\n// Nao edite. Para incluir um icone, adicione o slug em lib/icons/needed.txt.\n';
  writeFileSync(
    join(OUT, 'icon-base.tsx'),
    `${BANNER}
import type { ReactNode } from "react";

export type IconSize = 12 | 16 | 20 | 24 | 32 | 40 | 48;

export type IconProps = {
  /**
   * Altura, casa com os tokens dimension/icon/*. Sem ela, o icone herda
   * --santo-icon-size do contexto (o controle define com --santo-control-icon-*)
   * e cai em dimension/icon/16.
   */
  size?: IconSize;
  className?: string;
  /** Rotulo acessivel. Sem ele, o icone e decorativo. */
  title?: string;
};

/** Moldura comum: cor por currentColor, tamanho por token, viewBox do Figma preservado. */
export function IconBase({
  size,
  className = "",
  title,
  viewBox,
  ratio,
  children,
}: IconProps & { viewBox: string; ratio: number; children: ReactNode }) {
  const height = size ? \`var(--santo-dimension-icon-\${size})\` : "var(--santo-icon-size, var(--santo-dimension-icon-16))";
  return (
    <svg
      viewBox={viewBox}
      fill="currentColor"
      style={{ height, width: ratio === 1 ? height : \`calc(\${height} * \${ratio})\` }}
      className={\`shrink-0 \${className}\`}
      role={title ? "img" : undefined}
      aria-hidden={title ? undefined : true}
      aria-label={title}
    >
      {title ? <title>{title}</title> : null}
      {children}
    </svg>
  );
}
`,
  );

  const manifest = {};
  for (const w of wanted) {
    const raw = sources.get(w.slug);
    const { viewBox, paths } = parseSvg(raw, `${w.slug} (${w.nodeId})`);
    // Cache normalizado (sem fundo do canvas, cor por currentColor): e a fonte do `build` sem argumento.
    const svgAttrs = (p) =>
      [
        `d="${p.d}"`,
        p.opacity !== undefined ? `opacity="${p.opacity}"` : '',
        p.fillRule ? `fill-rule="${p.fillRule}"` : '',
        p.clipRule ? `clip-rule="${p.clipRule}"` : '',
      ]
        .filter(Boolean)
        .join(' ');
    writeFileSync(
      join(SVG_CACHE, `${w.slug}.svg`),
      `<svg xmlns="http://www.w3.org/2000/svg" viewBox="${viewBox}" fill="currentColor">\n${paths.map((p) => `<path ${svgAttrs(p)}/>`).join('\n')}\n</svg>\n`,
    );
    const [, , vw, vh] = viewBox.split(/\s+/).map(Number);
    const ratio = Math.round((vw / vh) * 1000) / 1000;
    const name = componentName(w.slug);
    const attrs = (p) =>
      [
        `d=${JSON.stringify(p.d)}`,
        p.opacity !== undefined ? `opacity={${p.opacity}}` : '',
        p.fillRule ? `fillRule=${JSON.stringify(p.fillRule)}` : '',
        p.clipRule ? `clipRule=${JSON.stringify(p.clipRule)}` : '',
      ]
        .filter(Boolean)
        .join(' ');
    writeFileSync(
      join(OUT, `${w.slug}.tsx`),
      `${BANNER}// Figma: ${w.icon.name}${w.weight ? ` / Weight=${w.weight}` : ''} — node ${w.nodeId}
import { IconBase, type IconProps } from "./icon-base";

export function ${name}(props: IconProps) {
  return (
    <IconBase {...props} viewBox=${JSON.stringify(viewBox)} ratio={${ratio}}>
${paths.map((p) => `      <path ${attrs(p)} />`).join('\n')}
    </IconBase>
  );
}
`,
    );
    manifest[w.slug] = {
      component: name,
      file: `lib/icons/${w.slug}.tsx`,
      figma: { name: w.icon.name, kind: w.icon.kind, setNodeId: w.icon.nodeId, nodeId: w.nodeId, weight: w.weight },
      /** Apelidos pt-BR para busca (lib/icons/needed.txt). */
      aliases: w.aliases,
      viewBox,
    };
  }

  writeFileSync(
    join(OUT, 'manifest.json'),
    `${JSON.stringify({ fileKey: meta.fileKey ?? null, page: meta.page, pageId: meta.pageId ?? null, weights: meta.weights, generatedBy: 'scripts/figma-icons.mjs build', icons: manifest }, null, 2)}\n`,
  );
  const slugs = Object.keys(manifest);
  writeFileSync(
    join(OUT, 'index.ts'),
    `${BANNER}
export { IconBase, type IconProps, type IconSize } from "./icon-base";
${slugs.map((s) => `export { ${manifest[s].component} } from "./${s}";`).join('\n')}

/** Slugs exportados (o inventario completo da pagina e cache local: tokens/.cache/santods.icons.json). */
export const iconSlugs = ${JSON.stringify(slugs)} as const;
export type IconSlug = (typeof iconSlugs)[number];
`,
  );
  console.log(`lib/icons/ — ${slugs.length} icones gerados (${wanted.filter((w) => w.weight).length} de set, ${wanted.filter((w) => !w.weight).length} de marca).`);
}

if (cmd === 'inventory') inventory(arg);
else if (cmd === 'plan') plan();
else if (cmd === 'build') build(arg);
else fail('Uso: node scripts/figma-icons.mjs inventory <dump-dir> | plan | build [svg-dir]');
