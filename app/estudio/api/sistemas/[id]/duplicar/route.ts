import { responder } from "@/lib/estudio/http";
import { duplicarSistema } from "@/lib/estudio/repo";

/** POST cria a cópia com todos os estilos. */
export async function POST(_request: Request, ctx: RouteContext<"/estudio/api/sistemas/[id]/duplicar">) {
  const { id } = await ctx.params;
  return responder(() => duplicarSistema(id), 201);
}
