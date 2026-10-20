import { Skeleton as S } from "@/lib/ui/skeleton";
import { ThumbFrame } from "@/lib/ui/thumb-frame";

/** Tres cartoes alinhados ao topo, cada um com a altura do conteudo. */
export function CardGridThumb() {
  return (
    <ThumbFrame pad="sm">
      <div className="grid grid-cols-3 items-start gap-2xs">
        <S.Block h="xl" className="flex-col gap-2xs p-2xs">
          <S.Bar w="full" size="sm" />
          <S.Bar w="full" size="lg" tone="emphasis" />
        </S.Block>
        <S.Block h="4xl" className="flex-col gap-2xs p-2xs">
          <S.Bar w="full" size="sm" />
          <S.Bar w="full" size="lg" tone="strong" />
        </S.Block>
        <S.Block h="2xl" className="flex-col gap-2xs p-2xs">
          <S.Bar w="full" size="sm" />
          <S.Bar w="full" size="lg" tone="strong" />
        </S.Block>
      </div>
    </ThumbFrame>
  );
}
