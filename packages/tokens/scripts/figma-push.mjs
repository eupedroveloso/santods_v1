#!/usr/bin/env node
/**
 * Leva as Variables do código para o arquivo do Figma.
 *
 * ─── Este é o único script do pacote que escreve fora do repositório ────────
 *
 * O arquivo do Figma é compartilhado: um push errado aparece na tela de todo
 * mundo que abrir a biblioteca, e o Figma não tem "desfazer" para escrita vinda
 * da API. Por isso o padrão aqui é o inverso do usual — sem `--confirm` o script
 * calcula o plano, imprime, e não envia nada. Ver antes de escrever não é uma
 * opção do fluxo; é o fluxo.
 *
 * ─── Sobre o que ele se recusa a fazer ──────────────────────────────────────
 *
 * DESTRUIR não está incluído. Variável que existe no Figma e não no código pode
 * ser lixo de um rename — ou pode ser trabalho de um designer que ainda não
 * virou token. O script lista essas variáveis e para por aí, a não ser que
 * `--prune` seja passado explicitamente.
 *
 * TROCAR O TIPO de uma variável também não: `resolvedType` é imutável na API do
 * Figma. Uma variável que mudou de `FLOAT` para `STRING` no código precisa ser
 * apagada e recriada, o que quebra toda ligação já feita num layer. O script
 * detecta o caso, avisa, e deixa a decisão com quem sabe o custo.
 *
 * Uso:
 *   node scripts/figma-push.mjs              calcula e imprime o plano
 *   node scripts/figma-push.mjs --confirm    envia
 *   node scripts/figma-push.mjs --prune      inclui remoções (ainda precisa de --confirm)
 */

import process from 'node:process';

import { bold, dim, green, red, run, yellow } from './lib/cli.mjs';
import { WRITE_VARIABLES, figmaClient } from './lib/figma/api.mjs';
import { localDocument, remoteDocument } from './lib/figma/document.mjs';
import { plan } from './lib/figma/plan.mjs';

/**
 * @param {string} label
 * @param {string[]} items
 * @param {(text: string) => string} color
 */
function section(label, items, color) {
  if (!items.length) return;
  console.info(`  ${color('●')} ${bold(label)} ${dim(`(${items.length})`)}`);
  for (const item of items.slice(0, 15)) console.info(`      ${item}`);
  if (items.length > 15) console.info(dim(`      … e mais ${items.length - 15}`));
  console.info('');
}

async function main() {
  const confirm = process.argv.includes('--confirm');
  const prune = process.argv.includes('--prune');

  const client = await figmaClient();

  const [{ document: local, unsupported }, { document: remote, index }] = await Promise.all([
    localDocument(),
    remoteDocument(client),
  ]);

  const { body, summary, operations } = plan(local, remote, index, { prune });

  console.info(`\n  arquivo ${dim(client.fileKey)}\n`);

  section('coleções a criar', summary.createdCollections, green);
  section('modos a criar', summary.createdModes, green);
  section('variáveis a criar', summary.createdVariables, green);
  section('valores a atualizar', summary.updatedValues, yellow);
  section('variáveis a REMOVER', summary.deletedVariables, red);
  section('bloqueadas (exigem decisão humana)', summary.blocked, red);
  section('no Figma e não no código — preservadas', summary.keptExtra, dim);

  if (summary.keptExtra.length) {
    console.info(
      dim(
        `  Para remover as preservadas acima, rode de novo com ${bold('--prune')}.\n` +
          `  Antes disso, confira se não é trabalho de design ainda não virado token.\n`,
      ),
    );
  }

  if (unsupported.length) {
    console.info(
      dim(`  ${unsupported.length} token(s) não têm equivalente no Figma e ficam de fora.\n`),
    );
  }

  if (!operations) {
    console.info(`${green('✓')} nada a enviar · o arquivo já reflete o código\n`);
    return;
  }

  if (!confirm) {
    console.info(
      `${yellow('■')} ${bold(`${operations} operação(ões)`)} calculadas — ${bold('nada foi enviado')}.\n\n` +
        `  Para aplicar:  ${bold('pnpm figma:push -- --confirm')}\n` +
        `  Revise o plano acima primeiro: a escrita via API do Figma não tem desfazer,\n` +
        `  e o arquivo é compartilhado.\n`,
    );
    return;
  }

  const response = await client.post(WRITE_VARIABLES, body);

  console.info(
    `${green('✓')} push · ${operations} operação(ões) aplicadas em ${dim(client.fileKey)}\n`,
  );

  if (response?.meta?.tempIdToRealId) {
    console.info(
      dim(
        `  ${Object.keys(response.meta.tempIdToRealId).length} entidade(s) criada(s) no arquivo.\n`,
      ),
    );
  }

  console.info(`  Confirme com ${bold('pnpm figma:check')}.\n`);
}

await run('push das Variables para o Figma falhou', main);
