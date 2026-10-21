import type { EstiloId } from "./estilos";
import type { Estilo, Sistema } from "./schema";

/**
 * Chamadas do navegador aos Route Handlers de app/estudio/api. Datas chegam
 * como string ISO (JSON); quem precisa de Date converte.
 */

export type SistemaJson = Omit<Sistema, "criadoEm" | "atualizadoEm"> & { criadoEm: string; atualizadoEm: string };
export type EstiloJson = Omit<Estilo, "atualizadoEm"> & { atualizadoEm: string };
export type SistemaComEstilosJson = SistemaJson & { estilos: EstiloJson[] };

const API = "/estudio/api/sistemas";

/** Erro da API; `problems` vem quando a validação do modo de marca recusa (422). */
export class EstudioErro extends Error {
  constructor(
    message: string,
    readonly problems: string[] = [],
  ) {
    super(message);
  }
}

async function pedir<T>(url: string, init?: RequestInit): Promise<T> {
  const res = await fetch(url, {
    ...init,
    headers: init?.body ? { "Content-Type": "application/json" } : undefined,
  });
  if (res.status === 204) return undefined as T;
  const json = await res.json().catch(() => ({}));
  if (!res.ok) throw new EstudioErro(json.error ?? "Não foi possível falar com o banco do Estúdio.", json.problems);
  return json as T;
}

export const estudioApi = {
  criar: (nome: string) => pedir<SistemaComEstilosJson>(API, { method: "POST", body: JSON.stringify({ nome }) }),
  renomear: (id: string, nome: string) =>
    pedir<SistemaComEstilosJson>(`${API}/${id}`, { method: "PATCH", body: JSON.stringify({ nome }) }),
  duplicar: (id: string) => pedir<SistemaComEstilosJson>(`${API}/${id}/duplicar`, { method: "POST" }),
  apagar: (id: string) => pedir<void>(`${API}/${id}`, { method: "DELETE" }),
  salvarEstilo: (id: string, estilo: EstiloId, dados: { base?: object; overrides?: object }) =>
    pedir<EstiloJson>(`${API}/${id}/estilos/${estilo}`, { method: "PUT", body: JSON.stringify(dados) }),
};
