"use client";

import { ActivityCard, AppFrame, ChartCard, ChatCard, type ChartRange } from "./app-cards";
import { PEOPLE, photo } from "./demo-people";
import { jsx } from "./demo-kit";
import * as Icon from "./icons";
import type { DemoMap } from "./registry.types";

const narrow = "mx-auto w-full max-w-(--santo-dimension-space-384)";
const wide = "mx-auto w-full max-w-(--santo-dimension-container-sm)";

const WEEK = ["seg", "ter", "qua", "qui", "sex", "sáb", "dom"];
const RANGES: ChartRange<string>[] = [
  { value: "7d", label: "7 dias", labels: WEEK, series: [{ name: "Visitantes", values: [1800, 2200, 1900, 2400, 2100, 1300, 1100] }] },
  {
    value: "4s",
    label: "4 semanas",
    labels: ["sem 1", "sem 2", "sem 3", "sem 4"],
    series: [{ name: "Visitantes", values: [11200, 12800, 12100, 14300] }],
  },
];
const RANGES_2: ChartRange<string>[] = RANGES.map((r) => ({
  ...r,
  series: [...r.series, { name: "Retorno", values: r.series[0].values.map((v) => Math.round(v * 0.4)) }],
}));

const ACTIVITY = [
  {
    who: PEOPLE.erica.name,
    avatarSrc: photo("erica"),
    when: "há 2 min",
    kind: "reunioes",
    what: "marcou uma call amanhã, das 16h às 17h",
    marker: { icon: <Icon.Plus size={12} />, label: "Reunião de time" },
  },
  {
    who: PEOPLE.pedro.name,
    avatarSrc: photo("pedro"),
    when: "há 9 min",
    kind: "tarefas",
    what: "concluiu o Sprint 12",
    marker: { icon: <Icon.Check size={12} />, label: "Sprint 12" },
  },
];

export const appCardsDemos: DemoMap = {
  "chat-card": {
    playground: {
      controls: [
        { kind: "boolean", prop: "typing", label: "Digitando", initial: true },
        { kind: "boolean", prop: "attachment", label: "Anexo", initial: false },
      ],
      layout: "stretch",
      Preview: ({ values: v }) => (
        <div className={narrow}>
          <ChatCard
            key={String(v.attachment)}
            person={{ name: PEOPLE.erica.name, avatarSrc: photo("erica", 40), status: "Online" }}
            actions={[{ icon: <Icon.Plus size={16} />, label: "Adicionar pessoa" }]}
            typing={v.typing as boolean}
            messages={[
              { text: "Oi! Em que posso ajudar hoje?" },
              v.attachment
                ? { from: "me", attachment: { name: "Comprovante.pdf", size: "220 KB" }, time: "10:15" }
                : { from: "me", text: "Estou com problema para entrar na conta.", reactions: [["❤️", 1]] },
            ]}
          />
        </div>
      ),
      code: (v) =>
        jsx("ChatCard", {
          person: `{{ name: "Érica", avatarSrc, status: "Online" }}`,
          messages: v.attachment
            ? `{[{ text: "Oi!" }, { from: "me", attachment: { name: "Comprovante.pdf", size: "220 KB" } }]}`
            : `{[{ text: "Oi!" }, { from: "me", text: "Estou com problema…" }]}`,
          typing: v.typing as boolean,
          onSend: "{enviar}",
        }),
    },
    demos: [],
  },
  "activity-card": {
    playground: {
      controls: [
        { kind: "boolean", prop: "tabs", label: "Abas", initial: true },
        { kind: "boolean", prop: "action", label: "FAB", initial: true },
      ],
      layout: "stretch",
      Preview: ({ values: v }) => (
        <div className={narrow}>
          <ActivityCard
            items={ACTIVITY}
            tabs={
              v.tabs
                ? [
                    { value: "tudo", label: "Tudo" },
                    { value: "tarefas", label: "Tarefas" },
                    { value: "reunioes", label: "Reuniões" },
                  ]
                : undefined
            }
            action={v.action ? { icon: <Icon.Plus size={16} />, label: "Nova mensagem" } : undefined}
          />
        </div>
      ),
      code: (v) =>
        jsx("ActivityCard", {
          items: "{atividades}",
          tabs: v.tabs ? `{[{ value: "tudo", label: "Tudo" }, …]}` : undefined,
          action: v.action ? `{{ icon: <Icon.Plus size={16} />, label: "Nova mensagem" }}` : undefined,
        }),
    },
    demos: [],
  },
  "chart-card": {
    playground: {
      controls: [
        { kind: "select", prop: "kind", label: "Gráfico", options: ["area", "line", "bar"], initial: "area" },
        { kind: "select", prop: "series", label: "Séries", options: ["1", "2"], initial: "1" },
        { kind: "boolean", prop: "stacked", label: "Empilhado", initial: false },
      ],
      layout: "stretch",
      Preview: ({ values: v }) => (
        <div className={wide}>
          <ChartCard
            title="Visitantes"
            meta="12,4 mil"
            kind={v.kind as "area" | "line" | "bar"}
            stacked={v.stacked as boolean}
            ranges={v.series === "2" ? RANGES_2 : RANGES}
          />
        </div>
      ),
      code: (v) =>
        jsx("ChartCard", {
          title: "Visitantes",
          meta: "12,4 mil",
          kind: v.kind === "area" ? undefined : (v.kind as string),
          stacked: v.stacked as boolean,
          ranges: `{[{ value: "7d", label: "7 dias", labels: dias, series: [{ name: "Visitantes", values }] }, …]}`,
        }),
    },
    demos: [],
  },
  "app-frame": {
    playground: {
      controls: [
        { kind: "select", prop: "layout", label: "Conteúdo", options: ["stack", "split"], initial: "split" },
        { kind: "boolean", prop: "nav", label: "Painel de navegação", initial: false },
      ],
      layout: "stretch",
      Preview: ({ values: v }) => (
        <AppFrame
          layout={v.layout as "stack" | "split"}
          rail={[
            { icon: <Icon.Grid size={20} />, label: "Painel", active: true },
            { icon: <Icon.TrendUp size={20} />, label: "Análises", dot: true },
            { icon: <Icon.Book size={20} />, label: "Documentos" },
          ]}
          user={{ name: PEOPLE.pedro.name, email: "pedro@exemplo.com", avatarSrc: photo("pedro") }}
          nav={
            v.nav
              ? {
                  title: "Acme Ltda.",
                  items: [
                    { id: "visao", label: "Visão geral", icon: <Icon.Grid size={16} />, active: true },
                    { id: "projetos", label: "Projetos", icon: <Icon.Layers size={16} />, count: 12 },
                  ],
                }
              : undefined
          }
        >
          <ActivityCard padding="md" items={ACTIVITY} />
          <ChartCard className="min-w-0 flex-1" title="Visitantes" ranges={RANGES.slice(0, 1)} kind="bar" />
        </AppFrame>
      ),
      code: (v) =>
        `${jsx("AppFrame", {
          layout: v.layout === "stack" ? undefined : (v.layout as string),
          rail: `{[{ icon: <Icon.Grid size={20} />, label: "Painel", active: true }, …]}`,
          user: `{{ name: "Pedro", email: "pedro@exemplo.com" }}`,
          nav: v.nav ? `{{ title: "Acme Ltda.", items: [...] }}` : undefined,
        }).replace(" />", ">")}\n  <ActivityCard … />\n  <ChartCard … />\n</AppFrame>`,
    },
    demos: [],
  },
};
