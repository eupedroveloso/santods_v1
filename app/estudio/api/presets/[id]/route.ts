import { corpo, responder } from "@/lib/estudio/http";
import { apagarPreset, renomearPreset } from "@/lib/estudio/presets";

/** PATCH { nome } renomeia; DELETE apaga. */
export async function PATCH(request: Request, ctx: RouteContext<"/estudio/api/presets/[id]">) {
  const { id } = await ctx.params;
  return responder(async () => renomearPreset(id, (await corpo(request)).nome));
}

export async function DELETE(_request: Request, ctx: RouteContext<"/estudio/api/presets/[id]">) {
  const { id } = await ctx.params;
  return responder(() => apagarPreset(id));
}
