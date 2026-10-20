import { Skeleton as S } from "@/lib/ui/skeleton";
import { ThumbFrame } from "@/lib/ui/thumb-frame";

/** Logo completa (simbolo + wordmark) ao lado da variante reduzida (mark). */
export function BrandLogoThumb() {
  return (
    <ThumbFrame pad="md">
      <div className="flex items-center justify-center gap-md">
        <div className="flex items-center gap-2xs">
          <S.Bar w="sm" size="lg" tone="strong" />
          <S.Bar w="md" size="lg" tone="emphasis" />
        </div>
        <S.Bar w="xs" size="lg" tone="strong" />
      </div>
    </ThumbFrame>
  );
}
