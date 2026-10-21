/**
 * Serializacao canonica + hash usados pelo check de paridade.
 *
 * ATENCAO: scripts/figma-fingerprint.js repete estas mesmas funcoes palavra por
 * palavra, porque roda dentro do sandbox do Figma e nao consegue importar nada.
 * Se mexer aqui, mexa la tambem.
 */

export function fnv1a(str) {
  let h = 0x811c9dc5;
  for (let i = 0; i < str.length; i++) {
    h ^= str.charCodeAt(i);
    h = Math.imul(h, 0x01000193) >>> 0;
  }
  return h.toString(16).padStart(8, '0');
}

export function variableLine(name, type, scopes, modes, values, description) {
  return JSON.stringify([
    name,
    type,
    [...scopes].sort(),
    modes.map((m) => values[m]),
    description || '',
  ]);
}

export function textStyleLine(name, s) {
  return JSON.stringify([
    name,
    s.fontFamily,
    s.fontStyle,
    s.fontSize,
    s.lineHeight.unit === 'AUTO' ? ['AUTO'] : [s.lineHeight.unit, s.lineHeight.value],
    [s.letterSpacing.unit, s.letterSpacing.value],
    s.textCase,
    s.textDecoration,
    s.paragraphSpacing,
    s.paragraphIndent,
    Object.keys(s.boundVariables || {}).sort().map((k) => [k, s.boundVariables[k]]),
  ]);
}

export function effectStyleLine(name, s) {
  return JSON.stringify([
    name,
    s.effects.map((e) => {
      const row = [e.type, e.x, e.y, e.blur, e.spread, e.color, e.visible, e.blendMode];
      // Cor ligada a variavel (nivel B): entra no hash so quando existe.
      return e.boundVariables && e.boundVariables.color ? [...row, e.boundVariables.color] : row;
    }),
  ]);
}

export function hashLines(lines) {
  return fnv1a([...lines].sort().join('\n'));
}
