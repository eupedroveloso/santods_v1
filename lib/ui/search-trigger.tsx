"use client";

import type { ControlSize } from "./button";
import { Search } from "./icons";
import { Kbd } from "./kbd";
import { RADIUS_CONTROL } from "./radius";
import { useModKey } from "./use-mod-key";

const HEIGHT: Record<ControlSize, string> = {
  sm: "h-(--santo-dimension-size-32)",
  md: "h-(--santo-dimension-size-40)",
  lg: "h-(--santo-dimension-size-48)",
};

/**
 * Campo que nao e campo: parece busca e abre a busca de verdade (o ⌘K). Use
 * na sidebar e na topbar quando a busca vive num painel. O atalho mostrado
 * segue a plataforma (⌘ no Mac, Ctrl no resto). Sem `size`, tem a altura da
 * linha de navegação (size/36); com `size`, a mesma escala de Input e
 * IconButton, para dividir uma linha com eles.
 */
export function SearchTrigger({
  onClick,
  placeholder = "Buscar…",
  shortcut = "K",
  size,
  className = "",
}: {
  onClick: () => void;
  placeholder?: string;
  /** Tecla do atalho, junto do modificador. */
  shortcut?: string;
  size?: ControlSize;
  className?: string;
}) {
  const mod = useModKey();
  const height = size ? HEIGHT[size] : "h-(--santo-dimension-size-36)";
  return (
    <button
      type="button"
      onClick={onClick}
      aria-keyshortcuts={`${mod === "⌘" ? "Meta" : "Control"}+${shortcut}`}
      className={`santo-focus-field santo-body-small-regular flex ${height} w-full cursor-pointer items-center gap-xs ${RADIUS_CONTROL} border-thin border-border-default bg-input-default px-xs text-text-placeholder transition-colors ease-(--santo-motion-easing-standard) duration-(--santo-motion-duration-fast) hover:border-border-strong ${className}`}
    >
      <Search size={16} />
      <span className="flex-1 text-left">{placeholder}</span>
      <Kbd>
        {mod} {shortcut}
      </Kbd>
    </button>
  );
}
