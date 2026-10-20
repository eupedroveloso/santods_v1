import { Skeleton as S } from "@/lib/ui/skeleton";
import { ThumbFrame } from "@/lib/ui/thumb-frame";

/** Padrao sem caixa ao lado da variante tonal opcional. */
export function IconTileThumb() {
  return (
    <ThumbFrame pad="md">
      <div className="flex justify-center gap-xs">
        {/* plain (padrao): so o icone no slot, sem caixa */}
        <div className="flex h-lg w-xs items-center justify-center">
          <S.Circle size="xs" tone="emphasis" />
        </div>
        <S.Block w="xs" h="lg" className="items-center justify-center">
          <S.Block w="2xs" h="xs" tone="strong" />
        </S.Block>
      </div>
    </ThumbFrame>
  );
}
