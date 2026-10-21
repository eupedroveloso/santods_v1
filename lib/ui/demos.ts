import { taskShowcaseDemos } from "./task-showcase.demo";
/**
 * Demos de todos os componentes, por slug.
 *
 * Modulo de cliente (as demos tem estado e handlers). O registry.ts guarda o
 * dado; aqui fica o que renderiza. Componente novo: importe o `.demo.tsx` dele.
 */
import { productLandingDemos } from "./product-landing.demo";
import type { DemoMap } from "./registry.types";
import { buttonDemos } from "./button.demo";
import { ringDemos } from "./ring.demo";
import { sparklineDemos } from "./sparkline.demo";
import { miniBarsDemos } from "./mini-bars.demo";
import { fabDemos } from "./fab.demo";
import { railNavDemos } from "./rail-nav.demo";
import { appSidebarDemos } from "./app-sidebar.demo";
import { editorFrameDemos } from "./editor-frame.demo";
import { fontPickerDemos } from "./font-picker.demo";
import { saveIndicatorDemos } from "./save-indicator.demo";
import { stepRowDemos } from "./step-row.demo";
import { brandLogoDemos } from "./brand-logo.demo";
import { brandSwitchDemos } from "./brand-switch.demo";
import { brandCardDemos } from "./brand-card.demo";
import { dashboardHeaderDemos } from "./dashboard-header.demo";
import { breakdownCardDemos } from "./breakdown-card.demo";
import { downloadListDemos } from "./download-list.demo";
import { transactionRowDemos } from "./transaction-row.demo";
import { landingSectionsDemos } from "./landing-sections.demo";
import { ratingDemos } from "./rating.demo";
import { ctaButtonDemos } from "./cta-button.demo";
import { youtubeEmbedDemos } from "./youtube-embed.demo";
import { landingDemos } from "./landing.demo";
import { socialProofToastDemos } from "./social-proof-toast.demo";
import { inputDemos } from "./input.demo";
import { listboxDemos } from "./listbox.demo";
import { numberFieldDemos } from "./number-field.demo";
import { toggleDemos } from "./toggle.demo";
import { swatchDemos } from "./swatch.demo";
import { colorPickerDemos } from "./color-picker.demo";
import { colorDemos } from "./color.demo";
import { cardDemos } from "./card.demo";
import { cardGridDemos } from "./card-grid.demo";
import { disclosureDemos } from "./disclosure.demo";
import { segmentedDemos } from "./segmented.demo";
import { chipDemos } from "./chip.demo";
import { dataDemos } from "./data.demo";
import { navDemos } from "./nav.demo";
import { chartDemos } from "./chart.demo";
import { chatDemos } from "./chat.demo";
import { feedDemos } from "./feed.demo";
import { iconsDemos } from "./icons.demo";
import { kbdDemos } from "./kbd.demo";
import { copyButtonDemos } from "./copy-button.demo";
import { copyCodeDemos } from "./copy-code.demo";
import { codeBlockDemos } from "./code-block.demo";
import { markdownViewDemos } from "./markdown-view.demo";
import { breadcrumbDemos } from "./breadcrumb.demo";
import { linkCardDemos } from "./link-card.demo";
import { commandPaletteDemos } from "./command-palette.demo";
import { progressDemos } from "./progress.demo";
import { keyValueDemos } from "./key-value.demo";
import { skeletonDemos } from "./skeleton.demo";
import { thumbFrameDemos } from "./thumb-frame.demo";
import { nestDemos } from "./nest.demo";
import { overlineDemos } from "./overline.demo";
import { iconTileDemos } from "./icon-tile.demo";
import { emptyStateDemos } from "./empty-state.demo";
import { listRowDemos } from "./list-row.demo";
import { radioGroupDemos } from "./radio-group.demo";
import { tokenSampleDemos } from "./token-sample.demo";
import { searchTriggerDemos } from "./search-trigger.demo";
import { tableOfContentsDemos } from "./table-of-contents.demo";
import { statCardDemos } from "./stat-card.demo";
import { financeCardsDemos } from "./finance-cards.demo";
import { accountCardsDemos } from "./account-cards.demo";
import { appCardsDemos } from "./app-cards.demo";

export const demos: DemoMap = {
  ...taskShowcaseDemos,
  ...productLandingDemos,
  ...buttonDemos,
  ...ringDemos,
  ...sparklineDemos,
  ...miniBarsDemos,
  ...fabDemos,
  ...railNavDemos,
  ...appSidebarDemos,
  ...brandLogoDemos,
  ...brandSwitchDemos,
  ...brandCardDemos,
  ...dashboardHeaderDemos,
  ...breakdownCardDemos,
  ...downloadListDemos,
  ...transactionRowDemos,
  ...landingSectionsDemos,
  ...ratingDemos,
  ...ctaButtonDemos,
  ...youtubeEmbedDemos,
  ...landingDemos,
  ...socialProofToastDemos,
  ...inputDemos,
  ...listboxDemos,
  ...numberFieldDemos,
  ...toggleDemos,
  ...swatchDemos,
  ...colorPickerDemos,
  ...colorDemos,
  ...cardDemos,
  ...cardGridDemos,
  ...disclosureDemos,
  ...segmentedDemos,
  ...chipDemos,
  ...dataDemos,
  ...navDemos,
  ...chartDemos,
  ...chatDemos,
  ...feedDemos,
  ...iconsDemos,
  ...kbdDemos,
  ...editorFrameDemos,
  ...fontPickerDemos,
  ...saveIndicatorDemos,
  ...stepRowDemos,
  ...copyButtonDemos,
  ...copyCodeDemos,
  ...codeBlockDemos,
  ...markdownViewDemos,
  ...breadcrumbDemos,
  ...linkCardDemos,
  ...commandPaletteDemos,
  ...progressDemos,
  ...keyValueDemos,
  ...skeletonDemos,
  ...thumbFrameDemos,
  ...nestDemos,
  ...overlineDemos,
  ...iconTileDemos,
  ...emptyStateDemos,
  ...listRowDemos,
  ...radioGroupDemos,
  ...tokenSampleDemos,
  ...searchTriggerDemos,
  ...tableOfContentsDemos,
  ...statCardDemos,
  ...financeCardsDemos,
  ...accountCardsDemos,
  ...appCardsDemos,
};
