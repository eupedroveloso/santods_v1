"use client";

import { Button, IconButton } from "./button";
import { jsx } from "./demo-kit";
import * as Icon from "./icons";
import type { ButtonVariant, ControlSize } from "./button-class";
import type { DemoMap } from "./registry.types";

const VARIANTS = ["primary", "secondary", "subtle", "ghost", "danger"];
const SIZES = ["sm", "md", "lg"];

export const buttonDemos: DemoMap = {
  button: {
    playground: {
      controls: [
        { kind: "select", prop: "variant", label: "Variante", options: VARIANTS, initial: "primary" },
        { kind: "select", prop: "size", label: "Tamanho", options: SIZES, initial: "md" },
        { kind: "text", prop: "children", label: "Texto", initial: "Salvar alterações" },
        { kind: "boolean", prop: "leading", label: "Ícone à esquerda", initial: false },
        { kind: "boolean", prop: "pill", label: "Pílula", initial: true },
        { kind: "boolean", prop: "disabled", label: "Desabilitado", initial: false },
      ],
      Preview: ({ values: v }) => (
        <Button
          variant={v.variant as ButtonVariant}
          size={v.size as ControlSize}
          disabled={v.disabled as boolean}
          pill={v.pill as boolean}
          leading={v.leading ? <Icon.Plus size={16} /> : undefined}
        >
          {v.children as string}
        </Button>
      ),
      code: (v) =>
        jsx(
          "Button",
          {
            variant: v.variant as string,
            size: v.size as string,
            leading: v.leading ? "{<Icon.Plus size={16} />}" : undefined,
            pill: v.pill ? undefined : "{false}",
            disabled: v.disabled as boolean,
          },
          v.children as string,
          { variant: "secondary", size: "md" },
        ),
    },
    demos: [
      {
        title: "Básico",
        code: `<Button variant="primary">Salvar</Button>`,
        Preview: () => <Button variant="primary">Salvar</Button>,
      },
      {
        title: "Variantes",
        code: VARIANTS.map((v) => `<Button variant="${v}">…</Button>`).join("\n"),
        Preview: () => (
          <div className="flex flex-wrap items-center justify-center gap-sm">
            <Button variant="primary">Primária</Button>
            <Button variant="secondary">Secundária</Button>
            <Button variant="subtle">Suave</Button>
            <Button variant="ghost">Fantasma</Button>
            <Button variant="danger">Destrutiva</Button>
          </div>
        ),
      },
      {
        title: "Tamanhos",
        code: SIZES.map((s) => `<Button size="${s}">…</Button>`).join("\n"),
        Preview: () => (
          <div className="flex flex-wrap items-center justify-center gap-sm">
            <Button size="sm">Pequeno · 32</Button>
            <Button size="md">Médio · 40</Button>
            <Button size="lg">Grande · 48</Button>
          </div>
        ),
      },
      {
        title: "Com ícone",
        code: `<Button variant="primary" leading={<Icon.Plus size={16} />}>Novo projeto</Button>
<Button trailing={<Icon.ChevronDown size={16} />}>Opções</Button>`,
        Preview: () => (
          <div className="flex flex-wrap items-center justify-center gap-sm">
            <Button variant="primary" leading={<Icon.Plus size={16} />}>Novo projeto</Button>
            <Button trailing={<Icon.ChevronDown size={16} />}>Opções</Button>
            <Button variant="ghost" leading={<Icon.Download size={16} />}>Exportar</Button>
          </div>
        ),
      },
      {
        title: "Desabilitado",
        code: `<Button variant="primary" disabled>Salvar</Button>`,
        Preview: () => (
          <div className="flex flex-wrap items-center justify-center gap-sm">
            <Button variant="primary" disabled>Salvar</Button>
            <Button disabled>Cancelar</Button>
          </div>
        ),
      },
      {
        title: "Largura total",
        code: `<Button variant="primary" block>Criar conta</Button>
<div className="flex gap-sm">
  <Button className="flex-1">Voltar</Button>
  <Button variant="primary" className="flex-1">Continuar</Button>
</div>`,
        layout: "stretch",
        Preview: () => (
          <div className="mx-auto flex w-full max-w-(--santo-dimension-space-384) flex-col gap-sm">
            <Button variant="primary" block>Criar conta</Button>
            <div className="flex gap-sm">
              <Button className="flex-1">Voltar</Button>
              <Button variant="primary" className="flex-1">Continuar</Button>
            </div>
          </div>
        ),
      },
    ],
  },
  "icon-button": {
    playground: {
      controls: [
        { kind: "select", prop: "variant", label: "Variante", options: VARIANTS, initial: "secondary" },
        { kind: "select", prop: "size", label: "Tamanho", options: SIZES, initial: "md" },
        { kind: "text", prop: "label", label: "Rótulo acessível", initial: "Copiar" },
        { kind: "boolean", prop: "pill", label: "Círculo", initial: true },
        { kind: "boolean", prop: "disabled", label: "Desabilitado", initial: false },
      ],
      Preview: ({ values: v }) => (
        <IconButton
          variant={v.variant as ButtonVariant}
          size={v.size as ControlSize}
          label={v.label as string}
          disabled={v.disabled as boolean}
          pill={v.pill as boolean}
        >
          <Icon.Copy size={16} />
        </IconButton>
      ),
      code: (v) =>
        jsx(
          "IconButton",
          { variant: v.variant as string, size: v.size as string, label: v.label as string, pill: v.pill ? undefined : "{false}", disabled: v.disabled as boolean },
          "\n  <Icon.Copy size={16} />\n",
          { variant: "ghost", size: "md" },
        ),
    },
    demos: [
      {
        title: "Básico",
        code: `<IconButton label="Buscar"><Icon.Search size={16} /></IconButton>`,
        Preview: () => (
          <IconButton label="Buscar">
            <Icon.Search size={16} />
          </IconButton>
        ),
      },
      {
        title: "Variantes",
        code: `<IconButton variant="ghost" label="Buscar">…</IconButton>
<IconButton variant="secondary" label="Copiar">…</IconButton>
<IconButton variant="subtle" label="Adicionar">…</IconButton>
<IconButton variant="primary" label="Salvar">…</IconButton>
<IconButton variant="danger" label="Excluir">…</IconButton>`,
        Preview: () => (
          <div className="flex flex-wrap items-center justify-center gap-sm">
            <IconButton label="Buscar"><Icon.Search size={16} /></IconButton>
            <IconButton variant="secondary" label="Copiar"><Icon.Copy size={16} /></IconButton>
            <IconButton variant="subtle" label="Adicionar"><Icon.Plus size={16} /></IconButton>
            <IconButton variant="primary" label="Salvar"><Icon.Save size={16} /></IconButton>
            <IconButton variant="danger" label="Excluir"><Icon.Close size={16} /></IconButton>
          </div>
        ),
      },
      {
        title: "Tamanhos",
        code: `<IconButton size="sm" label="Mais">…</IconButton>`,
        Preview: () => (
          <div className="flex flex-wrap items-center justify-center gap-sm">
            {(["sm", "md", "lg"] as const).map((s) => (
              <IconButton key={s} size={s} variant="secondary" label={`Mais (${s})`}>
                <Icon.More size={16} />
              </IconButton>
            ))}
          </div>
        ),
      },
      {
        title: "Desabilitado",
        code: `<IconButton label="Desfazer" disabled><Icon.Undo size={16} /></IconButton>`,
        Preview: () => (
          <IconButton label="Desfazer" disabled>
            <Icon.Undo size={16} />
          </IconButton>
        ),
      },
    ],
  },
};
