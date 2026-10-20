/**
 * Acervo único das demos e exemplos, em public/brand. Avatar usa até 40px:
 * 48 para 24px, 96 para 32/40px (cobre tela 2x). Leo e Clara têm AVIF + WebP;
 * os retratos anteriores mantêm WebP. `portrait` fornece nome, alt e fontes;
 * `photo` preserva a API para consumidores que precisam só do src WebP.
 */
type PersonRecord = { name: string; file: string; src: string; alt: string; avif?: boolean };

export const PEOPLE = {
  pedro: { name: "Pedro Veloso", file: "avatar-pedro", src: "/brand/avatar-pedro-96.webp", alt: "Ilustração de Pedro Veloso em tons de azul." },
  erica: { name: "Érica Nunes", file: "avatar-erica", src: "/brand/avatar-erica-96.webp", alt: "Ilustração de Érica Nunes em tons de azul." },
  sena: { name: "Sena Rocha", file: "avatar-sena", src: "/brand/avatar-sena-96.webp", alt: "Ilustração de Sena Rocha em tons de azul." },
  leo: { name: "Leo", file: "avatar-leo", src: "/brand/avatar-leo-96.webp", alt: "Ilustração azul de Leo, rapaz de óculos e fones de ouvido.", avif: true },
  // Crop de origem: 1000×1000 em x=200/y=0, centralizando o rosto antes do resize.
  clara: { name: "Clara", file: "avatar-clara", src: "/brand/avatar-clara-96.webp", alt: "Ilustração azul de Clara sorrindo, com cabelo ondulado preso, brinco e tatuagem floral no ombro.", avif: true },
} as const satisfies Record<string, PersonRecord>;

export type Person = keyof typeof PEOPLE;
export type Portrait = { name: string; src: string; alt: string; avifSrc?: string };

export function photo(person: Person, size: 24 | 32 | 40 = 32) {
  return size <= 24 ? `/brand/${PEOPLE[person].file}-48.webp` : PEOPLE[person].src;
}

/** Props de Avatar prontas: AVIF preferido, WebP de fallback e alt do acervo. */
export function portrait(person: Person, size: 24 | 32 | 40 = 32): Portrait {
  const entry = PEOPLE[person];
  return {
    name: entry.name,
    alt: entry.alt,
    src: photo(person, size),
    avifSrc: "avif" in entry && entry.avif ? `/brand/${entry.file}-${size <= 24 ? 48 : 96}.avif` : undefined,
  };
}
