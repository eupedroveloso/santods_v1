"use client";

import { useId } from "react";
import type { ReactNode } from "react";
import { Check } from "./icons";

/**
 * Controles booleanos: caixa, radio e chave.
 *
 * Os tres compartilham o mesmo alvo de clique — o rotulo inteiro — porque area
 * de toque pequena e o defeito mais comum desses controles.
 */

const BOX =
  "grid size-md shrink-0 place-items-center rounded-xs border-thin transition-colors duration-(--santo-motion-duration-fast) ease-(--santo-motion-easing-standard)";

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
        className={`${BOX} mt-3xs cursor-pointer ${
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

/** Chave liga/desliga. Use quando o efeito e imediato; caixa quando ha um Salvar. */
export function Switch({
  checked,
  onChange,
  label,
  disabled,
  className = "",
}: {
  checked: boolean;
  onChange: (checked: boolean) => void;
  label: string;
  disabled?: boolean;
  className?: string;
}) {
  return (
    <button
      type="button"
      role="switch"
      aria-checked={checked}
      aria-label={label}
      disabled={disabled}
      onClick={() => onChange(!checked)}
      className={`relative inline-flex h-lg w-2xl shrink-0 cursor-pointer items-center rounded-full p-3xs transition-colors duration-(--santo-motion-duration-fast) ease-(--santo-motion-easing-standard) disabled:cursor-not-allowed disabled:bg-disabled ${
        checked ? "bg-brand-solid-default" : "bg-neutral-subtle-active"
      } ${className}`}
    >
      <span
        className="size-md rounded-full bg-surface-raised shadow-sm transition-transform duration-(--santo-motion-duration-fast) ease-(--santo-motion-easing-standard)"
        style={{ transform: checked ? "translateX(100%)" : "translateX(0)" }}
      />
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
