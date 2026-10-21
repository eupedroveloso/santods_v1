import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { connection } from "next/server";
import { ESCOPO, estudio, montarRascunho, vazio } from "@/lib/estudio/rascunho";
import { obterSistema } from "@/lib/estudio/repo";
import { AoVivo } from "../../_parts/ao-vivo";
import { Tela } from "../../_parts/telas";
import { isTela, TELAS } from "../../_parts/telas-dados";

type Props = PageProps<"/estudio/[sistema]/preview">;

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { sistema } = await params;
  await connection();
  const atual = await obterSistema(decodeURIComponent(sistema));
  return { title: atual ? `Preview · ${atual.nome} · Estúdio` : "Estúdio" };
}

/**
 * Tela cheia do preview: a tela pedida (?tela=amostra|dashboard|landing) na
 * página inteira, com o tema do site (o alternador da topbar vale aqui, sem
 * iframe). Vem com o rascunho SALVO (derivado no servidor) e, com o editor
 * aberto, acompanha o rascunho em edição ao vivo (AoVivo, BroadcastChannel).
 */
export default async function PreviewTelaCheia({ params, searchParams }: Props) {
  const { sistema } = await params;
  const { tela } = await searchParams;
  await connection();
  const atual = await obterSistema(decodeURIComponent(sistema));
  if (!atual) notFound();
  const registros = vazio();
  for (const e of atual.estilos) registros[e.estilo] = { base: e.base, overrides: e.overrides };
  const r = estudio.derivar(montarRascunho(atual, registros), { scope: ESCOPO });
  const escolhida = typeof tela === "string" && isTela(tela) ? tela : TELAS[1].id;

  return (
    <>
      {r.ok && <style id="estudio-rascunho">{r.css}</style>}
      {r.ok && r.fontes.map((f) => <link key={f.url} rel="stylesheet" href={f.url} precedence="default" />)}
      {/* Editor aberto: o rascunho em edição chega pelo canal e substitui o salvo, ao vivo. */}
      <AoVivo canal={`estudio:${atual.id}`} />
      <div data-brand="rascunho" className="flex min-h-[calc(100dvh-var(--santo-dimension-size-56))] flex-col bg-surface-page">
        <Tela tela={escolhida} />
      </div>
    </>
  );
}
