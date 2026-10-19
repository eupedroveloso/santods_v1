/**
 * Script SOMENTE LEITURA para o MCP `use_figma` — inventario da pagina Icones.
 *
 * A pagina e uma biblioteca Font Awesome: ~4.8k component sets (variante
 * Weight = Light | Regular | Solid | Duotone, todas 16x16) no frame "ICones" e
 * ~600 componentes avulsos no frame "Brand" (logos, tamanho variavel).
 *
 * O retorno do MCP so chega como texto, entao o inventario vem compacto e em
 * blocos (CHUNK), cada um com hash FNV-1a para conferir a copia:
 *   - ids de set em delta (quase sempre +13/+14/+15), variantes por offset fixo;
 *   - nomes na ordem do documento.
 * Rode com CHUNK = 0, 1, 2... ate `done: true`. Grave cada retorno como
 * <dir>/inventory-<CHUNK>.json e rode: node scripts/figma-icons.mjs <dir>
 */
const CHUNK = 0;
const SIZE = 1200;

function fnv1a(str) {
  let h = 0x811c9dc5;
  for (let i = 0; i < str.length; i++) {
    h ^= str.charCodeAt(i);
    h = Math.imul(h, 0x01000193) >>> 0;
  }
  return h.toString(16).padStart(8, '0');
}
const num = (id) => id.split(':').map(Number);
/**
 * Ids como deltas em run-length, separados por virgula: `[38:9],e,f*2,e*41,...`.
 * `[a:b]` = id absoluto (inicio ou troca de prefixo); senao `<delta base36>[*repeticoes]`.
 * Run-length porque a copia manual de longas sequencias iguais erra; contagem nao.
 */
function encodeIds(ids) {
  const tokens = [];
  let prev = null;
  for (const id of ids) {
    const [a, b] = num(id);
    tokens.push(!prev || prev[0] !== a ? `[${id}]` : (b - prev[1]).toString(36));
    prev = [a, b];
  }
  const runs = [];
  for (const t of tokens) {
    const last = runs[runs.length - 1];
    if (last && last[0] === t && !t.startsWith('[')) last[1]++;
    else runs.push([t, 1]);
  }
  return runs.map(([t, n]) => (n > 1 ? `${t}*${n}` : t)).join(',');
}

const page = await figma.getNodeByIdAsync('38:2');
await figma.setCurrentPageAsync(page);
const sets = page.findAllWithCriteria({ types: ['COMPONENT_SET'] });
const brands = page
  .findAllWithCriteria({ types: ['COMPONENT'] })
  .filter((n) => !(n.parent && n.parent.type === 'COMPONENT_SET'));

const r2 = (n) => Math.round(n * 100) / 100;
let payload;
if (CHUNK === 0) {
  // Metadados + garantias estruturais que o lado Node assume.
  const first = sets[0];
  const variantOffsets = first.children.map((c) => num(c.id)[1] - num(first.id)[1]);
  const weights = first.children.map((c) => c.name.replace(/^Weight=/, ''));
  const broken = sets.filter(
    (s) =>
      s.children.map((c) => num(c.id)[1] - num(s.id)[1]).join() !== variantOffsets.join() ||
      s.children.map((c) => c.name.replace(/^Weight=/, '')).join() !== weights.join() ||
      s.children.some((c) => Math.round(c.width) !== 16 || Math.round(c.height) !== 16),
  );
  payload = {
    page: page.name,
    pageId: page.id,
    totalSets: sets.length,
    totalBrands: brands.length,
    chunks: Math.ceil(sets.length / SIZE) + 1,
    variantOffsets,
    weights,
    variantSize: [16, 16],
    irregularSets: broken.map((s) => [s.id, s.name]),
    brands: {
      ids: encodeIds(brands.map((b) => b.id)),
      names: brands.map((b) => b.name),
      sizes: brands.map((b) => [r2(b.width), r2(b.height)]),
    },
  };
} else {
  const slice = sets.slice((CHUNK - 1) * SIZE, CHUNK * SIZE);
  payload = {
    chunk: CHUNK,
    from: (CHUNK - 1) * SIZE,
    ids: encodeIds(slice.map((s) => s.id)),
    names: slice.map((s) => s.name),
    done: CHUNK * SIZE >= sets.length,
  };
}
return { ...payload, hash: fnv1a(JSON.stringify(payload)) };
