"use client";

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

/**
 * Chave liga/desliga. Use quando o efeito e imediato; caixa quando ha um Salvar.
 *
 * Geometria concentrica (principio 5 do Pedro: sem capsula): trilho size
 * 24 x 40 (`h-lg w-2xl`) com o raio de controle e folga `space/2xs` igual nos
 * quatro lados; punho = 24 - 2 x 4 = 16 (`size-md`), PASTILHA com raio =
 * raio do trilho - folga (8 - 4 = radius/xs). Curso = 40 - 2 x 4 - 16 = 16 =
 * a largura do punho, entao `translateX(100%)` encosta na folga do outro lado.
 */
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
      // Desligado+desabilitado e ligado+desabilitado precisam continuar
      // distinguiveis: o ligado vira brand/subtle, nao o mesmo cinza.
      className={`santo-focus-field relative inline-flex h-lg w-2xl shrink-0 cursor-pointer items-center ${RADIUS_CONTROL} p-2xs transition-colors duration-(--santo-motion-duration-fast) ease-(--santo-motion-easing-standard) disabled:cursor-not-allowed ${
        checked ? "bg-brand-solid-default disabled:bg-brand-subtle-active" : "bg-neutral-subtle-active disabled:bg-disabled"
      } ${className}`}
    >
      <span
        className="size-md bg-surface-raised shadow-sm transition-transform duration-(--santo-motion-duration-normal) ease-(--santo-motion-easing-spring)"
        style={{
          transform: checked ? "translateX(100%)" : "translateX(0)",
          borderRadius: `calc(${RADIUS_CONTROL_VAR} - var(--santo-space-2xs))`,
        }}
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
