import { Skeleton as S } from "@/lib/ui/skeleton";
import { ThumbFrame } from "@/lib/ui/thumb-frame";

export function AreaChartThumb() {
  return (
    <ThumbFrame>
      <S.Bar w="md" tone="strong" />
      <S.Line area points={[3, 4, 3, 5, 6, 5, 8, 9]} />
    </ThumbFrame>
  );
}
