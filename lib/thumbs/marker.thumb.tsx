import { Skeleton as S } from "@/lib/ui/skeleton";
import { ThumbFrame } from "@/lib/ui/thumb-frame";

export function MarkerThumb() {
  return (
    <ThumbFrame pad="md">
      <S.Bar w="xl" />
      <div className="flex flex-wrap gap-2xs">
        <S.Chip w="md" tone="soft">
          <S.Block w="2xs" h="xs" tone="emphasis" />
          <S.Bar w="sm" size="sm" tone="strong" />
        </S.Chip>
        <S.Chip w="md" tone="soft">
          <S.Circle size="xs" tone="strong" />
          <S.Bar w="xs" size="sm" tone="strong" />
        </S.Chip>
      </div>
    </ThumbFrame>
  );
}
