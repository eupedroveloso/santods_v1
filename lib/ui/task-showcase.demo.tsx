"use client";

import { TaskAppPreview, TaskFeatureBento, TaskMetrics, TaskOnboarding } from "./task-showcase";
import type { DemoMap } from "./registry.types";

export const taskShowcaseDemos: DemoMap = {
  "task-app-preview": {
    playground: {
      controls: [{ kind: "select", prop: "variant", label: "Cena do produto", options: ["board", "sidebar"], initial: "board" }, { kind: "text", prop: "productName", label: "Produto", initial: "Compasso" }],
      layout: "stretch",
      code: (values) => `<TaskAppPreview productName="${values.productName}" variant="${values.variant}" />`,
      Preview: ({ values }) => <TaskAppPreview productName={String(values.productName)} variant={values.variant === "sidebar" ? "sidebar" : "board"} />,
    },
    demos: [{ title: "Quadro de tarefas", layout: "stretch", code: `<TaskAppPreview productName="Compasso" />`, Preview: TaskAppPreview }],
  },
  "task-feature-bento": { demos: [{ title: "Cinco recursos em ação", layout: "stretch", code: `<TaskFeatureBento />`, Preview: TaskFeatureBento }] },
  "task-metrics": { demos: [{ title: "Métricas escalonadas", layout: "stretch", code: `<TaskMetrics items={metricas} />`, Preview: TaskMetrics }] },
  "task-onboarding": { demos: [{ title: "Três passos para começar", layout: "stretch", code: `<TaskOnboarding productName="Compasso" />`, Preview: TaskOnboarding }] },
};
