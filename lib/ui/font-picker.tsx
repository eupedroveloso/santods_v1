"use client";

import { CATEGORY_LABEL, FONT_CATALOG, type FontCategory } from "@/lib/fonts/catalog";
import { useGoogleFonts } from "@/lib/fonts/use-google-font";
import { Select, type SelectOption } from "./listbox";

/**
 * Escolha de família tipográfica, do catálogo do Google Fonts.
 *
 * Cada opção é renderizada **na própria fonte** — é o motivo de o seletor não
 * poder ser o nativo do sistema, que lista tudo com a mesma aparência. Por isso
 * o catálogo inteiro é carregado quando o seletor está montado: sem as fontes
 * disponíveis, a lista não mostraria nada de útil.
 */
export function FontPicker({
  value,
  onChange,
  label,
  /** Restringe o catálogo. Use ["mono"] para o token de fonte monoespaçada. */
  categories,
  sample = "Aa Bb Cc 123",
}: {
  value: string;
  onChange: (family: string) => void;
  label: string;
  categories?: FontCategory[];
  sample?: string;
}) {
  const entries = categories
    ? FONT_CATALOG.filter((f) => categories.includes(f.category))
    : FONT_CATALOG;

  useGoogleFonts(entries.map((f) => f.family).concat(value));

  const options: SelectOption<string>[] = entries.map((f) => ({
    value: f.family,
    label: f.family,
    group: CATEGORY_LABEL[f.category],
    labelStyle: { fontFamily: `"${f.family}", ui-sans-serif, system-ui, sans-serif` },
  }));

  if (!entries.some((f) => f.family === value)) {
    options.unshift({ value, label: `${value} (fora do catálogo)`, group: "Atual" });
  }

  return (
    <div className="flex min-w-0 flex-col gap-2xs">
      <Select value={value} onChange={onChange} options={options} label={label} size="sm" searchable />
      <div className="rounded-md bg-surface-sunken px-sm py-xs">
        <span
          className="santo-body-large-regular block truncate text-text-secondary"
          style={{ fontFamily: `"${value}", ui-sans-serif, system-ui, sans-serif` }}
        >
          {sample}
        </span>
      </div>
    </div>
  );
}
