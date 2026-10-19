import { Skeleton as S } from "@/lib/ui/skeleton";
import { ThumbFrame } from "@/lib/ui/thumb-frame";

export function TokenSampleThumb() {
  return (
    <ThumbFrame>
      <div className="flex flex-col">
        <S.Row>
          <S.Block w="xs" h="lg" tone="emphasis" outline />
          <div className="flex min-w-0 flex-1 flex-col gap-2xs">
            <S.Bar w="md" tone="strong" />
            <S.Bar w="sm" size="sm" />
          </div>
        </S.Row>
        <S.Row divider={false}>
          <S.Block w="xs" h="lg" tone="raised" outline />
          <div className="flex min-w-0 flex-1 flex-col gap-2xs">
            <S.Bar w="lg" tone="strong" />
            <S.Bar w="sm" size="sm" />
          </div>
        </S.Row>
      </div>
    </ThumbFrame>
  );
}
