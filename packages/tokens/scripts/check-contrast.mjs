#!/usr/bin/env node
/**
 * Verificador de contraste WCAG 2.2.
 *
 * ─── O que este script verifica, e o que ele NÃO verifica ───────────────────
 *
 * Contraste é propriedade de um PAR, não de uma cor. `color.text.secondary` não
 * passa nem falha sozinho — ele passa sobre `surface.raised` e pode falhar sobre
 * `surface.sunken`. Por isso o que existe aqui é uma tabela de pares, e ela é a
 * parte editável do arquivo: cada entrada declara uma combinação que o design
 * system PROMETE que funciona.
 *
 * Isso tem um limite honesto: um par que ninguém declarou não é verificado. O
 * script não sabe o que a aplicação realmente renderiza; ele sabe o que o
 * sistema prometeu. Prometer menos deixa o check verde sem deixar o produto
 * acessível — então a tabela deve crescer junto com os componentes.
 *
 * ─── Os limiares ────────────────────────────────────────────────────────────
 *
 *   texto normal   4.5:1   WCAG 2.2 · 1.4.3 Contraste (Mínimo), nível AA
 *   texto grande   3.0:1   idem, para ≥24px ou ≥18.66px em negrito
 *   não-texto      3.0:1   WCAG 2.2 · 1.4.11 Contraste Não-Textual, nível AA
 *
 * Componentes desabilitados são explicitamente ISENTOS pelas duas regras. A
 * isenção está codificada em `EXEMPT` com o motivo, em vez de esses tokens
 * simplesmente não aparecerem em lugar nenhum — a diferença entre "isento" e
 * "esquecido" é a única coisa que impede a lista de virar um álibi.
 *
 * Uso:
 *   node scripts/check-contrast.mjs             só as falhas
 *   node scripts/check-contrast.mjs --verbose   todos os pares medidos
 *   node scripts/check-contrast.mjs --json      relatório para CI
 */

import process from 'node:process';

import { THEMES } from '../figma.config.mjs';
import { bold, dim, green, red, run, yellow } from './lib/cli.mjs';
import { contrastRatio, flatten, parseColor, round2 } from './lib/color.mjs';
import { buildFor, loadMatrix, valueOf } from './lib/dictionary.mjs';
import { listBrands } from './lib/sources.mjs';

// ─── Limiares ────────────────────────────────────────────────────────────────

/** @typedef {'text' | 'large-text' | 'non-text'} Level */

/** @type {Record<Level, { min: number, label: string, wcag: string }>} */
const LEVELS = {
  text: { min: 4.5, label: 'texto', wcag: '1.4.3 AA' },
  'large-text': { min: 3, label: 'texto grande', wcag: '1.4.3 AA (≥24px)' },
  'non-text': { min: 3, label: 'não-texto', wcag: '1.4.11 AA' },
};

/**
 * As famílias semânticas de cor. Toda uma classe de regra é "para cada família,
 * o texto da família sobre o fundo sutil da família" — escrever isso uma vez por
 * família seria seis oportunidades de esquecer uma.
 */
const FAMILIES = ['brand', 'accent', 'success', 'warning', 'danger', 'info'];

/** Estados que todo fundo interativo tem. */
const STATES = ['default', 'hover', 'active'];

/** As superfícies sobre as quais o conteúdo comum é renderizado. */
const SURFACES = ['color.surface.page', 'color.surface.raised', 'color.surface.sunken'];

/**
 * As famílias que têm preenchimento sólido, e portanto um par
 * `text.on-<família>` / `icon.on-<família>` a verificar.
 *
 * A correspondência é mecânica — `bg.X.solid.*` é verificado contra
 * `text.on-X` — e é por isso que não existe tabela de exceção aqui: a decisão
 * sobre qual frente serve cada família mora no TOKEN, onde os dois temas podem
 * discordar entre si (e discordam: no claro o verde sólido leva branco, no
 * escuro leva texto escuro). Um mapa neste arquivo teria que escolher um dos
 * dois e estaria errado no outro.
 */
const SOLID_FAMILIES = ['brand', 'neutral', 'accent', 'success', 'warning', 'danger', 'info'];

/**
 * Tokens isentos, com o motivo.
 *
 * A WCAG 2.2 isenta explicitamente componentes inativos nas duas regras de
 * contraste (1.4.3 e 1.4.11): "Text or images of text that are part of an
 * inactive user interface component ... have no contrast requirement."
 * Isenção não é permissão para ser ilegível — é reconhecimento de que baixo
 * contraste É o sinal de "indisponível".
 *
 * @type {Record<string, string>}
 */
const EXEMPT = {
  'color.text.disabled': 'componente inativo — isento por 1.4.3',
  'color.icon.disabled': 'componente inativo — isento por 1.4.11',
  'color.border.disabled': 'componente inativo — isento por 1.4.11',
  'color.bg.disabled': 'componente inativo — isento por 1.4.3 e 1.4.11',
  'color.bg.input.disabled': 'componente inativo — isento por 1.4.3 e 1.4.11',
  'color.bg.transparent': 'ausência de cor — não é um plano de fundo',
  'color.border.subtle': 'separador decorativo, não limite de componente — 1.4.11 não se aplica',
};

// ─── A tabela de pares ───────────────────────────────────────────────────────

/**
 * @typedef {object} Pair
 * @property {string} rule a regra que gerou o par, para agrupar o relatório
 * @property {string} foreground caminho do token da frente
 * @property {string} background caminho do token de trás
 * @property {Level} level
 */

/**
 * @param {string} rule
 * @param {Level} level
 * @param {string[]} foregrounds
 * @param {string[]} backgrounds
 * @returns {Pair[]}
 */
function cross(rule, level, foregrounds, backgrounds) {
  return foregrounds.flatMap((foreground) =>
    backgrounds.map((background) => ({ rule, foreground, background, level })),
  );
}

/**
 * Todos os pares que o sistema promete. É esta função que define o escopo do
 * check — ampliá-la é a forma de aumentar a cobertura.
 *
 * @returns {Pair[]}
 */
function declaredPairs() {
  /** @type {Pair[]} */
  const pairs = [];

  // Texto de conteúdo sobre as superfícies neutras. O caso mais comum do
  // sistema inteiro, e o único em que os três níveis de hierarquia de texto
  // precisam funcionar sobre as três profundidades de superfície.
  pairs.push(
    ...cross(
      'texto de conteúdo sobre superfície',
      'text',
      ['color.text.primary', 'color.text.secondary', 'color.text.tertiary'],
      SURFACES,
    ),
  );

  // Texto de marca e de estado sobre superfície — mensagens de erro, links,
  // rótulos de status fora de um fundo colorido.
  pairs.push(
    ...cross(
      'texto de estado sobre superfície',
      'text',
      [
        'color.text.brand',
        'color.text.accent',
        'color.text.success',
        'color.text.warning',
        'color.text.danger',
        'color.text.info',
        'color.text.link.default',
        'color.text.link.hover',
        'color.text.link.visited',
      ],
      SURFACES,
    ),
  );

  // Placeholder é texto: 1.4.3 se aplica a ele igual a qualquer outro. Campo
  // vazio com placeholder ilegível é um formulário que não se sabe preencher.
  pairs.push(
    ...cross(
      'texto de campo',
      'text',
      ['color.text.placeholder'],
      ['color.bg.input.default', 'color.bg.input.hover'],
    ),
  );

  // Texto invertido sobre a superfície invertida (tooltip, barra escura no tema
  // claro e o inverso no escuro).
  pairs.push(
    ...cross('texto invertido', 'text', ['color.text.inverse'], ['color.surface.inverse']),
  );

  // Texto sobre fundo sólido, em todos os estados. Um botão não deixa de
  // precisar de rótulo legível porque o cursor está em cima dele.
  for (const family of SOLID_FAMILIES) {
    pairs.push(
      ...cross(
        'texto sobre fundo sólido',
        'text',
        [`color.text.on-${family}`],
        STATES.map((state) => `color.bg.${family}.solid.${state}`),
      ),
    );
  }

  // Texto da família sobre o fundo sutil da mesma família — o par de um alerta,
  // um badge, um callout.
  for (const family of FAMILIES) {
    pairs.push(
      ...cross(
        'texto de família sobre fundo sutil',
        'text',
        [`color.text.${family}`],
        STATES.map((state) => `color.bg.${family}.subtle.${state}`),
      ),
    );
  }

  // Sobre o cinza sutil quem vai é o texto de conteúdo, não um texto de família.
  pairs.push(
    ...cross(
      'texto de conteúdo sobre cinza sutil',
      'text',
      ['color.text.primary', 'color.text.secondary'],
      STATES.map((state) => `color.bg.neutral.subtle.${state}`),
    ),
  );

  // Ícones: 3:1 por 1.4.11, e só quando carregam informação — que é o caso de
  // todos os que o sistema nomeia por papel.
  pairs.push(
    ...cross(
      'ícone sobre superfície',
      'non-text',
      [
        'color.icon.primary',
        'color.icon.secondary',
        'color.icon.tertiary',
        'color.icon.brand',
        'color.icon.accent',
        'color.icon.success',
        'color.icon.warning',
        'color.icon.danger',
        'color.icon.info',
      ],
      SURFACES,
    ),
  );

  for (const family of SOLID_FAMILIES) {
    pairs.push(
      ...cross(
        'ícone sobre fundo sólido',
        'non-text',
        [`color.icon.on-${family}`],
        STATES.map((state) => `color.bg.${family}.solid.${state}`),
      ),
    );
  }

  // Bordas que delimitam componente e o anel de foco. `border.subtle` está
  // isenta (ver EXEMPT): ela separa, não delimita controle.
  pairs.push(
    ...cross(
      'borda de componente sobre superfície',
      'non-text',
      [
        'color.border.default',
        'color.border.strong',
        'color.border.brand',
        'color.border.success',
        'color.border.warning',
        'color.border.danger',
        'color.border.info',
      ],
      SURFACES,
    ),
  );

  // O indicador de foco é o caso mais crítico de 1.4.11: quem navega por teclado
  // depende exclusivamente dele para saber onde está.
  pairs.push(
    ...cross(
      'indicador de foco',
      'non-text',
      ['color.border.focus'],
      [...SURFACES, 'color.bg.input.default'],
    ),
  );

  return pairs.filter((pair) => !(pair.foreground in EXEMPT) && !(pair.background in EXEMPT));
}

// ─── Medição ─────────────────────────────────────────────────────────────────

/**
 * Resolve um caminho de token no valor de cor daquele build.
 *
 * @param {import('./lib/dictionary.mjs').Build} build
 * @param {string} path
 * @returns {string}
 */
function colorAt(build, path) {
  const token = build.tokens.find((candidate) => candidate.path.join('.') === path);
  if (!token) {
    throw new Error(
      `A tabela de pares cita "${path}", que não existe em ${build.brand}/${build.theme}.\n` +
        `Se o token foi renomeado, atualize scripts/check-contrast.mjs — um par que aponta ` +
        `para o vazio deixa de ser verificado em silêncio.`,
    );
  }
  return String(valueOf(token));
}

/**
 * Mede um par.
 *
 * O fundo pode ser translúcido (`surface.overlay` é um véu). A razão de
 * contraste só é definida entre cores opacas, então um fundo com alfa é achatado
 * sobre a superfície da página antes da medição — que é literalmente o que o
 * navegador compõe na tela. Sem essa etapa, um overlay mediria contra o nada e
 * daria um número que não corresponde a pixel nenhum.
 *
 * @param {import('./lib/dictionary.mjs').Build} build
 * @param {Pair} pair
 */
function measure(build, pair) {
  const rawBackground = parseColor(colorAt(build, pair.background));
  const background =
    rawBackground.a < 1
      ? flatten(rawBackground, parseColor(colorAt(build, 'color.surface.page')))
      : rawBackground;

  const ratio = round2(contrastRatio(colorAt(build, pair.foreground), background));
  const { min } = LEVELS[pair.level];

  return { ...pair, ratio, min, passes: ratio >= min };
}

// ─── Relatório ───────────────────────────────────────────────────────────────

/**
 * O nome sem o prefixo `color.`, que é o mesmo em todos os tokens do relatório
 * e por isso só ocupa largura de coluna.
 *
 * @param {string} path
 */
const shortName = (path) => path.replace(/^color\./, '');

/** @typedef {ReturnType<typeof measure>} Measured */
/** @typedef {Measured & { brand: string, theme: string }} Result */

/** @param {Result[]} results */
function report(results) {
  const failures = results.filter((result) => !result.passes);
  const verbose = process.argv.includes('--verbose');

  if (verbose) {
    /** @type {Map<string, Result[]>} */
    const byRule = new Map();
    for (const result of results) {
      const list = byRule.get(result.rule) ?? [];
      list.push(result);
      byRule.set(result.rule, list);
    }

    for (const [rule, list] of byRule) {
      console.info(
        `\n  ${bold(rule)} ${dim(`· ${LEVELS[list[0].level].wcag} · mínimo ${list[0].min}:1`)}`,
      );
      for (const result of list) {
        const mark = result.passes ? green('✓') : red('✗');
        console.info(
          `    ${mark} ${String(result.ratio).padStart(5)}:1  ` +
            `${shortName(result.foreground)} ${dim('sobre')} ${shortName(result.background)}`,
        );
      }
    }
  }

  return failures;
}

// ─── Execução ────────────────────────────────────────────────────────────────

async function main() {
  const brands = await listBrands();
  const pairs = declaredPairs();

  /** @type {Result[]} */
  const all = [];

  const builds = await loadMatrix(brands, THEMES);

  for (const brand of brands) {
    for (const theme of THEMES) {
      const build = buildFor(builds, brand, theme);
      for (const pair of pairs) {
        all.push({ ...measure(build, pair), brand, theme });
      }
    }
  }

  if (process.argv.includes('--json')) {
    console.info(JSON.stringify({ total: all.length, results: all }, null, 2));
    process.exitCode = all.some((result) => !result.passes) ? 1 : 0;
    return;
  }

  const failures = report(all);
  const measured = all.length;
  const exemptCount = Object.keys(EXEMPT).length;

  if (!failures.length) {
    console.info(
      `\n${green('✓')} contraste · ${measured} pares medidos em ` +
        `${brands.length} marca(s) × ${THEMES.length} tema(s) · ${exemptCount} token(s) isento(s)\n`,
    );
    return;
  }

  console.error(
    `\n${red('✗')} contraste · ${failures.length} de ${measured} pares abaixo do mínimo\n`,
  );

  /** @type {Map<string, Result[]>} */
  const byTheme = new Map();
  for (const failure of failures) {
    const key = `${failure.brand} · ${failure.theme}`;
    const list = byTheme.get(key) ?? [];
    list.push(failure);
    byTheme.set(key, list);
  }

  for (const [key, list] of byTheme) {
    console.error(`  ${bold(key)}`);
    for (const failure of list.sort((a, b) => a.ratio - b.ratio)) {
      console.error(
        `    ${red(String(failure.ratio).padStart(5))}:1 ${dim(`(mín. ${failure.min})`)}  ` +
          `${shortName(failure.foreground)} ${dim('sobre')} ${shortName(failure.background)}  ` +
          `${dim(`— ${failure.rule}`)}`,
      );
    }
    console.error('');
  }

  console.error(
    `  ${yellow('Como resolver:')} escureça (ou clareie) o degrau da paleta que o token aliasa,\n` +
      `  ou aponte o token para outro degrau. Não ajuste o limiar — ele é a norma, não\n` +
      `  uma preferência. Se um par não deveria existir, remova-o da tabela em\n` +
      `  scripts/check-contrast.mjs e registre o porquê.\n`,
  );

  process.exitCode = 1;
}

await run('verificação de contraste falhou', main);
