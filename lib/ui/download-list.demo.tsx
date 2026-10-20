"use client";

import { DownloadList } from "./download-list";
import type { DemoMap } from "./registry.types";

const ITEMS = [
  { href: "#contexto-completo.txt", title: "Contexto completo", viewHref: "#contexto-completo", size: 281476, featured: true },
  { href: "#00-leia-me.md", title: "Leia-me", viewHref: "#leia-me", size: 8551 },
  { href: "#02-tokens.md", title: "Tokens e variáveis", viewHref: "#tokens", size: 75977 },
];

export const downloadListDemos: DemoMap = {
  "download-list": {
    demos: [
      {
        title: "Pacote + arquivos",
        layout: "stretch",
        code: `<DownloadList items={[{ href, viewHref, title, size, featured }, …]} />`,
        Preview: () => (
          <div className="mx-auto w-full max-w-(--santo-dimension-container-sm)">
            <DownloadList items={ITEMS} />
          </div>
        ),
      },
    ],
  },
};
