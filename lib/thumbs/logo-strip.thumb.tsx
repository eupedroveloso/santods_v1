import { Skeleton as S } from "@/lib/ui/skeleton";
import { ThumbFrame } from "@/lib/ui/thumb-frame";

/** Nomes em cinza entre duas hairlines. */
export function LogoStripThumb() {
  return (
    <ThumbFrame pad="md">
      <S.Rule />
      <div className="flex items-center justify-center gap-xs">
        <S.Bar w="sm" size="md" tone="emphasis" />
        <S.Bar w="sm" size="md" />
        <S.Bar w="sm" size="md" />
      </div>
      <S.Rule />
    </ThumbFrame>
  );
}
