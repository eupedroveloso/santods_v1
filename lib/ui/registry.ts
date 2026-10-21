/**
 * Registro de componentes do SantoDS.
 *
 * Fonte unica de metadado: daqui saem o indice de /componentes, as paginas
 * /componentes/[slug], a sidebar e a busca da documentacao — e o check de par
 * com o Figma. Dado puro (sem JSX), entao serve a Server e Client Components.
 *
 * Componente novo em lib/ui: crie `<modulo>.meta.ts` e `<modulo>.demo.tsx`,
 * importe os dois aqui e em demos.ts.
 */
import { productLandingMeta } from "./product-landing.meta";
import type { ComponentMeta } from "./registry.types";
import { buttonMeta } from "./button.meta";
import { ringMeta } from "./ring.meta";
import { sparklineMeta } from "./sparkline.meta";
import { miniBarsMeta } from "./mini-bars.meta";
import { fabMeta } from "./fab.meta";
import { railNavMeta } from "./rail-nav.meta";
import { appSidebarMeta } from "./app-sidebar.meta";
import { editorFrameMeta } from "./editor-frame.meta";
import { saveIndicatorMeta } from "./save-indicator.meta";
import { stepRowMeta } from "./step-row.meta";
import { brandLogoMeta } from "./brand-logo.meta";
import { brandSwitchMeta } from "./brand-switch.meta";
import { brandCardMeta } from "./brand-card.meta";
import { dashboardHeaderMeta } from "./dashboard-header.meta";
import { breakdownCardMeta } from "./breakdown-card.meta";
import { downloadListMeta } from "./download-list.meta";
import { transactionRowMeta } from "./transaction-row.meta";
import { landingSectionsMeta } from "./landing-sections.meta";
import { ratingMeta } from "./rating.meta";
import { ctaButtonMeta } from "./cta-button.meta";
import { youtubeEmbedMeta } from "./youtube-embed.meta";
import { landingMeta } from "./landing.meta";
import { socialProofToastMeta } from "./social-proof-toast.meta";
import { inputMeta } from "./input.meta";
import { listboxMeta } from "./listbox.meta";
import { numberFieldMeta } from "./number-field.meta";
import { toggleMeta } from "./toggle.meta";
import { swatchMeta } from "./swatch.meta";
import { colorPickerMeta } from "./color-picker.meta";
import { colorMeta } from "./color.meta";
import { cardMeta } from "./card.meta";
import { cardGridMeta } from "./card-grid.meta";
import { disclosureMeta } from "./disclosure.meta";
import { segmentedMeta } from "./segmented.meta";
import { chipMeta } from "./chip.meta";
import { dataMeta } from "./data.meta";
import { navMeta } from "./nav.meta";
import { chartMeta } from "./chart.meta";
import { chatMeta } from "./chat.meta";
import { feedMeta } from "./feed.meta";
import { iconsMeta } from "./icons.meta";
import { kbdMeta } from "./kbd.meta";
import { copyButtonMeta } from "./copy-button.meta";
import { copyCodeMeta } from "./copy-code.meta";
import { codeBlockMeta } from "./code-block.meta";
import { markdownViewMeta } from "./markdown-view.meta";
import { breadcrumbMeta } from "./breadcrumb.meta";
import { linkCardMeta } from "./link-card.meta";
import { commandPaletteMeta } from "./command-palette.meta";
import { progressMeta } from "./progress.meta";
import { keyValueMeta } from "./key-value.meta";
import { skeletonMeta } from "./skeleton.meta";
import { thumbFrameMeta } from "./thumb-frame.meta";
import { overlineMeta } from "./overline.meta";
import { iconTileMeta } from "./icon-tile.meta";
import { emptyStateMeta } from "./empty-state.meta";
import { listRowMeta } from "./list-row.meta";
import { radioGroupMeta } from "./radio-group.meta";
import { tokenSampleMeta } from "./token-sample.meta";
import { searchTriggerMeta } from "./search-trigger.meta";
import { tableOfContentsMeta } from "./table-of-contents.meta";
import { statCardMeta } from "./stat-card.meta";
import { financeCardsMeta } from "./finance-cards.meta";
import { accountCardsMeta } from "./account-cards.meta";
import { appCardsMeta } from "./app-cards.meta";

export type * from "./registry.types";
export { CATEGORIES, CATEGORY_LABEL, TIERS, TIER_LABEL } from "./registry.config";
import { CATEGORIES, TIERS } from "./registry.config";

import { taskShowcaseMeta } from "./task-showcase.meta";

const ALL: ComponentMeta[] = [
  ...taskShowcaseMeta,
  ...productLandingMeta,
  ...buttonMeta,
  ...ringMeta,
  ...sparklineMeta,
  ...miniBarsMeta,
  ...fabMeta,
  ...railNavMeta,
  ...appSidebarMeta,
  ...brandLogoMeta,
  ...brandSwitchMeta,
  ...brandCardMeta,
  ...dashboardHeaderMeta,
  ...breakdownCardMeta,
  ...downloadListMeta,
  ...transactionRowMeta,
  ...landingSectionsMeta,
  ...ratingMeta,
  ...ctaButtonMeta,
  ...youtubeEmbedMeta,
  ...landingMeta,
  ...socialProofToastMeta,
  ...inputMeta,
  ...listboxMeta,
  ...numberFieldMeta,
  ...toggleMeta,
  ...swatchMeta,
  ...colorPickerMeta,
  ...colorMeta,
  ...cardMeta,
  ...cardGridMeta,
  ...disclosureMeta,
  ...segmentedMeta,
  ...chipMeta,
  ...dataMeta,
  ...navMeta,
  ...chartMeta,
  ...chatMeta,
  ...feedMeta,
  ...iconsMeta,
  ...kbdMeta,
  ...editorFrameMeta,
  ...saveIndicatorMeta,
  ...stepRowMeta,
  ...copyButtonMeta,
  ...copyCodeMeta,
  ...codeBlockMeta,
  ...markdownViewMeta,
  ...breadcrumbMeta,
  ...linkCardMeta,
  ...commandPaletteMeta,
  ...progressMeta,
  ...keyValueMeta,
  ...skeletonMeta,
  ...thumbFrameMeta,
  ...overlineMeta,
  ...iconTileMeta,
  ...emptyStateMeta,
  ...listRowMeta,
  ...radioGroupMeta,
  ...tokenSampleMeta,
  ...searchTriggerMeta,
  ...tableOfContentsMeta,
  ...statCardMeta,
  ...financeCardsMeta,
  ...accountCardsMeta,
  ...appCardsMeta,
];

/** Todos os componentes, ordenados por categoria e depois na ordem de declaracao. */
export const components: ComponentMeta[] = CATEGORIES.flatMap((c) =>
  ALL.filter((m) => m.category === c.id),
);

export function getComponent(slug: string): ComponentMeta | undefined {
  return components.find((c) => c.slug === slug);
}

/** Componentes agrupados por categoria, so as categorias com algum item. */
export function componentsByCategory() {
  return CATEGORIES.map((c) => ({ ...c, items: components.filter((m) => m.category === c.id) })).filter(
    (g) => g.items.length > 0,
  );
}

/** Pela camada declarada no meta, A–Z dentro de cada camada e categoria. */
export function componentsByTier() {
  return TIERS.map((t) => ({
    ...t,
    items: components.filter((c) => c.tier === t.id).sort((a, b) => a.name.localeCompare(b.name, "pt-BR")),
    categories: componentsByCategory()
      .map((g) => ({ ...g, items: g.items.filter((c) => c.tier === t.id).sort((a, b) => a.name.localeCompare(b.name, "pt-BR")) }))
      .filter((g) => g.items.length > 0),
  }));
}
