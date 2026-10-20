#!/usr/bin/env node
/**
 * Baixa os SVGs dos icones de lib/icons/needed.txt pela API REST do Figma — alternativa
 * ao MCP download_assets quando o OAuth do MCP nao esta disponivel.
 *
 *   node --env-file=.env.local scripts/figma-icons-rest.mjs <svg-dir> [--all] [--build]
 *
 * Le FIGMA_TOKEN e FIGMA_FILE_KEY do ambiente (token pessoal; NUNCA o imprima nem versione).
 *   1. `figma-icons.mjs plan` diz o nodeId de cada variante pedida (precisa do inventario
 *      em tokens/.cache/ para slug novo; slug ja exportado sai do manifest).
 *   2. Variante que ja tem SVG versionado em lib/icons/svg/<slug>.svg e copiada para
 *      <svg-dir>/<nodeId>.svg; so as novas sao baixadas. Com --all, baixa todas de novo.
 *   3. GET /v1/images/:key?ids=...&format=svg devolve URLs temporarias; cada SVG e salvo
 *      como <svg-dir>/<nodeId com - no lugar de :>.svg, o formato que o build espera.
 *   4. Com --build, roda `figma-icons.mjs build <svg-dir>` no fim.
 * Nao escreve nada no Figma.
 */
import { spawnSync } from 'node:child_process';
import { copyFileSync, existsSync, mkdirSync, writeFileSync } from 'node:fs';
import { dirname, join, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const args = process.argv.slice(2);
const outDir = args.find((a) => !a.startsWith('--'));
const all = args.includes('--all');
const runBuild = args.includes('--build');
const fail = (msg) => {
  console.error(msg);
  process.exit(1);
};

const { FIGMA_TOKEN: token, FIGMA_FILE_KEY: fileKey } = process.env;
if (!outDir) fail('Uso: node --env-file=.env.local scripts/figma-icons-rest.mjs <svg-dir> [--all] [--build]');
if (!token || !fileKey) fail('FIGMA_TOKEN e FIGMA_FILE_KEY precisam estar no ambiente (ex.: node --env-file=.env.local ...).');

const icons = (...a) => spawnSync(process.execPath, [join(root, 'scripts/figma-icons.mjs'), ...a], { encoding: 'utf8' });

/* ------------------------------------------------------------- plano */

const planRun = icons('plan');
if (planRun.status !== 0) fail(planRun.stderr || planRun.stdout);
const wanted = planRun.stdout
  .trim()
  .split('\n')
  .filter(Boolean)
  .map((line) => {
    const [nodeId, spec] = line.split('\t');
    return { nodeId, slug: spec.split(':')[0], spec };
  });

const dir = resolve(process.cwd(), outDir);
mkdirSync(dir, { recursive: true });
const fileOf = (w) => join(dir, `${w.nodeId.replace(':', '-')}.svg`);

const toDownload = [];
let copied = 0;
for (const w of wanted) {
  const versioned = join(root, 'lib/icons/svg', `${w.slug}.svg`);
  if (!all && existsSync(versioned)) {
    copyFileSync(versioned, fileOf(w));
    copied++;
  } else {
    toDownload.push(w);
  }
}

/* ------------------------------------------------------------ download */

const api = async (path) => {
  const res = await fetch(`https://api.figma.com/v1${path}`, { headers: { 'X-Figma-Token': token } });
  const body = await res.json().catch(() => ({}));
  if (!res.ok || body.err) fail(`Figma REST ${path.split('?')[0]}: HTTP ${res.status} ${body.err ?? body.message ?? ''}`.trim());
  return body;
};

const BATCH = 50;
for (let i = 0; i < toDownload.length; i += BATCH) {
  const batch = toDownload.slice(i, i + BATCH);
  const ids = batch.map((w) => w.nodeId).join(',');
  const { images } = await api(`/images/${fileKey}?ids=${encodeURIComponent(ids)}&format=svg`);
  for (const w of batch) {
    const url = images?.[w.nodeId];
    if (!url) fail(`Figma nao exportou ${w.nodeId} (${w.spec}): o no existe na pagina Icones?`);
    const res = await fetch(url);
    if (!res.ok) fail(`Download do SVG de ${w.spec} falhou: HTTP ${res.status}`);
    writeFileSync(fileOf(w), await res.text());
  }
}

console.log(`${wanted.length} variantes: ${toDownload.length} baixada(s) do Figma, ${copied} copiada(s) de lib/icons/svg/.`);
for (const w of toDownload) console.log(`  baixado  ${w.nodeId}\t${w.spec}`);

if (runBuild) {
  const b = icons('build', dir);
  process.stdout.write(b.stdout);
  process.stderr.write(b.stderr);
  process.exit(b.status ?? 1);
}
console.log(`\nAgora: node scripts/figma-icons.mjs build ${outDir}`);
