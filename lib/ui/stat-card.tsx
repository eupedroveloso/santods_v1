"use client";

import { Button } from "./button";
import { Card, CardHeader, Divider, Stat } from "./card";
import { Count, Tag, type Intent } from "./chip";
import { KeyValue } from "./key-value";
import { MiniBars } from "./mini-bars";
import { Ring } from "./ring";
import { Segmented, type Segment } from "./segmented";
import { Sparkline } from "./sparkline";

/** Micro-visualizacao do numero: tendencia, volume por periodo ou fracao de meta. */
export type StatTrend =
  | { kind: "spark"; values: number[]; label: string; labels?: string[]; area?: boolean }
  | { kind: "bars"; values: number[]; label: string; labels?: string[]; highlight?: number }
  | { kind: "ring"; value: number; label: string; detail?: string };

export type StatDetail = { label: string; value: string };

function Trend({ trend }: { trend: StatTrend }) {
  if (trend.kind === "ring") return <Ring value={trend.value} label={trend.label} detail={trend.detail} tone="brand" size="md" />;
  if (trend.kind === "bars")
    return <MiniBars values={trend.values} labels={trend.labels} highlight={trend.highlight ?? -1} size="lg" label={trend.label} />;
  return <Sparkline values={trend.values} labels={trend.labels} area={trend.area ?? true} size="lg" label={trend.label} />;
}

/**
 * Cartao de metrica: o numero e o protagonista.
 *
 * Use para KPI de painel, saldo, receita, cotacao — um numero com unidade,
 * a variacao em Tag e UMA micro-visualizacao no acento (`trend`). Com
 * `title` ganha cabecalho (titulo + `meta` + `ranges` em Segmented); com
 * `details`, um resumo chave × valor separado por Divider — sem poco: item
 * de metrica dentro de cartao nao ganha caixa propria (Pedro). `action` e a
 * acao principal, em bloco no fim. Tudo por dado: a tela nao monta o cartao.
 */
export function StatCard<R extends string = string>({
  title,
  meta,
  badge,
  label,
  value,
  unit,
  delta,
  trend,
  details,
  ranges,
  range,
  onRangeChange,
  action,
  size = "md",
  className = "",
}: {
  /** Cabecalho do cartao ("Contribuicoes", "Mercado"). Sem ele, o rotulo do Stat abre o cartao. */
  title?: string;
  /** Contagem ao lado do titulo (Count): "6 meses". */
  meta?: string;
  /** Rotulo estatico ao lado do titulo (Tag): ativo, ticker. */
  badge?: string;
  label: string;
  value: string;
  unit?: string;
  /** Variacao ou estado no canto do rotulo: { label: "+12,5%", intent: "success" }. */
  delta?: { label: string; intent?: Intent; dot?: boolean };
  trend?: StatTrend;
  details?: StatDetail[];
  /** Periodos no cabecalho (1S, 1M, 1A). Exige `title`. */
  ranges?: Segment<R>[];
  range?: R;
  onRangeChange?: (value: R) => void;
  action?: { label: string; onClick?: () => void; variant?: "primary" | "secondary" };
  size?: "sm" | "md" | "lg";
  className?: string;
}) {
  return (
    <Card className={className}>
      {title && (
        <CardHeader
          title={title}
          meta={meta ? <Count>{meta}</Count> : badge ? <Tag>{badge}</Tag> : undefined}
          action={
            ranges && range !== undefined && onRangeChange ? (
              <Segmented value={range} onChange={onRangeChange} options={ranges} />
            ) : undefined
          }
        />
      )}
      <Stat
        label={label}
        value={value}
        unit={unit}
        size={size}
        action={
          delta ? (
            <Tag intent={delta.intent} dot={delta.dot}>
              {delta.label}
            </Tag>
          ) : undefined
        }
        viz={trend ? <Trend trend={trend} /> : undefined}
      />
      {details && details.length > 0 && (
        <>
          <Divider />
          <div className="flex flex-col gap-xs">
            {details.map((d) => (
              <KeyValue key={d.label} label={d.label} value={d.value} />
            ))}
          </div>
        </>
      )}
      {action && (
        <Button block variant={action.variant ?? "secondary"} onClick={action.onClick}>
          {action.label}
        </Button>
      )}
    </Card>
  );
}
