"use client";

import { Search } from "./icons";
import { Kbd } from "./kbd";
import { useModKey } from "./use-mod-key";

/**
 * Campo que nao e campo: parece busca e abre a busca de verdade (o ⌘K). Use
 * na sidebar e na topbar quando a busca vive num painel. O atalho mostrado
 * segue a plataforma (⌘ no Mac, Ctrl no resto).
 */
export function SearchTrigger({
  onClick,
  placeholder = "Buscar…",
  shortcut = "K",
  className = "",
}: {
  onClick: () => void;
  placeholder?: string;
  /** Tecla do atalho, junto do modificador. */
  shortcut?: string;
  className?: string;
}) {
  const mod = useModKey();
  return (
    <button
      type="button"
      onClick={onClick}
      aria-keyshortcuts={`${mod === "⌘" ? "Meta" : "Control"}+${shortcut}`}
      className={`santo-focus-field santo-body-small-regular flex h-(--santo-dimension-size-36) w-full cursor-pointer items-center gap-xs rounded-md border-thin border-border-default bg-input-default px-xs text-text-placeholder transition-colors ease-(--santo-motion-easing-standard) duration-(--santo-motion-duration-fast) hover:border-border-strong ${className}`}
    >
      <Search size={16} />
      <span className="flex-1 text-left">{placeholder}</span>
      <Kbd>
        {mod} {shortcut}
      </Kbd>
    </button>
  );
}
