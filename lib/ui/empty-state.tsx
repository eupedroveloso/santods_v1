import type { ReactNode } from "react";
import { Card } from "./card";
import { IconTile } from "./icon-tile";

/**
 * Lugar vazio com um caminho: icone, titulo e a acao que o preenche.
 * Sem texto de apoio por padrao — o titulo diz o que falta, o botao diz o que
 * fazer. Contorno tracejado (Card variant=dashed): e um alvo, nao um cartao.
 */
export function EmptyState({
  icon,
  title,
  action,
  className = "",
}: {
  icon?: ReactNode;
  title: ReactNode;
  action?: ReactNode;
  className?: string;
}) {
  return (
    <Card variant="dashed" padding="lg" className={`items-center gap-md py-2xl text-center ${className}`}>
      {icon && (
        <IconTile shape="round" tone="brand" size="lg">
          {icon}
        </IconTile>
      )}
      <span className="santo-body-large-semibold text-text-primary">{title}</span>
      {action}
    </Card>
  );
}
