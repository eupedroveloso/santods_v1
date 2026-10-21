#!/usr/bin/env node
/**
 * Runner unico de QA: `npm run check`.
 *
 * Roda todos os checks do repositorio ate o fim, mesmo quando um falha, e so
 * entao resume — quem corrige ve todos os erros de uma vez, nao um por rodada.
 * Check novo: acrescente uma linha em CHECKS. O build fica fora de proposito
 * (lento e com efeito colateral em .next); rode `npm run build` a parte.
 */
import { spawnSync } from 'node:child_process';
import { resolve, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = resolve(dirname(fileURLToPath(import.meta.url)), '..');

const CHECKS = [
  { name: 'lint', cmd: 'npx', args: ['eslint'] },
  { name: 'design', cmd: 'node', args: ['scripts/check-design.mjs'] },
  { name: 'lib-first', cmd: 'node', args: ['scripts/check-lib-first.mjs'] },
  { name: 'tier', cmd: 'node', args: ['scripts/check-tier.mjs'] },
  { name: 'tokens', cmd: 'node', args: ['scripts/check-parity.mjs'] },
  { name: 'nest', cmd: 'node', args: ['scripts/check-nest.mjs'] },
];

const results = [];
for (const check of CHECKS) {
  console.log(`\n━━ ${check.name} ━━ ${[check.cmd, ...check.args].join(' ')}`);
  const run = spawnSync(check.cmd, check.args, { cwd: root, stdio: 'inherit' });
  results.push({ ...check, ok: run.status === 0 });
}

console.log('\n━━ resumo ━━');
for (const r of results) console.log(`  ${r.ok ? 'ok    ' : 'FALHOU'}  ${r.name}`);
const failed = results.filter((r) => !r.ok);
if (failed.length) {
  console.error(`\n${failed.length} de ${results.length} check(s) falharam: ${failed.map((r) => r.name).join(', ')}.`);
  process.exit(1);
}
console.log(`\nOK — ${results.length} checks passaram.`);
