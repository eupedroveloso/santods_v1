"use client";

import { useEffect, useState } from "react";
import type { ReactNode } from "react";
import { Button, Card, CardGrid, Chip, CopyCode, Icon, IconButton, IconTile, Skeleton, Switch } from "@/lib/ui";
import { RECIPES, type RecipeClass } from "./recipes";

/** A demo de cada receita de recipes.ts. */
const tile = (
  <IconTile shape="round" size="lg">
    <Icon.Sparkles size={20} />
  </IconTile>
);

const bars = (
  <span className="flex w-full flex-col gap-xs">
    <Skeleton.Bar w="lg" size="lg" tone="strong" />
    <Skeleton.Bar w="xl" />
    <Skeleton.Bar w="lg" />
  </span>
);

const DEMO: Record<RecipeClass, (on: boolean) => ReactNode> = {
  "santo-transition-colors": (on) => <Chip active={on}>Selecionado</Chip>,
  "santo-transition-opacity": (on) => <span className={`santo-transition-opacity ${on ? "opacity-0" : "opacity-100"}`}>{tile}</span>,
  "santo-transition-transform": (on) => (
    <span className={`santo-transition-transform ${on ? "translate-x-xl" : "-translate-x-xl"}`}>{tile}</span>
  ),
  "santo-press": () => <Button variant="secondary">Pressione</Button>,
  "santo-animate-fade-in": () => <span className="santo-animate-fade-in">{tile}</span>,
  "santo-animate-scale-in": () => <span className="santo-animate-scale-in">{tile}</span>,
  "santo-animate-slide-in-up": () => <span className="santo-animate-slide-in-up">{tile}</span>,
  "santo-animate-slide-in-right": () => <span className="santo-animate-slide-in-right">{tile}</span>,
  "santo-animate-pop": () => <span className="santo-animate-pop">{tile}</span>,
  "santo-animate-pulse": () => <span className="santo-animate-pulse flex w-full">{bars}</span>,
  "santo-animate-shimmer": () => <Skeleton.Block h="xl" radius="full" animated />,
  "santo-collapse": (on) => (
    <div className="santo-collapse w-full" data-open={!on}>
      <div>{bars}</div>
    </div>
  ),
};

function RecipeCard({ recipe }: { recipe: (typeof RECIPES)[number] }) {
  const [run, setRun] = useState(0);
  const [on, setOn] = useState(false);
  return (
    <Card padding="md" className="h-full">
      <div className="flex items-center justify-between gap-xs">
        <CopyCode value={recipe.cls} label={`Copiar ${recipe.cls}`} />
        {recipe.mode !== "none" && (
          <IconButton
            size="sm"
            label={recipe.mode === "replay" ? "Repetir" : "Alternar"}
            onClick={() => (recipe.mode === "replay" ? setRun((n) => n + 1) : setOn((v) => !v))}
          >
            {recipe.mode === "replay" ? <Icon.Redo size={16} /> : <Icon.Shuffle size={16} />}
          </IconButton>
        )}
      </div>
      <Card variant="well" className="h-(--santo-dimension-space-128) items-center justify-center overflow-hidden">
        <span key={run} className="flex w-full items-center justify-center">
          {DEMO[recipe.cls](on)}
        </span>
      </Card>
    </Card>
  );
}

export function MotionRecipes() {
  return (
    <CardGrid columns={{ sm: 2 }} gap="md">
      {RECIPES.map((r) => (
        <RecipeCard key={r.cls} recipe={r} />
      ))}
    </CardGrid>
  );
}

/** Simula prefers-reduced-motion na pagina: [data-reduced-motion] na raiz, desfeito ao sair. */
export function ReducedMotionSwitch() {
  const [reduced, setReduced] = useState(false);
  useEffect(() => {
    const root = document.documentElement;
    if (reduced) root.setAttribute("data-reduced-motion", "");
    else root.removeAttribute("data-reduced-motion");
    return () => root.removeAttribute("data-reduced-motion");
  }, [reduced]);
  return (
    <span className="flex items-center gap-xs">
      <span className="santo-caption-medium text-text-secondary">Reduzir movimento</span>
      <Switch checked={reduced} onChange={setReduced} label="Reduzir movimento" />
    </span>
  );
}
