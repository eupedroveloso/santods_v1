import { Skeleton as S } from "@/lib/ui/skeleton";
import { ThumbFrame } from "@/lib/ui/thumb-frame";

export function BarChartThumb() {
  return (
    <ThumbFrame>
      <S.Bar w="md" tone="strong" />
      <S.Bars values={[3, 5, 4, 7, 6, 8, 5]} highlight={5} />
    </ThumbFrame>
  );
}
