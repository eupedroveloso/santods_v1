import { RepoError } from "./repo";

/**
 * Resposta padrão dos Route Handlers do Estúdio: erro do repositório vira o
 * status dele com `{ error }`; o resto é 500 sem vazar detalhe.
 */
export async function responder(fn: () => Promise<unknown>, status = 200): Promise<Response> {
  try {
    const data = await fn();
    return data === undefined ? new Response(null, { status: 204 }) : Response.json(data, { status });
  } catch (error) {
    if (error instanceof RepoError) return Response.json(
        { error: error.message, ...(error.problems.length && { problems: error.problems }) },
        { status: error.status },
      );
    console.error("[estudio]", error);
    return Response.json({ error: "Falha ao acessar o banco do Estúdio." }, { status: 500 });
  }
}

/** Corpo JSON da requisição; corpo inválido vira 400. */
export async function corpo(request: Request): Promise<Record<string, unknown>> {
  try {
    const json = await request.json();
    if (typeof json === "object" && json !== null && !Array.isArray(json)) return json;
  } catch {}
  throw new RepoError("Corpo da requisição precisa ser um objeto JSON.", 400);
}
