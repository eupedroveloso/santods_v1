/** Mensagens entre o editor e a rota /estudio/preview (iframe, mesma origem). */
export type MensagemRascunho = { tipo: "estudio-rascunho"; css: string; familias: string[] };
export type MensagemAltura = { tipo: "estudio-altura"; altura: number };
