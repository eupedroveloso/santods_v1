/**
 * Os dois lados da comparação, na mesma forma.
 *
 * Comparar código com Figma só é possível se os dois virarem a MESMA estrutura
 * antes. É isso que este módulo faz: `localDocument()` produz o lado do código e
 * `remoteDocument()` produz o lado do Figma, ambos como
 *
 *   Map<nome da coleção, { modes: string[], variables: Map<nome, Variable> }>
 *
 * ─── Por que o lado local é reconstruído em memória ─────────────────────────
 *
 * Seria mais curto ler `dist/figma/*.json`. Não lemos: um `dist/` desatualizado
 * faria o check comparar o Figma com um build antigo e dar verde, ou faria o
 * push enviar tokens que ninguém mais tem no código. Reconstruir do `src/` a
 * cada execução custa dezenas de milissegundos e elimina a classe inteira de
 * erro. `dist/figma/` continua existindo para o caminho do plugin, que é como
 * quem não tem Enterprise sincroniza.
 */

import { THEMES } from '../../../figma.config.mjs';
import { LOCAL_VARIABLES } from './api.mjs';
import { brandLabelsOf, loadMatrix } from '../dictionary.mjs';
import { DEFAULT_BRAND, listBrands } from '../sources.mjs';
import { emitCollections, emitEffectStyles, emitTextStyles } from '../emit/figma.mjs';
import { buildFor } from '../dictionary.mjs';

/**
 * @typedef {object} Collection
 * @property {string} name
 * @property {string[]} modes rótulos, na ordem
 * @property {Map<string, import('../emit/figma.mjs').FigmaVariable>} variables por nome
 */

/** @typedef {Map<string, Collection>} Document */

/**
 * Os ids opacos do Figma, indexados pelos nomes que o código conhece.
 *
 * @typedef {object} RemoteIndex
 * @property {Map<string, string>} collectionId nome da coleção → id
 * @property {Map<string, string>} modeId `coleção|rótulo do modo` → modeId
 * @property {Map<string, string>} variableId nome da variável → id (global: alias cruza coleção)
 */

/**
 * O documento que o código descreve.
 *
 * @returns {Promise<{ document: Document, unsupported: Array<{ token: string, reason: string }>, textStyles: unknown[], effectStyles: unknown[] }>}
 */
export async function localDocument() {
  const brands = await listBrands();
  const builds = await loadMatrix(brands, THEMES);
  const brandLabels = brandLabelsOf(builds, brands, THEMES);

  const { collections, unsupported } = emitCollections({
    builds,
    brands,
    themes: THEMES,
    brandLabels,
    defaultBrand: DEFAULT_BRAND,
  });

  /** @type {Document} */
  const document = new Map();
  for (const collection of collections) {
    document.set(collection.name, {
      name: collection.name,
      modes: collection.modes,
      variables: new Map(collection.variables.map((variable) => [variable.name, variable])),
    });
  }

  const primary = buildFor(builds, DEFAULT_BRAND, THEMES[0]);

  return {
    document,
    unsupported,
    textStyles: emitTextStyles(primary),
    effectStyles: emitEffectStyles(primary),
  };
}

/**
 * O documento que o arquivo do Figma contém, traduzido para a forma local.
 *
 * Duas traduções acontecem aqui e as duas importam:
 *
 *   modeId → rótulo do modo   o Figma indexa valores por id opaco (`"1:0"`);
 *                             o lado local indexa por rótulo (`"Light"`), que é
 *                             o que sobrevive a recriar uma coleção.
 *   id de alias → nome        um alias remoto aponta para `VariableID:1:23`.
 *                             Comparar ids seria comparar coisas que só existem
 *                             de um lado; comparamos o NOME da variável apontada.
 *
 * O terceiro retorno, `index`, existe só para o push: comparar não precisa de
 * id nenhum, mas ESCREVER precisa de todos. Mantê-lo fora do `Document` é o que
 * permite ao check e ao diff trabalharem com uma estrutura em que ids do Figma
 * simplesmente não existem — e portanto não podem ser comparados por engano.
 *
 * @param {import('./api.mjs').FigmaClient} client
 * @returns {Promise<{ document: Document, raw: any, index: RemoteIndex }>}
 */
export async function remoteDocument(client) {
  const payload = await client.get(LOCAL_VARIABLES);
  const meta = payload?.meta;

  if (!meta?.variableCollections || !meta?.variables) {
    throw new Error(
      'A resposta da API de Variables não trouxe `meta.variableCollections` e `meta.variables`.\n' +
        'O formato do endpoint mudou ou o arquivo não é o esperado.',
    );
  }

  /** Nome de cada variável remota, por id — para resolver alias. */
  /** @type {Map<string, string>} */
  const nameById = new Map();
  for (const variable of Object.values(meta.variables)) {
    nameById.set(/** @type {any} */ (variable).id, /** @type {any} */ (variable).name);
  }

  /** @type {Document} */
  const document = new Map();

  /** @type {RemoteIndex} */
  const index = { collectionId: new Map(), modeId: new Map(), variableId: new Map() };

  for (const collection of Object.values(meta.variableCollections)) {
    const typed = /** @type {any} */ (collection);

    // Coleções `remote: true` vêm de uma biblioteca externa assinada por este
    // arquivo. Não são nossas para comparar nem para escrever.
    if (typed.remote) continue;

    /** @type {Map<string, string>} */
    const modeLabelById = new Map(
      typed.modes.map((/** @type {any} */ mode) => [mode.modeId, mode.name]),
    );

    index.collectionId.set(typed.name, typed.id);
    for (const mode of typed.modes) {
      index.modeId.set(`${typed.name}|${mode.name}`, mode.modeId);
    }

    /** @type {Collection} */
    const entry = {
      name: typed.name,
      modes: typed.modes.map((/** @type {any} */ mode) => mode.name),
      variables: new Map(),
    };

    for (const variableId of typed.variableIds ?? []) {
      const variable = meta.variables[variableId];
      if (!variable || variable.remote) continue;

      /** @type {Record<string, import('../emit/figma.mjs').FigmaModeValue>} */
      const valuesByMode = {};

      for (const [modeId, value] of Object.entries(variable.valuesByMode ?? {})) {
        const label = modeLabelById.get(modeId);
        if (!label) continue;

        const typedValue = /** @type {any} */ (value);

        if (typedValue && typeof typedValue === 'object' && typedValue.type === 'VARIABLE_ALIAS') {
          const target = nameById.get(typedValue.id);
          valuesByMode[label] = { alias: target ?? `(id desconhecido ${typedValue.id})` };
          continue;
        }

        valuesByMode[label] = { value: typedValue };
      }

      entry.variables.set(variable.name, {
        name: variable.name,
        type: variable.resolvedType,
        valuesByMode,
        ...(variable.description ? { description: variable.description } : {}),
      });

      index.variableId.set(variable.name, variable.id);
    }

    document.set(entry.name, entry);
  }

  return { document, raw: payload, index };
}
