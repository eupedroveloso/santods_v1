#!/usr/bin/env node
/**
 * Dump de componentes pela API REST do Figma — alternativa ao scripts/figma-components.js
 * (MCP use_figma) quando o OAuth do MCP nao esta disponivel. Mesmo formato de saida.
 *
 *   node --env-file=.env.local scripts/figma-components-rest.mjs <dump.json>
 *   node scripts/figma-components.mjs <dump.json>
 *
 * Le FIGMA_TOKEN e FIGMA_FILE_KEY do ambiente (NUNCA imprima o token). So le o Figma.
 * Como o script do MCP: cada component set e cada componente avulso (variante de set nao
 * conta), uma entrada por pagina, pagina Icones fora.
 */
import { writeFileSync } from 'node:fs';
import { resolve } from 'node:path';

const out = process.argv.slice(2).find((a) => !a.startsWith('--'));
const fail = (msg) => {
  console.error(msg);
  process.exit(1);
};
const { FIGMA_TOKEN: token, FIGMA_FILE_KEY: fileKey } = process.env;
if (!out) fail('Uso: node --env-file=.env.local scripts/figma-components-rest.mjs <dump.json>');
if (!token || !fileKey) fail('FIGMA_TOKEN e FIGMA_FILE_KEY precisam estar no ambiente (ex.: node --env-file=.env.local ...).');

const api = async (path) => {
  const res = await fetch(`https://api.figma.com/v1${path}`, { headers: { 'X-Figma-Token': token } });
  const body = await res.json().catch(() => ({}));
  if (!res.ok || body.err) fail(`Figma REST ${path.split('?')[0]}: HTTP ${res.status} ${body.err ?? body.message ?? ''}`.trim());
  return body;
};

const file = await api(`/files/${fileKey}?depth=1`);
const pages = file.document.children.filter((p) => p.name !== 'Icones');
const { nodes } = await api(`/files/${fileKey}/nodes?ids=${encodeURIComponent(pages.map((p) => p.id).join(','))}`);

const dumpPages = pages.map((p) => {
  const entry = nodes[p.id];
  const meta = { ...entry.components, ...entry.componentSets };
  const components = [];
  const walk = (n, parent) => {
    const own = n.type === 'COMPONENT_SET' || (n.type === 'COMPONENT' && parent?.type !== 'COMPONENT_SET');
    if (own) {
      const variants = {};
      const properties = {};
      for (const [key, def] of Object.entries(n.componentPropertyDefinitions ?? {})) {
        if (def.type === 'VARIANT') variants[key] = def.variantOptions;
        else properties[key.replace(/#[^#]*$/, '')] = def.type;
      }
      components.push({
        name: n.name,
        nodeId: n.id,
        type: n.type,
        page: p.name,
        description: meta[n.id]?.description ?? '',
        variants,
        properties,
        variantCount: n.type === 'COMPONENT_SET' ? n.children.length : 1,
      });
    }
    for (const c of n.children ?? []) walk(c, n);
  };
  walk(entry.document, null);
  return { page: p.name, pageId: p.id, components };
});

const dump = { fileKey, dumpedAt: new Date().toLocaleDateString('sv-SE'), source: 'REST', pages: dumpPages };
writeFileSync(resolve(process.cwd(), out), JSON.stringify(dump, null, 2) + '\n');
console.log(
  `${dumpPages.reduce((a, p) => a + p.components.length, 0)} componentes em ${dumpPages.length} paginas (Icones fora). ` +
    `Agora: node scripts/figma-components.mjs ${out}`,
);
