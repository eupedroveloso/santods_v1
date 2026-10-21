import { asc, eq, and } from "drizzle-orm";
import { db } from "./db";
import { ESTILO_IDS, type EstiloId } from "./estilos";
import { estudio, montarRascunho, vazio, type Registros } from "./rascunho";
import { estilos, sistemas, type Estilo, type Sistema } from "./schema";

/**
 * Repositório do Estúdio: a única porta para o banco. Route Handlers e páginas
 * chamam daqui; ninguém monta query fora deste arquivo.
 */

/**
 * Slugs que nunca viram sistema: ids de marca do DS e do preview (data-brand)
 * e segmentos fixos de /estudio (a rota estática venceria o sistema).
 */
export const SLUGS_RESERVADOS = new Set(["santo", "vtsd", "rascunho", "preview", "api"]);

export class RepoError extends Error {
  constructor(
    message: string,
    readonly status: 400 | 404 | 409 | 422,
    /** 422: o que a validação do modo de marca recusou (derivar().problems). */
    readonly problems: string[] = [],
  ) {
    super(message);
  }
}

/**
 * Deriva o modo de marca do sistema. Recusa (422) sem gravar nada quando a
 * validação do contrato falha: o banco só guarda `salvo` válido.
 */
function derivarSalvo(sistema: { nome: string; slug: string }, registros: Registros) {
  const r = estudio.derivar(montarRascunho(sistema, registros));
  if (!r.ok) throw new RepoError("O rascunho não passa na validação do modo de marca.", 422, r.problems);
  return r.salvo;
}

const registrosDe = (linhas: Pick<Estilo, "estilo" | "base" | "overrides">[]): Registros => {
  const r = vazio();
  for (const l of linhas) r[l.estilo] = { base: l.base, overrides: l.overrides };
  return r;
};

export type SistemaComEstilos = Sistema & { estilos: Estilo[] };

/** `Venda Todo Santo Dia` → `venda-todo-santo-dia`. */
export function slugify(nome: string) {
  return (
    nome
      .normalize("NFD")
      .replace(/[̀-ͯ]/g, "")
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/^-+|-+$/g, "")
      .slice(0, 48) || "sistema"
  );
}

function validarNome(nome: unknown): string {
  const limpo = typeof nome === "string" ? nome.trim().replace(/\s+/g, " ") : "";
  if (!limpo) throw new RepoError("Dê um nome ao sistema.", 400);
  if (limpo.length > 64) throw new RepoError("Nome com até 64 caracteres.", 400);
  return limpo;
}

/** Slug livre: reservado ou em uso ganha sufixo -2, -3… */
async function slugLivre(nome: string, ignorarId?: string) {
  const conn = await db();
  const base = slugify(nome);
  const usados = new Set(
    (await conn.select({ id: sistemas.id, slug: sistemas.slug }).from(sistemas))
      .filter((s) => s.id !== ignorarId)
      .map((s) => s.slug),
  );
  let slug = base;
  for (let n = 2; usados.has(slug) || SLUGS_RESERVADOS.has(slug); n++) slug = `${base}-${n}`;
  return slug;
}

export async function listarSistemas(): Promise<Sistema[]> {
  const conn = await db();
  return conn.select().from(sistemas).orderBy(asc(sistemas.nome));
}

export async function obterSistema(idOuSlug: string): Promise<SistemaComEstilos | null> {
  const conn = await db();
  const sistema =
    (await conn.query.sistemas.findFirst({ where: eq(sistemas.id, idOuSlug) })) ??
    (await conn.query.sistemas.findFirst({ where: eq(sistemas.slug, idOuSlug) }));
  if (!sistema) return null;
  const linhas = await conn.select().from(estilos).where(eq(estilos.sistemaId, sistema.id));
  // Na ordem da navegação, não na do banco.
  linhas.sort((a, b) => ESTILO_IDS.indexOf(a.estilo) - ESTILO_IDS.indexOf(b.estilo));
  return { ...sistema, estilos: linhas };
}

async function exigirSistema(id: string) {
  const sistema = await obterSistema(id);
  if (!sistema) throw new RepoError("Sistema não encontrado.", 404);
  return sistema;
}

/** Cria o sistema com um registro vazio por estilo: o formato completo existe desde o início. */
export async function criarSistema(
  nome: unknown,
  conteudo?: Pick<Estilo, "estilo" | "base" | "overrides">[],
): Promise<SistemaComEstilos> {
  const conn = await db();
  const valido = validarNome(nome);
  const agora = new Date();
  const id = crypto.randomUUID();
  const slug = await slugLivre(valido);
  const porEstilo = new Map(conteudo?.map((e) => [e.estilo, e]));
  const salvo = derivarSalvo({ nome: valido, slug }, registrosDe(conteudo ?? []));
  await conn.batch([
    conn.insert(sistemas).values({ id, nome: valido, slug, salvo, criadoEm: agora, atualizadoEm: agora }),
    conn.insert(estilos).values(
      ESTILO_IDS.map((estilo) => ({
        sistemaId: id,
        estilo,
        base: porEstilo.get(estilo)?.base ?? {},
        overrides: porEstilo.get(estilo)?.overrides ?? {},
        atualizadoEm: agora,
      })),
    ),
  ]);
  return exigirSistema(id);
}

export async function renomearSistema(id: string, nome: unknown): Promise<SistemaComEstilos> {
  const conn = await db();
  const atual = await exigirSistema(id);
  const valido = validarNome(nome);
  const slug = await slugLivre(valido, atual.id);
  // Nome e slug são o modo e o brand/id: a spec muda junto.
  const salvo = derivarSalvo({ nome: valido, slug }, registrosDe(atual.estilos));
  await conn.update(sistemas).set({ nome: valido, slug, salvo, atualizadoEm: new Date() }).where(eq(sistemas.id, atual.id));
  return exigirSistema(atual.id);
}

/** Cópia com todos os estilos; o nome ganha "(cópia)". */
export async function duplicarSistema(id: string): Promise<SistemaComEstilos> {
  const origem = await exigirSistema(id);
  return criarSistema(`${origem.nome} (cópia)`.slice(0, 64), origem.estilos);
}

export async function apagarSistema(id: string): Promise<void> {
  const conn = await db();
  const atual = await exigirSistema(id);
  // O cascade cobre; o delete explícito garante o mesmo resultado num banco sem foreign_keys.
  await conn.batch([
    conn.delete(estilos).where(eq(estilos.sistemaId, atual.id)),
    conn.delete(sistemas).where(eq(sistemas.id, atual.id)),
  ]);
}

const ehObjeto = (v: unknown): v is Record<string, unknown> =>
  typeof v === "object" && v !== null && !Array.isArray(v);

/** Grava base e/ou overrides de um estilo; o que não vier fica como está. */
export async function salvarEstilo(
  id: string,
  estilo: EstiloId,
  dados: { base?: unknown; overrides?: unknown },
): Promise<Estilo> {
  const conn = await db();
  const atual = await exigirSistema(id);
  if (dados.base !== undefined && !ehObjeto(dados.base)) throw new RepoError("`base` precisa ser um objeto.", 400);
  if (dados.overrides !== undefined && !ehObjeto(dados.overrides)) throw new RepoError("`overrides` precisa ser um objeto.", 400);
  const agora = new Date();
  const valores = {
    ...(dados.base !== undefined && { base: dados.base as Record<string, unknown> }),
    ...(dados.overrides !== undefined && { overrides: dados.overrides as Record<string, unknown> }),
    atualizadoEm: agora,
  };
  const registros = registrosDe(atual.estilos);
  registros[estilo] = { ...registros[estilo], ...valores };
  const salvo = derivarSalvo(atual, registros);
  await conn.batch([
    conn
      .insert(estilos)
      .values({ sistemaId: atual.id, estilo, base: {}, overrides: {}, ...valores })
      .onConflictDoUpdate({ target: [estilos.sistemaId, estilos.estilo], set: valores }),
    conn.update(sistemas).set({ salvo, atualizadoEm: agora }).where(eq(sistemas.id, atual.id)),
  ]);
  const [linha] = await conn
    .select()
    .from(estilos)
    .where(and(eq(estilos.sistemaId, atual.id), eq(estilos.estilo, estilo)));
  return linha;
}
