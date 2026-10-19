/**
 * Script SOMENTE LEITURA para o MCP `use_figma`.
 *
 * Inventaria os componentes de UMA pagina do Figma: cada component set e cada
 * componente avulso (variante dentro de set nao conta como componente proprio).
 * Uma pagina por chamada — trocar de pagina recarrega o arquivo — entao rode
 * uma vez por pagina, em paralelo, trocando PAGE_ID. A pagina `Icones` fica de
 * fora (biblioteca Font Awesome colada, ~24.5k nos, nao e componente do DS).
 *
 * Junte as saidas num array JSON e passe para:
 *   node scripts/figma-components.mjs <dump.json>
 */
const PAGE_ID = '__PAGE_ID__';

const page = await figma.getNodeByIdAsync(PAGE_ID);
await figma.setCurrentPageAsync(page);

const nodes = page.findAllWithCriteria({ types: ['COMPONENT', 'COMPONENT_SET'] });
const components = [];
for (const n of nodes) {
  if (n.type === 'COMPONENT' && n.parent && n.parent.type === 'COMPONENT_SET') continue;
  const defs = n.componentPropertyDefinitions;
  const variants = {};
  const properties = {};
  for (const [key, def] of Object.entries(defs)) {
    if (def.type === 'VARIANT') variants[key] = def.variantOptions;
    else properties[key.replace(/#[^#]*$/, '')] = def.type;
  }
  components.push({
    name: n.name,
    nodeId: n.id,
    type: n.type,
    page: page.name,
    description: n.description || '',
    variants,
    properties,
    variantCount: n.type === 'COMPONENT_SET' ? n.children.length : 1,
  });
}
return { page: page.name, pageId: page.id, components };
