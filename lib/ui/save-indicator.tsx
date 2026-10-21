import { Check, Close, Reset } from "./icons";

export type SaveState = "salvo" | "salvando" | "erro";

const ESTADO: Record<SaveState, { texto: string; cor: string; Glyph: typeof Check; anima?: string }> = {
  salvo: { texto: "Salvo", cor: "text-text-tertiary", Glyph: Check },
  salvando: { texto: "Salvando", cor: "text-text-tertiary", Glyph: Reset, anima: "santo-animate-pulse" },
  erro: { texto: "Não salvo", cor: "text-text-danger", Glyph: Close },
};

/**
 * Estado do salvamento automático: ícone + micro-texto, ao lado das ações do
 * cabeçalho do editor. Sem botão nem explicação: o erro diz só que não salvou,
 * o detalhe mora onde a pessoa corrige. Anuncia a troca (aria-live polite).
 */
export function SaveIndicator({ state, title }: { state: SaveState; title?: string }) {
  const { texto, cor, Glyph, anima } = ESTADO[state];
  return (
    <span role="status" aria-live="polite" title={title} className={`santo-caption-medium inline-flex items-center gap-3xs ${cor}`}>
      <span className={anima}>
        <Glyph size={16} />
      </span>
      {texto}
    </span>
  );
}
