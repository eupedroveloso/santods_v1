import { RADIUS_BAR } from "./radius";

export type MiniBarsSize = "sm" | "md" | "lg";

const HEIGHT: Record<MiniBarsSize, string> = {
  sm: "h-(--santo-dimension-size-24)",
  md: "h-(--santo-dimension-size-40)",
  lg: "h-(--santo-dimension-size-64)",
};

/**
 * Largura da barra: fina o bastante para caber ao lado de um número. O min-h
 * igual a largura faz o menor valor virar um ponto redondo em vez de sumir.
 */
const WIDTH: Record<MiniBarsSize, string> = {
  sm: "w-2xs min-h-2xs",
  md: "w-xs min-h-xs",
  lg: "w-sm min-h-sm",
};

/**
 * Barrinhas verticais compactas, sem eixo.
 *
 * Use para volume por período ao lado de um número (pedidos na semana, acessos
 * por hora). Monocromático: as barras ficam em neutral/subtle/active (separa
 * até dentro de poço) e só a destacada leva a cor do pai (currentColor) — o
 * hoje, o pico, o período selecionado. Sem `highlight`, todas pintam com a cor
 * do pai. Raio cheio: barra baixa vira ponto, não lasca. Sem transição de altura: vai em linha de tabela, e animar height
 * em N linhas x 7 barras é reflow em cascata.
 */
export function MiniBars({
  values,
  highlight,
  size = "md",
  label,
  className = "",
}: {
  values: number[];
  /** Indice da barra em destaque. Negativo conta do fim: -1 e a ultima. */
  highlight?: number;
  size?: MiniBarsSize;
  /** Rotulo acessivel ("Pedidos, ultimos 7 dias"). Sem ele e decorativo. */
  label?: string;
  className?: string;
}) {
  const max = Math.max(...values) || 1;
  const hi = highlight === undefined ? undefined : highlight < 0 ? values.length + highlight : highlight;
  return (
    <div
      className={`inline-flex items-end gap-2xs ${HEIGHT[size]} ${className}`}
      role={label ? "img" : undefined}
      aria-label={label}
      aria-hidden={label ? undefined : true}
    >
      {values.map((v, i) => (
        <span
          key={i}
          className={`shrink-0 ${RADIUS_BAR} ${WIDTH[size]} ${
            hi === undefined || hi === i ? "bg-current" : "bg-neutral-subtle-active"
          }`}
          style={{ height: `${(Math.max(v, 0) / max) * 100}%` }}
        />
      ))}
    </div>
  );
}
