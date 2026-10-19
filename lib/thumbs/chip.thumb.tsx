import { Skeleton as S } from "@/lib/ui/skeleton";
import { ThumbFrame } from "@/lib/ui/thumb-frame";

export function ChipThumb() {
  return (
    <ThumbFrame pad="md">
      <div className="flex flex-wrap justify-center gap-2xs">
        <S.Chip w="md" tone="emphasis">
          <S.Bar w="sm" size="sm" tone="soft" />
        </S.Chip>
        <S.Chip w="sm" tone="soft">
          <S.Bar w="xs" size="sm" tone="strong" />
        </S.Chip>
        <S.Chip w="md" tone="soft">
          <S.Bar w="sm" size="sm" tone="strong" />
        </S.Chip>
      </div>
    </ThumbFrame>
  );
}
