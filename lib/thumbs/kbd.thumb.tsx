import { Skeleton as S } from "@/lib/ui/skeleton";
import { ThumbFrame } from "@/lib/ui/thumb-frame";

export function KbdThumb() {
  return (
    <ThumbFrame pad="md">
      <div className="flex justify-center gap-2xs">
        <S.Block w="xs" h="lg" tone="soft" className="items-center justify-center">
          <S.Bar w="2xs" size="sm" tone="emphasis" />
        </S.Block>
        <S.Block w="xs" h="lg" tone="soft" className="items-center justify-center">
          <S.Bar w="2xs" size="sm" tone="strong" />
        </S.Block>
      </div>
    </ThumbFrame>
  );
}
