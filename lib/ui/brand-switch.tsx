"use client";

import { Segmented } from "./segmented";

export type BrandOption = { id: string; label: string };

/**
 * Seletor de marca: escolhe qual identidade do DS pinta a interface (o valor
 * vai para o atributo data-brand, que o tokens.css le — mesmas vars --santo-*,
 * outros valores). Use no topo da documentacao ou de um app multi-marca, ao
 * lado do seletor de tema. E controlado: quem persiste e aplica o atributo e o
 * pai. Com uma marca so, nao renderiza nada (nao ha o que escolher).
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
  /** Rotulo acessivel do grupo. */
  label?: string;
  className?: string;
}) {
  if (brands.length < 2) return null;
  return (
    <div role="group" aria-label={label} className={className}>
      <Segmented
        value={value}
        onChange={onChange}
        options={brands.map((b) => ({ value: b.id, label: b.label, title: `Marca ${b.label}` }))}
      />
    </div>
  );
}
