import { Skeleton as S } from "@/lib/ui/skeleton";
import { ThumbFrame } from "@/lib/ui/thumb-frame";

export function NavItemThumb() {
  return (
    <ThumbFrame pad="sm">
      <S.Block tone="sunken" track className="flex-col gap-3xs">
        <S.Row divider={false} active>
          <S.Circle size="xs" tone="emphasis" />
          <S.Bar w="md" tone="strong" />
        </S.Row>
        <S.Row divider={false}>
          <S.Circle size="xs" tone="base" />
          <S.Bar w="fill" />
          <S.Chip w="xs" tone="raised">
            <S.Bar w="2xs" size="sm" tone="strong" />
          </S.Chip>
        </S.Row>
        <S.Row divider={false}>
          <S.Circle size="xs" tone="base" />
          <S.Bar w="sm" />
        </S.Row>
      </S.Block>
    </ThumbFrame>
  );
}
