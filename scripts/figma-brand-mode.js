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
 * Spec: tokens/VTSD.proposal.md (rampas geradas pela curva de luminancia do Santo).
 *
 * FONTE UNICA: scripts/apply-brand-mode.mjs le MODE, SPEC e DESCRIPTIONS deste
 * arquivo para aplicar o mesmo modo no snapshot. Mantenha os tres como literais
 * puros (sem expressao, sem variavel), ou o leitor do Node quebra.
 */
const DRY_RUN = true;

const MODE = 'VTSD';

/* Valores do modo, por colecao. Gerado de tokens/VTSD.proposal.md; nao edite um sem o outro. */
const SPEC = {
  Palette: {
    "palette/brand/50": "#edf4f3",
    "palette/brand/100": "#e0f0ed",
    "palette/brand/200": "#cae6e1",
    "palette/brand/300": "#aad6d0",
    "palette/brand/400": "#7dc4bc",
    "palette/brand/500": "#4ab2a7",
    "palette/brand/600": "#00a99d",
    "palette/brand/700": "#008077",
    "palette/brand/800": "#006159",
    "palette/brand/900": "#004944",
    "palette/brand/950": "#002421",
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
    "palette/neutral/50": "#fafafa",
    "palette/neutral/100": "#f3f3f3",
    "palette/neutral/200": "#e7e7e7",
    "palette/neutral/300": "#d4d4d4",
    "palette/neutral/400": "#8b8b8b",
    "palette/neutral/500": "#6e6e6e",
    "palette/neutral/600": "#585858",
    "palette/neutral/700": "#424242",
    "palette/neutral/800": "#2c2c2c",
    "palette/neutral/900": "#1a1a1a",
    "palette/neutral/950": "#0f0f0f",
    "palette/neutral/1000": "#070707",
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
    "palette/info/950": "#102a56",
  },
  Brand: {
    "brand/id": "vtsd",
    "brand/name": "Venda Todo Santo Dia",
    "brand/family/sans": "Sora",
    "brand/family/mono": "JetBrains Mono",
    "brand/shape/radius-base": "{dimension/radius/8}",
  },
};

/* Descriptions por variavel. No Figma a description e da variavel, nao do modo:
   com mais de uma marca ela tem de servir para todas. */
const DESCRIPTIONS = {
  "brand/family/sans": "Família sans da marca. Cobre os 11 papéis de texto, do heading-1 ao caption-small.",
};

const collections = await figma.variables.getLocalVariableCollectionsAsync();
const allVars = await figma.variables.getLocalVariablesAsync();
const byName = new Map(allVars.map((v) => [v.name, v]));

const isAlias = (v) => typeof v === 'string' && v.startsWith('{') && v.endsWith('}');
const hexToRgba = (hex) => ({
  r: parseInt(hex.slice(1, 3), 16) / 255,
  g: parseInt(hex.slice(3, 5), 16) / 255,
  b: parseInt(hex.slice(5, 7), 16) / 255,
  a: 1,
});
const toHex = (c) => '#' + [c.r, c.g, c.b].map((x) => Math.round(x * 255).toString(16).padStart(2, '0')).join('');
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
    if (v.resolvedType === 'COLOR' && !isAlias(val) && !/^#[0-9a-f]{6}$/i.test(val)) problems.push(`${name}: COLOR precisa de #rrggbb (veio ${val})`);
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
