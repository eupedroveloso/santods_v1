import { Skeleton as S } from "@/lib/ui/skeleton";
import { ThumbFrame } from "@/lib/ui/thumb-frame";

export function IconThumb() {
  return (
    <ThumbFrame pad="md">
      <div className="grid grid-cols-4 place-items-center gap-sm">
        <S.Circle size="md" />
        <S.Block w="2xs" h="md" tone="emphasis" />
        <S.Block w="2xs" h="md" tone="strong" />
        <S.Circle size="md" />
        <S.Block w="2xs" h="md" tone="strong" />
        <S.Block w="2xs" h="md" tone="strong" />
        <S.Circle size="md" />
        <S.Block w="2xs" h="md" tone="strong" />
      </div>
    </ThumbFrame>
  );
}
