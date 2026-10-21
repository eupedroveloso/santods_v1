import { isValidElement, type ReactNode } from "react";
import { Button } from "./button";
import { Card } from "./card";
import { IconTile } from "./icon-tile";

/**
 * Lugar vazio com um caminho: icone, titulo e a acao que o preenche.
 * Sem texto de apoio por padrao — o titulo diz o que falta, o botao diz o que
 * fazer. Contorno tracejado (Card variant=dashed): e um alvo, nao um cartao.
 * Recuo unico (o padding lg do Card, igual nos quatro lados: aninhamento).
 * `action` aceita o no pronto ou so o dado (`{ label, onClick }` vira Button).
 */
export function EmptyState({
  icon,
  title,
  action,
  className = "",
}: {
  icon?: ReactNode;
  title: ReactNode;
  action?: ReactNode | { label: string; onClick?: () => void };
  className?: string;
}) {
  return (
    <Card variant="dashed" padding="lg" className={`items-center text-center ${className}`}>
      {icon && (
        <IconTile shape="round" tone="brand" size="lg">
          {icon}
        </IconTile>
      )}
      <span className="santo-body-large-semibold text-text-primary">{title}</span>
      {action && typeof action === "object" && !isValidElement(action) && "label" in action ? (
        <Button onClick={action.onClick}>{action.label}</Button>
      ) : (
        (action as ReactNode)
      )}
    </Card>
  );
}
