import { Skeleton as S } from "@/lib/ui/skeleton";
import { ThumbFrame } from "@/lib/ui/thumb-frame";

export function IconTileThumb() {
  return (
    <ThumbFrame pad="md">
      <div className="flex justify-center gap-xs">
        <S.Block w="xs" h="lg" className="items-center justify-center">
          <S.Circle size="xs" tone="emphasis" />
        </S.Block>
        <S.Block w="xs" h="lg" className="items-center justify-center">
          <S.Block w="2xs" h="xs" tone="strong" />
        </S.Block>
      </div>
    </ThumbFrame>
  );
}
