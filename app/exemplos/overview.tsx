"use client";

import { useState } from "react";
import {
  Button,
  Card,
  CardHeader,
  Count,
  EmptyState,
  Field,
  Icon,
  IconButton,
  IconTile,
  Input,
  KeyValue,
  ListRow,
  MiniBars,
  NumberField,
  Overline,
  Ring,
  Segmented,
  Sparkline,
  Stat,
  Tag,
  Textarea,
} from "@/lib/ui";
import { Block } from "./_block";

/**
 * Financas: o sistema em uso real, no vocabulario anti-generico (skill
 * santo-ui-craft). Chao = pagina; cada cartao e nivel 1 (raised, tonal); o que
 * fica dentro (metas, resumo) e poco (well). Um acento por cartao: a
 * micro-visualizacao OU a acao principal leva brand, nunca as duas.
 */

const CONTRIBUTIONS = [420, 380, 510, 460, 590, 650];

function ContributionsCard() {
  return (
    <Card>
      <CardHeader title="Contribuições" meta={<Count>6 meses</Count>} />
      <Stat
        label="Próximo aporte"
        value="650"
        unit="R$ por mês · 5 nov."
        viz={<MiniBars values={CONTRIBUTIONS} highlight={CONTRIBUTIONS.length - 1} size="lg" label="Aportes por mês" />}
      />
      <Card variant="well" padding="md">
        <KeyValue label="Plano" value="Mensal" />
        <KeyValue label="No ano" value={`R$ ${CONTRIBUTIONS.reduce((a, b) => a + b, 0).toLocaleString("pt-BR")}`} />
      </Card>
      <Button block className="mt-auto">
        Contribuir agora
      </Button>
    </Card>
  );
}

const GOALS = [
  { name: "Reserva de emergência", saved: 13000, target: 20000 },
  { name: "Viagem de fim de ano", saved: 4200, target: 8000 },
];

const brl = (n: number) => n.toLocaleString("pt-BR", { style: "currency", currency: "BRL", maximumFractionDigits: 0 });

function SavingsGoalsCard() {
  return (
    <Card>
      <CardHeader
        title="Metas"
        meta={<Count>{GOALS.length}</Count>}
        action={
          <IconButton size="sm" variant="ghost" label="Nova meta">
            <Icon.Plus size={16} />
          </IconButton>
        }
      />
      {GOALS.map((g) => {
        const pct = Math.round((g.saved / g.target) * 100);
        return (
          <Card key={g.name} variant="well" padding="md">
            <div className="flex items-center gap-md">
              <Ring value={pct} label={`${g.name}: ${pct}%`} tone="brand" size="lg">
                <span className="santo-caption-semibold tabular-nums">{pct}%</span>
              </Ring>
              <div className="flex min-w-0 flex-1 flex-col gap-2xs">
                <Overline>{g.name}</Overline>
                <span className="santo-heading-5-bold tabular-nums">{brl(g.saved)}</span>
                <span className="santo-caption-medium text-text-tertiary tabular-nums">de {brl(g.target)}</span>
              </div>
            </div>
          </Card>
        );
      })}
    </Card>
  );
}

const BALANCE = [18.2, 19.1, 18.7, 20.4, 21.9, 21.3, 23.0, 24.3];

function BalanceCard() {
  return (
    <Card>
      <Stat
        label="Saldo disponível"
        value="24.318,52"
        unit="R$ · 8 semanas"
        action={
          <Tag intent="warning" dot>
            Pendente
          </Tag>
        }
        viz={<Sparkline values={BALANCE} size="lg" area label="Saldo, 8 semanas" />}
      />
      <Card variant="well" padding="md" className="mt-auto">
        <KeyValue label="Em conta" value="R$ 21.118,52" />
        <KeyValue label="A receber" value="R$ 3.200,00" />
        <KeyValue label="Bloqueado" value="R$ 0,00" />
      </Card>
    </Card>
  );
}

function EmptyBandCard() {
  return (
    <EmptyState
      className="justify-center"
      icon={<Icon.Plus size={16} />}
      title="Distribuir faixa"
      action={<Button>Criar faixa</Button>}
    />
  );
}

const ORDER_TYPES = [
  { value: "mercado", label: "A mercado" },
  { value: "limitada", label: "Limitada" },
  { value: "agendada", label: "Agendada" },
];

function BuyInvestmentCard() {
  const [order, setOrder] = useState("mercado");
  return (
    <Card>
      <CardHeader title="Investir" meta={<Tag>Tesouro Selic</Tag>} />
      <Field label="Valor">
        <Input mono inputMode="decimal" placeholder="R$ 0,00" defaultValue="1.000,00" />
      </Field>
      <Segmented size="md" className="self-start" value={order} onChange={setOrder} options={ORDER_TYPES} />
      <Card variant="well" padding="md">
        <KeyValue label="Corretagem" value="R$ 0,00" />
        <KeyValue label="Rentabilidade" value="10,4% a.a." />
      </Card>
      <Button variant="primary" block className="mt-auto">
        Revisar compra
      </Button>
    </Card>
  );
}

const CURRENCIES = [
  { value: "BRL", label: "BRL" },
  { value: "USD", label: "USD" },
  { value: "EUR", label: "EUR" },
];

function PaymentLimitCard() {
  const [currency, setCurrency] = useState("BRL");
  const [limit, setLimit] = useState(2500);
  return (
    <Card>
      <CardHeader
        title="Limite diário"
        action={<Segmented value={currency} onChange={setCurrency} options={CURRENCIES} />}
      />
      <Stat label="Por dia" value={limit.toLocaleString("pt-BR")} unit={`${currency} · de 500 a 10.000`} />
      <NumberField label="Limite diário" value={limit} onChange={setLimit} min={500} max={10000} step={100} />
      <Field label="Notas" optional>
        <Textarea placeholder="Por que este limite?" />
      </Field>
      <Button block className="mt-auto">
        Salvar limite
      </Button>
    </Card>
  );
}

type Transaction = { title: string; category: string; date: string; amount: number };

const TRANSACTIONS: Transaction[] = [
  { title: "Salário", category: "Receita", date: "15 out.", amount: 8200 },
  { title: "Mercado Bom Preço", category: "Alimentação", date: "14 out.", amount: -312.4 },
  { title: "Aluguel", category: "Moradia", date: "10 out.", amount: -2400 },
  { title: "Reembolso viagem", category: "Trabalho", date: "08 out.", amount: 640 },
  { title: "Streaming", category: "Assinaturas", date: "05 out.", amount: -39.9 },
];

function TransactionsCard() {
  return (
    <Card>
      <CardHeader
        title="Transações"
        meta={<Count>{TRANSACTIONS.length}</Count>}
        action={
          <Button size="sm" variant="ghost">
            Ver todas
          </Button>
        }
      />
      <div className="flex flex-col">
        {TRANSACTIONS.map((t) => {
          const income = t.amount > 0;
          return (
            <ListRow
              key={t.title}
              divider
              leading={
                <IconTile>{income ? <Icon.ArrowDownLeft size={16} /> : <Icon.ArrowUpRight size={16} />}</IconTile>
              }
              title={t.title}
              meta={`${t.category} · ${t.date}`}
              trailing={
                <span className="flex items-center gap-sm">
                  <span className={`santo-body-small-semibold ${income ? "text-text-success" : "text-text-primary"}`}>
                    {income ? "+" : "−"}
                    {Math.abs(t.amount).toLocaleString("pt-BR", { minimumFractionDigits: 2 })}
                  </span>
                  <IconButton label={`Ações de ${t.title}`} size="sm" variant="ghost">
                    <Icon.More size={16} />
                  </IconButton>
                </span>
              }
            />
          );
        })}
      </div>
    </Card>
  );
}

export const FINANCAS_BLOCKS = [
  { id: "financas-contribuicoes", label: "Contribuições" },
  { id: "financas-metas", label: "Metas" },
  { id: "financas-saldo", label: "Saldo" },
  { id: "financas-faixa", label: "Distribuir faixa" },
  { id: "financas-investir", label: "Investir" },
  { id: "financas-limite", label: "Limite diário" },
  { id: "financas-transacoes", label: "Transações" },
];

/** Visualizacao Financas: grade unica, irmaos da mesma fileira com a mesma altura. */
export function Overview() {
  return (
    <div className="grid grid-cols-1 gap-lg md:grid-cols-2 2xl:grid-cols-3">
      <Block id="financas-contribuicoes"><ContributionsCard /></Block>
      <Block id="financas-metas"><SavingsGoalsCard /></Block>
      <Block id="financas-saldo"><BalanceCard /></Block>
      <Block id="financas-faixa"><EmptyBandCard /></Block>
      <Block id="financas-investir"><BuyInvestmentCard /></Block>
      <Block id="financas-limite"><PaymentLimitCard /></Block>
      <Block id="financas-transacoes" className="md:col-span-2 2xl:col-span-3">
        <TransactionsCard />
      </Block>
    </div>
  );
}
