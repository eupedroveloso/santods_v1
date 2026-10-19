import { Skeleton as S } from "@/lib/ui/skeleton";
import { ThumbFrame } from "@/lib/ui/thumb-frame";

export function LineChartThumb() {
  return (
    <ThumbFrame>
      <S.Bar w="md" tone="strong" />
      <S.Line points={[2, 4, 3, 6, 5, 8, 7, 9]} />
    </ThumbFrame>
  );
}
