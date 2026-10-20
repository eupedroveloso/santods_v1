"use client";

import { useState } from "react";
import { IconButton } from "./button";
import { Tag } from "./chip";
import { Calendar } from "./calendar";
import { Card } from "./card";
import { Avatar, AvatarGroup, Table, type CellRow, type Column } from "./data";
import * as Icon from "./icons";
import { PEOPLE, portrait, type Person } from "./demo-people";
import type { ControlValues, DemoMap } from "./registry.types";

type Payment = { id: string; status: "Pago" | "Processando" | "Falhou" | "Pendente"; email: string; amount: string };
const PERSON_KEYS = Object.keys(PEOPLE) as Person[];
const selectedPerson = (name: string) => PERSON_KEYS.find((key) => PEOPLE[key].name === name);

const PAYMENTS: Payment[] = [
  { id: "1", status: "Pago", email: "ken99@exemplo.com", amount: "R$ 316,00" },
  { id: "2", status: "Processando", email: "monserrat44@exemplo.com", amount: "R$ 837,00" },
  { id: "3", status: "Falhou", email: "carmella@exemplo.com", amount: "R$ 721,00" },
  { id: "4", status: "Pendente", email: "jason78@exemplo.com", amount: "R$ 450,00" },
];

const STATUS_INTENT = { Pago: "success", Processando: "info", Falhou: "danger", Pendente: "warning" } as const;

const COLUMNS: Column<Payment>[] = [
  { key: "status", header: "Status", render: (r) => <Tag intent={STATUS_INTENT[r.status]}>{r.status}</Tag> },
  { key: "email", header: "E-mail", render: (r) => <span className="text-text-secondary">{r.email}</span> },
  { key: "amount", header: "Valor", numeric: true, render: (r) => r.amount },
];

function TablePreview({ values: v }: { values: ControlValues }) {
  const [selected, setSelected] = useState<Set<string>>(new Set(["2"]));
  return (
    <div className="w-full">
      <Table
        columns={COLUMNS}
        rows={PAYMENTS}
        getKey={(r) => r.id}
        selected={v.selectable ? selected : undefined}
        onToggleRow={(k) =>
          setSelected((s) => {
            const next = new Set(s);
            if (next.has(k)) next.delete(k);
            else next.add(k);
            return next;
          })
        }
        onToggleAll={() =>
          setSelected((s) => (s.size === PAYMENTS.length ? new Set() : new Set(PAYMENTS.map((p) => p.id))))
        }
        rowAction={
          v.rowAction
            ? () => (
                <IconButton size="sm" label="Mais ações">
                  <Icon.More size={16} />
                </IconButton>
              )
            : undefined
        }
      />
    </div>
  );
}

export const dataDemos: DemoMap = {
  table: {
    playground: {
      controls: [
        { kind: "boolean", prop: "selectable", label: "Coluna de seleção", initial: true },
        { kind: "boolean", prop: "rowAction", label: "Coluna de ações", initial: true },
      ],
      layout: "stretch",
      Preview: TablePreview,
      code: (v) => `const columns: Column<Pagamento>[] = [
  { key: "status", header: "Status", render: (r) => <Tag intent={intent[r.status]}>{r.status}</Tag> },
  { key: "email", header: "E-mail", render: (r) => r.email },
  { key: "amount", header: "Valor", numeric: true, render: (r) => r.amount },
];

<Table
  columns={columns}
  rows={pagamentos}
  getKey={(r) => r.id}${v.selectable ? `
  selected={selecionadas}
  onToggleRow={alternarLinha}
  onToggleAll={alternarTodas}` : ""}${v.rowAction ? `
  rowAction={() => <IconButton size="sm" label="Mais ações"><Icon.More size={16} /></IconButton>}` : ""}
/>`,
    },
    demos: [
      {
        title: "Layout fixo",
        layout: "stretch",
        code: `const columns: Column<CellRow>[] = [
  { key: "item", header: "Item" },
  { key: "dono", header: "Responsável", width: 160 },
  { key: "valor", header: "Valor", numeric: true, width: 120 },
];

<Table layout="fixed" columns={columns} rows={entradas} />
<Table layout="fixed" columns={columns} rows={saidas} />   // colunas alinham`,
        Preview: () => {
          const columns: Column<CellRow>[] = [
            { key: "item", header: "Item" },
            { key: "dono", header: "Responsável", width: 160 },
            { key: "valor", header: "Valor", numeric: true, width: 120 },
          ];
          return (
            <div className="flex w-full flex-col gap-lg">
              <Table
                layout="fixed"
                columns={columns}
                rows={[
                  { key: "a", item: "Assinatura anual do plano empresarial com suporte prioritário", dono: PEOPLE.erica.name, valor: "R$ 4.800,00" },
                  { key: "b", item: "Consultoria", dono: PEOPLE.sena.name, valor: "R$ 1.250,00" },
                ]}
              />
              <Table
                layout="fixed"
                columns={columns}
                rows={[{ key: "c", item: "Hospedagem", dono: PEOPLE.pedro.name, valor: "R$ 320,00" }]}
              />
            </div>
          );
        },
      },
      {
        title: "Células prontas",
        layout: "stretch",
        code: `const columns: Column<CellRow>[] = [
  { key: "status", header: "Status" },
  { key: "valor", header: "Valor", numeric: true },
];
const rows: CellRow[] = pagamentos.map((p) => ({
  key: p.id,
  status: <Tag intent="success">{p.status}</Tag>,
  valor: p.amount,
}));

<Table columns={columns} rows={rows} />`,
        Preview: () => (
          <div className="w-full">
            <Table<CellRow>
              columns={[
                { key: "status", header: "Status" },
                { key: "valor", header: "Valor", numeric: true },
              ]}
              rows={PAYMENTS.map((p) => ({
                key: p.id,
                status: <Tag intent={STATUS_INTENT[p.status]}>{p.status}</Tag>,
                valor: p.amount,
              }))}
            />
          </div>
        ),
      },
      {
        title: "Lista simples",
        layout: "stretch",
        code: `<Table columns={columns} rows={pagamentos} getKey={(r) => r.id} />`,
        Preview: () => (
          <div className="w-full">
            <Table columns={COLUMNS} rows={PAYMENTS} getKey={(r) => r.id} />
          </div>
        ),
      },
    ],
  },
  avatar: {
    playground: {
      controls: [
        { kind: "select", prop: "person", label: "Pessoa", options: [...PERSON_KEYS.map((key) => PEOPLE[key].name), "Iniciais"], initial: PEOPLE.leo.name },
        { kind: "select", prop: "size", label: "Tamanho", options: ["24", "32", "40"], initial: "40" },
      ],
      Preview: ({ values: v }) => {
        const size = Number(v.size) as 24 | 32 | 40;
        const key = selectedPerson(String(v.person));
        return key ? (
          <Avatar {...portrait(key, size)} size={size} />
        ) : (
          <Avatar name="Alex Ribeiro" size={size} />
        );
      },
      code: (v) => {
        const key = selectedPerson(String(v.person));
        return key
          ? `<Avatar {...portrait("${key}", ${v.size})} size={${v.size}} />`
          : `<Avatar name="Alex Ribeiro" size={${v.size}} />`;
      },
    },
    demos: [],
  },
  "avatar-group": {
    demos: [
      {
        title: "Básico",
        code: `<AvatarGroup>
  <Avatar {...portrait("pedro", 40)} size={40} />
  <Avatar {...portrait("erica", 40)} size={40} />
  <Avatar {...portrait("sena", 40)} size={40} />
  <Avatar {...portrait("leo", 40)} size={40} />
  <Avatar {...portrait("clara", 40)} size={40} />
</AvatarGroup>`,
        Preview: () => (
          <AvatarGroup>
            {PERSON_KEYS.map((p) => (
              <Avatar key={p} {...portrait(p, 40)} size={40} />
            ))}
          </AvatarGroup>
        ),
      },
    ],
  },
  calendar: {
    playground: {
      controls: [{ kind: "select", prop: "mode", label: "Modo", options: ["single", "range"], initial: "range" }],
      // key por modo: trocar de modo recomeca a selecao.
      Preview: ({ values: v }) => (
        <Card className="w-fit">
          <Calendar
            key={v.mode as string}
            month="Junho"
            year={2026}
            mode={v.mode as "single" | "range"}
            selected={v.mode === "range" ? [8, 9, 10, 11, 12] : [8]}
            today={13}
          />
        </Card>
      ),
      code: (v) =>
        v.mode === "range"
          ? `<Calendar month="Junho" year={2026} mode="range" selected={[8, 9, 10, 11, 12]} today={13} onSelect={(dias) => …} />`
          : `<Calendar month="Junho" year={2026} selected={[8]} today={13} onSelect={(dias) => …} />`,
    },
    demos: [],
  },
};
