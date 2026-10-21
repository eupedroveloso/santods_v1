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
import { composite, contrast, hexToOklch } from './color.mjs';
import { baseRamp, brandRamps, neutralRamp } from './brand-ramp.mjs';
import { applyBrandMode, specOfMode, validateBrandSpec } from './brand-mode.mjs';
import { auditContrast, resolveColor } from './contrast-audit.mjs';
import { brandBlockCss, buildIndex, isAlias } from './emit.mjs';
import { folhasDeFonte, PESOS_DO_SISTEMA, problemasDaFamilia } from '../fonts/google.mjs';

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
 * Pesos carregados por papel de familia. corpo e titulo: os 6 pesos dos text styles
 * (light..extrabold); mono: so o regular dos estilos code/*. Restringir aqui so muda o
 * que se baixa do Google; os text styles continuam existindo nos 6 pesos.
 */
export const PESOS_PADRAO = { corpo: [...PESOS_DO_SISTEMA], titulo: [...PESOS_DO_SISTEMA], mono: [400] };
const FAMILIAS_SANTO = { corpo: 'Albert Sans', titulo: 'Albert Sans', mono: 'JetBrains Mono' };

/**
 * Presets de tipografia como entidade: { id, nome, familias, pesos, base, razao, tabela? }.
 * Os fixos seguem o mesmo formato dos personalizados (que o Estudio guarda no banco).
 * `tabela` (11 pares [size, leading], de caption-small a heading-1) vence a formula;
 * 'base' = a escala que o snapshot tem hoje.
 */
export const PRESETS_TIPOGRAFIA = {
  compacta: { id: 'compacta', nome: 'Compacta', familias: FAMILIAS_SANTO, pesos: PESOS_PADRAO, base: 14, razao: 1.2, tabela: PRESETS.tipografia.compacta },
  santo: { id: 'santo', nome: 'Santo', familias: FAMILIAS_SANTO, pesos: PESOS_PADRAO, base: 16, razao: 1.25, tabela: 'base' },
  editorial: { id: 'editorial', nome: 'Editorial', familias: FAMILIAS_SANTO, pesos: PESOS_PADRAO, base: 18, razao: 1.25, tabela: PRESETS.tipografia.editorial },
};

/** Problemas de um preset de tipografia (personalizado). Com `indice`, confere familias e pesos. */
export function validarPresetTipografia(preset, { indice } = {}) {
  const out = [];
  const p = preset ?? {};
  if (typeof p.id !== 'string' || !/^[a-z][a-z0-9-]*$/.test(p.id)) out.push(`[preset-invalido] id ${JSON.stringify(p.id)} precisa ser slug`);
  else if (p.id in PRESETS_TIPOGRAFIA && p !== PRESETS_TIPOGRAFIA[p.id]) out.push(`[preset-invalido] id "${p.id}" e reservado a um preset fixo`);
  if (typeof p.nome !== 'string' || !p.nome.trim()) out.push('[preset-invalido] nome vazio');
  if (!(p.base >= 10 && p.base <= 24)) out.push(`[preset-invalido] base ${JSON.stringify(p.base)} fora de 10..24 px`);
  if (!(p.razao >= 1 && p.razao <= 2)) out.push(`[preset-invalido] razao ${JSON.stringify(p.razao)} fora de 1..2`);
  if (p.tabela !== undefined && p.tabela !== 'base') {
    const ok = Array.isArray(p.tabela) && p.tabela.length === PAPEIS.length &&
      p.tabela.every((par) => Array.isArray(par) && par.length === 2 && par.every((n) => Number.isInteger(n) && n > 0));
    if (!ok) out.push(`[preset-invalido] tabela precisa de ${PAPEIS.length} pares [size, leading] inteiros > 0 (caption-small a heading-1)`);
  }
  out.push(...problemasDeTipografia(p.familias ?? {}, p.pesos ?? {}, indice));
  return out;
}

/** Rascunho com as familias, os pesos e a escala de um preset de tipografia. */
export function aplicarPresetTipografia(rascunho, preset) {
  return {
    ...rascunho,
    tipografia: { ...preset.familias, pesos: { ...PESOS_PADRAO, ...preset.pesos }, escala: preset },
  };
}

/** Problemas das familias e pesos por papel (familia fora do indice, mono nao monoespacada, peso indisponivel). */
function problemasDeTipografia(familias, pesos, indice) {
  const out = [];
  for (const papel of ['corpo', 'titulo', 'mono']) {
    const familia = familias[papel];
    const lista = pesos[papel] ?? PESOS_PADRAO[papel];
    if (typeof familia !== 'string' || !familia.trim()) {
      out.push(`[familia-vazia] ${papel}: sem familia`);
      continue;
    }
    if (!Array.isArray(lista) || !lista.length) out.push(`[peso-fora-do-sistema] ${papel}: precisa de ao menos um peso`);
    if (indice) out.push(...problemasDaFamilia(indice, familia, papel, lista));
    else for (const peso of lista) if (!PESOS_DO_SISTEMA.includes(peso)) out.push(`[peso-fora-do-sistema] ${papel}: ${peso} (use ${PESOS_DO_SISTEMA.join(', ')})`);
  }
  return out;
}

/** Escala de tipo de um rascunho: 'base' (snapshot), tabela [[size, leading]...] ou { base, razao }. */
function resolverEscala(escala, presetsTipografia = []) {
  if (typeof escala === 'string') {
    const preset = PRESETS_TIPOGRAFIA[escala] ?? presetsTipografia.find((p) => p.id === escala);
    if (!preset) throw new Error(`Preset de tipografia inexistente: ${escala}`);
    return resolverEscala(preset);
  }
  if (escala && !Array.isArray(escala) && 'id' in escala) {
    return escala.tabela ?? { base: escala.base, razao: escala.razao };
  }
  return escala;
}

/* ------------------------------------------------------------------ cor */

/**
 * Neutros do rascunho, normalizados. Aceita:
 *   'cinza' | 'tingido' | 'quente'                     (preset, derivado da marca)
 *   { hue, chroma }                                    (derivado, formato antigo)
 *   { origem: 'derivada', preset?, ajuste?: { tinta, saturacao } }
 *   { origem: 'manual', base: '#rrggbb' }              (rampa da cor de referencia)
 */
function neutrosDe(neutros) {
  if (typeof neutros === 'string') return { origem: 'derivada', preset: PRESETS.neutros[neutros] };
  if (neutros?.origem === 'manual') return { origem: 'manual', base: neutros.base };
  if (neutros?.origem === 'derivada') return { origem: 'derivada', preset: PRESETS.neutros[neutros.preset ?? 'cinza'], ajuste: neutros.ajuste };
  return { origem: 'derivada', preset: neutros };
}

/** Matiz (graus) dos neutros da marca padrao, no degrau 500. */
const matizNeutroBase = (doc) => hexToOklch(baseRamp(doc, 'neutral').find(([k]) => k.endsWith('/500'))[1])[2];

/** Matiz a `t` (0..1) do caminho mais curto de `a` ate `b`, em graus. */
export function misturarMatiz(a, b, t) {
  const d = ((b - a + 540) % 360) - 180;
  return (a + d * t + 360) % 360;
}

const HEX6 = /^#[0-9a-fA-F]{6}$/;

/** Problemas da cor (todos com o codigo [cor-invalida]). */
export function problemasDeCor(cor, passosCor, doc) {
  const out = [];
  const err = (m) => out.push(`[cor-invalida] ${m}`);
  if (!['base', 'marca'].includes(cor?.origem)) err(`origem "${cor?.origem}": use 'base' ou 'marca'`);
  if (typeof cor?.marca !== 'string' || !HEX6.test(cor.marca)) err(`marca ${JSON.stringify(cor?.marca)}: use #rrggbb`);
  const n = cor?.neutros;
  if (typeof n === 'string') {
    if (!(n in PRESETS.neutros)) err(`neutros "${n}": preset inexistente (${Object.keys(PRESETS.neutros).join(', ')})`);
  } else if (n?.origem === 'manual') {
    if (typeof n.base !== 'string' || !HEX6.test(n.base)) err(`neutros.base ${JSON.stringify(n.base)}: use #rrggbb`);
  } else if (n?.origem === 'derivada') {
    if (n.preset !== undefined && !(n.preset in PRESETS.neutros)) err(`neutros.preset "${n.preset}" inexistente`);
    if (n.ajuste !== undefined) {
      const { tinta, saturacao } = n.ajuste ?? {};
      if (!(typeof tinta === 'number' && tinta >= 0 && tinta <= 100)) err(`neutros.ajuste.tinta ${JSON.stringify(tinta)}: % de 0 a 100`);
      if (!(typeof saturacao === 'number' && saturacao >= 0 && saturacao <= 300)) err(`neutros.ajuste.saturacao ${JSON.stringify(saturacao)}: % de 0 a 300`);
    }
  } else if (!(n && typeof n.hue !== 'undefined' && typeof n.chroma !== 'undefined')) {
    err('neutros: preset, { origem: "derivada" | "manual", ... } ou { hue, chroma }');
  }
  for (const [familia, degraus] of Object.entries(passosCor ?? {})) {
    if (!['brand', 'neutral'].includes(familia)) {
      err(`passos.cor.${familia}: rampa inexistente (use brand ou neutral)`);
      continue;
    }
    const existentes = baseRamp(doc, familia).map(([k]) => k.split('/').pop());
    for (const [degrau, hex] of Object.entries(degraus ?? {})) {
      if (!existentes.includes(degrau)) err(`passos.cor.${familia}.${degrau}: degrau inexistente (${existentes.join(', ')})`);
      else if (typeof hex !== 'string' || !HEX6.test(hex)) err(`passos.cor.${familia}.${degrau}: ${JSON.stringify(hex)} nao e #rrggbb`);
    }
  }
  return out;
}

/* ----------------------------------------------------------- superficies */

/** Degraus da rampa neutral (palette/neutral/*). */
export const NEUTRAL_DEGRAUS = [0, 50, 100, 200, 300, 400, 500, 600, 700, 800, 900, 950, 1000];
/** Superficies com tom (overlay tem cor + alfa, fora do mapa de degraus). */
export const SUPERFICIES = ['page', 'raised', 'sunken', 'well', 'panel'];
export const BORDAS = ['subtle', 'default', 'strong'];
const TEMAS = { claro: 'light', escuro: 'dark' };

const TONS_SANTO = {
  claro: { page: 50, raised: 0, sunken: 100, well: 100, panel: 0 },
  escuro: { page: 950, raised: 900, sunken: 1000, well: 1000, panel: 900 },
};
const BORDAS_SANTO = { claro: { subtle: 200, default: 300, strong: 400 }, escuro: { subtle: 800, default: 700, strong: 600 } };
const OVERLAY_SANTO = { claro: '#100d1699', escuro: '#000000b8' };

/**
 * Estilo Superficies: a relacao de cores entre superficies e a borda dupla.
 *   tons:          superficie -> degrau da rampa neutral, por tema (profundidade por tom)
 *   overlay:       hex8 ou { degrau, alfa } por tema
 *   bordas:        subtle/default/strong -> degrau, por tema
 *   bordaDupla:    liga a moldura (brand/frame/enabled)
 *   recuo:         degrau de ESPACO da moldura (acompanha a densidade)
 *   bordaInterna:  borda do painel interno da moldura: degrau ou 'transparente', por tema
 * O painel interno da moldura e a superficie `panel`.
 */
export const PRESETS_SUPERFICIES = {
  /** O Santo de hoje: Card double em toda parte que agrupa. */
  'borda-dupla': { tratamento: 'borda-dupla', bordaDupla: true, recuo: 'xs', tons: TONS_SANTO, overlay: OVERLAY_SANTO, bordas: BORDAS_SANTO, bordaInterna: { claro: 'transparente', escuro: 800 } },
  /** Mesmos tons, sem moldura: profundidade so por tom e sombra. */
  tonal: { tratamento: 'tonal', bordaDupla: false, recuo: 'xs', tons: TONS_SANTO, overlay: OVERLAY_SANTO, bordas: BORDAS_SANTO, bordaInterna: { claro: 'transparente', escuro: 800 } },
  /** Chao e cartao no mesmo tom: a borda separa. */
  plana: {
    tratamento: 'plana',
    bordaDupla: false,
    recuo: 'xs',
    tons: { claro: { page: 0, raised: 0, sunken: 50, well: 50, panel: 0 }, escuro: { page: 950, raised: 950, sunken: 1000, well: 1000, panel: 950 } },
    overlay: OVERLAY_SANTO,
    bordas: { claro: { subtle: 200, default: 300, strong: 400 }, escuro: { subtle: 800, default: 700, strong: 600 } },
    bordaInterna: { claro: 200, escuro: 800 },
  },
};

const HEX8 = /^#[0-9a-f]{8}$/;
const degrauOk = (n) => NEUTRAL_DEGRAUS.includes(n);

/** Problemas do estilo Superficies (todos com o codigo [superficie-invalida]). */
export function problemasDeSuperficies(sup) {
  const out = [];
  const err = (m) => out.push(`[superficie-invalida] ${m}`);
  if (!sup || typeof sup !== 'object') return [`[superficie-invalida] superficies ausente`];
  if (typeof sup.bordaDupla !== 'boolean') err('bordaDupla precisa ser true ou false');
  if (!(sup.recuo in ESPACO_FATOR)) err(`recuo "${sup.recuo}" nao e degrau de espaco (${Object.keys(ESPACO_FATOR).join(', ')})`);
  for (const tema of Object.keys(TEMAS)) {
    for (const s of SUPERFICIES) if (!degrauOk(sup.tons?.[tema]?.[s])) err(`tons.${tema}.${s}: ${JSON.stringify(sup.tons?.[tema]?.[s])} nao e degrau neutral (${NEUTRAL_DEGRAUS.join(', ')})`);
    for (const b of BORDAS) if (!degrauOk(sup.bordas?.[tema]?.[b])) err(`bordas.${tema}.${b}: ${JSON.stringify(sup.bordas?.[tema]?.[b])} nao e degrau neutral`);
    const o = sup.overlay?.[tema];
    const overlayOk = (typeof o === 'string' && HEX8.test(o)) || (o && degrauOk(o.degrau) && o.alfa >= 0 && o.alfa <= 1);
    if (!overlayOk) err(`overlay.${tema}: use #rrggbbaa ou { degrau, alfa 0..1 }`);
    const bi = sup.bordaInterna?.[tema];
    if (bi !== 'transparente' && !degrauOk(bi)) err(`bordaInterna.${tema}: degrau neutral ou 'transparente'`);
  }
  return out;
}

const resolverSuperficies = (sup) => (typeof sup === 'string' ? PRESETS_SUPERFICIES[sup] : sup);

/**
 * Rascunho com os valores do Santo. `cor.origem: 'base'` copia a Palette da marca
 * padrao (as rampas do Santo nao sairam do gerador); 'marca' gera pela cor oficial.
 */
export const RASCUNHO_PADRAO = {
  modo: 'Rascunho',
  id: 'rascunho',
  nome: 'Rascunho',
  cor: { origem: 'base', marca: '#4693ff', ancora: '600', neutros: 'cinza' },
  tipografia: { ...FAMILIAS_SANTO, pesos: PESOS_PADRAO, escala: 'santo' },
  raio: 8,
  espaco: 4,
  superficies: 'borda-dupla',
  efeitos: 'padrao',
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
    else if (k && typeof k === 'object') continue; // { intensidade, desfoque, deslocamento }: problemasDeParametros confere
    else if (typeof k !== 'number' || !Number.isFinite(k) || k < 0) out.push(`passos.sombra.${nivel}: ${JSON.stringify(k)} precisa ser numero >= 0 (intensidade)`);
  }
  return out;
}

/* ------------------------------------------- raio, espaco, controles, sombra */

/** Passo de cada nivel de raio na curva geometrica (md = 0). */
const RAIO_PASSO = { xs: -2, sm: -1, lg: 1, xl: 2, '2xl': 3, '3xl': 4 };
const NIVEIS_ESPACO = Object.keys(ESPACO_FATOR);
/** Curva linear de espaco: um passo de unidade por nivel a partir de xs. */
const ESPACO_LINEAR = Object.fromEntries(NIVEIS_ESPACO.map((n, i) => [n, i === 0 ? 0.5 : i]));
const potenciaInteira = (r, k) => (k >= 0 ? potencia(r, k) : 1 / potencia(r, -k));

/**
 * Raio: numero (formato antigo: container = controle = base) ou
 * { container, controle, curva: 'santo' | { razao } }. 'santo' = os fatores de RAIO_FATOR.
 */
export function raioDe(r) {
  if (typeof r === 'number') return { container: r, controle: r, curva: 'santo' };
  return { container: r.container, controle: r.controle ?? r.container, curva: r.curva ?? 'santo' };
}
export const raioNivel = (r, nivel) =>
  r.curva === 'santo' ? raio(r.container, nivel) : Math.round(r.container * potenciaInteira(r.curva.razao, RAIO_PASSO[nivel]));

/** Espaco: numero (unidade, curva santo) ou { unidade, curva: 'santo' | 'linear' | { razao } }. */
export function espacoDe(e) {
  if (typeof e === 'number') return { unidade: e, curva: 'santo' };
  return { unidade: e.unidade, curva: e.curva ?? 'santo' };
}
export function espacoNivel(e, nivel) {
  if (e.curva === 'santo') return espaco(e.unidade, nivel);
  const fator = e.curva === 'linear' ? ESPACO_LINEAR[nivel] : 4 * potenciaInteira(e.curva.razao, NIVEIS_ESPACO.indexOf(nivel) - 4);
  return Math.max(2, Math.round((e.unidade * fator) / 2) * 2);
}

/** Os 7 parametros de um tamanho de controle. paddingX/gap: degrau de espaco ou px; fonte: papel ou px. */
const CONTROLE_PADRAO = {
  sm: { altura: 32, paddingX: 'sm', raio: 'controle', borda: 1, fonte: 'caption', icone: 16, gap: '2xs' },
  md: { altura: 40, paddingX: 'md', raio: 'controle', borda: 1, fonte: 'body-small', icone: 16, gap: 'xs' },
  lg: { altura: 48, paddingX: 'lg', raio: 'controle', borda: 1, fonte: 'body', icone: 16, gap: 'xs' },
};
export const PRESETS_CONTROLES = {
  compacto: {
    sm: { altura: 28, paddingX: 'xs', raio: 'controle', borda: 1, fonte: 'caption', icone: 12, gap: '2xs' },
    md: { altura: 36, paddingX: 'sm', raio: 'controle', borda: 1, fonte: 'caption', icone: 16, gap: '2xs' },
    lg: { altura: 44, paddingX: 'md', raio: 'controle', borda: 1, fonte: 'body-small', icone: 16, gap: 'xs' },
  },
  padrao: CONTROLE_PADRAO,
  confortavel: {
    sm: { altura: 40, paddingX: 'md', raio: 'controle', borda: 1, fonte: 'body-small', icone: 16, gap: 'xs' },
    md: { altura: 48, paddingX: 'lg', raio: 'controle', borda: 1, fonte: 'body', icone: 16, gap: 'xs' },
    lg: { altura: 56, paddingX: 'xl', raio: 'controle', borda: 1, fonte: 'body-large', icone: 20, gap: 'sm' },
  },
};

/**
 * Controles: id de preset, [alturas sm, md, lg] (formato antigo, sobre o padrao) ou
 * { sm?, md?, lg? } com parametros parciais por tamanho (sobre o padrao).
 */
export function controlesDe(c) {
  if (typeof c === 'string') {
    const preset = PRESETS_CONTROLES[c === 'amplo' ? 'confortavel' : c];
    if (!preset) throw new Error(`Preset de controles inexistente: ${c}`);
    return preset;
  }
  if (Array.isArray(c)) return Object.fromEntries(CONTROLES.map((t, i) => [t, { ...CONTROLE_PADRAO[t], altura: c[i] }]));
  return Object.fromEntries(CONTROLES.map((t) => [t, { ...CONTROLE_PADRAO[t], ...(c?.[t] ?? {}) }]));
}

export const PRESETS_SOMBRA = {
  suave: { intensidade: 0.6, tinta: 'atual', desfoque: 0.8, deslocamento: 0.75 },
  padrao: { intensidade: 1, tinta: 'atual', desfoque: 1, deslocamento: 1 },
  marcada: { intensidade: 1.6, tinta: 'atual', desfoque: 1.25, deslocamento: 1.5 },
};
/** Sombra: id de preset ou { intensidade, tinta, desfoque?, deslocamento? } (multiplicadores, padrao 1). */
export function sombraDe(sb) {
  if (typeof sb === 'string') {
    if (!PRESETS_SOMBRA[sb]) throw new Error(`Preset de sombra inexistente: ${sb}`);
    return PRESETS_SOMBRA[sb];
  }
  return { intensidade: 1, tinta: 'atual', desfoque: 1, deslocamento: 1, ...sb };
}

/** Mapa valor (%) -> primitiva type/tracking/* do doc. */
function trackingPorValor(index) {
  return new Map(
    [...index.values()].filter((v) => v.name.startsWith('type/tracking/')).map((v) => [v.values[v.defaultMode], v.name]),
  );
}

const inteiroEntre = (v, a, b) => Number.isInteger(v) && v >= a && v <= b;
const numeroEntre = (v, a, b) => typeof v === 'number' && Number.isFinite(v) && v >= a && v <= b;

/** 422 por parametro de raio, espaco, controles, sombra e tracking (codigo por estilo). */
export function problemasDeParametros(d) {
  const out = [];
  const err = (codigo, m) => out.push(`[${codigo}] ${m}`);
  // raio
  if (typeof d.raio === 'number') {
    if (!inteiroEntre(d.raio, 0, 64)) err('raio-invalido', `raio ${d.raio}: inteiro de 0 a 64 px`);
  } else if (d.raio && typeof d.raio === 'object') {
    if (!inteiroEntre(d.raio.container, 0, 64)) err('raio-invalido', `raio.container ${JSON.stringify(d.raio.container)}: inteiro de 0 a 64 px`);
    if (d.raio.controle !== undefined && !inteiroEntre(d.raio.controle, 0, 32)) err('raio-invalido', `raio.controle ${JSON.stringify(d.raio.controle)}: inteiro de 0 a 32 px`);
    const cv = d.raio.curva ?? 'santo';
    if (cv !== 'santo' && !numeroEntre(cv?.razao, 1.05, 3)) err('raio-invalido', `raio.curva: 'santo' ou { razao 1.05..3 }`);
  } else err('raio-invalido', 'raio: numero ou { container, controle, curva }');
  // espaco
  if (typeof d.espaco === 'number') {
    if (!numeroEntre(d.espaco, 2, 8)) err('espaco-invalido', `espaco ${d.espaco}: unidade de 2 a 8 px`);
  } else if (d.espaco && typeof d.espaco === 'object') {
    if (!numeroEntre(d.espaco.unidade, 2, 8)) err('espaco-invalido', `espaco.unidade ${JSON.stringify(d.espaco.unidade)}: de 2 a 8 px`);
    const cv = d.espaco.curva ?? 'santo';
    if (cv !== 'santo' && cv !== 'linear' && !numeroEntre(cv?.razao, 1.05, 2)) err('espaco-invalido', `espaco.curva: 'santo', 'linear' ou { razao 1.05..2 }`);
  } else err('espaco-invalido', 'espaco: numero ou { unidade, curva }');
  // controles
  if (typeof d.controles === 'string') {
    if (!(d.controles in PRESETS_CONTROLES) && d.controles !== 'amplo') err('controle-invalido', `preset de controles inexistente: ${d.controles}`);
  } else if (Array.isArray(d.controles)) {
    if (d.controles.length !== 3 || !d.controles.every((h) => inteiroEntre(h, 16, 96))) err('controle-invalido', 'alturas [sm, md, lg]: 3 inteiros de 16 a 96');
  } else if (d.controles && typeof d.controles === 'object') {
    for (const [t, p] of Object.entries(d.controles)) {
      if (!CONTROLES.includes(t)) {
        err('controle-invalido', `controles.${t}: tamanho inexistente (sm, md, lg)`);
        continue;
      }
      const at = (k) => `controles.${t}.${k}`;
      const esp = (v) => (typeof v === 'string' ? v in ESPACO_FATOR : inteiroEntre(v, 0, 64));
      if (p.altura !== undefined && !inteiroEntre(p.altura, 16, 96)) err('controle-invalido', `${at('altura')}: inteiro de 16 a 96 px`);
      if (p.paddingX !== undefined && !esp(p.paddingX)) err('controle-invalido', `${at('paddingX')}: degrau de espaco ou inteiro de 0 a 64 px`);
      if (p.raio !== undefined && p.raio !== 'controle' && !inteiroEntre(p.raio, 0, 48)) err('controle-invalido', `${at('raio')}: 'controle' ou inteiro de 0 a 48 px`);
      if (p.borda !== undefined && !inteiroEntre(p.borda, 0, 4)) err('controle-invalido', `${at('borda')}: inteiro de 0 a 4 px`);
      if (p.fonte !== undefined && !(typeof p.fonte === 'string' ? PAPEIS.includes(p.fonte) : inteiroEntre(p.fonte, 10, 32))) err('controle-invalido', `${at('fonte')}: papel de texto ou inteiro de 10 a 32 px`);
      if (p.icone !== undefined && !inteiroEntre(p.icone, 8, 48)) err('controle-invalido', `${at('icone')}: inteiro de 8 a 48 px`);
      if (p.gap !== undefined && !esp(p.gap)) err('controle-invalido', `${at('gap')}: degrau de espaco ou inteiro de 0 a 64 px`);
    }
  } else err('controle-invalido', 'controles: preset, [alturas] ou { sm, md, lg }');
  // sombra
  const conferirSombra = (o, onde) => {
    if (o.intensidade !== undefined && !numeroEntre(o.intensidade, 0, 10)) err('sombra-invalida', `${onde}.intensidade: numero de 0 a 10`);
    if (o.desfoque !== undefined && !numeroEntre(o.desfoque, 0, 4)) err('sombra-invalida', `${onde}.desfoque: multiplicador de 0 a 4`);
    if (o.deslocamento !== undefined && !numeroEntre(o.deslocamento, 0, 4)) err('sombra-invalida', `${onde}.deslocamento: multiplicador de 0 a 4`);
  };
  if (typeof d.sombra === 'string') {
    if (!(d.sombra in PRESETS_SOMBRA)) err('sombra-invalida', `preset de sombra inexistente: ${d.sombra}`);
  } else if (d.sombra && typeof d.sombra === 'object') {
    conferirSombra(d.sombra, 'sombra');
    const tinta = d.sombra.tinta ?? 'atual';
    if (!['atual', 'marca'].includes(tinta) && !(typeof tinta === 'string' && HEX6.test(tinta))) err('sombra-invalida', `sombra.tinta: 'atual', 'marca' ou #rrggbb`);
  } else err('sombra-invalida', 'sombra: preset ou { intensidade, tinta, desfoque, deslocamento }');
  for (const [nivel, p] of Object.entries(d.passos?.sombra ?? {})) if (p && typeof p === 'object') conferirSombra(p, `passos.sombra.${nivel}`);
  // tracking
  for (const [papel, pct] of Object.entries(d.tipografia?.tracking ?? {})) {
    if (!PAPEIS.includes(papel)) err('tracking-invalido', `tipografia.tracking.${papel}: papel inexistente`);
    else if (!numeroEntre(pct, -10, 20)) err('tracking-invalido', `tipografia.tracking.${papel}: ${JSON.stringify(pct)} fora de -10..20 (%)`);
  }
  return out;
}

/**
 * Auditoria dos controles (nao bloqueia): valores resolvidos por tamanho e os avisos.
 *   [alvo-pequeno]       altura < 24 px (WCAG 2.5.8, alvo minimo)
 *   [controle-apertado]  altura < entrelinha do rotulo (1,5 x fonte) + 2 x borda + 4
 *   [controle-pilula]    raio >= altura / 2 (principio 5 do Pedro: controle nunca vira capsula)
 *   [icone-grande]       icone > altura - 2 x borda - 8
 *   [padding-raio]       padding horizontal < raio (o rotulo invade a curva do canto)
 */
export function auditarControles(doc, modo) {
  const index = buildIndex(doc);
  const px = (name) => Number(resolveColor(index, name, { brand: modo }));
  const out = {};
  for (const t of CONTROLES) {
    const v = Object.fromEntries(['height', 'padding-x', 'radius', 'border', 'font', 'icon', 'gap'].map((k) => [k, px(`control/${k}/${t}`)]));
    const avisos = [];
    if (v.height < 24) avisos.push(`[alvo-pequeno] ${t}: altura ${v.height} < 24 px`);
    const minimo = Math.round(v.font * 1.5) + 2 * v.border + 4;
    if (v.height < minimo) avisos.push(`[controle-apertado] ${t}: altura ${v.height} < ${minimo} (fonte ${v.font} x 1,5 + bordas + 4)`);
    if (v.radius * 2 >= v.height) avisos.push(`[controle-pilula] ${t}: raio ${v.radius} >= metade da altura ${v.height}`);
    if (v.icon > v.height - 2 * v.border - 8) avisos.push(`[icone-grande] ${t}: icone ${v.icon} > ${v.height - 2 * v.border - 8}`);
    if (v['padding-x'] < v.radius) avisos.push(`[padding-raio] ${t}: padding ${v['padding-x']} < raio ${v.radius}`);
    out[t] = { valores: v, avisos };
  }
  return out;
}

/* ----------------------------------------------------------- efeitos e vidro */

/**
 * Efeitos: desfoque de fundo (blur), desfoque de camada, brilho colorido (glow),
 * ruido e gradiente de marca. Cores de glow e gradiente: degrau da rampa brand ou
 * neutral DA MARCA + alfa.
 */
export const PRESETS_EFEITOS = {
  sutil: {
    blur: { sm: 2, md: 4, lg: 8, xl: 12 },
    layerBlur: { sm: 1, md: 2 },
    glow: { brand: { degrau: '500', alfa: 0.2 }, neutral: { degrau: '950', alfa: 0.12 }, desfoque: 16 },
    noise: 0.02,
    gradiente: { angulo: 135, de: '500', para: '700' },
  },
  padrao: {
    blur: { sm: 4, md: 8, lg: 16, xl: 24 },
    layerBlur: { sm: 2, md: 4 },
    glow: { brand: { degrau: '500', alfa: 0.35 }, neutral: { degrau: '950', alfa: 0.2 }, desfoque: 24 },
    noise: 0.04,
    gradiente: { angulo: 135, de: '500', para: '700' },
  },
  intenso: {
    blur: { sm: 8, md: 16, lg: 24, xl: 40 },
    layerBlur: { sm: 4, md: 8 },
    glow: { brand: { degrau: '500', alfa: 0.5 }, neutral: { degrau: '950', alfa: 0.3 }, desfoque: 32 },
    noise: 0.08,
    gradiente: { angulo: 135, de: '400', para: '800' },
  },
};
export const efeitosDe = (e) => (typeof e === 'string' ? PRESETS_EFEITOS[e] : e);

/**
 * Vidro (tratamento 'vidro' do estilo Superficies): desfoque de fundo (raio do Figma; o CSS
 * usa a metade), alfa da superficie, da borda e do brilho, a tinta por tema (degrau neutral,
 * ou 'brand-<degrau>') e a cor da borda por tema (degrau neutral; padrao 0 = branco).
 */
export const VIDRO_PADRAO = {
  blur: 'md',
  alfa: { claro: 0.72, escuro: 0.6 },
  borda: { claro: 0.5, escuro: 0.12 },
  highlight: { claro: 0.6, escuro: 0.08 },
  tinta: { claro: 0, escuro: 900 },
  corBorda: { claro: 0, escuro: 0 },
};

/** Superficie em vidro: tons do Santo, sem moldura, paineis translucidos com desfoque de fundo. */
PRESETS_SUPERFICIES.vidro = { ...PRESETS_SUPERFICIES.tonal, tratamento: 'vidro', vidro: VIDRO_PADRAO };

const alfa2 = (a) => Math.round(a * 255).toString(16).padStart(2, '0');
/** Cor de uma tinta de vidro/efeito: degrau neutral (numero), 'brand-<degrau>' ou degrau brand ('500'). */
function corDaTinta(Palette, tinta, familiaPadrao = 'neutral') {
  if (typeof tinta === 'number') return Palette[`palette/neutral/${tinta}`];
  if (typeof tinta === 'string' && tinta.startsWith('brand-')) return Palette[`palette/brand/${tinta.slice(6)}`];
  return Palette[`palette/${familiaPadrao}/${tinta}`];
}

function problemasDeEfeitos(e, sup) {
  const out = [];
  const err = (codigo, m) => out.push(`[${codigo}] ${m}`);
  if (typeof e === 'string') {
    if (!(e in PRESETS_EFEITOS)) err('efeito-invalido', `preset de efeitos inexistente: ${e}`);
  } else if (e && typeof e === 'object') {
    for (const n of ['sm', 'md', 'lg', 'xl']) if (!inteiroEntre(e.blur?.[n], 0, 120)) err('efeito-invalido', `efeitos.blur.${n}: inteiro de 0 a 120 px`);
    for (const n of ['sm', 'md']) if (!inteiroEntre(e.layerBlur?.[n], 0, 64)) err('efeito-invalido', `efeitos.layerBlur.${n}: inteiro de 0 a 64 px`);
    for (const g of ['brand', 'neutral']) {
      const c = e.glow?.[g];
      const degraus = g === 'brand' ? ['50', '100', '200', '300', '400', '500', '600', '700', '800', '900', '950'] : NEUTRAL_DEGRAUS.map(String);
      if (!c || !degraus.includes(String(c.degrau)) || !numeroEntre(c.alfa, 0, 1)) err('efeito-invalido', `efeitos.glow.${g}: { degrau da rampa ${g}, alfa 0..1 }`);
    }
    if (!inteiroEntre(e.glow?.desfoque, 0, 120)) err('efeito-invalido', 'efeitos.glow.desfoque: inteiro de 0 a 120 px');
    if (!numeroEntre(e.noise, 0, 0.5)) err('efeito-invalido', 'efeitos.noise: opacidade de 0 a 0.5');
    const gr = e.gradiente;
    const brandOk = (v) => ['50', '100', '200', '300', '400', '500', '600', '700', '800', '900', '950'].includes(String(v));
    if (!gr || !numeroEntre(gr.angulo, 0, 360) || !brandOk(gr.de) || !brandOk(gr.para)) err('efeito-invalido', 'efeitos.gradiente: { angulo 0..360, de e para = degraus brand }');
  } else err('efeito-invalido', 'efeitos: preset (sutil, padrao, intenso) ou objeto');
  if (sup?.tratamento === 'vidro' || sup?.vidro) {
    const v = { ...VIDRO_PADRAO, ...sup.vidro };
    if (!(v.blur in { sm: 1, md: 1, lg: 1, xl: 1 }) && !inteiroEntre(v.blur, 0, 120)) err('superficie-invalida', 'vidro.blur: sm, md, lg, xl ou inteiro de 0 a 120 px');
    for (const k of ['alfa', 'borda', 'highlight']) for (const tema of ['claro', 'escuro']) {
      if (!numeroEntre(v[k]?.[tema], 0, 1)) err('superficie-invalida', `vidro.${k}.${tema}: de 0 a 1`);
    }
    for (const tema of ['claro', 'escuro']) {
      const cb = v.corBorda?.[tema] ?? 0;
      if (!NEUTRAL_DEGRAUS.includes(cb)) err('superficie-invalida', `vidro.corBorda.${tema}: degrau neutral`);
      const t = v.tinta?.[tema];
      const ok = NEUTRAL_DEGRAUS.includes(t) || (typeof t === 'string' && /^brand-(50|[1-9]00|950)$/.test(t));
      if (!ok) err('superficie-invalida', `vidro.tinta.${tema}: degrau neutral ou 'brand-<degrau>'`);
    }
  }
  if (sup?.tratamento !== undefined && !['plana', 'tonal', 'borda-dupla', 'vidro'].includes(sup.tratamento)) {
    err('superficie-invalida', `tratamento "${sup.tratamento}": plana, tonal, borda-dupla ou vidro`);
  }
  return out;
}

/**
 * Pior caso de texto sobre vidro: a superficie de vidro composta sobre surface/page e
 * sobre bg/brand/solid/default (o fundo mais escuro/saturado que costuma passar por tras).
 */
export function auditarVidro(doc, modo) {
  const index = buildIndex(doc);
  if (!index.has('glass/surface')) return [];
  const out = [];
  for (const theme of ['Light', 'Dark']) {
    const vidro = resolveColor(index, 'glass/surface', { theme, brand: modo });
    for (const fundo of ['color/surface/page', 'color/bg/brand/solid/default']) {
      const sob = composite(vidro, resolveColor(index, fundo, { theme, brand: modo }));
      for (const texto of ['color/text/primary', 'color/text/secondary']) {
        const ratio = +contrast(resolveColor(index, texto, { theme, brand: modo }), sob).toFixed(2);
        out.push({ theme, fg: texto, sobre: fundo, vidro, composto: sob, ratio, min: 4.5, pass: ratio >= 4.5 });
      }
    }
  }
  return out;
}

function deriveSpec(doc, d, presetsTipografia) {
  const index = buildIndex(doc);
  /** Alias para o degrau primitivo quando ele existe; senao o numero. */
  const step = (prefix, n) => (index.has(`${prefix}/${n}`) ? `{${prefix}/${n}}` : n);

  // Palette: brand + neutral derivadas (ou a base); accent e status travados (copia da base).
  const base = specOfMode(doc, doc.collections.Palette.defaultMode);
  const Palette = { ...base.Palette };
  const n = neutrosDe(d.cor.neutros);
  const marca = d.cor.marca.toLowerCase();
  const rampas = (neutralHue, neutralChroma, neutralChromaScale = 1) =>
    brandRamps(doc, marca, { anchor: d.cor.ancora ?? '600', neutralHue, neutralChroma, neutralChromaScale }).values;
  const daRampa = (values, familia) => Object.fromEntries(Object.entries(values).filter(([k]) => k.startsWith(`palette/${familia}/`)));
  if (d.cor.origem !== 'base') Object.assign(Palette, daRampa(rampas(0, 0), 'brand'));
  if (n.origem === 'manual') {
    // Neutros manuais: a rampa sai da cor de referencia, sem depender da marca.
    Object.assign(Palette, neutralRamp(doc, n.base).values);
  } else if (n.ajuste) {
    // Ajuste fino: saturacao = % do croma dos neutros do Santo; tinta = % do caminho do matiz neutro ate o da marca.
    const hue = misturarMatiz(matizNeutroBase(doc), hexToOklch(marca)[2], n.ajuste.tinta / 100);
    Object.assign(Palette, daRampa(rampas(hue, 'santo', n.ajuste.saturacao / 100), 'neutral'));
  } else if (d.cor.origem !== 'base') {
    // hue 'marca': os neutros tingem no matiz da cor oficial.
    const neutralHue = n.preset.hue === 'marca' ? hexToOklch(marca)[2] : n.preset.hue;
    Object.assign(Palette, daRampa(rampas(neutralHue, n.preset.chroma), 'neutral'));
  }
  // Passos de cor editados a mao: por cima do derivado, degrau a degrau (reset = tirar a chave).
  for (const familia of ['brand', 'neutral']) {
    for (const [degrau, hex] of Object.entries(d.passos?.cor?.[familia] ?? {})) Palette[`palette/${familia}/${degrau}`] = hex.toLowerCase();
  }

  const Brand = {};
  for (const name of Object.keys(doc.collections.Brand.variables)) Brand[name] = undefined;
  Brand['brand/id'] = d.id;
  Brand['brand/name'] = d.nome;
  Brand['brand/family/sans'] = d.tipografia.corpo;
  Brand['brand/family/mono'] = d.tipografia.mono;
  if ('brand/family/heading' in Brand) Brand['brand/family/heading'] = d.tipografia.titulo;

  // Raio: base de CONTAINER (radius-base = md, e a escala xs..3xl pela curva) e base de CONTROLE separadas.
  const r = raioDe(d.raio);
  Brand['brand/shape/radius-base'] = step('dimension/radius', r.container);
  Brand['brand/shape/radius-control'] = step('dimension/radius', r.controle);
  for (const nivel of Object.keys(RAIO_FATOR)) Brand[`brand/shape/radius-${nivel}`] = step('dimension/radius', raioNivel(r, nivel));
  // Espaco: unidade e curva (santo, linear ou geometrica).
  const e = espacoDe(d.espaco);
  for (const nivel of Object.keys(ESPACO_FATOR)) Brand[`brand/space/${nivel}`] = step('dimension/space', espacoNivel(e, nivel));
  // Passos editados a mao no painel: sobrescrevem a formula, nivel a nivel (raio md = base).
  for (const [nivel, px] of Object.entries(d.passos?.raio ?? {})) Brand[`brand/shape/radius-${nivel}`] = step('dimension/radius', px);
  for (const [nivel, px] of Object.entries(d.passos?.espaco ?? {})) Brand[`brand/space/${nivel}`] = step('dimension/space', px);

  // Tipografia: preset (fixo, personalizado por id, ou o proprio objeto), tabela, ou { base, razao }.
  const escala = resolverEscala(d.tipografia.escala, presetsTipografia);
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
  // Tracking por papel (% do tamanho): o da base, ou o pedido (alias da primitiva type/tracking/* de mesmo valor).
  const tracking = trackingPorValor(index);
  for (const papel of PAPEIS) {
    const name = `brand/type/${papel}/tracking`;
    if (!(name in Brand)) continue;
    const pct = d.tipografia.tracking?.[papel];
    Brand[name] = pct === undefined ? baseValue(doc, 'Brand', name) : tracking.has(pct) ? `{${tracking.get(pct)}}` : pct;
  }

  // Superficies: tons e bordas apontam para degraus da rampa neutral DA MARCA (Palette acima).
  const sup = resolverSuperficies(d.superficies);
  const neutral = (n) => `{palette/neutral/${n}}`;
  for (const [tema, t] of Object.entries(TEMAS)) {
    for (const s of SUPERFICIES) Brand[`brand/surface/${s}/${t}`] = neutral(sup.tons[tema][s]);
    for (const b of BORDAS) Brand[`brand/border/${b}/${t}`] = neutral(sup.bordas[tema][b]);
    const o = sup.overlay[tema];
    Brand[`brand/surface/overlay/${t}`] =
      typeof o === 'string' ? o : `${Palette[`palette/neutral/${o.degrau}`]}${Math.round(o.alfa * 255).toString(16).padStart(2, '0')}`;
    const bi = sup.bordaInterna[tema];
    Brand[`brand/frame/border/${t}`] = bi === 'transparente' ? '#00000000' : neutral(bi);
  }
  Brand['brand/frame/enabled'] = (sup.tratamento ? sup.tratamento === 'borda-dupla' : sup.bordaDupla) ? 1 : 0;
  Brand['brand/frame/inset'] = `{brand/space/${sup.recuo}}`;

  // Controles: os 7 parametros por tamanho. Degrau de espaco ou papel de texto viram alias de marca
  // (acompanham densidade e escala); numero vira primitiva quando ha degrau, senao numero.
  const ctl = controlesDe(d.controles);
  const espacoOuPx = (v) => (typeof v === 'string' ? `{brand/space/${v}}` : step('dimension/space', v));
  for (const c of CONTROLES) {
    const t = ctl[c];
    Brand[`brand/control/height/${c}`] = step('dimension/size', t.altura);
    Brand[`brand/control/padding-x/${c}`] = espacoOuPx(t.paddingX);
    Brand[`brand/control/radius/${c}`] = t.raio === 'controle' ? '{brand/shape/radius-control}' : step('dimension/radius', t.raio);
    Brand[`brand/control/border/${c}`] = step('dimension/border', t.borda);
    Brand[`brand/control/font/${c}`] = typeof t.fonte === 'string' ? `{brand/type/${t.fonte}/size}` : step('type/size', t.fonte);
    Brand[`brand/control/icon/${c}`] = step('dimension/icon', t.icone);
    Brand[`brand/control/gap/${c}`] = espacoOuPx(t.gap);
  }

  // Sombra: cor = tinta x alfa da camada x intensidade; y e blur = os de hoje x multiplicador.
  // tinta 'atual' mantem a cor de cada camada; 'marca' usa palette/neutral/950 da marca; ou um #rrggbb.
  // passos.sombra[nivel] (numero = intensidade, ou { intensidade, desfoque, deslocamento }) vence o global.
  const sb = sombraDe(d.sombra);
  for (const name of Object.keys(Brand).filter((n) => /^brand\/shadow\/[^/]+\/\d+$/.test(n))) {
    const nivel = name.split('/')[2];
    const passo = d.passos?.sombra?.[nivel];
    const p = typeof passo === 'number' ? { intensidade: passo } : (passo ?? {});
    const atual = baseValue(doc, 'Brand', name);
    const tinta = sb.tinta === 'marca' ? Palette['palette/neutral/950'] : sb.tinta === 'atual' ? atual.slice(0, 7) : sb.tinta.toLowerCase();
    const alpha = atual.length === 9 ? parseInt(atual.slice(7, 9), 16) : 255;
    Brand[name] = `${tinta}${alfaHex(alpha, p.intensidade ?? sb.intensidade)}`;
    if (`${name}/y` in Brand) Brand[`${name}/y`] = Math.round(baseValue(doc, 'Brand', `${name}/y`) * (p.deslocamento ?? sb.deslocamento));
    if (`${name}/blur` in Brand) Brand[`${name}/blur`] = Math.round(baseValue(doc, 'Brand', `${name}/blur`) * (p.desfoque ?? sb.desfoque));
  }

  // Efeitos (blur, layer blur, glow, ruido, gradiente) e vidro. So escreve o que existe no doc.
  const ef = efeitosDe(d.efeitos);
  const put = (name, v) => {
    if (name in Brand) Brand[name] = v;
  };
  for (const n of ['sm', 'md', 'lg', 'xl']) put(`brand/effect/blur/${n}`, ef.blur[n]);
  for (const n of ['sm', 'md']) put(`brand/effect/layer-blur/${n}`, ef.layerBlur[n]);
  put('brand/effect/glow/brand', `${Palette[`palette/brand/${ef.glow.brand.degrau}`]}${alfa2(ef.glow.brand.alfa)}`);
  put('brand/effect/glow/neutral', `${Palette[`palette/neutral/${ef.glow.neutral.degrau}`]}${alfa2(ef.glow.neutral.alfa)}`);
  put('brand/effect/glow/blur', ef.glow.desfoque);
  put('brand/effect/noise', ef.noise);
  put('brand/gradient/brand/angle', ef.gradiente.angulo);
  put('brand/gradient/brand/from', `{palette/brand/${ef.gradiente.de}}`);
  put('brand/gradient/brand/to', `{palette/brand/${ef.gradiente.para}}`);
  const vidro = { ...VIDRO_PADRAO, ...sup.vidro };
  for (const [tema, t] of Object.entries(TEMAS)) {
    const tinta = corDaTinta(Palette, vidro.tinta[tema]);
    put(`brand/glass/surface/${t}`, `${tinta}${alfa2(vidro.alfa[tema])}`);
    put(`brand/glass/border/${t}`, `${Palette[`palette/neutral/${vidro.corBorda?.[tema] ?? 0}`]}${alfa2(vidro.borda[tema])}`);
    put(`brand/glass/highlight/${t}`, `${Palette['palette/neutral/0']}${alfa2(vidro.highlight[tema])}`);
  }
  put('brand/glass/blur', typeof vidro.blur === 'string' ? `{brand/effect/blur/${vidro.blur}}` : vidro.blur);
  put('brand/glass/enabled', sup.tratamento === 'vidro' ? 1 : 0);

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
 * @param {{ indice?: object, fonts?: string[], scope?: string, presetsTipografia?: object[] }} [opts]
 *   indice: lib/fonts/google-index.json (qualquer familia do Google; mono so monoespacada);
 *   fonts: lista fechada de familias (alternativa sem indice); presetsTipografia: os personalizados.
 */
export function derivar(doc, draft, { indice, fonts, scope, presetsTipografia = [], presets = [] } = {}) {
  let d = { ...RASCUNHO_PADRAO, ...draft };
  // Estilo dado por id de preset PROPRIO (opts.presets): vira os dados do preset. Ids fixos seguem como estao.
  for (const estilo of ESTILOS) {
    const valor = estilo === 'tipografia' ? d.tipografia?.escala : d[CAMPO_DO_ESTILO[estilo]];
    const proprio = typeof valor === 'string' && presets.find((p) => p.estilo === estilo && p.id === valor);
    if (proprio) d = aplicarPreset(d, proprio);
  }
  const pesos = { ...PESOS_PADRAO, ...d.tipografia.pesos };
  d.tipografia = { ...d.tipografia, pesos };
  const sup = resolverSuperficies(d.superficies);
  const antes = [
    ...problemasDosPassos(d.passos),
    ...problemasDeCor(d.cor, d.passos?.cor, doc),
    ...problemasDeParametros(d),
    ...problemasDeEfeitos(d.efeitos, sup),
    ...problemasDeTipografia(d.tipografia, pesos, indice),
    ...(sup ? problemasDeSuperficies(sup) : [`[superficie-invalida] preset de superficies inexistente: ${d.superficies}`]),
  ];
  const preset = typeof d.tipografia.escala === 'object' && d.tipografia.escala && 'id' in d.tipografia.escala ? d.tipografia.escala : null;
  if (preset && !(preset.id in PRESETS_TIPOGRAFIA)) antes.push(...validarPresetTipografia(preset, { indice }));
  if (antes.length) return { ok: false, problems: antes, spec: undefined };
  // O servidor nao cai por variavel nova no nucleo ou rascunho malformado: vira problema (422).
  let spec;
  try {
    spec = deriveSpec(doc, d, presetsTipografia);
  } catch (err) {
    return { ok: false, problems: [`[derivacao] ${err.message}`], spec: undefined };
  }
  const problems = validateBrandSpec(doc, spec, { mode: d.modo, fonts: indice ? undefined : fonts });
  if (problems.length) return { ok: false, problems, spec };
  const { doc: comModo } = applyBrandMode(doc, d.modo, spec);
  return {
    ok: true,
    problems: [],
    modo: d.modo,
    spec,
    css: brandBlockCss(comModo, d.modo, scope ? { scope } : {}),
    familias: familiasDe(spec),
    fontes: folhasDeFonte(d.tipografia, pesos),
    auditoria: {
      Light: auditContrast(comModo, d.modo, 'Light'),
      Dark: auditContrast(comModo, d.modo, 'Dark'),
      controles: auditarControles(comModo, d.modo),
      vidro: auditarVidro(comModo, d.modo),
    },
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


/* ------------------------------------------------------- presets por estilo */

/**
 * Preset como entidade, para TODOS os estilos: { id, estilo, nome, dados }.
 * `dados` e o pedaco do rascunho daquele estilo (o mesmo formato), com `passos`
 * opcional para os estilos que tem passos (raio, espaco, sombra, cor). Preset fixo
 * e ponto de partida: aplicar copia os dados para o rascunho, que segue editavel.
 * Presets PROPRIOS (do banco) entram em derivar(..., { presets }) e podem ser
 * chamados por id em qualquer estilo.
 */
export const ESTILOS = ['cor', 'tipografia', 'raio', 'espaco', 'sombra', 'controles', 'superficies', 'efeitos'];
const CAMPO_DO_ESTILO = { cor: 'cor', tipografia: 'tipografia', raio: 'raio', espaco: 'espaco', sombra: 'sombra', controles: 'controles', superficies: 'superficies', efeitos: 'efeitos' };
const PASSOS_DO_ESTILO = { cor: 'cor', raio: 'raio', espaco: 'espaco', sombra: 'sombra' };

const fixo = (estilo, id, nome, dados) => ({ id, estilo, nome, dados, fixo: true });
export const PRESETS_FIXOS = {
  cor: [fixo('cor', 'santo', 'Santo', { origem: 'base', marca: '#4693ff', ancora: '600', neutros: 'cinza' })],
  tipografia: Object.values(PRESETS_TIPOGRAFIA).map(({ id, nome, ...dados }) => fixo('tipografia', id, nome, dados)),
  raio: [
    fixo('raio', 'reto', 'Reto', { container: 0, controle: 0, curva: 'santo' }),
    fixo('raio', 'suave', 'Suave', { container: 4, controle: 4, curva: 'santo' }),
    fixo('raio', 'padrao', 'Padrão', { container: 8, controle: 8, curva: 'santo' }),
    // Container arredondado sem virar capsula nos controles (principio 5): controle fica em 8.
    fixo('raio', 'arredondado', 'Arredondado', { container: 12, controle: 8, curva: 'santo' }),
  ],
  espaco: [
    fixo('espaco', 'compacta', 'Compacta', { unidade: 3, curva: 'santo' }),
    fixo('espaco', 'padrao', 'Padrão', { unidade: 4, curva: 'santo' }),
    fixo('espaco', 'confortavel', 'Confortável', { unidade: 5, curva: 'santo' }),
  ],
  sombra: Object.entries(PRESETS_SOMBRA).map(([id, dados]) => fixo('sombra', id, { suave: 'Suave', padrao: 'Padrão', marcada: 'Marcada' }[id], dados)),
  controles: Object.entries(PRESETS_CONTROLES).map(([id, dados]) => fixo('controles', id, { compacto: 'Compacto', padrao: 'Padrão', confortavel: 'Confortável' }[id], dados)),
  superficies: Object.entries(PRESETS_SUPERFICIES).map(([id, dados]) => fixo('superficies', id, { 'borda-dupla': 'Borda dupla', tonal: 'Tonal', plana: 'Plana', vidro: 'Vidro' }[id], dados)),
  efeitos: Object.entries(PRESETS_EFEITOS).map(([id, dados]) => fixo('efeitos', id, { sutil: 'Sutil', padrao: 'Padrão', intenso: 'Intenso' }[id], dados)),
};

/** Rascunho com os dados do preset no estilo dele (e os passos, se o preset trouxer). */
export function aplicarPreset(rascunho, preset) {
  const { passos, ...dados } = preset.dados ?? {};
  let r;
  if (preset.estilo === 'tipografia') {
    const { familias, pesos, tracking, ...escala } = dados;
    r = { ...rascunho, tipografia: { ...rascunho.tipografia, ...(familias ?? {}), pesos: { ...PESOS_PADRAO, ...pesos }, ...(tracking ? { tracking } : {}), escala: { id: preset.id, nome: preset.nome, familias, pesos, ...escala } } };
  } else {
    r = { ...rascunho, [CAMPO_DO_ESTILO[preset.estilo]]: dados };
  }
  if (passos && PASSOS_DO_ESTILO[preset.estilo]) r = { ...r, passos: { ...r.passos, [PASSOS_DO_ESTILO[preset.estilo]]: passos } };
  return r;
}

/** Problemas de um preset (proprio): forma da entidade + a validacao do estilo (a mesma do derivar). */
export function validarPreset(doc, preset, { indice } = {}) {
  const out = [];
  const p = preset ?? {};
  if (!ESTILOS.includes(p.estilo)) return [`[preset-invalido] estilo ${JSON.stringify(p.estilo)} (use ${ESTILOS.join(', ')})`];
  if (typeof p.id !== 'string' || !/^[a-z][a-z0-9-]*$/.test(p.id)) out.push(`[preset-invalido] id ${JSON.stringify(p.id)} precisa ser slug`);
  else if (!p.fixo && PRESETS_FIXOS[p.estilo].some((f) => f.id === p.id)) out.push(`[preset-invalido] id "${p.id}" e de um preset fixo de ${p.estilo}`);
  if (typeof p.nome !== 'string' || !p.nome.trim()) out.push('[preset-invalido] nome vazio');
  if (!p.dados || typeof p.dados !== 'object') return [...out, '[preset-invalido] dados ausentes'];
  if (p.estilo === 'tipografia') {
    const { familias, pesos, tracking, ...resto } = p.dados;
    out.push(...validarPresetTipografia({ id: p.id, nome: p.nome, familias, pesos, ...resto }, { indice }).filter((m) => !/\bid\b|nome vazio/.test(m)));
  }
  const r = derivar(doc, aplicarPreset(RASCUNHO_PADRAO, p), { indice });
  if (!r.ok) out.push(...r.problems);
  return [...new Set(out)];
}
