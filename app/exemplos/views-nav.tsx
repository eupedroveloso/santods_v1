"use client";

import { useEffect, useSyncExternalStore } from "react";
import { VIEWS } from "./_views";

/*
 * A visualizacao ativa vive na hash (#dashboard, #landing): link direto e
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

  // Layout full (DocPage layout="full"): a tela roda como app, na area inteira.
  // Sem cabecalho, indice "Nesta pagina" nem tab bar: a troca de tela e pela
  // sidebar da doc (grupo Exemplos, gerado de VIEWS).
  return (
    <section
      id={view.slug}
      aria-label={`Exemplo: ${view.label}`}
      className={`flex min-w-0 flex-1 scroll-mt-6xl flex-col ${view.bleed ? "" : "p-md lg:p-xl"}`}
    >
      <view.Component />
    </section>
  );
}
