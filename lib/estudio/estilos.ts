/**
 * Os estilos que um sistema do Estúdio personaliza, na ordem da navegação.
 *
 * Dado puro (serve servidor e cliente). O id é o valor gravado na coluna
 * `estilos.estilo` e o segmento da rota /estudio/<sistema>/<estilo>.
 */
export const ESTILOS = [
  { id: "cor", label: "Cor" },
  { id: "tipografia", label: "Tipografia" },
  { id: "raio", label: "Raio" },
  { id: "sombra", label: "Sombra" },
  { id: "espaco", label: "Espaço" },
  { id: "controles", label: "Controles" },
] as const;

export type EstiloId = (typeof ESTILOS)[number]["id"];

export const ESTILO_IDS = ESTILOS.map((e) => e.id) as [EstiloId, ...EstiloId[]];

export const isEstilo = (value: string): value is EstiloId => (ESTILO_IDS as string[]).includes(value);

export const estiloLabel = (id: EstiloId) => ESTILOS.find((e) => e.id === id)!.label;
