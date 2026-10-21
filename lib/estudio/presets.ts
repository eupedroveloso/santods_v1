import { asc, eq } from "drizzle-orm";
import { PRESETS_FIXOS, validarPreset, validarPresetTipografia, type Preset as PresetContrato, type PresetTipografia } from "@/lib/tokens/estudio.mjs";
import { db } from "./db";
import { isEstilo, type EstiloId } from "./estilos";
import { doc, INDICE } from "./rascunho";
import { RepoError, slugify } from "./repo";
import { presets, type Preset } from "./schema";

/**
 * Presets próprios do Estúdio, de qualquer estilo (entidade genérica do
 * Compasso: { id, estilo, nome, dados }, dados = o pedaço do rascunho daquele
 * estilo + passos). Tipografia guarda o PresetTipografia inteiro em `dados`, e
 * o id dele é também o `id` dentro de `dados`.
 */

/** Ids dos fixos de todos os estilos: um próprio nunca usa um deles. */
const FIXOS = new Set(Object.values(PRESETS_FIXOS).flatMap((l) => l.map((p) => p.id)));

function nomeValido(nome: unknown) {
  const limpo = typeof nome === "string" ? nome.trim().replace(/\s+/g, " ") : "";
  if (!limpo) throw new RepoError("Dê um nome ao preset.", 400);
  if (limpo.length > 48) throw new RepoError("Nome com até 48 caracteres.", 400);
  return limpo;
}

function estiloValido(estilo: unknown): EstiloId {
  if (typeof estilo !== "string" || !isEstilo(estilo)) throw new RepoError("Estilo desconhecido.", 400);
  return estilo;
}

/** Tipografia: o validador do PresetTipografia; os outros: validarPreset (forma + a mesma validação do derivar). */
function validar(estilo: EstiloId, id: string, nome: string, dados: Record<string, unknown>) {
  const problems =
    estilo === "tipografia"
      ? validarPresetTipografia(dados as PresetTipografia, { indice: INDICE })
      : validarPreset(doc, { id, estilo, nome, dados } as PresetContrato, { indice: INDICE });
  if (problems.length) throw new RepoError("O preset não passa na validação.", 422, problems);
}

export async function listarPresets(estilo?: string): Promise<Preset[]> {
  const conn = await db();
  const q = conn.select().from(presets);
  return (estilo ? q.where(eq(presets.estilo, estiloValido(estilo))) : q).orderBy(asc(presets.criadoEm));
}

async function idLivre(nome: string) {
  const conn = await db();
  const usados = new Set((await conn.select({ id: presets.id }).from(presets)).map((p) => p.id));
  const slug = slugify(nome);
  const base = (slug.startsWith("meu-") ? slug : `meu-${slug}`).slice(0, 48);
  let id = base;
  for (let n = 2; usados.has(id) || FIXOS.has(id); n++) id = `${base}-${n}`;
  return id;
}

export async function criarPreset(corpo: Record<string, unknown>): Promise<Preset> {
  const conn = await db();
  const estilo = estiloValido(corpo.estilo);
  const nome = nomeValido(corpo.nome);
  if (typeof corpo.dados !== "object" || !corpo.dados) throw new RepoError("`dados` precisa ser o preset.", 400);
  const id = await idLivre(nome);
  const dados = estilo === "tipografia" ? { ...(corpo.dados as PresetTipografia), id, nome } : (corpo.dados as Record<string, unknown>);
  validar(estilo, id, nome, dados);
  await conn.insert(presets).values({ id, estilo, nome, dados, criadoEm: new Date() });
  return (await conn.select().from(presets).where(eq(presets.id, id)))[0];
}

async function exigir(id: string) {
  const conn = await db();
  const [p] = await conn.select().from(presets).where(eq(presets.id, id));
  if (!p) throw new RepoError("Preset não encontrado.", 404);
  return p;
}

/** Renomeia; o id fica (é o que os rascunhos que aplicaram o preset guardam). */
export async function renomearPreset(id: string, nome: unknown): Promise<Preset> {
  const conn = await db();
  const atual = await exigir(id);
  const valido = nomeValido(nome);
  const dados = atual.estilo === "tipografia" ? { ...(atual.dados as PresetTipografia), nome: valido } : atual.dados;
  await conn.update(presets).set({ nome: valido, dados }).where(eq(presets.id, id));
  return exigir(id);
}

export async function apagarPreset(id: string): Promise<void> {
  const conn = await db();
  await exigir(id);
  await conn.delete(presets).where(eq(presets.id, id));
}
