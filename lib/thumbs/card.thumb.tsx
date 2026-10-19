import { Skeleton as S } from "@/lib/ui/skeleton";
import { ThumbFrame } from "@/lib/ui/thumb-frame";

export function CardThumb() {
  return (
    <ThumbFrame pad="sm">
      <div className="flex items-center justify-between gap-xs">
        <S.Bar w="md" size="lg" tone="strong" />
        <S.Chip w="xs" tone="soft">
          <S.Bar w="2xs" size="sm" tone="strong" />
        </S.Chip>
      </div>
      <S.Block h="3xl" className="items-end gap-xs p-xs">
        <S.Bar w="sm" size="lg" tone="strong" />
        <div className="ml-auto">
          <S.MiniBars values={[2, 3, 2, 4, 3]} highlight={3} />
        </div>
      </S.Block>
    </ThumbFrame>
  );
}
