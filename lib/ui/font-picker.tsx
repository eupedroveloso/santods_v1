"use client";

import { useCallback, useEffect, useId, useLayoutEffect, useMemo, useRef, useState, type CSSProperties } from "react";
import { Chip } from "./chip";
import { Check, ChevronDown, Search } from "./icons";
import { RADIUS_CONTROL } from "./radius";

export type FontFamilyOption = {
  family: string;
  /** Categoria do Google Fonts: sans, serif, display, handwriting, mono. */
  category: string;
};

export type FontCategoryOption = { value: string; label: string };

type Linha = { tipo: "grupo"; rotulo: string } | { tipo: "fonte"; opcao: FontFamilyOption; indice: number };

/** Pilha de reserva pela categoria: a opção não pula de largura enquanto a fonte chega. */
const RESERVA: Record<string, string> = {
  serif: "ui-serif, Georgia, serif",
  mono: "ui-monospace, SFMono-Regular, Menlo, monospace",
  handwriting: "cursive",
};
const pilha = (o: FontFamilyOption) => `"${o.family}", ${RESERVA[o.category] ?? "ui-sans-serif, system-ui, sans-serif"}`;

/** Folhas de preview já pedidas nesta página (cache de módulo: cada família vai ao Google uma vez). */
const pedidas = new Set<string>();
function carregar(href: string | null | undefined) {
  if (!href || pedidas.has(href) || typeof document === "undefined") return;
  pedidas.add(href);
  const link = document.createElement("link");
  link.rel = "stylesheet";
  link.href = href;
  document.head.appendChild(link);
}

/** Linhas que cabem além da área visível, para a rolagem não mostrar buraco. */
const FOLGA = 6;

/**
 * Seletor de família tipográfica para catálogo grande (o índice do Google
 * Fonts, ~1.800 famílias): busca, filtro por categoria, Curadoria no topo e
 * lista VIRTUAL (só as linhas visíveis existem no DOM). Cada opção aparece na
 * própria fonte, carregada sob demanda por `previewHref` (só o peso regular;
 * cada folha é pedida uma vez). Use no lugar do Select quando a lista passa
 * de algumas dezenas e a pessoa escolhe pelo desenho da letra.
 *
 * Teclado: setas, Home/End, Enter, Esc, Tab. Painel em position: fixed
 * (não é recortado por ancestral com overflow), como o Select.
 */
export function FontPicker({
  value,
  onChange,
  families,
  label,
  curated = [],
  categories,
  previewHref,
  size = "md",
  className = "",
}: {
  value: string;
  onChange: (family: string) => void;
  families: FontFamilyOption[];
  /** Rótulo acessível do gatilho e da lista. */
  label: string;
  /** Famílias destacadas no topo (Curadoria), na ordem dada. */
  curated?: string[];
  /** Filtro por categoria em Chips. Sem ele, não há filtro. */
  categories?: FontCategoryOption[];
  /** URL da folha de preview de uma família (só o peso regular). */
  previewHref?: (family: string) => string | null;
  size?: "sm" | "md" | "lg";
  className?: string;
}) {
  const [aberto, setAberto] = useState(false);
  const [busca, setBusca] = useState("");
  const [categoria, setCategoria] = useState("todas");
  const [ativo, setAtivo] = useState(0);
  const [lugar, setLugar] = useState<{ left: number; top: number; width: number; flip: boolean; altura: number } | null>(null);
  const [rolagem, setRolagem] = useState(0);
  const [alturaLinha, setAlturaLinha] = useState(0);
  const [alturaLista, setAlturaLista] = useState(0);

  const gatilho = useRef<HTMLButtonElement>(null);
  const painel = useRef<HTMLDivElement>(null);
  const lista = useRef<HTMLDivElement>(null);
  const campo = useRef<HTMLInputElement>(null);
  const medida = useRef<HTMLDivElement>(null);
  const listaId = useId();

  const porNome = useMemo(() => new Map(families.map((f) => [f.family, f])), [families]);
  const atual = porNome.get(value) ?? { family: value, category: "sans" };

  const montar = useCallback(
    (busca: string, categoria: string): Linha[] => {
      const q = busca.trim().toLowerCase();
      const passa = (f: FontFamilyOption) => (categoria === "todas" || f.category === categoria) && (!q || f.family.toLowerCase().includes(q));
      const destaque = curated.map((n) => porNome.get(n)).filter((f): f is FontFamilyOption => !!f && passa(f));
      const emDestaque = new Set(destaque.map((f) => f.family));
      const resto = families.filter((f) => passa(f) && !emDestaque.has(f.family));
      const out: Linha[] = [];
      let i = 0;
      if (destaque.length) {
        out.push({ tipo: "grupo", rotulo: "Curadoria" });
        for (const opcao of destaque) out.push({ tipo: "fonte", opcao, indice: i++ });
      }
      if (resto.length) {
        out.push({ tipo: "grupo", rotulo: destaque.length ? "Todas" : `${resto.length} famílias` });
        for (const opcao of resto) out.push({ tipo: "fonte", opcao, indice: i++ });
      }
      return out;
    },
    [curated, families, porNome],
  );
  const linhas = useMemo(() => montar(busca, categoria), [montar, busca, categoria]);
  const opcoes = useMemo(() => linhas.filter((l): l is Extract<Linha, { tipo: "fonte" }> => l.tipo === "fonte"), [linhas]);

  // A fonte da opção escolhida, para o gatilho aparecer nela.
  useEffect(() => carregar(previewHref?.(value)), [previewHref, value]);

  const medir = useCallback(() => {
    const r = gatilho.current?.getBoundingClientRect();
    if (!r) return;
    const folga = 4;
    const abaixo = window.innerHeight - r.bottom - folga * 2;
    const acima = r.top - folga * 2;
    const flip = abaixo < 320 && acima > abaixo;
    setLugar({ left: r.left, top: flip ? r.top - folga : r.bottom + folga, width: r.width, flip, altura: Math.min(440, flip ? acima : abaixo) });
  }, []);

  useLayoutEffect(() => {
    if (!aberto) return;
    medir();
    window.addEventListener("scroll", medir, true);
    window.addEventListener("resize", medir);
    return () => {
      window.removeEventListener("scroll", medir, true);
      window.removeEventListener("resize", medir);
    };
  }, [aberto, medir]);

  // Altura da linha vem do CSS (token), medida uma vez: a virtualização não chumba px.
  useLayoutEffect(() => {
    if (!aberto || !medida.current || !lista.current) return;
    setAlturaLinha(medida.current.getBoundingClientRect().height);
    setAlturaLista(lista.current.clientHeight);
  }, [aberto, lugar]);

  useEffect(() => {
    if (aberto) campo.current?.focus();
  }, [aberto]);

  useEffect(() => {
    if (!aberto) return;
    const fora = (e: MouseEvent) => {
      const alvo = e.target as Node;
      if (painel.current?.contains(alvo) || gatilho.current?.contains(alvo)) return;
      setAberto(false);
    };
    document.addEventListener("mousedown", fora);
    return () => document.removeEventListener("mousedown", fora);
  }, [aberto]);

  const visivel = useMemo(() => {
    if (!alturaLinha || !alturaLista) return { de: 0, ate: Math.min(linhas.length, 24) };
    const de = Math.max(0, Math.floor(rolagem / alturaLinha) - FOLGA);
    const ate = Math.min(linhas.length, Math.ceil((rolagem + alturaLista) / alturaLinha) + FOLGA);
    return { de, ate };
  }, [alturaLinha, alturaLista, linhas.length, rolagem]);

  // Pede a fonte só das opções que estão (quase) na tela.
  useEffect(() => {
    if (!aberto) return;
    for (const l of linhas.slice(visivel.de, visivel.ate)) if (l.tipo === "fonte") carregar(previewHref?.(l.opcao.family));
  }, [aberto, linhas, visivel, previewHref]);

  /** Leva a opção ativa para a vista (a linha pode nem existir no DOM). */
  const revelar = (indiceOpcao: number) => {
    const el = lista.current;
    const pos = linhas.findIndex((l) => l.tipo === "fonte" && l.indice === indiceOpcao);
    if (!el || pos < 0 || !alturaLinha) return;
    const topo = pos * alturaLinha;
    if (topo < el.scrollTop) el.scrollTop = topo;
    else if (topo + alturaLinha > el.scrollTop + el.clientHeight) el.scrollTop = topo + alturaLinha - el.clientHeight;
    // A janela virtual segue a rolagem feita por código (o evento scroll pode não vir).
    setRolagem(el.scrollTop);
  };

  /** Abre com a lista inteira e a escolha atual ativa. */
  const abrir = () => {
    const inteira = montar("", "todas");
    const atualNaLista = inteira.find((l) => l.tipo === "fonte" && l.opcao.family === value);
    setBusca("");
    setCategoria("todas");
    setRolagem(0);
    setAtivo(atualNaLista?.tipo === "fonte" ? atualNaLista.indice : 0);
    setAberto(true);
  };

  // Ao abrir (e com a altura da linha medida), a escolha atual vem para a vista. Só DOM.
  useLayoutEffect(() => {
    if (aberto && alturaLinha) revelar(ativo);
    // só na abertura: depois, quem rola é o teclado (mover) e a pessoa
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [aberto, alturaLinha]);

  const escolher = (family: string) => {
    onChange(family);
    setAberto(false);
    gatilho.current?.focus();
  };

  const mover = (para: number) => {
    if (!opcoes.length) return;
    const i = Math.max(0, Math.min(opcoes.length - 1, para));
    setAtivo(i);
    revelar(i);
  };

  const teclado = (e: React.KeyboardEvent) => {
    if (!aberto) {
      if (["ArrowDown", "ArrowUp", "Enter", " "].includes(e.key)) {
        e.preventDefault();
        abrir();
      }
      return;
    }
    const passo: Record<string, () => void> = {
      ArrowDown: () => mover(ativo + 1),
      ArrowUp: () => mover(ativo - 1),
      Home: () => mover(0),
      End: () => mover(opcoes.length - 1),
      PageDown: () => mover(ativo + 8),
      PageUp: () => mover(ativo - 8),
      Enter: () => opcoes[ativo] && escolher(opcoes[ativo].opcao.family),
      Escape: () => setAberto(false),
    };
    if (e.key === "Tab") return setAberto(false);
    if (passo[e.key]) {
      e.preventDefault();
      passo[e.key]();
    }
  };

  const ALTURA = { sm: "h-(--santo-control-height-sm)", md: "h-(--santo-control-height-md)", lg: "h-(--santo-control-height-lg)" }[size];

  return (
    <span className={`relative inline-flex min-w-0 ${className}`}>
      <button
        ref={gatilho}
        type="button"
        role="combobox"
        aria-expanded={aberto}
        aria-controls={aberto ? listaId : undefined}
        aria-haspopup="listbox"
        aria-label={label}
        onClick={() => (aberto ? setAberto(false) : abrir())}
        onKeyDown={teclado}
        className={`santo-focus-field relative flex w-full min-w-0 cursor-pointer items-center gap-2xs border-thin bg-surface-sunken px-sm pr-2xl text-left text-text-primary santo-transition-colors hover:bg-neutral-subtle-default ${ALTURA} ${RADIUS_CONTROL} ${
          aberto ? "border-border-brand" : "border-transparent"
        }`}
      >
        <span className="santo-body-small-regular min-w-0 flex-1 truncate" style={{ fontFamily: pilha(atual) }}>
          {value}
        </span>
        <span
          className="pointer-events-none absolute right-xs text-text-tertiary transition-transform ease-(--santo-motion-easing-standard) duration-(--santo-motion-duration-fast)"
          style={{ transform: aberto ? "rotate(180deg)" : undefined }}
        >
          <ChevronDown size={16} />
        </span>
      </button>

      {aberto && lugar && (
        <div
          ref={painel}
          className="santo-animate-scale-in fixed z-(--santo-layer-dropdown) flex flex-col overflow-hidden rounded-lg border-thin border-border-subtle bg-surface-raised shadow-lg"
          style={
            {
              // Raio aninhado das opções: painel lg − p-3xs da lista − borda.
              "--santo-card-inner-radius":
                "max(var(--santo-radius-xs), calc(var(--santo-radius-lg) - var(--santo-space-3xs) - var(--santo-border-thin)))",
              left: lugar.left,
              top: lugar.top,
              width: `max(${lugar.width}px, var(--santo-dimension-space-288))`,
              maxHeight: lugar.altura,
              transform: lugar.flip ? "translateY(-100%)" : undefined,
            } as CSSProperties
          }
        >
          <div className="relative flex shrink-0 items-center border-b-thin border-border-subtle">
            <span className="pointer-events-none absolute left-sm text-text-tertiary">
              <Search size={16} />
            </span>
            <input
              ref={campo}
              value={busca}
              onChange={(e) => {
                setBusca(e.target.value);
                setAtivo(0);
                if (lista.current) lista.current.scrollTop = 0;
              }}
              onKeyDown={teclado}
              placeholder="Buscar família…"
              aria-label={`Buscar em ${label}`}
              aria-controls={listaId}
              aria-activedescendant={opcoes[ativo] ? `${listaId}-${ativo}` : undefined}
              className="santo-caption-regular h-(--santo-dimension-size-40) w-full bg-transparent pr-sm pl-3xl text-text-primary placeholder:text-text-placeholder focus-visible:outline-none"
            />
          </div>
          {categories && categories.length > 1 && (
            <div role="group" aria-label="Categoria" className="flex shrink-0 flex-wrap gap-3xs border-b-thin border-border-subtle p-2xs">
              {[{ value: "todas", label: "Todas" }, ...categories].map((c) => (
                <Chip
                  key={c.value}
                  active={c.value === categoria}
                  onClick={() => {
                    setCategoria(c.value);
                    setAtivo(0);
                    if (lista.current) lista.current.scrollTop = 0;
                  }}
                >
                  {c.label}
                </Chip>
              ))}
            </div>
          )}
          <div
            ref={lista}
            id={listaId}
            role="listbox"
            aria-label={label}
            onScroll={(e) => setRolagem(e.currentTarget.scrollTop)}
            className="relative min-h-0 flex-1 overflow-x-hidden overflow-y-auto p-3xs"
          >
            {/* Régua invisível: a altura de UMA linha, em token, para a virtualização. */}
            <div ref={medida} aria-hidden className="invisible absolute flex h-(--santo-dimension-size-36) w-full" />
            {linhas.length === 0 && <p className="santo-caption-regular px-sm py-xs text-text-tertiary">Nada encontrado.</p>}
            <div style={{ height: alturaLinha ? linhas.length * alturaLinha : undefined, position: "relative" }}>
              {linhas.slice(visivel.de, visivel.ate).map((l, k) => {
                const pos = visivel.de + k;
                const topo = alturaLinha ? pos * alturaLinha : undefined;
                if (l.tipo === "grupo")
                  return (
                    <span
                      key={`g-${l.rotulo}`}
                      className="santo-caption-small-semibold absolute inset-x-0 flex h-(--santo-dimension-size-36) items-end px-xs pb-2xs tracking-wide text-text-tertiary uppercase"
                      style={{ top: topo }}
                    >
                      {l.rotulo}
                    </span>
                  );
                const escolhida = l.opcao.family === value;
                const emFoco = l.indice === ativo;
                return (
                  <div
                    key={l.opcao.family}
                    id={`${listaId}-${l.indice}`}
                    role="option"
                    aria-selected={escolhida}
                    aria-setsize={opcoes.length}
                    aria-posinset={l.indice + 1}
                    onClick={() => escolher(l.opcao.family)}
                    onMouseEnter={() => setAtivo(l.indice)}
                    className={`santo-row absolute inset-x-0 flex h-(--santo-dimension-size-36) cursor-pointer items-center gap-xs px-xs text-text-primary ${
                      emFoco ? "bg-neutral-subtle-hover" : ""
                    }`}
                    style={{ top: topo }}
                  >
                    <span className="santo-body-regular min-w-0 flex-1 truncate" style={{ fontFamily: pilha(l.opcao) }}>
                      {l.opcao.family}
                    </span>
                    <span className="santo-caption-small-regular shrink-0 text-text-tertiary">{l.opcao.category}</span>
                    <span className="w-(--santo-dimension-icon-16) shrink-0 text-icon-brand">{escolhida && <Check size={16} />}</span>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      )}
    </span>
  );
}
