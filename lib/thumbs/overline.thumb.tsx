import { Skeleton as S } from "@/lib/ui/skeleton";
import { ThumbFrame } from "@/lib/ui/thumb-frame";

export function OverlineThumb() {
  return (
    <ThumbFrame pad="md">
      <S.Bar w="sm" size="sm" tone="emphasis" />
      <S.Bar w="lg" size="lg" />
      <S.Bar w="xl" size="sm" tone="soft" />
    </ThumbFrame>
  );
}
