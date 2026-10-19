import type { ReactNode } from "react";

/**
 * Linha chave × valor: rotulo a esquerda, valor a direita.
 *
 * Use em resumo de pedido, detalhe de transacao, ficha tecnica — lista em que a
 * pessoa varre a coluna de valores. O valor e `tabular-nums` e alinhado a
 * direita para os numeros se alinharem pela casa decimal. `emphasis` para a
 * linha de total.
 */
export function KeyValue({
  label,
  value,
  emphasis,
  className = "",
}: {
  label: ReactNode;
  value: ReactNode;
  /** Linha de total: tudo em semibold e primario. */
  emphasis?: boolean;
  className?: string;
}) {
  return (
    <div className={`flex items-baseline justify-between gap-md ${className}`}>
      <span
        className={`min-w-0 truncate ${emphasis ? "santo-body-small-semibold text-text-primary" : "santo-body-small-regular text-text-secondary"}`}
      >
        {label}
      </span>
      <span
        className={`shrink-0 text-right tabular-nums text-text-primary ${emphasis ? "santo-body-small-semibold" : "santo-body-small-medium"}`}
      >
        {value}
      </span>
    </div>
  );
}
