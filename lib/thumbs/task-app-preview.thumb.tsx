import { Skeleton as S } from "@/lib/ui/skeleton";
import { ThumbFrame } from "@/lib/ui/thumb-frame";

export function TaskAppPreviewThumb() {
  return <ThumbFrame pad="sm"><S.Row divider={false}><S.Circle size="xs" tone="emphasis" /><S.Bar w="sm" size="sm" /></S.Row><S.Rule /><div className="grid grid-cols-4 gap-2xs">{[0, 1, 2, 3].map((column) => <div key={column} className="flex flex-col gap-2xs"><S.Bar w="full" size="sm" /><S.Block h="xl" tone={column === 1 ? "emphasis" : "base"} /><S.Block h="lg" /></div>)}</div></ThumbFrame>;
}
