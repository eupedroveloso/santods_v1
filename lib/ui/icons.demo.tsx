"use client";

import * as Generated from "@/lib/icons";
import manifest from "@/lib/icons/manifest.json";
import type { IconProps } from "@/lib/icons";
import { useState } from "react";
import type { ComponentType } from "react";
import { Count } from "./chip";
import { IconTile } from "./icon-tile";
import { Sparkles } from "./icons";
import { SearchInput } from "./input";
import { OVERLINE } from "./text-class";
import type { DemoMap } from "./registry.types";

type Entry = { slug: string; component: string; aliases?: string[]; figma: { nodeId: string; kind: string } };

/** A grade sai do manifest gerado da pagina Icones do Figma — nao de uma lista a mao. */
const ENTRIES = Object.entries(manifest.icons as Record<string, Omit<Entry, "slug">>).map(([slug, e]) => ({
  slug,
  ...e,
  Glyph: (Generated as unknown as Record<string, ComponentType<IconProps>>)[e.component],
}));

const GROUPS = [
  { kind: "icon", label: "Ícones" },
  { kind: "brand", label: "Marca" },
];
const fold = (s: string) => s.normalize("NFD").replace(/\p{Diacritic}/gu, "").toLowerCase();

/**
 * Galeria da pagina Icones do Figma: filtro, grupos do manifest (icone x marca)
 * com contagem, e cada ladrilho copia o nome do componente ao clicar.
 */
function IconGallery() {
  const [query, setQuery] = useState("");
  const [copied, setCopied] = useState<string | null>(null);
  const q = fold(query.trim());
  // Acha pelo nome do Figma (ingles) e pelos apelidos pt-BR do manifest.
  const visible = ENTRIES.filter(
    (e) => !q || fold(e.slug).includes(q) || fold(e.component).includes(q) || (e.aliases ?? []).some((a) => fold(a).includes(q)),
  );
  const copy = (name: string) => {
    navigator.clipboard?.writeText(name).then(() => {
      setCopied(name);
      window.setTimeout(() => setCopied((c) => (c === name ? null : c)), 1200);
    });
  };
  return (
    <div className="flex w-full flex-col gap-lg">
      <div className="flex items-center gap-sm">
        <div className="flex max-w-(--santo-dimension-space-320) min-w-0 flex-1">
          <SearchInput size="sm" value={query} onChange={(e) => setQuery(e.target.value)} placeholder="Filtrar ícones…" aria-label="Filtrar ícones" />
        </div>
        <Count>{visible.length}</Count>
      </div>
      {GROUPS.map((g) => {
        const list = visible.filter((e) => e.figma.kind === g.kind);
        if (!list.length) return null;
        return (
          <section key={g.kind} className="flex flex-col gap-sm">
            <span className={`flex items-center gap-xs ${OVERLINE}`}>
              {g.label}
              <Count>{list.length}</Count>
            </span>
            <div className="grid grid-cols-[repeat(auto-fill,minmax(var(--santo-dimension-space-112),1fr))] gap-sm">
              {list.map(({ slug, component, Glyph }) => (
                <button
                  key={slug}
                  type="button"
                  title={`Copiar ${component}`}
                  onClick={() => copy(component)}
                  className="santo-row group flex min-w-0 cursor-pointer flex-col items-center gap-xs p-sm hover:bg-neutral-subtle-default"
                >
                  <IconTile size="lg" tone={copied === component ? "brand" : "subtle"}>
                    {Glyph && <Glyph size={20} />}
                  </IconTile>
                  <span
                    aria-hidden={copied === component}
                    className={`santo-caption-small-medium max-w-full truncate ${
                      copied === component ? "santo-animate-pop text-text-brand" : "text-text-tertiary group-hover:text-text-secondary"
                    }`}
                  >
                    {copied === component ? "Copiado" : slug}
                  </span>
                </button>
              ))}
            </div>
          </section>
        );
      })}
      {visible.length === 0 && <span className="santo-body-small-regular text-text-tertiary">Nenhum ícone para “{query}”.</span>}
      {/* Uma regiao viva so para a galeria inteira (nao uma por ladrilho). */}
      <span className="sr-only" aria-live="polite">
        {copied ? `Copiado: ${copied}` : ""}
      </span>
    </div>
  );
}

export const iconsDemos: DemoMap = {
  icon: {
    demos: [
      {
        title: "Galeria",
        layout: "stretch",
        code: `import { Icon } from "@/lib/ui";

<Icon.Search size={16} />          // nome do papel
<Icon.MagnifyingGlassIcon />       // nome do Figma`,
        Preview: IconGallery,
      },
      {
        title: "Tamanhos",
        code: `<Icon.Sparkles size={12} /> … <Icon.Sparkles size={48} />`,
        Preview: () => (
          <div className="flex items-end gap-md text-icon-primary">
            {([12, 16, 20, 24, 32, 40, 48] as const).map((s) => (
              <span key={s} className="flex flex-col items-center gap-2xs">
                <Sparkles size={s} />
                <code className="santo-code-sm text-text-tertiary">{s}</code>
              </span>
            ))}
          </div>
        ),
      },
    ],
  },
};
