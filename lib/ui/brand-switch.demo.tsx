"use client";

import { useState } from "react";
import { BrandLogo } from "./brand-logo";
import { BrandSwitch } from "./brand-switch";
import { Button } from "./button";
import type { DemoMap } from "./registry.types";

const BRANDS = [
  { id: "santo", label: "Santo" },
  { id: "vtsd", label: "VTSD" },
];

function Example() {
  const [brand, setBrand] = useState("santo");
  return (
    <div className="flex flex-col items-center gap-md">
      <BrandSwitch brands={BRANDS} value={brand} onChange={setBrand} />
      {/* data-brand num contêiner: o trecho abaixo resolve as vars da marca escolhida. */}
      <div data-brand={brand} className="flex flex-col items-center gap-sm">
        <BrandLogo brand={brand} size={28} />
        <Button variant="primary">Ação da marca</Button>
      </div>
    </div>
  );
}

export const brandSwitchDemos: DemoMap = {
  "brand-switch": {
    demos: [
      {
        title: "Marca num contêiner",
        code: `const [marca, setMarca] = useState("santo");
<BrandSwitch brands={[{ id: "santo", label: "Santo" }, { id: "vtsd", label: "VTSD" }]}
  value={marca} onChange={setMarca} />
<div data-brand={marca}>…</div>   // na doc, o atributo vai na raiz e persiste`,
        Preview: Example,
      },
    ],
  },
};
