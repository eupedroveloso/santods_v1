/**
 * Ilustracoes de componente em estilo esqueleto, por slug do registry.
 *
 * Cada uma e ThumbFrame + Skeleton, sem texto, icone nem cor de marca — a
 * gramatica esta em .claude/skills/santo-vitrine/SKILL.md. Slug novo no
 * registry pede uma ilustracao aqui.
 */
import type { ComponentType } from "react";
import { ButtonThumb } from "./button.thumb";
import { IconButtonThumb } from "./icon-button.thumb";
import { InputThumb } from "./input.thumb";
import { TextareaThumb } from "./textarea.thumb";
import { SearchInputThumb } from "./search-input.thumb";
import { FieldThumb } from "./field.thumb";
import { SelectThumb } from "./select.thumb";
import { NumberFieldThumb } from "./number-field.thumb";
import { CheckboxThumb } from "./checkbox.thumb";
import { RadioThumb } from "./radio.thumb";
import { SwitchThumb } from "./switch.thumb";
import { SettingRowThumb } from "./setting-row.thumb";
import { SwatchThumb } from "./swatch.thumb";
import { SwatchPickerThumb } from "./swatch-picker.thumb";
import { ColorRowThumb } from "./color-row.thumb";
import { ColorPickerThumb } from "./color-picker.thumb";
import { ColorThumb } from "./color.thumb";
import { CardThumb } from "./card.thumb";
import { CardGridThumb } from "./card-grid.thumb";
import { AppSidebarThumb } from "./app-sidebar.thumb";
import { BrandLogoThumb } from "./brand-logo.thumb";
import { BrandSwitchThumb } from "./brand-switch.thumb";
import { BrandCardThumb } from "./brand-card.thumb";
import { DashboardHeaderThumb } from "./dashboard-header.thumb";
import { TransactionRowThumb } from "./transaction-row.thumb";
import { BentoGridThumb } from "./bento-grid.thumb";
import { SectionIntroThumb } from "./section-intro.thumb";
import { LogoStripThumb } from "./logo-strip.thumb";
import { ShowcaseStripThumb } from "./showcase-strip.thumb";
import { HeroCardThumb } from "./hero-card.thumb";
import { RatingThumb } from "./rating.thumb";
import { CtaButtonThumb } from "./cta-button.thumb";
import { YouTubeEmbedThumb } from "./youtube-embed.thumb";
import { LandingPageThumb } from "./landing-page.thumb";
import { LandingHeaderThumb } from "./landing-header.thumb";
import { LandingHeroThumb } from "./landing-hero.thumb";
import { LandingOfferThumb } from "./landing-offer.thumb";
import { SocialProofRowThumb } from "./social-proof-row.thumb";
import { SocialProofToastThumb } from "./social-proof-toast.thumb";
import { CardHeaderThumb } from "./card-header.thumb";
import { StatThumb } from "./stat.thumb";
import { DividerThumb } from "./divider.thumb";
import { DisclosureThumb } from "./disclosure.thumb";
import { SegmentedThumb } from "./segmented.thumb";
import { TabBarThumb } from "./tab-bar.thumb";
import { ChipThumb } from "./chip.thumb";
import { TagThumb } from "./tag.thumb";
import { CountThumb } from "./count.thumb";
import { BreadcrumbThumb } from "./breadcrumb.thumb";
import { LinkCardThumb } from "./link-card.thumb";
import { CommandPaletteThumb } from "./command-palette.thumb";
import { TableThumb } from "./table.thumb";
import { AvatarThumb } from "./avatar.thumb";
import { CalendarThumb } from "./calendar.thumb";
import { PaginationThumb } from "./pagination.thumb";
import { LineChartThumb } from "./line-chart.thumb";
import { AreaChartThumb } from "./area-chart.thumb";
import { BarChartThumb } from "./bar-chart.thumb";
import { StackedAreaChartThumb } from "./stacked-area-chart.thumb";
import { AxisLabelsThumb } from "./axis-labels.thumb";
import { ProgressThumb } from "./progress.thumb";
import { KeyValueThumb } from "./key-value.thumb";
import { SidebarNavThumb } from "./sidebar-nav.thumb";
import { NavSectionThumb } from "./nav-section.thumb";
import { NavItemThumb } from "./nav-item.thumb";
import { NavUserThumb } from "./nav-user.thumb";
import { ChatHeaderThumb } from "./chat-header.thumb";
import { ChatBubbleThumb } from "./chat-bubble.thumb";
import { ChatAttachmentThumb } from "./chat-attachment.thumb";
import { TypingIndicatorThumb } from "./typing-indicator.thumb";
import { ActivityItemThumb } from "./activity-item.thumb";
import { MarkerThumb } from "./marker.thumb";
import { TickerThumb } from "./ticker.thumb";
import { KbdThumb } from "./kbd.thumb";
import { CopyButtonThumb } from "./copy-button.thumb";
import { CopyCodeThumb } from "./copy-code.thumb";
import { CodeBlockThumb } from "./code-block.thumb";
import { IconThumb } from "./icon.thumb";
import { SkeletonThumb } from "./skeleton.thumb";
import { ThumbFrameThumb } from "./thumb-frame.thumb";
import { EmptyStateThumb } from "./empty-state.thumb";
import { IconTileThumb } from "./icon-tile.thumb";
import { ListRowThumb } from "./list-row.thumb";
import { OverlineThumb } from "./overline.thumb";
import { RadioGroupThumb } from "./radio-group.thumb";
import { RadioCardThumb } from "./radio-card.thumb";
import { SearchTriggerThumb } from "./search-trigger.thumb";
import { TokenSampleThumb } from "./token-sample.thumb";
import { TableOfContentsThumb } from "./table-of-contents.thumb";
import { CardFooterThumb } from "./card-footer.thumb";
import { AvatarGroupThumb } from "./avatar-group.thumb";
import { RingThumb } from "./ring.thumb";
import { SparklineThumb } from "./sparkline.thumb";
import { MiniBarsThumb } from "./mini-bars.thumb";
import { FabThumb } from "./fab.thumb";
import { RailNavThumb } from "./rail-nav.thumb";
import { RailItemThumb } from "./rail-item.thumb";
import { NavSubThumb } from "./nav-sub.thumb";
import { ChatComposerThumb } from "./chat-composer.thumb";

export const thumbs: Record<string, ComponentType> = {
  button: ButtonThumb,
  "icon-button": IconButtonThumb,
  input: InputThumb,
  textarea: TextareaThumb,
  "search-input": SearchInputThumb,
  field: FieldThumb,
  select: SelectThumb,
  "number-field": NumberFieldThumb,
  checkbox: CheckboxThumb,
  radio: RadioThumb,
  switch: SwitchThumb,
  "setting-row": SettingRowThumb,
  swatch: SwatchThumb,
  "swatch-picker": SwatchPickerThumb,
  "color-row": ColorRowThumb,
  "color-picker": ColorPickerThumb,
  color: ColorThumb,
  card: CardThumb,
  "card-grid": CardGridThumb,
  "app-sidebar": AppSidebarThumb,
  "brand-logo": BrandLogoThumb,
  "brand-switch": BrandSwitchThumb,
  "brand-card": BrandCardThumb,
  "dashboard-header": DashboardHeaderThumb,
  "transaction-row": TransactionRowThumb,
  "bento-grid": BentoGridThumb,
  "section-intro": SectionIntroThumb,
  "logo-strip": LogoStripThumb,
  "showcase-strip": ShowcaseStripThumb,
  "hero-card": HeroCardThumb,
  "rating": RatingThumb,
  "cta-button": CtaButtonThumb,
  "youtube-embed": YouTubeEmbedThumb,
  "landing-page": LandingPageThumb,
  "landing-header": LandingHeaderThumb,
  "landing-hero": LandingHeroThumb,
  "landing-offer": LandingOfferThumb,
  "social-proof-row": SocialProofRowThumb,
  "social-proof-toast": SocialProofToastThumb,
  "card-header": CardHeaderThumb,
  stat: StatThumb,
  divider: DividerThumb,
  disclosure: DisclosureThumb,
  segmented: SegmentedThumb,
  "tab-bar": TabBarThumb,
  chip: ChipThumb,
  tag: TagThumb,
  count: CountThumb,
  breadcrumb: BreadcrumbThumb,
  "link-card": LinkCardThumb,
  "command-palette": CommandPaletteThumb,
  table: TableThumb,
  avatar: AvatarThumb,
  calendar: CalendarThumb,
  pagination: PaginationThumb,
  "line-chart": LineChartThumb,
  "area-chart": AreaChartThumb,
  "bar-chart": BarChartThumb,
  "stacked-area-chart": StackedAreaChartThumb,
  "axis-labels": AxisLabelsThumb,
  progress: ProgressThumb,
  "key-value": KeyValueThumb,
  "sidebar-nav": SidebarNavThumb,
  "nav-section": NavSectionThumb,
  "nav-item": NavItemThumb,
  "nav-user": NavUserThumb,
  "chat-header": ChatHeaderThumb,
  "chat-bubble": ChatBubbleThumb,
  "chat-attachment": ChatAttachmentThumb,
  "typing-indicator": TypingIndicatorThumb,
  "activity-item": ActivityItemThumb,
  marker: MarkerThumb,
  ticker: TickerThumb,
  kbd: KbdThumb,
  "copy-button": CopyButtonThumb,
  "copy-code": CopyCodeThumb,
  "code-block": CodeBlockThumb,
  icon: IconThumb,
  skeleton: SkeletonThumb,
  "thumb-frame": ThumbFrameThumb,
  "empty-state": EmptyStateThumb,
  "icon-tile": IconTileThumb,
  "list-row": ListRowThumb,
  overline: OverlineThumb,
  "radio-group": RadioGroupThumb,
  "radio-card": RadioCardThumb,
  "search-trigger": SearchTriggerThumb,
  "token-sample": TokenSampleThumb,
  "table-of-contents": TableOfContentsThumb,
  "card-footer": CardFooterThumb,
  "avatar-group": AvatarGroupThumb,
  ring: RingThumb,
  sparkline: SparklineThumb,
  "mini-bars": MiniBarsThumb,
  fab: FabThumb,
  "rail-nav": RailNavThumb,
  "rail-item": RailItemThumb,
  "nav-sub": NavSubThumb,
  "chat-composer": ChatComposerThumb,
};
