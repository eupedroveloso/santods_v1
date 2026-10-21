#!/usr/bin/env node
/**
 * Sonda de aninhamento no navegador: raio aninhado e recuo igual nos 4 lados.
 *
 *   npm run nest:probe -- [rotas...] [--base=http://localhost:3123] [--width=1440]
 *                         [--theme=light|dark] [--out=arquivo.json] [--all]
 *
 * Abre cada rota num Chrome headless (CDP), mede no DOM real e grava JSON. Nao
 * entra no `npm run check`: precisa do servidor de pe e leva segundos por rota.
 * O check estatico e scripts/check-nest.mjs.
 *
 * Rota com acao: '/|click=aside button' clica no seletor antes de medir
 * (abrir CommandPalette, Select, Popover); '/estudio/x/raio|click=[title="Preview grande"]'.
 * Varios cliques: repita '|click=...'.
 *
 * Para cada par moldura/filho (filho que pinta, com raio > 0, ou iframe; moldura
 * = ancestral mais proximo que pinta e tem raio > 0), registra:
 *   R, r        raio externo (borda interna) e interno, em px CSS;
 *   ins         recuo esquerdo, direito, superior e inferior ate a borda interna
 *               da moldura — ou ate o cabecalho/rodape que estiver entre os dois;
 *   delta       pior canto de R − recuo − r (negativo = quebra do raio aninhado,
 *               so conta quando o canto do filho cai na zona curva da moldura);
 *   uneven      max(ins) − min(ins), so para painel (filho com >= 50% da largura,
 *               que nao e controle, campo, opcao/santo-row, celula de tabela nem
 *               forma dentro do cartao da miniatura); achado acima de 1px (fio, subpixel);
 *   lib/where   componente da lib responsavel (fiber do React, em dev) e onde aparece.
 * Miniaturas em foreignObject sao normalizadas pela escala.
 *
 * Saida: JSON em --out (padrao /tmp/probe-nest.json) e um resumo dos achados
 * (delta < 0 ou uneven > 0) no terminal. Sai com 1 se houver achado.
 */
import { spawn } from 'node:child_process';
import { mkdtempSync, readFileSync, readdirSync, writeFileSync, existsSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { dirname, join, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const opt = Object.fromEntries(process.argv.slice(2).filter((a) => a.startsWith('--')).map((a) => { const [k, v] = a.slice(2).split('='); return [k, v ?? true]; }));
const BASE = opt.base ?? 'http://localhost:3123';
const WIDTH = Number(opt.width ?? 1440);
const THEME = opt.theme ?? 'light';
const OUT = opt.out ?? join(tmpdir(), 'probe-nest.json');
const DEFAULT_ROUTES = [
  '/componentes',
  '/|click=aside button[aria-keyshortcuts]',
  '/componentes/select|click=main [role=combobox]',
  '/componentes/card',
  '/componentes/button',
  '/componentes/editor-frame',
  '/exemplos#dashboard',
  '/exemplos#landing',
];
const routes = process.argv.slice(2).filter((a) => !a.startsWith('--'));
const ROUTES = routes.length ? routes : DEFAULT_ROUTES;
const CHROME = process.env.CHROME ?? '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome';

/** Componentes exportados por lib/ui e lib/thumbs -> arquivo (atribuicao pelo fiber). */
const LIBNAMES = [];
for (const dir of ['lib/ui', 'lib/thumbs']) {
  for (const f of readdirSync(resolve(root, dir))) {
    if (!/\.tsx?$/.test(f)) continue;
    const src = readFileSync(resolve(root, dir, f), 'utf8');
    for (const m of src.matchAll(/export (?:default )?(?:function|const) ([A-Z]\w*)/g)) LIBNAMES.push(`${m[1]}|${dir}/${f}`);
  }
}

/* ------------------------------------------------------------- no navegador */

function measure(LIBNAMES) {
  const XS = parseFloat(getComputedStyle(document.documentElement).getPropertyValue('--santo-radius-xs')) || 4;
  const LIB = new Map(LIBNAMES.map((s) => s.split('|')));
  const px = (v) => parseFloat(v) || 0;
  const radii = (cs) => [cs.borderTopLeftRadius, cs.borderTopRightRadius, cs.borderBottomRightRadius, cs.borderBottomLeftRadius].map(px);
  const alpha = (c) => (c === 'transparent' ? 0 : parseFloat(c.match(/rgba?\(([^)]+)\)/)?.[1].split(/[ ,/]+/).filter(Boolean)[3] ?? '1'));
  const SIDES = [['Top', 'Left'], ['Top', 'Right'], ['Bottom', 'Right'], ['Bottom', 'Left']];
  const fill = (cs) => alpha(cs.backgroundColor) > 0 || cs.backgroundImage !== 'none' || cs.boxShadow !== 'none';
  const edge = (cs, k) => px(cs['border' + k + 'Width']) > 0 && alpha(cs['border' + k + 'Color']) > 0;
  const paints = (cs) => fill(cs) || ['Top', 'Right', 'Bottom', 'Left'].some((k) => edge(cs, k));
  const cornerPaints = (cs, i) => fill(cs) || SIDES[i].every((k) => edge(cs, k));
  const clips = (cs) => cs.overflow !== 'visible' || cs.overflowX !== 'visible';
  const visible = (el, cs) => cs.display !== 'none' && cs.visibility !== 'hidden' && el.getClientRects().length > 0;
  const fiberOf = (el) => { const k = Object.keys(el).find((x) => x.startsWith('__reactFiber$')); return k ? el[k] : null; };
  const nameOf = (t) => (t && (t.displayName || t.name || t.render?.displayName || t.render?.name || t.type?.displayName || t.type?.name)) || null;
  const owner = (el) => {
    let lib = null, where = '';
    for (let f = fiberOf(el); f; f = f.return) {
      if (typeof f.type === 'string' || !f.type) continue;
      const n = nameOf(f.type); if (!n || n === 'NestScope') continue; // provedor de contexto, nao desenha
      if (!lib && LIB.has(n)) lib = n;
      if (!where && !LIB.has(n) && !/^(Inner|Outer|Render|Layout|Router|Server|Client|Hot|App|Error|Scroll|Redirect|Loading|NotFound|Segment|Template|HTTPAccess)/.test(n)) where = n;
      if (lib && where) break;
    }
    return { lib, file: lib ? LIB.get(lib) : null, where };
  };
  const out = [];
  for (const C of document.querySelectorAll('body *')) {
    if (C.closest('svg') && !C.closest('foreignObject')) continue;
    if (C.closest('[data-amostra]')) continue; // o raio e o dado mostrado (TokenSample), nao aninhamento
    const ccs = getComputedStyle(C);
    if (!visible(C, ccs)) continue;
    const kc = C.offsetWidth > 0 ? C.getBoundingClientRect().width / C.offsetWidth : 1; // escala do filho (miniatura)
    const isFrame = C.tagName === 'IFRAME';
    const rcCss = radii(ccs);
    if (!isFrame && !(paints(ccs) && Math.max(...rcCss) > 0)) continue;
    let P = C.parentElement, pcs, prc;
    for (; P && P !== document.body; P = P.parentElement) {
      pcs = getComputedStyle(P); prc = radii(pcs);
      if (Math.max(...prc) > 0 && (fill(pcs) || clips(pcs) || SIDES.some((_, i) => cornerPaints(pcs, i)))) break;
    }
    if (!P || P === document.body) continue;
    const pr = P.getBoundingClientRect(), c = C.getBoundingClientRect();
    const k = P.offsetWidth > 0 ? pr.width / P.offsetWidth : 1;
    const R = Math.max(...prc);
    // Raio do filho na unidade da moldura (o filho pode estar num foreignObject escalado).
    const rc = rcCss.map((v) => (v * kc) / k);
    if (R >= Math.min(P.offsetWidth, P.offsetHeight) / 2 - 0.5) continue; // pilula/circulo
    if (Math.max(...rcCss) > 0 && Math.max(...rcCss) >= Math.min(C.offsetWidth, C.offsetHeight) / 2 - 0.5) continue;
    const bw = { Top: px(pcs.borderTopWidth), Right: px(pcs.borderRightWidth), Bottom: px(pcs.borderBottomWidth), Left: px(pcs.borderLeftWidth) };
    const inner = { l: pr.left + bw.Left * k, t: pr.top + bw.Top * k, r: pr.right - bw.Right * k, b: pr.bottom - bw.Bottom * k };
    if (c.left < inner.l - 0.5 || c.right > inner.r + 0.5 || c.top < inner.t - 0.5 || c.bottom > inner.b + 0.5) continue; // vaza: recortado
    // delta do raio aninhado por canto (so na zona curva da moldura)
    const raw = [[c.left - inner.l, c.top - inner.t], [inner.r - c.right, c.top - inner.t], [inner.r - c.right, inner.b - c.bottom], [c.left - inner.l, inner.b - c.bottom]];
    let delta = null, corner = null;
    for (let i = 0; i < 4; i++) {
      const rp = prc[i] - Math.max(bw[SIDES[i][0]], bw[SIDES[i][1]]);
      const d = Math.max(...raw[i]) / k;
      if (rp <= 0 || d >= rp || !(isFrame || cornerPaints(ccs, i))) continue;
      const v = rp - d - rc[i];
      const expectedFloor = rp - d < XS && rc[i] <= XS + 0.5; // piso xs
      if (!expectedFloor && (delta === null || v < delta)) { delta = +v.toFixed(1); corner = ['sup-esq', 'sup-dir', 'inf-dir', 'inf-esq'][i]; }
    }
    // recuos ate a borda interna ou ate cabecalho/rodape entre os dois
    const obst = { ...inner }, via = { t: '', b: '', l: '', r: '' };
    // Painel = bloco de conteudo (lista, preview, iframe, grade). Controle e campo
    // tem o proprio raio de controle e nao entram na regra do recuo igual.
    const control = C.matches('button, input, select, textarea, a, [role=button], [role=combobox], [role=radiogroup], [role=tablist], .santo-focus-field, .santo-focus-within-field');
    // Linha de lista (opcao, santo-row) e celula de tabela tem regra propria de
    // realce; formas dentro do cartao da miniatura sao a ilustracao, nao painel.
    const notPanel = C.matches('[role=option], .santo-row, td, th') || !!C.parentElement?.closest('[data-thumb-card]');
    const panel = !control && !notPanel && c.width >= (inner.r - inner.l) * 0.5 && c.height >= 32 * k;
    if (panel) {
      for (const E of P.querySelectorAll('*')) {
        if (E === C || E.contains(C) || C.contains(E)) continue;
        const ecs = getComputedStyle(E);
        if (!visible(E, ecs)) continue;
        if (!(paints(ecs) || ['svg', 'IMG', 'BUTTON', 'INPUT'].includes(E.tagName) || [...E.childNodes].some((n) => n.nodeType === 3 && n.textContent.trim()))) continue;
        const e = E.getBoundingClientRect();
        if (e.width < 1 || e.height < 1) continue;
        const h = e.right > c.left + 1 && e.left < c.right - 1, v = e.bottom > c.top + 1 && e.top < c.bottom - 1;
        const tag = (E.textContent || E.tagName).trim().slice(0, 20);
        if (h && e.bottom <= c.top + 0.5 && e.bottom > obst.t) { obst.t = e.bottom; via.t = tag; }
        if (h && e.top >= c.bottom - 0.5 && e.top < obst.b) { obst.b = e.top; via.b = tag; }
        if (v && e.right <= c.left + 0.5 && e.right > obst.l) { obst.l = e.right; via.l = tag; }
        if (v && e.left >= c.right - 0.5 && e.left < obst.r) { obst.r = e.left; via.r = tag; }
      }
    }
    const ins = { l: (c.left - obst.l) / k, r: (obst.r - c.right) / k, t: (c.top - obst.t) / k, b: (obst.b - c.bottom) / k };
    const vals = Object.values(ins);
    const uneven = panel ? +(Math.max(...vals) - Math.min(...vals)).toFixed(1) : null;
    if (delta === null && uneven === null) continue;
    const a = owner(C), b = owner(P);
    out.push({
      parent: b.lib ?? '(fora da lib)', parentFile: b.file, child: isFrame ? 'iframe' : a.lib ?? '(fora da lib)', childFile: a.file, where: b.where || a.where,
      R: +R.toFixed(1), r: +Math.max(...rc).toFixed(1), ins: Object.fromEntries(Object.entries(ins).map(([kk, vv]) => [kk, +vv.toFixed(1)])), via,
      delta, corner, uneven, panel, scale: +k.toFixed(2),
      parentClass: String(P.getAttribute('class') || '').slice(0, 120), childClass: String(C.getAttribute('class') || '').slice(0, 120),
      text: (C.textContent || '').trim().slice(0, 30),
    });
  }
  return JSON.stringify(out);
}

/* ------------------------------------------------------------- CDP */

const PORT = 9300 + Math.floor(Math.random() * 400);
const chrome = spawn(CHROME, ['--headless=new', `--remote-debugging-port=${PORT}`, '--no-first-run', `--user-data-dir=${mkdtempSync(join(tmpdir(), 'probe-nest-'))}`, 'about:blank'], { stdio: 'ignore' });
const sleep = (ms) => new Promise((r) => setTimeout(r, ms));
let version;
for (let i = 0; i < 50 && !version; i++) { try { version = await (await fetch(`http://127.0.0.1:${PORT}/json/version`)).json(); } catch { await sleep(200); } }
if (!version) { console.error(`Chrome nao subiu (CHROME=${CHROME}).`); chrome.kill(); process.exit(2); }
const ws = new WebSocket(version.webSocketDebuggerUrl);
await new Promise((r) => ws.addEventListener('open', r, { once: true }));
let seq = 0; const pending = new Map();
ws.addEventListener('message', (e) => { const m = JSON.parse(e.data); if (pending.has(m.id)) { pending.get(m.id)(m); pending.delete(m.id); } });
const send = (method, params = {}, sessionId) => new Promise((r) => { const i = ++seq; pending.set(i, r); ws.send(JSON.stringify({ id: i, method, params, sessionId })); });
const evaluate = async (s, expression) => {
  const r = await send('Runtime.evaluate', { expression, returnByValue: true, awaitPromise: true }, s);
  if (r.result.exceptionDetails) throw new Error(r.result.exceptionDetails.exception?.description?.split('\n')[0]);
  return r.result.result.value;
};

const results = [];
try {
  for (const spec of ROUTES) {
    const [route, ...actions] = spec.split('|');
    const { result: { targetId } } = await send('Target.createTarget', { url: 'about:blank' });
    const { result: { sessionId: s } } = await send('Target.attachToTarget', { targetId, flatten: true });
    await send('Page.enable', {}, s);
    await send('Emulation.setEmulatedMedia', { features: [{ name: 'prefers-color-scheme', value: THEME }] }, s);
    await send('Emulation.setDeviceMetricsOverride', { width: WIDTH, height: 900, deviceScaleFactor: 1, mobile: WIDTH < 768 }, s);
    await send('Page.navigate', { url: BASE + route }, s);
    await sleep(2500);
    // O tema salvo no storage venceria a emulacao: fixa pelo atributo.
    await evaluate(s, `document.documentElement.setAttribute('data-theme', ${JSON.stringify(THEME)})`);
    for (const a of actions) {
      const sel = a.replace(/^click=/, '');
      const ok = await evaluate(s, `(() => { const el = document.querySelector(${JSON.stringify(sel)}); if (!el) return false; el.click(); return true; })()`);
      if (!ok) console.error(`  ${route}: acao sem alvo (${sel})`);
      await sleep(800);
    }
    let pairs = [];
    try { pairs = JSON.parse(await evaluate(s, `(${measure.toString()})(${JSON.stringify(LIBNAMES)})`)); }
    catch (err) { console.error(`  ${spec}: ${err.message}`); }
    results.push({ route: spec, width: WIDTH, theme: THEME, pairs });
    await send('Target.closeTarget', { targetId });
  }
} finally {
  ws.close();
  chrome.kill();
}

writeFileSync(OUT, JSON.stringify(results, null, 2));
// Tolerancia de 1px no recuo: fio (santo-edge) e arredondamento de subpixel.
const issues = results.flatMap((r) => r.pairs.filter((p) => (p.delta !== null && p.delta < -0.5) || (p.uneven !== null && p.uneven > 1)).map((p) => ({ route: r.route, ...p })));
const shown = opt.all ? results.flatMap((r) => r.pairs.map((p) => ({ route: r.route, ...p }))) : issues;
console.log(`Medidas ${results.reduce((n, r) => n + r.pairs.length, 0)} pares em ${results.length} rota(s), ${THEME}, ${WIDTH}px. JSON: ${OUT}`);
for (const p of shown) {
  const what = [p.delta !== null && p.delta < -0.5 ? `Δ ${p.delta} (${p.corner})` : null, p.uneven > 1 ? `recuo desigual ${p.uneven}` : null].filter(Boolean).join(', ') || 'ok';
  console.log(`  ${p.route}  ${p.parent} > ${p.child}  R ${p.R} r ${p.r}  l ${p.ins.l} r ${p.ins.r} t ${p.ins.t} b ${p.ins.b}  ${what}${p.where ? `  [${p.where}]` : ''}`);
}
if (!existsSync(OUT)) process.exit(2);
process.exit(issues.length ? 1 : 0);
