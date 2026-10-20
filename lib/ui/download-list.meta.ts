import type { ComponentMeta } from "./registry.types";

export const downloadListMeta: ComponentMeta[] = [
  {
    name: "DownloadList",
    slug: "download-list",
    category: "blocos",
    tier: "semantico",
    source: "download-list.tsx",
    description:
      "Arquivos para baixar: pacote em destaque no topo e um arquivo por linha (ícone, título + nome do arquivo, tamanho, download), separados por hairline. Com viewHref a linha abre a página de leitura e o botão continua baixando. Alimentada por dado.",
    related: ["list-row", "icon-tile"],
  },
];
