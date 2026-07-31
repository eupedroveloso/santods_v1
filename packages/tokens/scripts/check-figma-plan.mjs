#!/usr/bin/env node
/**
 * Teste do plano de escrita no Figma — sem rede e sem credencial.
 *
 * O `figma-push` é o código mais arriscado do pacote: ele escreve num arquivo
 * compartilhado, a escrita não tem desfazer, e ele só roda de verdade em
 * organização Enterprise. Quase ninguém consegue exercitá-lo antes de precisar
 * dele, o que é exatamente a situação em que um bug espera.
 *
 * A saída é que `plan()` é uma função pura de (documento local, documento
 * remoto, índice de ids). Dá para construir o documento remoto sem falar com o
 * Figma: basta traduzir o documento local de volta para o formato que a API
 * devolveria. Com isso dois fatos ficam verificáveis a cada `pnpm test`:
 *
 *   1. ESPELHO      um arquivo idêntico ao código produz zero divergência e
 *                   zero operação. Se isto quebrar, o push passa a reescrever
 *                   o arquivo inteiro toda vez — e o check acusa divergência
 *                   permanente que ninguém consegue resolver.
 *
 *   2. VAZIO        um arquivo em branco produz um plano completo e coerente:
 *                   toda variável criada, todo valor com destino, e todo alias
 *                   apontando para algo que o próprio plano cria. Um alias
 *                   pendurado aqui viraria 400 da API no meio de um lote
 *                   parcialmente aplicado.
 *
 * O que este teste NÃO cobre: se o Figma aceita o corpo. Isso depende de um
 * arquivo Enterprise real e está declarado como tal em docs/figma-parity.md.
 *
 * Uso: node scripts/check-figma-plan.mjs
 */

import process from 'node:process';

import { bold, dim, green, red, run } from './lib/cli.mjs';
import { localDocument, remoteDocument } from './lib/figma/document.mjs';
import { diffDocuments } from './lib/figma/diff.mjs';
import { plan } from './lib/figma/plan.mjs';

/** @type {Array<{ name: string, detail: string }>} */
const failures = [];
/** @type {Array<{ name: string, detail: string }>} */
const passes = [];

/**
 * @param {boolean} condition
 * @param {string} name
 * @param {string} detail
 */
function expect(condition, name, detail) {
  (condition ? passes : failures).push({ name, detail });
}

/**
 * Traduz o documento local para o formato que a API de Variables devolveria.
 *
 * Esta função é o dublê do Figma, e a fidelidade dela é o que dá valor ao teste:
 * ids opacos onde o Figma usa ids opacos, valores indexados por `modeId` e não
 * por rótulo, e alias como `{ type: 'VARIABLE_ALIAS', id }`. Se ela simplificar
 * qualquer um desses três pontos, passa a testar o `document.mjs` contra si
 * mesmo em vez de contra o formato real.
 *
 * @param {import('./lib/figma/document.mjs').Document} document
 */
function asFigmaPayload(document) {
  /** @type {Record<string, any>} */
  const variableCollections = {};
  /** @type {Record<string, any>} */
  const variables = {};

  // Os ids precisam existir todos antes de qualquer alias ser escrito: um alias
  // pode apontar para variável de outra coleção, inclusive uma ainda não vista.
  /** @type {Map<string, string>} */
  const idByName = new Map();
  let counter = 0;
  for (const [, collection] of document) {
    for (const name of collection.variables.keys()) {
      idByName.set(name, `VariableID:1:${counter++}`);
    }
  }

  let collectionIndex = 0;
  for (const [name, collection] of document) {
    const collectionId = `VariableCollectionId:2:${collectionIndex}`;
    const modes = collection.modes.map((label, index) => ({
      modeId: `${collectionIndex}:${index}`,
      name: label,
    }));

    const variableIds = [];

    for (const [variableName, variable] of collection.variables) {
      const id = /** @type {string} */ (idByName.get(variableName));
      variableIds.push(id);

      /** @type {Record<string, unknown>} */
      const valuesByMode = {};
      for (const [index, label] of collection.modes.entries()) {
        const value = variable.valuesByMode[label];
        if (!value) continue;
        valuesByMode[modes[index].modeId] =
          value.alias === undefined
            ? value.value
            : { type: 'VARIABLE_ALIAS', id: idByName.get(value.alias) };
      }

      variables[id] = {
        id,
        name: variableName,
        variableCollectionId: collectionId,
        resolvedType: variable.type,
        valuesByMode,
        remote: false,
        description: variable.description ?? '',
      };
    }

    variableCollections[collectionId] = {
      id: collectionId,
      name,
      modes,
      defaultModeId: modes[0].modeId,
      variableIds,
      remote: false,
    };

    collectionIndex += 1;
  }

  return { meta: { variableCollections, variables } };
}

/** @param {unknown} payload */
const stubClient = (payload) => ({
  fileKey: 'ARQUIVO-DE-TESTE',
  get: async () => payload,
  post: async () => ({}),
});

async function main() {
  const { document: local } = await localDocument();
  const localCount = [...local.values()].reduce((total, entry) => total + entry.variables.size, 0);

  // ── 1. Espelho ────────────────────────────────────────────────────────────

  const { document: mirror, index } = await remoteDocument(
    /** @type {any} */ (stubClient(asFigmaPayload(local))),
  );

  const mirrorCount = [...mirror.values()].reduce(
    (total, entry) => total + entry.variables.size,
    0,
  );

  expect(
    mirror.size === local.size && mirrorCount === localCount,
    'espelho · normalização',
    `${mirror.size} coleção(ões) e ${mirrorCount} variável(is) sobreviveram à ida e volta`,
  );

  const drifts = diffDocuments(local, mirror);
  expect(
    drifts.length === 0,
    'espelho · zero divergência',
    drifts.length
      ? `${drifts.length} divergência(s), a primeira: ${drifts[0].kind} em ${drifts[0].collection}/${drifts[0].variable ?? ''} — ${drifts[0].detail}`
      : 'código e espelho são indistinguíveis',
  );

  const mirrored = plan(local, mirror, index, { prune: false });
  expect(
    mirrored.operations === 0,
    'espelho · zero operação',
    mirrored.operations
      ? `${mirrored.operations} operação(ões) contra um arquivo que já está em dia`
      : 'nada a enviar, como esperado',
  );

  // ── 2. Arquivo vazio ──────────────────────────────────────────────────────

  const fresh = plan(
    local,
    new Map(),
    {
      collectionId: new Map(),
      modeId: new Map(),
      variableId: new Map(),
    },
    { prune: false },
  );

  expect(
    fresh.summary.createdVariables.length === localCount,
    'vazio · cobertura',
    `${fresh.summary.createdVariables.length} de ${localCount} variável(is) no plano`,
  );

  expect(
    fresh.summary.createdCollections.length === local.size,
    'vazio · coleções',
    `${fresh.summary.createdCollections.length} coleção(ões) criadas`,
  );

  expect(fresh.summary.blocked.length === 0, 'vazio · nada bloqueado', 'nenhuma variável impedida');

  const orphanRefs = fresh.body.variableModeValues.filter(
    (entry) => !entry.variableId || !entry.modeId,
  );
  expect(
    orphanRefs.length === 0,
    'vazio · referências completas',
    orphanRefs.length
      ? `${orphanRefs.length} valor(es) sem variableId ou modeId`
      : `${fresh.body.variableModeValues.length} valor(es), todos com destino`,
  );

  // Todo alias precisa apontar para uma variável que o próprio plano cria —
  // senão o Figma recusa o lote inteiro no meio da aplicação.
  const plannedIds = new Set(fresh.body.variables.map((entry) => entry.id));
  const aliases = fresh.body.variableModeValues.filter(
    (entry) => /** @type {any} */ (entry.value)?.type === 'VARIABLE_ALIAS',
  );
  const dangling = aliases.filter((entry) => !plannedIds.has(/** @type {any} */ (entry.value).id));

  expect(
    dangling.length === 0,
    'vazio · aliases resolvem',
    dangling.length
      ? `${dangling.length} alias(es) apontam para id que o plano não cria`
      : `${aliases.length} alias(es), todos resolvidos dentro do lote`,
  );

  // ── Relatório ─────────────────────────────────────────────────────────────

  for (const item of passes)
    console.info(`  ${green('✓')} ${item.name} ${dim(`· ${item.detail}`)}`);

  if (failures.length) {
    console.error(`\n${red('✗')} plano do Figma · ${failures.length} falha(s)\n`);
    for (const item of failures) console.error(`  ${red('✗')} ${bold(item.name)} · ${item.detail}`);
    console.error('');
    process.exitCode = 1;
    return;
  }

  console.info(`\n${green('✓')} plano do Figma · ${passes.length} verificações passaram\n`);
}

await run('teste do plano do Figma falhou', main);
