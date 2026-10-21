import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { connection } from "next/server";
import { estiloLabel, isEstilo } from "@/lib/estudio/estilos";
import { obterSistema } from "@/lib/estudio/repo";

type Props = PageProps<"/estudio/[sistema]/[estilo]">;

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { sistema, estilo } = await params;
  await connection();
  const atual = isEstilo(estilo) ? await obterSistema(decodeURIComponent(sistema)) : null;
  return { title: atual && isEstilo(estilo) ? `${estiloLabel(estilo)} · ${atual.nome} · Estúdio` : "Estúdio" };
}

/** O editor está no layout do sistema; a página só valida o estilo da rota. */
export default async function EstiloPage({ params }: Props) {
  const { estilo } = await params;
  if (!isEstilo(estilo)) notFound();
  return null;
}
