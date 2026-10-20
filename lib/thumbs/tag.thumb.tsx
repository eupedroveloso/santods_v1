import { Skeleton as S } from "@/lib/ui/skeleton";
import { ThumbFrame } from "@/lib/ui/thumb-frame";

export function TagThumb() {
  return (
    <ThumbFrame pad="md">
      <div className="flex flex-wrap justify-center gap-2xs">
        <S.Chip badge w="md" tone="soft">
          <S.Circle size="xs" tone="strong" />
          <S.Bar w="xs" size="sm" tone="strong" />
        </S.Chip>
        <S.Chip badge w="md" tone="base">
          <S.Circle size="xs" tone="emphasis" />
          <S.Bar w="sm" size="sm" tone="strong" />
        </S.Chip>
      </div>
    </ThumbFrame>
  );
}
