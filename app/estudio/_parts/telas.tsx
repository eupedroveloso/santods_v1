"use client";

import { VIEWS } from "../../exemplos/_views";
import { LANDING } from "../../exemplos/_anchors";
import { AmostraComponentes } from "./amostra";
import type { TelaId } from "./telas-dados";

const VIEW_DA_TELA: Record<Exclude<TelaId, "amostra">, string> = { dashboard: "dashboard", landing: LANDING.home };

/** A tela pedida, sob o escopo de quem chama (data-brand=rascunho). Telas de /exemplos com o respiro de página delas. */
export function Tela({ tela }: { tela: TelaId }) {
  if (tela === "amostra") return <AmostraComponentes />;
  const view = VIEWS.find((v) => v.slug === VIEW_DA_TELA[tela]);
  if (!view) return null;
  const { Component } = view;
  return (
    <div className={`flex min-h-full flex-col bg-surface-page ${view.bleed ? "" : "p-md lg:p-xl"}`}>
      <Component />
    </div>
  );
}
