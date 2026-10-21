"use client";

import { useCallback, useMemo, useSyncExternalStore } from "react";
import { isTela, LARGURAS, type LarguraId, type TelaId } from "./telas-dados";

/**
 * Preferência de visualização do editor, por sistema: modo (Docs | Preview),
 * tela, tema do preview grande e largura de aparelho. Não é rascunho: fica fora
 * do desfazer. localStorage com try/catch (aba privada, storage bloqueado);
 * useSyncExternalStore faz o SSR e a hidratação usarem o padrão, e o valor
 * salvo entra logo depois, sem divergir.
 */
export type Modo = "docs" | "preview";
export type Tema = "light" | "dark";
export type Preferencia = { modo: Modo; tela: TelaId; tema: Tema; largura: LarguraId };

const PADRAO: Preferencia = { modo: "docs", tela: "amostra", tema: "light", largura: "desktop" };
const AVISO = "estudio-preferencia";

const assinar = (cb: () => void) => {
  window.addEventListener(AVISO, cb);
  window.addEventListener("storage", cb);
  return () => {
    window.removeEventListener(AVISO, cb);
    window.removeEventListener("storage", cb);
  };
};

/** Sem storage (aba privada, bloqueado), a preferência vale até recarregar. */
const memoria = new Map<string, string>();

function ler(chave: string) {
  try {
    return localStorage.getItem(chave) ?? memoria.get(chave) ?? "";
  } catch {
    return memoria.get(chave) ?? "";
  }
}

function interpretar(bruto: string): Preferencia {
  try {
    const v = JSON.parse(bruto) as Partial<Preferencia>;
    return {
      modo: v.modo === "preview" ? "preview" : "docs",
      tela: isTela(v.tela) ? v.tela : PADRAO.tela,
      tema: v.tema === "dark" ? "dark" : "light",
      largura: LARGURAS.some((l) => l.id === v.largura) ? (v.largura as LarguraId) : PADRAO.largura,
    };
  } catch {
    return PADRAO;
  }
}

export function usePreferencia(sistemaId: string) {
  const chave = `estudio-preview:${sistemaId}`;
  const bruto = useSyncExternalStore(assinar, () => ler(chave), () => "");
  const pref = useMemo(() => interpretar(bruto), [bruto]);
  const muda = useCallback(
    (patch: Partial<Preferencia>) => {
      const valor = JSON.stringify({ ...interpretar(ler(chave)), ...patch });
      memoria.set(chave, valor);
      try {
        localStorage.setItem(chave, valor);
      } catch {
        // sem storage: fica só na memória da página
      }
      window.dispatchEvent(new Event(AVISO));
    },
    [chave],
  );
  return [pref, muda] as const;
}
