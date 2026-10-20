import type { Metadata } from "next";
import { listEffectStyles } from "@/lib/docs/catalog";
import { Card, CardGrid, CopyCode, Count, TableOfContents, Tag, TokenSample, type TocItem } from "@/lib/ui";
import { DocHeader, DocPage, SectionLabel } from "../../_docs/page-header";

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
                    <Card padding="md" className="flex-1">
                      <Card variant="well" className="h-(--santo-dimension-space-160) items-center justify-center">
                        {/* A sombra le a var do proprio estilo: estilo novo no Figma aparece sem mexer aqui. */}
                        <TokenSample variant="shadow" value={`var(${e.cssVar})`} />
                      </Card>
                      <div className="flex flex-1 flex-col gap-sm">
                        {/* Titulo + meta na mesma linha: nome e numero de camadas. */}
                        <span className="flex items-center justify-between gap-xs">
                          <span className="santo-body-large-semibold">{e.name}</span>
                          <Count>{e.layers.length}</Count>
                        </span>
                        <div className="flex min-w-0 flex-col items-start gap-2xs">
                          <CopyCode truncate value={e.cssVar} label={`Copiar ${e.cssVar}`} />
                          <CopyCode truncate value={e.tailwind} label={`Copiar classe ${e.tailwind}`} />
                        </div>
                        {e.layers.length === 0 ? (
                          <span className="santo-code-sm text-text-disabled">none</span>
                        ) : (
                          <ul className="flex flex-col gap-3xs">
                            {e.layers.map((l, i) => (
                              <li
                                key={i}
                                className={`santo-code-sm tabular-nums ${l.visible ? "text-text-secondary" : "text-text-disabled line-through"}`}
                                title={l.visible ? undefined : "Camada oculta no Figma"}
                              >
                                {l.type === "INNER_SHADOW" ? "inset " : ""}
                                {l.x}px {l.y}px {l.blur}px {l.spread}px {l.color}
                              </li>
                            ))}
                          </ul>
                        )}
                      </div>
                    </Card>
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
