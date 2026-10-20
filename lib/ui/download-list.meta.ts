import type { ComponentMeta } from "./registry.types";

export const downloadListMeta: ComponentMeta[] = [
  {
    name: "DownloadList",
    slug: "download-list",
    category: "blocos",
    tier: "semantico",
    source: "download-list.tsx",
    description:
      "Arquivos para baixar: pacote em destaque no topo e um arquivo por linha (ícone, título, descrição curta, tamanho, download), separados por hairline. Alimentada por dado.",
    related: ["list-row", "icon-tile"],
  },
];
