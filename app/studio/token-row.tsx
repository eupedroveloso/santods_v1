"use client";

import { useMemo } from "react";
import { buildIndex, isAlias, aliasTarget, resolveValue, unitOf } from "@/lib/tokens/emit.mjs";
import { rangeFor } from "@/lib/tokens/ranges";
import { MISSING_COLOR, MISSING_NUMBER, MISSING_STRING } from "@/lib/tokens/fallback";
import { isFoundation, ownerOf } from "@/lib/tokens/layers";
import type { RawValue, TokenDoc } from "@/lib/tokens/types";
import { ColorRow, Icon, IconButton, Input, NumberField, Select } from "@/lib/ui";

/** Ultimo segmento do caminho — o que o rotulo da linha mostra. */
const leafOf = (name: string) => name.slice(name.lastIndexOf("/") + 1);

export type TokenRowProps = {
  doc: TokenDoc;
  base: TokenDoc;
  collection: string;
  name: string;
  mode: string;
  onChange: (collection: string, name: string, mode: string, value: RawValue) => void;
  onReset: (collection: string, name: string) => void;
};

export function TokenRow({ doc, base, collection, name, mode, onChange, onReset }: TokenRowProps) {
  const c = doc.collections[collection];
  const def = c.variables[name];
  const values = def.values ?? { [c.defaultMode]: def.value as RawValue };
  const activeMode = c.modes.includes(mode) ? mode : c.defaultMode;
  const raw = values[activeMode];

  const index = useMemo(() => buildIndex(doc), [doc]);
  const linked = isAlias(raw);

  const baseDef = base.collections[collection]?.variables?.[name];
  const baseValues = baseDef ? (baseDef.values ?? { [c.defaultMode]: baseDef.value as RawValue }) : null;
  const dirty = baseValues ? JSON.stringify(baseValues[activeMode]) !== JSON.stringify(raw) : true;

  // Alvos possiveis para vincular: mesmo tipo, fora da propria colecao — o que
  // reproduz a direcao das cadeias do Figma (semantico -> primitivo).
  const linkOptions = useMemo(
    () =>
      [...index.values()]
        .filter((v) => v.type === def.type && v.name !== name && v.collection !== collection)
        .map((v) => v.name),
    [index, def.type, name, collection],
  );

  const set = (value: RawValue) => onChange(collection, name, activeMode, value);

  /**
   * Primitivo é a física do sistema: a escala que todo produto derivado
   * compartilha. Editar aqui não cria um produto novo, cria um sistema
   * incompatível — então a linha mostra o valor e aponta quem o controla.
   */
  if (isFoundation(collection)) {
    const owner = ownerOf(name);
    let resolved: RawValue = raw;
    try {
      resolved = resolveValue(index, raw, activeMode);
    } catch {
      /* alias quebrado */
    }
    return (
      <div className="flex items-center gap-2xs opacity-70" title={`${name} — fundação do Santo`}>
        <span className="santo-body-small-regular w-(--santo-dimension-space-88) shrink-0 truncate text-text-secondary">
          {leafOf(name)}
        </span>
        <span className="santo-caption-regular min-w-0 flex-1 truncate font-mono text-text-tertiary">
          {String(resolved)}
          {unitOf(name, def.type)}
        </span>
        {owner && (
          <span
            className="santo-caption-small-regular shrink-0 rounded-full bg-neutral-subtle-default px-2xs text-text-tertiary"
            title={`Para mudar a cara do produto, ajuste ${owner} na aba Marca.`}
          >
            {owner}
          </span>
        )}
        <span className="w-(--santo-dimension-size-28) shrink-0 text-icon-tertiary">
          <Icon.Link size={16} />
        </span>
      </div>
    );
  }

  /** Valor concreto por tras de um alias — usado ao desvincular. */
  const concrete = (): RawValue => {
    try {
      return resolveValue(index, raw, activeMode);
    } catch {
      return def.type === "COLOR" ? MISSING_COLOR : def.type === "FLOAT" ? MISSING_NUMBER : MISSING_STRING;
    }
  };

  if (def.type === "COLOR") {
    let resolved = MISSING_COLOR;
    try {
      resolved = String(resolveValue(index, raw, activeMode));
    } catch {
      /* alias quebrado: a linha ainda renderiza, so sem cor resolvida */
    }
    return (
      <ColorRow
        label={leafOf(name)}
        title={name}
        resolved={resolved}
        value={linked ? aliasTarget(String(raw)) : String(raw)}
        linked={linked}
        linkOptions={linkOptions}
        onChangeHex={(hex) => set(hex)}
        onChangeLink={(token) => set(`{${token}}`)}
        onToggleLink={() => set(linked ? resolved : `{${linkOptions[0] ?? name}}`)}
        dirty={dirty}
        onReset={() => onReset(collection, name)}
      />
    );
  }

  const unit = unitOf(name, def.type);
  const range = def.type === "FLOAT" ? rangeFor(name, Number(raw)) : null;

  return (
    <div className="group/row flex items-center gap-2xs">
      <span
        className="santo-body-small-regular w-(--santo-dimension-space-88) shrink-0 truncate text-text-primary"
        title={name}
      >
        {leafOf(name)}
      </span>

      {linked ? (
        <Select
          size="sm"
          mono
          className="min-w-0 flex-1"
          value={aliasTarget(String(raw))}
          onChange={(t) => set(`{${t}}`)}
          label={`Token de origem de ${name}`}
          options={linkOptions.map((t) => ({ value: t, label: t }))}
        />
      ) : range ? (
        <NumberField
          label={name}
          value={Number(raw)}
          onChange={(v) => set(v)}
          min={range.min}
          max={range.max}
          step={range.step}
          unit={unit}
        />
      ) : (
        <Input
          size="sm"
          mono
          value={String(raw)}
          onChange={(e) => set(e.target.value)}
          aria-label={name}
          className="h-(--santo-dimension-size-28)"
        />
      )}

      <IconButton
        size="sm"
        variant="secondary"
        label={linked ? `Desvincular ${leafOf(name)}` : `Vincular ${leafOf(name)} a um token`}
        onClick={() => set(linked ? concrete() : `{${linkOptions[0] ?? name}}`)}
        className="size-(--santo-dimension-size-28)"
      >
        {linked ? <Icon.Unlink size={16} /> : <Icon.Link size={16} />}
      </IconButton>

      <span className="w-(--santo-dimension-size-24) shrink-0">
        {dirty && (
          <IconButton
            size="sm"
            variant="ghost"
            label={`Voltar ${leafOf(name)} ao valor do Figma`}
            onClick={() => onReset(collection, name)}
            className="size-(--santo-dimension-size-24) opacity-0 group-hover/row:opacity-100 focus-visible:opacity-100"
          >
            <Icon.Reset size={16} />
          </IconButton>
        )}
      </span>
    </div>
  );
}
