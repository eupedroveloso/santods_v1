"use client";

import { useEffect, useMemo, useState } from "react";
import { useGoogleFonts } from "@/lib/fonts/use-google-font";
import { declarations, emitTypographyCss } from "@/lib/tokens/emit.mjs";
import { countOverrides } from "@/lib/tokens/brand";
import type { Brand, TokenDoc } from "@/lib/tokens/types";
import {
  Button,
  Chip,
  Disclosure,
  Icon,
  IconButton,
  SearchInput,
  Segmented,
  Select,
  Swatch,
  TabBar,
} from "@/lib/ui";
import { Foundations } from "@/app/_screens/foundations";
import { ApplicationScreen, CardsScreen, DashboardScreen } from "@/app/_screens/showcase";
import { GROUPS, TABS, type TabId, searchTokens, tokensOf } from "./groups";
import { BrandPanel } from "./brand-panel";
import { TypographyPanel } from "./typography-panel";
import { TokenRow } from "./token-row";
import { ExportPanel } from "./export-panel";
import { SavePanel } from "./save-panel";
import { useThemeDoc } from "./use-theme-doc";

const PREVIEW_ID = "santo-preview";

type PreviewTab = "foundations" | "cards" | "dashboard" | "application";
/**
 * Quatro amostras que resumem a marca, como os quadradinhos do preset no alvo.
 * Apontam para as variaveis do escopo do preview, entao acompanham a edicao.
 */
const PRESET_TOKENS = [
  "color/bg/brand/solid/default",
  "color/bg/accent/solid/default",
  "color/surface/page",
  "color/text/primary",
];

const PREVIEW_TABS: { value: PreviewTab; label: string }[] = [
  { value: "foundations", label: "Foundations" },
  { value: "cards", label: "Cards" },
  { value: "dashboard", label: "Dashboard" },
  { value: "application", label: "Aplicação" },
];

export function Studio({ base, brands }: { base: TokenDoc; brands: Brand[] }) {
  const store = useThemeDoc(base, brands.find((b) => b.id === "santo") ?? brands[0]);
  const { doc, brand, brandMeta, setBrandMeta, overrides } = store;

  const [tab, setTab] = useState<TabId>("marca");
  const [previewTab, setPreviewTab] = useState<PreviewTab>("cards");
  const [mode, setMode] = useState<"Light" | "Dark">("Light");
  const [search, setSearch] = useState("");
  const [open, setOpen] = useState<Record<string, boolean>>({ "color-surface": true });
  const [panel, setPanel] = useState<"none" | "export" | "save">("none");

  // A moldura do Studio segue o mesmo modo do preview. Deixar a moldura no tema
  // do sistema e o preview em outro e o que fazia a tela parecer quebrada.
  useEffect(() => {
    document.documentElement.setAttribute("data-theme", mode === "Dark" ? "dark" : "light");
    return () => document.documentElement.removeAttribute("data-theme");
  }, [mode]);

  /**
   * CSS do preview: as mesmas funcoes que o build usa, escopadas em #santo-preview.
   * Nao existe segundo caminho de renderizacao — o que aparece aqui e o que sai
   * no arquivo gerado.
   */
  const previewCss = useMemo(() => {
    const decls = declarations(doc, mode)
      .map((d) => `${d.varName}:${d.value}`)
      .join(";");
    const typography = emitTypographyCss(doc, { banner: "" }).replace(
      /^\.santo-/gm,
      `#${PREVIEW_ID} .santo-`,
    );
    return `#${PREVIEW_ID}{${decls};color-scheme:${mode.toLowerCase()}}\n${typography}`;
  }, [doc, mode]);

  // As familias vem dos tokens, entao trocar o token tem que trazer a fonte.
  useGoogleFonts([
    String(doc.collections.Brand.variables["brand/family/sans"].value),
    String(doc.collections.Brand.variables["brand/family/mono"].value),
  ]);

  const dirtyCount = countOverrides(overrides);
  const changedTokens = useMemo(() => new Set(Object.keys(overrides.variables)), [overrides]);
  const hits = useMemo(() => searchTokens(doc, search), [doc, search]);
  const tokenCount = useMemo(
    () => Object.values(doc.collections).reduce((a, c) => a + Object.keys(c.variables).length, 0),
    [doc],
  );

  return (
    <div className="flex h-dvh flex-col overflow-hidden bg-surface-page text-text-primary">
      <style dangerouslySetInnerHTML={{ __html: previewCss }} />

      {/* ---------------------------------------------- barra do aplicativo */}
      <header className="flex h-(--santo-dimension-size-56) shrink-0 items-center gap-sm border-b-thin border-border-subtle bg-surface-raised px-md">
        <span className="flex items-center gap-2xs">
          <span className="text-text-brand">
            <Icon.Palette size={20} />
          </span>
          <span className="santo-body-semibold">SantoDS Studio</span>
        </span>
        <span className="santo-caption-regular hidden text-text-tertiary sm:inline">
          {tokenCount} tokens · {Object.keys(doc.textStyles).length} text styles ·{" "}
          {Object.keys(doc.effectStyles).length} sombras
        </span>

        <div className="ml-auto flex items-center gap-2xs">
          <Button
            variant="ghost"
            size="sm"
            leading={<Icon.Figma size={16} />}
            onClick={() =>
              window.open(
                `https://www.figma.com/design/${doc.meta.fileKey}/${doc.meta.fileName.replace(/\s+/g, "-")}`,
                "_blank",
                "noopener,noreferrer",
              )
            }
          >
            Abrir no Figma
          </Button>
          <Button variant="primary" size="sm" leading={<Icon.Save size={16} />} onClick={() => setPanel("save")}>
            Salvar marca
          </Button>
        </div>
      </header>

      {/* --------------------------------------------- barra de ferramentas */}
      <div className="flex h-(--santo-dimension-size-48) shrink-0 items-stretch border-b-thin border-border-subtle bg-surface-raised">
        {/* segmento sobre a sidebar: seletor de marca */}
        <div className="flex w-(--santo-dimension-container-sm) max-w-[38%] shrink-0 items-center gap-xs border-r-thin border-border-subtle px-md">
          <span className="flex shrink-0 items-center gap-3xs">
            {PRESET_TOKENS.map((name) => (
              <Swatch
                key={name}
                size="xs"
                round
                color={`var(--santo-${name.replace(/\//g, "-")})`}
                title={name}
              />
            ))}
          </span>
          <Select
            size="sm"
            className="min-w-0 flex-1"
            value={brandMeta.id}
            onChange={(id) => {
              const next = brands.find((b) => b.id === id);
              if (next) store.loadBrand(next);
            }}
            label="Marca"
            options={[
              ...brands.map((b) => ({
                value: b.id,
                label: b.name,
                hint: b.id === "santo" ? "Base do Figma" : `${countOverrides(b.overrides)} overrides`,
              })),
              ...(brands.some((b) => b.id === brandMeta.id)
                ? []
                : [{ value: brandMeta.id, label: brandMeta.name, hint: "não salva" }]),
            ]}
          />
          {dirtyCount > 0 && (
            <span
              className="santo-caption-small-semibold shrink-0 rounded-full bg-accent-subtle-default px-2xs text-text-accent"
              title={`${dirtyCount} alteração(ões) ainda não salvas`}
            >
              {dirtyCount}
            </span>
          )}
        </div>

        {/* segmento sobre o preview: acoes */}
        <div className="flex min-w-0 flex-1 items-center gap-2xs px-md">
          <Segmented
            value={mode}
            onChange={setMode}
            options={[
              { value: "Light", label: <Icon.Sun size={16} />, title: "Tema claro" },
              { value: "Dark", label: <Icon.Moon size={16} />, title: "Tema escuro" },
            ]}
          />
          <span className="h-(--santo-dimension-space-20) w-px shrink-0 bg-border-subtle" />
          <IconButton size="sm" label="Desfazer" onClick={store.undo} disabled={!store.canUndo}>
            <Icon.Undo size={16} />
          </IconButton>
          <IconButton size="sm" label="Refazer" onClick={store.redo} disabled={!store.canRedo}>
            <Icon.Redo size={16} />
          </IconButton>

          <div className="ml-auto flex items-center gap-2xs">
            <Button
              variant="ghost"
              size="sm"
              leading={<Icon.Reset size={16} />}
              onClick={store.resetAll}
              disabled={dirtyCount === 0}
            >
              Zerar
            </Button>
            <Button variant="ghost" size="sm" leading={<Icon.Code size={16} />} onClick={() => setPanel("export")}>
              Código
            </Button>
          </div>
        </div>
      </div>

      <div className="flex min-h-0 flex-1">
        {/* -------------------------------------------------------- editor */}
        <aside className="flex w-(--santo-dimension-container-sm) max-w-[38%] shrink-0 flex-col border-r-thin border-border-subtle bg-surface-raised">
          <div className="flex shrink-0 flex-col gap-sm p-md pb-sm">
            <div className="flex items-center gap-3xs">
              {TABS.map((t) => (
                <Chip key={t.id} active={tab === t.id && !search} onClick={() => { setTab(t.id); setSearch(""); }}>
                  {t.label}
                </Chip>
              ))}
            </div>
            <SearchInput
              size="sm"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Buscar token…"
            />
          </div>

          <div className="min-h-0 flex-1 overflow-y-auto px-md pb-lg">
            {search ? (
              <div className="flex flex-col gap-md">
                {hits.length === 0 && (
                  <p className="santo-body-small-regular text-text-tertiary">
                    Nenhum token com “{search}”.
                  </p>
                )}
                {hits.map(({ group, names }) => (
                  <div key={group.id} className="flex flex-col gap-2xs">
                    <span className="santo-caption-small-semibold tracking-wide text-text-tertiary uppercase">
                      {group.label}
                    </span>
                    {names.map((name) => (
                      <TokenRow
                        key={name}
                        doc={doc}
                        base={base}
                        collection={group.collection}
                        name={name}
                        mode={mode}
                        onChange={store.setVariableValue}
                        onReset={store.resetToken}
                      />
                    ))}
                  </div>
                ))}
              </div>
            ) : tab === "marca" ? (
              <BrandPanel
                doc={doc}
                base={base}
                mode={mode}
                onChangeMany={store.setVariableValues}
              />
            ) : tab === "tipografia" ? (
              <TypographyPanel
                doc={doc}
                onChangeOne={store.setVariableValue}
                onChangeTextStyles={store.setTextStyles}
              />
            ) : (
              <div className="flex flex-col gap-2xs">
                {GROUPS[tab].map((group) => {
                  const names = tokensOf(doc, group);
                  if (names.length === 0) return null;
                  const changed = names.filter((n) => changedTokens.has(n)).length;
                  return (
                    <Disclosure
                      key={group.id}
                      label={group.label}
                      open={open[group.id] ?? false}
                      onToggle={() => setOpen((o) => ({ ...o, [group.id]: !(o[group.id] ?? false) }))}
                      count={names.length}
                      badge={changed || undefined}
                      hint={group.hint}
                    >
                      {names.map((name) => (
                        <TokenRow
                          key={name}
                          doc={doc}
                          base={base}
                          collection={group.collection}
                          name={name}
                          mode={mode}
                          onChange={store.setVariableValue}
                          onReset={store.resetToken}
                        />
                      ))}
                    </Disclosure>
                  );
                })}
              </div>
            )}
          </div>
        </aside>

        {/* ------------------------------------------------------- preview */}
        <div className="flex min-w-0 flex-1 flex-col">
          <div className="flex h-(--santo-dimension-size-48) shrink-0 items-center gap-sm border-b-thin border-border-subtle bg-surface-raised px-md">
            <TabBar value={previewTab} onChange={setPreviewTab} options={PREVIEW_TABS} />
            <span className="santo-caption-regular ml-auto hidden shrink-0 text-text-tertiary lg:inline">
              {mode === "Light" ? "modo claro" : "modo escuro"}
            </span>
          </div>

          <div
            id={PREVIEW_ID}
            className="min-h-0 flex-1 overflow-y-auto bg-surface-page p-lg text-text-primary"
          >
            {previewTab === "foundations" && <Foundations doc={doc} />}
            {previewTab === "cards" && <CardsScreen />}
            {previewTab === "dashboard" && <DashboardScreen />}
            {previewTab === "application" && <ApplicationScreen />}
          </div>
        </div>
      </div>

      {panel === "export" && <ExportPanel doc={doc} brand={brand} onClose={() => setPanel("none")} />}
      {panel === "save" && (
        <SavePanel
          brand={brand}
          brandMeta={brandMeta}
          setBrandMeta={setBrandMeta}
          onSaved={() => undefined}
          onClose={() => setPanel("none")}
        />
      )}
    </div>
  );
}
