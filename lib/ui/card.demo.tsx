"use client";

import type { ShadowName } from "@/lib/tokens";
import { Button, IconButton } from "./button";
import { Card, CardFooter, CardHeader, Divider, Stat, type CardVariant } from "./card";
import { Count, Tag } from "./chip";
import * as Icon from "./icons";
import { IconTile } from "./icon-tile";
import { LineChart } from "./chart";
import { MiniBars } from "./mini-bars";
import { Ring } from "./ring";
import { Sparkline } from "./sparkline";
import type { DemoMap } from "./registry.types";

const VARIANTS = ["raised", "well", "inset", "sunken", "outlined", "dashed", "double"];
const ELEVATIONS = ["none", "xs", "sm", "md", "lg", "xl", "2xl"];
const SERIES = [6, 5, 4, 14, 8, 7, 9, 8, 10, 9];

/** Corpo comum das variantes: titulo + meta, grafico, acao. */
function Body({ title }: { title: string }) {
  return (
    <>
      <CardHeader
        title={title}
        meta={<Count>10</Count>}
        action={
          <IconButton size="sm" variant="ghost" label="Mais opções">
            <Icon.More size={16} />
          </IconButton>
        }
      />
      <LineChart values={SERIES} />
    </>
  );
}

export const cardDemos: DemoMap = {
  card: {
    playground: {
      controls: [
        { kind: "select", prop: "variant", label: "Variante", options: VARIANTS, initial: "raised" },
        { kind: "select", prop: "elevation", label: "Elevação", options: ELEVATIONS, initial: "sm" },
        { kind: "text", prop: "title", label: "Título", initial: "Meta diária" },
      ],
      layout: "stretch",
      Preview: ({ values: v }) => {
        const variant = v.variant as CardVariant;
        const width = "mx-auto w-full max-w-(--santo-dimension-space-384)";
        // well e inset vivem DENTRO de um cartao: mostrados no pai certo.
        if (variant === "well" || variant === "inset")
          return (
            <Card className={width}>
              <CardHeader title={v.title as string} meta={<Count>10</Count>} />
              <Card variant={variant}>
                <LineChart values={SERIES} />
              </Card>
            </Card>
          );
        if (variant === "double")
          return (
            <Card
              variant="double"
              className={width}
              header={<CardHeader title={v.title as string} meta={<Count>10</Count>} />}
              footer={
                <CardFooter>
                  <Button>Cancelar</Button>
                  <Button variant="primary">Salvar</Button>
                </CardFooter>
              }
            >
              <LineChart values={SERIES} />
            </Card>
          );
        return (
          <Card variant={variant} elevation={v.elevation as ShadowName} className={width}>
            <Body title={v.title as string} />
          </Card>
        );
      },
      code: (v) =>
        v.variant === "well" || v.variant === "inset"
          ? `<Card>
  <CardHeader title="${v.title}" meta={<Count>10</Count>} />
  <Card variant="${v.variant}">…</Card>
</Card>`
          : v.variant === "double"
            ? `<Card
  variant="double"
  header={<CardHeader title="${v.title}" meta={<Count>10</Count>} />}
  footer={<CardFooter>…</CardFooter>}
>
  …
</Card>`
            : `<Card${v.variant !== "raised" ? ` variant="${v.variant}"` : ""}${v.elevation !== "sm" && v.variant === "raised" ? ` elevation="${v.elevation}"` : ""}>
  <CardHeader title="${v.title}" meta={<Count>10</Count>} action={<IconButton variant="ghost" …/>} />
  <LineChart values={valores} />
</Card>`,
    },
    demos: [
      {
        title: "Níveis tonais",
        layout: "stretch",
        code: `<Card variant="sunken">          // nível 0: chão
  <Card>                         // nível 1: cartão
    <Card variant="well">…</Card> // nível 2: poço, raio = interno do pai
  </Card>
</Card>`,
        Preview: () => (
          <Card variant="sunken" padding="sm" className="mx-auto w-full max-w-(--santo-dimension-space-448)">
            <Card radius="xs">
              <CardHeader title="Pedidos" meta={<Count>128</Count>} />
              <Card variant="well">
                <MiniBars values={[4, 6, 5, 9, 8, 12, 10]} highlight={-1} size="md" label="Pedidos por dia" className="text-icon-brand" />
              </Card>
            </Card>
          </Card>
        ),
      },
    ],
  },
  "card-header": {
    demos: [
      {
        title: "Título + meta",
        layout: "stretch",
        code: `<CardHeader
  leading={<IconTile><Icon.ArrowTrendUpIcon size={16} /></IconTile>}
  title="Pagamentos"
  meta={<Count>12</Count>}
  action={<IconButton size="sm" variant="ghost" label="Mais"><Icon.More size={16} /></IconButton>}
/>`,
        Preview: () => (
          <Card className="mx-auto w-full max-w-(--santo-dimension-space-384)">
            <CardHeader
              leading={<IconTile><Icon.ArrowTrendUpIcon size={16} /></IconTile>}
              title="Pagamentos"
              meta={<Count>12</Count>}
              action={
                <IconButton size="sm" variant="ghost" label="Mais">
                  <Icon.More size={16} />
                </IconButton>
              }
            />
          </Card>
        ),
      },
    ],
  },
  "card-footer": {
    demos: [
      {
        title: "Básico",
        layout: "stretch",
        code: `<CardFooter><Button>Cancelar</Button><Button variant="primary">Salvar</Button></CardFooter>`,
        Preview: () => (
          <Card className="mx-auto w-full max-w-(--santo-dimension-space-384)">
            <CardHeader title="Plano" />
            <CardFooter>
              <Button>Cancelar</Button>
              <Button variant="primary">Salvar</Button>
            </CardFooter>
          </Card>
        ),
      },
    ],
  },
  stat: {
    playground: {
      controls: [
        { kind: "select", prop: "viz", label: "Micro-viz", options: ["sparkline", "barras", "anel", "nenhuma"], initial: "sparkline" },
        { kind: "select", prop: "size", label: "Tamanho", options: ["sm", "md", "lg"], initial: "md" },
      ],
      Preview: ({ values: v }) => {
        const viz =
          v.viz === "sparkline" ? (
            <Sparkline values={SERIES} size="md" area label="Receita nos últimos 10 dias" />
          ) : v.viz === "barras" ? (
            <MiniBars values={[4, 6, 5, 9, 8, 12, 10]} highlight={-1} size="md" label="Receita por dia" />
          ) : v.viz === "anel" ? (
            <Ring value={72} size="md" tone="brand" label="72% da meta" />
          ) : undefined;
        return (
          <Card className="w-full max-w-(--santo-dimension-space-320)">
            <Stat
              size={v.size as "sm" | "md" | "lg"}
              label="Receita"
              value="15.231"
              unit="R$ no mês"
              delta={<Tag intent="success">+20,1%</Tag>}
              viz={viz}
            />
          </Card>
        );
      },
      code: (v) => `<Stat
  label="Receita"
  value="15.231"
  unit="R$ no mês"
  delta={<Tag intent="success">+20,1%</Tag>}${v.size !== "md" ? `
  size="${v.size}"` : ""}${v.viz === "nenhuma" ? "" : `
  viz={${v.viz === "sparkline" ? "<Sparkline values={serie} area />" : v.viz === "barras" ? "<MiniBars values={serie} highlight={-1} />" : '<Ring value={72} tone="brand" label="72% da meta" />'}}`}
/>`,
    },
    demos: [],
  },
  divider: {
    demos: [
      {
        title: "Básico",
        layout: "stretch",
        code: `<Divider />
<Divider label="ou continue com" />
<Divider orientation="vertical" />`,
        Preview: () => (
          <div className="santo-body-small-regular mx-auto flex w-full max-w-(--santo-dimension-space-320) flex-col gap-sm text-text-secondary">
            <span>Acima</span>
            <Divider />
            <span>Abaixo</span>
            <Divider label="ou continue com" />
            <div className="flex h-lg items-center gap-sm">
              <span>Esquerda</span>
              <Divider orientation="vertical" />
              <span>Direita</span>
            </div>
          </div>
        ),
      },
    ],
  },
};
