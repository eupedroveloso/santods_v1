/**
 * Emissor do payload do Figma.
 *
 * Este arquivo não fala com a API — ele produz o DOCUMENTO que `figma-push.mjs`
 * envia e que `figma-check.mjs` compara. Separar as duas coisas é o que permite
 * inspecionar em `dist/figma/` exatamente o que seria escrito no arquivo, e
 * versionar essa saída para ver num diff o que uma mudança de token faria com o
 * arquivo do Figma antes de fazer.
 *
 * ─── Alias, não valor ───────────────────────────────────────────────────────
 *
 * Quando o valor original de um token é uma referência (`{palette.brand.600}`),
 * a variável correspondente sai como ALIAS para a outra variável, não como o hex
 * resolvido. É isso que reproduz no Figma a mesma estrutura em camadas que o CSS
 * tem: o designer que abrir `color/bg/brand/solid/default` vê que ela aponta
 * para `palette/brand/600`, e trocar a paleta re-tematiza o arquivo inteiro do
 * mesmo jeito que re-tematiza o CSS. Resolver o hex aqui destruiria a camada
 * semântica no Figma e deixaria os dois ambientes iguais só na aparência.
 *
 * ─── O que o Figma não representa ───────────────────────────────────────────
 *
 * Nem todo token vira Variable. `72ch` não tem unidade equivalente, e curvas de
 * Bézier não são um tipo de variável. Em vez de deixar esses tokens sumirem em
 * silêncio, eles entram na lista `unsupported` do manifesto, com o motivo. Um
 * token que o Figma não consegue representar é uma decisão a tomar, não um
 * detalhe a esconder.
 */

import {
  COLLECTIONS,
  EFFECT_STYLE_ROOTS,
  TEXT_STYLE_ROOTS,
  THEME_LABELS,
  collectionForRoot,
} from '../../../figma.config.mjs';
import { buildFor, descriptionOf, originalValueOf, typeOf, valueOf } from '../dictionary.mjs';
import { referencedPath, toFigmaName, fromTokenPath } from '../naming.mjs';
import { toFigmaColor, parseColor } from '../color.mjs';

const STYLE_ROOTS = new Set([...TEXT_STYLE_ROOTS, ...EFFECT_STYLE_ROOTS]);

/**
 * O valor de uma variável NUM modo. Ou aponta para outra variável (`alias`), ou
 * carrega um valor literal — nunca os dois. É a distinção que preserva a camada
 * semântica dentro do Figma, e por isso ela é um tipo, não uma convenção.
 *
 * @typedef {{ alias: string, value?: never, unit?: never }
 *   | { alias?: never, value: string | number | { r: number, g: number, b: number, a: number }, unit?: 'PERCENT' }
 * } FigmaModeValue
 */

/**
 * Uma Variable pronta para o push. `valuesByMode` é indexado pelo RÓTULO do
 * modo (`'Light'`, `'Santo'`), não pelo id — o id só existe depois que o Figma
 * responde, e o documento precisa ser legível e comparável antes disso.
 *
 * @typedef {object} FigmaVariable
 * @property {string} name nome com barras, ex.: `color/bg/brand/solid/default`
 * @property {string | undefined} type COLOR, FLOAT ou STRING
 * @property {Record<string, FigmaModeValue>} valuesByMode
 * @property {string} [description]
 */

/**
 * Extrai o número de uma dimensão em px. `'16px'` → `16`.
 * @param {unknown} value
 */
function px(value) {
  const match = /^(-?[\d.]+)px$/.exec(String(value).trim());
  return match ? Number.parseFloat(match[1]) : null;
}

/**
 * `'-0.04em'` → `-4` (por cento), que é como o Figma expressa tracking.
 * @param {unknown} value
 */
function emToPercent(value) {
  const match = /^(-?[\d.]+)em$/.exec(String(value).trim());
  return match ? Math.round(Number.parseFloat(match[1]) * 1e4) / 100 : null;
}

/**
 * O resultado de uma conversão: ou deu certo e tem tipo e valor, ou não deu e
 * tem o motivo. A união exclusiva é o que obriga quem chama a olhar
 * `unsupported` antes de ler `value` — sem ela, um token não representável
 * viraria uma variável de valor `undefined` no arquivo do Figma.
 *
 * @typedef {{ type: string, value: string | number | { r: number, g: number, b: number, a: number }, unit?: 'PERCENT', note?: string, unsupported?: undefined }
 *   | { type?: undefined, value?: undefined, unit?: undefined, note?: undefined, unsupported: string }
 * } FigmaConversion
 */

/**
 * Converte um token resolvido no par (tipo do Figma, valor).
 * Devolve `{ unsupported: motivo }` quando o Figma não tem como representá-lo.
 *
 * @param {import('style-dictionary/types').TransformedToken} token
 * @returns {FigmaConversion}
 */
export function toFigmaVariable(token) {
  const type = typeOf(token);
  const value = valueOf(token);

  switch (type) {
    case 'color':
      return { type: 'COLOR', value: toFigmaColor(value) };

    case 'duration': {
      const ms = /^(-?[\d.]+)ms$/.exec(String(value).trim());
      return ms
        ? { type: 'FLOAT', value: Number.parseFloat(ms[1]) }
        : { unsupported: `duração "${value}" não está em ms` };
    }

    case 'number':
    case 'fontWeight':
      return { type: 'FLOAT', value: Number(value) };

    case 'dimension': {
      const pixels = px(value);
      if (pixels !== null) return { type: 'FLOAT', value: pixels };

      const percent = emToPercent(value);
      if (percent !== null) {
        return { type: 'FLOAT', value: percent, unit: 'PERCENT' };
      }

      return {
        unsupported: `dimensão "${value}" não é px nem em — o Figma não tem unidade equivalente`,
      };
    }

    case 'fontFamily': {
      // O Figma tem UMA família por variável; a cadeia de fallback é conceito de CSS.
      const first = Array.isArray(value) ? value[0] : String(value).split(',')[0];
      return {
        type: 'STRING',
        value: String(first)
          .trim()
          .replace(/^['"]|['"]$/g, ''),
      };
    }

    case 'cubicBezier':
      return {
        type: 'STRING',
        value: String(value),
        note: 'O Figma não tem variável de curva; o valor fica legível como texto para uso manual em Smart Animate.',
      };

    case 'string':
      return { type: 'STRING', value: String(value) };

    default:
      return { unsupported: `tipo "${type}" não tem variável equivalente no Figma` };
  }
}

/** @type {Record<string, string | undefined>} */
const THEME_LABEL_BY_ID = THEME_LABELS;

/**
 * Os modos de uma coleção e o build que fornece cada um.
 *
 * @param {{ modesFrom: string }} collection
 * @param {{ brands: string[], themes: string[], brandLabels: Record<string,string>, defaultBrand: string }} context
 * @returns {Array<{ label: string, brand: string, theme: string }>}
 */
function modesFor(collection, { brands, themes, brandLabels, defaultBrand }) {
  switch (collection.modesFrom) {
    case 'brand':
      return brands.map((brand) => ({
        label: brandLabels[brand] ?? brand,
        brand,
        theme: themes[0],
      }));
    case 'theme':
      return themes.map((theme) => ({
        label: THEME_LABEL_BY_ID[theme] ?? theme,
        brand: defaultBrand,
        theme,
      }));
    default:
      return [{ label: 'Value', brand: defaultBrand, theme: themes[0] }];
  }
}

/**
 * Monta as coleções de Variables.
 *
 * @param {object} input
 * @param {Map<string, import('../dictionary.mjs').Build>} input.builds
 * @param {string[]} input.brands
 * @param {string[]} input.themes
 * @param {Record<string,string>} input.brandLabels
 * @param {string} input.defaultBrand
 */
export function emitCollections({ builds, brands, themes, brandLabels, defaultBrand }) {
  /** @type {Array<{ token: string, collection: string, reason: string }>} */
  const unsupported = [];
  /** @type {Array<{ name: string, description: string, modes: string[], variables: FigmaVariable[] }>} */
  const collections = [];

  for (const collection of COLLECTIONS) {
    const modes = modesFor(collection, { brands, themes, brandLabels, defaultBrand });
    const reference = buildFor(builds, modes[0].brand, modes[0].theme);

    const members = reference.tokens.filter(
      (token) => collection.roots.includes(token.path[0]) && !STYLE_ROOTS.has(token.path[0]),
    );

    /** @type {FigmaVariable[]} */
    const variables = [];

    for (const token of members) {
      const path = token.path.join('.');
      /** @type {Record<string, FigmaModeValue>} */
      const valuesByMode = {};
      /** @type {string | null} */
      let skip = null;

      for (const mode of modes) {
        const build = buildFor(builds, mode.brand, mode.theme);
        const current = build.tokens.find((candidate) => candidate.path.join('.') === path);

        if (!current) {
          skip = `ausente na marca/tema ${mode.brand}/${mode.theme}`;
          break;
        }

        const alias = referencedPath(originalValueOf(current));
        if (alias) {
          valuesByMode[mode.label] = { alias: toFigmaName(fromTokenPath(alias)) };
          continue;
        }

        const converted = toFigmaVariable(current);
        if (converted.unsupported !== undefined) {
          skip = converted.unsupported;
          break;
        }

        valuesByMode[mode.label] = converted.unit
          ? { value: converted.value, unit: converted.unit }
          : { value: converted.value };
      }

      if (skip) {
        unsupported.push({ token: path, collection: collection.name, reason: skip });
        continue;
      }

      /** @type {FigmaVariable} */
      const entry = {
        name: toFigmaName(token.path),
        type: toFigmaVariable(token).type,
        valuesByMode,
      };

      const description = descriptionOf(token);
      if (description) entry.description = description;

      variables.push(entry);
    }

    collections.push({
      name: collection.name,
      description: collection.description,
      modes: modes.map((mode) => mode.label),
      variables,
    });
  }

  return { collections, unsupported };
}

/**
 * Eixos de um Text Style que o Figma NÃO deixa vincular a variável sem estragar
 * o valor.
 *
 * `letterSpacing` é o único caso hoje, e a razão é específica: o binding de
 * letterSpacing no Figma só fala PIXELS. Vincular converte a unidade de PERCENT
 * para PIXELS silenciosamente — `type/tracking/wide` (+2%) vira +2px, o que num
 * caption de 10px é dez vezes o espaçamento pretendido. Medido no arquivo em
 * 31/07/2026: setar PERCENT remove o vínculo, e vincular por cima força PIXELS.
 * Os dois são mutuamente exclusivos.
 *
 * Entre um estilo que renderiza certo e um estilo que reage a variável, ganha o
 * que renderiza certo — tracking errado é visível em toda tela do produto, e o
 * ganho do vínculo aqui é teórico: a escala de tracking praticamente não muda.
 * Declarar a lacuna é o que impede o verificador de paridade de perseguir 68
 * fantasmas a cada rodada.
 */
const UNBINDABLE_TEXT_PROPERTIES = new Set(['letterSpacing']);

/**
 * Text Styles. O Figma não tem variável composta de texto, então cada estilo vai
 * com os valores resolvidos MAIS `boundVariables`, indicando qual variável deve
 * ficar ligada a cada eixo. É o que mantém o Text Style reagindo a uma troca de
 * escala tipográfica em vez de virar uma cópia congelada.
 *
 * Os eixos de `UNBINDABLE_TEXT_PROPERTIES` saem de `boundVariables` e entram em
 * `unbound`, com o motivo. Um eixo que o Figma não sabe vincular precisa
 * aparecer como decisão declarada; omiti-lo em silêncio faria o formato de troca
 * prometer um vínculo impossível.
 *
 * ─── A pasta da família ─────────────────────────────────────────────────────
 *
 * O nome no Figma leva a família resolvida como PRIMEIRO segmento
 * (`Albert Sans/heading-1/bold`), porque é assim que o painel de Text Styles
 * agrupa: uma pasta por fonte. O caminho do token continua sem ela
 * (`typography.heading-1.bold`), e é isso que mantém CSS e TypeScript
 * neutros de marca — `--santo-typography-heading-1-bold` não menciona Albert
 * Sans em lugar nenhum.
 *
 * O prefixo é reversível por construção: `figmaFamily` acompanha cada estilo, e
 * quem lê o arquivo tira o primeiro segmento para chegar ao token. Sem esse
 * campo o verificador de paridade teria de adivinhar onde a família termina, já
 * que nome de fonte tem espaço e pode ter barra.
 *
 * O CUSTO, que é real: trocar a marca renomeia as 66 pastas. O nome não
 * acompanha o modo da variável — só o valor acompanha. Um arquivo cuja marca
 * mudou fica com a pasta "Albert Sans" renderizando outra fonte até alguém
 * re-semear. É o preço do agrupamento, e ele foi escolhido de olho aberto.
 *
 * @param {import('../dictionary.mjs').Build} build
 */
export function emitTextStyles(build) {
  const styles = [];

  for (const token of build.tokens.filter((t) => TEXT_STYLE_ROOTS.includes(t.path[0]))) {
    const original = originalValueOf(token) ?? {};
    const resolved = valueOf(token);

    /** @type {Record<string, string>} */
    const bound = {};
    /** @type {Record<string, string>} */
    const unbound = {};
    for (const [property, value] of Object.entries(original)) {
      const alias = referencedPath(value);
      if (!alias) continue;
      const target = toFigmaName(fromTokenPath(alias));
      if (UNBINDABLE_TEXT_PROPERTIES.has(property)) unbound[property] = target;
      else bound[property] = target;
    }

    const family = (
      Array.isArray(resolved.fontFamily)
        ? resolved.fontFamily[0]
        : String(resolved.fontFamily).split(',')[0]
    )
      .trim()
      .replace(/^['"]|['"]$/g, '');

    styles.push({
      name: toFigmaName([family, ...token.path.slice(1)]),
      token: toFigmaName(token.path.slice(1)),
      figmaFamily: family,
      description: descriptionOf(token),
      fontFamily: family,
      fontWeight: Number(resolved.fontWeight),
      fontSize: px(resolved.fontSize),
      lineHeight: { value: px(resolved.lineHeight), unit: 'PIXELS' },
      letterSpacing: { value: emToPercent(resolved.letterSpacing) ?? 0, unit: 'PERCENT' },
      boundVariables: bound,
      unbound,
    });
  }

  return styles;
}

/**
 * Effect Styles. Sombras do Santo são sempre preto translúcido justamente para
 * caberem aqui: Effect Styles do Figma não aceitam modos, então uma sombra que
 * mudasse entre claro e escuro seria impossível de espelhar.
 *
 * @param {import('../dictionary.mjs').Build} build
 */
export function emitEffectStyles(build) {
  const styles = [];

  for (const token of build.tokens.filter((t) => EFFECT_STYLE_ROOTS.includes(t.path[0]))) {
    const shadows = originalValueOf(token) ?? [];
    const layers = Array.isArray(shadows) ? shadows : [shadows];

    styles.push({
      name: toFigmaName(token.path.slice(1)),
      description: descriptionOf(token),
      effects: layers
        .filter((shadow) => parseColor(shadow.color).a > 0)
        .map((shadow) => ({
          type: 'DROP_SHADOW',
          color: toFigmaColor(shadow.color),
          offset: { x: px(shadow.offsetX) ?? 0, y: px(shadow.offsetY) ?? 0 },
          radius: px(shadow.blur) ?? 0,
          spread: px(shadow.spread) ?? 0,
          visible: true,
          blendMode: 'NORMAL',
        })),
    });
  }

  return styles;
}

/**
 * Confere que toda raiz de token tem destino declarado em figma.config.mjs.
 * @param {import('../dictionary.mjs').Build} build
 */
export function assertEveryRootMapped(build) {
  const orphans = new Set();

  for (const token of build.tokens) {
    const root = token.path[0];
    if (!STYLE_ROOTS.has(root) && !collectionForRoot(root)) orphans.add(root);
  }

  if (orphans.size) {
    throw new Error(
      `Raízes de token sem coleção no Figma: ${[...orphans].join(', ')}.\n` +
        `Toda raiz precisa aparecer em COLLECTIONS, TEXT_STYLE_ROOTS ou EFFECT_STYLE_ROOTS ` +
        `em packages/tokens/figma.config.mjs — senão esses tokens existiriam só no código.`,
    );
  }
}
