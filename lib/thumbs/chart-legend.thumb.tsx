import { Skeleton as S } from "@/lib/ui/skeleton";
import { ThumbFrame } from "@/lib/ui/thumb-frame";

export function ChartLegendThumb() {
  return (
    <ThumbFrame pad="md">
      <div className="flex items-center gap-sm">
        <div className="flex items-center gap-2xs">
          <S.Block w="2xs" h="xs" tone="emphasis" />
          <S.Bar w="xs" size="sm" />
        </div>
        <div className="flex items-center gap-2xs">
          <S.Block w="2xs" h="xs" tone="strong" />
          <S.Bar w="xs" size="sm" />
        </div>
      </div>
      <S.Bars values={[3, 5, 4, 6, 5, 7]} />
    </ThumbFrame>
  );
}
