import { Skeleton as S } from "@/lib/ui/skeleton";
import { ThumbFrame } from "@/lib/ui/thumb-frame";

export function TestimonialGridThumb() {
  return <ThumbFrame pad="sm">
    <div className="flex gap-3xs"><S.Circle size="xs" tone="emphasis" /><S.Circle size="xs" /><S.Circle size="xs" /></div>
    <S.Bar w="lg" size="md" tone="strong" />
    <div className="flex flex-col gap-3xs"><S.Bar w="full" size="sm" /><S.Bar w="full" size="sm" /><S.Bar w="lg" size="sm" /></div>
    <div className="flex items-center gap-2xs"><S.Circle size="sm" /><div className="flex flex-col gap-3xs"><S.Bar w="sm" size="sm" tone="strong" /><S.Bar w="md" size="sm" /></div></div>
  </ThumbFrame>;
}
