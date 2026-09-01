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

export { Input, Textarea, SearchInput, Field } from "./input";
export type { InputProps, TextareaProps, FieldProps } from "./input";

export { Tag, Chip, Count } from "./chip";
export type { ChipProps, Intent } from "./chip";

export { Card, CardHeader, Stat, Divider } from "./card";

export { Swatch, SwatchPicker, ColorRow } from "./swatch";
export type { SwatchSize } from "./swatch";

export { ColorPicker } from "./color-picker";
export * as Color from "./color";

export { NumberField } from "./number-field";

export { Disclosure } from "./disclosure";

export { Segmented, TabBar } from "./segmented";
export type { Segment } from "./segmented";

export { LineChart, AreaChart, BarChart, StackedAreaChart, AxisLabels } from "./chart";
export type { ChartProps } from "./chart";

export { Avatar, Table, Calendar } from "./data";
export type { Column } from "./data";

export { Checkbox, Radio, Switch, SettingRow } from "./toggle";

export { Select } from "./listbox";
export type { SelectOption } from "./listbox";

export { ChatBubble, ChatHeader, ChatAttachment, TypingIndicator } from "./chat";

export { ActivityItem, Marker, Ticker } from "./feed";

export { SidebarNav, NavSection, NavItem, NavUser, Pagination } from "./nav";
