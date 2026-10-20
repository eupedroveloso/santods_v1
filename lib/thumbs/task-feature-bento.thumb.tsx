import { Skeleton as S } from "@/lib/ui/skeleton";
import { ThumbFrame } from "@/lib/ui/thumb-frame";

export function TaskFeatureBentoThumb() {
  return <ThumbFrame pad="sm"><div className="grid grid-cols-3 gap-2xs"><S.Block h="xl" /><S.Block h="xl" tone="base" /><S.Block h="4xl" tone="strong" className="row-span-2" /><S.Block h="xl" tone="emphasis" /><S.Block h="xl" tone="base" /></div></ThumbFrame>;
}
