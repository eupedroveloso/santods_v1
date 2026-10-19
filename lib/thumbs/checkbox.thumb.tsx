import { Skeleton as S } from "@/lib/ui/skeleton";
import { ThumbFrame } from "@/lib/ui/thumb-frame";

export function CheckboxThumb() {
  return (
    <ThumbFrame pad="md">
      <S.Row divider={false}>
        <S.Check on />
        <S.Bar w="lg" />
      </S.Row>
      <S.Row divider={false}>
        <S.Check />
        <S.Bar w="md" />
      </S.Row>
    </ThumbFrame>
  );
}
