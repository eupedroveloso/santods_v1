"use client";

import { useState } from "react";
import { Input } from "./input";
import { IconButton } from "./button";
import { ColorPicker } from "./color-picker";
import { Select } from "./listbox";
import { Icon } from "./index-icons";

/**
 * Controles de cor do editor de tokens.
 *
 * Anatomia da linha: amostra, rotulo de largura fixa, campo e acoes. A largura
 * fixa do rotulo e o que faz uma coluna de dezenas de linhas parecer alinhada
 * em vez de uma serrilha.
 */

export type SwatchSize = "xs" | "sm" | "md";

const BOX: Record<SwatchSize, string> = {
  xs: "size-(--santo-dimension-space-12)",
  sm: "size-(--santo-dimension-size-20)",
  md: "size-(--santo-dimension-size-28)",
};

/** Xadrez atras da cor, para alfa parcial ficar legivel. */
const CHECKER = {
  backgroundImage:
    "linear-gradient(45deg,var(--santo-color-bg-neutral-subtle-active) 25%,transparent 25%),linear-gradient(-45deg,var(--santo-color-bg-neutral-subtle-active) 25%,transparent 25%),linear-gradient(45deg,transparent 75%,var(--santo-color-bg-neutral-subtle-active) 75%),linear-gradient(-45deg,transparent 75%,var(--santo-color-bg-neutral-subtle-active) 75%)",
  backgroundSize: "8px 8px",
  backgroundPosition: "0 0,0 4px,4px -4px,-4px 0",
} as const;

/** Amostra de cor estatica. */
export function Swatch({
  color,
  size = "md",
  className = "",
  title,
  round,
}: {
  color: string;
  size?: SwatchSize;
  className?: string;
  title?: string;
  /** Circulo em vez de quadrado — usado nas amostras de resumo da marca. */
  round?: boolean;
}) {
  return (
    <span
      title={title}
      className={`relative shrink-0 overflow-hidden border-thin border-border-subtle ${round ? "rounded-full" : "rounded-sm"} ${BOX[size]} ${className}`}
      style={CHECKER}
    >
      <span className="absolute inset-0" style={{ background: color }} />
    </span>
  );
}

/** Amostra que abre o seletor completo do SantoDS ao ser clicada. */
export function SwatchPicker({
  color,
  onChange,
  label,
  size = "md",
  showAlpha = true,
}: {
  color: string;
  onChange: (hex: string) => void;
  label: string;
  size?: SwatchSize;
  showAlpha?: boolean;
}) {
  const [open, setOpen] = useState(false);
  return (
    <span className="relative shrink-0">
      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        aria-expanded={open}
        aria-haspopup="dialog"
        title={label}
        aria-label={label}
        className={`relative block cursor-pointer overflow-hidden rounded-sm border-thin border-border-subtle transition-colors duration-(--santo-motion-duration-fast) hover:border-border-strong ${BOX[size]}`}
        style={CHECKER}
      >
        <span className="absolute inset-0" style={{ background: color }} />
      </button>
      {open && (
        <ColorPicker
          value={color}
          onChange={onChange}
          onClose={() => setOpen(false)}
          showAlpha={showAlpha}
          label={label}
        />
      )}
    </span>
  );
}

/**
 * Linha de token de cor: amostra, rotulo, campo e acoes.
 *
 * `linked` troca o campo de texto por um seletor do token de origem — e o que
 * mantem a cadeia de aliases do Figma viva dentro do editor.
 */
export function ColorRow({
  label,
  title,
  resolved,
  value,
  linked,
  linkOptions,
  onChangeHex,
  onChangeLink,
  onToggleLink,
  dirty,
  onReset,
}: {
  label: string;
  /** Caminho completo do token, para o title. */
  title?: string;
  /** Cor final depois de resolver o alias — o que a amostra mostra. */
  resolved: string;
  /** Valor cru: hex quando literal, nome do token quando vinculado. */
  value: string;
  linked: boolean;
  linkOptions: string[];
  onChangeHex: (hex: string) => void;
  onChangeLink: (token: string) => void;
  onToggleLink: () => void;
  dirty?: boolean;
  onReset?: () => void;
}) {
  const [draft, setDraft] = useState<string | null>(null);

  return (
    <div className="group/row flex items-center gap-2xs">
      {linked ? (
        <Swatch color={resolved} title={`${label} → ${value}`} />
      ) : (
        <SwatchPicker color={resolved} onChange={onChangeHex} label={`Cor de ${label}`} />
      )}

      <span
        className="santo-body-small-regular w-(--santo-dimension-space-88) shrink-0 truncate text-text-primary"
        title={title ?? label}
      >
        {label}
      </span>

      {linked ? (
        <Select
          size="sm"
          mono
          className="min-w-0 flex-1"
          value={value}
          onChange={onChangeLink}
          label={`Token de origem de ${label}`}
          options={linkOptions.map((t) => ({
            value: t,
            label: t,
            leading: (
              <Swatch size="xs" color={`var(--santo-${t.replace(/\//g, "-")})`} />
            ),
          }))}
        />
      ) : (
        <Input
          size="sm"
          mono
          value={draft ?? value}
          onChange={(e) => setDraft(e.target.value)}
          onBlur={(e) => {
            const next = e.target.value.trim().toLowerCase();
            setDraft(null);
            if (/^#[0-9a-f]{6,8}$/.test(next)) onChangeHex(next);
          }}
          onKeyDown={(e) => {
            if (e.key === "Enter") (e.target as HTMLInputElement).blur();
          }}
          aria-label={`Valor de ${label}`}
          className="h-(--santo-dimension-size-28)"
        />
      )}

      <IconButton
        size="sm"
        variant="secondary"
        label={linked ? `Desvincular ${label}` : `Vincular ${label} a um token`}
        onClick={onToggleLink}
        className="size-(--santo-dimension-size-28)"
      >
        {linked ? <Icon.Unlink size={16} /> : <Icon.Link size={16} />}
      </IconButton>

      <span className="w-(--santo-dimension-size-24) shrink-0">
        {dirty && onReset && (
          <IconButton
            size="sm"
            variant="ghost"
            label={`Voltar ${label} ao valor do Figma`}
            onClick={onReset}
            className="size-(--santo-dimension-size-24) opacity-0 group-hover/row:opacity-100 focus-visible:opacity-100"
          >
            <Icon.Reset size={16} />
          </IconButton>
        )}
      </span>
    </div>
  );
}
