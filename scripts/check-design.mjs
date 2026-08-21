#!/usr/bin/env node
/**
 * Caça valor solto em codigo de interface.
 *
 *   node scripts/check-design.mjs
 *
 * A regra do SantoDS e que cor, espaco, raio, tipo, sombra, duracao e curva saem
 * sempre de um token. Este script varre app/ e lib/ui/ atras de hex cru e de
 * valor arbitrario em classe Tailwind.
 *
 * As excecoes abaixo sao declaradas de proposito — uma checagem que da alarme
 * falso e pior que checagem nenhuma, porque ensina a ignorar a saida.
 */
import { readFileSync, readdirSync, statSync } from 'node:fs';
import { join, relative, resolve, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const ROOTS = ['app', 'lib/ui'];

/** Arquivos onde hex cru e legitimo, com o porque. */
const HEX_EXEMPT = {
  'lib/ui/color-picker.tsx':
    'primitivas de espaco de cor: o arco-iris de matiz e vermelho->verde em qualquer marca, e o punho branco precisa ser branco sobre qualquer cor',
  'lib/ui/color.ts': 'modulo de conversao de cor',
  'app/componentes/docs.tsx': 'conteudo de demonstracao: mostra um hex literal dentro de um campo de cor',
  'lib/tokens/fallback.ts': 'sentinelas de token quebrado, isolados de proposito num modulo so',
};

/** Unidades que nao existem como token e nunca vao existir. */
const ARBITRARY_OK = /-\[(\d+(\.\d+)?(%|ch|vh|vw|dvh|fr)|calc\(|--santo-)/;

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

const files = [];
for (const dir of ROOTS) {
  const walk = (p) => {
    for (const entry of readdirSync(p)) {
      const full = join(p, entry);
      if (statSync(full).isDirectory()) walk(full);
      else if (/\.(tsx?|mjs)$/.test(entry)) files.push(full);
    }
  };
  walk(resolve(root, dir));
}

const problems = [];
const exempted = [];

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

    for (const cls of code.match(CONTAINER_TRAP) ?? []) {
      problems.push(
        `${at}  ${cls} resolve pela escala de espacamento, nao por largura de container. ` +
          `Use max-w-(--santo-dimension-container-<sm|md|lg|xl|2xl>).`,
      );
    }

    const arbitrary = code.match(/\b(?:text|p|px|py|pt|pb|pl|pr|m|mx|my|gap|w|h|size|rounded|leading|tracking)-\[[^\]]+\]/g);
    for (const cls of arbitrary ?? []) {
      if (ARBITRARY_OK.test(cls)) continue;
      problems.push(`${at}  valor arbitrario ${cls} — use um token`);
    }
  });
}

console.log(`Varridos ${files.length} arquivos em ${ROOTS.join(', ')}.`);

if (exempted.length) {
  console.log(`\n${exempted.length} hex em arquivo isento (declarado em scripts/check-design.mjs):`);
  for (const [file, why] of Object.entries(HEX_EXEMPT)) {
    const hits = exempted.filter((e) => e.startsWith(file)).length;
    if (hits) console.log(`  ${file} — ${hits}x — ${why}`);
  }
}

if (problems.length) {
  console.error(`\n${problems.length} valor(es) solto(s):`);
  problems.forEach((p) => console.error('  ' + p));
  process.exit(1);
}

console.log('\nOK — nenhum valor solto fora das isencoes declaradas.');
