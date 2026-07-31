#!/usr/bin/env node
/**
 * Paridade: o arquivo do Figma bate com o código?
 *
 * Este é o script que roda em CI. Ele não escreve em lugar nenhum — só compara e
 * decide o código de saída. A pergunta que ele responde é estreita de propósito:
 * "toda Variable que o código descreve existe no arquivo, com o mesmo tipo e o
 * mesmo valor em cada modo?"
 *
 * ─── O que ele NÃO verifica, e por quê ──────────────────────────────────────
 *
 * Text Styles e Effect Styles ficam de fora. A API REST lê metadados de estilo
 * (nome, descrição), mas não as PROPRIEDADES — o tamanho de fonte de um Text
 * Style não vem por ali. Um check que comparasse só os nomes daria verde com um
 * estilo de tipografia inteiramente errado, o que é pior do que não checar:
 * seria uma garantia falsa. Esses estilos são sincronizados pelo plugin, a
 * partir de `dist/figma/text-styles.json` e `effect-styles.json`.
 *
 * Uso:
 *   node scripts/figma-check.mjs           relatório e código de saída
 *   node scripts/figma-check.mjs --json    o mesmo, para consumo de máquina
 */

import process from 'node:process';

import { bold, dim, green, red, run, yellow } from './lib/cli.mjs';
import { figmaClient } from './lib/figma/api.mjs';
import { localDocument, remoteDocument } from './lib/figma/document.mjs';
import { diffDocuments } from './lib/figma/diff.mjs';

async function main() {
  const client = await figmaClient();

  const [{ document: local, unsupported }, { document: remote }] = await Promise.all([
    localDocument(),
    remoteDocument(client),
  ]);

  const drifts = diffDocuments(local, remote);

  const localCount = [...local.values()].reduce((total, entry) => total + entry.variables.size, 0);
  const remoteCount = [...remote.values()].reduce(
    (total, entry) => total + entry.variables.size,
    0,
  );

  if (process.argv.includes('--json')) {
    console.info(
      JSON.stringify(
        { fileKey: client.fileKey, localCount, remoteCount, drifts, unsupported },
        null,
        2,
      ),
    );
    process.exitCode = drifts.length ? 1 : 0;
    return;
  }

  console.info(
    `\n  arquivo ${dim(client.fileKey)} · ${localCount} variável(is) no código · ${remoteCount} no Figma\n`,
  );

  if (!drifts.length) {
    console.info(`${green('✓')} paridade · código e Figma descrevem as mesmas Variables\n`);
    if (unsupported.length) {
      console.info(
        dim(
          `  (${unsupported.length} token(s) sem equivalente no Figma, por construção — ` +
            `ver dist/figma/manifest.json)\n`,
        ),
      );
    }
    return;
  }

  console.error(`${red('✗')} paridade · ${drifts.length} divergência(s)\n`);

  /** @type {Map<string, typeof drifts>} */
  const byKind = new Map();
  for (const drift of drifts) {
    const list = byKind.get(drift.kind) ?? [];
    list.push(drift);
    byKind.set(drift.kind, list);
  }

  for (const [kind, list] of byKind) {
    console.error(`  ${bold(kind)} ${dim(`(${list.length})`)}`);
    for (const drift of list.slice(0, 20)) {
      const target = drift.variable ? `${drift.collection}/${drift.variable}` : drift.collection;
      console.error(`    · ${target} ${dim(`— ${drift.detail}`)}`);
    }
    if (list.length > 20) console.error(dim(`    … e mais ${list.length - 20}`));
    console.error('');
  }

  console.error(
    `  ${yellow('Como resolver:')} se o código está certo, ${bold('pnpm figma:push')} leva o código\n` +
      `  para o arquivo. Se a mudança nasceu no Figma, ${bold('pnpm figma:pull')} baixa o estado\n` +
      `  atual para inspeção — a reconciliação no \`src/\` é manual, de propósito: o código\n` +
      `  é a fonte da verdade e sobrescrevê-lo automaticamente inverteria essa relação.\n`,
  );

  process.exitCode = 1;
}

await run('verificação de paridade com o Figma falhou', main);
