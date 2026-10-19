/**
 * Pessoas de exemplo das demos (retratos do Pedro, em public/brand), WebP em
 * 48/96/192px. `photo(pessoa, tamanho)` escolhe o arquivo certo para o
 * Avatar: 48 para 24px, 96 para 32/40px (cobre tela 2x).
 */
export const PEOPLE = {
  pedro: { name: "Pedro Veloso", file: "avatar-pedro" },
  erica: { name: "Érica Nunes", file: "avatar-erica" },
  sena: { name: "Sena Rocha", file: "avatar-sena" },
} as const;

export type Person = keyof typeof PEOPLE;

export function photo(person: Person, size: 24 | 32 | 40 = 32) {
  return `/brand/${PEOPLE[person].file}-${size <= 24 ? 48 : 96}.webp`;
}
