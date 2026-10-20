import { Skeleton as S } from "@/lib/ui/skeleton";
import { ThumbFrame } from "@/lib/ui/thumb-frame";

export function TabBarThumb() {
  return (
    <ThumbFrame pad="sm">
      <div className="flex">
        <S.Block w="fit" h="lg" tone="sunken" track className="items-center gap-xs">
          <S.Block w="sm" h="full" elevated className="items-center justify-center">
            <S.Bar w="xs" size="sm" tone="emphasis" />
          </S.Block>
          <S.Bar w="xs" size="sm" />
          <S.Bar w="xs" size="sm" />
        </S.Block>
      </div>
      <S.Block h="2xl" />
    </ThumbFrame>
  );
}
