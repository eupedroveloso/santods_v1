#!/usr/bin/env node
/**
 * Baixa o estado atual das Variables do Figma para inspeção.
 *
 * ─── Por que isto não reescreve `src/` ──────────────────────────────────────
 *
 * "Pull" num sistema de tokens costuma significar "traga o Figma para o código".
 * Aqui não significa, e a diferença é deliberada.
 *
 * Os arquivos de `src/` carregam coisas que o Figma não tem como devolver: a
 * intenção de cada `$description`, a distinção entre um literal translúcido
 * proposital e um alias que alguém desfez sem querer, e a ORDEM em que os
 * arquivos compõem as camadas. Uma volta automática do Figma para o `src/`
 * preservaria os valores e perderia todo o resto — e perderia calada, num
 * commit que parece uma sincronização de rotina.
 *
 * Então o pull faz duas coisas honestas: escreve o estado remoto em disco, para
 * ser lido e comparado com `git diff`, e imprime as divergências. Levar uma
 * mudança nascida no Figma para o `src/` é edição manual, feita por quem sabe se
 * aquilo era uma decisão de design ou um acidente.
 *
 * Uso:
 *   node scripts/figma-pull.mjs                 escreve o snapshot e resume
 *   node scripts/figma-pull.mjs --raw           guarda também a resposta crua
 */

import { mkdir, writeFile } from 'node:fs/promises';
import path from 'node:path';
import process from 'node:process';

import { bold, dim, green, run, yellow } from './lib/cli.mjs';
import { figmaClient } from './lib/figma/api.mjs';
import { localDocument, remoteDocument } from './lib/figma/document.mjs';
import { diffDocuments } from './lib/figma/diff.mjs';
import { DIST_DIR } from './lib/sources.mjs';

/** Onde o snapshot é escrito. Fica sob `dist/`, que é ignorado pelo git. */
const SNAPSHOT_DIR = path.join(DIST_DIR, 'figma', 'remote');

/** @param {string} file @param {unknown} value */
async function writeJson(file, value) {
  await mkdir(path.dirname(file), { recursive: true });
  await writeFile(file, `${JSON.stringify(value, null, 2)}\n`, 'utf8');
  return file;
}

async function main() {
  const client = await figmaClient();

  const [{ document: local }, { document: remote, raw }] = await Promise.all([
    localDocument(),
    remoteDocument(client),
  ]);

  const written = [];

  for (const [name, collection] of remote) {
    written.push(
      await writeJson(path.join(SNAPSHOT_DIR, `${name.toLowerCase()}.json`), {
        name: collection.name,
        modes: collection.modes,
        variables: [...collection.variables.values()],
      }),
    );
  }

  if (process.argv.includes('--raw')) {
    written.push(await writeJson(path.join(SNAPSHOT_DIR, 'raw.json'), raw));
  }

  const remoteCount = [...remote.values()].reduce(
    (total, entry) => total + entry.variables.size,
    0,
  );

  console.info(
    `\n${green('✓')} pull · ${remote.size} coleção(ões) · ${remoteCount} variável(is) · ` +
      `${written.length} arquivo(s) em ${dim(path.relative(process.cwd(), SNAPSHOT_DIR))}\n`,
  );

  const drifts = diffDocuments(local, remote);

  if (!drifts.length) {
    console.info(`  ${green('·')} sem divergências: o arquivo está igual ao código\n`);
    return;
  }

  console.info(`  ${yellow('·')} ${drifts.length} divergência(s) entre o arquivo e o código:\n`);

  for (const drift of drifts.slice(0, 30)) {
    const target = drift.variable ? `${drift.collection}/${drift.variable}` : drift.collection;
    console.info(`      ${bold(drift.kind)}  ${target} ${dim(`— ${drift.detail}`)}`);
  }
  if (drifts.length > 30) console.info(dim(`      … e mais ${drifts.length - 30}`));

  console.info(
    `\n  Para levar o código ao Figma: ${bold('pnpm figma:push')}.\n` +
      `  Para trazer algo do Figma ao código: edite ${bold('packages/tokens/src/')} à mão,\n` +
      `  usando o snapshot acima como referência.\n`,
  );
}

await run('pull das Variables do Figma falhou', main);
