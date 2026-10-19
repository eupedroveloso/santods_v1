import type { ReactNode } from "react";
import { OVERLINE } from "./text-class";

/**
 * Rotulo em caixa alta, acima de um numero ou de um bloco (RESERVA DE
 * EMERGENCIA, PROXIMO, PLANO). Um rotulo, nao uma frase.
 *
 * Divida de token: ainda nao ha text style "overline" no Figma; a classe vive
 * em text-class.ts e troca de uma vez quando o estilo existir.
 */
export function Overline({ children, className = "" }: { children: ReactNode; className?: string }) {
  return <span className={`${OVERLINE} ${className}`}>{children}</span>;
}
