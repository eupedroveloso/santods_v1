import { Skeleton as S } from "@/lib/ui/skeleton";
import { ThumbFrame } from "@/lib/ui/thumb-frame";

/** Tres avatares sobrepostos (o primeiro em enfase) + a frase. */
export function SocialProofRowThumb() {
  return (
    <ThumbFrame pad="md">
      <div className="flex items-center justify-center gap-xs">
        <div className="flex">
          <S.Circle size="sm" tone="emphasis" ring />
          <S.Circle size="sm" ring />
          <S.Circle size="sm" ring />
        </div>
        <S.Bar w="lg" size="md" />
      </div>
    </ThumbFrame>
  );
}
