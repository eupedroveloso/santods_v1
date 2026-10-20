import type { ComponentMeta } from "./registry.types";

export const taskShowcaseMeta: ComponentMeta[] = [
  {
    name: "TaskAppPreview",
    slug: "task-app-preview",
    category: "blocos",
    tier: "marketing",
    source: "task-showcase.tsx",
    description: "Demonstre um produto de tarefas com quatro colunas, pessoas, prazos e progresso. Busca, quadro/lista, criação e conclusão funcionam localmente; sidebar inclui a navegação do app.",
    related: ["task-feature-bento", "task-onboarding", "card-grid"],
  },
  {
    name: "TaskFeatureBento",
    slug: "task-feature-bento",
    category: "blocos",
    tier: "marketing",
    source: "task-showcase.tsx",
    description: "Apresente cinco recursos com pequenas interfaces de organização, atribuição automática, conversa, progresso e tabela de projetos e equipes; mensagens e atribuição funcionam na demonstração.",
    related: ["task-app-preview", "task-metrics", "bento-grid"],
  },
  {
    name: "TaskMetrics",
    slug: "task-metrics",
    category: "blocos",
    tier: "marketing",
    source: "task-showcase.tsx",
    description: "Números de uma narrativa de marketing em quatro cartões com alturas alternadas, gradiente nos altos e ícone de direção, alimentados por dados.",
    related: ["task-feature-bento", "mini-bars", "stat-card"],
  },
  {
    name: "TaskOnboarding",
    slug: "task-onboarding",
    category: "blocos",
    tier: "marketing",
    source: "task-showcase.tsx",
    description: "Mostre a entrada em um produto com app e sidebar recortados à esquerda, três etapas recolhíveis à direita e duas pequenas interfaces de login no primeiro passo.",
    related: ["task-app-preview", "disclosure", "input"],
  },
];
