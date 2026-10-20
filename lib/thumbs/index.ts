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
import { DonutChartThumb } from "./donut-chart.thumb";
import { ChartGridThumb } from "./chart-grid.thumb";
import { ChartLegendThumb } from "./chart-legend.thumb";
import { ChartTooltipThumb } from "./chart-tooltip.thumb";
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
import { StatCardThumb } from "./stat-card.thumb";
import { GoalsCardThumb } from "./goals-card.thumb";
import { InvestCardThumb } from "./invest-card.thumb";
import { LimitCardThumb } from "./limit-card.thumb";
import { TransactionRowThumb } from "./transaction-row.thumb";
import { TransactionsCardThumb } from "./transactions-card.thumb";
import { PaymentsCardThumb } from "./payments-card.thumb";
import { DailyGoalCardThumb } from "./daily-goal-card.thumb";
import { PreferencesCardThumb } from "./preferences-card.thumb";
import { UpgradePlanCardThumb } from "./upgrade-plan-card.thumb";
import { SignUpCardThumb } from "./sign-up-card.thumb";
import { MemberRowThumb } from "./member-row.thumb";
import { TeamCardThumb } from "./team-card.thumb";
import { ShareCardThumb } from "./share-card.thumb";
import { CalendarCardThumb } from "./calendar-card.thumb";
import { ChatCardThumb } from "./chat-card.thumb";
import { ActivityCardThumb } from "./activity-card.thumb";
import { ChartCardThumb } from "./chart-card.thumb";
import { AppFrameThumb } from "./app-frame.thumb";

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
  "donut-chart": DonutChartThumb,
  "chart-grid": ChartGridThumb,
  "chart-legend": ChartLegendThumb,
  "chart-tooltip": ChartTooltipThumb,
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
  "stat-card": StatCardThumb,
  "goals-card": GoalsCardThumb,
  "invest-card": InvestCardThumb,
  "limit-card": LimitCardThumb,
  "transaction-row": TransactionRowThumb,
  "transactions-card": TransactionsCardThumb,
  "payments-card": PaymentsCardThumb,
  "daily-goal-card": DailyGoalCardThumb,
  "preferences-card": PreferencesCardThumb,
  "upgrade-plan-card": UpgradePlanCardThumb,
  "sign-up-card": SignUpCardThumb,
  "member-row": MemberRowThumb,
  "team-card": TeamCardThumb,
  "share-card": ShareCardThumb,
  "calendar-card": CalendarCardThumb,
  "chat-card": ChatCardThumb,
  "activity-card": ActivityCardThumb,
  "chart-card": ChartCardThumb,
  "app-frame": AppFrameThumb,
};
