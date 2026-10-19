"use client";

import { Divider } from "./card";
import { KeyValue } from "./key-value";
import type { DemoMap } from "./registry.types";

export const keyValueDemos: DemoMap = {
  "key-value": {
    demos: [
      {
        title: "Resumo de pedido",
        layout: "stretch",
        code: `<KeyValue label="Subtotal" value="R$ 120,00" />
<KeyValue label="Taxa" value="R$ 2,00" />
<Divider />
<KeyValue label="Total" value="R$ 122,00" emphasis />`,
        Preview: () => (
          <div className="mx-auto flex w-full max-w-(--santo-dimension-space-320) flex-col gap-xs">
            <KeyValue label="Subtotal" value="R$ 120,00" />
            <KeyValue label="Taxa" value="R$ 2,00" />
            <KeyValue label="Desconto" value="− R$ 10,00" />
            <Divider />
            <KeyValue label="Total" value="R$ 112,00" emphasis />
          </div>
        ),
      },
    ],
  },
};
