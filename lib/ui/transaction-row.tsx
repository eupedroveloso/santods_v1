import { IconButton } from "./button";
import { ArrowDownLeft, ArrowUpRight, More } from "./icons";
import { IconTile } from "./icon-tile";
import { ListRow } from "./list-row";

/**
 * Linha de transacao: seta de ENTRADA (valor positivo, receita) ou SAIDA
 * (negativo, despesa) num IconTile tonal de intencao — success / danger, a cor
 * carrega o significado —, titulo, categoria · data e o valor alinhado a direita
 * na mesma cor (text/success ou text/danger), com sinal e tabular-nums.
 * Acao de linha opcional (IconButton ghost). Para listas de extrato, compras.
 */
export function TransactionRow({
  title,
  category,
  date,
  amount,
  locale = "pt-BR",
  onAction,
  divider = true,
}: {
  title: string;
  category?: string;
  date?: string;
  /** Positivo = entrada; negativo = saida. */
  amount: number;
  locale?: string;
  /** Liga o botao de acoes da linha. */
  onAction?: () => void;
  divider?: boolean;
}) {
  const income = amount >= 0;
  const value = Math.abs(amount).toLocaleString(locale, { minimumFractionDigits: 2, maximumFractionDigits: 2 });
  return (
    <ListRow
      divider={divider}
      leading={
        <IconTile tone={income ? "success" : "danger"}>
          {income ? <ArrowDownLeft size={16} title="Entrada" /> : <ArrowUpRight size={16} title="Saída" />}
        </IconTile>
      }
      title={title}
      meta={[category, date].filter(Boolean).join(" · ") || undefined}
      trailing={
        <span className="flex items-center gap-sm">
          <span className={`santo-body-small-semibold tabular-nums ${income ? "text-text-success" : "text-text-danger"}`}>
            {income ? "+" : "−"}
            {value}
          </span>
          {onAction && (
            <IconButton label={`Ações de ${title}`} size="sm" variant="ghost" onClick={onAction}>
              <More size={16} />
            </IconButton>
          )}
        </span>
      }
    />
  );
}
