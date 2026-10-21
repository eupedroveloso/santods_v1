#!/usr/bin/env node
/**
 * Semeia o Estúdio com os rascunhos versionados em tokens/*.rascunho.json.
 *
 *   node scripts/estudio-seed.mjs [--base=http://localhost:3123] [arquivo.rascunho.json ...]
 *
 * Idempotente: acha o sistema pelo slug (derivado do nome, como o Estúdio faz)
 * ou pelo nome; cria se faltar; regrava os seis estilos (PUT base + overrides).
 * Rodar de novo deixa o sistema igual ao arquivo. Usa a API do servidor que
 * está de pé (o banco data/estudio.db é dele), sem mexer no banco por fora.
 *
 * Mapeamento (inverso de montarRascunho em lib/estudio/rascunho.ts):
 *   cor         base = rascunho.cor            overrides = passos.cor
 *   tipografia  base = rascunho.tipografia     overrides = {}
 *   raio        base { valor: rascunho.raio }  overrides = passos.raio
 *   espaco      base { valor: rascunho.espaco } overrides = passos.espaco
 *   sombra      base = rascunho.sombra         overrides = passos.sombra
 *   controles   base { valor: rascunho.controles } overrides = {}
 * `superficies` e `efeitos` não são estilos do Estúdio: ficam no arquivo e no
 * modo de marca do snapshot, não no sistema.
 */
import { readFileSync, readdirSync } from 'node:fs';
import { dirname, join, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const args = process.argv.slice(2);
const opt = Object.fromEntries(args.filter((a) => a.startsWith('--')).map((a) => a.slice(2).split('=')));
const BASE = opt.base ?? 'http://localhost:3123';
const files = args.filter((a) => !a.startsWith('--'));
const alvos = files.length
  ? files.map((f) => resolve(f))
  : readdirSync(join(root, 'tokens')).filter((f) => f.endsWith('.rascunho.json')).map((f) => join(root, 'tokens', f));

/** Mesmo slug do Estúdio: sem acento, minúsculo, hífen entre palavras. */
const slugDe = (nome) =>
  nome.normalize('NFD').replace(/\p{Diacritic}/gu, '').toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');

async function api(method, path, body) {
  const res = await fetch(BASE + path, {
    method,
    headers: body ? { 'content-type': 'application/json' } : undefined,
    body: body ? JSON.stringify(body) : undefined,
  });
  const text = await res.text();
  if (!res.ok) throw new Error(`${method} ${path} → ${res.status}: ${text.slice(0, 200)}`);
  return text ? JSON.parse(text) : null;
}

function estilosDe(r) {
  const passos = r.passos ?? {};
  return {
    cor: { base: r.cor ?? {}, overrides: passos.cor ?? {} },
    tipografia: { base: r.tipografia ?? {}, overrides: {} },
    raio: { base: r.raio !== undefined ? { valor: r.raio } : {}, overrides: passos.raio ?? {} },
    espaco: { base: r.espaco !== undefined ? { valor: r.espaco } : {}, overrides: passos.espaco ?? {} },
    sombra: { base: r.sombra ?? {}, overrides: passos.sombra ?? {} },
    controles: { base: r.controles !== undefined ? { valor: r.controles } : {}, overrides: {} },
  };
}

const { sistemas } = await api('GET', '/estudio/api/sistemas');
for (const arquivo of alvos) {
  const r = JSON.parse(readFileSync(arquivo, 'utf8'));
  if (!r.nome) throw new Error(`${arquivo}: rascunho sem "nome".`);
  const slug = slugDe(r.nome);
  let sistema = sistemas.find((s) => s.slug === slug) ?? sistemas.find((s) => s.nome === r.nome);
  const novo = !sistema;
  if (novo) sistema = await api('POST', '/estudio/api/sistemas', { nome: r.nome });
  for (const [estilo, dados] of Object.entries(estilosDe(r))) {
    await api('PUT', `/estudio/api/sistemas/${sistema.id}/estilos/${estilo}`, dados);
  }
  console.log(`${novo ? 'criado' : 'atualizado'}: ${r.nome} → /estudio/${sistema.slug} (6 estilos)`);
}
