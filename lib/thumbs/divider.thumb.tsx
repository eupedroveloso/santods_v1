import { Skeleton as S } from "@/lib/ui/skeleton";
import { ThumbFrame } from "@/lib/ui/thumb-frame";

export function DividerThumb() {
  return (
    <ThumbFrame pad="md">
      <S.Bar w="lg" tone="strong" />
      <S.Bar w="xl" size="sm" />
      <S.Rule emphasis />
      <S.Bar w="md" tone="strong" />
      <S.Bar w="lg" size="sm" />
    </ThumbFrame>
  );
}
