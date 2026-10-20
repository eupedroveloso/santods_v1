import { Skeleton as S } from "@/lib/ui/skeleton";
import { ThumbFrame } from "@/lib/ui/thumb-frame";

export function ChartTooltipThumb() {
  return (
    <ThumbFrame pad="md">
      <div className="flex items-stretch justify-center gap-xs">
        <S.Rule vertical />
        <S.Block w="fit" elevated className="flex-col gap-2xs p-xs">
          <S.Bar w="xs" size="sm" />
          <div className="flex items-center gap-2xs">
            <S.Block w="2xs" h="xs" tone="emphasis" />
            <S.Bar w="sm" tone="strong" />
          </div>
          <div className="flex items-center gap-2xs">
            <S.Block w="2xs" h="xs" tone="strong" />
            <S.Bar w="xs" tone="base" />
          </div>
        </S.Block>
      </div>
    </ThumbFrame>
  );
}
