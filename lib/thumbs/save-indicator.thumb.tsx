import { Skeleton as S } from "@/lib/ui/skeleton";
import { ThumbFrame } from "@/lib/ui/thumb-frame";

/** Ícone + micro-texto, sozinho. */
export function SaveIndicatorThumb() {
  return (
    <ThumbFrame pad="md">
      <div className="flex items-center justify-center gap-2xs">
        <S.Circle size="xs" tone="emphasis" />
        <S.Bar w="sm" size="sm" />
      </div>
    </ThumbFrame>
  );
}
