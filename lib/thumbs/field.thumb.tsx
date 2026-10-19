import { Skeleton as S } from "@/lib/ui/skeleton";
import { ThumbFrame } from "@/lib/ui/thumb-frame";

export function FieldThumb() {
  return (
    <ThumbFrame pad="md">
      <S.Bar w="sm" tone="strong" />
      <S.Field placeholder="md" caret />
      <S.Bar w="lg" size="sm" />
    </ThumbFrame>
  );
}
