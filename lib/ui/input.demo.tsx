"use client";

import { colorValue } from "@/lib/tokens";
import { jsx } from "./demo-kit";
import { Field, Input, SearchInput, Textarea } from "./input";
import type { ControlSize } from "./button-class";
import type { DemoMap } from "./registry.types";

const BRAND_HEX = colorValue("color/bg/brand/solid/default");

export const inputDemos: DemoMap = {
  input: {
    playground: {
      controls: [
        { kind: "select", prop: "size", label: "Tamanho", options: ["sm", "md", "lg"], initial: "md" },
        { kind: "text", prop: "placeholder", label: "Placeholder", initial: "maria@exemplo.com" },
        { kind: "boolean", prop: "mono", label: "Mono", initial: false },
        { kind: "boolean", prop: "invalid", label: "Inválido", initial: false },
        { kind: "boolean", prop: "disabled", label: "Desabilitado", initial: false },
      ],
      layout: "stretch",
      Preview: ({ values: v }) => (
        <div className="mx-auto w-full max-w-(--santo-dimension-space-320)">
          <Input
            size={v.size as ControlSize}
            placeholder={v.placeholder as string}
            mono={v.mono as boolean}
            invalid={v.invalid as boolean}
            disabled={v.disabled as boolean}
          />
        </div>
      ),
      code: (v) =>
        jsx(
          "Input",
          {
            size: v.size as string,
            placeholder: v.placeholder as string,
            mono: v.mono as boolean,
            invalid: v.invalid as boolean,
            disabled: v.disabled as boolean,
          },
          undefined,
          { size: "md" },
        ),
    },
    demos: [
      {
        title: "Básico",
        layout: "stretch",
        code: `<Input placeholder="Maria Souza" />`,
        Preview: () => (
          <div className="mx-auto w-full max-w-(--santo-dimension-space-320)">
            <Input placeholder="Maria Souza" />
          </div>
        ),
      },
      {
        title: "Tamanhos",
        layout: "stretch",
        code: `<Input size="sm" />\n<Input size="md" />\n<Input size="lg" />`,
        Preview: () => (
          <div className="mx-auto flex w-full max-w-(--santo-dimension-space-320) flex-col gap-sm">
            <Input size="sm" placeholder="sm · 32" />
            <Input size="md" placeholder="md · 40" />
            <Input size="lg" placeholder="lg · 48" />
          </div>
        ),
      },
      {
        title: "Estados",
        layout: "stretch",
        code: `<Input mono defaultValue="${BRAND_HEX}" />
<Input invalid defaultValue="maria@" />
<Input disabled placeholder="Indisponível" />`,
        Preview: () => (
          <div className="mx-auto flex w-full max-w-(--santo-dimension-space-320) flex-col gap-sm">
            <Input mono defaultValue={BRAND_HEX} aria-label="Hex" />
            <Input invalid defaultValue="maria@" aria-label="E-mail" />
            <Input disabled placeholder="Indisponível" aria-label="Bloqueado" />
          </div>
        ),
      },
    ],
  },
  textarea: {
    demos: [
      {
        title: "Básico",
        layout: "stretch",
        code: `<Textarea placeholder="Conte o que aconteceu." />`,
        Preview: () => (
          <div className="mx-auto w-full max-w-(--santo-dimension-space-384)">
            <Textarea placeholder="Conte o que aconteceu." aria-label="Descrição" />
          </div>
        ),
      },
    ],
  },
  "search-input": {
    demos: [
      {
        title: "Básico",
        layout: "stretch",
        code: `<SearchInput placeholder="Buscar token…" />`,
        Preview: () => (
          <div className="mx-auto flex w-full max-w-(--santo-dimension-space-320)">
            <SearchInput placeholder="Buscar token…" aria-label="Buscar token" />
          </div>
        ),
      },
    ],
  },
  field: {
    demos: [
      {
        title: "Básico",
        layout: "stretch",
        code: `<Field label="Nome">
  <Input placeholder="Maria Souza" />
</Field>`,
        Preview: () => (
          <div className="mx-auto w-full max-w-(--santo-dimension-space-320)">
            <Field label="Nome">
              <Input placeholder="Maria Souza" />
            </Field>
          </div>
        ),
      },
      {
        title: "Estados",
        layout: "stretch",
        code: `<Field label="E-mail" error="Endereço incompleto.">
  <Input invalid defaultValue="maria@" />
</Field>
<Field label="Observações" optional>
  <Textarea />
</Field>`,
        Preview: () => (
          <div className="mx-auto flex w-full max-w-(--santo-dimension-space-320) flex-col gap-md">
            <Field label="E-mail" error="Endereço incompleto.">
              <Input invalid defaultValue="maria@" />
            </Field>
            <Field label="Observações" optional>
              <Textarea placeholder="Alguma coisa que devemos saber?" />
            </Field>
          </div>
        ),
      },
    ],
  },
};
