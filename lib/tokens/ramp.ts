/**
 * Geração de rampa a partir de uma cor-semente.
 *
 * A ideia é simples e é o que faz um design system derivado parecer da mesma
 * família do Santo em vez de um tema aleatório: **a semente define matiz e
 * saturação; a curva de luminosidade continua sendo a do Santo.**
 *
 * Essa curva não é um degradê linear — ela foi calibrada no Figma para que o 600
 * tenha contraste sobre branco, o 950 funcione como fundo escuro e os passos
 * intermediários se distingam. Jogar isso fora e gerar `hsl(h, s, 95%..10%)`
 * produz rampa que parece certa isolada e falha na interface real.
 *
 * A saturação também acompanha a forma da rampa original: se no Santo o 50 é
 * bem menos saturado que o 500, essa proporção se mantém na rampa nova.
 */

import { hexToRgb, rgbToHex, rgbToHsl, hslToRgb } from "@/lib/ui/color";

export const RAMP_STEPS = [50, 100, 200, 300, 400, 500, 600, 700, 800, 900, 950] as const;
export type RampStep = (typeof RAMP_STEPS)[number];

/** O degrau que a semente representa. */
export const SEED_STEP: RampStep = 500;

/**
 * Rampa nova a partir da rampa de referência e de uma semente.
 *
 * @param reference hex de cada degrau da rampa original, na ordem de RAMP_STEPS
 * @param seed hex da cor que deve ocupar o degrau 500
 */
export function generateRamp(reference: string[], seed: string): string[] {
  const seedHsl = rgbToHsl(hexToRgb(seed));
  const refHsl = reference.map((hex) => rgbToHsl(hexToRgb(hex)));
  const anchor = refHsl[RAMP_STEPS.indexOf(SEED_STEP)];

  // Fator de saturação do degrau em relação ao 500 da rampa original.
  const ratioAt = (i: number) => (anchor.s === 0 ? 1 : refHsl[i].s / anchor.s);

  return refHsl.map((step, i) => {
    const s = Math.min(1, Math.max(0, seedHsl.s * ratioAt(i)));
    return rgbToHex(hslToRgb({ h: seedHsl.h, s, l: step.l }));
  });
}

/** Nomes de token de uma família de paleta, na ordem dos degraus. */
export function rampTokenNames(family: string): string[] {
  return RAMP_STEPS.map((step) => `palette/${family}/${step}`);
}

/**
 * Famílias de paleta editáveis pela aba Marca.
 *
 * `neutral` entra: é a base de superfície e fundo, e na prática é o ajuste mais
 * usado — puxar o cinza para o azul ou para o quente muda a temperatura do
 * produto inteiro. Os degraus 0 e 1000 ficam de fora da geração porque são
 * branco e preto puros, âncoras da escala.
 */
export const BRAND_FAMILIES = [
  { key: "neutral", label: "Neutro" },
  { key: "brand", label: "Marca" },
  { key: "accent", label: "Destaque" },
  { key: "success", label: "Sucesso" },
  { key: "warning", label: "Atenção" },
  { key: "danger", label: "Perigo" },
  { key: "info", label: "Informação" },
] as const;
