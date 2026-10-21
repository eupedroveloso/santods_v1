import type { Metadata } from "next";
import { listEffectStyles } from "@/lib/docs/catalog";
import { CardGrid, Count, TableOfContents, Tag, type TocItem } from "@/lib/ui";
import { DocHeader, DocPage, SectionLabel } from "../../_docs/page-header";
import { EffectCard } from "../_parts/effect-card";

export const metadata: Metadata = {
  title: "Efeitos · Estilos · SantoDS",
  description: "Os effect styles do Figma aplicados com a sombra correspondente.",
};

export default function EfeitosPage() {
  const effects = listEffectStyles();

  const toc: TocItem[] = effects.map((e) => ({ id: e.slug, label: e.name }));

  return (
    <DocPage>
      <DocHeader
        crumbs={[{ label: "Docs", href: "/" }, { label: "Estilos", href: "/estilos" }, { label: "Efeitos" }]}
        title="Efeitos"
        divided
        actions={
          <div className="flex flex-wrap items-center gap-2xs">
            <Tag>{effects.length} effect styles</Tag>
          </div>
        }
      />

      <div className="flex gap-xl">
        <div className="flex min-w-0 flex-1 flex-col gap-3xl">
          <section className="flex flex-col gap-sm">
            <span className="flex items-center gap-xs">
              <SectionLabel>Sombras</SectionLabel>
              <Count>{effects.length}</Count>
            </span>
            <CardGrid columns={{ sm: 2, lg: 3 }} gap="md">
              {effects.map((e) => {
                return (
                  <div key={e.slug} id={e.slug} className="flex scroll-mt-6xl flex-col">
                    <EffectCard effect={e} />
                  </div>
                );
              })}
            </CardGrid>
          </section>

        </div>
        <aside className="hidden w-(--santo-dimension-space-224) shrink-0 lg:block">
          <div className="sticky top-[calc(var(--santo-dimension-size-56)+var(--santo-space-4xl))]">
            <TableOfContents items={toc} />
          </div>
        </aside>
      </div>
    </DocPage>
  );
}
