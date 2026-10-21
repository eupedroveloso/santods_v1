/**
 * Script SOMENTE LEITURA para o MCP `use_figma` do Figma.
 *
 * Cole o conteudo integral deste arquivo no parametro `code` de use_figma
 * (fileKey O0xV7p3taNff97XGjNjTMl). O retorno tem exatamente o mesmo formato de
 * tokens/santods.figma.json, entao da para gravar o resultado num arquivo e
 * comparar com `node scripts/check-parity.mjs <arquivo>`.
 *
 * Nao cria, altera nem apaga nada no Figma.
 */
const PREFIX = 'santo';

const collectionsApi = await figma.variables.getLocalVariableCollectionsAsync();
const allVars = await figma.variables.getLocalVariablesAsync();
const byId = {};
allVars.forEach((v) => (byId[v.id] = v));

const hex2 = (n) => Math.round(n * 255).toString(16).padStart(2, '0');
const toHex = (c) => {
  const base = '#' + hex2(c.r) + hex2(c.g) + hex2(c.b);
  return c.a === undefined || c.a >= 1 ? base : base + hex2(c.a);
};
const fmt = (val) => {
  if (val && typeof val === 'object' && val.type === 'VARIABLE_ALIAS') {
    return '{' + (byId[val.id] ? byId[val.id].name : val.id) + '}';
  }
  if (val && typeof val === 'object' && 'r' in val) return toHex(val);
  return val;
};

const collections = {};
for (const c of collectionsApi) {
  const modes = c.modes.map((m) => m.name);
  const defaultMode = c.modes.find((m) => m.modeId === c.defaultModeId).name;
  const variables = {};
  for (const v of allVars.filter((v) => v.variableCollectionId === c.id)) {
    const entry = { type: v.resolvedType };
    if (modes.length === 1) {
      entry.value = fmt(v.valuesByMode[c.defaultModeId]);
    } else {
      entry.values = {};
      for (const m of c.modes) entry.values[m.name] = fmt(v.valuesByMode[m.modeId]);
    }
    if (v.scopes.length && !(v.scopes.length === 1 && v.scopes[0] === 'ALL_SCOPES')) {
      entry.scopes = v.scopes.slice();
    }
    if (v.description) entry.description = v.description;
    variables[v.name] = entry;
  }
  collections[c.name] = { modes, defaultMode, variables };
}

const textStyles = {};
for (const s of await figma.getLocalTextStylesAsync()) {
  const bv = {};
  for (const key of ['fontFamily', 'fontSize', 'lineHeight', 'fontWeight', 'letterSpacing']) {
    const b = s.boundVariables && s.boundVariables[key];
    if (b) bv[key] = byId[b.id] ? byId[b.id].name : b.id;
  }
  textStyles[s.name] = {
    fontFamily: s.fontName.family,
    fontStyle: s.fontName.style,
    fontSize: s.fontSize,
    lineHeight: s.lineHeight.unit === 'AUTO' ? { unit: 'AUTO' } : { unit: s.lineHeight.unit, value: s.lineHeight.value },
    letterSpacing: { unit: s.letterSpacing.unit, value: s.letterSpacing.value },
    textCase: s.textCase,
    textDecoration: s.textDecoration,
    paragraphSpacing: s.paragraphSpacing,
    paragraphIndent: s.paragraphIndent,
    boundVariables: bv,
  };
}

const effectStyles = {};
for (const s of await figma.getLocalEffectStylesAsync()) {
  effectStyles[s.name] = {
    effects: s.effects.map((e) => {
      const out = {
        type: e.type,
        x: e.offset ? e.offset.x : 0,
        y: e.offset ? e.offset.y : 0,
        blur: e.radius,
        spread: e.spread || 0,
        color: e.color ? toHex(e.color) : null,
        visible: e.visible,
        blendMode: e.blendMode || 'NORMAL',
      };
      // Campos ligados a variavel (nivel B do Estudio): cor, deslocamento vertical e desfoque.
      const bound = {};
      for (const [field, key] of [['color', 'color'], ['offsetY', 'y'], ['radius', 'blur']]) {
        const b = e.boundVariables && e.boundVariables[field];
        if (b) bound[key] = byId[b.id] ? byId[b.id].name : b.id;
      }
      if (Object.keys(bound).length) out.boundVariables = bound;
      return out;
    }),
  };
}

const paintStyles = {};
for (const s of await figma.getLocalPaintStylesAsync()) {
  paintStyles[s.name] = {
    paints: s.paints.map((p) => ({ type: p.type, color: p.color ? toHex(p.color) : null, opacity: p.opacity })),
  };
}

const gridStyles = {};
for (const s of await figma.getLocalGridStylesAsync()) {
  gridStyles[s.name] = {
    grids: s.layoutGrids.map((g) => ({
      pattern: g.pattern,
      count: g.count,
      gutterSize: g.gutterSize,
      offset: g.offset,
      sectionSize: g.sectionSize,
      alignment: g.alignment,
    })),
  };
}

return {
  meta: {
    fileKey: 'O0xV7p3taNff97XGjNjTMl',
    fileName: figma.root.name,
    cssPrefix: PREFIX,
  },
  collections,
  textStyles,
  effectStyles,
  paintStyles,
  gridStyles,
  pages: figma.root.children.map((p) => p.name),
};
