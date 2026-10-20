/** Destinos canônicos da landing e compatibilidade com links já divulgados. */
export const LANDING = {
  home: "landing",
  resources: "landing-recursos",
  results: "landing-resultados",
  steps: "landing-passos",
  stories: "landing-historias",
  contact: "landing-conversar",
} as const;

export const LANDING_BLOCKS = [
  { id: LANDING.resources, label: "Recursos" },
  { id: LANDING.results, label: "Resultados" },
  { id: LANDING.steps, label: "Como funciona" },
  { id: LANDING.stories, label: "Histórias" },
  { id: LANDING.contact, label: "Começar" },
];

const LEGACY_LANDING: Record<string, string> = {
  "landing-metodo": LANDING.resources,
  "landing-para-quem": LANDING.stories,
  "landing-suporte": LANDING.contact,
  "landing-login": LANDING.steps,
  "landing-entrar": LANDING.steps,
};

/** Usado tanto pela visualização quanto pelo estado ativo da sidebar. */
export function canonicalExampleHash(hash: string): string {
  if (hash === "compasso" || hash.startsWith("compasso-")) {
    return LANDING.home + hash.slice("compasso".length);
  }
  return LEGACY_LANDING[hash] ?? hash;
}
