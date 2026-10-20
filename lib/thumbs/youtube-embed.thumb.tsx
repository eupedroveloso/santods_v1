import { Skeleton as S } from "@/lib/ui/skeleton";
import { ThumbFrame } from "@/lib/ui/thumb-frame";

/** Quadro 16:9 com o play no centro. */
export function YouTubeEmbedThumb() {
  return (
    <ThumbFrame pad="sm">
      <S.Block h="4xl" tone="strong" className="items-center justify-center">
        <S.Circle size="md" tone="emphasis" />
      </S.Block>
    </ThumbFrame>
  );
}
