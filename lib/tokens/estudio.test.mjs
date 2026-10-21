/**
 * Testes dos modulos puros de tokens e da API do Estudio.
 *   node --test lib/tokens/
 * Sem dependencia: node:test + node:assert. Leem o snapshot real.
 */
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { brandRamps } from './brand-ramp.mjs';
import { applyBrandMode, specOfMode, validateBrandSpec, withBrandMode } from './brand-mode.mjs';
import { auditContrast, AUDIT_PAIRS } from './contrast-audit.mjs';
import { contrast, hexToOklch, luminance } from './color.mjs';
import { brandBlockCss, emitTokensCss } from './emit.mjs';
import { criarEstudio, derivar, entrelinha, espaco, PRESETS, PRESETS_SUPERFICIES, raio, RASCUNHO_PADRAO, salvoAtual, tamanho } from './estudio.mjs';

const raw = readFileSync(new URL('../../tokens/santods.figma.json', import.meta.url), 'utf8');
const doc = JSON.parse(raw);
/**
 * A VTSD do snapshot foi gerada em 2026-10-19 com Math.cbrt/cos/`**` do V8. O color.mjs
 * passou a ser deterministico entre motores (so + - * / sqrt), e 4 degraus saem 1/255
 * diferentes num canal. O snapshot NAO muda (spec aprovada); o gerador tem de bater com
 * ele a 1/255 por canal, e a diferenca exata fica travada aqui.
 */
const VTSD_DESVIO_1_255 = ['palette/brand/100', 'palette/brand/200', 'palette/brand/400', 'palette/brand/500'];
const canais = (hex) => [1, 3, 5].map((i) => parseInt(hex.slice(i, i + 2), 16));
function quaseIgual(gerado, snapshot) {
  const desvio = [];
  for (const [name, hex] of Object.entries(snapshot)) {
    if (gerado[name] === hex) continue;
    const d = Math.max(...canais(gerado[name]).map((c, i) => Math.abs(c - canais(hex)[i])));
    assert.ok(d <= 1, `${name}: ${gerado[name]} x ${hex}`);
    desvio.push(name);
  }
  return desvio;
}
const sem = (spec) => ({ ...spec, Brand: { ...spec.Brand, 'brand/id': null, 'brand/name': null } });

const VTSD = {
  ...RASCUNHO_PADRAO,
  id: 'vtsd-copia',
  nome: 'Venda Todo Santo Dia',
  cor: { origem: 'marca', marca: '#00a99d', ancora: '600', neutros: 'cinza' },
  tipografia: { corpo: 'Sora', titulo: 'Sora', mono: 'JetBrains Mono', escala: 'santo' },
};

test('color: contraste e luminancia WCAG conhecidos', () => {
  assert.equal(+contrast('#ffffff', '#000000').toFixed(2), 21);
  assert.equal(+contrast('#ffffff', '#4693ff').toFixed(2), 3.05);
  assert.equal(luminance('#ffffff'), 1);
  assert.equal(Math.round(hexToOklch('#4693ff')[2]), 257);
});

test('brand-ramp: reproduz a Palette da VTSD do snapshot', () => {
  const { values } = brandRamps(doc, '#00a99d');
  const vtsd = specOfMode(doc, 'VTSD').Palette;
  const daRampa = Object.fromEntries(Object.keys(values).map((n) => [n, vtsd[n]]));
  assert.deepEqual(quaseIgual(values, daRampa), VTSD_DESVIO_1_255);
  assert.equal(Object.keys(values).length, 24);
});

test('brand-mode: tirar e reaplicar a VTSD devolve o snapshot byte a byte', () => {
  const spec = specOfMode(doc, 'VTSD');
  const strip = structuredClone(doc);
  for (const c of ['Palette', 'Brand']) {
    const col = strip.collections[c];
    col.modes = col.modes.filter((m) => m !== 'VTSD');
    for (const v of Object.values(col.variables)) delete v.values.VTSD;
  }
  assert.equal(JSON.stringify(withBrandMode(strip, 'VTSD', spec), null, 2) + '\n', raw);
});

test('brand-mode: validacao recusa id tomado, hex invalido, fonte fora do catalogo e cobertura parcial', () => {
  const spec = specOfMode(doc, 'VTSD');
  assert.match(validateBrandSpec(doc, spec, { mode: 'Outro' }).join(), /ja e da marca VTSD/);
  const hex = structuredClone(spec);
  hex.Palette['palette/brand/600'] = 'azul';
  assert.match(validateBrandSpec(doc, hex, { mode: 'VTSD' }).join(), /cor invalida/);
  assert.match(validateBrandSpec(doc, spec, { mode: 'VTSD', fonts: ['Inter'] }).join(), /fora do catalogo/);
  const parcial = structuredClone(spec);
  delete parcial.Brand['brand/space/md'];
  assert.match(validateBrandSpec(doc, parcial, { mode: 'VTSD' }).join(), /nao cobre brand\/space\/md/);
  assert.throws(() => applyBrandMode(doc, 'X', parcial), /Spec de marca invalida/);
});

test('emit: brandBlockCss e o mesmo bloco que tokens.css traz', () => {
  const css = emitTokensCss(doc);
  assert.ok(css.includes(brandBlockCss(doc, 'VTSD')));
  assert.ok(css.includes(brandBlockCss(doc, 'Santo')));
});

test('contrast-audit: 67 pares; reprovacoes = dividas registradas + border/strong no escuro', () => {
  assert.equal(AUDIT_PAIRS.length, 67);
  for (const brand of ['Santo', 'VTSD']) {
    const light = auditContrast(doc, brand, 'Light').filter((r) => !r.pass);
    assert.ok(light.every((r) => r.knownDebt), `${brand} claro`);
    const dark = auditContrast(doc, brand, 'Dark').filter((r) => !r.pass && !r.knownDebt);
    // Achado pendente (tokens/README.md): border/strong escuro abaixo de 3 sobre page e as superficies.
    assert.deepEqual([...new Set(dark.map((r) => r.fg))], ['color/border/strong'], `${brand} escuro`);
    assert.equal(dark.length, 5);
  }
  const santo = auditContrast(doc, 'Santo', 'Light').find((r) => r.fg === 'color/text/on-brand' && r.bg.endsWith('solid/default'));
  assert.equal(santo.ratio, 3.05);
});

test('formulas: com os valores base do Santo, raio e espaco reproduzem a escala de hoje', () => {
  assert.deepEqual(['xs', 'sm', 'lg', 'xl', '2xl', '3xl'].map((n) => raio(8, n)), [4, 8, 12, 16, 24, 32]);
  assert.deepEqual(
    ['3xs', '2xs', 'xs', 'sm', 'md', 'lg', 'xl', '2xl', '3xl', '4xl', '5xl', '6xl', '7xl', '8xl'].map((n) => espaco(4, n)),
    [2, 4, 8, 12, 16, 24, 32, 40, 48, 64, 80, 96, 128, 192],
  );
  assert.equal(tamanho(16, 1.25, 'body'), 16);
  assert.ok(tamanho(18, 1.333, 'heading-1') <= 96);
  assert.equal(entrelinha(16), 24);
});

test('derivar: rascunho padrao = spec do Santo; rascunho da VTSD = spec da VTSD', () => {
  const estudio = criarEstudio(doc);
  const santo = estudio.derivar(RASCUNHO_PADRAO);
  assert.ok(santo.ok, santo.problems.join());
  assert.deepEqual(sem(santo.spec), sem(specOfMode(doc, 'Santo')));
  const vtsd = estudio.derivar(VTSD);
  const ref = specOfMode(doc, 'VTSD');
  // Brand igual, menos o que sai de um degrau brand com o desvio de 1/255 (glow de marca = brand/500 + alfa).
  const { 'brand/effect/glow/brand': glowGerado, ...brandGerado } = sem(vtsd.spec).Brand;
  const { 'brand/effect/glow/brand': glowRef, ...brandRef } = sem(ref).Brand;
  assert.deepEqual(brandGerado, brandRef);
  assert.deepEqual(quaseIgual({ g: glowGerado.slice(0, 7) }, { g: glowRef.slice(0, 7) }).length <= 1, true);
  assert.equal(glowGerado.slice(7), glowRef.slice(7));
  assert.deepEqual(quaseIgual(vtsd.spec.Palette, ref.Palette), VTSD_DESVIO_1_255);
});

test('derivar: presets mudam o que devem', () => {
  const r = derivar(doc, {
    ...RASCUNHO_PADRAO,
    raio: PRESETS.raio.arredondado,
    espaco: PRESETS.densidade.compacta,
    tipografia: { ...RASCUNHO_PADRAO.tipografia, escala: 'editorial' },
    controles: 'amplo',
    sombra: { intensidade: PRESETS.sombra.marcada, tinta: 'atual' },
  });
  const b = r.spec.Brand;
  assert.equal(b['brand/shape/radius-base'], '{dimension/radius/12}');
  assert.equal(b['brand/shape/radius-lg'], 18); // sem primitiva de 18: numero
  assert.equal(b['brand/space/md'], '{dimension/space/12}');
  assert.equal(b['brand/type/body/size'], '{type/size/18}');
  assert.equal(b['brand/type/body/leading'], '{type/leading/28}');
  assert.equal(b['brand/control/height/md'], '{dimension/size/48}');
  assert.equal(b['brand/shadow/md/1'], '#100d1620'); // 0x14 x 1.6 = 0x20
});

test('derivar: escala livre { base, razao } e neutros tingidos', () => {
  const r = derivar(doc, {
    ...RASCUNHO_PADRAO,
    cor: { origem: 'marca', marca: '#e4572e', ancora: '500', neutros: 'tingido' },
    tipografia: { ...RASCUNHO_PADRAO.tipografia, escala: { base: 16, razao: 1.25 } },
    sombra: { intensidade: 1, tinta: 'marca' },
  });
  assert.ok(r.ok, r.problems.join());
  assert.equal(r.spec.Palette['palette/brand/500'], '#e4572e');
  assert.notEqual(r.spec.Palette['palette/neutral/500'], r.spec.Palette['palette/neutral/500'].replace(/^#(..)(..)(..)$/, '#$1$1$1'));
  assert.equal(r.spec.Brand['brand/type/body/size'], '{type/size/16}');
  assert.ok(r.spec.Brand['brand/shadow/sm/1'].startsWith(r.spec.Palette['palette/neutral/950']));
});

test('derivar: css do preview, auditoria, familias e o JSON salvo', () => {
  const r = derivar(doc, VTSD);
  assert.ok(r.css.includes("[data-brand='vtsd-copia'] {"));
  for (const v of ['--santo-palette-brand-600: #00a99d;', '--santo-space-md:', '--santo-radius-lg:', '--santo-control-height-md:', '--santo-shadow-md:', '--santo-font-heading:']) {
    assert.ok(r.css.includes(v), v);
  }
  assert.equal(r.auditoria.Light.length, 67);
  assert.deepEqual(r.familias, ['Sora', 'JetBrains Mono']);
  assert.equal(r.salvo.schema, 'santods.brand-mode/1');
  assert.ok(salvoAtual(doc, r.salvo));
  const scoped = derivar(doc, VTSD, { scope: "[data-brand='rascunho']" });
  assert.ok(scoped.css.includes("[data-brand='rascunho'] {"));
});

test('derivar: problema de validacao volta em problems, sem lancar', () => {
  const r = derivar(doc, { ...RASCUNHO_PADRAO, id: 'vtsd' });
  assert.equal(r.ok, false);
  assert.match(r.problems.join(), /ja e da marca VTSD/);
  const fonte = derivar(doc, { ...RASCUNHO_PADRAO, tipografia: { ...RASCUNHO_PADRAO.tipografia, corpo: 'Comic Sans' } }, { fonts: ['Albert Sans', 'JetBrains Mono'] });
  assert.match(fonte.problems.join(), /Comic Sans/);
});

test('derivar: passos editados sobrescrevem a formula (alias quando ha degrau, numero quando nao)', () => {
  const r = derivar(doc, { ...RASCUNHO_PADRAO, passos: { raio: { lg: 20, '3xl': 28 }, espaco: { md: 20, '8xl': 200 } } });
  assert.ok(r.ok, r.problems.join());
  const b = r.spec.Brand;
  assert.equal(b['brand/shape/radius-lg'], '{dimension/radius/20}');
  assert.equal(b['brand/shape/radius-3xl'], 28);
  assert.equal(b['brand/shape/radius-base'], '{dimension/radius/8}'); // md continua a base
  assert.equal(b['brand/space/md'], '{dimension/space/20}');
  assert.equal(b['brand/space/8xl'], 200);
  assert.equal(b['brand/space/sm'], '{dimension/space/12}'); // o resto segue a formula
  const ruim = derivar(doc, { ...RASCUNHO_PADRAO, passos: { raio: { md: 4, lg: 1.5 }, espaco: { xs: -2 } } });
  assert.equal(ruim.ok, false);
  assert.equal(ruim.problems.length, 3);
});

test('derivar: passos.sombra e intensidade por nivel, no lugar da global', () => {
  const r = derivar(doc, { ...RASCUNHO_PADRAO, sombra: { intensidade: 1, tinta: 'atual' }, passos: { sombra: { md: 2, '2xl': 0 } } });
  assert.ok(r.ok, r.problems.join());
  const b = r.spec.Brand;
  assert.equal(b['brand/shadow/md/1'], '#100d1628'); // 0x14 x 2
  assert.equal(b['brand/shadow/md/2'], '#100d161e'); // 0x0f x 2
  assert.equal(b['brand/shadow/2xl/1'], '#100d1600');
  assert.equal(b['brand/shadow/sm/1'], '#100d1614'); // sem passo: a global (1)
  const ruim = derivar(doc, { ...RASCUNHO_PADRAO, passos: { sombra: { none: 1, lg: -1 } } });
  assert.equal(ruim.ok, false);
  assert.equal(ruim.problems.length, 2);
});

test('color: deterministico — mesmo resultado bit a bit no JavaScriptCore (Safari), quando disponivel', async (t) => {
  const { existsSync, mkdtempSync, writeFileSync, copyFileSync } = await import('node:fs');
  const { execFileSync } = await import('node:child_process');
  const { tmpdir } = await import('node:os');
  const { join } = await import('node:path');
  const jsc = '/System/Library/Frameworks/JavaScriptCore.framework/Versions/Current/Helpers/jsc';
  if (!existsSync(jsc)) return t.skip('jsc indisponivel (so existe no macOS)');
  const dir = mkdtempSync(join(tmpdir(), 'santo-jsc-'));
  for (const f of ['color.mjs', 'brand-ramp.mjs']) copyFileSync(new URL(f, import.meta.url), join(dir, f));
  const casos = [['#e4572e', '600', 30, 'santo'], ['#00a99d', '600', 0, 0], ['#7b2cbf', '500', 60, 0.01], ['#ffb703', '700', 85, 'santo']];
  const corpo = `import { brandRamps } from './brand-ramp.mjs';
const doc = JSON.parse(read(${JSON.stringify(new URL('../../tokens/santods.figma.json', import.meta.url).pathname)}));
const casos = ${JSON.stringify(casos)};
print(JSON.stringify(casos.map(([h, a, nh, nc]) => brandRamps(doc, h, { anchor: a, neutralHue: nh, neutralChroma: nc }).values)));`;
  writeFileSync(join(dir, 'run.mjs'), corpo);
  const doJsc = JSON.parse(execFileSync(jsc, ['-m', join(dir, 'run.mjs')], { encoding: 'utf8' }));
  const doNode = casos.map(([h, a, nh, nc]) => brandRamps(doc, h, { anchor: a, neutralHue: nh, neutralChroma: nc }).values);
  assert.deepEqual(doJsc, doNode);
});

/* ------------------------------------------------ fontes livres (Google) */

const indice = JSON.parse(readFileSync(new URL('../fonts/google-index.json', import.meta.url), 'utf8'));
const tipo = (t) => ({ ...RASCUNHO_PADRAO, tipografia: { ...RASCUNHO_PADRAO.tipografia, ...t } });

test('fontes: variavel (Inter), estatica (Lato) e mono (JetBrains Mono), com URL css2 so dos pesos usados', () => {
  const r = derivar(
    doc,
    tipo({ corpo: 'Lato', titulo: 'Inter', mono: 'JetBrains Mono', pesos: { corpo: [400, 700], titulo: [600, 800], mono: [400, 500] } }),
    { indice },
  );
  assert.ok(r.ok, r.problems.join());
  assert.equal(r.spec.Brand['brand/family/sans'], 'Lato');
  assert.equal(r.spec.Brand['brand/family/heading'], 'Inter');
  assert.deepEqual(r.fontes, [
    { familia: 'Lato', papeis: ['corpo'], pesos: [400, 700], url: 'https://fonts.googleapis.com/css2?family=Lato:wght@400;700&display=swap' },
    { familia: 'Inter', papeis: ['titulo'], pesos: [600, 800], url: 'https://fonts.googleapis.com/css2?family=Inter:wght@600;800&display=swap' },
    { familia: 'JetBrains Mono', papeis: ['mono'], pesos: [400, 500], url: 'https://fonts.googleapis.com/css2?family=JetBrains+Mono:wght@400;500&display=swap' },
  ]);
});

test('fontes: mesma familia em corpo e titulo vira uma folha so, com a uniao dos pesos', () => {
  const r = derivar(doc, tipo({ corpo: 'Inter', titulo: 'Inter', pesos: { corpo: [400, 500], titulo: [700] } }), { indice });
  assert.deepEqual(r.fontes[0], { familia: 'Inter', papeis: ['corpo', 'titulo'], pesos: [400, 500, 700], url: 'https://fonts.googleapis.com/css2?family=Inter:wght@400;500;700&display=swap' });
});

test('fontes: recusa familia fora do indice, mono que nao e mono e peso que a estatica nao tem', () => {
  const fora = derivar(doc, tipo({ corpo: 'Comic Sans MS' }), { indice });
  assert.equal(fora.ok, false);
  assert.match(fora.problems.join(), /\[familia-fora-do-indice\] corpo: "Comic Sans MS"/);
  const mono = derivar(doc, tipo({ mono: 'Inter' }), { indice });
  assert.match(mono.problems.join(), /\[mono-nao-monoespacada\] mono: "Inter" e sans/);
  // Lato e estatica (100, 300, 400, 700, 900): os 6 pesos padrao do corpo nao cabem.
  const lato = derivar(doc, tipo({ corpo: 'Lato' }), { indice });
  assert.deepEqual(lato.problems, [
    '[peso-indisponivel] corpo: "Lato" nao tem 500 (tem 100, 300, 400, 700, 900)',
    '[peso-indisponivel] corpo: "Lato" nao tem 600 (tem 100, 300, 400, 700, 900)',
    '[peso-indisponivel] corpo: "Lato" nao tem 800 (tem 100, 300, 400, 700, 900)',
  ]);
  assert.match(derivar(doc, tipo({ pesos: { corpo: [450] } }), { indice }).problems.join(), /\[peso-fora-do-sistema\]/);
});

test('indice: curadoria inteira dentro do indice; so familias com latin', () => {
  for (const f of indice.curadoria) assert.ok(indice.families[f], f);
  assert.equal(indice.count, Object.keys(indice.families).length);
  assert.equal(indice.families['JetBrains Mono'].c, 'mono');
});

/* ------------------------------------------------ presets de tipografia */

test('preset de tipografia personalizado: por objeto e por id, igual aos fixos', async () => {
  const { aplicarPresetTipografia, validarPresetTipografia, PRESETS_TIPOGRAFIA } = await import('./estudio.mjs');
  const meu = { id: 'manchete', nome: 'Manchete', familias: { corpo: 'Inter', titulo: 'Fraunces', mono: 'JetBrains Mono' }, pesos: { titulo: [600, 800] }, base: 16, razao: 1.333 };
  assert.deepEqual(validarPresetTipografia(meu, { indice }), []);
  const r = derivar(doc, aplicarPresetTipografia(RASCUNHO_PADRAO, meu), { indice });
  assert.ok(r.ok, r.problems.join());
  assert.equal(r.spec.Brand['brand/family/heading'], 'Fraunces');
  assert.equal(r.spec.Brand['brand/type/heading-6/size'], 28); // 16 x 1.333^2 = 28.4 -> 28 (sem primitiva)
  const porId = derivar(doc, tipo({ escala: 'manchete' }), { presetsTipografia: [meu] });
  assert.deepEqual(porId.spec.Brand['brand/type/heading-1/size'], r.spec.Brand['brand/type/heading-1/size']);
  // Fixo como entidade: 'santo' reproduz o snapshot.
  assert.deepEqual(derivar(doc, tipo({ escala: PRESETS_TIPOGRAFIA.santo })).spec, derivar(doc, RASCUNHO_PADRAO).spec);
  // Invalidos.
  const ruim = validarPresetTipografia({ id: 'santo', nome: '', base: 40, razao: 3, tabela: [[1, 2]], familias: { corpo: 'Inter', titulo: 'Inter', mono: 'Inter' } }, { indice });
  assert.equal(ruim.length, 6);
});

/* ----------------------------------------------------------- superficies */

test('superficies: o preset borda-dupla e o Santo de hoje (moldura ligada, recuo space/xs)', async () => {
  const { PRESETS_SUPERFICIES } = await import('./estudio.mjs');
  const r = derivar(doc, { ...RASCUNHO_PADRAO, superficies: PRESETS_SUPERFICIES['borda-dupla'] });
  assert.deepEqual(r.spec, derivar(doc, RASCUNHO_PADRAO).spec);
  const b = r.spec.Brand;
  assert.equal(b['brand/frame/enabled'], 1);
  assert.equal(b['brand/frame/inset'], '{brand/space/xs}');
  assert.equal(b['brand/frame/border/light'], '#00000000');
  assert.equal(b['brand/surface/well/dark'], '{palette/neutral/1000}');
  for (const v of ['--santo-frame-inset:', '--santo-brand-frame-enabled: 1;', '--santo-frame-surface:', '--santo-frame-border:', '--santo-color-surface-well:']) {
    assert.ok(r.css.includes(v), v);
  }
});

test('superficies: tonal desliga a moldura; plana iguala chao e cartao e acende a borda interna', () => {
  const tonal = derivar(doc, { ...RASCUNHO_PADRAO, superficies: 'tonal' });
  assert.equal(tonal.spec.Brand['brand/frame/enabled'], 0);
  assert.ok(tonal.css.includes('--santo-brand-frame-enabled: 0;'));
  const plana = derivar(doc, { ...RASCUNHO_PADRAO, superficies: 'plana' });
  assert.equal(plana.spec.Brand['brand/surface/page/light'], plana.spec.Brand['brand/surface/raised/light']);
  assert.equal(plana.spec.Brand['brand/frame/border/light'], '{palette/neutral/200}');
});

test('superficies: overlay por degrau + alfa sai da rampa DA MARCA; recuo acompanha o degrau de espaco', async () => {
  const { PRESETS_SUPERFICIES } = await import('./estudio.mjs');
  const sup = { ...PRESETS_SUPERFICIES['borda-dupla'], recuo: 'sm', overlay: { claro: { degrau: 950, alfa: 0.6 }, escuro: '#000000b8' } };
  const r = derivar(doc, { ...VTSD, superficies: sup });
  assert.ok(r.ok, r.problems.join());
  assert.equal(r.spec.Brand['brand/surface/overlay/light'], `${r.spec.Palette['palette/neutral/950']}99`);
  assert.equal(r.spec.Brand['brand/frame/inset'], '{brand/space/sm}');
});

test('superficies: 422 para degrau inexistente, recuo fora da escala, overlay e borda interna invalidos, preset inexistente', async () => {
  const { PRESETS_SUPERFICIES } = await import('./estudio.mjs');
  const base = PRESETS_SUPERFICIES['borda-dupla'];
  const ruim = {
    ...base,
    bordaDupla: 'sim',
    recuo: 'gigante',
    tons: { ...base.tons, claro: { ...base.tons.claro, page: 75 } },
    overlay: { claro: '#123', escuro: { degrau: 900, alfa: 2 } },
    bordaInterna: { claro: 'nenhuma', escuro: 800 },
  };
  const r = derivar(doc, { ...RASCUNHO_PADRAO, superficies: ruim });
  assert.equal(r.ok, false);
  assert.equal(r.problems.length, 6);
  assert.ok(r.problems.every((p) => p.startsWith('[superficie-invalida]')));
  assert.match(derivar(doc, { ...RASCUNHO_PADRAO, superficies: 'nao-existe' }).problems.join(), /preset de superficies inexistente/);
});

test('derivar: nao lanca — variavel nova no nucleo sem derivacao vira [derivacao] com ok:false', () => {
  const novo = structuredClone(doc);
  const brand = novo.collections.Brand;
  brand.variables['brand/futuro/x'] = { type: 'FLOAT', values: Object.fromEntries(brand.modes.map((m) => [m, 1])) };
  const r = derivar(novo, RASCUNHO_PADRAO);
  assert.equal(r.ok, false);
  assert.match(r.problems.join(), /\[derivacao\] Derivacao nao cobre brand\/futuro\/x/);
  const escala = derivar(doc, { ...RASCUNHO_PADRAO, tipografia: { ...RASCUNHO_PADRAO.tipografia, escala: 'nao-existe' } });
  assert.equal(escala.ok, false);
  assert.match(escala.problems.join(), /\[derivacao\] Preset de tipografia inexistente: nao-existe/);
});

/* ---------------------------------------------------- neutros e passos.cor */

test('neutros manuais: a rampa sai da cor de referencia, sem depender da marca', async () => {
  const { neutralRamp } = await import('./brand-ramp.mjs');
  const manual = { origem: 'manual', base: '#7a6f66' };
  const a = derivar(doc, { ...RASCUNHO_PADRAO, cor: { origem: 'marca', marca: '#e4572e', ancora: '600', neutros: manual } });
  const b = derivar(doc, { ...RASCUNHO_PADRAO, cor: { origem: 'marca', marca: '#00a99d', ancora: '600', neutros: manual } });
  assert.ok(a.ok && b.ok);
  const neutros = (r) => Object.fromEntries(Object.entries(r.spec.Palette).filter(([k]) => k.startsWith('palette/neutral/')));
  assert.deepEqual(neutros(a), neutros(b)); // mesma referencia, marcas diferentes: mesmos neutros
  assert.equal(a.spec.Palette['palette/neutral/500'], '#7a6f66'); // entra exata no degrau de Y mais proxima
  assert.equal(a.spec.Palette['palette/neutral/0'], '#ffffff');
  // A referencia = neutral/500 do Santo reconstroi a rampa do Santo a 1/255 por canal,
  // menos neutral/1000 (#08060b, valor posto a mao no Figma, com outro matiz).
  const santo = neutralRamp(doc, '#636f7f').values;
  const ref = specOfMode(doc, 'Santo').Palette;
  for (const [k, v] of Object.entries(santo)) {
    if (k === 'palette/neutral/1000') continue;
    const d = Math.max(...canais(v).map((c, i) => Math.abs(c - canais(ref[k])[i])));
    assert.ok(d <= 1, `${k}: ${v} x ${ref[k]}`);
  }
});

test('neutros derivados com ajuste: saturacao 0 = cinza; tinta 100 = matiz da marca', async () => {
  const { hexToOklch } = await import('./color.mjs');
  const cinza = derivar(doc, { ...RASCUNHO_PADRAO, cor: { ...RASCUNHO_PADRAO.cor, neutros: { origem: 'derivada', ajuste: { tinta: 100, saturacao: 0 } } } });
  assert.ok(cinza.ok, cinza.problems.join());
  const n500 = cinza.spec.Palette['palette/neutral/500'];
  assert.ok(hexToOklch(n500)[1] < 0.005, n500);
  const tingido = derivar(doc, { ...RASCUNHO_PADRAO, cor: { origem: 'marca', marca: '#e4572e', ancora: '600', neutros: { origem: 'derivada', ajuste: { tinta: 100, saturacao: 150 } } } });
  const h = hexToOklch(tingido.spec.Palette['palette/neutral/500'])[2];
  assert.ok(Math.abs(h - hexToOklch('#e4572e')[2]) < 3, `matiz ${h}`);
});

test('passos.cor: override de um degrau por cima do derivado, auditoria no resultado final, e reset', () => {
  const sem = derivar(doc, VTSD);
  const com = derivar(doc, { ...VTSD, passos: { cor: { brand: { 600: '#00796F' }, neutral: { 100: '#eeeeee' } } } });
  assert.ok(com.ok, com.problems.join());
  assert.equal(com.spec.Palette['palette/brand/600'], '#00796f'); // normalizado
  assert.equal(com.spec.Palette['palette/neutral/100'], '#eeeeee');
  assert.equal(com.spec.Palette['palette/brand/500'], sem.spec.Palette['palette/brand/500']); // o resto nao muda
  // A auditoria roda no final: branco sobre o 600 escuro passa a AA.
  const onBrand = (r) => r.auditoria.Light.find((x) => x.fg === 'color/text/on-brand' && x.bg.endsWith('solid/default'));
  assert.equal(onBrand(sem).pass, false);
  assert.equal(onBrand(com).pass, true);
  assert.ok(com.css.includes('--santo-palette-brand-600: #00796f;'));
  // Reset = tirar a chave.
  const reset = derivar(doc, { ...VTSD, passos: { cor: { brand: {}, neutral: {} } } });
  assert.deepEqual(reset.spec, sem.spec);
});

test('cor: 422 para hex invalido, degrau inexistente, rampa inexistente e ajuste fora da faixa', () => {
  const r = derivar(doc, {
    ...RASCUNHO_PADRAO,
    cor: { ...RASCUNHO_PADRAO.cor, neutros: { origem: 'derivada', ajuste: { tinta: 120, saturacao: -1 } } },
    passos: { cor: { brand: { 650: '#000000', 600: 'verde' }, accent: { 500: '#000000' } } },
  });
  assert.equal(r.ok, false);
  assert.equal(r.problems.length, 5);
  assert.ok(r.problems.every((p) => p.startsWith('[cor-invalida]')));
  const manual = derivar(doc, { ...RASCUNHO_PADRAO, cor: { ...RASCUNHO_PADRAO.cor, neutros: { origem: 'manual', base: 'cinza' } } });
  assert.match(manual.problems.join(), /neutros.base/);
});

/* ------------------------------------- parametros livres e presets por estilo */

test('raio: container e controle separados; curva geometrica por razao', () => {
  const r = derivar(doc, { ...RASCUNHO_PADRAO, raio: { container: 12, controle: 6, curva: { razao: 1.5 } } });
  assert.ok(r.ok, r.problems.join());
  const b = r.spec.Brand;
  assert.equal(b['brand/shape/radius-base'], '{dimension/radius/12}');
  assert.equal(b['brand/shape/radius-control'], 6);
  assert.equal(b['brand/shape/radius-lg'], 18); // 12 x 1.5
  assert.equal(b['brand/shape/radius-xs'], 5); // 12 / 1.5^2
  assert.equal(b['brand/control/radius/md'], '{brand/shape/radius-control}');
});

test('espaco: curva linear e geometrica', () => {
  const lin = derivar(doc, { ...RASCUNHO_PADRAO, espaco: { unidade: 4, curva: 'linear' } }).spec.Brand;
  assert.deepEqual(['xs', 'md', '8xl'].map((n) => lin[`brand/space/${n}`]), ['{dimension/space/8}', '{dimension/space/16}', 52]);
  const geo = derivar(doc, { ...RASCUNHO_PADRAO, espaco: { unidade: 4, curva: { razao: 1.5 } } }).spec.Brand;
  assert.deepEqual(['sm', 'md', 'lg'].map((n) => geo[`brand/space/${n}`]), [10, '{dimension/space/16}', '{dimension/space/24}']);
});

test('controles: os 7 parametros por tamanho, parciais sobre o padrao', () => {
  const r = derivar(doc, { ...RASCUNHO_PADRAO, controles: { md: { paddingX: 20, fonte: 15, raio: 4, icone: 20, gap: 6, borda: 2 } } });
  assert.ok(r.ok, r.problems.join());
  const b = r.spec.Brand;
  assert.equal(b['brand/control/padding-x/md'], '{dimension/space/20}');
  assert.equal(b['brand/control/font/md'], 15);
  assert.equal(b['brand/control/radius/md'], '{dimension/radius/4}');
  assert.equal(b['brand/control/icon/md'], '{dimension/icon/20}');
  assert.equal(b['brand/control/gap/md'], 6);
  assert.equal(b['brand/control/border/md'], '{dimension/border/2}');
  assert.equal(b['brand/control/padding-x/sm'], '{brand/space/sm}'); // o resto segue o padrao
  for (const v of ['--santo-control-padding-x-md:', '--santo-control-font-md:', '--santo-radius-control:']) assert.ok(r.css.includes(v), v);
});

test('controles: auditoria avisa sem bloquear (alvo pequeno, apertado, pilula, icone grande, padding < raio)', () => {
  const r = derivar(doc, { ...RASCUNHO_PADRAO, controles: { sm: { altura: 20, fonte: 16, raio: 12, icone: 16, paddingX: 8 } } });
  assert.ok(r.ok, r.problems.join());
  const codigos = r.auditoria.controles.sm.avisos.map((a) => a.match(/^\[([^\]]+)\]/)[1]);
  assert.deepEqual(codigos, ['alvo-pequeno', 'controle-apertado', 'controle-pilula', 'icone-grande', 'padding-raio']);
  assert.deepEqual(derivar(doc, RASCUNHO_PADRAO).auditoria.controles.md.avisos, []); // o Santo nao dispara nada
  assert.deepEqual(derivar(doc, RASCUNHO_PADRAO).auditoria.controles.md.valores, { height: 40, 'padding-x': 16, radius: 8, border: 1, font: 14, icon: 16, gap: 8 });
});

test('sombra: desfoque e deslocamento multiplicadores, tinta hex e passos por nivel com objeto', () => {
  const r = derivar(doc, { ...RASCUNHO_PADRAO, sombra: { intensidade: 1, tinta: '#1C54A0', desfoque: 2, deslocamento: 0.5 }, passos: { sombra: { lg: { desfoque: 1 } } } });
  assert.ok(r.ok, r.problems.join());
  const b = r.spec.Brand;
  assert.equal(b['brand/shadow/md/1/blur'], 16); // 8 x 2
  assert.equal(b['brand/shadow/md/1/y'], 2); // 4 x 0.5
  assert.equal(b['brand/shadow/lg/1/blur'], 16); // passo do nivel vence o global
  assert.equal(b['brand/shadow/md/1'], '#1c54a014');
  assert.equal(derivar(doc, { ...RASCUNHO_PADRAO, sombra: 'marcada' }).spec.Brand['brand/shadow/md/1/y'], 6);
});

test('tipografia: tracking por papel (alias da primitiva de mesmo valor, senao numero)', () => {
  const b = derivar(doc, { ...RASCUNHO_PADRAO, tipografia: { ...RASCUNHO_PADRAO.tipografia, tracking: { 'heading-1': -2, body: 1.5 } } }).spec.Brand;
  assert.equal(b['brand/type/heading-1/tracking'], '{type/tracking/tight}');
  assert.equal(b['brand/type/body/tracking'], 1.5);
  assert.equal(b['brand/type/caption-small/tracking'], '{type/tracking/wide}'); // o resto, da base
});

test('422 por parametro: raio, espaco, controles, sombra e tracking', () => {
  const r = derivar(doc, {
    ...RASCUNHO_PADRAO,
    raio: { container: -1, controle: 99, curva: { razao: 9 } },
    espaco: { unidade: 20, curva: 'curva' },
    controles: { md: { altura: 5, paddingX: 'gigante', fonte: 'titulo', borda: 9 }, xl: {} },
    sombra: { intensidade: -1, tinta: 'azul', desfoque: 9 },
    tipografia: { ...RASCUNHO_PADRAO.tipografia, tracking: { body: 50 } },
  });
  assert.equal(r.ok, false);
  const codigos = [...new Set(r.problems.map((p) => p.match(/^\[([^\]]+)\]/)[1]))];
  assert.deepEqual(codigos, ['raio-invalido', 'espaco-invalido', 'controle-invalido', 'sombra-invalida', 'tracking-invalido']);
  assert.equal(r.problems.length, 14); // raio 3, espaco 2, controles 5, sombra 3, tracking 1
});

test('presets por estilo: fixos como ponto de partida, proprios por id, validacao', async () => {
  const { PRESETS_FIXOS, aplicarPreset, validarPreset, aplicarPresetTipografia, PRESETS_TIPOGRAFIA } = await import('./estudio.mjs');
  for (const estilo of ['raio', 'espaco', 'sombra', 'controles', 'superficies', 'tipografia', 'cor']) assert.ok(PRESETS_FIXOS[estilo].length, estilo);
  // Todos os fixos derivam ok.
  for (const lista of Object.values(PRESETS_FIXOS)) for (const p of lista) assert.ok(derivar(doc, aplicarPreset(RASCUNHO_PADRAO, p)).ok, `${p.estilo}/${p.id}`);
  // Arredondado separa container e controle (controle continua 8: principio 5).
  const arred = derivar(doc, aplicarPreset(RASCUNHO_PADRAO, PRESETS_FIXOS.raio.find((p) => p.id === 'arredondado'))).spec.Brand;
  assert.equal(arred['brand/shape/radius-base'], '{dimension/radius/12}');
  assert.equal(arred['brand/shape/radius-control'], '{dimension/radius/8}');
  // Tipografia pelo caminho generico = o caminho especifico.
  const santoTipo = PRESETS_FIXOS.tipografia.find((p) => p.id === 'santo');
  assert.deepEqual(derivar(doc, aplicarPreset(RASCUNHO_PADRAO, santoTipo)).spec, derivar(doc, aplicarPresetTipografia(RASCUNHO_PADRAO, PRESETS_TIPOGRAFIA.santo)).spec);
  // Proprio, com passos, chamado por id.
  const meu = { id: 'meu-raio', estilo: 'raio', nome: 'Meu raio', dados: { container: 10, controle: 6, curva: 'santo', passos: { '3xl': 28 } } };
  assert.deepEqual(validarPreset(doc, meu), []);
  const r = derivar(doc, { ...RASCUNHO_PADRAO, raio: 'meu-raio' }, { presets: [meu] });
  assert.ok(r.ok, r.problems.join());
  assert.equal(r.spec.Brand['brand/shape/radius-control'], 6);
  assert.equal(r.spec.Brand['brand/shape/radius-3xl'], 28);
  // Invalidos.
  assert.match(validarPreset(doc, { ...meu, id: 'padrao' }).join(), /preset fixo de raio/);
  assert.match(validarPreset(doc, { ...meu, estilo: 'brilho' }).join(), /estilo "brilho"/);
  assert.match(validarPreset(doc, { ...meu, dados: { container: 99 } }).join(), /\[raio-invalido\]/);
});

/* ------------------------------------------------------- efeitos e vidro */

test('efeitos: presets sutil/padrao/intenso e o padrao = o Santo de hoje', async () => {
  const { PRESETS_FIXOS } = await import('./estudio.mjs');
  assert.deepEqual(PRESETS_FIXOS.efeitos.map((p) => p.id), ['sutil', 'padrao', 'intenso']);
  const b = derivar(doc, { ...RASCUNHO_PADRAO, efeitos: 'intenso' }).spec.Brand;
  assert.equal(b['brand/effect/blur/xl'], 40);
  assert.equal(b['brand/effect/glow/brand'], `${specOfMode(doc, 'Santo').Palette['palette/brand/500']}80`); // 0.5 -> 0x80
  assert.equal(b['brand/gradient/brand/from'], '{palette/brand/400}');
  const css = derivar(doc, RASCUNHO_PADRAO).css;
  for (const v of ['--santo-effect-blur-md:', '--santo-glass-surface:', '--santo-glow-brand:', '--santo-gradient-brand: linear-gradient(']) assert.ok(css.includes(v), v);
});

test('superficies: tratamento vidro liga o vidro e desliga a moldura; parametros do vidro', () => {
  const r = derivar(doc, { ...RASCUNHO_PADRAO, superficies: 'vidro' });
  assert.ok(r.ok, r.problems.join());
  assert.equal(r.spec.Brand['brand/glass/enabled'], 1);
  assert.equal(r.spec.Brand['brand/frame/enabled'], 0);
  const custom = derivar(doc, {
    ...RASCUNHO_PADRAO,
    superficies: { ...structuredClone(PRESETS_SUPERFICIES.vidro), vidro: { blur: 'lg', alfa: { claro: 0.5, escuro: 0.4 }, borda: { claro: 0.3, escuro: 0.1 }, highlight: { claro: 0.4, escuro: 0.05 }, tinta: { claro: 'brand-50', escuro: 950 } } },
  });
  assert.ok(custom.ok, custom.problems.join());
  assert.equal(custom.spec.Brand['brand/glass/blur'], '{brand/effect/blur/lg}');
  assert.equal(custom.spec.Brand['brand/glass/surface/light'], `${specOfMode(doc, 'Santo').Palette['palette/brand/50']}80`);
});

test('vidro: auditoria assume o pior fundo (sobre page e sobre brand), nos dois temas', () => {
  const r = derivar(doc, { ...RASCUNHO_PADRAO, superficies: 'vidro' });
  const v = r.auditoria.vidro;
  assert.equal(v.length, 8); // 2 temas x 2 fundos x 2 textos
  assert.ok(v.every((x) => /^#[0-9a-f]{6}$/.test(x.composto)));
  // Alfa baixo sobre brand reprova o texto secundario: a auditoria acusa.
  const ralo = derivar(doc, { ...RASCUNHO_PADRAO, superficies: { ...structuredClone(PRESETS_SUPERFICIES.vidro), vidro: { ...PRESETS_SUPERFICIES.vidro.vidro, alfa: { claro: 0.1, escuro: 0.1 } } } });
  assert.ok(ralo.auditoria.vidro.some((x) => !x.pass && x.sobre === 'color/bg/brand/solid/default'));
});

test('efeitos e vidro: 422', () => {
  const r = derivar(doc, {
    ...RASCUNHO_PADRAO,
    efeitos: { blur: { sm: -1, md: 8, lg: 16, xl: 999 }, layerBlur: { sm: 2, md: 4 }, glow: { brand: { degrau: '450', alfa: 0.3 }, neutral: { degrau: '950', alfa: 2 }, desfoque: 24 }, noise: 0.9, gradiente: { angulo: 400, de: '500', para: '700' } },
    superficies: { ...structuredClone(PRESETS_SUPERFICIES.vidro), tratamento: 'vidro', vidro: { ...PRESETS_SUPERFICIES.vidro.vidro, blur: 'gigante', tinta: { claro: 'roxo', escuro: 900 } } },
  });
  assert.equal(r.ok, false);
  const codigos = [...new Set(r.problems.map((p) => p.match(/^\[([^\]]+)\]/)[1]))];
  assert.deepEqual(codigos, ['efeito-invalido', 'superficie-invalida']);
  assert.equal(r.problems.length, 8);
  assert.match(derivar(doc, { ...RASCUNHO_PADRAO, superficies: { ...structuredClone(PRESETS_SUPERFICIES.tonal), tratamento: 'neon' } }).problems.join(), /tratamento "neon"/);
});
