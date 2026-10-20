import { Skeleton as S } from "@/lib/ui/skeleton";
import { ThumbFrame } from "@/lib/ui/thumb-frame";

/** Uma linha: logo, depois celulas separadas por hairline (cor de marca e o protagonista). */
export function BrandCardThumb() {
  return (
    <ThumbFrame pad="sm">
      <div className="flex items-center gap-2xs">
        <S.Bar w="sm" size="lg" tone="strong" />
        <S.Rule vertical />
        <S.Bar w="xs" size="lg" tone="base" />
        <S.Rule vertical />
        <S.Block w="xs" h="md" tone="emphasis" />
        <S.Rule vertical />
        <S.Block w="xs" h="md" tone="soft" outline />
        <S.Block w="xs" h="md" tone="strong" />
      </div>
    </ThumbFrame>
  );
}
