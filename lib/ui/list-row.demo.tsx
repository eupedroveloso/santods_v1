"use client";

import { Avatar } from "./data";
import { IconButton } from "./button";
import { IconTile } from "./icon-tile";
import * as Icon from "./icons";
import { ListRow } from "./list-row";
import type { DemoMap } from "./registry.types";

export const listRowDemos: DemoMap = {
  "list-row": {
    demos: [
      {
        title: "Com ícone",
        layout: "stretch",
        code: `<ListRow
  leading={<IconTile><Icon.ArrowDownLeft size={16} /></IconTile>}
  title="Depósito"
  meta="12 out"
  trailing="R$ 650,00"
  divider
/>`,
        Preview: () => (
          <div className="mx-auto w-full max-w-(--santo-dimension-space-384)">
            {[
              { t: "Depósito", m: "12 out", v: "R$ 650,00", i: <Icon.ArrowDownLeft size={16} /> },
              { t: "Saque", m: "9 out", v: "− R$ 120,00", i: <Icon.ArrowUpRight size={16} /> },
              { t: "Rendimento", m: "1 out", v: "R$ 18,40", i: <Icon.TrendUp size={16} /> },
            ].map((r) => (
              <ListRow key={r.t} leading={<IconTile>{r.i}</IconTile>} title={r.t} meta={r.m} trailing={r.v} divider />
            ))}
          </div>
        ),
      },
      {
        title: "Com avatar",
        layout: "stretch",
        code: `<ListRow leading={<Avatar name="Érica Nunes" src="/brand/avatar-erica-96.webp" />} title="Érica Nunes" meta="erica@exemplo.com" trailing={<IconButton …/>} />`,
        Preview: () => (
          <div className="mx-auto w-full max-w-(--santo-dimension-space-384)">
            {[
              { n: "Érica Nunes", src: "/brand/avatar-erica-96.webp" },
              { n: "Sena Rocha", src: "/brand/avatar-sena-96.webp" },
            ].map(({ n, src }) => (
              <ListRow
                key={n}
                leading={<Avatar name={n} src={src} />}
                title={n}
                meta={`${n.split(" ")[0].toLowerCase()}@exemplo.com`}
                trailing={
                  <IconButton size="sm" label={`Opções de ${n}`}>
                    <Icon.More size={16} />
                  </IconButton>
                }
                divider
              />
            ))}
          </div>
        ),
      },
    ],
  },
};
