/** Chave do tema escolhido no localStorage. */
export const THEME_STORAGE_KEY = "santo-theme";

/**
 * Roda no <head>, antes da primeira pintura: aplica o tema salvo para a pagina
 * nao abrir no tema do sistema e trocar em seguida.
 */
export const THEME_SCRIPT = `try{var t=localStorage.getItem(${JSON.stringify(THEME_STORAGE_KEY)});if(t==="light"||t==="dark")document.documentElement.setAttribute("data-theme",t)}catch(e){}`;

/** Chave da marca escolhida no localStorage (id de brand/id). */
export const BRAND_STORAGE_KEY = "santo-brand";

/**
 * Roda no <head> junto do tema: aplica a marca salva (data-brand na raiz) antes
 * da primeira pintura. So aceita id simples; ausencia = marca padrao.
 */
export const BRAND_SCRIPT = `try{var b=localStorage.getItem(${JSON.stringify(BRAND_STORAGE_KEY)});if(b&&/^[a-z0-9-]+$/.test(b))document.documentElement.setAttribute("data-brand",b)}catch(e){}`;

/**
 * SO EM DESENVOLVIMENTO. O next dev serve o CSS sempre na mesma URL
 * (app_globals_*.css), e o WebKit (Safari, portal do Maestri) reaproveita a
 * folha antiga mesmo com no-store e reload — foi a causa dos "CSS velho" no
 * preview. Na carga, insere logo depois de cada folha de /_next/static uma
 * copia com ?v=<agora> (busca nova, vence na cascata). Mexer no href do
 * original nao serve: o React gerencia esses <link> e o recoloca. Quando o HMR
 * do Next troca uma folha, as copias saem, para nunca mascarar a atualizacao.
 */
export const DEV_CSS_REFRESH = `document.addEventListener("DOMContentLoaded",function(){var v=Date.now(),sel='link[rel="stylesheet"][href^="/_next/static/"]:not([data-dev-refresh])';document.querySelectorAll(sel).forEach(function(l){var c=l.cloneNode();c.setAttribute("data-dev-refresh","");c.removeAttribute("data-precedence");c.href=l.getAttribute("href").split("?")[0]+"?v="+v;l.after(c)});new MutationObserver(function(ms){var hmr=ms.some(function(m){return [].some.call(m.addedNodes,function(n){return n.matches&&n.matches(sel)})||(m.type==="attributes"&&m.target.matches&&m.target.matches(sel))});if(hmr)document.querySelectorAll("link[data-dev-refresh]").forEach(function(c){c.remove()})}).observe(document.head,{childList:true,subtree:true,attributes:true,attributeFilter:["href"]})})`;
