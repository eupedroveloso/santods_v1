/**
 * Biblioteca de componentes do SantoDS.
 *
 * Regra unica e inegociavel: **nenhum componente daqui usa valor solto.** Cor,
 * espaco, raio, tipo, sombra, duracao e curva saem sempre de um token do Figma.
 * Se um componente precisar de algo que nao existe como token, o certo e criar
 * o token no Figma e sincronizar — nao inventar um px no meio do JSX.
 *
 * Documentacao viva em /componentes.
 */

export * as Icon from "./icons";

export { Button, IconButton } from "./button";
export type { ButtonProps, ButtonVariant, ControlSize, IconButtonProps } from "./button";
export { buttonClass } from "./button-class";

export { Input, Textarea, SearchInput, Field } from "./input";
export type { InputProps, TextareaProps, FieldProps } from "./input";

export { Tag, Chip, Count } from "./chip";
export type { ChipProps, Intent } from "./chip";

export { Card, CardHeader, CardFooter, Stat, Divider } from "./card";
export { CardGrid } from "./card-grid";
export type { CardGridBreakpoint, CardGridColumns } from "./card-grid";
export type { CardVariant, CardPadding, CardRadius } from "./card";

export { Swatch } from "./swatch";
export { SwatchPicker } from "./swatch-picker";
export { ColorRow } from "./color-row";
export type { SwatchSize } from "./swatch";

export { ColorPicker } from "./color-picker";
export * as Color from "./color";

export { NumberField } from "./number-field";

export { Disclosure } from "./disclosure";

export { Segmented, TabBar } from "./segmented";
export type { Segment } from "./segmented";

export { LineChart, AreaChart, BarChart, StackedAreaChart, DonutChart } from "./chart";
export type { ChartProps, ChartSeries, ChartHeight, DonutDatum, DonutSize } from "./chart";
export { AxisLabels } from "./chart-axis";
export { ChartGrid } from "./chart-grid";
export { ChartLegend } from "./chart-legend";
export type { ChartLegendItem, ChartLegendMark } from "./chart-legend";
export { ChartTooltip } from "./chart-tooltip";
export type { ChartTooltipRow, ChartKeyMark } from "./chart-tooltip";
export { CHART_TONES, type ChartTone, type ChartSurface } from "./chart-kit";

export { Avatar, AvatarGroup, Table } from "./data";
export { Calendar } from "./calendar";
export type { Column, CellRow, ColumnWidth } from "./data";

export { Checkbox, Radio, Switch, SettingRow } from "./toggle";

export { Select } from "./listbox";
export type { SelectOption } from "./listbox";

export { ChatBubble, ChatHeader, ChatAttachment, ChatComposer, TypingIndicator } from "./chat";

export { ActivityItem, Marker, Ticker } from "./feed";

export { SidebarNav, NavSection, NavSub, NavItem, NavUser, Pagination } from "./nav";

export { Kbd } from "./kbd";
export { CopyButton } from "./copy-button";
export { CopyCode } from "./copy-code";
export { CodeBlock } from "./code-block";
export { headingId, MarkdownView, markdownHeadings } from "./markdown-view";
export { Breadcrumb } from "./breadcrumb";
export type { Crumb } from "./breadcrumb";
export { LinkCard } from "./link-card";
export type { CardLink } from "./link-card";
export { CommandPalette } from "./command-palette";
export type { CommandItem } from "./command-palette";

export { Progress } from "./progress";
export { useModal } from "./use-modal";
export { useModKey } from "./use-mod-key";
export { DURATION, readDuration, usePresence, type MotionDuration } from "./motion";
export { KeyValue } from "./key-value";
export { Skeleton } from "./skeleton";
export type { SkeletonTone, SkeletonWidth, SkeletonHeight } from "./skeleton";
export { ThumbFrame } from "./thumb-frame";
export { Overline } from "./overline";
export { IconTile } from "./icon-tile";
export { EmptyState } from "./empty-state";
export { ListRow } from "./list-row";
export { RadioGroup, RadioCard } from "./radio-group";
export type { RadioCardOption } from "./radio-group";
export { TokenSample } from "./token-sample";
export type { TokenSampleVariant } from "./token-sample";
export { SearchTrigger } from "./search-trigger";
export { TableOfContents } from "./table-of-contents";
export type { TocItem } from "./table-of-contents";

// Blocos: cartoes prontos alimentados por dado — a tela de exemplo so os compoe.
export { StatCard } from "./stat-card";
export type { StatTrend, StatDetail } from "./stat-card";
export { GoalsCard, InvestCard, LimitCard, TransactionsCard, PaymentsCard } from "./finance-cards";
export type { Goal, Transaction, Payment, PaymentStatus } from "./finance-cards";
export {
  DailyGoalCard,
  PreferencesCard,
  UpgradePlanCard,
  SignUpCard,
  MemberRow,
  TeamCard,
  ShareCard,
  CalendarCard,
} from "./account-cards";
export type { Preference, PlanOption, AuthProvider, Member } from "./account-cards";
export { ChatCard, ActivityCard, ChartCard, AppFrame } from "./app-cards";
export type { ChatMessage, Activity, ChartRange, AppRailEntry, AppNavEntry } from "./app-cards";

// Registro de componentes (metadado puro) — as demos ficam em ./demos, so cliente.
export {
  components,
  getComponent,
  componentsByCategory,
  componentsByTier,
  CATEGORIES,
  CATEGORY_LABEL,
  TIERS,
  TIER_LABEL,
} from "./registry";
export type { ComponentMeta, ComponentCategory, ComponentTier, ComponentDemos, Demo, Playground, Control } from "./registry.types";
export { Ring, type RingSize, type RingTone } from "./ring";
export { Sparkline, type SparklineSize } from "./sparkline";
export { MiniBars, type MiniBarsSize } from "./mini-bars";
export { Fab, type FabPosition, type FabSize, type FabTone } from "./fab";
export { RailItem, RailNav } from "./rail-nav";
export { AppSidebar } from "./app-sidebar";
export { BrandLogo, BRAND_LOGOS, BRAND_MARKS, brandLogoFile, hasBrandLogo, hasBrandMark } from "./brand-logo";
export type { BrandId, BrandLogoSize } from "./brand-logo";
export { BrandSwitch } from "./brand-switch";
export { BrandCard } from "./brand-card";
export { DashboardHeader } from "./dashboard-header";
export { BreakdownCard } from "./breakdown-card";
export { DownloadList, formatBytes } from "./download-list";
export type { DownloadItem } from "./download-list";
export type { BreakdownItem } from "./breakdown-card";
export { TransactionRow } from "./transaction-row";
export type { BrandCardColor } from "./brand-card";
export { Rating } from "./rating";
export { CtaButton } from "./cta-button";
export { YouTubeEmbed, parseYouTubeId } from "./youtube-embed";
export { LandingPage, LandingHero, LandingOffer, SocialProofRow } from "./landing";
export { LandingHeader } from "./landing-header";
export { HeroCard, ShowcaseStrip, LogoStrip, SectionIntro, BentoGrid } from "./landing-sections";
export type { ShowcaseItem, IntroPart, BentoItem } from "./landing-sections";
export type { LandingNavLink } from "./landing-header";
export type { LandingPerson } from "./landing";
export { SocialProofToast } from "./social-proof-toast";
export type { BrandOption } from "./brand-switch";
export type { AppSidebarGroup, AppSidebarItem } from "./app-sidebar";

export { ProductHero, TestimonialGrid, LandingClosing } from "./product-landing";
export type { LandingTestimonial } from "./product-landing";

export { TaskAppPreview, TaskFeatureBento, TaskMetrics, TaskOnboarding, TASK_PREVIEW_TASKS } from "./task-showcase";
export type { TaskPreviewTask, TaskMetricItem, TaskOnboardingStep, TaskBentoProject, TaskBentoState, TaskBentoMessage } from "./task-showcase";
