#!/usr/bin/env node
/**
 * Indice do Google Fonts para o Estudio: qualquer familia do Google pode virar
 * brand/family/* (corpo, titulo, mono).
 *
 *   node scripts/google-fonts.mjs            baixa o catalogo e regrava lib/fonts/google-index.json
 *   node scripts/google-fonts.mjs --offline  regrava a partir do bruto em tokens/.cache (sem rede)
 *
 * Fonte: https://fonts.google.com/metadata/fonts (JSON publico, sem chave). Se falhar,
 * Developer API (https://www.googleapis.com/webfonts/v1/webfonts) com GOOGLE_FONTS_KEY no env.
 * O bruto (~2.7 MB) fica em tokens/.cache/google-fonts.json (ignorado pelo git); o indice
 * versionado e enxuto: so familias com subset latin, e por familia
 *   { c: categoria, w: pesos estaticos (sem italico) | null, ax: { eixo: [min, max] } | null, i: tem italico }
 * Familia variavel tem ax.wght e w null; estatica tem w e nenhum ax.wght.
 *
 * Curadoria: as familias de lib/fonts/catalog.ts (FONT_CATALOG) saem em `curadoria`,
 * destacadas em cima do indice. O script falha se alguma delas nao estiver no indice.
 */
import { existsSync, mkdirSync, readFileSync, writeFileSync } from 'node:fs';
import { dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const RAW = resolve(root, 'tokens/.cache/google-fonts.json');
const OUT = resolve(root, 'lib/fonts/google-index.json');
const CATALOG = resolve(root, 'lib/fonts/catalog.ts');
const offline = process.argv.includes('--offline');

const CATEGORY = { 'Sans Serif': 'sans', Serif: 'serif', Display: 'display', Handwriting: 'handwriting', Monospace: 'mono' };
// Developer API usa outros nomes de categoria.
const API_CATEGORY = { 'sans-serif': 'sans', serif: 'serif', display: 'display', handwriting: 'handwriting', monospace: 'mono' };

/** Normaliza o bruto (metadata publico OU Developer API) para [{ family, c, w, ax, i, subsets }]. */
function normalize(raw) {
  if (raw.familyMetadataList) {
    return raw.familyMetadataList.map((f) => {
      const keys = Object.keys(f.fonts ?? {});
      const axes = Object.fromEntries((f.axes ?? []).map((a) => [a.tag, [a.min, a.max]]));
      return {
        family: f.family,
        c: CATEGORY[f.category] ?? f.category.toLowerCase(),
        w: axes.wght ? null : keys.filter((k) => /^\d+$/.test(k)).map(Number).sort((a, b) => a - b),
        ax: Object.keys(axes).length ? axes : null,
        i: keys.some((k) => k.endsWith('i')),
        subsets: f.subsets ?? [],
      };
    });
  }
  if (raw.items) {
    return raw.items.map((f) => {
      const axes = Object.fromEntries((f.axes ?? []).map((a) => [a.tag, [a.start, a.end]]));
      const variants = f.variants ?? [];
      const weight = (v) => (v === 'regular' || v === 'italic' ? 400 : parseInt(v, 10));
      return {
        family: f.family,
        c: API_CATEGORY[f.category] ?? f.category,
        w: axes.wght ? null : [...new Set(variants.filter((v) => !v.includes('italic')).map(weight))].sort((a, b) => a - b),
        ax: Object.keys(axes).length ? axes : null,
        i: variants.some((v) => v.includes('italic')),
        subsets: f.subsets ?? [],
      };
    });
  }
  throw new Error('Formato de catalogo desconhecido (nem familyMetadataList, nem items).');
}

async function download() {
  try {
    const res = await fetch('https://fonts.google.com/metadata/fonts');
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    // O endpoint pode vir com o prefixo anti-XSSI ")]}'".
    const text = (await res.text()).replace(/^\)\]\}'?\s*/, '');
    return { source: 'https://fonts.google.com/metadata/fonts', raw: JSON.parse(text) };
  } catch (err) {
    const key = process.env.GOOGLE_FONTS_KEY;
    if (!key) throw new Error(`metadata publico falhou (${err.message}) e GOOGLE_FONTS_KEY nao esta no env`);
    const res = await fetch(`https://www.googleapis.com/webfonts/v1/webfonts?capability=VF&key=${encodeURIComponent(key)}`);
    if (!res.ok) throw new Error(`Developer API: HTTP ${res.status}`);
    console.warn(`metadata publico falhou (${err.message}); usando a Developer API.`);
    return { source: 'https://www.googleapis.com/webfonts/v1/webfonts', raw: await res.json() };
  }
}

let source;
let raw;
if (offline) {
  if (!existsSync(RAW)) throw new Error(`Sem bruto em ${RAW}; rode sem --offline.`);
  ({ source, raw } = JSON.parse(readFileSync(RAW, 'utf8')));
} else {
  ({ source, raw } = await download());
  mkdirSync(dirname(RAW), { recursive: true });
  writeFileSync(RAW, JSON.stringify({ source, fetchedAt: new Date().toISOString(), raw }));
}

const all = normalize(raw);
const latin = all.filter((f) => f.subsets.includes('latin')).sort((a, b) => a.family.localeCompare(b.family));
const families = Object.fromEntries(latin.map(({ family, c, w, ax, i }) => [family, { c, w, ax, i }]));

// Curadoria: os nomes do FONT_CATALOG, lidos do fonte TS (sem executar TS).
const curadoria = [...readFileSync(CATALOG, 'utf8').matchAll(/family:\s*"([^"]+)"/g)].map((m) => m[1]);
const fora = curadoria.filter((f) => !families[f]);
if (fora.length) {
  console.error(`Curadoria com familia fora do indice: ${fora.join(', ')}`);
  process.exit(1);
}

const index = {
  generatedBy: 'scripts/google-fonts.mjs',
  source,
  note: 'GERADO. Nao editar a mao. c: categoria; w: pesos estaticos (null se variavel); ax: eixos [min, max]; i: tem italico.',
  count: latin.length,
  curadoria,
  families,
};
const out = JSON.stringify(index) + '\n';
const before = existsSync(OUT) ? readFileSync(OUT, 'utf8') : '';
if (out !== before) writeFileSync(OUT, out);
const variable = latin.filter((f) => f.ax?.wght).length;
console.log(
  `${OUT.slice(root.length + 1)}: ${latin.length} familias com latin (${variable} variaveis, ${latin.length - variable} estaticas, ` +
    `${latin.filter((f) => f.c === 'mono').length} mono), curadoria ${curadoria.length}, ${(out.length / 1024).toFixed(0)} KB` +
    (out === before ? ' (sem mudanca)' : ''),
);
