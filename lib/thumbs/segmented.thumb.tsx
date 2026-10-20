import { Skeleton as S } from "@/lib/ui/skeleton";
import { ThumbFrame } from "@/lib/ui/thumb-frame";

export function SegmentedThumb() {
  return (
    <ThumbFrame pad="md">
      <S.Block h="lg" tone="sunken" className="gap-3xs p-3xs">
        <S.Block w="fill" h="full" elevated className="items-center justify-center">
          <S.Bar w="xs" size="sm" tone="emphasis" />
        </S.Block>
        <div className="flex flex-1 items-center justify-center">
          <S.Bar w="xs" size="sm" />
        </div>
        <div className="flex flex-1 items-center justify-center">
          <S.Bar w="xs" size="sm" />
        </div>
      </S.Block>
    </ThumbFrame>
  );
}
