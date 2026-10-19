import { Skeleton as S } from "@/lib/ui/skeleton";
import { ThumbFrame } from "@/lib/ui/thumb-frame";

export function SelectThumb() {
  return (
    <ThumbFrame>
      <S.Field placeholder="md" trailing={<S.Block w="2xs" h="xs" tone="strong" />} />
      <S.Block elevated className="flex-col p-2xs">
        <S.Row divider={false} selected>
          <S.Bar w="md" tone="emphasis" />
        </S.Row>
        <S.Row divider={false}>
          <S.Bar w="lg" />
        </S.Row>
        <S.Row divider={false}>
          <S.Bar w="sm" />
        </S.Row>
      </S.Block>
    </ThumbFrame>
  );
}
