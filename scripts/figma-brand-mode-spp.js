/**
 * Script de ESCRITA para o MCP `use_figma`: cria (ou atualiza) um modo de marca
 * nas colecoes Palette e Brand e preenche os valores da spec abaixo.
 *
 * Fluxo (ver .claude/agents/figma-parity.md):
 *   1. Cole este arquivo inteiro no `use_figma` com DRY_RUN = true. Nada e escrito;
 *      a saida lista o que seria criado/alterado e confere as fontes da marca.
 *   2. Com o plano aprovado, troque DRY_RUN para false e rode de novo.
 *   3. Rode scripts/figma-dump.js, depois check-parity <dump> --write e npm run tokens.
 *
 * E idempotente: rodar de novo so reescreve o que difere da spec. Falha ANTES de
 * escrever se a spec nao cobrir alguma variavel das colecoes (ou citar uma que
 * nao existe), para nunca deixar um modo pela metade.
 *
 * Valores: hex `#rrggbb` para COLOR, `{caminho}` para alias, string ou numero cru.
 * Spec: tokens/SPP.proposal.md (modo de marca Seu Produto Pronto, derivado com lib/tokens/estudio.mjs
 * do rascunho da proposta). Rode DEPOIS do scripts/figma-nivel-b.js: a spec cobre as variaveis do nivel B.
 *
 * FONTE UNICA: scripts/apply-brand-mode.mjs --spec scripts/figma-brand-mode-spp.js le MODE, SPEC e DESCRIPTIONS deste
 * arquivo para aplicar o mesmo modo no snapshot. Mantenha os tres como literais
 * puros (sem expressao, sem variavel), ou o leitor do Node quebra.
 */
const DRY_RUN = true;

const MODE = 'SPP';

/* Valores do modo, por colecao. Gerado por derivar(rascunho de tokens/SPP.proposal.md); nao edite um sem o outro. */
const SPEC = {
  "Palette": {
    "palette/brand/50": "#ecf3f9",
    "palette/brand/100": "#dfeffa",
    "palette/brand/200": "#c9e3f8",
    "palette/brand/300": "#a8d3f4",
    "palette/brand/400": "#7ac0f1",
    "palette/brand/500": "#46abec",
    "palette/brand/600": "#009be6",
    "palette/brand/700": "#0b5cff",
    "palette/brand/800": "#005b88",
    "palette/brand/900": "#004469",
    "palette/brand/950": "#002136",
    "palette/accent/50": "#fef9ec",
    "palette/accent/100": "#fcf0cb",
    "palette/accent/200": "#f9e093",
    "palette/accent/300": "#f5ca5a",
    "palette/accent/400": "#f2b62f",
    "palette/accent/500": "#e89f13",
    "palette/accent/600": "#cd7d0d",
    "palette/accent/700": "#a85b0f",
    "palette/accent/800": "#8a4813",
    "palette/accent/900": "#743b16",
    "palette/accent/950": "#431d06",
    "palette/neutral/0": "#ffffff",
    "palette/neutral/50": "#fbfafa",
    "palette/neutral/100": "#f5f2f4",
    "palette/neutral/200": "#ece6e9",
    "palette/neutral/300": "#dad3d6",
    "palette/neutral/400": "#96878e",
    "palette/neutral/500": "#776b70",
    "palette/neutral/600": "#62545b",
    "palette/neutral/700": "#4b4045",
    "palette/neutral/800": "#332a2e",
    "palette/neutral/900": "#20171c",
    "palette/neutral/950": "#100a0d",
    "palette/neutral/1000": "#0a0608",
    "palette/success/50": "#ecfdf3",
    "palette/success/100": "#d1fadf",
    "palette/success/200": "#a6f4c5",
    "palette/success/300": "#6ce9a6",
    "palette/success/400": "#32d583",
    "palette/success/500": "#12b76a",
    "palette/success/600": "#039855",
    "palette/success/700": "#027a48",
    "palette/success/800": "#05603a",
    "palette/success/900": "#054f31",
    "palette/success/950": "#023321",
    "palette/warning/50": "#fffaeb",
    "palette/warning/100": "#fef0c7",
    "palette/warning/200": "#fedf89",
    "palette/warning/300": "#fec84b",
    "palette/warning/400": "#fdb022",
    "palette/warning/500": "#f79009",
    "palette/warning/600": "#dc6803",
    "palette/warning/700": "#b54708",
    "palette/warning/800": "#93370d",
    "palette/warning/900": "#7a2e0e",
    "palette/warning/950": "#4e1d09",
    "palette/danger/50": "#fef3f2",
    "palette/danger/100": "#fee4e2",
    "palette/danger/200": "#fecdca",
    "palette/danger/300": "#fda29b",
    "palette/danger/400": "#f97066",
    "palette/danger/500": "#f04438",
    "palette/danger/600": "#d92d20",
    "palette/danger/700": "#b42318",
    "palette/danger/800": "#912018",
    "palette/danger/900": "#7a271a",
    "palette/danger/950": "#55160c",
    "palette/info/50": "#eff8ff",
    "palette/info/100": "#d1e9ff",
    "palette/info/200": "#b2ddff",
    "palette/info/300": "#84caff",
    "palette/info/400": "#53b1fd",
    "palette/info/500": "#2e90fa",
    "palette/info/600": "#1570ef",
    "palette/info/700": "#175cd3",
    "palette/info/800": "#1849a9",
    "palette/info/900": "#194185",
    "palette/info/950": "#102a56"
  },
  "Brand": {
    "brand/id": "spp",
    "brand/name": "Seu Produto Pronto",
    "brand/family/sans": "Montserrat",
    "brand/family/mono": "JetBrains Mono",
    "brand/shape/radius-base": "{dimension/radius/16}",
    "brand/family/heading": "Montserrat",
    "brand/shape/radius-xs": "{dimension/radius/8}",
    "brand/shape/radius-sm": "{dimension/radius/16}",
    "brand/shape/radius-lg": "{dimension/radius/24}",
    "brand/shape/radius-xl": "{dimension/radius/32}",
    "brand/shape/radius-2xl": 48,
    "brand/shape/radius-3xl": 64,
    "brand/space/3xs": "{dimension/space/2}",
    "brand/space/2xs": "{dimension/space/4}",
    "brand/space/xs": "{dimension/space/8}",
    "brand/space/sm": "{dimension/space/12}",
    "brand/space/md": "{dimension/space/16}",
    "brand/space/lg": "{dimension/space/24}",
    "brand/space/xl": "{dimension/space/32}",
    "brand/space/2xl": "{dimension/space/40}",
    "brand/space/3xl": "{dimension/space/48}",
    "brand/space/4xl": "{dimension/space/64}",
    "brand/space/5xl": "{dimension/space/80}",
    "brand/space/6xl": "{dimension/space/96}",
    "brand/space/7xl": "{dimension/space/128}",
    "brand/space/8xl": "{dimension/space/192}",
    "brand/type/heading-1/size": "{type/size/60}",
    "brand/type/heading-1/leading": 76,
    "brand/type/heading-2/size": "{type/size/48}",
    "brand/type/heading-2/leading": 60,
    "brand/type/heading-3/size": "{type/size/36}",
    "brand/type/heading-3/leading": "{type/leading/44}",
    "brand/type/heading-4/size": 32,
    "brand/type/heading-4/leading": 40,
    "brand/type/heading-5/size": 28,
    "brand/type/heading-5/leading": 36,
    "brand/type/heading-6/size": "{type/size/24}",
    "brand/type/heading-6/leading": "{type/leading/32}",
    "brand/type/body-large/size": "{type/size/20}",
    "brand/type/body-large/leading": "{type/leading/32}",
    "brand/type/body/size": "{type/size/18}",
    "brand/type/body/leading": "{type/leading/28}",
    "brand/type/body-small/size": "{type/size/16}",
    "brand/type/body-small/leading": "{type/leading/24}",
    "brand/type/caption/size": "{type/size/14}",
    "brand/type/caption/leading": "{type/leading/20}",
    "brand/type/caption-small/size": "{type/size/12}",
    "brand/type/caption-small/leading": "{type/leading/16}",
    "brand/control/height/sm": "{dimension/size/36}",
    "brand/control/height/md": "{dimension/size/44}",
    "brand/control/height/lg": "{dimension/size/56}",
    "brand/shadow/xs/1": "#100a0d23",
    "brand/shadow/sm/1": "#100a0d23",
    "brand/shadow/sm/2": "#100a0d1a",
    "brand/shadow/md/1": "#100a0d23",
    "brand/shadow/md/2": "#100a0d1a",
    "brand/shadow/lg/1": "#100a0d28",
    "brand/shadow/lg/2": "#100a0d1a",
    "brand/shadow/xl/1": "#100a0d2e",
    "brand/shadow/xl/2": "#100a0d1a",
    "brand/shadow/2xl/1": "#100a0d36",
    "brand/surface/page/light": "{palette/neutral/0}",
    "brand/surface/page/dark": "{palette/neutral/1000}",
    "brand/surface/raised/light": "{palette/neutral/0}",
    "brand/surface/raised/dark": "{palette/neutral/950}",
    "brand/surface/sunken/light": "{palette/neutral/50}",
    "brand/surface/sunken/dark": "{palette/neutral/1000}",
    "brand/surface/well/light": "{palette/neutral/100}",
    "brand/surface/well/dark": "{palette/neutral/950}",
    "brand/surface/panel/light": "{palette/neutral/0}",
    "brand/surface/panel/dark": "{palette/neutral/950}",
    "brand/surface/overlay/light": "#0a060899",
    "brand/surface/overlay/dark": "#000000b8",
    "brand/border/subtle/light": "{palette/neutral/100}",
    "brand/border/subtle/dark": "{palette/neutral/900}",
    "brand/border/default/light": "{palette/neutral/200}",
    "brand/border/default/dark": "{palette/neutral/800}",
    "brand/border/strong/light": "{palette/neutral/400}",
    "brand/border/strong/dark": "{palette/neutral/500}",
    "brand/frame/inset": "{brand/space/xs}",
    "brand/frame/enabled": 0,
    "brand/frame/border/light": "{palette/neutral/100}",
    "brand/frame/border/dark": "{palette/neutral/900}",
    "brand/shape/radius-control": "{dimension/radius/8}",
    "brand/control/padding-x/sm": "{brand/space/sm}",
    "brand/control/padding-x/md": "{brand/space/md}",
    "brand/control/padding-x/lg": "{brand/space/lg}",
    "brand/control/radius/sm": "{brand/shape/radius-control}",
    "brand/control/radius/md": "{brand/shape/radius-control}",
    "brand/control/radius/lg": "{brand/shape/radius-control}",
    "brand/control/border/sm": "{dimension/border/2}",
    "brand/control/border/md": "{dimension/border/2}",
    "brand/control/border/lg": "{dimension/border/2}",
    "brand/control/font/sm": "{brand/type/caption/size}",
    "brand/control/font/md": "{brand/type/body-small/size}",
    "brand/control/font/lg": "{brand/type/body/size}",
    "brand/control/icon/sm": "{dimension/icon/16}",
    "brand/control/icon/md": "{dimension/icon/20}",
    "brand/control/icon/lg": "{dimension/icon/20}",
    "brand/control/gap/sm": "{brand/space/xs}",
    "brand/control/gap/md": "{brand/space/sm}",
    "brand/control/gap/lg": "{brand/space/sm}",
    "brand/type/heading-1/tracking": -3,
    "brand/type/heading-2/tracking": -3,
    "brand/type/heading-3/tracking": -3,
    "brand/type/heading-4/tracking": -3,
    "brand/type/heading-5/tracking": -3,
    "brand/type/heading-6/tracking": -3,
    "brand/type/body-large/tracking": -3,
    "brand/type/body/tracking": "{type/tracking/normal}",
    "brand/type/body-small/tracking": "{type/tracking/normal}",
    "brand/type/caption/tracking": "{type/tracking/normal}",
    "brand/type/caption-small/tracking": "{type/tracking/wide}",
    "brand/shadow/xs/1/y": 2,
    "brand/shadow/xs/1/blur": 6,
    "brand/shadow/sm/1/y": 2,
    "brand/shadow/sm/1/blur": 9,
    "brand/shadow/sm/2/y": 2,
    "brand/shadow/sm/2/blur": 6,
    "brand/shadow/md/1/y": 8,
    "brand/shadow/md/1/blur": 24,
    "brand/shadow/md/2/y": 4,
    "brand/shadow/md/2/blur": 12,
    "brand/shadow/lg/1/y": 24,
    "brand/shadow/lg/1/blur": 48,
    "brand/shadow/lg/2/y": 8,
    "brand/shadow/lg/2/blur": 18,
    "brand/shadow/xl/1/y": 40,
    "brand/shadow/xl/1/blur": 72,
    "brand/shadow/xl/2/y": 16,
    "brand/shadow/xl/2/blur": 24,
    "brand/shadow/2xl/1/y": 48,
    "brand/shadow/2xl/1/blur": 144,
    "brand/effect/blur/sm": 8,
    "brand/effect/blur/md": 16,
    "brand/effect/blur/lg": 32,
    "brand/effect/blur/xl": 64,
    "brand/effect/layer-blur/sm": 10,
    "brand/effect/layer-blur/md": 64,
    "brand/effect/glow/brand": "#46abec52",
    "brand/effect/glow/neutral": "#100a0d29",
    "brand/effect/glow/blur": 48,
    "brand/effect/noise": 0.04,
    "brand/gradient/brand/angle": 96,
    "brand/gradient/brand/from": "{palette/brand/400}",
    "brand/gradient/brand/to": "{palette/brand/950}",
    "brand/glass/surface/light": "#ece6e93d",
    "brand/glass/surface/dark": "#46abec0a",
    "brand/glass/border/light": "#0a06080f",
    "brand/glass/border/dark": "#ffffff1f",
    "brand/glass/highlight/light": "#ffffff99",
    "brand/glass/highlight/dark": "#ffffff14",
    "brand/glass/blur": "{brand/effect/blur/md}",
    "brand/glass/enabled": 0
  }
};

/* Descriptions por variavel. No Figma a description e da variavel, nao do modo:
   com mais de uma marca ela tem de servir para todas. */
const DESCRIPTIONS = {};

const collections = await figma.variables.getLocalVariableCollectionsAsync();
const allVars = await figma.variables.getLocalVariablesAsync();
const byName = new Map(allVars.map((v) => [v.name, v]));

const isAlias = (v) => typeof v === 'string' && v.startsWith('{') && v.endsWith('}');
// #rrggbb ou #rrggbbaa (sombras, vidro e glow do nivel B tem alfa).
const hexToRgba = (hex) => ({
  r: parseInt(hex.slice(1, 3), 16) / 255,
  g: parseInt(hex.slice(3, 5), 16) / 255,
  b: parseInt(hex.slice(5, 7), 16) / 255,
  a: hex.length === 9 ? parseInt(hex.slice(7, 9), 16) / 255 : 1,
});
const h2 = (x) => Math.round(x * 255).toString(16).padStart(2, '0');
const toHex = (c) => '#' + h2(c.r) + h2(c.g) + h2(c.b) + (c.a === undefined || c.a === 1 ? '' : h2(c.a));
const show = (val) => {
  if (val && typeof val === 'object' && val.type === 'VARIABLE_ALIAS') {
    const t = allVars.find((v) => v.id === val.id);
    return '{' + (t ? t.name : val.id) + '}';
  }
  if (val && typeof val === 'object' && 'r' in val) return toHex(val);
  return val;
};

/* --------------------------------------------- validacao (antes de escrever) */

const problems = [];
const plan = [];
for (const [collectionName, values] of Object.entries(SPEC)) {
  const c = collections.find((x) => x.name === collectionName);
  if (!c) {
    problems.push(`colecao ${collectionName} nao existe`);
    continue;
  }
  const vars = allVars.filter((v) => v.variableCollectionId === c.id);
  for (const v of vars) if (!(v.name in values)) problems.push(`${collectionName}: spec nao cobre ${v.name}`);
  for (const [name, val] of Object.entries(values)) {
    const v = vars.find((x) => x.name === name);
    if (!v) {
      problems.push(`${collectionName}: ${name} nao existe no Figma`);
      continue;
    }
    if (isAlias(val) && !byName.has(val.slice(1, -1))) problems.push(`${name}: alias para variavel inexistente ${val}`);
    if (v.resolvedType === 'COLOR' && !isAlias(val) && !/^#[0-9a-f]{6}([0-9a-f]{2})?$/i.test(val)) problems.push(`${name}: COLOR precisa de #rrggbb ou #rrggbbaa (veio ${val})`);
  }
  const existing = c.modes.find((m) => m.name === MODE);
  plan.push({ collection: c, vars, values, existing });
}
for (const name of Object.keys(DESCRIPTIONS)) {
  if (!byName.has(name)) problems.push(`description para variavel inexistente ${name}`);
}

// A familia sans da marca precisa existir no Figma em todos os pesos dos text styles.
const fontsAvailable = await figma.listAvailableFontsAsync();
const stylesUsed = [...new Set((await figma.getLocalTextStylesAsync()).map((s) => s.fontName.style))];
const sans = SPEC.Brand['brand/family/sans'];
const sansStyles = fontsAvailable.filter((f) => f.fontName.family === sans).map((f) => f.fontName.style);
const missingStyles = stylesUsed.filter((st) => !sansStyles.includes(st));
if (!sansStyles.length) problems.push(`fonte ${sans} indisponivel no Figma`);
else if (missingStyles.length) problems.push(`fonte ${sans} sem os estilos ${missingStyles.join(', ')} usados pelos text styles`);

if (problems.length) return { ok: false, written: false, problems };

/* ----------------------------------------------------------------- escrita */

const report = [];
for (const { collection, vars, values, existing } of plan) {
  let modeId = existing ? existing.modeId : null;
  if (!modeId && !DRY_RUN) modeId = collection.addMode(MODE);
  const changes = [];
  for (const v of vars) {
    const want = values[v.name];
    // Modo recem-criado: grava tudo, sem confiar no que o addMode copiou do padrao.
    const before = existing ? show(v.valuesByMode[modeId]) : undefined;
    if (before !== undefined && String(before).toLowerCase() === String(want).toLowerCase()) continue;
    changes.push(`${v.name}: ${before === undefined ? '(novo)' : before} -> ${want}`);
    if (DRY_RUN) continue;
    if (v.resolvedType === 'STRING' && v.scopes.includes('FONT_FAMILY')) {
      await figma.loadFontAsync({ family: want, style: 'Regular' });
    }
    const raw = isAlias(want)
      ? figma.variables.createVariableAlias(byName.get(want.slice(1, -1)))
      : v.resolvedType === 'COLOR'
        ? hexToRgba(want)
        : want;
    v.setValueForMode(modeId, raw);
  }
  for (const v of vars) {
    if (!(v.name in DESCRIPTIONS) || v.description === DESCRIPTIONS[v.name]) continue;
    changes.push(`${v.name} (description): ${JSON.stringify(v.description)} -> ${JSON.stringify(DESCRIPTIONS[v.name])}`);
    if (!DRY_RUN) v.description = DESCRIPTIONS[v.name];
  }
  report.push({
    collection: collection.name,
    mode: MODE,
    modeId,
    modeCreated: !existing,
    modes: DRY_RUN ? [...collection.modes.map((m) => m.name), ...(existing ? [] : [MODE])] : collection.modes.map((m) => m.name),
    variables: vars.length,
    changed: changes.length,
    changes,
  });
}

return {
  ok: true,
  dryRun: DRY_RUN,
  written: !DRY_RUN,
  fonts: { family: sans, available: sansStyles, stylesUsedByTextStyles: stylesUsed },
  report,
};
