"use client";

import { useEffect, useSyncExternalStore } from "react";
import { Segmented, TabBar, TableOfContents, type TocItem } from "@/lib/ui";
import { DocHeader } from "../_docs/page-header";
import { VIEWS } from "./_views";

/*
 * A visualizacao ativa vive na hash (#financas, #cartoes…): link direto e
 * "voltar" funcionam. A ancora de um bloco (#cartoes-time) carrega o slug da
 * visualizacao, entao clicar no indice troca a aba e rola ate o bloco.
 */
const subscribe = (cb: () => void) => {
  window.addEventListener("hashchange", cb);
  return () => window.removeEventListener("hashchange", cb);
};
const readView = () => {
  const hash = window.location.hash.slice(1);
  return VIEWS.find((v) => hash === v.slug || hash.startsWith(`${v.slug}-`))?.slug ?? VIEWS[0].slug;
};

export function ExampleViews() {
  const slug = useSyncExternalStore(subscribe, readView, () => VIEWS[0].slug);
  const view = VIEWS.find((v) => v.slug === slug) ?? VIEWS[0];

  // Bloco de outra visualizacao: ele so existe depois da troca, entao a
  // rolagem acontece aqui.
  useEffect(() => {
    const id = window.location.hash.slice(1);
    if (id.includes("-")) document.getElementById(id)?.scrollIntoView();
  }, [slug]);

  const toc: TocItem[] = VIEWS.flatMap((v) => [
    { id: v.slug, href: `#${v.slug}`, label: v.label, level: 1 as const },
    ...(v.slug === slug ? v.blocks : []),
  ]);

  return (
    <>
      <DocHeader
        crumbs={[{ label: "Docs", href: "/" }, { label: "Exemplos" }, { label: view.label }]}
        title="Exemplos"
        divided
        actions={
          <div className="hidden md:block">
            <Segmented
              size="md"
              value={slug}
              onChange={(s) => {
                window.location.hash = s;
              }}
              options={VIEWS.map((v) => ({ value: v.slug, label: v.label }))}
            />
          </div>
        }
      />
      <div className="flex gap-xl">
        {/* pb no celular: a tab bar flutuante nao cobre o ultimo item. */}
        <section id={view.slug} className="flex min-w-0 flex-1 scroll-mt-6xl flex-col pb-6xl md:pb-0">
          <view.Component />
        </section>
        <aside className="hidden w-(--santo-dimension-space-224) shrink-0 xl:block">
          <div className="sticky top-[calc(var(--santo-dimension-size-56)+var(--santo-space-4xl))]">
            <TableOfContents items={toc} />
          </div>
        </aside>
      </div>

      {/* Celular: as visualizacoes viram tab bar flutuante no pe, acima da area segura. */}
      <div className="fixed inset-x-md bottom-[max(var(--santo-space-md),env(safe-area-inset-bottom))] z-(--santo-layer-sticky) md:hidden">
        <TabBar
          variant="floating"
          label="Visualizações"
          value={slug}
          onChange={(s) => {
            window.location.hash = s;
          }}
          options={VIEWS.map((v) => ({ value: v.slug, label: v.label, icon: v.icon }))}
        />
      </div>
    </>
  );
}
