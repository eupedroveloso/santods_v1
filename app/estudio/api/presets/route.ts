import { corpo, responder } from "@/lib/estudio/http";
import { criarPreset, listarPresets } from "@/lib/estudio/presets";

/** GET ?estilo=tipografia lista os presets próprios; POST { estilo, nome, dados } cria (valida, 422 se não passar). */
export async function GET(request: Request) {
  const estilo = new URL(request.url).searchParams.get("estilo") ?? undefined;
  return responder(async () => ({ presets: await listarPresets(estilo) }));
}

export async function POST(request: Request) {
  return responder(async () => criarPreset(await corpo(request)), 201);
}
