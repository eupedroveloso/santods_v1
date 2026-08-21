/**
 * Marcas: um Design System derivado do SantoDS.
 *
 * Uma marca nao guarda os 345 tokens — guarda so o que ela muda em relacao a
 * base do Figma. Isso mantem a heranca viva: quando o Figma muda um token que a
 * marca nao sobrescreveu, ela recebe a mudanca junto.
 *
 * Formato de brands/<id>.json:
 * {
 *   "id": "acme",
 *   "name": "Acme",
 *   "description": "...",
 *   "overrides": {
 *     "variables":    { "palette/brand/500": { "value": "#ff5722" },
 *                       "color/text/primary": { "values": { "Light": "{palette/neutral/800}" } } },
 *     "textStyles":   { "Albert Sans/heading-1/bold": { "fontSize": 64 } },
 *     "effectStyles": { "md": { "effects": [ ... ] } }
 *   }
 * }
 *
 * Em `variables`, um override parcial e mesclado sobre a definicao base: da para
 * mandar so `value`, so um dos modos em `values`, so `scopes` ou so `description`.
 */

/** Marca vazia — identica a base. */
export function emptyBrand(id, name) {
  return { id, name: name ?? id, description: '', overrides: { variables: {}, textStyles: {}, effectStyles: {} } };
}

/** Em qual colecao vive um token. */
export function collectionOf(doc, tokenName) {
  for (const [collectionName, c] of Object.entries(doc.collections)) {
    if (tokenName in c.variables) return collectionName;
  }
  return null;
}

/**
 * Aplica os overrides de uma marca sobre o doc base e devolve um doc completo,
 * pronto para qualquer emissor. Nao muta a base.
 */
export function applyBrand(baseDoc, brand) {
  const overrides = brand?.overrides ?? {};
  const doc = {
    meta: { ...baseDoc.meta },
    collections: {},
    textStyles: {},
    effectStyles: {},
  };

  if (brand?.id) doc.meta.brandId = brand.id;
  if (brand?.name) doc.meta.brandName = brand.name;

  const varOverrides = overrides.variables ?? {};

  for (const [collectionName, c] of Object.entries(baseDoc.collections)) {
    const variables = {};
    for (const [name, def] of Object.entries(c.variables)) {
      const patch = varOverrides[name];
      variables[name] = patch ? mergeVariable(def, patch, c) : def;
    }
    doc.collections[collectionName] = { modes: [...c.modes], defaultMode: c.defaultMode, variables };
  }

  // Tokens que a marca inventou e que nao existem na base entram na colecao
  // declarada em `collection`, ou em Palette como ultimo recurso.
  for (const [name, patch] of Object.entries(varOverrides)) {
    if (collectionOf(baseDoc, name)) continue;
    const target = patch.collection && doc.collections[patch.collection] ? patch.collection : 'Palette';
    const rest = { ...patch };
    delete rest.collection;
    doc.collections[target].variables[name] = { type: rest.type ?? 'COLOR', ...rest };
  }

  for (const [name, def] of Object.entries(baseDoc.textStyles)) {
    const patch = (overrides.textStyles ?? {})[name];
    doc.textStyles[name] = patch
      ? { ...def, ...patch, boundVariables: { ...def.boundVariables, ...(patch.boundVariables ?? {}) } }
      : def;
  }
  for (const [name, patch] of Object.entries(overrides.textStyles ?? {})) {
    if (!(name in doc.textStyles)) doc.textStyles[name] = patch;
  }

  for (const [name, def] of Object.entries(baseDoc.effectStyles)) {
    const patch = (overrides.effectStyles ?? {})[name];
    doc.effectStyles[name] = patch ? { ...def, ...patch } : def;
  }
  for (const [name, patch] of Object.entries(overrides.effectStyles ?? {})) {
    if (!(name in doc.effectStyles)) doc.effectStyles[name] = patch;
  }

  return doc;
}

function mergeVariable(def, patch, collection) {
  const merged = { ...def };
  if ('type' in patch) merged.type = patch.type;
  if ('scopes' in patch) merged.scopes = patch.scopes;
  if ('description' in patch) merged.description = patch.description;

  const multiMode = collection.modes.length > 1;
  if ('values' in patch) {
    const base = def.values ?? { [collection.defaultMode]: def.value };
    merged.values = { ...base, ...patch.values };
    delete merged.value;
  } else if ('value' in patch) {
    if (multiMode) {
      const base = def.values ?? { [collection.defaultMode]: def.value };
      merged.values = Object.fromEntries(collection.modes.map((m) => [m, patch.value ?? base[m]]));
      delete merged.value;
    } else {
      merged.value = patch.value;
      delete merged.values;
    }
  }
  return merged;
}

/**
 * Diferenca entre um doc editado e a base, no formato de overrides.
 * E o que o Studio grava ao salvar: so o que realmente mudou.
 */
export function diffToOverrides(baseDoc, editedDoc) {
  const variables = {};
  const same = (a, b) => JSON.stringify(a) === JSON.stringify(b);

  for (const [collectionName, c] of Object.entries(editedDoc.collections)) {
    const baseCollection = baseDoc.collections[collectionName];
    for (const [name, def] of Object.entries(c.variables)) {
      const baseDef = baseCollection?.variables?.[name];
      if (!baseDef) {
        variables[name] = { ...def, collection: collectionName };
        continue;
      }
      const patch = {};
      const values = def.values ?? { [c.defaultMode]: def.value };
      const baseValues = baseDef.values ?? { [baseCollection.defaultMode]: baseDef.value };
      const changed = {};
      for (const mode of c.modes) {
        if (!same(values[mode], baseValues[mode])) changed[mode] = values[mode];
      }
      if (Object.keys(changed).length) {
        if (c.modes.length === 1) patch.value = changed[c.modes[0]];
        else patch.values = changed;
      }
      if (!same(def.scopes ?? [], baseDef.scopes ?? [])) patch.scopes = def.scopes ?? [];
      if ((def.description ?? '') !== (baseDef.description ?? '')) patch.description = def.description ?? '';
      if (Object.keys(patch).length) variables[name] = patch;
    }
  }

  const textStyles = {};
  for (const [name, s] of Object.entries(editedDoc.textStyles)) {
    const baseStyle = baseDoc.textStyles[name];
    if (!baseStyle) { textStyles[name] = s; continue; }
    const patch = {};
    for (const key of Object.keys(s)) {
      if (!same(s[key], baseStyle[key])) patch[key] = s[key];
    }
    if (Object.keys(patch).length) textStyles[name] = patch;
  }

  const effectStyles = {};
  for (const [name, s] of Object.entries(editedDoc.effectStyles)) {
    if (!same(s, baseDoc.effectStyles[name])) effectStyles[name] = s;
  }

  return { variables, textStyles, effectStyles };
}

/** Quantos pontos a marca muda em relacao a base. */
export function countOverrides(overrides) {
  if (!overrides) return 0;
  return (
    Object.keys(overrides.variables ?? {}).length +
    Object.keys(overrides.textStyles ?? {}).length +
    Object.keys(overrides.effectStyles ?? {}).length
  );
}
