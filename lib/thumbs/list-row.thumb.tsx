import { Skeleton as S } from "@/lib/ui/skeleton";
import { ThumbFrame } from "@/lib/ui/thumb-frame";

export function ListRowThumb() {
  return (
    <ThumbFrame pad="sm">
      <div className="flex flex-col">
        <S.Row>
          <S.Block w="xs" h="lg" className="items-center justify-center">
            <S.Circle size="xs" tone="emphasis" />
          </S.Block>
          <div className="flex min-w-0 flex-1 flex-col gap-2xs">
            <S.Bar w="lg" tone="strong" />
            <S.Bar w="md" size="sm" />
          </div>
          <S.Button variant="soft" size="sm" square />
        </S.Row>
        <S.Row divider={false}>
          <S.Block w="xs" h="lg" className="items-center justify-center">
            <S.Circle size="xs" />
          </S.Block>
          <div className="flex min-w-0 flex-1 flex-col gap-2xs">
            <S.Bar w="md" tone="strong" />
            <S.Bar w="lg" size="sm" />
          </div>
          <S.Button variant="soft" size="sm" square />
        </S.Row>
      </div>
    </ThumbFrame>
  );
}
