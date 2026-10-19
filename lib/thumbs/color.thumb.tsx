import { Skeleton as S } from "@/lib/ui/skeleton";
import { ThumbFrame } from "@/lib/ui/thumb-frame";

export function ColorThumb() {
  return (
    <ThumbFrame>
      <div className="flex gap-3xs">
        <S.Block w="fill" h="2xl" tone="raised" outline />
        <S.Block w="fill" h="2xl" tone="soft" />
        <S.Block w="fill" h="2xl" tone="base" />
        <S.Block w="fill" h="2xl" tone="strong" />
        <S.Block w="fill" h="2xl" tone="emphasis" />
      </div>
      <div className="flex justify-between">
        <S.Bar w="sm" size="sm" />
        <S.Bar w="xs" size="sm" tone="strong" />
      </div>
    </ThumbFrame>
  );
}
