import { Skeleton as S } from "@/lib/ui/skeleton";
import { ThumbFrame } from "@/lib/ui/thumb-frame";

export function EmptyStateThumb() {
  return (
    <ThumbFrame pad="md">
      <div className="flex flex-col items-center gap-xs">
        <S.Block w="xs" h="lg" className="items-center justify-center">
          <S.Circle size="xs" />
        </S.Block>
        <S.Bar w="md" tone="strong" />
        <S.Button size="sm" />
      </div>
    </ThumbFrame>
  );
}
