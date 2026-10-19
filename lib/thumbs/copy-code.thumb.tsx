import { Skeleton as S } from "@/lib/ui/skeleton";
import { ThumbFrame } from "@/lib/ui/thumb-frame";

export function CopyCodeThumb() {
  return (
    <ThumbFrame>
      <S.Block h="xl" className="items-center gap-xs px-xs">
        <S.Bar w="lg" tone="strong" />
        <div className="ml-auto">
          <S.Button size="sm" square />
        </div>
      </S.Block>
    </ThumbFrame>
  );
}
