import { Skeleton as S } from "@/lib/ui/skeleton";
import { ThumbFrame } from "@/lib/ui/thumb-frame";

export function NavSubThumb() {
  return (
    <ThumbFrame pad="sm">
      <S.Block tone="sunken" track className="flex-col gap-3xs">
        <S.Row divider={false}>
          <S.Circle size="xs" />
          <S.Bar w="md" tone="strong" />
        </S.Row>
        <div className="flex gap-xs pl-2xs">
          <S.Rule vertical />
          <div className="flex min-w-0 flex-1 flex-col gap-3xs">
            <S.Row divider={false}>
              <S.Bar w="md" />
            </S.Row>
            <S.Row divider={false} active>
              <S.Bar w="lg" tone="emphasis" />
            </S.Row>
            <S.Row divider={false}>
              <S.Bar w="sm" />
            </S.Row>
          </div>
        </div>
      </S.Block>
    </ThumbFrame>
  );
}
