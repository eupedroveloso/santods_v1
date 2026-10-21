/**
 * API do Estudio: rascunho (valores base) -> spec de marca + CSS + auditoria.
 *
 * Modulo puro (browser e Node). Contrato: tokens/ESTUDIO.contrato.md.
 *
 *   import { criarEstudio, RASCUNHO_PADRAO } from '@/lib/tokens/estudio.mjs';
 *   const estudio = criarEstudio(doc);           // doc = tokens/santods.figma.json
 *   const r = estudio.derivar({ ...RASCUNHO_PADRAO, cor: { ...RASCUNHO_PADRAO.cor, marca: '#e4572e' } });
 *   r.css   -> <style> do preview, escopo [data-brand='rascunho']
 *   r.spec  -> { Palette, Brand }, o que se grava (e o que o Figma recebe)
 *   r.salvo -> o JSON do contrato (schema santods.brand-mode/1)
 *
 * Toda escala sai de uma formula sobre UM valor base. Quando o valor cai num
 * degrau que ja existe nas primitivas, a spec grava o alias ({dimension/space/16});
 * senao, o numero. Por isso o rascunho com os valores do Santo (ou da VTSD)
 * reproduz a spec deles byte a byte — os testes cobram isso.
 */
import { hashLines, variableLine } from '../../scripts/parity-hash.mjs';
import { hexToOklch } from './color.mjs';
import { brandRamps } from './brand-ramp.mjs';
import { applyBrandMode, specOfMode, validateBrandSpec } from './brand-mode.mjs';
import { auditContrast } from './contrast-audit.mjs';
import { brandBlockCss, buildIndex, isAlias } from './emit.mjs';

export const SCHEMA = 'santods.brand-mode/1';

/* ------------------------------------------------------------- formulas */

/** Fator de cada nivel de raio sobre a base (= radius/md). none 0 e full 9999 sao fixos. */
export const RAIO_FATOR = { xs: 0.5, sm: 1, lg: 1.5, xl: 2, '2xl': 3, '3xl': 4 };
/** Fator de cada nivel de espaco sobre a unidade. none 0 e fixo. */
export const ESPACO_FATOR = { '3xs': 0.5, '2xs': 1, xs: 2, sm: 3, md: 4, lg: 6, xl: 8, '2xl': 10, '3xl': 12, '4xl': 16, '5xl': 20, '6xl': 24, '7xl': 32, '8xl': 48 };
/** Passo de cada papel na escala de tipo (body = 0). */
export const PAPEL_PASSO = {
  'caption-small': -3, caption: -2, 'body-small': -1, body: 0, 'body-large': 1,
  'heading-6': 2, 'heading-5': 3, 'heading-4': 4, 'heading-3': 5, 'heading-2': 6, 'heading-1': 7,
};
export const PAPEIS = Object.keys(PAPEL_PASSO);
export const CONTROLES = ['sm', 'md', 'lg'];

export const raio = (base, nivel) => Math.round(base * RAIO_FATOR[nivel]);
export const espaco = (unidade, nivel) => Math.max(2, Math.round((unidade * ESPACO_FATOR[nivel]) / 2) * 2);
const snap2 = (x) => Math.round(x / 2) * 2;
/** r^n para n inteiro >= 0 so com multiplicacao: `**` diverge entre motores no ultimo bit. */
const potencia = (r, n) => {
  let out = 1;
  for (let i = 0; i < n; i++) out *= r;
  return out;
};
/** Tamanho de um papel: abaixo do body a razao e fixa (1.15); acima, a razao escolhida. Piso 10, teto 96. */
export function tamanho(base, razao, papel) {
  const s = PAPEL_PASSO[papel];
  return Math.min(96, Math.max(10, snap2(s < 0 ? base / potencia(1.15, -s) : base * potencia(razao, s))));
}
/** Entrelinha: 1.5 no corpo, fechando ate 1.1 nos titulos grandes; multiplo de 2. */
export const entrelinha = (size) => snap2(size * Math.min(1.5, Math.max(1.1, 1.5 - (size - 16) * 0.008)));
/** Alfa da camada de sombra vezes a intensidade, em hex de 2 digitos. */
const alfaHex = (alpha, intensidade) => Math.min(255, Math.round(alpha * intensidade)).toString(16).padStart(2, '0');

/* -------------------------------------------------------------- presets */

export const PRESETS = {
  raio: { reto: 0, suave: 4, padrao: 8, arredondado: 12 },
  densidade: { compacta: 3, padrao: 4, confortavel: 5 },
  /** size/leading por papel, de caption-small a heading-1. 'santo' = o que o snapshot tem hoje. */
  tipografia: {
    compacta: [[10, 14], [11, 16], [12, 18], [14, 20], [16, 24], [20, 28], [24, 32], [30, 38], [36, 44], [44, 52], [54, 60]],
    santo: 'base',
    editorial: [[12, 16], [14, 20], [16, 24], [18, 28], [20, 30], [26, 34], [32, 40], [40, 48], [52, 60], [64, 72], [80, 88]],
  },
  sombra: { suave: 0.6, padrao: 1, marcada: 1.6 },
  /** Alturas sm/md/lg dos controles. */
  controles: { compacto: [28, 36, 44], padrao: [32, 40, 48], amplo: [40, 48, 56] },
  neutros: { cinza: { hue: 0, chroma: 0 }, tingido: { hue: 'marca', chroma: 'santo' }, quente: { hue: 60, chroma: 0.01 } },
  familias: [
    { nome: 'Santo', corpo: 'Albert Sans', titulo: 'Albert Sans', mono: 'JetBrains Mono' },
    { nome: 'VTSD', corpo: 'Sora', titulo: 'Sora', mono: 'JetBrains Mono' },
    { nome: 'Inter', corpo: 'Inter', titulo: 'Inter', mono: 'JetBrains Mono' },
    { nome: 'Manrope', corpo: 'Manrope', titulo: 'Manrope', mono: 'JetBrains Mono' },
  ],
};

/**
 * Rascunho com os valores do Santo. `cor.origem: 'base'` copia a Palette da marca
 * padrao (as rampas do Santo nao sairam do gerador); 'marca' gera pela cor oficial.
 */
export const RASCUNHO_PADRAO = {
  modo: 'Rascunho',
  id: 'rascunho',
  nome: 'Rascunho',
  cor: { origem: 'base', marca: '#4693ff', ancora: '600', neutros: 'cinza' },
  tipografia: { corpo: 'Albert Sans', titulo: 'Albert Sans', mono: 'JetBrains Mono', escala: 'santo' },
  raio: 8,
  espaco: 4,
  sombra: { intensidade: 1, tinta: 'atual' },
  controles: 'padrao',
};

/* ------------------------------------------------------------- derivacao */

/** Le um valor do modo padrao da Brand/Palette (ex.: a escala de tipo do Santo). */
const baseValue = (doc, collection, name) => {
  const c = doc.collections[collection];
  const def = c.variables[name];
  return (def.values ?? { [c.defaultMode]: def.value })[c.defaultMode];
};

/** Niveis de sombra com camadas (none fica de fora: nao tem cor). */
export const SOMBRA_NIVEIS = ['xs', 'sm', 'md', 'lg', 'xl', '2xl'];

/** Problemas do campo `passos` (nivel inexistente; px inteiro >= 0; intensidade numero >= 0). */
function problemasDosPassos(passos = {}) {
  const out = [];
  const conferir = (grupo, niveis, valores = {}) => {
    for (const [nivel, px] of Object.entries(valores)) {
      if (!niveis.includes(nivel)) out.push(`passos.${grupo}.${nivel}: nivel inexistente (use ${niveis.join(', ')})`);
      else if (!Number.isInteger(px) || px < 0) out.push(`passos.${grupo}.${nivel}: ${JSON.stringify(px)} precisa ser inteiro >= 0 (px)`);
    }
  };
  conferir('raio', Object.keys(RAIO_FATOR), passos.raio);
  conferir('espaco', Object.keys(ESPACO_FATOR), passos.espaco);
  for (const [nivel, k] of Object.entries(passos.sombra ?? {})) {
    if (!SOMBRA_NIVEIS.includes(nivel)) out.push(`passos.sombra.${nivel}: nivel inexistente (use ${SOMBRA_NIVEIS.join(', ')})`);
    else if (typeof k !== 'number' || !Number.isFinite(k) || k < 0) out.push(`passos.sombra.${nivel}: ${JSON.stringify(k)} precisa ser numero >= 0 (intensidade)`);
  }
  return out;
}

function deriveSpec(doc, d) {
  const index = buildIndex(doc);
  /** Alias para o degrau primitivo quando ele existe; senao o numero. */
  const step = (prefix, n) => (index.has(`${prefix}/${n}`) ? `{${prefix}/${n}}` : n);

  // Palette: brand + neutral derivadas (ou a base); accent e status travados (copia da base).
  const base = specOfMode(doc, doc.collections.Palette.defaultMode);
  const Palette = { ...base.Palette };
  if (d.cor.origem !== 'base') {
    const preset = typeof d.cor.neutros === 'string' ? PRESETS.neutros[d.cor.neutros] : d.cor.neutros;
    if (!preset) throw new Error(`Preset de neutros inexistente: ${d.cor.neutros}`);
    // hue 'marca': os neutros tingem no matiz da cor oficial.
    const neutralHue = preset.hue === 'marca' ? hexToOklch(d.cor.marca.toLowerCase())[2] : preset.hue;
    const { values } = brandRamps(doc, d.cor.marca, { anchor: d.cor.ancora ?? '600', neutralHue, neutralChroma: preset.chroma });
    Object.assign(Palette, values);
  }

  const Brand = {};
  for (const name of Object.keys(doc.collections.Brand.variables)) Brand[name] = undefined;
  Brand['brand/id'] = d.id;
  Brand['brand/name'] = d.nome;
  Brand['brand/family/sans'] = d.tipografia.corpo;
  Brand['brand/family/mono'] = d.tipografia.mono;
  if ('brand/family/heading' in Brand) Brand['brand/family/heading'] = d.tipografia.titulo;

  Brand['brand/shape/radius-base'] = step('dimension/radius', d.raio);
  for (const nivel of Object.keys(RAIO_FATOR)) {
    const name = `brand/shape/radius-${nivel}`;
    if (name in Brand) Brand[name] = step('dimension/radius', raio(d.raio, nivel));
  }
  for (const nivel of Object.keys(ESPACO_FATOR)) {
    const name = `brand/space/${nivel}`;
    if (name in Brand) Brand[name] = step('dimension/space', espaco(d.espaco, nivel));
  }
  // Passos editados a mao no painel: sobrescrevem a formula, nivel a nivel (raio md = base).
  for (const [nivel, px] of Object.entries(d.passos?.raio ?? {})) Brand[`brand/shape/radius-${nivel}`] = step('dimension/radius', px);
  for (const [nivel, px] of Object.entries(d.passos?.espaco ?? {})) Brand[`brand/space/${nivel}`] = step('dimension/space', px);

  // Tipografia: preset 'santo' copia a base; tabela; ou { base, razao }.
  const escala = typeof d.tipografia.escala === 'string' ? PRESETS.tipografia[d.tipografia.escala] : d.tipografia.escala;
  if (escala === undefined) throw new Error(`Preset de tipografia inexistente: ${d.tipografia.escala}`);
  PAPEIS.forEach((papel, i) => {
    const s = `brand/type/${papel}/size`;
    const l = `brand/type/${papel}/leading`;
    if (!(s in Brand)) return;
    if (escala === 'base') {
      Brand[s] = baseValue(doc, 'Brand', s);
      Brand[l] = baseValue(doc, 'Brand', l);
      return;
    }
    const [size, lead] = Array.isArray(escala) ? escala[i] : [tamanho(escala.base, escala.razao, papel), undefined];
    Brand[s] = step('type/size', size);
    Brand[l] = step('type/leading', lead ?? entrelinha(size));
  });

  const alturas = typeof d.controles === 'string' ? PRESETS.controles[d.controles] : d.controles;
  if (!alturas) throw new Error(`Preset de controles inexistente: ${d.controles}`);
  CONTROLES.forEach((c, i) => {
    const name = `brand/control/height/${c}`;
    if (name in Brand) Brand[name] = step('dimension/size', alturas[i]);
  });

  // Sombra: geometria travada; cor = tinta x alfa da camada x intensidade.
  // tinta 'atual' mantem a cor de hoje de cada camada; 'marca' usa palette/neutral/950 da marca.
  // passos.sombra[nivel] substitui a intensidade global para as camadas daquele nivel.
  for (const name of Object.keys(Brand).filter((n) => n.startsWith('brand/shadow/'))) {
    const nivel = name.split('/')[2];
    const atual = baseValue(doc, 'Brand', name);
    const tinta = d.sombra.tinta === 'marca' ? Palette['palette/neutral/950'] : atual.slice(0, 7);
    const alpha = atual.length === 9 ? parseInt(atual.slice(7, 9), 16) : 255;
    Brand[name] = `${tinta}${alfaHex(alpha, d.passos?.sombra?.[nivel] ?? d.sombra.intensidade)}`;
  }

  for (const [name, v] of Object.entries(Brand)) if (v === undefined) throw new Error(`Derivacao nao cobre ${name}`);
  return { Palette, Brand };
}

/** Hashes FNV-1a de Palette, Brand e Color do doc (os mesmos do check-parity). */
export function baseHashes(doc) {
  return Object.fromEntries(
    ['Palette', 'Brand', 'Color'].filter((c) => doc.collections[c]).map((cn) => {
      const c = doc.collections[cn];
      const lines = Object.entries(c.variables).map(([n, def]) =>
        variableLine(n, def.type, def.scopes ?? [], c.modes, def.values ?? { [c.defaultMode]: def.value }, def.description),
      );
      return [cn, hashLines(lines)];
    }),
  );
}

/** Familias que o preview precisa carregar (Google Fonts, pelo nome real). */
const familiasDe = (spec) =>
  [...new Set(Object.entries(spec.Brand).filter(([n, v]) => n.startsWith('brand/family/') && !isAlias(v)).map(([, v]) => v))];

/**
 * @param {object} doc     tokens/santods.figma.json
 * @param {object} draft   rascunho (formato de RASCUNHO_PADRAO)
 * @param {{ fonts?: string[], scope?: string }} [opts]  fonts: catalogo aceito (lib/fonts/catalog.ts)
 */
export function derivar(doc, draft, { fonts, scope } = {}) {
  const d = { ...RASCUNHO_PADRAO, ...draft };
  const passos = problemasDosPassos(d.passos);
  if (passos.length) return { ok: false, problems: passos, spec: undefined };
  const spec = deriveSpec(doc, d);
  const problems = validateBrandSpec(doc, spec, { mode: d.modo, fonts });
  if (problems.length) return { ok: false, problems, spec };
  const { doc: comModo } = applyBrandMode(doc, d.modo, spec);
  return {
    ok: true,
    problems: [],
    modo: d.modo,
    spec,
    css: brandBlockCss(comModo, d.modo, scope ? { scope } : {}),
    familias: familiasDe(spec),
    auditoria: { Light: auditContrast(comModo, d.modo, 'Light'), Dark: auditContrast(comModo, d.modo, 'Dark') },
    salvo: {
      schema: SCHEMA,
      base: { fileKey: doc.meta.fileKey, hashes: baseHashes(doc) },
      mode: d.modo,
      draft: d,
      spec,
      descriptions: {},
    },
  };
}

/** `derivar` com o doc ja amarrado: criarEstudio(doc).derivar(draft). */
export function criarEstudio(doc, opts = {}) {
  return { derivar: (draft, more = {}) => derivar(doc, draft, { ...opts, ...more }) };
}

/** Um sistema salvo ainda bate com o nucleo atual? (senao: rederivar do draft e mostrar o diff) */
export function salvoAtual(doc, salvo) {
  const now = baseHashes(doc);
  return salvo.schema === SCHEMA && Object.entries(salvo.base.hashes).every(([c, h]) => now[c] === h);
}

