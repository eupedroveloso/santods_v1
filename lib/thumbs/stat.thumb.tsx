import { Skeleton as S } from "@/lib/ui/skeleton";
import { ThumbFrame } from "@/lib/ui/thumb-frame";

export function StatThumb() {
  return (
    <ThumbFrame pad="md">
      <S.Bar w="sm" size="sm" />
      <div className="flex items-center gap-xs">
        <div className="flex min-w-0 flex-1 items-end gap-2xs">
          <S.Bar w="lg" size="lg" tone="strong" />
          <S.Bar w="xs" size="sm" />
        </div>
        <S.Ring value={68} />
      </div>
    </ThumbFrame>
  );
}
