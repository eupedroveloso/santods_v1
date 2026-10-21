/**
 * Script SOMENTE LEITURA para o MCP `use_figma`.
 *
 * Retorna um hash por colecao/grupo de styles em vez do dump inteiro — barato o
 * bastante para rodar em toda checagem de paridade. Compare com a saida de:
 *   node scripts/check-parity.mjs --fingerprint
 *
 * Se algum hash divergir, ai sim rode scripts/figma-dump.js para ver o que mudou.
 * As quatro funcoes abaixo sao copia literal de scripts/parity-hash.mjs.
 */
function fnv1a(str) {
  let h = 0x811c9dc5;
  for (let i = 0; i < str.length; i++) {
    h ^= str.charCodeAt(i);
    h = Math.imul(h, 0x01000193) >>> 0;
  }
  return h.toString(16).padStart(8, '0');
}
function variableLine(name, type, scopes, modes, values, description) {
  return JSON.stringify([name, type, [...scopes].sort(), modes.map((m) => values[m]), description || '']);
}
function textStyleLine(name, s) {
  return JSON.stringify([
    name, s.fontFamily, s.fontStyle, s.fontSize,
    s.lineHeight.unit === 'AUTO' ? ['AUTO'] : [s.lineHeight.unit, s.lineHeight.value],
    [s.letterSpacing.unit, s.letterSpacing.value],
    s.textCase, s.textDecoration, s.paragraphSpacing, s.paragraphIndent,
    Object.keys(s.boundVariables || {}).sort().map((k) => [k, s.boundVariables[k]]),
  ]);
}
function effectStyleLine(name, s) {
  return JSON.stringify([name, s.effects.map((e) => {
    const row = [e.type, e.x, e.y, e.blur, e.spread, e.color, e.visible, e.blendMode];
    const bv = e.boundVariables || {};
    const keys = Object.keys(bv).sort();
    if (!keys.length) return row;
    return keys.length === 1 && keys[0] === 'color' ? [...row, bv.color] : [...row, keys.map((k) => [k, bv[k]])];
  })]);
}
function hashLines(lines) {
  return fnv1a([...lines].sort().join('\n'));
}

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
  if (val && typeof val === 'object' && val.type === 'VARIABLE_ALIAS') return '{' + (byId[val.id] ? byId[val.id].name : val.id) + '}';
  if (val && typeof val === 'object' && 'r' in val) return toHex(val);
  return val;
};

const collections = {};
for (const c of collectionsApi) {
  const modes = c.modes.map((m) => m.name);
  const vars = allVars.filter((v) => v.variableCollectionId === c.id);
  const lines = vars.map((v) => {
    const values = {};
    for (const m of c.modes) values[m.name] = fmt(v.valuesByMode[m.modeId]);
    const scopes = v.scopes.length === 1 && v.scopes[0] === 'ALL_SCOPES' ? [] : v.scopes;
    return variableLine(v.name, v.resolvedType, scopes, modes, values, v.description);
  });
  collections[c.name] = { hash: hashLines(lines), count: vars.length, modes: modes.join('/') };
}

const textLines = (await figma.getLocalTextStylesAsync()).map((s) => {
  const bv = {};
  for (const key of ['fontFamily', 'fontSize', 'lineHeight', 'fontWeight', 'letterSpacing']) {
    const b = s.boundVariables && s.boundVariables[key];
    if (b) bv[key] = byId[b.id] ? byId[b.id].name : b.id;
  }
  return textStyleLine(s.name, {
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
  });
});

const effectLines = (await figma.getLocalEffectStylesAsync()).map((s) =>
  effectStyleLine(s.name, {
    effects: s.effects.map((e) => ({
      type: e.type,
      x: e.offset ? e.offset.x : 0,
      y: e.offset ? e.offset.y : 0,
      blur: e.radius,
      spread: e.spread || 0,
      color: e.color ? toHex(e.color) : null,
      visible: e.visible,
      blendMode: e.blendMode || 'NORMAL',
      boundVariables: (() => {
        const bound = {};
        for (const [field, key] of [['color', 'color'], ['offsetY', 'y'], ['radius', 'blur']]) {
          const b = e.boundVariables && e.boundVariables[field];
          if (b && byId[b.id]) bound[key] = byId[b.id].name;
        }
        return Object.keys(bound).length ? bound : undefined;
      })(),
    })),
  }),
);

return {
  collections,
  textStyles: { hash: hashLines(textLines), count: textLines.length },
  effectStyles: { hash: hashLines(effectLines), count: effectLines.length },
  paintStyles: (await figma.getLocalPaintStylesAsync()).length,
  gridStyles: (await figma.getLocalGridStylesAsync()).length,
};
