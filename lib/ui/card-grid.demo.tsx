"use client";

import { Button } from "./button";
import { Card, CardHeader, Stat } from "./card";
import { CardGrid, type CardGridColumns } from "./card-grid";
import { Count, Tag } from "./chip";
import { KeyValue } from "./key-value";
import { MiniBars } from "./mini-bars";
import { Sparkline } from "./sparkline";
import type { DemoMap } from "./registry.types";

const SERIES = [6, 5, 4, 14, 8, 7, 9, 8, 10, 9];

export const cardGridDemos: DemoMap = {
  "card-grid": {
    playground: {
      controls: [{ kind: "select", prop: "cols", label: "Colunas (md+)", options: ["1", "2", "3"], initial: "3" }],
      layout: "stretch",
      Preview: ({ values: v }) => (
        <CardGrid columns={{ md: Number(v.cols) as CardGridColumns }} gap="md" className="w-full">
          <Card>
            <Stat
              label="Receita"
              value="15.231"
              unit="R$ no mês"
              action={<Tag intent="success">+20,1%</Tag>}
              viz={<Sparkline values={SERIES} area label="Receita, 10 dias" />}
            />
          </Card>
          <Card>
            <Stat
              label="Exercício"
              value="42"
              unit="min hoje"
              viz={<MiniBars values={[30, 25, 20, 55, 38, 34, 42]} highlight={6} size="md" label="Minutos por dia" />}
            />
            <Card variant="well" padding="md">
              <KeyValue label="Média" value="35 min" />
              <KeyValue label="Recorde" value="55 min" />
            </Card>
          </Card>
          <Card>
            <CardHeader title="Plano" meta={<Count>Pro</Count>} />
            <Button block>Assinar</Button>
          </Card>
        </CardGrid>
      ),
      code: (v) => `<CardGrid columns={{ md: ${v.cols} }} gap="md">
  <Card>…</Card>   {/* masonry: cada cartão na altura do conteúdo, */}
  <Card>…</Card>   {/* empilhado na coluna sem vão */}
</CardGrid>`,
    },
    demos: [
      {
        title: "Auto-fill",
        layout: "stretch",
        code: `<CardGrid minItem="space-192" gap="md" masonry={false}>…</CardGrid>`,
        Preview: () => (
          <CardGrid minItem="space-192" gap="md" masonry={false} className="w-full">
            {["Pedidos", "Clientes", "Ticket", "Retenção"].map((label, i) => (
              <Card key={label} padding="md">
                <Stat size="sm" label={label} value={String((i + 1) * 128)} />
              </Card>
            ))}
          </CardGrid>
        ),
      },
    ],
  },
};
