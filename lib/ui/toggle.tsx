"use client";

import Link from "next/link";
import { useId } from "react";
import type { ReactNode } from "react";
import { Check } from "./icons";
import { RADIUS_CONTROL, RADIUS_CONTROL_VAR } from "./radius";

/**
 * Controles booleanos: caixa, radio e chave.
 *
 * Os tres compartilham o mesmo alvo de clique — o rotulo inteiro — porque area
 * de toque pequena e o defeito mais comum desses controles.
 */

// Sem raio aqui: cada caixa escolhe o seu. Com rounded-xs na base, o rounded-full
// do radio perdia pela ordem do CSS gerado e o radio virava quadrado (lia como checkbox).
const BOX =
  "santo-focus-field grid size-md shrink-0 place-items-center border-thin transition-colors duration-(--santo-motion-duration-fast) ease-(--santo-motion-easing-standard)";

export function Checkbox({
  checked,
  onChange,
  label,
  description,
  disabled,
  className = "",
}: {
  checked: boolean;
  onChange: (checked: boolean) => void;
  label?: ReactNode;
  description?: ReactNode;
  disabled?: boolean;
  className?: string;
}) {
  const id = useId();
  return (
    <div className={`flex items-start gap-xs ${className}`}>
      <button
        type="button"
        role="checkbox"
        id={id}
        aria-checked={checked}
        disabled={disabled}
        onClick={() => onChange(!checked)}
        className={`${BOX} mt-3xs cursor-pointer rounded-xs ${
          checked
            ? "border-border-brand bg-brand-solid-default text-text-on-brand"
            : "border-border-default bg-input-default hover:border-border-strong"
        } disabled:cursor-not-allowed disabled:border-border-disabled disabled:bg-input-disabled`}
      >
        {checked && <Check size={12} />}
      </button>
      {(label || description) && (
        <label htmlFor={id} className="flex min-w-0 cursor-pointer flex-col gap-3xs">
          {label && <span className="santo-body-small-regular text-text-primary">{label}</span>}
          {description && (
            <span className="santo-caption-regular text-text-tertiary">{description}</span>
          )}
        </label>
      )}
    </div>
  );
}

/**
 * O marcador do Radio, sem interacao — para quem ja e o alvo de clique (o
 * RadioCard inteiro e o botao; um <button> dentro de outro e HTML invalido).
 * Mesmos tokens do Radio, por construcao.
 */
export function RadioMark({ checked, disabled }: { checked: boolean; disabled?: boolean }) {
  return (
    <span
      aria-hidden
      className={`${BOX} rounded-full bg-input-default ${
        disabled ? "border-border-disabled" : checked ? "border-border-brand" : "border-border-default"
      }`}
    >
      {checked && <span className="size-2xs rounded-full bg-brand-solid-default" />}
    </span>
  );
}

export function Radio({
  checked,
  onChange,
  label,
  description,
  disabled,
  className = "",
}: {
  checked: boolean;
  onChange: () => void;
  label?: ReactNode;
  description?: ReactNode;
  disabled?: boolean;
  className?: string;
}) {
  const id = useId();
  return (
    <div className={`flex items-start gap-xs ${className}`}>
      <button
        type="button"
        role="radio"
        id={id}
        aria-checked={checked}
        disabled={disabled}
        onClick={onChange}
        className={`${BOX} mt-3xs cursor-pointer rounded-full ${
          checked ? "border-border-brand" : "border-border-default hover:border-border-strong"
        } bg-input-default disabled:cursor-not-allowed disabled:border-border-disabled`}
      >
        {checked && <span className="size-2xs rounded-full bg-brand-solid-default" />}
      </button>
      {(label || description) && (
        <label htmlFor={id} className="flex min-w-0 cursor-pointer flex-col gap-3xs">
          {label && <span className="santo-body-small-medium text-text-primary">{label}</span>}
          {description && (
            <span className="santo-caption-regular text-text-secondary">{description}</span>
          )}
        </label>
      )}
    </div>
  );
}

/** Cor do trilho por estado: neutro (desligado padrao), marca, ou a cor de destaque (accent). */
export type SwitchTone = "neutral" | "brand" | "accent";

/** Punho circular do alternador de icones: a cor do lado ativo. */
const THUMB_TONE: Record<SwitchTone, string> = {
  neutral: "bg-surface-raised",
  brand: "bg-brand-solid-default",
  accent: "bg-accent-solid-default",
};

/** Icone sobre o punho: contraste com a cor dele. */
const ON_TONE: Record<SwitchTone, string> = {
  neutral: "text-icon-primary",
  brand: "text-text-on-brand",
  accent: "text-text-on-accent",
};

const TRACK_TONE: Record<SwitchTone, string> = {
  neutral: "bg-neutral-subtle-active",
  brand: "bg-brand-solid-default",
  accent: "bg-accent-solid-default",
};

/**
 * Chave liga/desliga. Use quando o efeito e imediato; caixa quando ha um Salvar.
 *
 * Geometria concentrica (principio 5 do Pedro: sem capsula): trilho size
 * 24 x 40 (`h-lg w-2xl`) com o raio de controle e folga `space/2xs` igual nos
 * quatro lados; punho = 24 - 2 x 4 = 16 (`size-md`), PASTILHA com raio =
 * raio do trilho - folga (8 - 4 = radius/xs). Curso = 40 - 2 x 4 - 16 = 16 =
 * a largura do punho, entao `translateX(100%)` encosta na folga do outro lado.
 *
 * Alternador de dois lados (`offLabel` + `onLabel`): para escolher entre dois
 * lugares, nao ligar/desligar (topbar: Documentacao | Estudio).
 *   - com `offIcon` + `onIcon`: SO ICONES, REDONDO (excecao do Pedro: capsula),
 *     trilho neutro com um icone fixo em cada ponta; o punho circular desliza
 *     para o lado ativo, na cor dele (`offTone`/`onTone`), com o icone em
 *     on-color; os nomes ficam no aria-label e na dica (title);
 *   - sem icones: um rotulo de texto de cada lado do trilho, o ativo em enfase
 *     (`compact`: so para leitor de tela abaixo de `sm`).
 */
export function Switch({
  checked,
  onChange,
  label,
  disabled,
  offLabel,
  onLabel,
  offTone = "neutral",
  onTone = "brand",
  compact = false,
  offIcon,
  onIcon,
  offHref,
  onHref,
  className = "",
}: {
  checked: boolean;
  onChange: (checked: boolean) => void;
  label: string;
  disabled?: boolean;
  /** Rotulo do lado desligado (esquerda). Com `onLabel`, vira alternador de dois lados. */
  offLabel?: string;
  /** Rotulo do lado ligado (direita). */
  onLabel?: string;
  /** Cor do trilho desligado. */
  offTone?: SwitchTone;
  /** Cor do trilho ligado. */
  onTone?: SwitchTone;
  /** Rotulos laterais so para leitor de tela abaixo de `sm` (topbar do celular). */
  compact?: boolean;
  /** Icone do lado desligado (16). Com `onIcon`, o alternador e so de icones. */
  offIcon?: ReactNode;
  /** Icone do lado ligado. */
  onIcon?: ReactNode;
  /**
   * Destinos dos dois lados (alternador de icones que troca de AREA): o
   * controle vira <nav> com dois links — mesmo visual, aria-current no ativo,
   * Cmd/Ctrl+clique abre em nova aba. `onChange` deixa de ser chamado.
   */
  offHref?: string;
  onHref?: string;
  className?: string;
}) {
  const sided = Boolean(offLabel && onLabel);
  // Desligado+desabilitado e ligado+desabilitado precisam continuar
  // distinguiveis: o ligado vira brand/subtle, nao o mesmo cinza.
  const tone = checked ? `${TRACK_TONE[onTone]} disabled:bg-brand-subtle-active` : `${TRACK_TONE[offTone]} disabled:bg-disabled`;
  const thumb = (
    <span
      className="size-md bg-surface-raised shadow-sm transition-transform duration-(--santo-motion-duration-normal) ease-(--santo-motion-easing-spring)"
      style={{
        transform: checked ? "translateX(100%)" : "translateX(0)",
        borderRadius: `calc(${RADIUS_CONTROL_VAR} - var(--santo-space-2xs))`,
      }}
    />
  );
  const trackClass = `relative inline-flex h-lg w-2xl shrink-0 items-center ${RADIUS_CONTROL} p-2xs transition-colors duration-(--santo-motion-duration-fast) ease-(--santo-motion-easing-standard)`;
  if (!sided) {
    return (
      <button
        type="button"
        role="switch"
        aria-checked={checked}
        aria-label={label}
        disabled={disabled}
        onClick={() => onChange(!checked)}
        className={`santo-focus-solid ${trackClass} cursor-pointer disabled:cursor-not-allowed ${tone} ${className}`}
      >
        {thumb}
      </button>
    );
  }
  if (offIcon && onIcon) {
    // EXCECAO do Pedro (2026-10-21): este alternador e REDONDO — trilho em capsula
    // e punho circular. O trilho fica neutro; so o punho muda de cor pelo lado
    // ativo (offTone/onTone) e leva o icone dele em on-color. Os dois icones
    // ficam fixos nas pontas, em tom neutro; o punho cobre o ativo.
    // Trilho size/32 = 2 vagas de size/24 + folga 2xs; o punho desliza uma vaga.
    const thumbTone = checked ? onTone : offTone;
    const slot = "relative z-1 grid size-(--santo-dimension-size-24) place-items-center santo-transition-colors";
    const thumb = (
      <span
        aria-hidden
        className={`absolute top-2xs left-2xs size-(--santo-dimension-size-24) rounded-full shadow-sm transition-[translate,background-color] duration-(--santo-motion-duration-normal) ease-(--santo-motion-easing-spring) ${THUMB_TONE[thumbTone]}`}
        style={{ translate: checked ? "100% 0" : "0 0" }}
      />
    );
    if (offHref && onHref) {
      const link = (href: string, name: string, icon: ReactNode, active: boolean) => (
        <Link
          href={href}
          aria-label={name}
          title={name}
          aria-current={active ? "page" : undefined}
          className={`santo-focus-solid ${slot} rounded-full ${active ? ON_TONE[thumbTone] : "text-icon-tertiary hover:text-icon-secondary"}`}
        >
          {icon}
        </Link>
      );
      return (
        <nav aria-label={label} className={`relative inline-flex h-(--santo-dimension-size-32) shrink-0 items-center rounded-full bg-surface-sunken p-2xs ${className}`}>
          {thumb}
          {link(offHref, offLabel as string, offIcon, !checked)}
          {link(onHref, onLabel as string, onIcon, checked)}
        </nav>
      );
    }
    return (
      <button
        type="button"
        role="switch"
        aria-checked={checked}
        aria-label={`${label}: ${checked ? onLabel : offLabel}`}
        title={checked ? onLabel : offLabel}
        disabled={disabled}
        onClick={() => onChange(!checked)}
        className={`santo-focus-solid relative inline-flex h-(--santo-dimension-size-32) shrink-0 cursor-pointer items-center rounded-full bg-surface-sunken p-2xs disabled:cursor-not-allowed ${className}`}
      >
        {thumb}
        <span aria-hidden className={`${slot} ${checked ? "text-icon-tertiary" : ON_TONE[thumbTone]}`}>{offIcon}</span>
        <span aria-hidden className={`${slot} ${checked ? ON_TONE[thumbTone] : "text-icon-tertiary"}`}>{onIcon}</span>
      </button>
    );
  }
  const side = (text: string, active: boolean) => (
    <span
      className={`santo-body-small-medium santo-transition-colors whitespace-nowrap ${active ? "text-text-primary" : "text-text-tertiary"} ${
        compact ? "max-sm:sr-only" : ""
      }`}
    >
      {text}
    </span>
  );
  return (
    <button
      type="button"
      role="switch"
      aria-checked={checked}
      aria-label={`${label}: ${offLabel} ou ${onLabel}`}
      title={checked ? onLabel : offLabel}
      disabled={disabled}
      onClick={() => onChange(!checked)}
      className={`santo-focus-solid inline-flex cursor-pointer items-center gap-xs ${RADIUS_CONTROL} disabled:cursor-not-allowed ${className}`}
    >
      {side(offLabel as string, !checked)}
      <span aria-hidden className={`${trackClass} ${checked ? TRACK_TONE[onTone] : TRACK_TONE[offTone]}`}>
        {thumb}
      </span>
      {side(onLabel as string, checked)}
    </button>
  );
}

/** Linha de configuracao: titulo, texto de apoio e o controle a direita. */
export function SettingRow({
  title,
  description,
  control,
  className = "",
}: {
  title: ReactNode;
  description?: ReactNode;
  control: ReactNode;
  className?: string;
}) {
  return (
    <div className={`flex items-start justify-between gap-md ${className}`}>
      <div className="flex min-w-0 flex-col gap-3xs">
        <span className="santo-body-small-medium text-text-primary">{title}</span>
        {description && (
          <span className="santo-caption-regular text-text-secondary">{description}</span>
        )}
      </div>
      <span className="shrink-0 pt-3xs">{control}</span>
    </div>
  );
}
