import { Skeleton as S } from "@/lib/ui/skeleton";
import { ThumbFrame } from "@/lib/ui/thumb-frame";

export function ThumbFrameThumb() {
  return (
    <ThumbFrame>
      <S.Block h="4xl" className="items-center justify-center">
        <S.Block w="md" elevated className="flex-col gap-2xs p-xs">
          <S.Bar w="sm" tone="emphasis" />
          <S.Bar w="fill" size="sm" />
        </S.Block>
      </S.Block>
    </ThumbFrame>
  );
}
