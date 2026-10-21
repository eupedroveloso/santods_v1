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
import { criarEstudio, derivar, entrelinha, espaco, PRESETS, raio, RASCUNHO_PADRAO, salvoAtual, tamanho } from './estudio.mjs';

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

test('contrast-audit: 49 pares; reprovacoes = dividas registradas + border/strong no escuro', () => {
  assert.equal(AUDIT_PAIRS.length, 49);
  for (const brand of ['Santo', 'VTSD']) {
    const light = auditContrast(doc, brand, 'Light').filter((r) => !r.pass);
    assert.ok(light.every((r) => r.knownDebt), `${brand} claro`);
    const dark = auditContrast(doc, brand, 'Dark').filter((r) => !r.pass && !r.knownDebt);
    assert.deepEqual(dark.map((r) => r.fg), ['color/border/strong'], `${brand} escuro`);
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
  assert.deepEqual(sem(vtsd.spec).Brand, sem(ref).Brand);
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
  assert.equal(r.auditoria.Light.length, 49);
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
