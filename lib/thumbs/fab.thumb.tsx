import { Skeleton as S } from "@/lib/ui/skeleton";
import { ThumbFrame } from "@/lib/ui/thumb-frame";

export function FabThumb() {
  return (
    <ThumbFrame pad="sm">
      <S.Bar w="lg" tone="strong" />
      <S.Bar w="xl" size="sm" />
      <S.Bar w="lg" size="sm" />
      <div className="flex justify-end">
        <S.Button square float />
      </div>
    </ThumbFrame>
  );
}
