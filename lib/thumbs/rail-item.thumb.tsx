import { Skeleton as S } from "@/lib/ui/skeleton";
import { ThumbFrame } from "@/lib/ui/thumb-frame";

export function RailItemThumb() {
  return (
    <ThumbFrame pad="md">
      <div className="flex justify-center">
        <S.Block w="fit" tone="sunken" track className="gap-3xs">
          <S.Block w="xs" h="lg" elevated className="items-center justify-center">
            <S.Circle size="xs" tone="emphasis" />
          </S.Block>
          <div className="flex size-lg items-center justify-center">
            <S.Circle size="xs" tone="base" />
          </div>
        </S.Block>
      </div>
    </ThumbFrame>
  );
}
