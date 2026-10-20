import { readFileSync } from "node:fs";
import { join } from "node:path";

/**
 * Contexto do sistema (gerado por scripts/build-contexto.mjs em public/contexto),
 * lido no build. O arquivo e servido cru em /contexto/<arquivo> (download) e
 * lido em /contexto/<slug> (pagina): o slug e o nome sem extensao, para a rota
 * nao colidir com o arquivo publico.
 */
export type ContextDoc = {
  slug: string;
  arquivo: string;
  titulo: string;
  tamanho?: number;
  /** O .txt: o pacote com todos os documentos. */
  pacote: boolean;
  /** URL do arquivo cru (atributo download). */
  href: string;
  /** URL da pagina de leitura. */
  page: string;
};

const DIR = join(process.cwd(), "public/contexto");

type Entry = { arquivo: string; titulo: string; tamanho?: number };

/** Indice do contexto; vazio se ainda nao foi gerado. */
export function listContext(): ContextDoc[] {
  try {
    const entries = JSON.parse(readFileSync(join(DIR, "indice.json"), "utf8")) as Entry[];
    return entries.map((e) => {
      const slug = e.arquivo.replace(/\.[^.]+$/, "");
      return {
        slug,
        arquivo: e.arquivo,
        titulo: e.titulo,
        tamanho: e.tamanho,
        pacote: e.arquivo.endsWith(".txt"),
        href: `/contexto/${e.arquivo}`,
        page: `/contexto/${slug}`,
      };
    });
  } catch {
    return [];
  }
}

export function readContext(doc: ContextDoc) {
  return readFileSync(join(DIR, doc.arquivo), "utf8");
}
