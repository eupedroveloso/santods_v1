"use client";

import { useMemo, useState } from "react";
import { emitThemeCss, emitTokensCss, emitTypographyCss } from "@/lib/tokens/emit.mjs";
import { countOverrides } from "@/lib/tokens/brand";
import type { Brand, TokenDoc } from "@/lib/tokens/types";

type Format = "tokens" | "typography" | "theme" | "brand";

const FORMATS: { id: Format; label: string; file: (id: string) => string; hint: string }[] = [
  { id: "tokens", label: "tokens.css", file: (id) => `${id}-tokens.css`, hint: "Variáveis --santo-* em Light e Dark" },
  { id: "typography", label: "typography.css", file: (id) => `${id}-typography.css`, hint: "As classes de text style" },
  { id: "theme", label: "theme.css", file: (id) => `${id}-theme.css`, hint: "Bloco @theme inline do Tailwind v4" },
  { id: "brand", label: "brand.json", file: (id) => `${id}.json`, hint: "Só os overrides — cole em brands/" },
];

export function ExportPanel({
  doc,
  brand,
  onClose,
}: {
  doc: TokenDoc;
  brand: Brand;
  onClose: () => void;
}) {
  const [format, setFormat] = useState<Format>("tokens");
  const [copied, setCopied] = useState(false);

  const contents = useMemo(() => {
    const selector = brand.id === "santo" ? ":root" : `[data-brand='${brand.id}']`;
    const banner = `/* Marca "${brand.name}" — ${countOverrides(brand.overrides)} overrides sobre a base Santo.
   Gerado pelo Studio do SantoDS. */`;
    switch (format) {
      case "tokens":
        return emitTokensCss(doc, { banner, selector });
      case "typography":
        return emitTypographyCss(doc, { banner });
      case "theme":
        return emitThemeCss(doc, { banner });
      case "brand":
        return JSON.stringify(brand, null, 2);
    }
  }, [doc, brand, format]);

  const active = FORMATS.find((f) => f.id === format)!;

  async function copy() {
    await navigator.clipboard.writeText(contents);
    setCopied(true);
    setTimeout(() => setCopied(false), 1600);
  }

  function download() {
    const blob = new Blob([contents], { type: "text/plain;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = active.file(brand.id);
    a.click();
    URL.revokeObjectURL(url);
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-surface-overlay p-lg">
      <div className="flex max-h-full w-full max-w-(--santo-dimension-container-lg) flex-col gap-md rounded-xl border-thin border-border-subtle bg-surface-raised p-lg shadow-2xl">
        <div className="flex items-start justify-between gap-md">
          <div className="flex flex-col gap-3xs">
            <h2 className="santo-heading-6-semibold">Exportar</h2>
            <p className="santo-caption-regular text-text-secondary">{active.hint}</p>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="santo-body-small-semibold cursor-pointer rounded-md px-sm py-2xs text-text-secondary hover:bg-neutral-subtle-hover"
          >
            Fechar
          </button>
        </div>

        <div className="flex flex-wrap gap-2xs">
          {FORMATS.map((f) => (
            <button
              key={f.id}
              type="button"
              onClick={() => setFormat(f.id)}
              className={`santo-caption-semibold cursor-pointer rounded-full px-sm py-2xs transition-colors ${
                format === f.id
                  ? "bg-brand-solid-default text-text-on-brand"
                  : "bg-neutral-subtle-default text-text-secondary hover:bg-neutral-subtle-hover"
              }`}
            >
              {f.label}
            </button>
          ))}
        </div>

        <pre className="santo-code-sm min-h-0 flex-1 overflow-auto rounded-lg border-thin border-border-subtle bg-surface-sunken p-md text-text-secondary">
          {contents}
        </pre>

        <div className="flex items-center gap-xs">
          <button
            type="button"
            onClick={copy}
            className="santo-body-small-semibold cursor-pointer rounded-md bg-brand-solid-default px-md py-xs text-text-on-brand hover:bg-brand-solid-hover"
          >
            {copied ? "Copiado" : "Copiar"}
          </button>
          <button
            type="button"
            onClick={download}
            className="santo-body-small-semibold cursor-pointer rounded-md border-thin border-border-default px-md py-xs text-text-primary hover:bg-neutral-subtle-hover"
          >
            Baixar {active.file(brand.id)}
          </button>
          <span className="santo-caption-regular text-text-tertiary">
            {contents.split("\n").length} linhas
          </span>
        </div>
      </div>
    </div>
  );
}
