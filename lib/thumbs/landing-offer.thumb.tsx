import { Skeleton as S } from "@/lib/ui/skeleton";
import { ThumbFrame } from "@/lib/ui/thumb-frame";

/** Avatares + contagem, CTA largo, avaliacao. */
export function LandingOfferThumb() {
  return (
    <ThumbFrame pad="md">
      <div className="flex flex-col items-center gap-xs">
        <div className="flex items-center gap-2xs">
          <div className="flex">
            <S.Circle size="sm" ring />
            <S.Circle size="sm" ring />
            <S.Circle size="sm" ring />
          </div>
          <S.Bar w="sm" size="sm" />
        </div>
        <S.Block tone="emphasis" h="md" />
        <S.Bar w="sm" size="sm" />
      </div>
    </ThumbFrame>
  );
}
