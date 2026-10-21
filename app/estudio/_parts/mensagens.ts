/** Mensagens entre o editor e a rota /estudio/preview (iframe, mesma origem). */
/** `fontes`: URLs css2 de derivar().fontes (uma por família, só os pesos usados). */
export type MensagemRascunho = { tipo: "estudio-rascunho"; css: string; fontes: string[] };
export type MensagemAltura = { tipo: "estudio-altura"; altura: number };
