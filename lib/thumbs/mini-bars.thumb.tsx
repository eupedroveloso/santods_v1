import { Skeleton as S } from "@/lib/ui/skeleton";
import { ThumbFrame } from "@/lib/ui/thumb-frame";

export function MiniBarsThumb() {
  return (
    <ThumbFrame pad="md">
      <div className="flex items-end justify-between gap-sm">
        <div className="flex flex-col gap-2xs">
          <S.Bar w="sm" size="sm" />
          <S.Bar w="md" size="lg" tone="strong" />
        </div>
        <S.MiniBars values={[2, 3, 2, 4, 3, 2, 3]} highlight={3} />
      </div>
    </ThumbFrame>
  );
}
