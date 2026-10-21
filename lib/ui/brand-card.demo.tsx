"use client";

import { brands } from "@/lib/tokens";
import { PenIcon, TrashCanIcon } from "@/lib/icons";
import { BrandCard, BrandCardAction } from "./brand-card";
import { Button, IconButton } from "./button";
import * as Icon from "./icons";
import type { DemoMap } from "./registry.types";

/** Valores por marca vindos dos tokens (brands.<id>.resolved), nunca hex escrito a mao. */
const DATA = {
  santo: { name: brands.santo.name, font: "Albert Sans" },
  vtsd: { name: brands.vtsd.name, font: "Sora" },
} as const;
const hex = (id: keyof typeof DATA, name: string) => (brands[id].resolved as Record<string, string>)[name] ?? "—";

export const brandCardDemos: DemoMap = {
  "brand-card": {
    playground: {
      controls: [{ kind: "select", prop: "brand", label: "Marca", options: ["santo", "vtsd"], initial: "santo" }],
      layout: "stretch",
      Preview: ({ values: v }) => {
        const id = v.brand as keyof typeof DATA;
        const d = DATA[id];
        return (
          <div className="w-full">
            <BrandCard
              brand={id}
              name={d.name}
              isDefault={id === "santo"}
              font={d.font}
              color={{ cssVar: "--santo-palette-brand-600", value: hex(id, "palette/brand/600") }}
              neutrals={{
                light: { cssVar: "--santo-palette-neutral-50", value: hex(id, "palette/neutral/50") },
                dark: { cssVar: "--santo-palette-neutral-950", value: hex(id, "palette/neutral/950") },
              }}
              radius={{ cssVar: "--santo-brand-shape-radius-base", value: hex(id, "brand/shape/radius-base") }}
            />
          </div>
        );
      },
      code: (v) => `<BrandCard brand="${v.brand}" name="…" font="…"
  color={{ cssVar, value }} neutrals={{ light, dark }} radius={{ cssVar, value }} />`,
    },
    demos: [
      {
        title: "Sistema: nome no lugar da logo",
        code: `<BrandCard
  name="Atlas"
  mark={<span className="santo-heading-6-semibold" style={{ fontFamily }}>Atlas</span>}
  meta="atlas · 21/10/2026"
  href="/estudio/atlas/cor"
  font="Fraunces · Albert Sans"
  fontStack={fontFamily}
  color={{ value }} neutrals={{ light: { value }, dark: { value } }} radius={{ value: "12px" }}
  actions={<IconButton size="sm" label="Renomear Atlas">…</IconButton>}
/>`,
        Preview: () => (
          <div className="w-full">
            <BrandCard
              name="Atlas"
              mark={<span className="santo-heading-6-semibold min-w-0 truncate text-text-primary">Atlas</span>}
              meta="atlas · 21/10/2026"
              font="Albert Sans"
              color={{ value: hex("vtsd", "palette/brand/600") }}
              neutrals={{ light: { value: hex("vtsd", "palette/neutral/50") }, dark: { value: hex("vtsd", "palette/neutral/950") } }}
              radius={{ value: hex("vtsd", "brand/shape/radius-base") }}
              actionsVisible
              actions={
                <>
                  <IconButton size="sm" label="Renomear Atlas">
                    <PenIcon size={16} />
                  </IconButton>
                  <IconButton size="sm" label="Duplicar Atlas">
                    <Icon.Copy size={16} />
                  </IconButton>
                  <IconButton size="sm" label="Apagar Atlas">
                    <TrashCanIcon size={16} />
                  </IconButton>
                </>
              }
            />
          </div>
        ),
      },
      {
        title: "Ficha de ação",
        code: `<BrandCardAction title="Novo sistema">
  <Button variant="secondary" leading={<Icon.Plus size={16} />}>Criar sistema</Button>
</BrandCardAction>`,
        Preview: () => (
          <div className="w-full">
            <BrandCardAction title="Novo sistema">
              <Button variant="secondary" leading={<Icon.Plus size={16} />}>
                Criar sistema
              </Button>
            </BrandCardAction>
          </div>
        ),
      },
    ],
  },
};
