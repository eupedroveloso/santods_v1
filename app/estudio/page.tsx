import type { Metadata } from "next";
import { connection } from "next/server";
import { listarSistemas } from "@/lib/estudio/repo";
import { Count } from "@/lib/ui";
import { DocHeader, DocPage } from "../_docs/page-header";
import { SistemasPainel } from "./_parts/sistemas";

export const metadata: Metadata = {
  title: "Estúdio",
  description: "Monte um Design System sobre a base do SantoDS e salve no banco.",
};

export default async function EstudioPage() {
  // Lista vem do banco a cada visita: sem prerender no build.
  await connection();
  const sistemas = await listarSistemas();

  return (
    <DocPage>
      <DocHeader
        crumbs={[{ label: "Docs", href: "/" }, { label: "Estúdio" }]}
        title="Estúdio"
        divided
        actions={<Count>{sistemas.length}</Count>}
      />
      <SistemasPainel
        sistemas={sistemas.map((s) => ({ id: s.id, nome: s.nome, slug: s.slug, atualizadoEm: s.atualizadoEm.toISOString() }))}
      />
    </DocPage>
  );
}
