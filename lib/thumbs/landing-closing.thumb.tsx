import { Skeleton as S } from "@/lib/ui/skeleton";
import { ThumbFrame } from "@/lib/ui/thumb-frame";

export function LandingClosingThumb() {
  return <ThumbFrame pad="sm">
    <div className="flex flex-1 flex-col items-center justify-center gap-xs"><S.Bar w="lg" size="md" tone="strong" /><S.Bar w="xl" size="sm" /><S.Button size="md" /></div>
    <S.Rule />
    <div className="flex items-center justify-between"><S.Circle size="xs" /><S.Bar w="sm" size="sm" /><S.Bar w="sm" size="sm" /></div>
  </ThumbFrame>;
}
