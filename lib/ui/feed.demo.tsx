"use client";

import { ActivityItem, Marker, Ticker } from "./feed";
import * as Icon from "./icons";
import { PEOPLE, photo } from "./demo-people";
import type { DemoMap } from "./registry.types";

export const feedDemos: DemoMap = {
  "activity-item": {
    demos: [
      {
        title: "Básico",
        layout: "stretch",
        code: `<ActivityItem
  who="Érica Nunes"
  avatarSrc="/brand/avatar-erica-96.webp"
  when="há 9 min"
  what={<>concluiu o <strong>Sprint 12</strong></>}
  marker={<Marker icon={<Icon.Check size={12} />}>Todas as tarefas feitas</Marker>}
/>`,
        Preview: () => (
          <div className="mx-auto flex w-full max-w-(--santo-dimension-space-384) flex-col divide-y divide-border-subtle">
            <ActivityItem
              who={PEOPLE.pedro.name}
              avatarSrc={photo("pedro")}
              when="há 2 min"
              what={<>marcou uma call amanhã, das <strong className="text-text-primary">16h às 17h</strong></>}
              marker={<Marker icon={<Icon.Plus size={12} />}>Reunião de time</Marker>}
            />
            <ActivityItem
              who={PEOPLE.erica.name}
              avatarSrc={photo("erica")}
              when="há 9 min"
              what={<>concluiu o <strong className="text-text-primary">Sprint 12</strong></>}
              marker={<Marker icon={<Icon.Check size={12} />}>Todas as tarefas feitas</Marker>}
            />
          </div>
        ),
      },
    ],
  },
  marker: {
    demos: [
      {
        title: "Básico",
        code: `<Marker icon={<Icon.Figma size={12} />}>Home_v3.fig</Marker>`,
        Preview: () => (
          <div className="flex flex-wrap items-center gap-xs">
            <Marker icon={<Icon.Figma size={12} />}>Home_v3.fig</Marker>
            <Marker icon={<Icon.Save size={12} />}>Relatorio.pdf</Marker>
          </div>
        ),
      },
    ],
  },
  ticker: {
    demos: [
      {
        title: "Básico",
        layout: "stretch",
        code: `<Ticker items={[{ symbol: "ACME", name: "Acme", value: "R$ 84.231,50", delta: -0.42 }, …]} />`,
        Preview: () => (
          <div className="w-full">
            <Ticker
              items={[
                { symbol: "SDCN", name: "Shadcn", value: "R$ 120.748,00", delta: 1.25 },
                { symbol: "ACME", name: "Acme", value: "R$ 84.231,50", delta: -0.42 },
                { symbol: "TWKN", name: "Tweakn", value: "R$ 45.019,75", delta: 2.18 },
              ]}
            />
          </div>
        ),
      },
    ],
  },
};
