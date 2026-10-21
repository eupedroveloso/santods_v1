import { corpo, responder } from "@/lib/estudio/http";
import { apagarSistema, obterSistema, renomearSistema, RepoError } from "@/lib/estudio/repo";

/** `id` aceita o id ou o slug. GET com os estilos; PATCH { nome } renomeia; DELETE apaga. */
export async function GET(_request: Request, ctx: RouteContext<"/estudio/api/sistemas/[id]">) {
  const { id } = await ctx.params;
  return responder(async () => {
    const sistema = await obterSistema(id);
    if (!sistema) throw new RepoError("Sistema não encontrado.", 404);
    return sistema;
  });
}

export async function PATCH(request: Request, ctx: RouteContext<"/estudio/api/sistemas/[id]">) {
  const { id } = await ctx.params;
  return responder(async () => renomearSistema(id, (await corpo(request)).nome));
}

export async function DELETE(_request: Request, ctx: RouteContext<"/estudio/api/sistemas/[id]">) {
  const { id } = await ctx.params;
  return responder(() => apagarSistema(id));
}
