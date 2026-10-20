import { Skeleton as S } from "@/lib/ui/skeleton";
import { ThumbFrame } from "@/lib/ui/thumb-frame";

export function TaskMetricsThumb() {
  return <ThumbFrame pad="sm"><div className="flex items-start gap-2xs">{[0, 1, 2, 3].map((column) => <S.Block key={column} w="fill" h="3xl" tone={column === 0 ? "emphasis" : "base"} className={`flex-col gap-xs p-2xs ${column % 2 ? "mt-xs" : ""}`}><S.Bar w="full" size="lg" tone="raised" /><S.Bar w="full" size="sm" /></S.Block>)}</div></ThumbFrame>;
}
