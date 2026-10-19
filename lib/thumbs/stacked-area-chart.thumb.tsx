import { Skeleton as S } from "@/lib/ui/skeleton";
import { ThumbFrame } from "@/lib/ui/thumb-frame";

export function StackedAreaChartThumb() {
  return (
    <ThumbFrame>
      <div className="flex items-center gap-xs">
        <S.Bar w="md" tone="strong" />
        <div className="ml-auto">
          <S.Chip w="sm" tone="soft" />
        </div>
      </div>
      <S.Line area points={[5, 6, 5, 7, 8, 7, 9, 10]} second={[2, 3, 2, 4, 4, 3, 5, 6]} />
    </ThumbFrame>
  );
}
