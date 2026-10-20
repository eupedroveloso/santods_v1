"use client";

import { Fragment, useState } from "react";
import { Button, IconButton } from "./button";
import { Card, CardHeader, Divider, Stat } from "./card";
import { Count, Tag, type Intent } from "./chip";
import { Table, type Column } from "./data";
import * as Icon from "./icons";
import { Field, Input, Textarea } from "./input";
import { KeyValue } from "./key-value";
import { Pagination } from "./nav";
import { NumberField } from "./number-field";
import { Overline } from "./overline";
import { Ring } from "./ring";
import { Segmented, type Segment } from "./segmented";
import { TransactionRow } from "./transaction-row";

/*
 * Blocos de financas: cartoes prontos, montados SO com a lib e alimentados
 * por dado. A tela de exemplo so os compoe (lib:check, regra D). Item dentro
 * de cartao nao ganha caixa propria: separa por espaco ou Divider; poco so em
 * campo (Pedro, 2026-10-19).
 */

const brl = (n: number, digits = 0) =>
  n.toLocaleString("pt-BR", { style: "currency", currency: "BRL", minimumFractionDigits: digits, maximumFractionDigits: digits });

/** Resumo chave × valor depois de um Divider (sem poco). */
function Summary({ items }: { items: { label: string; value: string; emphasis?: boolean }[] }) {
  return (
    <>
      <Divider />
      <div className="flex flex-col gap-xs">
        {items.map((d) => (
          <KeyValue key={d.label} label={d.label} value={d.value} emphasis={d.emphasis} />
        ))}
      </div>
    </>
  );
}

/* ------------------------------------------------------------------ metas */

export type Goal = { name: string; saved: number; target: number };

/**
 * Metas de economia: cada meta e anel (fracao) + nome em overline + valor
 * guardado grande + alvo pequeno. Use para objetivos com teto conhecido
 * (reserva, viagem). As metas se separam por Divider, sem caixa por item.
 */
export function GoalsCard({
  title = "Metas",
  goals,
  onAdd,
  format = (n: number) => brl(n),
  className = "",
}: {
  title?: string;
  goals: Goal[];
  /** Liga o botao "Nova meta" no cabecalho. */
  onAdd?: () => void;
  format?: (n: number) => string;
  className?: string;
}) {
  return (
    <Card className={className}>
      <CardHeader
        title={title}
        meta={<Count>{goals.length}</Count>}
        action={
          onAdd && (
            <IconButton size="sm" variant="ghost" label="Nova meta" onClick={onAdd}>
              <Icon.Plus size={16} />
            </IconButton>
          )
        }
      />
      {goals.map((g, i) => {
        const pct = Math.round((g.saved / g.target) * 100);
        return (
          <Fragment key={g.name}>
            {i > 0 && <Divider />}
            <div className="flex items-center gap-md">
              <Ring value={pct} label={g.name} detail={`${format(g.saved)} de ${format(g.target)}`} tone="brand" size="lg">
                <span className="santo-caption-semibold tabular-nums">{pct}%</span>
              </Ring>
              <div className="flex min-w-0 flex-1 flex-col gap-2xs">
                <Overline>{g.name}</Overline>
                <span className="santo-heading-5-bold text-text-primary tabular-nums">{format(g.saved)}</span>
                <span className="santo-caption-medium text-text-tertiary tabular-nums">de {format(g.target)}</span>
              </div>
            </div>
          </Fragment>
        );
      })}
    </Card>
  );
}

/* ---------------------------------------------------------------- investir */

/**
 * Compra de investimento: valor no campo-poco, tipo de ordem em Segmented,
 * resumo de custo e a acao principal. Use para qualquer ordem com valor e
 * modalidade (compra de ativo, aporte). Um acento: o botao primario.
 */
export function InvestCard<T extends string>({
  title = "Investir",
  asset,
  amount,
  onAmountChange,
  orderTypes,
  orderType,
  onOrderTypeChange,
  summary,
  submitLabel = "Revisar compra",
  onSubmit,
  className = "",
}: {
  title?: string;
  /** Ativo em Tag ao lado do titulo: "Tesouro Selic". */
  asset?: string;
  amount: string;
  onAmountChange: (value: string) => void;
  orderTypes: Segment<T>[];
  orderType: T;
  onOrderTypeChange: (value: T) => void;
  summary: { label: string; value: string }[];
  submitLabel?: string;
  onSubmit?: () => void;
  className?: string;
}) {
  return (
    <Card className={className}>
      <CardHeader title={title} meta={asset ? <Tag>{asset}</Tag> : undefined} />
      <Field label="Valor">
        <Input mono inputMode="decimal" placeholder="R$ 0,00" value={amount} onChange={(e) => onAmountChange(e.target.value)} />
      </Field>
      <Segmented size="md" className="self-start" value={orderType} onChange={onOrderTypeChange} options={orderTypes} />
      <Summary items={summary} />
      {/* mt-auto: numa fileira esticada (CardGrid stretch) a acao ancora no fim. */}
      <Button variant="primary" block className="mt-auto" onClick={onSubmit}>
        {submitLabel}
      </Button>
    </Card>
  );
}

/* ------------------------------------------------------------ limite diario */

/**
 * Limite com faixa: o valor e o numero grande, ajustado por NumberField
 * (arrasta ou digita), moeda em Segmented no cabecalho e nota opcional. Use
 * para teto configuravel (limite de pagamento, orcamento diario); `summary`
 * acrescenta o resumo (usado hoje) antes da acao.
 */
export function LimitCard<C extends string>({
  title = "Limite diário",
  value,
  onChange,
  min,
  max,
  step = 100,
  currencies,
  currency,
  onCurrencyChange,
  notes = true,
  summary,
  submitLabel = "Salvar limite",
  onSubmit,
  className = "",
}: {
  title?: string;
  value: number;
  onChange: (value: number) => void;
  min: number;
  max: number;
  step?: number;
  currencies: Segment<C>[];
  currency: C;
  onCurrencyChange: (value: C) => void;
  /** Campo de observacao opcional. */
  notes?: boolean;
  /** Resumo chave × valor depois de um Divider ("Usado hoje"). */
  summary?: { label: string; value: string }[];
  submitLabel?: string;
  onSubmit?: () => void;
  className?: string;
}) {
  const n = (v: number) => v.toLocaleString("pt-BR");
  return (
    <Card className={className}>
      <CardHeader title={title} action={<Segmented value={currency} onChange={onCurrencyChange} options={currencies} />} />
      <Stat label="Por dia" value={n(value)} unit={`${currency} · de ${n(min)} a ${n(max)}`} />
      <NumberField label={title} value={value} onChange={onChange} min={min} max={max} step={step} />
      {notes && (
        <Field label="Notas" optional>
          <Textarea placeholder="Por que este limite?" />
        </Field>
      )}
      {summary && <Summary items={summary} />}
      <Button block className="mt-auto" onClick={onSubmit}>
        {submitLabel}
      </Button>
    </Card>
  );
}

/* --------------------------------------------------------------- transacoes */

export type Transaction = { title: string; category: string; date: string; amount: number };

/** Extrato curto: cabecalho com contagem e "Ver todas", linhas de TransactionRow. */
export function TransactionsCard({
  title = "Transações",
  transactions,
  onViewAll,
  onAction,
  className = "",
}: {
  title?: string;
  transactions: Transaction[];
  onViewAll?: () => void;
  /** Liga o botao de acoes de cada linha. */
  onAction?: (transaction: Transaction) => void;
  className?: string;
}) {
  return (
    <Card className={className}>
      <CardHeader
        title={title}
        meta={<Count>{transactions.length}</Count>}
        action={
          <Button size="sm" variant="ghost" onClick={onViewAll}>
            Ver todas
          </Button>
        }
      />
      <div className="flex flex-col">
        {transactions.map((t, i) => (
          <TransactionRow
            key={`${t.title}-${t.date}`}
            {...t}
            divider={i < transactions.length - 1}
            onAction={onAction && (() => onAction(t))}
          />
        ))}
      </div>
    </Card>
  );
}

/* -------------------------------------------------------------- pagamentos */

export type PaymentStatus = "Pago" | "Processando" | "Falhou" | "Pendente";
export type Payment = { id: string; status: PaymentStatus; email: string; amount: string };

const STATUS_INTENT: Record<PaymentStatus, Intent> = {
  Pago: "success",
  Processando: "info",
  Falhou: "danger",
  Pendente: "warning",
};

/**
 * Pagamentos em tabela com selecao: status em Tag de intencao, e-mail,
 * valor a direita, acoes por linha e paginacao com a contagem selecionada.
 * Use para listas operacionais em que a pessoa age sobre varias linhas.
 */
export function PaymentsCard({
  title = "Pagamentos",
  payments,
  className = "",
}: {
  title?: string;
  payments: Payment[];
  className?: string;
}) {
  const [selected, setSelected] = useState<Set<string>>(new Set());
  const columns: Column<Payment>[] = [
    { key: "status", header: "Status", render: (r) => <Tag intent={STATUS_INTENT[r.status]}>{r.status}</Tag> },
    { key: "email", header: "E-mail", render: (r) => <span className="text-text-secondary">{r.email}</span> },
    { key: "amount", header: "Valor", numeric: true, render: (r) => r.amount },
  ];
  return (
    <Card className={className}>
      <CardHeader title={title} meta={<Count>{payments.length}</Count>} />
      <Table
        columns={columns}
        rows={payments}
        getKey={(r) => r.id}
        selected={selected}
        onToggleRow={(key) =>
          setSelected((s) => {
            const next = new Set(s);
            if (next.has(key)) next.delete(key);
            else next.add(key);
            return next;
          })
        }
        onToggleAll={() => setSelected((s) => (s.size === payments.length ? new Set() : new Set(payments.map((p) => p.id))))}
        rowAction={() => (
          <IconButton size="sm" variant="ghost" label="Mais ações">
            <Icon.More size={16} />
          </IconButton>
        )}
      />
      <Pagination summary={`${selected.size} de ${payments.length} linha(s) selecionada(s).`} canPrevious={false} canNext />
    </Card>
  );
}
