/**
 * O CONTRATO DE NOMES.
 *
 * Este arquivo é o motivo de o Santo conseguir prometer paridade. Um token tem
 * exatamente quatro grafias, e todas derivam mecanicamente da mesma lista de
 * segmentos — nenhuma é digitada à mão em lugar nenhum:
 *
 *   segmentos     ['color', 'bg', 'brand', 'solid', 'default']
 *   Figma          color/bg/brand/solid/default
 *   token (JSON)   color.bg.brand.solid.default
 *   CSS            --santo-color-bg-brand-solid-default
 *   TypeScript     'color.bg.brand.solid.default'
 *
 * Como a transformação é reversível, o verificador de paridade consegue pegar
 * uma variável que existe no Figma e provar que existe no código, e vice-versa.
 * Se você precisar renomear algo, renomeie os segmentos — nunca uma das grafias.
 */

/** Prefixo de todas as CSS custom properties do design system. */
export const CSS_PREFIX = 'santo';

/** Separador de grupos nas Variables do Figma. */
export const FIGMA_SEPARATOR = '/';

/**
 * Segmentos válidos: minúsculas, dígitos e hífen interno.
 * Proibimos ponto, barra e underscore porque cada um quebraria uma das quatro
 * grafias acima de um jeito silencioso.
 */
const SEGMENT_PATTERN = /^[a-z0-9]+(-[a-z0-9]+)*$/;

/** @param {string[]} segments */
export function assertValidSegments(segments) {
  if (!segments.length) throw new Error('Token sem segmentos.');
  for (const segment of segments) {
    if (!SEGMENT_PATTERN.test(segment)) {
      throw new Error(
        `Segmento inválido "${segment}" em "${segments.join('.')}".\n` +
          `Use apenas minúsculas, dígitos e hífen interno (ex.: "on-brand", "2xl", "600").`,
      );
    }
  }
}

/** @param {string[]} segments */
export const toTokenPath = (segments) => segments.join('.');

/** @param {string} path */
export const fromTokenPath = (path) => path.split('.');

/** @param {string[]} segments */
export const toFigmaName = (segments) => segments.join(FIGMA_SEPARATOR);

/** @param {string} name */
export const fromFigmaName = (name) => name.split(FIGMA_SEPARATOR);

/** @param {string[]} segments */
export const toCssVarName = (segments) => `--${CSS_PREFIX}-${segments.join('-')}`;

/** @param {string[]} segments */
export const toCssVarRef = (segments) => `var(${toCssVarName(segments)})`;

/**
 * CSS → segmentos. Não é um simples split por hífen: segmentos como `on-brand`
 * contêm hífen. A reconstrução só é possível consultando os nomes conhecidos,
 * por isso recebe o índice de tokens.
 *
 * @param {string} cssVar
 * @param {Set<string>} knownPaths caminhos de token existentes
 * @returns {string[] | null}
 */
export function fromCssVarName(cssVar, knownPaths) {
  const flat = cssVar.replace(new RegExp(`^--${CSS_PREFIX}-`), '');
  for (const path of knownPaths) {
    if (fromTokenPath(path).join('-') === flat) return fromTokenPath(path);
  }
  return null;
}

/**
 * Converte uma referência DTCG (`{palette.brand.600}`) no caminho que ela aponta.
 * @param {unknown} value
 * @returns {string | null}
 */
export function referencedPath(value) {
  if (typeof value !== 'string') return null;
  const match = /^\{([^}]+)\}$/.exec(value.trim());
  return match ? match[1] : null;
}

/** @param {unknown} value */
export const isReference = (value) => referencedPath(value) !== null;
