import type { EffectStyleEntry } from "@/lib/docs/catalog.types";
import { Card, CopyCode, Count, TokenSample } from "@/lib/ui";

/**
 * Um effect style num cartao: a sombra viva num bloco (le a var do proprio
 * estilo), nome e numero de camadas, var e classe para copiar e as camadas.
 * Usado em /estilos/efeitos e no Estudio, que passa as camadas com a cor
 * derivada do rascunho (a amostra segue a var do escopo em volta).
 */
export function EffectCard({ effect: e }: { effect: EffectStyleEntry }) {
  return (
    <Card padding="md" className="flex-1">
      <Card variant="well" className="h-(--santo-dimension-space-160) items-center justify-center">
        {/* A sombra le a var do proprio estilo: estilo novo no Figma aparece sem mexer aqui. */}
        <TokenSample variant="shadow" value={`var(${e.cssVar})`} />
      </Card>
      <div className="flex flex-1 flex-col gap-sm">
        {/* Titulo + meta na mesma linha: nome e numero de camadas. */}
        <span className="flex items-center justify-between gap-xs">
          <span className="santo-body-large-semibold">{e.name}</span>
          <Count>{e.layers.length}</Count>
        </span>
        <div className="flex min-w-0 flex-col items-start gap-2xs">
          <CopyCode truncate value={e.cssVar} label={`Copiar ${e.cssVar}`} />
          <CopyCode truncate value={e.tailwind} label={`Copiar classe ${e.tailwind}`} />
        </div>
        {e.layers.length === 0 ? (
          <span className="santo-code-sm text-text-disabled">none</span>
        ) : (
          <ul className="flex flex-col gap-3xs">
            {e.layers.map((l, i) => (
              <li
                key={i}
                className={`santo-code-sm tabular-nums ${l.visible ? "text-text-secondary" : "text-text-disabled line-through"}`}
                title={l.visible ? undefined : "Camada oculta no Figma"}
              >
                {l.type === "INNER_SHADOW" ? "inset " : ""}
                {l.x}px {l.y}px {l.blur}px {l.spread}px {l.color}
              </li>
            ))}
          </ul>
        )}
      </div>
    </Card>
  );
}
