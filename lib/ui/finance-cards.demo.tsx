"use client";

import { useState } from "react";
import { jsx } from "./demo-kit";
import {
  GoalsCard,
  InvestCard,
  LimitCard,
  PaymentsCard,
  TransactionRow,
  TransactionsCard,
  type Payment,
  type Transaction,
} from "./finance-cards";
import type { DemoMap } from "./registry.types";

const narrow = "mx-auto w-full max-w-(--santo-dimension-space-384)";
const wide = "mx-auto w-full max-w-(--santo-dimension-container-sm)";

const GOALS = [
  { name: "Reserva de emergência", saved: 13000, target: 20000 },
  { name: "Viagem de fim de ano", saved: 4200, target: 8000 },
  { name: "Notebook novo", saved: 6100, target: 7000 },
];

const TRANSACTIONS: Transaction[] = [
  { title: "Salário", category: "Receita", date: "15 out.", amount: 8200 },
  { title: "Mercado Bom Preço", category: "Alimentação", date: "14 out.", amount: -312.4 },
  { title: "Aluguel", category: "Moradia", date: "10 out.", amount: -2400 },
  { title: "Reembolso viagem", category: "Trabalho", date: "08 out.", amount: 640 },
];

const PAYMENTS: Payment[] = [
  { id: "1", status: "Pago", email: "ken99@exemplo.com", amount: "R$ 316,00" },
  { id: "2", status: "Processando", email: "monserrat44@exemplo.com", amount: "R$ 837,00" },
  { id: "3", status: "Falhou", email: "carmella@exemplo.com", amount: "R$ 721,00" },
  { id: "4", status: "Pendente", email: "jason78@exemplo.com", amount: "R$ 450,00" },
];

const ORDER_TYPES = [
  { value: "mercado", label: "A mercado" },
  { value: "limitada", label: "Limitada" },
  { value: "agendada", label: "Agendada" },
];

const CURRENCIES = [
  { value: "BRL", label: "BRL" },
  { value: "USD", label: "USD" },
];

export const financeCardsDemos: DemoMap = {
  "goals-card": {
    playground: {
      controls: [
        { kind: "select", prop: "count", label: "Metas", options: ["1", "2", "3"], initial: "2" },
        { kind: "boolean", prop: "add", label: "Nova meta", initial: true },
      ],
      layout: "stretch",
      Preview: ({ values: v }) => (
        <div className={narrow}>
          <GoalsCard goals={GOALS.slice(0, Number(v.count))} onAdd={v.add ? () => {} : undefined} />
        </div>
      ),
      code: (v) =>
        jsx("GoalsCard", {
          goals: `{[{ name: "Reserva de emergência", saved: 13000, target: 20000 }, …]}`,
          onAdd: v.add ? "{criarMeta}" : undefined,
        }),
    },
    demos: [],
  },
  "invest-card": {
    playground: {
      controls: [{ kind: "text", prop: "asset", label: "Ativo", initial: "Tesouro Selic" }],
      layout: "stretch",
      Preview: function Preview({ values: v }) {
        const [amount, setAmount] = useState("1.000,00");
        const [order, setOrder] = useState("mercado");
        return (
          <div className={narrow}>
            <InvestCard
              asset={(v.asset as string) || undefined}
              amount={amount}
              onAmountChange={setAmount}
              orderTypes={ORDER_TYPES}
              orderType={order}
              onOrderTypeChange={setOrder}
              summary={[
                { label: "Corretagem", value: "R$ 0,00" },
                { label: "Rentabilidade", value: "10,4% a.a." },
              ]}
            />
          </div>
        );
      },
      code: (v) =>
        jsx("InvestCard", {
          asset: (v.asset as string) || undefined,
          amount: "{valor}",
          onAmountChange: "{setValor}",
          orderTypes: "{tipos}",
          orderType: "{tipo}",
          onOrderTypeChange: "{setTipo}",
          summary: `{[{ label: "Corretagem", value: "R$ 0,00" }, …]}`,
        }),
    },
    demos: [],
  },
  "limit-card": {
    playground: {
      controls: [{ kind: "boolean", prop: "notes", label: "Notas", initial: true }],
      layout: "stretch",
      Preview: function Preview({ values: v }) {
        const [limit, setLimit] = useState(2500);
        const [currency, setCurrency] = useState("BRL");
        return (
          <div className={narrow}>
            <LimitCard
              value={limit}
              onChange={setLimit}
              min={500}
              max={10000}
              currencies={CURRENCIES}
              currency={currency}
              onCurrencyChange={setCurrency}
              notes={v.notes as boolean}
            />
          </div>
        );
      },
      code: (v) =>
        jsx("LimitCard", {
          value: "{limite}",
          onChange: "{setLimite}",
          min: "{500}",
          max: "{10000}",
          currencies: "{moedas}",
          currency: "{moeda}",
          onCurrencyChange: "{setMoeda}",
          notes: v.notes ? undefined : "{false}",
        }),
    },
    demos: [],
  },
  "transaction-row": {
    playground: {
      controls: [{ kind: "select", prop: "kind", label: "Movimento", options: ["entrada", "saída"], initial: "saída" }],
      layout: "stretch",
      Preview: ({ values: v }) => (
        <div className={narrow}>
          <TransactionRow divider={false} transaction={v.kind === "entrada" ? TRANSACTIONS[0] : TRANSACTIONS[1]} />
        </div>
      ),
      code: (v) =>
        jsx("TransactionRow", {
          transaction:
            v.kind === "entrada"
              ? `{{ title: "Salário", category: "Receita", date: "15 out.", amount: 8200 }}`
              : `{{ title: "Mercado Bom Preço", category: "Alimentação", date: "14 out.", amount: -312.4 }}`,
        }),
    },
    demos: [],
  },
  "transactions-card": {
    playground: {
      controls: [{ kind: "select", prop: "count", label: "Linhas", options: ["2", "3", "4"], initial: "4" }],
      layout: "stretch",
      Preview: ({ values: v }) => (
        <div className={wide}>
          <TransactionsCard transactions={TRANSACTIONS.slice(0, Number(v.count))} />
        </div>
      ),
      code: () => jsx("TransactionsCard", { transactions: "{transacoes}", onViewAll: "{abrirExtrato}" }),
    },
    demos: [],
  },
  "payments-card": {
    playground: {
      controls: [{ kind: "select", prop: "count", label: "Linhas", options: ["2", "3", "4"], initial: "4" }],
      layout: "stretch",
      Preview: ({ values: v }) => (
        <div className={wide}>
          <PaymentsCard payments={PAYMENTS.slice(0, Number(v.count))} />
        </div>
      ),
      code: () => jsx("PaymentsCard", { payments: `{[{ id: "1", status: "Pago", email: "ken99@exemplo.com", amount: "R$ 316,00" }, …]}` }),
    },
    demos: [],
  },
};
