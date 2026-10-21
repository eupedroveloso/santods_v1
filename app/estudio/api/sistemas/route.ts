import { corpo, responder } from "@/lib/estudio/http";
import { criarSistema, listarSistemas } from "@/lib/estudio/repo";

/** GET lista os sistemas; POST { nome } cria um com os seis estilos vazios. */
export async function GET() {
  return responder(async () => ({ sistemas: await listarSistemas() }));
}

export async function POST(request: Request) {
  return responder(async () => criarSistema((await corpo(request)).nome), 201);
}
