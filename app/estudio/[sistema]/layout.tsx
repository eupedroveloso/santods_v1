import { notFound } from "next/navigation";
import { connection } from "next/server";
import { listEffectStyles, listTextStyles } from "@/lib/docs/catalog";
import { ESCOPO, estudio, montarRascunho, vazio } from "@/lib/estudio/rascunho";
import { listarSistemas, obterSistema } from "@/lib/estudio/repo";
import { Editor } from "../_parts/editor";

/**
 * O editor vive no layout do sistema: navegar entre estilos troca só o
 * segmento, e o rascunho (histórico, autosave) continua montado.
 */
export default async function SistemaLayout({ params, children }: LayoutProps<"/estudio/[sistema]">) {
  const { sistema } = await params;
  await connection();
  const [atual, todos] = await Promise.all([obterSistema(decodeURIComponent(sistema)), listarSistemas()]);
  if (!atual) notFound();
  const registros = vazio();
  for (const e of atual.estilos) registros[e.estilo] = { base: e.base, overrides: e.overrides };

  const ident = { id: atual.id, nome: atual.nome, slug: atual.slug };
  return (
    <>
      <Editor
        derivadoInicial={estudio.derivar(montarRascunho(ident, registros), { scope: ESCOPO })}
        key={atual.id}
        sistema={ident}
        sistemas={todos.map((s) => ({ nome: s.nome, slug: s.slug }))}
        registros={registros}
        estilosTexto={listTextStyles()}
        efeitos={listEffectStyles()}
      />
      {children}
    </>
  );
}
