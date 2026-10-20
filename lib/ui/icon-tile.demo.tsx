"use client";

import { Card } from "./card";
import { IconTile } from "./icon-tile";
import * as Icon from "./icons";
import type { DemoMap } from "./registry.types";

export const iconTileDemos: DemoMap = {
  "icon-tile": {
    playground: {
      controls: [
        { kind: "select", prop: "tone", label: "Tom", options: ["plain", "brand", "success", "danger", "subtle", "outline"], initial: "plain" },
        { kind: "select", prop: "shape", label: "Forma", options: ["square", "round"], initial: "square" },
        { kind: "select", prop: "size", label: "Tamanho", options: ["md", "lg"], initial: "md" },
      ],
      // outline e a pastilha elevada: aparece sobre chao; os outros sobre cartao.
      Preview: ({ values: v }) => (
        <Card variant={v.tone === "outline" ? "sunken" : "raised"} padding="lg" className="items-center">
          <IconTile tone={v.tone as "plain" | "subtle" | "outline" | "brand" | "success" | "danger"} shape={v.shape as "square" | "round"} size={v.size as "md" | "lg"}>
            {v.size === "lg" ? <Icon.Palette size={20} /> : <Icon.File size={16} />}
          </IconTile>
        </Card>
      ),
      code: (v) =>
        `<IconTile${v.tone !== "plain" ? ` tone="${v.tone}"` : ""}${v.shape !== "square" ? ` shape="${v.shape}"` : ""}${
          v.size !== "md" ? ` size="${v.size}"` : ""
        }>${v.size === "lg" ? "<Icon.Palette size={20} />" : "<Icon.File size={16} />"}</IconTile>`,
    },
    demos: [],
  },
};
