"use client";

import { useEffect, useSyncExternalStore } from "react";
import { VIEWS } from "./_views";
import { canonicalExampleHash } from "./_anchors";

/*
 * A visualizacao ativa vive na hash (#dashboard, #landing): link direto e
 * "voltar" funcionam. A ancora de um bloco (#cartoes-time) carrega o slug da
 * visualizacao, entao clicar no indice troca a aba e rola ate o bloco.
 */
const subscribe = (cb: () => void) => {
  window.addEventListener("hashchange", cb);
  window.addEventListener("popstate", cb);
  return () => {
    window.removeEventListener("hashchange", cb);
    window.removeEventListener("popstate", cb);
  };
};
const readHash = () => window.location.hash.slice(1);

export function ExampleViews() {
  const hash = useSyncExternalStore(subscribe, readHash, () => "");
  const id = canonicalExampleHash(hash);
  const view = VIEWS.find((v) => id === v.slug || id.startsWith(`${v.slug}-`)) ?? VIEWS[0];

  // Next Link pode usar pushState para uma hash sem emitir hashchange.
  // Dentro desta página, use a navegação nativa de fragmento, que notifica
  // os dois stores (visualização e sidebar) e mantém Voltar/Avançar.
  useEffect(() => {
    const followFragment = (event: MouseEvent) => {
      if (event.defaultPrevented || event.button !== 0 || event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return;
      const link = event.target instanceof Element ? event.target.closest<HTMLAnchorElement>("a[href]") : null;
      if (!link || link.hasAttribute("download") || (link.target && link.target !== "_self")) return;
      const destination = new URL(link.href, window.location.href);
      if (!destination.hash || destination.origin !== window.location.origin || destination.pathname !== window.location.pathname || destination.search !== window.location.search) return;
      event.preventDefault();
      if (window.location.hash === destination.hash) {
        document.getElementById(canonicalExampleHash(destination.hash.slice(1)))?.scrollIntoView();
      } else {
        window.location.hash = destination.hash;
      }
    };
    document.addEventListener("click", followFragment, true);
    return () => document.removeEventListener("click", followFragment, true);
  }, []);

  // O destino só existe após a troca de tela. Resolva também aliases dentro
  // da mesma tela, sem inserir uma entrada extra no histórico do navegador.
  useEffect(() => {
    if (!id) return;
    if (hash !== id) {
      window.history.replaceState(window.history.state, "", `#${id}`);
    }
    // Ao entrar por outra rota, o shell permanece montado e o Next pode
    // atualizar o fragmento sem evento nativo. Sincronize também a sidebar.
    window.dispatchEvent(new HashChangeEvent("hashchange"));
    document.getElementById(id)?.scrollIntoView();
  }, [hash, id]);

  // Layout full (DocPage layout="full"): a tela roda como app, na area inteira.
  // Sem cabecalho, indice "Nesta pagina" nem tab bar: a troca de tela e pela
  // sidebar ou busca da doc (destinos gerados de VIEWS).
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
