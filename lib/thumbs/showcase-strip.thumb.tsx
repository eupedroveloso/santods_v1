import { Skeleton as S } from "@/lib/ui/skeleton";
import { ThumbFrame } from "@/lib/ui/thumb-frame";

/** Cartoes pequenos em arco: o do meio sobe (protagonista). */
export function ShowcaseStripThumb() {
  return (
    <ThumbFrame pad="sm">
      <div className="flex items-start justify-center gap-2xs">
        <S.Block w="sm" h="2xl" tone="soft" className="translate-y-sm" />
        <S.Block w="sm" h="2xl" tone="base" className="translate-y-xs" />
        <S.Block w="sm" h="2xl" tone="emphasis" />
        <S.Block w="sm" h="2xl" tone="base" className="translate-y-xs" />
        <S.Block w="sm" h="2xl" tone="soft" className="translate-y-sm" />
      </div>
    </ThumbFrame>
  );
}
