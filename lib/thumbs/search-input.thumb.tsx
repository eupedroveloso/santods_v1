import { Skeleton as S } from "@/lib/ui/skeleton";
import { ThumbFrame } from "@/lib/ui/thumb-frame";

export function SearchInputThumb() {
  return (
    <ThumbFrame>
      <S.Field leading={<S.Circle size="xs" />} placeholder="md" caret />
      <S.Row>
        <S.Bar w="lg" />
      </S.Row>
      <S.Row divider={false}>
        <S.Bar w="md" />
      </S.Row>
    </ThumbFrame>
  );
}
