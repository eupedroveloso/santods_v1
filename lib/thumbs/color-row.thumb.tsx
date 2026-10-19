import { Skeleton as S } from "@/lib/ui/skeleton";
import { ThumbFrame } from "@/lib/ui/thumb-frame";

export function ColorRowThumb() {
  return (
    <ThumbFrame>
      <S.Row>
        <S.Block w="2xs" h="md" tone="soft" outline />
        <S.Bar w="md" />
        <div className="ml-auto">
          <S.Bar w="xs" size="sm" tone="strong" />
        </div>
      </S.Row>
      <S.Row>
        <S.Block w="2xs" h="md" tone="strong" outline />
        <S.Bar w="md" />
        <div className="ml-auto">
          <S.Bar w="xs" size="sm" tone="strong" />
        </div>
      </S.Row>
      <S.Row divider={false}>
        <S.Block w="2xs" h="md" tone="emphasis" outline />
        <S.Bar w="sm" />
        <div className="ml-auto">
          <S.Bar w="xs" size="sm" tone="strong" />
        </div>
      </S.Row>
    </ThumbFrame>
  );
}
