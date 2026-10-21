import type { ReactNode } from "react";
import { IconButton } from "./button";
import { Undo } from "./icons";

/**
 * Um passo de uma escala derivada, editável: amostra, nome do token em mono
 * (largura fixa, para a coluna alinhar), os campos do valor e o "voltar ao
 * derivado". Use em lista de passos que saem de uma fórmula e que a pessoa
 * pode sobrescrever (raio, espaço, tamanhos de texto).
 *
 * `overridden` acende o nome em brand e mostra o reset; sem override o reset
 * fica invisível mas ocupa o lugar, e os campos não pulam. Hairline entre
 * linhas, sem caixa (skill santo-ui-craft §8).
 */
export function StepRow({
  name,
  sample,
  children,
  unit,
  overridden = false,
  onReset,
  resetLabel,
}: {
  /** Nome do passo (token): `radius/lg`. */
  name: string;
  /** Amostra viva à esquerda (TokenSample). */
  sample?: ReactNode;
  /** Campos do valor (Input size sm mono), ou o valor só de leitura. */
  children: ReactNode;
  /** Unidade depois dos campos: px. */
  unit?: string;
  /** O valor foi editado à mão (difere da fórmula). */
  overridden?: boolean;
  onReset?: () => void;
  /** Rótulo do reset: "Voltar radius/lg ao derivado". */
  resetLabel?: string;
}) {
  return (
    <div className="flex min-w-0 items-center gap-sm border-b-thin border-border-subtle py-xs last:border-b-0">
      {sample && <span className="flex size-2xl shrink-0 items-center justify-center">{sample}</span>}
      <span
        title={overridden ? `${name} · editado` : name}
        className={`santo-code-sm w-(--santo-dimension-space-96) shrink-0 truncate ${overridden ? "text-text-brand" : "text-text-secondary"}`}
      >
        {name}
      </span>
      <span className="flex min-w-0 flex-1 items-center justify-end gap-2xs tabular-nums">
        {children}
        {unit && <span className="santo-caption-regular text-text-tertiary">{unit}</span>}
      </span>
      {onReset && (
        <IconButton
          size="sm"
          label={resetLabel ?? `Voltar ${name} ao derivado`}
          onClick={onReset}
          disabled={!overridden}
          aria-hidden={!overridden}
          tabIndex={overridden ? undefined : -1}
          className={overridden ? "" : "invisible"}
        >
          <Undo size={16} />
        </IconButton>
      )}
    </div>
  );
}
