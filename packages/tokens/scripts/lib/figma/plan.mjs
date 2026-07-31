/**
 * O plano de escrita: o que exatamente muda no arquivo do Figma.
 *
 * Está separado de `figma-push.mjs` por um motivo prático — assim o cálculo é
 * exercitável sem rede e sem credencial. Um plano é uma função pura de
 * (documento local, documento remoto, índice de ids); dá para alimentá-la com um
 * arquivo remoto vazio, ou com o espelho exato do local, e conferir que ela
 * produz o que deveria. A parte que fala com a API não precisa participar disso.
 *
 * ─── A ordem dos quatro passos não é livre ──────────────────────────────────
 *
 * Coleções e modos primeiro, porque toda variável referencia uma coleção e todo
 * valor referencia um modo. Depois as variáveis. Só então os valores, porque um
 * alias pode apontar para uma variável que ainda não existia quando o alias foi
 * lido — é no terceiro passo que o mapa de nomes para ids está completo. Por
 * último o que sobra no arquivo e não existe mais no código.
 */

import { TokensError } from '../cli.mjs';
import { sameModeValue } from './diff.mjs';

/**
 * Prefixo dos ids temporários.
 *
 * Numa mesma requisição, o Figma permite criar uma coleção e já referenciá-la
 * pelas variáveis que nascem dentro dela, desde que o id inventado seja
 * consistente ao longo do corpo. O prefixo evita colidir com um id real, que
 * sempre tem a forma `VariableID:1:2`.
 */
const TEMP = 'santo-tmp';

/**
 * Converte um valor de modo do documento local no formato do corpo da API.
 *
 * @param {import('../emit/figma.mjs').FigmaModeValue} value
 * @param {Map<string, string>} variableIdByName nomes → ids (reais e temporários)
 * @param {string} variableName para a mensagem de erro
 */
function apiValue(value, variableIdByName, variableName) {
  if (value.alias === undefined) return value.value;

  const target = variableIdByName.get(value.alias);
  if (!target) {
    throw new TokensError(
      `A variável "${variableName}" faz alias para "${value.alias}", que não existe nem no\n` +
        `  Figma nem entre as que este push criaria.\n\n` +
        `  Isso costuma significar que o alvo do alias caiu numa coleção que o Figma não\n` +
        `  representa (ver dist/figma/manifest.json, lista \`unsupported\`).`,
    );
  }

  return { type: 'VARIABLE_ALIAS', id: target };
}

/**
 * Monta o corpo da requisição e a descrição legível do que ele faz.
 *
 * @param {import('./document.mjs').Document} local
 * @param {import('./document.mjs').Document} remote
 * @param {import('./document.mjs').RemoteIndex} index
 * @param {{ prune: boolean }} options
 */
export function plan(local, remote, index, { prune }) {
  /** @type {any[]} */
  const variableCollections = [];
  /** @type {any[]} */
  const variableModes = [];
  /** @type {any[]} */
  const variables = [];
  /** @type {any[]} */
  const variableModeValues = [];

  const summary = {
    createdCollections: /** @type {string[]} */ ([]),
    createdModes: /** @type {string[]} */ ([]),
    createdVariables: /** @type {string[]} */ ([]),
    updatedValues: /** @type {string[]} */ ([]),
    deletedVariables: /** @type {string[]} */ ([]),
    blocked: /** @type {string[]} */ ([]),
    keptExtra: /** @type {string[]} */ ([]),
  };

  /** Todos os nomes de variável que existirão depois do push, com o id a usar. */
  const variableIdByName = new Map(index.variableId);

  // ── Passo 1: coleções e modos ─────────────────────────────────────────────
  // Precisa vir inteiro antes das variáveis, porque toda variável referencia a
  // coleção e todo valor referencia um modo.

  /** @type {Map<string, string>} */
  const collectionIdByName = new Map(index.collectionId);
  /** @type {Map<string, string>} */
  const modeIdByKey = new Map(index.modeId);

  for (const [name, collection] of local) {
    if (!collectionIdByName.has(name)) {
      const tempCollection = `${TEMP}:collection:${name}`;
      const [firstMode, ...restModes] = collection.modes;
      const tempFirstMode = `${TEMP}:mode:${name}:${firstMode}`;

      variableCollections.push({
        action: 'CREATE',
        id: tempCollection,
        name,
        initialModeId: tempFirstMode,
      });

      collectionIdByName.set(name, tempCollection);
      modeIdByKey.set(`${name}|${firstMode}`, tempFirstMode);
      summary.createdCollections.push(name);

      // O modo inicial nasce com o nome padrão do Figma ("Mode 1"); renomeá-lo
      // é o que faz o rótulo bater com o que o código chama de modo.
      variableModes.push({
        action: 'UPDATE',
        id: tempFirstMode,
        name: firstMode,
        variableCollectionId: tempCollection,
      });

      for (const mode of restModes) {
        const tempMode = `${TEMP}:mode:${name}:${mode}`;
        variableModes.push({
          action: 'CREATE',
          id: tempMode,
          name: mode,
          variableCollectionId: tempCollection,
        });
        modeIdByKey.set(`${name}|${mode}`, tempMode);
        summary.createdModes.push(`${name}/${mode}`);
      }

      continue;
    }

    const collectionId = collectionIdByName.get(name);

    for (const mode of collection.modes) {
      if (modeIdByKey.has(`${name}|${mode}`)) continue;

      const tempMode = `${TEMP}:mode:${name}:${mode}`;
      variableModes.push({
        action: 'CREATE',
        id: tempMode,
        name: mode,
        variableCollectionId: collectionId,
      });
      modeIdByKey.set(`${name}|${mode}`, tempMode);
      summary.createdModes.push(`${name}/${mode}`);
    }
  }

  // ── Passo 2: as variáveis ─────────────────────────────────────────────────

  for (const [name, collection] of local) {
    const collectionId = collectionIdByName.get(name);
    const counterpart = remote.get(name);

    for (const [variableName, variable] of collection.variables) {
      const existing = counterpart?.variables.get(variableName);

      if (existing && existing.type !== variable.type) {
        summary.blocked.push(
          `${variableName} — tipo ${existing.type} no Figma e ${variable.type} no código; ` +
            `o Figma não permite trocar o tipo de uma variável existente`,
        );
        continue;
      }

      if (!existing) {
        const tempVariable = `${TEMP}:variable:${variableName}`;
        variables.push({
          action: 'CREATE',
          id: tempVariable,
          name: variableName,
          variableCollectionId: collectionId,
          resolvedType: variable.type,
          ...(variable.description ? { description: variable.description } : {}),
        });
        variableIdByName.set(variableName, tempVariable);
        summary.createdVariables.push(variableName);
      } else if ((existing.description ?? '') !== (variable.description ?? '')) {
        variables.push({
          action: 'UPDATE',
          id: variableIdByName.get(variableName),
          description: variable.description ?? '',
        });
      }
    }
  }

  // ── Passo 3: os valores, um por (variável, modo) ──────────────────────────
  // Separado do passo 2 porque um alias pode apontar para uma variável criada
  // depois dele na ordem de iteração — só aqui `variableIdByName` está completo.

  for (const [name, collection] of local) {
    const counterpart = remote.get(name);

    for (const [variableName, variable] of collection.variables) {
      const existing = counterpart?.variables.get(variableName);
      if (existing && existing.type !== variable.type) continue;

      for (const mode of collection.modes) {
        const value = variable.valuesByMode[mode];
        if (!value) continue;

        if (existing && sameModeValue(value, existing.valuesByMode[mode])) continue;

        variableModeValues.push({
          variableId: variableIdByName.get(variableName),
          modeId: modeIdByKey.get(`${name}|${mode}`),
          value: apiValue(value, variableIdByName, variableName),
        });

        if (existing) summary.updatedValues.push(`${variableName} · ${mode}`);
      }
    }
  }

  // ── Passo 4: o que sobra no Figma ─────────────────────────────────────────

  for (const [name, collection] of remote) {
    const counterpart = local.get(name);
    if (!counterpart) continue;

    for (const variableName of collection.variables.keys()) {
      if (counterpart.variables.has(variableName)) continue;

      if (prune) {
        variables.push({ action: 'DELETE', id: index.variableId.get(variableName) });
        summary.deletedVariables.push(variableName);
      } else {
        summary.keptExtra.push(variableName);
      }
    }
  }

  const body = { variableCollections, variableModes, variables, variableModeValues };
  const operations =
    variableCollections.length +
    variableModes.length +
    variables.length +
    variableModeValues.length;

  return { body, summary, operations };
}
