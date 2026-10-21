"use client";

import { AppSidebar } from "./app-sidebar";
import { Card } from "./card";
import { EmptyState } from "./empty-state";
import { Palette, Type } from "./icons";
import { Overline } from "./overline";
import type { DemoMap } from "./registry.types";
import { EditorFrame } from "./editor-frame";

const NAV = [
  {
    title: "Estilos",
    items: [
      { href: "#cor", label: "Cor", icon: <Palette size={16} /> },
      { href: "#tipografia", label: "Tipografia", icon: <Type size={16} />, active: true },
    ],
  },
];

export const editorFrameDemos: DemoMap = {
  "editor-frame": {
    demos: [
      {
        title: "Três painéis",
        layout: "stretch",
        code: `<EditorFrame
  className="h-[calc(100dvh-var(--santo-dimension-size-56))]"
  nav={<AppSidebar groups={estilos} showRail={false} surface="sunken" />}
  mobileNav={<Select label="Estilo" … />}
  panel={<Card variant="double" header={abas}>…</Card>}
>
  <header>…</header>
  {documentoVivo}
</EditorFrame>`,
        Preview: () => (
          <Card variant="sunken" padded={false} className="h-(--santo-dimension-space-448) w-full overflow-hidden">
            <EditorFrame
              className="h-full bg-surface-page"
              nav={<AppSidebar groups={NAV} showRail={false} surface="sunken" label="Demo do editor" />}
              panel={
                <Card variant="double" padding="md" header={<Overline>Ajustes</Overline>}>
                  <EmptyState title="Presets" />
                </Card>
              }
            >
              <header className="flex flex-col gap-2xs">
                <Overline>Sistema</Overline>
                <h3 className="santo-heading-5-semibold text-text-primary">Tipografia</h3>
              </header>
              <EmptyState title="Escala" />
            </EditorFrame>
          </Card>
        ),
      },
    ],
  },
};
