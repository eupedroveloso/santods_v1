"use client";

import { useState } from "react";
import { Button } from "./button";
import { DashboardHeader } from "./dashboard-header";
import { Segmented } from "./segmented";
import type { DemoMap } from "./registry.types";

const PERIODS = [
  { value: "7d", label: "7 dias" },
  { value: "30d", label: "30 dias" },
  { value: "12m", label: "12 meses" },
];

function Example() {
  const [period, setPeriod] = useState("30d");
  return (
    <DashboardHeader
      title="Dashboard"
      meta="Atualizado há 2 min"
      filter={<Segmented value={period} onChange={setPeriod} options={PERIODS} />}
      action={<Button variant="primary">Nova transação</Button>}
    />
  );
}

export const dashboardHeaderDemos: DemoMap = {
  "dashboard-header": {
    demos: [
      {
        title: "Título, período e ação",
        layout: "stretch",
        code: `<DashboardHeader title="Dashboard" meta="Atualizado há 2 min"
  filter={<Segmented value={periodo} onChange={setPeriodo} options={PERIODOS} />}
  action={<Button variant="primary">Nova transação</Button>} />`,
        Preview: Example,
      },
    ],
  },
};
