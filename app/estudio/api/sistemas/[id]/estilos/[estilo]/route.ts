import { isEstilo } from "@/lib/estudio/estilos";
import { corpo, responder } from "@/lib/estudio/http";
import { obterSistema, RepoError, salvarEstilo } from "@/lib/estudio/repo";

type Ctx = RouteContext<"/estudio/api/sistemas/[id]/estilos/[estilo]">;

function estiloValido(estilo: string) {
  if (!isEstilo(estilo)) throw new RepoError(`Estilo desconhecido: ${estilo}.`, 404);
  return estilo;
}

/** GET o registro do estilo; PUT { base?, overrides? } grava (o que não vier fica). */
export async function GET(_request: Request, ctx: Ctx) {
  const { id, estilo } = await ctx.params;
  return responder(async () => {
    const valido = estiloValido(estilo);
    const sistema = await obterSistema(id);
    if (!sistema) throw new RepoError("Sistema não encontrado.", 404);
    return sistema.estilos.find((e) => e.estilo === valido) ?? { sistemaId: sistema.id, estilo: valido, base: {}, overrides: {} };
  });
}

export async function PUT(request: Request, ctx: Ctx) {
  const { id, estilo } = await ctx.params;
  return responder(async () => salvarEstilo(id, estiloValido(estilo), await corpo(request)));
}
