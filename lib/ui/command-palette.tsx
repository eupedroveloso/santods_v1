"use client";

import { useEffect, useId, useMemo, useRef, useState } from "react";
import type { KeyboardEvent, ReactNode } from "react";
import { Search } from "./icons";
import { Card } from "./card";
import { Kbd } from "./kbd";
import { Nest } from "./nest";
import { useModal } from "./use-modal";

export type CommandItem = {
  id: string;
  label: string;
  /** Segunda linha exibida: caminho, var CSS, categoria. Tambem entra na busca. */
  hint?: string;
  /** Entra na busca mas nao aparece — para achar pelo nome da var sem mostrar subhead. */
  keywords?: string;
  /** Cabecalho do grupo. Itens do mesmo grupo aparecem juntos, na ordem dada. */
  group?: string;
  /** Marcador a esquerda: icone, amostra. */
  leading?: ReactNode;
  /** Selo a direita: Tag de tipo, contagem. Visual, nao texto corrido. */
  trailing?: ReactNode;
};

/** Sem acento e em minuscula — "botão" acha "botao" e vice-versa. */
const fold = (s: string) => s.normalize("NFD").replace(/\p{Diacritic}/gu, "").toLowerCase();

/** Acima disso a lista para de crescer: ninguem rola 400 resultados. */
const MAX_RESULTS = 60;

/**
 * Painel de busca que abre por cima da pagina (o "⌘K").
 *
 * Use quando ha muito destino para caber num menu — paginas, tokens,
 * componentes — e a pessoa sabe o nome do que procura. Filtra por nome e por
 * dica, ignorando acento. Teclado completo: setas, Enter, Esc. Quem abre e
 * quem escuta o atalho e a pagina; o painel so cuida da busca.
 */
export function CommandPalette(props: {
  open: boolean;
  onClose: () => void;
  items: CommandItem[];
  onSelect: (item: CommandItem) => void;
  placeholder?: string;
  /** Rotulo acessivel do dialogo. */
  label?: string;
}) {
  if (!props.open) return null;
  // Montado so quando abre: a busca recomeca vazia a cada abertura.
  return <Panel {...props} />;
}

function Panel({
  onClose,
  items,
  onSelect,
  placeholder = "Buscar…",
  label = "Buscar",
}: {
  onClose: () => void;
  items: CommandItem[];
  onSelect: (item: CommandItem) => void;
  placeholder?: string;
  label?: string;
}) {
  const [query, setQuery] = useState("");
  const [active, setActive] = useState(0);
  const dialogRef = useRef<HTMLDivElement>(null);
  const listId = useId();

  // Esc, foco preso no campo, scroll travado atras e foco devolvido ao fechar.
  useModal(dialogRef, onClose);

  const { results, total } = useMemo(() => {
    const terms = fold(query).split(/\s+/).filter(Boolean);
    if (!terms.length) return { results: items.slice(0, MAX_RESULTS), total: items.length };
    const scored: { item: CommandItem; score: number }[] = [];
    for (const item of items) {
      const label = fold(item.label);
      const haystack = `${label} ${fold(item.hint ?? "")} ${fold(item.keywords ?? "")}`;
      if (!terms.every((t) => haystack.includes(t))) continue;
      // Nome que comeca com a busca vem antes de nome que so a contem.
      const score = label.startsWith(terms[0]) ? 0 : label.includes(terms[0]) ? 1 : 2;
      scored.push({ item, score });
    }
    // sort e estavel: dentro do mesmo score, a ordem de entrada (e de grupo) se mantem.
    const sorted = scored.sort((a, b) => a.score - b.score);
    return { results: sorted.slice(0, MAX_RESULTS).map((s) => s.item), total: sorted.length };
  }, [items, query]);

  // Agrupa preservando a ordem em que cada grupo aparece pela primeira vez.
  const groups = useMemo(() => {
    const map = new Map<string, CommandItem[]>();
    for (const item of results) {
      const key = item.group ?? "";
      if (!map.has(key)) map.set(key, []);
      map.get(key)!.push(item);
    }
    return [...map.entries()];
  }, [results]);
  const ordered = groups.flatMap(([, list]) => list);

  const current = Math.min(active, Math.max(ordered.length - 1, 0));

  useEffect(() => {
    document
      .getElementById(listId)
      ?.querySelector<HTMLElement>(`[data-index="${current}"]`)
      ?.scrollIntoView({ block: "nearest" });
  }, [current, listId]);

  const onKeyDown = (e: KeyboardEvent) => {
    if (e.key === "ArrowDown") {
      e.preventDefault();
      setActive((i) => Math.min(i + 1, ordered.length - 1));
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setActive((i) => Math.max(i - 1, 0));
    } else if (e.key === "Enter") {
      e.preventDefault();
      const item = ordered[current];
      if (item) onSelect(item);
    }
  };

  let index = -1;

  return (
    <div
      className="santo-animate-fade-in fixed inset-0 z-(--santo-layer-modal) flex items-start justify-center bg-surface-overlay px-md pt-6xl"
      onMouseDown={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      {/* Borda dupla: busca e dicas na moldura, resultados no painel. */}
      <div
        ref={dialogRef}
        role="dialog"
        aria-modal="true"
        aria-label={label}
        onKeyDown={onKeyDown}
        className="santo-animate-scale-in flex w-full max-w-(--santo-dimension-container-sm) flex-col shadow-2xl"
      >
        <Card
          variant="double"
          padded={false}
          header={
            <div className="flex min-w-0 flex-1 items-center gap-xs">
              <span className="text-icon-tertiary">
                <Search size={16} />
              </span>
              <input
                autoFocus
                value={query}
                onChange={(e) => {
                  setQuery(e.target.value);
                  setActive(0);
                }}
                placeholder={placeholder}
                aria-label={label}
                role="combobox"
                aria-expanded="true"
                aria-controls={listId}
                aria-activedescendant={ordered[current] ? `${listId}-${current}` : undefined}
                // Sem anel: o painel modal inteiro ja e o contexto de foco.
                className="santo-body-small-regular h-(--santo-dimension-size-48) min-w-0 flex-1 bg-transparent text-text-primary outline-none placeholder:text-text-placeholder"
              />
              <Kbd>esc</Kbd>
            </div>
          }
          footer={
            <div className="santo-caption-regular flex min-w-0 flex-1 items-center gap-md text-text-tertiary">
              <span className="flex items-center gap-2xs">
                <Kbd>↑</Kbd>
                <Kbd>↓</Kbd> navegar
              </span>
              <span className="flex items-center gap-2xs">
                <Kbd>↵</Kbd> abrir
              </span>
              {total > ordered.length && (
                <span className="ml-auto tabular-nums">
                  {ordered.length} de {total} — refine a busca
                </span>
              )}
            </div>
          }
        >
        {ordered.length === 0 && (
          <p role="status" className="santo-body-small-regular px-sm py-xl text-center text-text-tertiary">
            Nada encontrado para “{query}”.
          </p>
        )}
        {/* Aninhamento: recuo sm nos quatro lados. Nas laterais, 2xs + a calha da
            barra reservada nos dois lados (space/8) = sm; em cima e embaixo, sm. */}
        <Nest
          id={listId}
          role="listbox"
          aria-label="Resultados"
          inset="sm"
          className={`max-h-(--santo-dimension-space-384) overflow-y-auto ${ordered.length ? "flex" : "hidden"}`}
          style={{ gap: "var(--santo-space-2xs)", paddingInline: "var(--santo-space-2xs)", scrollbarGutter: "stable both-edges" }}
        >
          {groups.map(([group, list]) => (
            <div key={group} role="group" aria-label={group || undefined} className="flex flex-col">
              {group && (
                <span className="santo-caption-medium px-sm pt-xs pb-3xs text-text-tertiary">{group}</span>
              )}
              {list.map((item) => {
                index += 1;
                const i = index;
                const isActive = i === current;
                return (
                  <div
                    key={item.id}
                    id={`${listId}-${i}`}
                    data-index={i}
                    role="option"
                    aria-selected={isActive}
                    onMouseMove={() => setActive(i)}
                    onClick={() => onSelect(item)}
                    className={`santo-row flex cursor-pointer items-center gap-xs px-sm py-xs ${
                      isActive ? "bg-neutral-subtle-default" : ""
                    }`}
                  >
                    {item.leading && <span className="shrink-0 text-icon-secondary">{item.leading}</span>}
                    <span className="flex min-w-0 flex-1 flex-col">
                      <span className="santo-body-small-medium truncate text-text-primary">{item.label}</span>
                      {item.hint && (
                        <span className="santo-caption-regular truncate text-text-tertiary">{item.hint}</span>
                      )}
                    </span>
                    {item.trailing && <span className="shrink-0">{item.trailing}</span>}
                  </div>
                );
              })}
            </div>
          ))}
        </Nest>

        </Card>
      </div>
    </div>
  );
}
