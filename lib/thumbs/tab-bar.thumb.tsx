import { Skeleton as S } from "@/lib/ui/skeleton";
import { ThumbFrame } from "@/lib/ui/thumb-frame";

export function TabBarThumb() {
  return (
    <ThumbFrame pad="sm">
      <div className="flex">
        <S.Block w="fit" h="lg" tone="sunken" className="items-center gap-xs p-3xs pr-xs">
          <S.Chip w="sm" elevated>
            <S.Bar w="xs" size="sm" tone="emphasis" />
          </S.Chip>
          <S.Bar w="xs" size="sm" />
          <S.Bar w="xs" size="sm" />
        </S.Block>
      </div>
      <S.Block h="2xl" />
    </ThumbFrame>
  );
}
