"use client";

import { useMemo } from "react";
import { buildIndex, resolveValue } from "@/lib/tokens/emit.mjs";
import { BRAND_FAMILIES, SEED_STEP, generateRamp, rampTokenNames } from "@/lib/tokens/ramp";
import { BORDER_RATIOS, RADIUS_RATIOS, SPACE_RATIOS } from "@/lib/tokens/scales";
import { MISSING_COLOR } from "@/lib/tokens/fallback";
import type { RawValue, TokenDoc } from "@/lib/tokens/types";
import { Icon, IconButton, PanelSection, SwatchPicker } from "@/lib/ui";
import { ScaleSection } from "./scale-section";

type Change = { collection: string; name: string; mode: string; value: RawValue };


/**
 * A aba Marca: onde um produto novo ganha cara própria em cima do Santo.
 *
 * Tudo aqui opera na camada semântica — os apelidos que apontam para a fundação.
 * Nenhum controle reescreve `dimension/*`: eles são a física do sistema, comum a
 * todos os produtos derivados. Mudar a cara é mudar *para onde* o apelido aponta.
 *
 * Preset primeiro, slider depois: escolhe-se a intenção e afina, em vez de montar
 * a intenção somando ajustes.
 */
export function BrandPanel({
  doc,
  base,
  mode,
  onChangeMany,
}: {
  doc: TokenDoc;
  base: TokenDoc;
  mode: string;
  onChangeMany: (changes: Change[]) => void;
}) {
  const index = useMemo(() => buildIndex(doc), [doc]);

  const hexOf = (name: string) => {
    const entry = index.get(name);
    if (!entry) return MISSING_COLOR;
    try {
      return String(resolveValue(index, entry.values[mode] ?? entry.values[entry.defaultMode], mode));
    } catch {
      return MISSING_COLOR;
    }
  };

  const baseHex = (name: string) =>
    String(base.collections.Palette.variables[name]?.value ?? MISSING_COLOR);

  const applySeed = (family: string, seed: string) => {
    const names = rampTokenNames(family);
    const ramp = generateRamp(names.map(baseHex), seed);
    onChangeMany(names.map((name, i) => ({ collection: "Palette", name, mode: "Santo", value: ramp[i] })));
  };

  const resetFamily = (family: string) =>
    onChangeMany(
      rampTokenNames(family).map((name) => ({
        collection: "Palette",
        name,
        mode: "Santo",
        value: baseHex(name),
      })),
    );

  const familyDirty = (family: string) =>
    rampTokenNames(family).some(
      (n) => String(doc.collections.Palette.variables[n]?.value) !== baseHex(n),
    );


  return (
    <div className="flex flex-col gap-2xl pb-lg">
      <PanelSection title="Cor">
        <div className="flex flex-col gap-2xs">
          {BRAND_FAMILIES.map((family) => (
            <div key={family.key} className="group/ramp flex items-center gap-xs">
              <SwatchPicker
                color={hexOf(`palette/${family.key}/${SEED_STEP}`)}
                onChange={(hex) => applySeed(family.key, hex)}
                label={`Semente de ${family.label}`}
                showAlpha={false}
              />
              <span className="santo-body-small-medium min-w-0 flex-1 truncate">{family.label}</span>
              <span className="w-(--santo-dimension-size-28) shrink-0">
                {familyDirty(family.key) && (
                  <IconButton
                    size="sm"
                    variant="ghost"
                    label={`Voltar ${family.label} à rampa do Figma`}
                    onClick={() => resetFamily(family.key)}
                    className="size-(--santo-dimension-size-28) opacity-0 group-hover/ramp:opacity-100 focus-visible:opacity-100"
                  >
                    <Icon.Reset size={16} />
                  </IconButton>
                )}
              </span>
            </div>
          ))}
        </div>
      </PanelSection>

      <ScaleSection
        title="Espaçamento"
        doc={doc}
        collection="Semantic"
        prefix="space/"
        ratios={SPACE_RATIOS}
        baseKey="md"
        baseLabel="Base do espaçamento"
        baseRange={{ min: 4, max: 40, step: 1 }}
        onChange={onChangeMany}
      />

      <ScaleSection
        title="Forma"
        doc={doc}
        collection="Semantic"
        prefix="radius/"
        ratios={RADIUS_RATIOS}
        baseKey="sm"
        baseLabel="Raio base"
        baseRange={{ min: 0, max: 48, step: 1 }}
        onChange={onChangeMany}
        baseToken={{ collection: "Brand", name: "brand/shape/radius-base" }}
      />

      <ScaleSection
        title="Bordas"
        doc={doc}
        collection="Semantic"
        prefix="border/"
        ratios={BORDER_RATIOS}
        baseKey="thin"
        baseLabel="Espessura base"
        baseRange={{ min: 0, max: 8, step: 1 }}
        onChange={onChangeMany}
      />

    </div>
  );
}
