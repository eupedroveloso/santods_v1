import { Skeleton as S } from "@/lib/ui/skeleton";
import { ThumbFrame } from "@/lib/ui/thumb-frame";

export function SwatchThumb() {
  return (
    <ThumbFrame pad="md">
      <div className="flex justify-center gap-2xs">
        <S.Block w="xs" h="lg" tone="soft" outline />
        <S.Block w="xs" h="lg" tone="base" outline />
        <S.Block w="xs" h="lg" tone="strong" outline />
        <S.Block w="xs" h="lg" tone="emphasis" outline />
      </div>
    </ThumbFrame>
  );
}
