import { Skeleton as S } from "@/lib/ui/skeleton";
import { ThumbFrame } from "@/lib/ui/thumb-frame";

export function AxisLabelsThumb() {
  return (
    <ThumbFrame>
      <S.Line points={[3, 5, 4, 6, 5, 7, 8]} />
      <S.Rule />
      <div className="flex justify-between">
        <S.Bar w="2xs" size="sm" tone="strong" />
        <S.Bar w="2xs" size="sm" tone="strong" />
        <S.Bar w="2xs" size="sm" tone="strong" />
        <S.Bar w="2xs" size="sm" tone="strong" />
        <S.Bar w="2xs" size="sm" tone="strong" />
      </div>
    </ThumbFrame>
  );
}
