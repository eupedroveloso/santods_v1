/** Dados do preview de telas (sem "use client": servem a Server e Client Components). */

/** Telas do preview: a amostra de componentes e as telas reais de /exemplos (registro VIEWS, sem cópia). */
export const TELAS = [
  { id: "amostra", label: "Amostra" },
  { id: "dashboard", label: "Dashboard" },
  { id: "landing", label: "Landing" },
] as const;
export type TelaId = (typeof TELAS)[number]["id"];
export const isTela = (v: string | null | undefined): v is TelaId => TELAS.some((t) => t.id === v);

/** Larguras de aparelho (dado do pedido, não estilo): o iframe ganha a largura e a altura de tela de cada um. */
export const LARGURAS = [
  { id: "desktop", label: "Desktop", largura: 1440, altura: 900 },
  { id: "tablet", label: "Tablet", largura: 834, altura: 1112 },
  { id: "celular", label: "Celular", largura: 390, altura: 844 },
] as const;
export type LarguraId = (typeof LARGURAS)[number]["id"];

