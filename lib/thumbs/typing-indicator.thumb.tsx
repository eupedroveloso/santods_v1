import { Skeleton as S } from "@/lib/ui/skeleton";
import { ThumbFrame } from "@/lib/ui/thumb-frame";

export function TypingIndicatorThumb() {
  return (
    <ThumbFrame pad="md">
      <div className="flex items-end gap-xs">
        <S.Circle size="lg" />
        <S.Block w="md" h="xl" radius="full" className="items-center justify-center gap-2xs">
          <S.Circle size="sm" tone="emphasis" />
          <S.Circle size="sm" tone="base" />
          <S.Circle size="sm" tone="base" />
        </S.Block>
      </div>
    </ThumbFrame>
  );
}
