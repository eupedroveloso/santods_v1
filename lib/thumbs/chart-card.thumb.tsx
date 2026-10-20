import { Skeleton as S } from "@/lib/ui/skeleton";
import { ThumbFrame } from "@/lib/ui/thumb-frame";

export function ChartCardThumb() {
  return (
    <ThumbFrame pad="sm">
      <div className="flex items-center gap-xs">
        <S.Bar w="md" tone="strong" />
        <div className="ml-auto"><S.Chip w="sm" tone="soft" /></div>
      </div>
      <S.Line area points={[3, 5, 4, 6, 5, 7, 8, 7, 9]} />
    </ThumbFrame>
  );
}
