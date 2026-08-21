"use client";

import { useMemo } from "react";
import { TEXT_ROLES, roleChanges, type StylePatch } from "@/lib/tokens/typescale";
import { TYPE_RATIOS, leadingFor, typeScaleFor } from "@/lib/tokens/scales";
import type { TokenDoc } from "@/lib/tokens/types";
import { FontPicker, NumberField, PanelSection, StackedField } from "@/lib/ui";

/**
 * Painel de tipografia.
 *
 * Cada papel aponta para um degrau de `type/size/*` e `type/leading/*`. Os
 * controles são sliders sobre esses degraus — arrastar mostra a interface
 * reagindo, e nunca produz um tamanho que a fundação não define.
 *
 * O ajuste é por **papel**, não por peso: a escala pertence ao papel. Mudar o
 * tamanho do "Título 1" muda os seis pesos dele juntos, que é o que mantém a
 * família coerente.
 */
export function TypographyPanel({
  doc,
  onChangeOne,
  onChangeTextStyles,
}: {
  doc: TokenDoc;
  onChangeOne: (collection: string, name: string, mode: string, value: string) => void;
  onChangeTextStyles: (patches: StylePatch[]) => void;
}) {
  const styleNames = useMemo(() => Object.keys(doc.textStyles), [doc.textStyles]);

  const sans = String(doc.collections.Brand.variables["brand/family/sans"].value);
  const mono = String(doc.collections.Brand.variables["brand/family/mono"].value);

  /** Tamanho e entrelinha atuais de um papel, lidos do primeiro peso. */
  const roleScale = (role: string) => {
    const name = styleNames.find((n) => n.split("/")[1] === role);
    const style = name ? doc.textStyles[name] : undefined;
    if (!style) return null;
    return { size: style.fontSize, leading: style.lineHeight.value ?? style.fontSize };
  };

  const base = roleScale("body")?.size ?? 16;

  /** Move a base e recalcula todos os papéis pela proporção da escala. */
  const applyBase = (next: number) =>
    onChangeTextStyles(
      Object.entries(typeScaleFor(next)).flatMap(([role, { size, leading }]) =>
        roleChanges(role, size, leading, styleNames),
      ),
    );

  /** Só o tamanho é editável: a entrelinha acompanha, para a proporção não quebrar. */
  const applyRole = (role: string, size: number) =>
    onChangeTextStyles(roleChanges(role, size, leadingFor(role, size), styleNames));

  return (
    <div className="flex flex-col gap-2xl pb-lg">
      <PanelSection title="Famílias">
        <StackedField label="Sem serifa">
          <FontPicker
            value={sans}
            onChange={(f) => onChangeOne("Brand", "brand/family/sans", "Santo", f)}
            label="Família sem serifa"
            categories={["sans", "serif", "display"]}
            sample="Aa Bb Cc — o design fala antes do texto"
          />
        </StackedField>
        <StackedField label="Monoespaçada">
          <FontPicker
            value={mono}
            onChange={(f) => onChangeOne("Brand", "brand/family/mono", "Santo", f)}
            label="Família monoespaçada"
            categories={["mono"]}
            sample="const token = 0xF4F1FE;"
          />
        </StackedField>
      </PanelSection>

      <PanelSection title="Escala">
        <NumberField
          label="Tamanho base do corpo"
          value={base}
          onChange={applyBase}
          min={10}
          max={28}
          step={1}
          unit="px"
        />
      </PanelSection>

      <PanelSection title="Por papel">
        <div className="flex flex-col gap-2xs">
          {TEXT_ROLES.map((role) => {
            const current = roleScale(role.key);
            if (!current || !TYPE_RATIOS[role.key]) return null;
            return (
              <div key={role.key} className="flex items-center gap-2xs">
                <span
                  className="santo-caption-regular w-(--santo-dimension-space-88) shrink-0 truncate text-text-secondary"
                  title={role.key}
                >
                  {role.label}
                </span>
                <NumberField
                  label={`Tamanho de ${role.label}`}
                  value={current.size}
                  onChange={(v) => applyRole(role.key, v)}
                  min={8}
                  max={128}
                  step={1}
                  unit="px"
                />
                <span className="santo-caption-small-regular w-(--santo-dimension-space-32) shrink-0 text-right tabular-nums text-text-tertiary">
                  /{current.leading}
                </span>
              </div>
            );
          })}
        </div>
      </PanelSection>

    </div>
  );
}
