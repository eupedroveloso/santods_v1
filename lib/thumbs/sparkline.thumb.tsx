import { Skeleton as S } from "@/lib/ui/skeleton";
import { ThumbFrame } from "@/lib/ui/thumb-frame";

export function SparklineThumb() {
  return (
    <ThumbFrame pad="md">
      <div className="flex items-center gap-sm">
        <div className="flex flex-col gap-2xs">
          <S.Bar w="sm" size="sm" />
          <S.Bar w="md" size="lg" tone="strong" />
        </div>
        <div className="min-w-0 flex-1">
          <S.Line spark points={[3, 5, 4, 6, 5, 8, 7, 9]} />
        </div>
      </div>
    </ThumbFrame>
  );
}
