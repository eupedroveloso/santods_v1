import { Skeleton as S } from "@/lib/ui/skeleton";
import { ThumbFrame } from "@/lib/ui/thumb-frame";

/** Cinco marcas de nota (a protagonista em enfase) + a nota em badge. */
export function RatingThumb() {
  return (
    <ThumbFrame pad="md">
      <div className="flex items-center justify-center gap-xs">
        <div className="flex gap-3xs">
          <S.Circle size="xs" tone="emphasis" />
          <S.Circle size="xs" tone="strong" />
          <S.Circle size="xs" tone="strong" />
          <S.Circle size="xs" tone="strong" />
          <S.Circle size="xs" tone="soft" />
        </div>
        <S.Chip badge w="sm">
          <S.Bar w="xs" size="sm" tone="strong" />
        </S.Chip>
      </div>
    </ThumbFrame>
  );
}
