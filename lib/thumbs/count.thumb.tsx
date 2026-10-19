import { Skeleton as S } from "@/lib/ui/skeleton";
import { ThumbFrame } from "@/lib/ui/thumb-frame";

export function CountThumb() {
  return (
    <ThumbFrame pad="md">
      <S.Row divider={false}>
        <S.Bar w="md" tone="strong" />
        <S.Chip w="xs" tone="soft">
          <S.Bar w="2xs" size="sm" tone="emphasis" />
        </S.Chip>
      </S.Row>
      <S.Row divider={false}>
        <S.Bar w="sm" tone="strong" />
        <S.Chip w="xs" tone="soft">
          <S.Bar w="2xs" size="sm" tone="strong" />
        </S.Chip>
      </S.Row>
    </ThumbFrame>
  );
}
