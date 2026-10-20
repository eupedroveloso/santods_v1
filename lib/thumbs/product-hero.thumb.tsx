import { Skeleton as S } from "@/lib/ui/skeleton";
import { ThumbFrame } from "@/lib/ui/thumb-frame";

export function ProductHeroThumb() {
  return <ThumbFrame pad="sm">
    <div className="flex items-center justify-between"><S.Circle size="xs" /><S.Bar w="sm" size="sm" /><S.Button size="sm" /></div>
    <div className="flex flex-col items-center gap-3xs"><S.Bar w="lg" size="sm" tone="strong" /><S.Bar w="md" size="sm" /><S.Bar w="xl" size="sm" /></div>
    <S.Block tone="sunken" h="xl" className="flex-1 gap-2xs p-2xs"><S.Block tone="raised" className="flex-1" /><S.Block tone="raised" className="flex-1" /><S.Block tone="raised" className="flex-1" /></S.Block>
  </ThumbFrame>;
}
