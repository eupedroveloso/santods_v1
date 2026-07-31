#!/usr/bin/env node
/**
 * Verificador de estrutura.
 *
 * Cada regra aqui existe porque a violação correspondente é INVISÍVEL até tarde
 * demais. Nenhuma delas pega erro de digitação — `tsc` e o próprio Style
 * Dictionary já pegam esses. O que se verifica aqui são invariantes de
 * ARQUITETURA, do tipo que continua compilando, continua renderizando, e só se
 * revela quando alguém troca o tema, adiciona uma marca ou abre o Figma.
 *
 *   1. Nomes         segmentos que sobrevivem às quatro grafias do contrato
 *   2. Paridade      light e dark com exatamente as mesmas chaves
 *   3. Referências   nenhum alias apontando para o vazio
 *   4. Marcas        toda marca cobrindo as chaves que a semântica consome
 *   5. Camadas       a semântica aliasando a paleta, nunca hex literal
 *   6. Figma         toda raiz com destino declarado
 *
 * Uso: node scripts/check-structure.mjs
 */

import process from 'node:process';

import { THEMES } from '../figma.config.mjs';
import { messageOf, run } from './lib/cli.mjs';
import { buildFor, loadMatrix, isColor, originalValueOf, typeOf } from './lib/dictionary.mjs';
import { DEFAULT_BRAND, listBrands } from './lib/sources.mjs';
import { assertEveryRootMapped } from './lib/emit/figma.mjs';
import { assertValidSegments, referencedPath } from './lib/naming.mjs';
import { parseColor } from './lib/color.mjs';

/** @typedef {import('./lib/dictionary.mjs').Build} Build */
/** @typedef {Map<string, Build>} BuildMatrix */

/** @type {Array<{ rule: string, detail: string }>} */
const failures = [];
/** @type {Array<{ rule: string, detail: string }>} */
const passes = [];

/** @param {string} rule @param {string} detail */
const fail = (rule, detail) => failures.push({ rule, detail });
/** @param {string} rule @param {string} detail */
const pass = (rule, detail) => passes.push({ rule, detail });

/** @param {import('style-dictionary/types').TransformedToken[]} tokens */
const pathsOf = (tokens) => new Set(tokens.map((token) => token.path.join('.')));

/**
 * Diferença de conjuntos, para relatório.
 * @param {Set<string>} expected
 * @param {Set<string>} actual
 */
const missingFrom = (expected, actual) => [...expected].filter((item) => !actual.has(item)).sort();

// ─────────────────────────────────────────────────────────────────────────────

/**
 * 1. Todo segmento sobrevive às quatro grafias do contrato de nomes.
 * @param {Build} build
 */
function checkNames(build) {
  let bad = 0;
  for (const token of build.tokens) {
    try {
      assertValidSegments(token.path);
    } catch (error) {
      fail('nomes', messageOf(error).split('\n')[0]);
      bad += 1;
    }
  }
  if (!bad) pass('nomes', `${build.tokens.length} caminhos válidos`);
}

/**
 * 2. Light e dark são MODOS DE UMA MESMA COLEÇÃO no Figma. Um modo sem valor
 *    para uma variável não é "herda do outro" — é variável quebrada. Uma chave
 *    presente só num tema também significa que o CSS de um tema declara uma
 *    custom property que o outro não declara, e o valor vaza do bloco anterior.
 *
 * @param {BuildMatrix} builds
 * @param {string} brand
 */
function checkThemeParity(builds, brand) {
  for (const theme of THEMES.slice(1)) {
    const base = pathsOf(buildFor(builds, brand, THEMES[0]).tokens.filter(isColor));
    const other = pathsOf(buildFor(builds, brand, theme).tokens.filter(isColor));

    const onlyInBase = missingFrom(base, other);
    const onlyInOther = missingFrom(other, base);

    if (onlyInBase.length) {
      fail(
        'paridade de tema',
        `${brand}: presentes em "${THEMES[0]}" e ausentes em "${theme}" → ${onlyInBase.join(', ')}`,
      );
    }
    if (onlyInOther.length) {
      fail(
        'paridade de tema',
        `${brand}: presentes em "${theme}" e ausentes em "${THEMES[0]}" → ${onlyInOther.join(', ')}`,
      );
    }
    if (!onlyInBase.length && !onlyInOther.length) {
      pass(
        'paridade de tema',
        `${brand}: ${base.size} chaves idênticas entre ${THEMES.join(' e ')}`,
      );
    }
  }
}

/**
 * 3. Todo `{alias}` aponta para um token que existe.
 * @param {Build} build
 */
function checkReferences(build) {
  const known = pathsOf(build.tokens);
  let checked = 0;
  let broken = 0;

  /** @param {unknown} value @param {string} from */
  const visit = (value, from) => {
    if (typeof value === 'string') {
      const target = referencedPath(value);
      if (!target) return;
      checked += 1;
      if (!known.has(target)) {
        fail('referências', `"${from}" aponta para "${target}", que não existe`);
        broken += 1;
      }
      return;
    }
    if (Array.isArray(value)) {
      for (const item of value) visit(item, from);
      return;
    }
    if (value && typeof value === 'object') {
      for (const item of Object.values(value)) visit(item, from);
    }
  };

  for (const token of build.tokens) visit(originalValueOf(token), token.path.join('.'));
  if (!broken) pass('referências', `${checked} aliases resolvem`);
}

/**
 * 4. A camada semântica é escrita UMA vez e serve todas as marcas. Se uma marca
 *    nova não definir `palette.brand.600`, todo alias que aponta para lá quebra
 *    — e quebra só naquela marca, que é o pior lugar para descobrir.
 *
 * @param {BuildMatrix} builds
 * @param {string[]} brands
 */
function checkBrandCoverage(builds, brands) {
  const reference = buildFor(builds, DEFAULT_BRAND, THEMES[0]);
  const required = new Set(
    [...pathsOf(reference.tokens)].filter(
      (path) => path.startsWith('palette.') || path.startsWith('brand.'),
    ),
  );

  for (const brand of brands.filter((name) => name !== DEFAULT_BRAND)) {
    const actual = pathsOf(buildFor(builds, brand, THEMES[0]).tokens);
    const missing = missingFrom(required, actual);

    if (missing.length) {
      fail(
        'cobertura de marca',
        `"${brand}" não define ${missing.length} chave(s) que "${DEFAULT_BRAND}" define → ${missing
          .slice(0, 8)
          .join(', ')}${missing.length > 8 ? ', …' : ''}`,
      );
    } else {
      pass('cobertura de marca', `"${brand}" cobre as ${required.size} chaves da marca padrão`);
    }
  }

  if (brands.length === 1) {
    pass('cobertura de marca', `marca única ("${DEFAULT_BRAND}") — nada a comparar`);
  }
}

/**
 * 5. A REGRA QUE SUSTENTA A TROCA DE MARCA.
 *
 *    `color.*` só pode aliasar `palette.*`. No instante em que um token
 *    semântico carrega um hex literal, aquele valor deixa de responder à troca
 *    de marca — e o sintoma é uma tela quase certa, com um botão fora do tom,
 *    meses depois.
 *
 *    A única exceção é cor TRANSLÚCIDA: um overlay é uma camada de véu, não um
 *    degrau de rampa, e não existe entrada de paleta que o represente. Por isso
 *    a exceção é verificada (alfa < 1), não confiada a uma lista de nomes.
 *
 * @param {Build} build
 */
function checkSemanticLayering(build) {
  let literals = 0;

  for (const token of build.tokens.filter(isColor)) {
    if (typeOf(token) !== 'color') continue;

    const original = originalValueOf(token);
    const alias = referencedPath(original);
    const path = token.path.join('.');

    if (alias) {
      if (!alias.startsWith('palette.')) {
        fail(
          'camadas',
          `"${path}" aliasa "${alias}" — a camada semântica só pode apontar para "palette.*"`,
        );
      }
      continue;
    }

    const { a } = parseColor(original);
    if (a >= 1) {
      fail(
        'camadas',
        `"${path}" tem cor literal opaca (${original}) — deveria aliasar um degrau de "palette.*", ` +
          `senão não muda quando a marca muda`,
      );
    } else {
      literals += 1;
    }
  }

  pass(
    'camadas',
    `semântica aliasa a paleta · ${literals} literal(is) translúcido(s) permitido(s)`,
  );
}

// ─────────────────────────────────────────────────────────────────────────────

async function main() {
  const brands = await listBrands();

  const builds = await loadMatrix(brands, THEMES);
  const primary = buildFor(builds, DEFAULT_BRAND, THEMES[0]);

  checkNames(primary);
  for (const brand of brands) checkThemeParity(builds, brand);
  checkReferences(primary);
  checkBrandCoverage(builds, brands);
  checkSemanticLayering(primary);

  try {
    assertEveryRootMapped(primary);
    pass('figma', 'toda raiz de token tem coleção ou style declarado');
  } catch (error) {
    fail('figma', messageOf(error).split('\n')[0]);
  }

  for (const item of passes) console.log(`  ✓ ${item.rule} · ${item.detail}`);

  if (failures.length) {
    console.error(`\n✗ estrutura · ${failures.length} violação(ões)\n`);
    for (const item of failures) console.error(`  ✗ ${item.rule} · ${item.detail}`);
    console.error('');
    process.exitCode = 1;
    return;
  }

  console.log(`\n✓ estrutura · ${passes.length} verificações passaram`);
}

await run('verificação de estrutura falhou', main);
