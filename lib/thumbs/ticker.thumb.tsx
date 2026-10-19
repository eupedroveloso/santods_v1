import { Skeleton as S } from "@/lib/ui/skeleton";
import { ThumbFrame } from "@/lib/ui/thumb-frame";

export function TickerThumb() {
  return (
    <ThumbFrame>
      <S.Block h="xl" className="items-center gap-xs px-xs">
        <div className="flex items-center gap-2xs">
          <S.Bar w="xs" size="sm" tone="emphasis" />
          <S.Bar w="xs" size="sm" />
        </div>
        <S.Rule vertical />
        <div className="flex items-center gap-2xs">
          <S.Bar w="xs" size="sm" tone="strong" />
          <S.Bar w="xs" size="sm" />
        </div>
      </S.Block>
    </ThumbFrame>
  );
}
