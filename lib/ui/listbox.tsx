"use client";

import {
  useCallback,
  useEffect,
  useId,
  useLayoutEffect,
  useMemo,
  useRef,
  useState,
  type CSSProperties,
  type ReactNode,
} from "react";
import { Check, ChevronDown, Search } from "./icons";
import type { ControlSize } from "./button";
import { RADIUS_CONTROL } from "./radius";

/**
 * Seletor do SantoDS.
 *
 * Substitui o `<select>` nativo em todo lugar. O nativo abre o menu do sistema
 * operacional — que ignora tema, tipografia e densidade, e não consegue mostrar
 * cada opção com aparência própria. Num seletor de fontes isso é fatal: listar
 * 32 famílias todas na mesma fonte não ajuda ninguém a escolher.
 *
 * O painel é posicionado com `position: fixed` e coordenadas medidas do gatilho.
 * Não é firula: a sidebar do editor tem `overflow-y-auto`, e um painel `absolute`
 * seria recortado por ela.
 */

export type SelectOption<T extends string> = {
  value: T;
  label: string;
  /** Segunda linha, para desambiguar opções de nome parecido. */
  hint?: string;
  /** Cabeçalho de grupo. Opções com o mesmo valor ficam juntas, na ordem dada. */
  group?: string;
  disabled?: boolean;
  /** Aplicado ao rótulo — é assim que cada fonte aparece nela mesma. */
  labelStyle?: CSSProperties;
  /** Marcador à esquerda: amostra de cor, ícone. */
  leading?: ReactNode;
};

const TRIGGER_SIZES: Record<ControlSize, string> = {
  sm: "h-(--santo-control-height-sm) pl-xs pr-2xl santo-caption-regular",
  md: "h-(--santo-control-height-md) pl-sm pr-3xl santo-body-small-regular",
  lg: "h-(--santo-control-height-lg) pl-md pr-3xl santo-body-regular",
};

/** Acima disso o painel ganha campo de busca — rolar 300 itens não é opção. */
const SEARCH_THRESHOLD = 12;

type Placement = { left: number; top: number; width: number; maxHeight: number; flip: boolean };

export function Select<T extends string>({
  value,
  onChange,
  options,
  label,
  size = "md",
  variant = "well",
  mono,
  disabled,
  className = "",
  placeholder = "Selecione…",
  searchable,
}: {
  value: T;
  onChange: (value: T) => void;
  options: SelectOption<T>[];
  /** Rótulo acessível do gatilho. */
  label: string;
  size?: ControlSize;
  /** @deprecated Sem efeito: todo campo leva o raio de controle (principio 5 do Pedro). */
  pill?: boolean;
  /** Mesmo vocabulario do Input: `well` (poco, padrao) ou `outline`. */
  variant?: "well" | "outline";
  mono?: boolean;
  disabled?: boolean;
  className?: string;
  placeholder?: string;
  /** Força o campo de busca. Sem isso, aparece a partir de 12 opções. */
  searchable?: boolean;
}) {
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");
  const [activeIndex, setActiveIndex] = useState(0);
  const [placement, setPlacement] = useState<Placement | null>(null);

  const triggerRef = useRef<HTMLButtonElement>(null);
  const panelRef = useRef<HTMLDivElement>(null);
  const searchRef = useRef<HTMLInputElement>(null);
  const listboxId = useId();

  const withSearch = searchable ?? options.length > SEARCH_THRESHOLD;

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return options;
    return options.filter(
      (o) =>
        o.label.toLowerCase().includes(q) ||
        o.value.toLowerCase().includes(q) ||
        o.hint?.toLowerCase().includes(q),
    );
  }, [options, query]);

  const selected = options.find((o) => o.value === value);

  /** Mede o gatilho e decide se o painel abre para baixo ou para cima. */
  const measure = useCallback(() => {
    const el = triggerRef.current;
    if (!el) return;
    const r = el.getBoundingClientRect();
    const gap = 4;
    const below = window.innerHeight - r.bottom - gap * 2;
    const above = r.top - gap * 2;
    const flip = below < 200 && above > below;
    setPlacement({
      left: r.left,
      top: flip ? r.top - gap : r.bottom + gap,
      width: r.width,
      maxHeight: Math.max(160, Math.min(320, flip ? above : below)),
      flip,
    });
  }, []);

  useLayoutEffect(() => {
    if (!open) return;
    measure();
    // Segue o gatilho quando algum ancestral rola (capture pega scroll interno).
    window.addEventListener("scroll", measure, true);
    window.addEventListener("resize", measure);
    return () => {
      window.removeEventListener("scroll", measure, true);
      window.removeEventListener("resize", measure);
    };
  }, [open, measure]);

  // O campo de busca recebe o foco ao abrir. Só efeito de DOM, sem setState.
  useEffect(() => {
    if (open && withSearch) searchRef.current?.focus();
  }, [open, withSearch]);

  useEffect(() => {
    if (!open) return;
    const onPointerDown = (e: MouseEvent) => {
      const target = e.target as Node;
      if (panelRef.current?.contains(target) || triggerRef.current?.contains(target)) return;
      setOpen(false);
    };
    document.addEventListener("mousedown", onPointerDown);
    return () => document.removeEventListener("mousedown", onPointerDown);
  }, [open]);

  // Mantém a opção ativa visível durante a navegação por teclado.
  useEffect(() => {
    if (!open) return;
    panelRef.current
      ?.querySelector(`[data-index="${activeIndex}"]`)
      ?.scrollIntoView({ block: "nearest" });
  }, [activeIndex, open]);

  /** Abre já com a opção atual em foco, para a seta seguir de onde se está. */
  const openPanel = () => {
    const index = options.findIndex((o) => o.value === value);
    setActiveIndex(index >= 0 ? index : 0);
    setQuery("");
    setOpen(true);
  };

  const toggle = () => (open ? setOpen(false) : openPanel());

  const commit = (option: SelectOption<T>) => {
    if (option.disabled) return;
    onChange(option.value);
    setOpen(false);
    setQuery("");
    triggerRef.current?.focus();
  };

  const move = (delta: number) => {
    if (filtered.length === 0) return;
    let next = activeIndex;
    for (let i = 0; i < filtered.length; i++) {
      next = (next + delta + filtered.length) % filtered.length;
      if (!filtered[next].disabled) break;
    }
    setActiveIndex(next);
  };

  const onKeyDown = (e: React.KeyboardEvent) => {
    switch (e.key) {
      case "ArrowDown":
        e.preventDefault();
        if (!open) openPanel();
        else move(1);
        break;
      case "ArrowUp":
        e.preventDefault();
        if (!open) openPanel();
        else move(-1);
        break;
      case "Home":
        if (open) { e.preventDefault(); setActiveIndex(0); }
        break;
      case "End":
        if (open) { e.preventDefault(); setActiveIndex(filtered.length - 1); }
        break;
      case "Enter":
        if (open) {
          e.preventDefault();
          const option = filtered[activeIndex];
          if (option) commit(option);
        } else {
          e.preventDefault();
          openPanel();
        }
        break;
      case " ":
        if (!open) { e.preventDefault(); openPanel(); }
        break;
      case "Escape":
        if (open) { e.preventDefault(); setOpen(false); setQuery(""); }
        break;
      case "Tab":
        if (open) setOpen(false);
        break;
    }
  };

  // Agrupa preservando a ordem de chegada dos grupos.
  const groups = useMemo(() => {
    const out: { name: string | undefined; items: { option: SelectOption<T>; index: number }[] }[] = [];
    filtered.forEach((option, index) => {
      const last = out[out.length - 1];
      if (last && last.name === option.group) last.items.push({ option, index });
      else out.push({ name: option.group, items: [{ option, index }] });
    });
    return out;
  }, [filtered]);

  return (
    <span className={`relative inline-flex min-w-0 ${className}`}>
      <button
        ref={triggerRef}
        type="button"
        role="combobox"
        aria-expanded={open}
        aria-controls={open ? listboxId : undefined}
        aria-haspopup="listbox"
        aria-label={label}
        disabled={disabled}
        onClick={toggle}
        onKeyDown={onKeyDown}
        className={`santo-focus-field relative flex w-full min-w-0 cursor-pointer items-center gap-2xs border-thin text-left text-text-primary santo-transition-colors disabled:cursor-not-allowed disabled:border-border-disabled disabled:bg-input-disabled disabled:text-text-disabled ${TRIGGER_SIZES[size]} ${
          RADIUS_CONTROL
        } ${
          variant === "well"
            ? `bg-surface-sunken hover:bg-neutral-subtle-default ${open ? "border-border-brand" : "border-transparent"}`
            : `bg-input-default hover:border-border-strong ${open ? "border-border-brand" : "border-border-default"}`
        }`}
      >
        {selected?.leading}
        <span
          className={`min-w-0 flex-1 truncate ${mono ? "font-mono" : ""} ${selected ? "" : "text-text-placeholder"}`}
          style={selected?.labelStyle}
        >
          {selected?.label ?? placeholder}
        </span>
        <span
          className="pointer-events-none absolute right-xs text-text-tertiary transition-transform ease-(--santo-motion-easing-standard) duration-(--santo-motion-duration-fast)"
          style={{ transform: open ? "rotate(180deg)" : undefined }}
        >
          <ChevronDown size={16} />
        </span>
      </button>

      {open && placement && (
        <div
          ref={panelRef}
          className="santo-animate-scale-in fixed z-(--santo-layer-dropdown) flex flex-col overflow-hidden rounded-lg border-thin border-border-subtle bg-surface-raised shadow-lg"
          style={{
            // Raio aninhado das opcoes: painel lg - p-3xs da lista - borda.
            ["--santo-card-inner-radius" as string]:
              "max(var(--santo-radius-xs), calc(var(--santo-radius-lg) - var(--santo-space-3xs) - var(--santo-border-thin)))",
            left: placement.left,
            top: placement.top,
            width: placement.width,
            maxHeight: placement.maxHeight,
            transform: placement.flip ? "translateY(-100%)" : undefined,
          }}
        >
          {withSearch && (
            <div className="relative flex shrink-0 items-center border-b-thin border-border-subtle">
              <span className="pointer-events-none absolute left-sm text-text-tertiary">
                <Search size={16} />
              </span>
              <input
                ref={searchRef}
                value={query}
                onChange={(e) => {
                  setQuery(e.target.value);
                  setActiveIndex(0);
                }}
                onKeyDown={onKeyDown}
                placeholder="Buscar…"
                aria-label={`Buscar em ${label}`}
                className="santo-caption-regular h-(--santo-dimension-size-40) w-full bg-transparent pr-sm pl-3xl text-text-primary placeholder:text-text-placeholder focus-visible:outline-none"
              />
            </div>
          )}

          <div
            id={listboxId}
            role="listbox"
            aria-label={label}
            className="min-h-0 flex-1 overflow-y-auto p-3xs"
          >
            {filtered.length === 0 && (
              <p className="santo-caption-regular px-sm py-xs text-text-tertiary">
                Nada encontrado.
              </p>
            )}

            {groups.map((group, gi) => (
              <div key={group.name ?? `g${gi}`} className="flex flex-col">
                {group.name && (
                  <span className="santo-caption-small-semibold px-xs pt-2xs pb-3xs tracking-wide text-text-tertiary uppercase">
                    {group.name}
                  </span>
                )}
                {group.items.map(({ option, index }) => {
                  const isSelected = option.value === value;
                  const isActive = index === activeIndex;
                  return (
                    <div
                      key={option.value}
                      role="option"
                      data-index={index}
                      aria-selected={isSelected}
                      aria-disabled={option.disabled}
                      onClick={() => commit(option)}
                      onMouseEnter={() => setActiveIndex(index)}
                      className={`santo-row flex cursor-pointer items-center gap-xs px-xs py-2xs ${
                        option.disabled
                          ? "cursor-not-allowed text-text-disabled"
                          : isActive
                            ? "bg-neutral-subtle-hover text-text-primary"
                            : "text-text-primary"
                      }`}
                    >
                      {option.leading}
                      <span className="flex min-w-0 flex-1 flex-col">
                        <span
                          className={`santo-body-small-regular truncate ${mono ? "font-mono" : ""}`}
                          style={option.labelStyle}
                        >
                          {option.label}
                        </span>
                        {option.hint && (
                          <span className="santo-caption-small-regular truncate text-text-tertiary">
                            {option.hint}
                          </span>
                        )}
                      </span>
                      <span className="w-(--santo-dimension-icon-16) shrink-0 text-icon-brand">
                        {isSelected && <Check size={16} />}
                      </span>
                    </div>
                  );
                })}
              </div>
            ))}
          </div>
        </div>
      )}
    </span>
  );
}
