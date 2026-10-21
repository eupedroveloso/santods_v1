/**
 * Familias do Google Fonts para o Estudio: validacao contra o indice e URL css2.
 *
 * Modulo puro (browser e Node). O indice e lib/fonts/google-index.json, gerado por
 * scripts/google-fonts.mjs; quem chama passa o indice (o JSON tem ~120 KB e o
 * cliente decide se importa ou recebe do servidor).
 */

/** Os pesos que o sistema tem (type/weight/*: light..extrabold). Um papel so usa pesos daqui. */
export const PESOS_DO_SISTEMA = [300, 400, 500, 600, 700, 800];

/** Pesos que a familia oferece, ou a faixa [min, max] quando e variavel. */
export function pesosDa(indice, familia) {
  const f = indice.families[familia];
  if (!f) return null;
  return f.ax?.wght ? { faixa: f.ax.wght } : { lista: f.w ?? [] };
}

/** A familia tem esse peso? (variavel: dentro da faixa; estatica: na lista). */
export function temPeso(indice, familia, peso) {
  const p = pesosDa(indice, familia);
  if (!p) return false;
  return p.faixa ? peso >= p.faixa[0] && peso <= p.faixa[1] : p.lista.includes(peso);
}

/**
 * Problemas de uma familia num papel. `papel` 'mono' exige categoria mono.
 * Mensagens comecam com um codigo estavel entre colchetes.
 */
export function problemasDaFamilia(indice, familia, papel, pesos = []) {
  const f = indice.families[familia];
  if (!f) return [`[familia-fora-do-indice] ${papel}: "${familia}" nao esta no indice do Google Fonts`];
  const out = [];
  if (papel === 'mono' && f.c !== 'mono') out.push(`[mono-nao-monoespacada] mono: "${familia}" e ${f.c}, precisa ser mono`);
  for (const peso of pesos) {
    if (!PESOS_DO_SISTEMA.includes(peso)) out.push(`[peso-fora-do-sistema] ${papel}: ${peso} (use ${PESOS_DO_SISTEMA.join(', ')})`);
    else if (!temPeso(indice, familia, peso)) {
      const p = pesosDa(indice, familia);
      const tem = p.faixa ? `${p.faixa[0]}..${p.faixa[1]}` : p.lista.join(', ');
      out.push(`[peso-indisponivel] ${papel}: "${familia}" nao tem ${peso} (tem ${tem})`);
    }
  }
  return out;
}

/**
 * URL css2 de UMA familia com so os pesos pedidos e display=swap.
 * Uma familia por URL de proposito: um nome errado derruba so aquela folha.
 */
export function urlCss2(familia, pesos) {
  const nome = familia.replace(/ /g, '+');
  const lista = [...new Set(pesos)].sort((a, b) => a - b);
  return `https://fonts.googleapis.com/css2?family=${nome}:wght@${lista.join(';')}&display=swap`;
}

/**
 * Folhas a carregar: junta os papeis que usam a mesma familia (uniao dos pesos).
 * @param {{ corpo: string, titulo: string, mono: string }} familias
 * @param {{ corpo: number[], titulo: number[], mono: number[] }} pesos
 */
export function folhasDeFonte(familias, pesos) {
  const porFamilia = new Map();
  for (const papel of ['corpo', 'titulo', 'mono']) {
    const familia = familias[papel];
    const atual = porFamilia.get(familia) ?? { familia, papeis: [], pesos: new Set() };
    atual.papeis.push(papel);
    for (const p of pesos[papel] ?? []) atual.pesos.add(p);
    porFamilia.set(familia, atual);
  }
  return [...porFamilia.values()].map(({ familia, papeis, pesos: ps }) => {
    const lista = [...ps].sort((a, b) => a - b);
    return { familia, papeis, pesos: lista, url: urlCss2(familia, lista) };
  });
}
