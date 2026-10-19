import { Skeleton as S } from "@/lib/ui/skeleton";
import { ThumbFrame } from "@/lib/ui/thumb-frame";

export function SkeletonThumb() {
  return (
    <ThumbFrame>
      <S.Row divider={false}>
        <S.Circle size="lg" tone="emphasis" />
        <div className="flex flex-col gap-2xs">
          <S.Bar w="lg" tone="strong" />
          <S.Bar w="md" size="sm" />
        </div>
      </S.Row>
      <S.Block h="2xl" />
      <div className="flex gap-xs">
        <S.Bar w="fill" />
        <S.Bar w="sm" />
      </div>
    </ThumbFrame>
  );
}
