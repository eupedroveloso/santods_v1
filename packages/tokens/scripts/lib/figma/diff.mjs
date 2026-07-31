/**
 * A comparação entre o documento do código e o do Figma.
 *
 * ─── Sobre comparar cor ─────────────────────────────────────────────────────
 *
 * Os canais viajam como float de 0 a 1 nos dois lados, mas não são o mesmo
 * float: o build emite arredondado em 4 casas e o Figma devolve a expansão do
 * seu próprio valor interno (`0.4157` vira `0.41568627450980394` na volta).
 * Comparar com `===` acusaria divergência em toda variável de cor do arquivo,
 * todas as vezes — um check que sempre falha é um check que sempre se ignora.
 *
 * Comparamos, então, o que o Figma realmente representa: os dois lados são
 * quantizados para 8 bits por canal, que é a precisão que a interface mostra em
 * hex e a que qualquer pixel na tela pode ter. Duas cores que caem no mesmo byte
 * são a mesma cor — não "quase".
 */

/** Tolerância para números que não são canal de cor (dimensão, duração, peso). */
const EPSILON = 1e-4;

/** @param {number} channel */
const toByte = (channel) => Math.round(Math.min(1, Math.max(0, channel)) * 255);

/**
 * @param {unknown} value
 * @returns {value is { r: number, g: number, b: number, a: number }}
 */
const isColor = (value) =>
  typeof value === 'object' && value !== null && 'r' in value && 'g' in value && 'b' in value;

/**
 * Dois valores de modo são equivalentes?
 *
 * @param {import('../emit/figma.mjs').FigmaModeValue | undefined} local
 * @param {import('../emit/figma.mjs').FigmaModeValue | undefined} remote
 */
export function sameModeValue(local, remote) {
  if (!local || !remote) return false;

  // Alias e literal nunca são equivalentes, mesmo que resolvam para a mesma cor:
  // é justamente a diferença entre ter e não ter camada semântica no Figma.
  if ((local.alias === undefined) !== (remote.alias === undefined)) return false;
  if (local.alias !== undefined) return local.alias === remote.alias;

  const a = local.value;
  const b = remote.value;

  if (isColor(a) && isColor(b)) {
    return (
      toByte(a.r) === toByte(b.r) &&
      toByte(a.g) === toByte(b.g) &&
      toByte(a.b) === toByte(b.b) &&
      Math.abs((a.a ?? 1) - (b.a ?? 1)) < 1e-3
    );
  }

  if (typeof a === 'number' && typeof b === 'number') return Math.abs(a - b) < EPSILON;

  return String(a) === String(b);
}

/**
 * Como um valor de modo aparece no relatório.
 * @param {import('../emit/figma.mjs').FigmaModeValue | undefined} value
 */
export function describeModeValue(value) {
  if (!value) return '(ausente)';
  if (value.alias !== undefined) return `→ ${value.alias}`;
  if (isColor(value.value)) {
    const { r, g, b, a } = /** @type {any} */ (value.value);
    const hex = [r, g, b].map((channel) => toByte(channel).toString(16).padStart(2, '0')).join('');
    return `#${hex}${
      a !== undefined && a < 1
        ? Math.round(a * 255)
            .toString(16)
            .padStart(2, '0')
        : ''
    }`;
  }
  return String(value.value);
}

/**
 * @typedef {object} Drift
 * @property {'coleção ausente' | 'coleção extra' | 'modos divergentes' | 'variável ausente' | 'variável extra' | 'tipo divergente' | 'valor divergente'} kind
 * @property {string} collection
 * @property {string} [variable]
 * @property {string} detail
 */

/**
 * Compara os dois documentos.
 *
 * "Ausente" é sempre do ponto de vista do FIGMA: ausente = existe no código e
 * não no arquivo; extra = existe no arquivo e não no código. O código é a fonte
 * da verdade deste sistema, então é dele que a comparação parte.
 *
 * @param {import('./document.mjs').Document} local
 * @param {import('./document.mjs').Document} remote
 * @returns {Drift[]}
 */
export function diffDocuments(local, remote) {
  /** @type {Drift[]} */
  const drifts = [];

  for (const [name, collection] of local) {
    const counterpart = remote.get(name);

    if (!counterpart) {
      drifts.push({
        kind: 'coleção ausente',
        collection: name,
        detail: `${collection.variables.size} variável(is) — a coleção inteira não existe no arquivo`,
      });
      continue;
    }

    // Modos são comparados como sequência: no Figma a ordem decide qual é o
    // padrão de um frame novo, então trocar Light e Dark de lugar não é detalhe
    // cosmético.
    if (collection.modes.join('|') !== counterpart.modes.join('|')) {
      drifts.push({
        kind: 'modos divergentes',
        collection: name,
        detail: `código [${collection.modes.join(', ')}] · figma [${counterpart.modes.join(', ')}]`,
      });
    }

    for (const [variableName, variable] of collection.variables) {
      const remoteVariable = counterpart.variables.get(variableName);

      if (!remoteVariable) {
        drifts.push({
          kind: 'variável ausente',
          collection: name,
          variable: variableName,
          detail: 'existe no código e não no arquivo',
        });
        continue;
      }

      if (variable.type !== remoteVariable.type) {
        drifts.push({
          kind: 'tipo divergente',
          collection: name,
          variable: variableName,
          detail: `código ${variable.type} · figma ${remoteVariable.type}`,
        });
        continue;
      }

      for (const mode of collection.modes) {
        const here = variable.valuesByMode[mode];
        const there = remoteVariable.valuesByMode[mode];

        if (!sameModeValue(here, there)) {
          drifts.push({
            kind: 'valor divergente',
            collection: name,
            variable: variableName,
            detail: `modo "${mode}" · código ${describeModeValue(here)} · figma ${describeModeValue(there)}`,
          });
        }
      }
    }

    for (const variableName of counterpart.variables.keys()) {
      if (!collection.variables.has(variableName)) {
        drifts.push({
          kind: 'variável extra',
          collection: name,
          variable: variableName,
          detail: 'existe no arquivo e não no código',
        });
      }
    }
  }

  for (const name of remote.keys()) {
    if (!local.has(name)) {
      const counterpart = remote.get(name);
      drifts.push({
        kind: 'coleção extra',
        collection: name,
        detail: `${counterpart?.variables.size ?? 0} variável(is) — existe no arquivo e não no código`,
      });
    }
  }

  return drifts;
}
