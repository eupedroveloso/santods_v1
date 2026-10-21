"use client";

import { Select } from "./listbox";
import { Swatch } from "./swatch";

export type BrandOption = { id: string; label: string };

/** Ponto na cor da marca: o data-brand no invólucro resolve as vars daquela marca. */
function BrandDot({ id }: { id: string }) {
  return (
    <span data-brand={id} className="contents">
      <Swatch color="var(--santo-color-bg-brand-solid-default)" size="xs" round />
    </span>
  );
}

/**
 * Seletor de marca: escolhe qual identidade do DS pinta a interface (o valor
 * vai para o atributo data-brand, que o tokens.css le — mesmas vars --santo-*,
 * outros valores). Use no topo da documentacao ou de um app multi-marca, ao
 * lado do seletor de tema. Dropdown compacto (Select variant="compact", sm), que
 * cresce com o catalogo: cada marca com o ponto na cor dela, nome e check na
 * ativa. E controlado: quem persiste e aplica o atributo e o pai. Com uma
 * marca so, nao renderiza nada (nao ha o que escolher).
 */
export function BrandSwitch({
  brands,
  value,
  onChange,
  label = "Marca",
  className = "",
}: {
  /** Marcas na ordem de exibicao: id = brand/id (`santo`, `vtsd`), label = nome curto. */
  brands: BrandOption[];
  value: string;
  onChange: (id: string) => void;
  /** Rotulo acessivel do seletor. */
  label?: string;
  className?: string;
}) {
  if (brands.length < 2) return null;
  return (
    <Select
      value={value}
      onChange={onChange}
      label={label}
      size="sm"
      variant="compact"
      className={className}
      options={brands.map((b) => ({ value: b.id, label: b.label, leading: <BrandDot id={b.id} /> }))}
    />
  );
}
